const asyncHandler = require('../middleware/async');
const Product = require('../models/Product');
const Rating = require('../models/Rating');

// @desc      Add rating product
// @route     POST /api/rating
// @access    Public
exports.createRatingProduct = asyncHandler(async (req, res) => {
    const rating = await new Rating({
        user: req.body.user,
        product: req.body.product,
        cost: req.body.cost
    });
    rating.save()
        .then(
            () => console.log("Success rated"))
        .catch((e) => console.log(e))

    let costByProduct = await Rating
        .find({product:req.body.product})
        .sort({cost: 1})

    let result = 0;
    for (let i = 0; i < costByProduct.length; i++){
        result += costByProduct[i].cost
    }
    let num = result / costByProduct.length
    let rate = Number(num.toFixed(1))
    const product = await Product.findByIdAndUpdate({_id:req.body.product})
    product.rating = rate
    product.save()
        .then(() => {
            res.status(200).json({
                success: true,
                data: rate
            })
        })
});

exports.productByRating = asyncHandler(async (req,res) =>{
    const product = await Product
        .find()
        .sort({rating: -1})
        .populate('category')

    await res.status(200).json({
        success: true,
        data: product
    })
});
