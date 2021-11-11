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
const reviewRouter = require('./reviews')
const router = express.Router()

const { protect, authorize } = require('../middleware/auth')

router.use('/:bootcampId/courses', courseRouter)
router.use('/:bootcampId/reviews', reviewRouter)
router.route('/').get(advancedResult(Bootcamp, 'courses'), getBootcamps).post(protect,createBootcamp)
router.route('/radius/:zipcode/:distance').get(getBootcamInRadius)
router.route('/:id').get(getBootcamp).put(protect,authorize('publisher', 'admin') ,updateBootcamp).delete(protect,deleteBootcamp)
router.route('/:id/photo').put(protect, authorize('publisher', 'admin'), bootcampPhotoUpload)
module.exports = router