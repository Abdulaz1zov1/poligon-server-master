const express = require('express');
const {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  updateDetails,
  updatePassword,
    resetPasswordToSms,
    deleteUser,
    allusers,
    addAvatar,
    checkCode
} = require('../controllers/auth');
const User = require('../models/User')
const router = express.Router();
const advancedResults = require('../middleware/advancedResults');
const { protect } = require('../middleware/auth');

const multer = require('multer');
const path = require('path')
const md5 = require('md5');

const storage = multer.diskStorage({
  destination: function (req,file,cb) {
    cb(null, './public/uploads/avatar');
  },
  filename: function (req,file,cb) {
    cb(null, `${md5(Date.now())}${path.extname(file.originalname)}`);
  }
});


const upload = multer({storage: storage});

router.post('/register', register);
router.get('/all',advancedResults(User),allusers);
router.post('/login', login);
router.get('/logout', logout);
router.get('/profile', protect, getMe);
router.post('/editavatar',protect,upload.single('image'),addAvatar);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword', resetPassword);
router.delete('/:id', deleteUser);

router.post('/forgotpasswordtosms', resetPasswordToSms);
router.post('/checkcode', checkCode)
router.post('/editpassword', resetPasswordToSms)

module.exports = router;
