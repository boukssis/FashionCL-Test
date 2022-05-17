const mongoose = require('mongoose')


const cacheSchema = new mongoose.Schema({
key:{
    type:String,
    required:true,
    unique:true
},

data:{
    type:String,
    required:true
},

ttl:{
    type:Number,
    
},

createdAt:{
    type:Number
}


})

module.exports=mongoose.model('cache',cacheSchema)