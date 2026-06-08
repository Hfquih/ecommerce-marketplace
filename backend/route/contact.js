const express=require('express')
const router=express.Router()
const support=require('../controller/contact')
const {supportSchema} = require('../zod/schema')
const validate = require('../zod/midZod')

router.post('/' , validate(supportSchema) , support)

module.exports=router