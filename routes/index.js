const express = require('express')
const router = express.Router({ mergeParams: true });
const {uiAll,filterByQuery} = require('../controllers/ui')

router.get('/',uiAll)
router.get('/filter', filterByQuery)
module.exports = router;