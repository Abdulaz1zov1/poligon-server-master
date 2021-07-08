const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: {
        uz: {type: String, trim: true, required: true},
        ru: {type: String, trim: true, required: true},
    },
    slug: {type: String, required: true, unique: true, lowercase: true},
    parentId: {type:String}
})


// Cascade delete category when a product is deleted
CategorySchema.pre('remove', async function(next) {
    console.log(`Product being removed from category ${this._id}`);
    await this.model('Product').deleteMany({ category: this._id });
    await this.model('Category').deleteMany({ parentId: this._id });
    next();
});

module.exports = mongoose.model('Category', CategorySchema);
