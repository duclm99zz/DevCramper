const express = require('express')
const {protect} = require('../middleware/auth')
const router = express.Router()
const { 
  register, 
  login, 
  getMe, 
  forgotPassword, 
  resetPassword, 
  updateDetails,
  updatePassword
} = require('../controller/auth')

router.post('/register', register)

router.post('/login', login)
router.get('/me', protect, getMe)
router.put('/updatedetails', protect, updateDetails)
router.post('/forgotpassword', forgotPassword)
router.put('/resetpassword/:resettoken', resetPassword)
router.put('/updatepassword', protect, updatePassword)
module.exports = router