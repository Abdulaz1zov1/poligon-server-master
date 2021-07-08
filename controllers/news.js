const asyncHandler = require('../middleware/async');
const News = require('../models/News');
const ErrorResponse = require('../utils/errorResponse');
const UploadFile=require('../config/Sharp')

// @desc      Get Product By Id
// @route     GET /api/news/:id
// @access    PUBLIC
exports.getNewsById = asyncHandler(async (req, res) => {

    const result = await News.findByIdAndUpdate({_id: req.params.id})
    if(result){
    result.views += 1
    result.save()

    res.status(200).json({
        success: true,
        data: result
    });
    } else {
        return new ErrorResponse('News Not Found', 404)
    }
});
// @desc      Create Product
// @route     GET /api/news/add
// @access    PUBLIC
exports.createNews = asyncHandler(async (req,res) => {
    const files = req.file;
    const {filename} = files;
    const thumb=(`/public/uploads/thumb/${filename}`)
    const SharpMetod=new UploadFile(filename)
    await  SharpMetod.sharpMetod()
   const news = new News({
        title:{
            uz: req.body.titleuz,
            ru: req.body.titleru
        },
        category: req.body.category,
        description: {
            uz: req.body.descriptionuz,
            ru: req.body.descriptionru
        },
        image: {thumb},
        tags: req.body.tags

    })
       news.save()
        .then(()=>{
            res.status(201).json({
                success:true,
                data: news
            })
        })
        .catch((e)=> {
           res.status(400).json({success:false, data: e})
        })
})
// @desc      Get Product By Id
// @route     GET /api/news/all
// @access    Protected
exports.getAll = asyncHandler(async (req, res) => {
    const result = await News.find()
        .sort({date: -1})
        .select(['category','title','views'])

    if(result){
        res.status(200).json({
            success: true,
            data: result
        })
    } else {
        await res.send(404).json({success: false, data: "Product not found"})
    }
});
// @desc      DELETE New By Id
// @route     DELETE /api/news/:id
// @access    Protected
exports.deleteNews = asyncHandler(async (req, res) => {
    await News.findByIdAndDelete(req.params.id);

    await res.status(200).json({
        success: true,
        data: []
    });
});


exports.deleteFile=async (req,res)=>{
    await Company.findById(req.params.id)
        .exec((error,data)=>{
            if(error){res.send(error)}
            else{
                const filePath=path.join(path.dirname(__dirname)+data.image)
                console.log(path.join(path.dirname(__dirname)+data.image))
                fs.unlink(filePath, async (err)=>{
                    if(err) throw err
                    await Company.findByIdAndDelete(req.params.id)
                    res.status(200).json({
                        success:true,
                        data:"Success delete"
                    })
                })
            }
        })
}