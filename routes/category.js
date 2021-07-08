const express = require('express')

const {
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    productByCategory
} = require('../controllers/category')


const router = express.Router({ mergeParams: true });

const { protect, authorize } = require('../middleware/auth');



//for admin panel
router.get('/',getCategory);
router.get('/:id',productByCategory)
router.put('/:id',protect,authorize('admin'),updateCategory);
router.delete('/:id',protect,authorize('admin'),deleteCategory);
router.post('/',protect,authorize('admin'),createCategory);


module.exports = router;
