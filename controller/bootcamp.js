const path = require('path')
const ErrorResponse = require('../utils/errorResponse')
const Bootcamp = require('../models/Bootcamp')
const geocoder = require('../utils/geocoder')
const asyncHandler = require('../middleware/asyncHandler')

// @desc Get All Bootcamps
// @route Get /api/v1/bootcamps
// @access Public

exports.getBootcamps = asyncHandler(async (req, res, next) => {

  let query
  // Copy req.query

  const reqQuery = {... req.query}

  // Field to exclude
  const removeFields = ['select', 'sort', 'page', 'limit']

  // loop through removeFields and delete them from reqQuery
  removeFields.forEach(field => delete reqQuery[field])

  // create query string
  let queryStr = JSON.stringify(reqQuery)
  
  // create operators ($gt, $gte, ect)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)
  // Finding resource
  query = Bootcamp.find(JSON.parse(queryStr)).populate({
    path: 'courses',
    select: 'title description'
  })

  // Select fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ')
    query = query.select(fields)
  }
  // Sort fields
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ')
    query = query.sort(sortBy)
  } else {
    query = query.sort('-createdAt')
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1
  const limit = parseInt(req.query.limit, 10) || 25
  const startIndex = (page - 1) * limit
  const endIndex = page * limit
  const total = await Bootcamp.countDocuments()

  query = query.skip(startIndex).limit(limit)

  // Executing query
  const bootcamps = await query


  // Pagination result
  const pagination = {}
  if (endIndex < total) {
    pagination.next= {
      page: page + 1,
      limit
    }
  }
  if (startIndex < 0) {
    pagination.prev = {
      page: page - 1,
      limit
    }
  }
  res.status(200).json({
    success: true,
    count: bootcamps.length,
    pagination: pagination,
    data: bootcamps
  })
})

// @desc Get a Bootcamps
// @route Get /api/v1/bootcamps/:id
// @access Public

exports.getBootcamp = asyncHandler(async (req, res, next)  => {
  const bootcamp = await Bootcamp.findById(req.params.id).populate({
    path: 'courses',
    select: 'title description tuition'
  })
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
  const bootcamp = await Bootcamp.findById(req.params.id)
  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
  }
  bootcamp.remove()
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


// @desc Upload photo for bootcamp
// @route PUT /api/v1/bootcamps/:id/photo
// @access Private

exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id)
  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
  }
  if(!req.files) {
    return next(new ErrorResponse('Please upload file', 400))
  }
  const file = req.files.file
  // Make sure the image is a photo
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse('Not a image', 400))
  }

  // Check size of image
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(new ErrorResponse('The photo must be less than 1000000', 400))
  }

  // Create custom filename
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`
  console.log(`${process.env.FILE_UPLOAD_PATH}/${file.name}`)
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if (err) {
      console.error(err)
      return next(new ErrorResponse('Problem with file upload', 500))
    }

    await Bootcamp.findByIdAndUpdate(req.params.id, {photo: file.name })
    res.status(200).json({
      success: true,
      data: file.name
    })
  })
})