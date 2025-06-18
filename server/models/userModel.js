const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true,
    },
    creditBalance:{
        type:Number,
        default:5
    }
})

module.exports = mongoose.model("User",userSchema)
