const {CustomAPIError} = require('../errors/custom-error')

const errorHandler = (err,req,res,next)=>{
if(err instanceof CustomAPIError){
   return res.status(err.statusCode).json({message:err.message})
}
    res.status(500).json({message:"server error:"+err})
}

module.exports=errorHandler