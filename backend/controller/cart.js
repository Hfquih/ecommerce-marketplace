const Cart = require('../connect/cart')
const Product = require('../connect/products')
const {BadRequest , NotFound} = require('../errors')
const {StatusCodes} = require('http-status-codes')

const createCart = async(req , res , next)=>{
    const {item:cartItem} = req.body

    if(!cartItem || cartItem.length<1){
        throw new BadRequest('incomplete information')
    }

    let items = []

    for(const item of cartItem){

        if (!item.amount || item.amount < 1) {
            throw new BadRequest('Please provide a valid amount (min 1)')
        }

        const productDb = await Product.findById(item.product)

        if(!productDb){
            throw new NotFound(`sorry, their is no product with id: ${item.product}`)
        }

        if(productDb.stock < item.amount){
            throw new BadRequest('Insufficient stock')
        }

        if(productDb.isDeleted || productDb.status==='disabled'){
            throw new NotFound('Product Unvailable')
        }

        const {_id} = productDb

        const singleCart = {
            amount: item.amount,
            product : _id,
        }
        items.push(singleCart)
    }

    let carts = await Cart.findOne({user:req.user._id})

    if(!carts){
        carts = await Cart.create({user:req.user._id ,items})
    }

    else{
        carts.items.push(...items)
        await carts.save()
    }
    

    res.status(StatusCodes.CREATED).json({carts})
}

const getCart = async (req,res,next)=>{
    const carts = await Cart.findOne({user : req.user._id}).populate('items.product')

    if(!carts){
        throw new NotFound(`Your Cart Is Empty`)
    }

    const cartAlert = carts.items.map((item)=>{
        
        const cartIssue = item.product.stock < item.amount

        return{
            ...item.toObject(),
            cartIssue,
            currentStock : item.product.stock
        }
    })

    res.status(StatusCodes.OK).json({
        carts:{...carts.toObject(),
        items:cartAlert
        }
    })
}

const updateCart = async (req,res,next)=>{
    const {id} = req.params
    const {itemCount} = req.body 


    const carts = await Cart.findOne({user : req.user._id})

    const items = carts.items.id(id)

    if(!items){
        throw new NotFound(`No order item with id: ${itemId}`)
    }

    items.amount = Number(itemCount)

    await carts.save()

    res.status(StatusCodes.OK).json({carts})
}

const deleteCart = async(req,res,next)=>{
    const {id} = req.params

    const carts = await Cart.findOne({user : req.user._id})

    const items = carts.items.id(id)

    if(!items){
        throw new NotFound(`No order item with id: ${itemId}`)
    }

    items.deleteOne()

    await carts.save()

    res.status(StatusCodes.OK).json({msg: 'Item deleted from cart'})
}

const clearCart = async (req,res,next)=>{
    const carts = await Cart.findOne({user : req.user._id})

    if(!carts){
        throw new NotFound('cart not found')
    }

    carts.items=[]

    await carts.save()
    
    res.status(StatusCodes.OK).json({msg: 'Cart cleared successfully'})
}

module.exports={createCart , getCart , updateCart , deleteCart , clearCart}