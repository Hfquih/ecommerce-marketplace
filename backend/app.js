require('dotenv').config()
require('express-async-errors')
require('./cleaner/user')
require('./cleaner/product')
require('./cleaner/order')

const express = require('express')
const app=express()
const user=require('./route/user')
const product=require('./route/products')
const order=require('./route/order')
const cart=require('./route/cart')
const dashboard=require('./route/dashboard')
const payment=require('./route/payment')
const support=require('./route/contact')
const connect=require('./connect/connectDb')
const notFound=require('./middleware/notFound')
const errorHandler=require('./middleware/errorHandler')

const cors=require('cors')
const xss=require('xss-clean')
const helmet=require('helmet')
const rateLimiter=require('express-rate-limit')

const fileUpload=require('express-fileupload')
const cloudinary=require('cloudinary')

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
})


app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE" , "PATCH"]
}))
app.use(xss())
app.use(helmet())
app.set('trust proxy' , 1)
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);


app.use(express.static('../public'))
app.use(express.json())
app.use(fileUpload({useTempFiles:true}))
app.use(express.urlencoded({extended:true}))
app.use('/api/v1/auth',user)
app.use('/api/v1/products' ,product)
app.use('/api/v1/order',order)
app.use('/api/v1/cart' , cart)
app.use('/api/v1/dashboard' , dashboard)
app.use('/api/v1/payement',payment)
app.use('/api/v1/support' , support)


app.use(errorHandler)
app.use(notFound)

const port = process.env.PORT || 5000

const start = async()=>{
    try{
        await connect(process.env.MONGO_URI)
        app.listen(port , console.log('server lestening'))
    }catch(error){
        console.log(error)
    }
}

start()