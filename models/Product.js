const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({

    title:{
       uz: {
           type: String,
           maxlength: 150,
           required: [true, 'Please add a rus title for the product']
       },
        ru: {
            type: String,
            maxlength: 150,
            required: [true, 'Please add a rus title for the product']
        },
    },
    category:{
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
        required: true
    },
    company: {
        type: mongoose.Schema.ObjectId,
        ref: 'Company',
        required: true
    },
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    description: {
        uz: {
            type: String,
            required: true
        },
        ru: {
            type: String,
            required: true
        },
    },
    info: {
        uz: {
            type: String,
            required: true
        },
        ru: {
            type: String,
            required: true
        },
    },
    images:[
         {
            type: String,
            required: true
        }],
    price:{
        type: String,
        required: true
    },
    rating: {
      type: String,
      default: "0"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


// Cascade delete category when a product is deleted
ProductSchema.pre('remove', async function(next) {
    console.log(`Removed from Product ${this._id}`);
    await this.model('Comment').deleteMany({ product: this._id });
    next();
});

module.exports = mongoose.model('Product',ProductSchema)
