const mongoose  = require("mongoose");

async function connectDB() {
   try{
    console.log(process.env.MONGODB_URL);
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("the database is connected on the port number 3000");
   }
   catch (err){
    console.log("the error in connecting the data base" ,err)
}
}
module.exports = connectDB;