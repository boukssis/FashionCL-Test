const Cache = require('../models/cache')
const handleTtl = require('./handleTtl')

const handleStorageLimit = async(key,data)=>{

const totalCache = await Cache.countDocuments()
 

if(totalCache<process.env.MAX_LIMIT){

    //return false ==> cache storage does not exceed the limit 
    return false
}

/*
find the document with the least ttl 
we will replace the doc with the one that has the smallest TTL value
which is mean that its time expiration has ended or is about to end meaning its data will not be used(or soon)
so it makes sense to replace it 
*/
const cache =await Cache.find({}).sort({ttl:1}).findOne().exec()
 
if(!cache){
    return false
}

await cache.updateOne({
    key,
    data,
    ttl:handleTtl(),  
    createdAt:new Date().getTime()
})

return true


}

module.exports=handleStorageLimit




