const express=require('express')
const router = express.Router()
const stripePayement = require('../controller/payment')
const {requireAuth , authorization} = require('../middleware/auth')
const {stripePaymentSchema} = require('../zod/schema')
const validate = require('../zod/midZod')

router.post('/stripePayement', validate(stripePaymentSchema) , requireAuth , authorization('admin' , 'user') , stripePayement)


module.exports=router