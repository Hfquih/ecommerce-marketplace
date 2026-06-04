const {StatusCodes} = require('http-status-codes')

const notFound = (req,res) => res.status(StatusCodes.NOT_FOUND).send('sorry, we dont found this route')

module.exports=notFound