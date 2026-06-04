const CustomAPIError = require('./customError')
const BadRequest = require('./badRequest')
const Unauthorized = require('./unauthicated')
const NotFound = require('./notFound')


module.exports={
    CustomAPIError,
    BadRequest,
    Unauthorized,
    NotFound
}