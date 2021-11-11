const ErrorResponse = require('../utils/errorResponse')
const Review = require('../models/Review')
const Bootcamp = require('../models/Bootcamp')
const asyncHandler = require('../middleware/asyncHandler')


// @desc Get all reviews
// @route GET /api/v1/reviews/
// @route GET /api/v1/bootcamp/:bootcampId/reviews
// @access PUBLIC

exports.getReviews = asyncHandler(async (req, res, next) => {
  if(req.params.bootcampId) {
    const reviews = await Review.find({bootcamp: req.params.bootcampId})

    return res.status(200).json({
      success: true,
      data: reviews,
      count: reviews.length
    })
  } else {
    res.status(200).json(res.advancedResults)
  }
})


// @desc Add all reviews
// @route POST /api/v1/bootcamp/:bootcampId/reviews
// @access PUBLIC

exports.addReview = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId
  req.body.user = req.user.id

  const bootcamp = await Bootcamp.findById(req.params.bootcampId)

  if(!bootcamp) {
    return next(new ErrorResponse(`No bootcamp with id of ${req.params.bootcampId}`, 400))
  }

  const review = await Review.create(req.body)

  res.status(200).json({
    success: true,
    data: review
  })
})


// @desc Get single reviews
// @route GET /api/v1/reviews/:id
// @access PUBLIC

exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description'
  })
  if (!review) {
    return next(new ErrorResponse('Not found this review', 400))
  }
  res.status(200).json({
    success: true,
    data: review
  })
})



// @desc Update a single reviews
// @route PUT /api/v1/reviews/:id
// @access PUBLIC

exports.updateReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })
  if (!review) {
    return next(new ErrorResponse('Not found this review', 400))
  }
  res.status(200).json({
    success: true,
    data: review
  })
})