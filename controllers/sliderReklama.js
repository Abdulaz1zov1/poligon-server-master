const SliderReklama = require('../models/SliderReklama')
const asyncHandler = require('../middleware/async')
const fs = require('fs')
const path = require('path')
const UploadFile=require('../config/Sharp')

exports.addReklama = asyncHandler(async (req,res) => {
    const files = req.file;
    const {filename} = files;
    const thumb=(`/public/uploads/thumb/${filename}`)
    const SharpMetod=new UploadFile(filename)
    await  SharpMetod.sharpMetod()
    const ads = new SliderReklama({
        name: req.body.name,
    //    url: req.body.url,
      //  status: req.body.status,
      //  endDate: req.body.endDate,
        image: {thumb}
    })
    ads.save()
        .then(() => {
            res.status(201).json({
                success: true,
                data: ads
            })
        })
        .catch((error) => {
            res.status(400).json({
                success: false,
                error
            })
        })

})
exports.getAllReklamaByAdmin = asyncHandler(async (req,res)=>{
    const ads = await SliderReklama.find()
        .sort({timestamp: -1})


    await res.status(200).json({
        success: true,
        ads
    })
})
exports.getAllReklamaUi = asyncHandler(async (req,res)=>{
    const ads = await SliderReklama
        .find()
        .sort({timestamp: -1})
        .limit(5)
        .select(['url','image'])


    await res.status(200).json({
        success: true,
        ads
    })
})
exports.updateAds = asyncHandler(async (req,res) => {
    const ads = SliderReklama.findByIdAndUpdate(req.params.id)
    ads.name = req.body.name
    ads.status = req.body.status
    ads.endDate = req.body.endDate

    ads.save()
        .then(() => {
            res.status(200).json({
                success: true,
                data: ads
            })
        })
        .catch((error) => {
            res.status(400).json({
                success: false,
                error
            })
        })
})


exports.deleteAds = asyncHandler(async (req,res) => {
    await SliderReklama.findById({_id:req.params.id})
    .exec((error,data) =>{
        if(error){ res.send(error)}
        else{
            const file = path.join(path.dirname(__dirname) + data.image)
            fs.unlink(file, async (err)=>{
                if(err) throw res.send(err)
                await SliderReklama.findByIdAndDelete(req.params.id)
                res.status(200).json({
                    success: true,
                    data: []
                })
            })
        }
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
