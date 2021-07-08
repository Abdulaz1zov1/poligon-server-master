const router = require('express').Router()

const { createRatingProduct, productByRating } = require('../controllers/rating')

router.post('/product', createRatingProduct);
router.get('/product', productByRating);

module.exports = router;
