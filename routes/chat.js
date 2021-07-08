const express = require('express')
const router = express.Router()
const { protect , authorize } = require('../middleware/auth');

router.get('/')


module.exports = router