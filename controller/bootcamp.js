const ErrorResponse = require('../utils/errorResponse')
const Bootcamp = require('../models/Bootcamp')

// @desc Get All Bootcamps
// @route Get /api/v1/bootcamps
// @access Public

exports.getBootcamps = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.find()
    res.status(201).json({ success: true, count: bootcamp.length, data: bootcamp })
  } catch (error) {
    next(error)
  }
}

// @desc Get a Bootcamps
// @route Get /api/v1/bootcamps/:id
// @access Public

exports.getBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id)
    if (!bootcamp){
      return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
    }
    res.status(200).json({ success: true, data: bootcamp })
  } catch (error) {
    next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
  }
}

// @desc Create a Bootcamps
// @route Post /api/v1/bootcamps
// @access Private

exports.createBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body)
    res.status(201).json({ success: true, data: bootcamp})
  } catch (error) {
    next(error)
  }
  
}

// @desc Update a Bootcamps
// @route Post /api/v1/bootcamps:id
// @access Private

exports.updateBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
    if (!bootcamp) {
      return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
    }
    res.status(201).json({ success: true, data: bootcamp })
  } catch (error) {
    next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
  }
}

// @desc Delete a Bootcamps
// @route Delete /api/v1/bootcamps:id
// @access Private

exports.deleteBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)
    if (!bootcamp) {
      return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
    }
    res.status(201).json({ success: true, data: {}, msg: `Delete ${req.params.id} successfull` })
  } catch (error) {
    next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
  }
}