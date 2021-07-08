const crypto = require('crypto');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const mailer = require('../utils/sendEmail');
const User = require('../models/User');
const SMS = require('../utils/sendSms')
const axios = require('axios');

// @desc      Register user
// @route     POST /api/v1/auth/register
// @access    Public
exports.register = asyncHandler(async (req, res) => {
  const { name, phone, password, type, email } = req.body;

  // Create user
  const user = await User.create({
    name,
    email,
    phone,
    password,
    type
  });

  sendTokenResponse(user, 200, res);
});
exports.addAvatar = asyncHandler(async (req,res)=>{
    const user = await User.findByIdAndUpdate(req.user.id)
    user.avatar = `/public/uploads/company/${req.file.filename}`
    user.save()
        .then(()=>{
          res.status(200).json({
            success: true
          })
        })
        .catch((error) =>{
          res.status(400).json({
            success: false,
            data: error
          })
        })
})
// @desc      Login user
// @route     POST /api/v1/auth/login
// @access    Public
exports.login = asyncHandler(async (req, res, next) => {
  const { phone, password } = req.body;

  // Validate emil & password
  if (!phone || !password) {
    return next(new ErrorResponse('Please provide an phone and password', 400));
  }

  // Check for user
  const user = await User.findOne({ phone }).select('+password');

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  sendTokenResponse(user, 200, res);
});











// @desc      Log user out / clear cookie
// @route     GET /api/v1/auth/logout
// @access    Private
exports.logout = asyncHandler(async (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  await res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc      Get current logged in user
// @route     POST /api/v1/auth/me
// @access    Private
exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  await res.status(200).json({
    success: true,
    data: user
  });
});

// @desc      Update user details
// @route     PUT /api/v1/auth/updatedetails
// @access    Private
exports.updateDetails = asyncHandler(async (req, res) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email
  };

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  });

  await res.status(200).json({
    success: true,
    data: user
  });
});

// @desc      Update password
// @route     PUT /api/v1/auth/updatepassword
// @access    Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  // Check current password
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse('Password is incorrect', 401));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// @desc      Forgot password
// @route     POST /api/v1/auth/forgotpassword
// @access    Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse('There is no user with that email', 404));
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // Create reset url
  const resetUrl = `http://cdn.umdsoft.uz/resetpassword/${resetToken}`;

  const msg = {
    to: req.body.email,
    subject: 'Password reset token',
    text: `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`
  }
 // const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

  try {
    await mailer(msg);
    await res.status(200).json({success: true, data: 'Email sent'});
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse('Email could not be sent', 500));
  }

  await res.status(200).json({
    success: true,
    data: user
  });
});

// @desc      Reset password
// @route     PUT /api/v1/auth/resetpassword/:resettoken
// @access    Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
 //   .update(req.headers.resettoken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return next(new ErrorResponse('Invalid token', 400));
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token
    });
};

exports.allusers = asyncHandler(async (req,res) =>{
  await res.status(200).json(res.advancedResults);
})
exports.deleteUser = asyncHandler(async (req, res) => {
  await User.findByIdAndDelete(req.params.id);

  await res.status(200).json({
    success: true,
    data: {}
  });
});

exports.resetPasswordToSms = asyncHandler(async (req,res,next) => {
  const candidate = await User.findOneAndUpdate({phone: req.body.phone})

  if(!candidate){
    await res.status(404).json({success: false, data: 'User Not Found'})
  } else {
    const code = Math.floor(Math.random() * 10000)
    candidate.smsCode = code
    candidate.save()
        .then(() => {
          axios({
            method: "POST",
            url: 'https://notify.eskiz.uz/api/auth/login',
            data: {
              email: 'info@breezesoft.uz',
              password: 'LJxYf2BU82VnP8CYGqRm5wsI8WcIs6a2pVoDb6Ik'
            }
          }).then((response)=>{
            const phone = new SMS(candidate.phone, response.data.data.token, code)
            phone.sendSMS()
          })
              .catch((error)=>{
                res.send(error)
              })
          res.send({success: true, data: "Kod yaratildi"})
        }).catch((e)=> res.send(e))

  }
  next();
})
exports.checkCode = asyncHandler(async (req,res)=>{
  const candidate = await User.findOne({phone: req.headers.phone})
  if(!candidate){
    return new ErrorResponse("User not found", 404)
  }
  if(candidate.phone === req.headers.phone || candidate.smsCode === req.headers.code){
    await res.status(200).json({success: true})
  } else {
    await res.send(401).json({success: false})
  }
})

exports.editPasswordToSmsCode = asyncHandler(async (req,res,next)=>{
  const candidate = await User.findOneAndUpdate({phone: req.headers.phone})
  if(!candidate){
    return new ErrorResponse("User not found", 404)
  }
  if(candidate.phone === req.headers.phone || candidate.smsCode === req.headers.code){
    const salt = await bcrypt.genSalt(10);
    candidate.password = await bcrypt.hash(req.body.password, salt);
    candidate.save()
        .then(()=>{
          candidate.smsCode = ''
          candidate.save()
          res.send({
            success: true,
            data: "Parol muvaffaqiyatli saqlandi"
          })
        }).catch((e)=> res.send(e))
  } else {
    res.send(new ErrorResponse("Xatolik", 401))
  }
  next()
})

