const Category = require('../models/Category')
const asyncHandler = require('../middleware/async');
const slugify = require('slugify');
const Product = require('../models/Product')

function createCategories (categories, parentId = null){
    const categoryList = []
    let category;
    if(parentId == null){
        category =  categories.filter(cat => cat.parentId == undefined)
    }else {
        category = categories.filter(cat => cat.parentId == parentId)
    }
    //console.log(category)
    for(let cate of category){
        categoryList.push({
            _id: cate._id,
            name: cate.name,
            slug: cate.slug,
            children: createCategories(categories, cate._id)
        })
    }
    return categoryList
}

// @desc      Get all categories
// @route     GET /api/v1/category
// @access    Private/Admin
exports.getCategory = asyncHandler(async (req, res,next) => {
   await Category.find({})
        .exec((error, categories) => {
            if(error)  res.status(400).json({error})
            if(categories){
                const categoryList = createCategories(categories)
                res.status(200).json({categoryList })
            }
        })

});

// @desc      Create category
// @route     POST /api/v1/category
// @access    Private/Admin
exports.createCategory = asyncHandler(async (req, res) => {
    const categoryObj = {
        name: {
            uz: req.body.nameuz,
            ru: req.body.nameru
        },
        slug: (Math.floor(Math.random() * 1000000000)).toString()
    }

    if(req.body.parentId){
        categoryObj.parentId = req.body.parentId
    }
    const cat = new Category(categoryObj)
    await cat.save((error, category) => {
        if(error) return res.status(400).json({error})
        if(category){
            return res.status(200).json({category})
        }
    })
});

// @desc      Update category
// @route     PUT /api/category/:id
// @access    Private/Admin
exports.updateCategory = asyncHandler(async (req, res) => {
    const category = await Category.findByIdAndUpdate(req.params.id)

    category.name.uz = req.body.nameuz
    category.name.ru = req.body.nameru

    category.save({ validateBeforeSave: false })
        .then(()=>{
            res.status(200).json({
                success: true,
                data: category
            });
        })
        .catch((e)=>{
            res.status(400).json({
                success: true,
                data: e
            });
        })


});

// @desc      Delete category
// @route     DELETE /api/category/:id
// @access    Private/Admin
exports.deleteCategory = asyncHandler(async (req, res) => {
    await Category.findByIdAndDelete(req.params.id);

    await res.status(200).json({
        success: true,
        data: []
    });
});

// @desc      Delete category
// @route     DELETE /api/category/:id
// @access    Private/Admin
exports.productByCategory = asyncHandler(async (req,res) => {

    const product = await Product.find({category: req.params.id})
        .sort({date: -1})
    await res.status(200).json({
        success: true,
        product
    })
})
