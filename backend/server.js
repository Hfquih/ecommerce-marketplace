const app=require('./app')
const connect=require('./connect/connectDb')

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