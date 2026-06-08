const order = require('../connect/order')
const product = require('../connect/products')
const Cart = require('../connect/cart')
const {StatusCodes} = require('http-status-codes')
const {BadRequest , NotFound} = require('../errors')
const {checkPermission} = require('../middleware/auth')
const { length } = require('zod')


const getAllOrder = async (req , res , next)=>{
    const {status , payement , date} = req.query

    const queryObject = {}

    if(status){
        queryObject.status=status 
    }

    if(payement){
        queryObject.shippingType=payement
    }

    let results = order.find(queryObject)

    if(date){
        const sortList = date.split(',').join(' ')
        results = results.sort(sortList)
    }

    const totalOrders = await order.countDocuments(queryObject)

    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 8
    const skip = (page-1) * limit 

    const orders = await results.limit(limit).skip(skip)

    res.status(StatusCodes.OK).json({orders , numOfPages: Math.ceil(totalOrders / limit)})
}

const getOrderDash = async (req,res)=>{
    const orders = await order.find({})
    res.status(StatusCodes.OK).json({orders})
}

const getShippingFee = (city) => {
      if (
        city === 'Sale' ||
        city === 'Rabat' ||
        city === 'Kenitra'
    ) {
      return 1;
    }

    if (
      city === 'Casablanca' ||
      city === 'El Jadida'
    ) {
      return 1.5;
    }

      return 2;
    };


const createOrder = async (req , res , next)=>{
    const {item:cartItem , shippingType , shippingAddress} = req.body 

    if(!cartItem || cartItem.length<1){
        throw new BadRequest('you have no order')
    }

    //if(!shippingType){
        //throw new BadRequest('please provide all shipping information')
    //}

    let orderItem = []
    let subtotal = 0
    const shippingFee = getShippingFee(shippingAddress.city);

    for(const item of cartItem){
        const productDb = await product.findOne(
            {_id : item.product , stock: {$gt: 0}}
        )

        if(!productDb){
            throw new BadRequest(`Product not found`)
        }

        if(item.amount > productDb.stock){
            throw new BadRequest(`Insufficent stock for product with id : ${item.product}`)
        }

        productDb.stock -= item.amount
        productDb.sold += item.amount

        if(productDb.stock===0){
            productDb.status='out_of_stock'
        }

        await productDb.save()
        
        const {name , image , price , _id , createdBy} = productDb

        const singleOrder = {
            amount:item.amount,
            name,
            image,
            price,
            product:_id,
            seller:createdBy
        }
        orderItem.push(singleOrder)
        subtotal += price * item.amount 
    }

    const total = subtotal + shippingFee

    const orders = await order.create({
        shippingFee,
        shippingType,
        total,
        orderItem,
        shippingAddress,
        status:'pending',
        user:req.user._id
    })
    
    if(shippingType==='cash on dilevery'){
        await Cart.updateOne({ user: req.user._id },{ $set: { items: [] } })
    }    
    
    res.status(StatusCodes.OK).json({msg: 'order created' , orders})
}

const getOrder = async (req , res , next)=>{
    //const {id:orderId} = req.params
    //const orders = await order.findOne({_id:orderId})

    const {id:userId} = req.params
    const orders = await order.find({user:userId})

    if(!orders){
        throw new NotFound(`their is no order id who match this: ${userId}`)
    }

    //checkPermission(req.user , orders.user)

    res.status(StatusCodes.OK).json({orders})
}

const currentUserOrder = async (req , res , next)=>{
    const {status} = req.query 

    const queryObject = {}

    if(status){
        queryObject.status = status
    }

    const orders = await order.find({...queryObject , user:req.user._id})

    if(!orders){
        throw new BadRequest(`the user with id ${req.user._id} has no order yet`)
    }

    res.status(StatusCodes.OK).json({orders})
}

const cancelOrder = async (req,res)=>{
    const {id:orderId} = req.params 

    const orders = await order.findOne({_id:orderId , user:req.user._id , status:'pending'})

    if(!orders){
        throw new NotFound(`their is no order id who match this: ${orderId}`)
    }

    orders.status = 'canceled'

    await orders.save()
    
    for(const item of orders.orderItem){
        const productDb = await product.findById(item.product)

        if(productDb){
            productDb.stock += item.amount
            productDb.sold -= item.amount

            if(productDb.stock>0){
                productDb.status='active'
            }

            await productDb.save()
        } 
    }

    res.status(StatusCodes.OK).json({msg : 'ORDER CANCELED'})
}

const deleteItemOrder = async(req,res)=>{
    const {orderId , itemId} = req.params 

    const orders = await order.findOne({_id:orderId , user:req.user._id , status:'pending'}) 

    if(!orders){
        throw new NotFound(`their is no order id who match this: ${orderId}`)
    }

    const item = orders.orderItem.id(itemId)

    if(!item){
        throw new NotFound(`No order item with id: ${itemId}`)
    }

    item.deleteOne()

    await orders.save()

    const productDb = await product.findById(item.product)

    if(productDb){
        productDb.stock += item.amount
        productDb.sold -= item.amount

        if(productDb.stock>0){
            productDb.status='active'
        }

        await productDb.save()
    }     

    res.status(StatusCodes.OK).json({msg : 'ITEM DELETED'})
}

const updateOrder = async (req , res , next)=>{
    const {id:orderId}=req.params

    const currentOrder = await order.findById(orderId)

    if(!currentOrder){
        throw new BadRequest(`their is no order id who match this: ${orderId}`)
    }

    if(currentOrder.status === req.body.status){
        throw new BadRequest(
            `Order status is already '${req.body.status}'`
        )
    }

    currentOrder.status = req.body.status 

    await currentOrder.save()

    res.status(StatusCodes.OK).json({msg:'ORDER UPDATED'})
}

const sellerOffer = async(req,res,next)=>{
    const {status} = req.query

    const queryObject = {}

    if(status){
        queryObject.status=status
    }

    const orders = await order.find({'orderItem.seller':req.user._id , ...queryObject})
    
    const results = orders.map((orderDoc)=>{
        const filterProduct = orderDoc.orderItem.filter((item)=>{
            return item.seller.toString()===req.user._id.toString()
        })

        const sellerTotal = filterProduct.reduce((sum , item)=>{
            return sum + item.price * item.amount
        },0)

        return{
            ...orderDoc.toObject(),
            orderItem:filterProduct,
            sellerTotal
        }  
    })

    res.status(StatusCodes.OK).json({results})
}

const sellerOfferAdmin = async (req,res)=>{
    const {id:sellerId} = req.params 

    const orders = await order.find({'orderItem.seller':sellerId})

    const results = orders.map((orderDoc)=>{
        const filterProducts = orderDoc.orderItem.filter((item)=>{
            return item.seller.toString() === sellerId.toString()
        })

        const totalSeller = filterProducts.reduce((sum , item)=>{
            return sum + item.price * item.amount
        },0)

        return{
            ...orderDoc.toObject(),
            orderItem:filterProducts,
            totalSeller
        }
    })
    res.status(StatusCodes.OK).json({results})
    
}
module.exports={
    getAllOrder,
    getOrderDash,
    createOrder,
    getOrder,
    currentUserOrder,
    updateOrder,
    cancelOrder,
    deleteItemOrder,
    sellerOffer,
    sellerOfferAdmin
}