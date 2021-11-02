// @desc Get All Bootcamps
// @route Get /api/v1/bootcamps
// @access Public

exports.getBootcamps = (req, res, next) => {
  res.status(200).json({ success: true, msg: 'Show all bootcamps', hello: req.hello })
}

// @desc Get a Bootcamps
// @route Get /api/v1/bootcamps/:id
// @access Public

exports.getBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: `Get a bootcamp ${req.params.id}` })
}

// @desc Create a Bootcamps
// @route Post /api/v1/bootcamps
// @access Private

exports.createBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: 'Create new bootcamp' })
}

// @desc Update a Bootcamps
// @route Post /api/v1/bootcamps:id
// @access Private

exports.updateBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: `Update bootcamp ${req.params.id}` })
}

// @desc Delete a Bootcamps
// @route Delete /api/v1/bootcamps:id
// @access Private

exports.deleteBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: `Delete bootcamp ${req.params.id}` })
}