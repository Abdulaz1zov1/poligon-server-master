const Company = require('../models/Company')
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const jwt = require('jsonwebtoken')
const Branch = require('../models/Branch')
const Product = require('../models/Product')
const UploadFile=require('../config/Sharp')
const fs=require('fs')
// @desc      Create Company
// @route     POST /api/company/create
// @access    Private | role === business
exports.createCompany = asyncHandler(async (req,res) => {
   const user = jwt.decode(req.headers.authorization.slice(7))
    const files = req.file;
    const {filename} = files;
    const thumb=(`/public/uploads/thumb/${filename}`)
    const SharpMetod=new UploadFile(filename)
     await  SharpMetod.sharpMetod()

    const company = new Company({
        name: req.body.name,
        description: {
            uz: req.body.descriptionuz,
            ru: req.body.descriptionru
        },


       image: {thumb},
        category: req.body.category,
        director:user.id,
        location: {
            lat: req.body.lat,
            long: req.body.long
        },
        companyId: Math.floor(Math.random() * 10000000000)
    })

    company.save()
        .then(() => {
            res.status(200).json({
                success:true,
                data: company
            }).catch((err) => {
                res.status(400).json({success: false, err})
            })
        })

})

// @desc      Get All Company
// @route     GET /api/company/all
// @access    Public
exports.getAllCompany = asyncHandler(async (req,res)=>{
    const company = await Company.find()
        .sort({date: -1})
        .limit(10)
        .select({
            name: 1, image: 1, rating: 1 , companyId: 1, director: 1, description: 1
        })
        .populate(
            {path: 'director' , select: {phone:1}}
        )
    res.status(200).json({
        success: true,
        data: company
    })
})

// @desc      Get Company By Id
// @route     GET /api/company/:id
// @access    Public
exports.getCompanyById = asyncHandler(async (req,res,next)=>{
    const company = await Company.findById(req.params.id);
    const branch = await Branch.find({company: req.params.id})
    const product = await Product.find({company: req.params.id})
        .sort({date: -1})

    if (!company) {
        return next(
            new ErrorResponse(`Company not found with id of ${req.params.id}`, 404)
        );
    }
    await res.status(200).json({success: true, data: {company, branch, product}});
})

// @desc      Add Branch Company
// @route     POST /api/company/branch/add
// @access    Protected
exports.createBranch = asyncHandler(async (req,res,next)=>{
    const user = jwt.decode(req.headers.authorization.slice(7))
    if(user.role !== 'admin' || user.role !== 'business'){
        return next(
            res.send(new ErrorResponse(false, 403))
        );
    }
    if(!req.body.company){
        return next(
            res.send(new ErrorResponse('Company not found', 404))
        );
    }
    const branch = new Branch({
        company: req.body.company,
        address: req.body.address,
        lat: req.body.lat,
        long: req.body.long,
        contact: req.body.contact
    })
    branch.save()
        .then(()=>{
            res.status(201).json({
                success: true,
                data: branch
            })
        })
        .catch((e)=> {
            res.status(400).json({
                success: false,
                error: e
            })
        })

})

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
