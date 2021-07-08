const express = require('express')
const Company = require('../models/Company')
const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');
const multer = require('multer');
const router = express.Router()
const path = require('path')
const md5 = require('md5');
const {
    createCompany,
    getCompanyById,
    getAllCompany,
    createBranch,
    deleteFile,
    getQuery
} = require('../controllers/company')

const storage = multer.diskStorage({
    destination: function (req,file,cb) {
        cb(null, './public/uploads/org');
    },
    filename: function (req,file,cb) {
        cb(null, `${md5(Date.now())}${path.extname(file.originalname)}`);
    }
});
const upload = multer({storage: storage});

router.get('/all',getAllCompany);
router.get('/:id',getCompanyById);
router.post('/branch',protect,authorize('business','admin'), createBranch);
router.post('/create' ,protect,authorize('business','admin'),upload.single('file') , createCompany);
router.delete('/:id', deleteFile);
module.exports = router;
