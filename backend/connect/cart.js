const { default: mongoose } = require("mongoose")

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'product',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 1
  }
})

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'user',
    required: true,
    unique:true
  },
  items: [cartItemSchema]
})

module.exports = mongoose.model('cart' , cartSchema)