const express = require('express')
const router = express.Router()
const {createCart , getCart , updateCart , deleteCart , clearCart} = require('../controler/cart')
const {requireAuth , authorization} = require('../middlwear/auth')
const {addToCartSchema} = require('../zod/schema')
const validate = require('../zod/midZod')

router.post('/' , validate(addToCartSchema) , requireAuth , authorization('admin' , 'user') , createCart)

router.get('/' , requireAuth , authorization('admin' , 'user') , getCart)

router.patch('/:id', validate(addToCartSchema) , requireAuth , authorization('admin' , 'user') , updateCart)

router.delete('/:id' , requireAuth , authorization('admin' , 'user') ,deleteCart)

router.delete('/' , requireAuth , authorization('admin' , 'user') , clearCart)


module.exports = router