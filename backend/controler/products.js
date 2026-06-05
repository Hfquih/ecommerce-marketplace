const product = require('../connect/products')
const {BadRequest , NotFound} = require('../errors')
const {StatusCodes} = require('http-status-codes')


const getAllProductsAdmin=async(req,res)=>{
    const {category , status} = req.query

    const queryObject = {}

    if(category){
        queryObject.category=category
    }

    if(status){
        queryObject.status=status
    }

    const totalProducts = await product.countDocuments(queryObject)

    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 8
    const skip = (page-1) * limit 

    const products = await product.find(queryObject).skip(skip).limit(limit).sort('-createdAt')

    res.status(StatusCodes.OK).json({products , numOfPages: Math.ceil(totalProducts / limit)})
}

const getAllProductsCustomer = async(req,res)=>{
    const {category , filter , status , search , gtePrice , ltePrice} = req.query
    const queryObject = {}

    if(category){
        queryObject.category=category
    }

    if(search){
        queryObject.name={$regex : search , $options:'i'}
    }

    if(status==='active' || status==='out_of_stock'){
        queryObject.status=status
    }else{
        queryObject.status = {
            $in:['active','out_of_stock']
        }
    }

    if(gtePrice || ltePrice){
        queryObject.price = {};

        if(gtePrice){
            queryObject.price.$gte = Number(gtePrice);
        }

        if(ltePrice){
            queryObject.price.$lte = Number(ltePrice);
        }
    }

    let result = product.find({...queryObject , isDeleted:false})

    if(filter){
        const sortList = filter.split(',').join(' ')
        result = result.sort(sortList)
    }

    const totalProducts = await product.countDocuments({isDeleted:false ,...queryObject})

    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 12
    const skip = (page - 1) * limit 

    const products = await result.limit(limit).skip(skip)

    res.status(StatusCodes.OK).json({products , numOfPages: Math.ceil(totalProducts / limit)})
}

const getAllProducts=async(req,res,next)=>{
    const products=await product.find({createdBy:req.user._id , isDeleted:false})
    res.status(StatusCodes.OK).json({products})
}

const createProducts=async(req,res,next)=>{
    req.body.createdBy=req.user._id
    const products=await product.create(req.body)
    res.status(StatusCodes.CREATED).json({msg:'PRODUCT CREATED'})
}

const getProducts=async(req,res,next)=>{
    const { params:{id:productId}} = req

    const products = await product.findOneAndUpdate(
        {_id:productId , $or: [{status: 'active'}, {status: 'out_of_stock'}] , isDeleted:false} ,
        {$inc:{views:1}},
        {new:true , runValidators:true}
    )

    if(!products){
        throw new NotFound(`their is no product id who match: ${productId}`)
    }

    res.status(StatusCodes.OK).json({products})
}

const getProductSeller = async(req,res)=>{
    const { params:{id:productId}} = req

    const products = await product.findOne({_id:productId ,  $or: [{status: 'active'}, {status: 'out_of_stock'}]})

    if(!products){
        throw new NotFound(`their is no product id who match: ${productId}`)
    }

    res.status(StatusCodes.OK).json({products})
}

const updateProducts=async(req,res,next)=>{
    const { body:{name , description , price} , params:{id:productId} , user:{_id:userId} } = req 

    if(!name || !description || !price){
        throw new BadRequest('please provide all essentials information')
    }

    const products = await product.findOneAndUpdate({_id:productId , createdBy:userId} , req.body , {
        returnDocument: 'after' , runValidators:true
    })

    if(!products){
        throw new NotFound(`their is no product id who match: ${productId}`)
    }

    res.status(StatusCodes.OK).json({ msg:'PRODUCT UPDATED' , products})
}

const softDeleteProductsUser=async(req,res)=>{
    const {id:productId}=req.params

    const products = await product.findOneAndUpdate(
        {_id:productId , isDeleted:false , createdBy:req.user._id} , 
        {isDeleted:true , deletedAt:new Date() , deletedBy:req.user._id , status:'disabled'},
        {new:true , runValidators:true}
    )

    if(!products){
        throw new NotFound(`their is no product id who match: ${productId}`)
    }

    res.status(StatusCodes.OK).json({msg : 'PRODUCT DELETED'})
}

const softDeleteProductsAdmin=async(req,res)=>{
    const {id:productId}=req.params

    const products = await product.findOneAndUpdate(
        {_id:productId , isDeleted:false} , 
        {isDeleted:true , deletedAt:new Date() , deletedBy:req.user._id , status:'disabled'},
        {new:true , runValidators:true}
    )

    if(!products){
        throw new NotFound(`their is no product id who match: ${productId}`)
    }

    res.status(StatusCodes.OK).json({msg : 'PRODUCT DISABLED'})
}

const restoreProductsAdmin=async(req,res)=>{
    const {id:productId}=req.params

    const products = await product.findOneAndUpdate(
        {_id:productId , isDeleted:true} , 
        {isDeleted:false , deletedAt:null , deletedBy:null , status:'active'},
        {new:true , runValidators:true}
    )

    if(!products){
        throw new NotFound(`their is no product id who match: ${productId}`)
    }

    res.status(StatusCodes.OK).json({msg : 'PRODUCT RESTORED'})
}


module.exports={
    getAllProductsAdmin,
    getAllProductsCustomer,
    getAllProducts,
    createProducts,
    getProducts,
    getProductSeller,
    updateProducts,
    softDeleteProductsUser,
    softDeleteProductsAdmin,
    restoreProductsAdmin
}