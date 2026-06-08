const express = require('express')
const route = express.Router()
const {getAllProductsAdmin , getAllProductsCustomer , getAllProducts , createProducts , getProducts , getProductSeller , updateProducts , softDeleteProductsUser , softDeleteProductsAdmin , restoreProductsAdmin} = require('../controller/products')
const {localImage} = require('../controller/imageUpload')
const {requireAuth , authorization}=require('../middleware/auth')
const {createProductSchema} = require('../zod/schema')
const validate = require('../zod/midZod')

route.get('/' , requireAuth , authorization('admin' , 'seller') ,getAllProducts)

route.get('/customer' , getAllProductsCustomer)

route.get('/admin' , requireAuth , authorization('admin') , getAllProductsAdmin)

route.post('/' , validate(createProductSchema) , requireAuth , authorization('admin' , 'seller'), createProducts)

route.get('/product-seller/:id' , requireAuth , authorization('admin' , 'seller') , getProductSeller)

route.get('/:id' , getProducts)

route.patch('/delete-product-user/:id' , requireAuth , authorization('admin' , 'seller') , softDeleteProductsUser)

route.patch('/delete-product-admin/:id' , requireAuth , authorization('admin') , softDeleteProductsAdmin)

route.patch('/restore-product-admin/:id' , requireAuth , authorization('admin') , restoreProductsAdmin)

route.patch('/:id' , validate(createProductSchema) , requireAuth, authorization('admin' , 'seller') ,updateProducts)

route.post('/upload', requireAuth, authorization('admin' , 'seller') ,localImage)

module.exports=route