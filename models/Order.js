const mongoose = require('mongoose')

const OrderSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: true
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    number:{type: Number, required: true},
    companyId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Company',
        required: true
    },
    status: {type: Boolean, default: false},
    orderId: {type: Number, unique: true, default: Math.floor(Math.random() * 1000000000)},
    date: {type: Date, default: Date.now()}
})

module.exports = mongoose.model('Order',OrderSchema)
