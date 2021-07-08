const express = require('express')
const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router()
const {addOrder,deleteOrder} = require('../controllers/order')


router.post('/add',protect , authorize('user','business','publisher','admin'),addOrder)
router.delete('/:id',protect , authorize('user','business','publisher','admin'),deleteOrder)
router.get('/all',)

module.exports = router;