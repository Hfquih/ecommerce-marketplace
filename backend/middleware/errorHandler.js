const {CustomAPIError}=require('../errors')
const {StatusCodes}=require('http-status-codes')

const errorHandler=(err,req,res,next)=>{
  console.log(err)
 let customError = {
      //set default
      statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
     msg: err.message || 'Something went wrong try again later',
   } 
 
   //if (err instanceof CustomAPIError) {
      //return res.status(err.statusCode).json({ msg: err.message })
    //}
 
   if (err.name === 'ValidationError') {
     const errors=Object.values(err.errors).map(item=>({
      field:item.path,
      msg:item.message
     }))
     customError.statusCode = 400
     return res.status(customError.statusCode).json({errors})
   }
   if (err.code && err.code === 11000 && err.keyPattern.email) {
     customError.msg = `Duplicate value entered for ${Object.keys(
       err.keyValue
     )} field, please choose another value`
     customError.statusCode = 400
     return res.status(customError.statusCode).json({errors:[{msg: customError.msg , field:'email'}]})
   }
   if (err.code && err.code === 11000 && err.keyPattern.phone) {
     customError.msg = `Duplicate value entered for ${Object.keys(
       err.keyValue
     )} field, please choose another value`
     customError.statusCode = 400
     return res.status(customError.statusCode).json({errors:[{msg: customError.msg , field:'phone'}]})
   }
   if (err.name === 'CastError') {
     customError.msg = `No item found with id : ${err.value}`
     customError.statusCode = 404
   }
 
   return res.status(customError.statusCode).json({ msg: customError.msg })
   //return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:{...err}})
}

module.exports=errorHandler