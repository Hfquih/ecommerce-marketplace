const express = require('express')
const router = express.Router()
const {sellerDashborad , adminDashboard} = require('../controller/dashboard')
const {requireAuth , authorization} = require('../middleware/auth')

router.get('/' , requireAuth , authorization('admin' , 'seller') ,sellerDashborad)

router.get('/admin-dashboard' , requireAuth , authorization('admin') , adminDashboard)

module.exports=router