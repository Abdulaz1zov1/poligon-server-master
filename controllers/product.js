const asyncHandler = require('../middleware/async');
const Product = require('../models/Product');
const Comment = require('../models/Comment')
const jwt = require('jsonwebtoken')
const ErrorResponse = require('../utils/errorResponse');
const sharp=require('sharp')
const path=require('path')
const fs=require('fs')
function createComments (comments, parentId = null){
    const commentList = []
    let commentaries;
    if(parentId == null){
        commentaries =  comments.filter(com => com.parentId === undefined)
    }else {
        commentaries = comments.filter(com => com.parentId === parentId)
    }
    for(let comment of commentaries){
        commentList.push({
            _id: comment._id,
            author: comment.author,
            product: comment.product,
            comment: comment.comment,
            status: comment.status,
            date: comment.date,
            children: createComments(comments, comment._id)
        })
    }
    return commentList
}
// @desc      Get all product
// @route     GET /api/v1/product
// @access    Private/Admin
exports.getProduct = asyncHandler(async (req, res, next) => {
    await res.status(200).json(res.advancedResults);
});



// @desc      Create product
// @route     POST /api/v1/product
// @access    Private/Admin
exports.createProduct = asyncHandler(async (req, res, next) => {
    if(!req.body){
        return next(
            new ErrorResponse(`Required params`, 400)
        );
    }
   const user = jwt.decode(req.headers.authorization.slice(7))

    const urls = [];
    const files = req.files;

    for (const file of files) {
        const files = req.files;
        let urls = [];
        let thumb=[]
        for(let i = 0; i < files.length; i++){
            const {filename} = files[i];
            urls.push(`/public/uploads/org/${filename}`)
            thumb.push(`/public/uploads/product/${filename}`)

            await sharp(path.join(path.dirname(__dirname) + `/public/uploads/org/${filename}`) ).resize(500,500)
                .jpeg({
                    quality: 60
                })
                .toFile(path.join(path.dirname(__dirname) + `/public/uploads/product/${filename}`), (err)=>{
                    if(err) {
                        throw err
                    }
                    fs.unlink(path.join(path.dirname(__dirname) + `/public/uploads/org/${filename}`),(err)=>{
                        throw err
                    })
                })
        }

    }
    const product = new Product({
       title:{
           uz: req.body.titleuz,
           ru: req.body.titleru
       },
        category: req.body.category,
        company: req.body.company,
        author: user.id,
        description: {
           uz: req.body.descriptionuz,
           ru: req.body.descriptionru,
        },
        info:{
           uz: req.body.infouz,
            ru: req.body.inforu
        },
        images: thumb,
        price: req.body.price
    });

   product.save().then(
       ()=> res.status(201).json({
           success: true,
           data: product
       })
   )

});

// @desc      Update product
// @route     PUT /api/product/:id
// @access    Private/Admin
exports.updateProduct = asyncHandler(async (req, res) => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    await res.status(200).json({
        success: true,
        data: product
    });
});

// @desc      Delete product
// @route     DELETE /api/product/:id
// @access    Private/Admin
exports.deleteProduct = asyncHandler(async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        data: {}
    });
});

// @desc      Get Product By Id
// @route     GET /api/product/all/:id
// @access    PUBLIC
exports.getProductById = asyncHandler(async (req, res) => {
   const product =  await Product.find({_id: req.params.id})
       .populate(
       [ {path: 'author', select: ['name','_id']},
           {path: 'company', select:['name','rating']},
           {path: 'category', select: ['slug','name']}]
    )

   const other = await Product
       .find({category: product.category})
       .sort({date: -1})
       .limit(10)
       .select({title: 1, company: 1, images: 1, price: 1, rating: 1})
       .populate(
           {
               path: 'company',
               select: ['_id','name']
           }
       )


    const comment = createComments(
        await Comment.find({product: req.params.id})
            .sort({date: -1})
            .populate(
                {
                    path: 'author',
                    select: 'name'
                }
            )
    )


    await res.status(200).json({
        success: true,
        product,
        comment: comment,
        other
    });
});


// @desc      Get all product
// @route     GET /api/product
// @access    Private/Admin
exports.getProductByUser = asyncHandler(async  (req,res,next) => {
    const query = { state: 'OK' };
    const n = Product.count(query);
    const r = Math.floor(Math.random() * n);
    const topThree = await Product.find().skip(r).limit(3);
    const popular = await Product.find().sort({rating: -1}).limit(8);
    const newProduct = await Product.find().sort({createdAt: -1}).limit(8);
    const budget = await Product.find().sort({price: 1}).limit(8);
    const best = await Product.find().sort({price: -1}).limit(8)
    await res.status(200).json({
        success: true,
        data: {
            topThree,
            popular,
            newProduct,
            budget,
            best
        }
    })
})

// @desc      Create Comments By Product
// @route     POST /api//product/comment
// @access    Private/User
exports.addComment = asyncHandler(async (req,res)=>{
    const user = jwt.decode(req.headers.authorization.slice(7))

    const comment = new Comment({
        author: user.id,
        product: req.body.product,
        comment: req.body.comment
    })
    comment.save()
        .then(()=> {
            res.status(201).json({
                success: true,
                comment
            })
        })
        .catch((error)=> {
            res.status(400).json({
                success: false,
                error
            })

        })
})

// @desc      Create Comments By Product
// @route     PUT /api/product/comment/
// @access    Private/This User
exports.updateComment = asyncHandler(async (req,res)=>{
    const user = jwt.decode(req.headers.authorization.slice(7))
    const comm = await Comment.findOne({_id: req.body.id})
    if(!comm){
        const err = new ErrorResponse('Comment Not Found', 404)
       return res.status(404).json({success: false, err})
    }
    if(comm.author !== user){
        const err = new ErrorResponse('Unauthorize', 403)
       return res.status(403).json({success: false, err})
    }

    const comment = await Comment.findByIdAndUpdate(req.body.id, req.body, {
        new: true,
        runValidators: true
    });

    await res.status(200).json({
        success: true,
        data: comment
    });
})

// @desc      Create Comments By Product
// @route     PUT /api/product/comment/
// @access    Private/This User
exports.deleteComment = asyncHandler(async (req,res)=>{
    const user = jwt.decode(req.headers.authorization.slice(7))
    const comm = await Comment.findOne({_id: req.body.id})
    if(!comm){
        const err = new ErrorResponse('Comment Not Found', 404)
        return res.status(404).json({success: false, err})
    }
    if(comm.author !== user){
        const err = new ErrorResponse('Unauthorize', 403)
        return res.status(403).json({success: false, err})
    }
   await Comment.findByIdAndDelete(req.body.id)
    await res.status(200).json({
        success: true,
        data: {}
    });
})


exports.deleteFile = async (req, res) => {
    await Product.findByIdAndDelete({_id: req.params.id})
        .exec((error,data) => {
            if(error) {
                res.send(error)
            }
            else{
                const isMatch = data.images

                for(let i = 0; i < isMatch.length; i++){
                    let fileThump = path.join(path.dirname(__dirname) + `${isMatch[i]}`)

                    fs.unlink(fileThump, async (error) => {
                        if (error) {
                            console.log(error)
                        }
                        await Product.findByIdAndDelete({_id: req.params.id})
                    })
                }
            }
        })
}

exports.filter = asyncHandler(async (req,res)=>{
    const product = await Product()
})