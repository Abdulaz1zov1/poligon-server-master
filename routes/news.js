const express = require('express');
const router = express.Router({ mergeParams: true });

const { protect, authorize } = require('../middleware/auth');
const multer = require('multer');
const path = require('path')
const md5 = require('md5');
const {createNews ,getAll , deleteNews,deleteFile } = require('../controllers/news')


const storage = multer.diskStorage({
    destination: function (req,file,cb) {
        cb(null, './public/uploads/org');
    },
    filename: function (req,file,cb) {
        cb(null, `${md5(Date.now())}${path.extname(file.originalname)}`);
    }
});


const upload = multer({storage: storage});
router.get('/all', protect,authorize('admin','publisher'),getAll)
router.delete('/:id', protect,authorize('admin','publisher'), deleteNews)
router.post('/add'/*,protect,authorize('admin','publisher')*/,upload.single('file'),createNews)
router.delete('/:id',deleteFile)


module.exports = router
