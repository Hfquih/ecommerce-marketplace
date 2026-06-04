const express = require('express')
const route = express.Router()
const {register , login , forgotPassword , resetPassword , verifyEmail , getAllUsers , getAllSellers , getUsers , updateUser , updateUserAdmin ,softdeleteUser , restoreUser} = require('../controler/user')

const {requireAuth , authorization}=require('../middlwear/auth')

const {registerSchema , loginSchema , resetPasswordSchema} = require('../zod/schema')
const validate = require('../zod/midZod')

route.post('/register' , validate(registerSchema) , register)

route.post('/login' , validate(loginSchema) , login)

route.post('/forgot-password' , forgotPassword)

route.post('/reset-password/:token' , validate(resetPasswordSchema) , resetPassword)

route.get('/verify-email/:token' , verifyEmail)

route.get('/' , requireAuth , authorization('admin') , getAllUsers)

route.get('/seller' , requireAuth , authorization('admin') , getAllSellers)

route.get('/:id' , requireAuth , authorization('admin' , 'user' , 'seller') , getUsers)

route.patch('/edit-user', validate(registerSchema) , requireAuth , authorization('admin' , 'user' , 'seller') , updateUser)

route.patch('/edit-user-admin/:id' , validate(registerSchema) , requireAuth , authorization('admin') , updateUserAdmin)

route.patch('/admin-delete/:id' , requireAuth , authorization('admin') , softdeleteUser)

route.patch('/restore-admin/:id' , requireAuth , authorization('admin') , restoreUser)


module.exports=route