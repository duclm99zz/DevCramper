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

const courseRouter = require('./courses')
const router = express.Router()


router.use('/:bootcampId/courses', courseRouter)
router.route('/').get(getBootcamps).post(createBootcamp)
router.route('/radius/:zipcode/:distance').get(getBootcamInRadius)
router.route('/:id').get(getBootcamp).put(updateBootcamp).delete(deleteBootcamp)
router.route('/:id/photo').put(bootcampPhotoUpload)
module.exports = router