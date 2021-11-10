const User = require('../models/User')
const asyncHandler = require('../middleware/asyncHandler')
const ErrorResponse = require('../utils/errorResponse')


// @desc  Register user
// @route GET api/v1/auth/register
// @access Public

exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role} = req.body

  const user = await User.create({
    name,
    email,
    password,
    role
  })

  // Create token
  const token = user.getSignedJwtToken()

  res.status(200).json({success: true, token})
})


// @desc  Login
// @route GET api/v1/auth/login
// @access Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body

  // check email and password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide email and password correctly', 400))
  }

  // Validate email and password
  const user = await User.findOne({
    email
  }).select('+password')

  if (!user) {
    return next(new ErrorResponse('User not found with that credentials', 401))
  }
  const isMatch = await user.matchPassword(password)

  if (!isMatch) {
    return next(new ErrorResponse('Invalid password!', 401))
  } 

  const token = user.getSignedJwtToken()

  res.status(200).json({success: true, token, user})
  sendTokenResponse(user, 200, res)
})



// @desc Get token from Model, create cookie and send response
const sendTokenResponse = (user, statusCode, response) => {
  // Create token
  const token = user.getSignedJwtToken()

  const options = {
    expires: new Date(Date.now()  + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true // Client will not see our token
  }
  if (process.env.NODE_ENV === 'production') {
    options.secure = true
  }
  res.status(statusCode).cookie('token', token, options).json({ success: true, token})

}

// @desc Get current logged in user
// @route POST api/v1/auth/me
// @access Private

exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id)

  res.status(200).json({
    success: true,
    data: user
  })
})