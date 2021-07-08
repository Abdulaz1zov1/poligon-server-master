const News = require('../models/News')
const Slider = require('../models/SliderReklama')
const Product = require('../models/Product')
const Company = require('../models/Company')
const asyncHandler = require('../middleware/async');

exports.uiAll = asyncHandler(async (req,res) => {
    const goryachi = await News.find({category: 'gor'})
        .limit(5)
        .sort({date: -1})

    const experts = await News.find({category: 'exp'})
        .limit(6)
        .sort({date: -1})

    const slider = await Slider
        .find()
        .sort({timestamp: -1})
        .select(['url','image'])

    await res.status(200).json({
        success: true,
        slider,
        goryachi,
        experts
    })

})
exports.filterByQuery = asyncHandler(async (req,res)=>{


    try{
        let data = await  Product.find()
        // console.log(data)
        let str = JSON.stringify(req.query)
        str = str.replace(/\b(gte|gt|lt|lte)\b/g,match=>'$'+ match)
        let search = JSON.parse(str)
        let product = await Product.find(search)
        res.status(200).json({
            success: true,
            data: product
        });
        console.log(product)
    }catch (er) {
        console.log(er)
    }


    //
    // let result
    // if(req.query.type === 'product'){
    //     result=await Product.find()
    //         .sort({date: -1})
    // }else if(req.query.type === 'company'){
    //     result = await Company.find()
    //         .sort({date: -1})
    // }


})