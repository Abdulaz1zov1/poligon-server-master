const mongoose = require('mongoose')
const slugify = require('slugify');

const NewsSchema = new mongoose.Schema({
    title:{
        uz: {type: String, required: true},
        ru: {type: String, default: null}
    },

    description: {
        uz: {type: String, required: [true, 'description required']},
        ru: {type: String, default: null}
    },
    tags: [{
        type: String,
        default: null
    }],

    category: {
        type: String,
        enum:['exp','gor'],
        required: true
    },
    image: {type: String, required: true},
    views: {type: Number, default: 0},
    slug: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
})
NewsSchema.pre('save', function(next){
    this.slug = slugify(this.title.uz, { lower: true });
    next();
});
module.exports = mongoose.model('News',NewsSchema)
