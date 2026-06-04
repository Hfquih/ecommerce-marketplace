const Order = require('../connect/order')
const Product = require('../connect/products')
const User = require('../connect/user')
const StatusCodes = require('http-status-codes')


const sellerDashborad = async (req,res)=>{
    const totalOrders = await Order.countDocuments({'orderItem.seller': req.user._id})

    const totalProducts = await Product.countDocuments({createdBy:req.user._id})

    res.status(StatusCodes.OK).json({totalOrders , totalProducts})
}

const adminDashboard = async (req,res)=>{
    const totalUser = await User.countDocuments({role:'user'})

    const disabledUser = await User.countDocuments({isDeleted:true , role:'user'})

    const newUsersToday = await User.countDocuments({createdAt: {$gte: new Date().setHours(0,0,0,0)} , role:'user'})

    const totalSeller = await User.countDocuments({role:'seller'})

    const disabledSeller = await User.countDocuments({isDeleted:true , role:'seller'})

    const newSellersToday = await User.countDocuments({createdAt: {$gte: new Date().setHours(0,0,0,0)} , role:'seller'})

    const totalOrders = await Order.countDocuments({})

    const pendingOrders = await Order.countDocuments({status:'pending'})
    
    const deliveredOrders = await Order.countDocuments({status:'delivered'})

    const paidOrders = await Order.countDocuments({status:'paid'})

    const failedOrders = await Order.countDocuments({status:'failed'})

    const cancelledOrders = await Order.countDocuments({status:'canceled'})

    const totalProducts = await Product.countDocuments({})

    const activeProducts = await Product.countDocuments({status:'active'})

    const disabledProducts = await Product.countDocuments({status:'disabled'})

    const outOfStockProducts = await Product.countDocuments({status:'out_of_stock'})

    res.status(StatusCodes.OK).json({
        totalOrders , 
        pendingOrders,
        deliveredOrders,
        paidOrders,
        failedOrders,
        cancelledOrders,
        totalUser , 
        disabledUser , 
        newUsersToday , 
        totalSeller , 
        disabledSeller , 
        newSellersToday , 
        totalProducts,
        activeProducts,
        disabledProducts,
        outOfStockProducts,
    })
}

module.exports={
    sellerDashborad,
    adminDashboard
}
