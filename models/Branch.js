const mongoose = require('mongoose')

const BranchSchema = new mongoose.Schema({
    company: {
        type: mongoose.Schema.ObjectId,
        ref: 'Company',
        required: true
    },
    address: {type: String, required: true},
    location: {
        lat: {type: String, required: true},
        long: {type: String, required: true},
    },
    contact:{type: String, required: true}
})

module.exports = mongoose.model('Branch',BranchSchema)
