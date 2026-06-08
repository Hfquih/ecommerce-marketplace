const user=require('../connect/user')
const {BadRequest , Unauthorized , NotFound} = require('../errors')
const {StatusCodes} = require('http-status-codes')
const bcrypt=require('bcryptjs')
const crypto=require('crypto')
const nodemailer = require('nodemailer');



const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }
})

const register = async(req,res,next)=>{
    const users = await user.create(req.body)

    const verificationToken =crypto.randomBytes(32).toString('hex')

    const hashedToken = crypto.createHash('sha256').update(verificationToken).digest('hex')

    users.emailVerificationToken = hashedToken

    users.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000

    await users.save()

    const verifyURL = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`

    await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: users.email,
    subject: 'Verify Your Email',
    html: `
        <h2>Email Verification</h2>

        <p>Click the link below:</p>

        <a href="${verifyURL}">
            Verify Email
        </a>
    `
    })

    res.status(StatusCodes.CREATED).json({msg:'Account created. Please verify your email.'})
}

const verifyEmail = async(req,res)=>{
    const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex')

    const users = await user.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires:{
        $gt: Date.now()
    }
    })

    if(!users){
        throw new BadRequest('Invalid or expired token')
    }

    users.isVerified = true

    users.emailVerificationToken = undefined

    users.emailVerificationExpires = undefined

    await users.save()

    res.status(StatusCodes.OK).json({msg:'ACCOUNT VERIFIED'})
    
}

const login = async(req,res,next)=>{
    const {email , password} = req.body 

    if(!email || !password){
        throw new BadRequest('please provide all info')
    }

    const users = await user.findOne({email})

    if(!users){
        throw new Unauthorized('invalid credentials')
    }

    if(users.isDeleted){
      return res.status(403).json({
         msg:'Account has been deleted'
      });
   }

   if(!users.isVerified){
    throw new Unauthorized(
        'Please verify your email'
    )
}

    const isMatch = await users.comparePass(password)

    if(!isMatch){
        throw new Unauthorized('invalid credentials')
    }

    const token = users.createJWT()

    res.status(StatusCodes.OK).json({msg:`welcome ${users.firstName}` , token})
}

const getAllUsers = async (req,res,next)=>{

    const {filter} = req.query 

    const queryObject = {}

    if(filter==='deleted'){
        queryObject.isDeleted=true
    }

    if(filter==='today'){

      const startOfDay = new Date()

      startOfDay.setHours(0,0,0,0)

      queryObject.createdAt = {
         $gte:startOfDay 
      }
   }

   const totalUsers = await user.countDocuments({role:'user' , ...queryObject})

   const page = Number(req.query.page) || 1
   const limit = Number(req.query.limit) || 8
   const skip = (page-1) * limit 

   const users = await user.find({role:'user' , ...queryObject}).skip(skip).limit(limit)

   res.status(StatusCodes.OK).json({users , numOfPages: Math.ceil(totalUsers / limit)})
}

const getAllSellers = async (req,res,next)=>{

    const {filter} = req.query 

    const queryObject = {}

    if(filter==='deleted'){
        queryObject.isDeleted=true
    }

    if(filter==='today'){

      const startOfDay = new Date()

      startOfDay.setHours(0,0,0,0)

      queryObject.createdAt = {
         $gte:startOfDay
      }
   }

   const totalSeller = await user.countDocuments({role:'seller' , ...queryObject})

   const page = Number(req.query.page) || 1
   const limit = Number(req.query.limit) || 8
   const skip = (page-1) * limit 

   const users = await user.find({role:'seller' , ...queryObject}).skip(skip).limit(limit)

   res.status(StatusCodes.OK).json({users , numOfPages: Math.ceil(totalSeller / limit)})
}

const getUsers = async (req,res,next)=>{
    const {id:userId} = req.params 
    
    const users = await user.findOne({_id:userId})
    
    if(!users){
        throw new NotFound(`their is no user who have this id: ${userId}`)
    }

    res.status(StatusCodes.OK).json({users})
}

const updateUser = async (req,res,next)=>{
    if(req.body.password){
        const salt=await bcrypt.genSalt(10)
        req.body.password=await bcrypt.hash(req.body.password , salt)
    }

    const users = await user.findOneAndUpdate({_id:req.user._id} , req.body ,{
        new:true , runValidators:true 
    })

    if(!users){
        throw new NotFound(`their is no user who have this id: ${req.user._id}`)
    }

    res.status(StatusCodes.OK).json({msg:"USER UPDATED"})
}

const updateUserAdmin = async (req,res,next)=>{
    const {id:userId} = req.params

    if(req.body.password){
        const salt=await bcrypt.genSalt(10)
        req.body.password=await bcrypt.hash(req.body.password , salt)
    }

    const users = await user.findOneAndUpdate({_id:userId} , req.body ,{
        new:true , runValidators:true 
    })

    if(!users){
        throw new NotFound(`their is no user who have this id: ${userId}`)
    }

    res.status(StatusCodes.OK).json({msg:"USER UPDATED"})
}

const softdeleteUser = async(req,res)=>{
    const {id:userId} = req.params

    const deletedUser = await user.findOneAndUpdate(
        {_id:userId , isDeleted:false} , 
        {isDeleted:true , deletedAt:Date.now() , deletedBy:req.user._id , status:'disabled'} , 
        {new:true , runValidators:true }
    )

    if(!deletedUser){
        throw new NotFound(`their is no user with this id: ${userId}`)
    }

    res.status(StatusCodes.OK).json({msg:'USER DISABLED'})
}

const  restoreUser= async(req,res)=>{
    const {id:userId} = req.params

    const restoreUser = await user.findOneAndUpdate(
        {_id:userId , isDeleted:true} ,
        {isDeleted:false , deletedAt:null , deletedBy:null , status:'active'} , 
        {new:true , runValidators:true }
    )

    if(!restoreUser){
        throw new NotFound(`their is no user with this id: ${userId}`)
    }

    res.status(StatusCodes.OK).json({msg:'USER RESTORED'})
}

const forgotPassword = async (req , res)=>{
    const {email} = req.body

    const users = await user.findOne({email})

    if(!users){
        return res.status(200).json({msg:'If the account exists, a reset email has been sent'})
    }

    if(!users.isVerified){
        throw new Unauthorized('Please verify your email first')
    }

    const resetToken = crypto.randomBytes(32).toString('hex')

    const hashedToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')

    users.passwordResetToken = hashedToken

    users.passwordResetExpires = Date.now() + 10 * 60 * 1000

    await users.save()

    const resetURL =`${process.env.FRONTEND_URL}/reset-password/${resetToken}`

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: users.email,
        subject: 'Password Reset',
        html: `
        <h2>Password Reset</h2>

        <p>Click the link below:</p>

        <a href="${resetURL}">
            Reset Password
        </a>
        `
    })

    res.status(StatusCodes.OK).json({msg:'Reset email sent'})
}

const resetPassword = async (req,res)=>{
    let { password } = req.body

    if(password){
        const salt=await bcrypt.genSalt(10)
        password=await bcrypt.hash(password , salt)
    }

    const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex')

    const users = await user.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires:{
        $gt: Date.now()
    }
    })

    if(!users){throw new BadRequest('Invalid or expired token')}

    users.password = password

    users.passwordResetToken = undefined
    users.passwordResetExpires = undefined

    await users.save()

    res.status(StatusCodes.OK).json({msg:'Password updated successfully'})
}
 
module.exports={
    register,
    login,
    verifyEmail,
    forgotPassword,
    resetPassword,
    getAllUsers,
    getAllSellers,
    getUsers,
    updateUser,
    updateUserAdmin,
    softdeleteUser,
    restoreUser,
}