 const mongoose = require('mongoose')
 
 function ConnectDB(){
     mongoose.connect(`${process.env.MONGO_URL}/ink2image`)
 .then(()=>console.log("MongoDB connection successfull"));
 }

module.exports = ConnectDB;

