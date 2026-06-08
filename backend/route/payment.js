const express=require('express')
const router = express.Router()
const stripePayement = require('../controler/payement')
const {requireAuth , authorization} = require('../middlwear/auth')
const {stripePaymentSchema} = require('../zod/schema')
const validate = require('../zod/midZod')

router.post('/stripePayement', validate(stripePaymentSchema) , requireAuth , authorization('admin' , 'user') , stripePayement)


module.exports=router