const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const path = require('path')
const fs = require('fs')

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:[true , 'please provide a first name'],
        minlength:[3 , 'min length for first name is 3'],
        maxlength:[15 , 'max lentgth for first name is 15']
    },
    lastName:{
        type:String,
        required:[true , 'please provide a last name'],
        minlength:[3 , 'min length for last name is 3'],
        maxlength:[15 , 'max lentgth for last name is 15']
    },
    phone: {
        type: String,
        required: [true, 'please provide a phone number'],
        match: [/^(?:\+212|0)[5-7][0-9]{8}$/, 'please provide a valid phone number'],
        unique: true,
        trim: true
    },
    email:{
        type:String,
        required:[true , 'please provide an email'],
        match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please provide a valid email',
        ],
        unique:true
    },
    password:{
        type:String,
        required:[true , 'please provide a password'],
        minlength:[6 , 'min length for password is 6']
    },
    role:{
        type:String,
        enum:['admin' , 'seller' , 'user'],
        required:[true , 'please provide a role']
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    deletedAt:{
        type:Date,
        default:null
    },
    deletedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    status: {
        type: String,
        enum: ['active','disabled'],
        default:'active'
    },
    passwordResetToken:{
        type:String
    },
    passwordResetExpires:{
        type:Date
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    emailVerificationToken:String,
    emailVerificationExpires:Date
},
{ timestamps: true })


userSchema.pre('save' , async function(){

    if(!this.isModified('password')){
        return
    }

    const salt = await bcrypt.genSalt(10)
    this.password=await bcrypt.hash(this.password , salt)
})

const PRV_KEY= process.env.JWT_PRIVATE_KEY

userSchema.methods.createJWT=function(){
    return jwt.sign({userId:this._id , firstName:this.firstName , lastName:this.lastName , role:this.role} , PRV_KEY , {algorithm:'RS256' , expiresIn:'1d'})
}

userSchema.methods.comparePass=async function(userPass){
    const isMatch = await bcrypt.compare(userPass , this.password)
    return isMatch
}

module.exports=mongoose.model('user' , userSchema)