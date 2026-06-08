const express = require('express')
const router = express.Router()
const {getAllOrder , getOrderDash , createOrder , getOrder , currentUserOrder , updateOrder , cancelOrder , deleteItemOrder ,sellerOffer , sellerOfferAdmin} = require('../controller/order')
const {requireAuth , authorization} = require('../middleware/auth')
const {createOrderSchema} = require('../zod/schema')
const validate = require('../zod/midZod')

router.get('/', requireAuth , authorization('admin') , getAllOrder)

router.get('/dashboard' , requireAuth ,authorization('admin') , getOrderDash)

router.post('/' , validate(createOrderSchema) , requireAuth , authorization('admin' , 'user') , createOrder)

router.get('/showAllMyOrders', requireAuth ,authorization('admin' , 'user') , currentUserOrder)

router.get('/sellerOffer' , requireAuth , authorization('admin' , 'seller') , sellerOffer)

router.get('/sellerOffer-admin/:id' , requireAuth , authorization('admin') , sellerOfferAdmin)

router.get('/:id' , requireAuth , authorization('admin' , 'user') , getOrder)

router.patch('/cancel-order/:id', requireAuth ,authorization('admin' , 'user') , cancelOrder)

router.patch('/:id' , requireAuth , authorization('admin') ,updateOrder)

router.delete('/:orderId/:itemId', requireAuth ,authorization('admin' , 'user') , deleteItemOrder)


module.exports=router