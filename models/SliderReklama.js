const mongoose = require('mongoose')

const SliderReklamaSchema = mongoose.Schema({
    name: {type: String, required: true},
    image: {type: String, required: true},
   // url: {type: String, required: true},
    startDate: {type: Date, default: Date.now()},
   // endDate: {type: Date, required: true},
    //status: {type: Boolean, required: true}
},{timestamp: true})


module.exports = mongoose.model('SliderReklama',SliderReklamaSchema)