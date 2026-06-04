const express = require('express')
const router = express.Router()
const {sellerDashborad , adminDashboard} = require('../controler/dashboard')
const {requireAuth , authorization} = require('../middlwear/auth')

router.get('/' , requireAuth , authorization('admin' , 'seller') ,sellerDashborad)

router.get('/admin-dashboard' , requireAuth , authorization('admin') , adminDashboard)

module.exports=router