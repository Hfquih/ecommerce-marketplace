const mongoose = require('mongoose')

const orderItemSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    amount:{
        type:Number,
        required:true 
    },
    product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: true,
    },
    seller: {
        type: mongoose.Schema.ObjectId,
        ref: 'seller',
        required: true,
    },
})

const shippingAddressSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    minlength:[6 , 'minimum characters is 6'],
    maxlength:[30 , 'maximum characters is 30']
  },
  phone: {
    type: String,
    required: true,
    match: [/^(?:\+212|0)[5-7][0-9]{8}$/, 'please provide a valid phone number'],
  },
  emailAddress: {
    type: String,
    required: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please provide a valid email',
    ],
  },
  address: {
    type: String,
    required: true,
    minlength:[10 , 'minimum characters is 10'],
    maxlength:[50 , 'maximum characters is 50']
  },
  city: {
    type: String,
    required: true,
    enum: [
    'Casablanca',
    'Rabat',
    'Marrakech',
    'Tangier',
    'Fes',
    'Agadir',
    'Meknes',
    'Oujda',
    'Kenitra',
    'Tetouan',
    'Safi',
    'El Jadida',
    'Sale'
  ]
  },
  postalCode: {
    type: String
  }
})

const orderSchema = mongoose.Schema({
    shippingType:{
        type:String,
        required:true,
        enum:['cash on dilevery' , 'bank payement']
    },
    shippingFee:{
        type:Number,
        required:true
    },
    total: {
      type: Number,
      required: true,
    },
    orderItem : [orderItemSchema],
    shippingAddress: {
      type:shippingAddressSchema,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'failed', 'paid', 'delivered', 'canceled'],
      default: 'pending',
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    }
},
{ timestamps: true }
)

module.exports= mongoose.model('order' , orderSchema)