const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const userModel = require("../models/user.model");
const aiService = require("../services/ai.service");
const messageModel = require("../models/message.model");
const { createMemory, queryMemory } = require("../services/vector.service");
const {
  chat,
} = require("@pinecone-database/pinecone/dist/assistant/data/chat");
const { text } = require("express");

async function initSocketServer(httpServer) {
  const io = new Server(httpServer, {});
  io.use(async (socket, next) => {
    const cookies = cookie.parse(socket.handshake.headers?.cookie || " ");

    if (!cookies.token) {
      next(new Error("Authentication error: No Token provided"));
    }
    try {
      const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET);
      const user = await userModel.findById(decoded.id);
      socket.user = user;
      next();
    } catch (err) {
      next(new Error("Authentication error: No Token provided"));
    }
  });
  io.on("connection", (socket) => {
    socket.on("ai-message", async (messagePayload) => {
      const userMessage = await messageModel.create({
        chat: messagePayload.chat,
        user: socket.user._id,
        content: messagePayload.content,
        role: "user",
      });
      const vectors = await aiService.generateVector(messagePayload.content);

      await createMemory({
        vectors,
        messageId: userMessage._id,
        metadata: {
          chat: messagePayload.chat,
          text: messagePayload.content,
          user: socket.user._id,
        },
      });

      const memory = await queryMemory({
        queryVector: vectors,
        limit: 3,
        metadata: {},
      });
      console.log(memory);
      const chatHistory = (
        await messageModel
          .find({
            chat: messagePayload.chat,
          })
          .sort({ createdAt: -1 })
          .limit(20)
          .lean()
      ).reverse();

      const stm = chatHistory.map((item) => {
        return {
          role: item.role,
          parts: [{ text: item.content }],
        };
      });
      const ltm = [
        {
          role: "user", // GenAI doesn't accept "system" role; present context as a user message
          parts: [
            {
              text: `Context (previous messages and memories): ${memory
                .map((item) => item.metadata.text)
                .join("\n")}`,
            },
          ],
        },
      ];

      console.log(ltm[0]);
      console.log(stm);
      const response = await aiService.generateResponse([...ltm, ...stm]);

      const responseVector = await aiService.generateVector(response);

      const responseMessage = await messageModel.create({
        chat: messagePayload.chat,
        user: socket.user._id,
        content: response,
        role: "model",
      });

      await createMemory({
        vectors: responseVector,
        messageId: responseMessage._id,
        metadata: {
          chat: messagePayload.chat,
          text: response,
          user: socket.user._id,
        },
      });

      socket.emit("ai-response", {
        content: response,
        chat: messagePayload.chat,
      });
    });
  });
}

module.exports = initSocketServer;
