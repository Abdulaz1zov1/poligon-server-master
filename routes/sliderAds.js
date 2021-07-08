const express = require('express')
const router = express.Router()
const { protect, authorize } = require('../middleware/auth');
const multer = require('multer');
const path = require('path')
const md5 = require('md5');
const {addReklama,getAllReklamaByAdmin,getAllReklamaUi,updateAds,deleteAds,deleteFile } = require('../controllers/sliderReklama')

const storage = multer.diskStorage({
    destination: function (req,file,cb) {
        cb(null, './public/uploads/org');
    },
    filename: function (req,file,cb) {
        cb(null, `${md5(Date.now())}${path.extname(file.originalname)}`);
    }
});


const upload = multer({storage: storage});

router.post('/add', upload.single('image'),addReklama)
router.get('/all',protect,authorize('admin','publisher'),getAllReklamaByAdmin)
router.put('/:id',protect,authorize('admin','publisher'),updateAds)
router.delete('/:id',deleteAds)
router.delete('/:id',deleteFile)


module.exports = router;