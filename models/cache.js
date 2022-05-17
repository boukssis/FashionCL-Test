const mongoose = require('mongoose')
const randomStringGenerator = require("../helpers/randomStringGenerator");


const cacheSchema = new mongoose.Schema({
key:{
    type:String,
    required:true,
    unique:true
},

data:{
    type:String,
    default:randomStringGenerator(),
    required:true
},

ttl:{
    type:Number,
    
},

createdAt:{
    type:Number,
    default: Date.now
}


})

module.exports=mongoose.model('cache',cacheSchema)