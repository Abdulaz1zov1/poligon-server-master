const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema({
    author:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: true
    },
    comment:{type: String, required: true},
    status: {type: Boolean , default: false},
    parentId: {type: String},
    date: {type: Date, default: Date.now()}
})

module.exports = mongoose.model('Comment', CommentSchema)
