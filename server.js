const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const fileupload = require('express-fileupload')
const colors = require('colors')
const errorHandler = require('./middleware/error')
const connectDB = require('./config/db')


// Routes files
const bootcamps = require('./routes/bootcamp')
const courses  = require('./routes/courses')
// Load env vars

dotenv.config({ path: './config/config.env' })
connectDB()
const app = express()
app.use(express.json())
// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// app.use(logger)
app.use(fileupload())

// Set static folder
app.use(express.static(path.join(__dirname, 'public')))


app.use('/api/v1/bootcamps', bootcamps)
app.use('/api/v1/courses', courses)
app.use(errorHandler)
const PORT = process.env.PORT || 5000

const server = app.listen(PORT,
  console.log(`Server listening in ${process.env.NODE_ENV} on port ${PORT}`.yellow.bold)
)

process.on('unhandledRejection', (err, promise) => {
  console.log('Error:', err.message.red)
  server.close(() => process.exit(1))
})