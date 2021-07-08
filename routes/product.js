const express = require('express')
const multer = require('multer')
const path = require('path')
const md5 = require('md5');
const {
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    addComment,
    deleteComment,
    updateComment,
    deleteFile
} = require('../controllers/product')

const Product = require('../models/Product');

const router = express.Router({ mergeParams: true });

const storage = multer.diskStorage({
    destination: function (req,file,cb) {
        cb(null, './public/uploads/org');
    },
    filename: function (req,file,cb) {
        cb(null, `${md5(Date.now())}${path.extname(file.originalname)}`);
    }
});


const upload = multer({storage: storage});

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');


router.get('/:id', getProductById)
router.get('/',advancedResults(Product,['category','company', 'author']), getProduct)
router.post('/add',protect,authorize('admin','publisher','business'),upload.array('images',12),createProduct);


router
    .route('/:id')
    .put(protect,authorize('admin','publisher'),updateProduct)
    .delete(protect,authorize('admin','publisher','business'),deleteProduct);
router
    .route('/comment')
    .post(protect,authorize('user','publisher','business','admin'),addComment)
    .put(protect,authorize('user','publisher','business','admin'),updateComment)
    .delete(protect,authorize('user','publisher','business','admin'),deleteComment);
router.delete('/:id', deleteFile)
module.exports = router;
