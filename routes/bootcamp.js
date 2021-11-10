const express = require('express')
const { 
  getBootcamp,
  getBootcamps,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcamInRadius,
  bootcampPhotoUpload
} = require('../controller/bootcamp')
const Bootcamp  = require('../models/Bootcamp')
const advancedResult = require('../middleware/advancedResult')
const courseRouter = require('./courses')
const router = express.Router()

const { protect } = require('../middleware/auth')

router.use('/:bootcampId/courses', courseRouter)
router.route('/').get(advancedResult(Bootcamp, 'courses'), getBootcamps).post(protect,createBootcamp)
router.route('/radius/:zipcode/:distance').get(getBootcamInRadius)
router.route('/:id').get(getBootcamp).put(protect, updateBootcamp).delete(protect,deleteBootcamp)
router.route('/:id/photo').put(protect ,bootcampPhotoUpload)
module.exports = router