const mongoose = require('mongoose')

const productSchema = new mongoose.Schema(
{
  name:{
    type: String,
    required:[true,'please provide a product name'],
    minlength:[3,'min length for name is 3'],
    maxlength:[50,'max length for name is 50'],
    trim:true
  },

  description:{
    type: String,
    required:[true,'please provide a description'],
    minlength:[20,'min length for description is 20'],
    maxlength:[3000,'max length for description is 3000']
  },

  price:{
    type:Number,
    required:[true,'please provide a price'],
    min:0
  },

  stock:{
    type:Number,
    required:[true,'please provide product stock'],
    min:0,
    default:0,
    required:[true , 'please provide how much you have in stock from this products']
  },

  image:{
    type:String,
    required:[true , 'please provide the image of the product']
  },

  category: {
    type: String,
    enum: [
      'console',
      'laptop',
      'setup',
      'accessory',
      'video_game'
    ],
    required: true
  },

  createdBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:[true,'Please provide user']
  },

  status: {
    type: String,
    enum: ['active', 'disabled', 'out_of_stock'],
    default: 'active'
  },

  isDeleted: {
    type: Boolean,
    default: false
  },

  deletedAt: {
    type: Date,
    default: null
  },

  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },

  sold:{
    type:Number,
    default:0,
    min:0
  },

  views:{
    type:Number,
    default:0,
    min:0
  }

},
{ timestamps:true }
)



module.exports=mongoose.model('product' , productSchema)