const express = require("express");
const authControllers= require("../controllers/auth.controller");
const router = express.Router();

router.post("/register",authControllers.registerUsers);
router.post("/login",authControllers.loginUsers); 

module.exports =router;