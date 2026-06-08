const {StatusCodes} = require('http-status-codes')
const path=require('path')
const fs=require('fs')
const {BadRequest}=require('../errors')
const cloudinary = require('cloudinary').v2

const localImage = async(req,res,next)=>{
    if(!req.files){
        throw new BadRequest('No File Upload')
    }

    const productImage=req.files.image 

    if(!productImage.mimetype.startsWith('image')){
        throw new BadRequest('Please Upload Image')
    }

    const imageSize = 1024*1024

    if(productImage.size>imageSize){
        throw new BadRequest('please upload image less than 1mb')
    }

    const result = await cloudinary.uploader.upload(
        req.files.image.tempFilePath,
        {
            use_filename: true,
            folder: 'file-upload',
        }
    );
    fs.unlinkSync(req.files.image.tempFilePath);
    return res.status(StatusCodes.OK).json({ image: { src: result.secure_url } });
}

module.exports={
    localImage
}