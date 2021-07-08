const mongoose = require('mongoose')

const CompanySchema = new mongoose.Schema({
    name: {type: String, required: true},
    image: {type: String, required: true},
    description: {
        uz: {type: String, required: true},
        ru: {type: String, required: true},
    },
    companyId: {
        type: Number,
        required: true,
        unique: true
    },
    location:{
      lat: {type: String, required: true},
      long: {type: String, required: true}
    },
    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
        required: true
    },
    director: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    address: {type: String},
    contact: {type: String},
    social:{
        telegram : {type: String, default: null},
        instagram : {type: String, default: null},
        facebook : {type: String, default: null},
    },
    rating: {type: Number, default: 0},
    status:{
        type: Boolean,
        default: false
    },
    date:{type: Date, default: Date.now()}
})


// Cascade delete category when a product is deleted
CompanySchema.pre('remove', async function(next) {
    console.log(`Product being removed from company ${this._id}`);
    await this.model('Product').deleteMany({ company: this._id });
    await this.model('Branch').deleteMany({ company: this._id });
    next();
});
module.exports = mongoose.model('Company',CompanySchema)
