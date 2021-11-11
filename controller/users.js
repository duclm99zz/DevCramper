const User = require('../models/User')
const asyncHandler = require('../middleware/asyncHandler')
const ErrorResponse = require('../utils/errorResponse')

// @desc Get all users
// @route GET /api/v1/auth/users
// @access Public

exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults)
})



// @desc Get a single user
// @route GET /api/v1/auth/users/:id
// @access Public

exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id)
  res.status(200).json({
    success: true,
    data: user
  })
})




// @desc Create a single user
// @route POST /api/v1/auth/users
// @access Private/Admin

exports.createUser = asyncHandler(async (req, res, next) => {
  const users = await User.create(req.body)
  if (!users) {
    return next(new ErrorResponse('Not any user can be found', 400))
  }
  res.status(201).json({
    success: true,
    data: users
  })
})



// @desc Update a single user
// @route PUT /api/v1/auth/users/:id
// @access Private/Admin

exports.updateUser = asyncHandler(async (req, res, next) => {
  const users = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })
  if (!users) {
    return next(new ErrorResponse('Not any user can be found', 400))
  }
  res.status(201).json({
    success: true,
    data: users
  })
})




// @desc Delete a single user
// @route Delete /api/v1/auth/users/:id
// @access Private/Admin

exports.deleteUser = asyncHandler(async (req, res, next) => {
  const users = await User.findByIdAndDelete(req.params.id)
  if (!users) {
    return next(new ErrorResponse('Not any user can be found', 400))
  }
  res.status(201).json({
    success: true,
    data: {}
  })
})
