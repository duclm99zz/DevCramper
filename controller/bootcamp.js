const ErrorResponse = require('../utils/errorResponse')
const Bootcamp = require('../models/Bootcamp')
const geocoder = require('../utils/geocoder')
const asyncHandler = require('../middleware/asyncHandler')

// @desc Get All Bootcamps
// @route Get /api/v1/bootcamps
// @access Public

exports.getBootcamps = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.find()
  res.status(201).json({ success: true, count: bootcamp.length, data: bootcamp })
})

// @desc Get a Bootcamps
// @route Get /api/v1/bootcamps/:id
// @access Public

exports.getBootcamp = asyncHandler(async (req, res, next)  => {
  const bootcamp = await Bootcamp.findById(req.params.id)
  if (!bootcamp){
    return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
  }
  res.status(200).json({ success: true, data: bootcamp })
  next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
})

// @desc Create a Bootcamps
// @route Post /api/v1/bootcamps
// @access Private

exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body)
  res.status(201).json({ success: true, data: bootcamp})
})

// @desc Update a Bootcamps
// @route Post /api/v1/bootcamps:id
// @access Private

exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })
  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
  }
  res.status(201).json({ success: true, data: bootcamp })

})

// @desc Delete a Bootcamps
// @route Delete /api/v1/bootcamps:id
// @access Private

exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)
  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
  }
  res.status(201).json({ success: true, data: {}, msg: `Delete ${req.params.id} successfull` })
})

// @desc Get Bootcamps within a radius
// @route Get /api/v1/bootcamps/radius/:zipcode/:distance
// @access Private

exports.getBootcamInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params

  // Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode)
  const lat = loc[0].latitude
  const lng = loc[0].longitude

  // Calc radius using radians
  // Divide distance by radius of Earth
  // Earth Radius = 3,963 mi / 6,378 km
  const radius = distance / 3969

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius]}}
  })
  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps
  })
})