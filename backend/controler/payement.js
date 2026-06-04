const stripe = require('stripe')
const { StatusCodes } = require('http-status-codes')
const Order = require('../connect/order')
const {BadRequest , NotFound} = require('../errors')


const stripePayement = async(req,res)=>{
    const {item} = req.body

    const orderId = item[0].orderId

    const orders = await Order.findOne({_id:orderId , user:req.user._id}) 

    if(!orders){
        throw new NotFound(`No order found with id: ${orderId}`)
    }

    if(orders.status === 'paid'){
        throw new BadRequest('Order already paid') 
    }

    let line_items = []
        
        
    for(const product of orders.orderItem){
        line_items.push({
            price_data:{
                currency: "usd",
                product_data:{
                    name:product.name
                },
                unit_amount:product.price * 100
            },
            quantity:product.amount   
        })
    }
    
    line_items.push({
        price_data: {
            currency: 'usd',
            product_data: {
                name: 'Shipping Fee'
            },
            unit_amount: orders.shippingFee * 100
        },
        quantity: 1
    })    

    const session = await stripe.checkout.sessions.create({
        payment_method_types : ["card"],
        mode:"payment",
        line_items,

        metadata:{
            orderId: orders._id.toString(),
            userId: req.user._id.toString()
        },

        success_url:process.env.SUCCESS_PAYEMENT ,
        cancel_url:process.env.CANCEL_PAYEMENT
    })

    res.status(StatusCodes.OK).json({url:session.url})
}

module.exports=stripePayement