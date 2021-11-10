const express = require('express')

const {
  getCourses,
  getCourseById,
  addCourse,
  updateCourse,
  deleteCourse
} = require('../controller/courses')
const { protect, authorize } = require('../middleware/auth')
const Course = require('../models/Course')
const advancedResult = require('../middleware/advancedResult')
const router = express.Router({ mergeParams: true})

router.route('/').get(advancedResult(Course, {path: 'bootcamp', select: 'name description' }),getCourses).post(protect, authorize('publisher', 'admin'), addCourse)
router.route('/:id').get(getCourseById).put(protect, authorize('publisher', 'admin'), updateCourse).delete(protect, deleteCourse)

module.exports = router