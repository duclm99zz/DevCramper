const express = require('express')

const {
  getCourses,
  getCourseById,
  addCourse,
  updateCourse,
  deleteCourse
} = require('../controller/courses')

const router = express.Router({ mergeParams: true})

router.route('/').get(getCourses).post(addCourse)
router.route('/:id').get(getCourseById).put(updateCourse).delete(deleteCourse)

module.exports = router