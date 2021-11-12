const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const fileupload = require('express-fileupload')
const colors = require('colors')
const errorHandler = require('./middleware/error')
const connectDB = require('./config/db')
const cookieParser = require('cookie-parser')
const mongoSanitize = require('express-mongo-sanitize')
const helmetSecurity = require('helmet')
const xssClean = require('xss-clean')
const limit = require('express-rate-limit')
const hpp = require('hpp')
const cors = require('cors')

// Routes files
const bootcamps = require('./routes/bootcamp')
const auth = require('./routes/auth')
const courses  = require('./routes/courses')
const users  = require('./routes/users')
const reviews = require('./routes/reviews')
const rateLimit = require('express-rate-limit')
// Load env vars

dotenv.config({ path: './config/config.env' })
connectDB()

const app = express()

app.use(express.json())
app.use(cookieParser())
// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// app.use(logger)
app.use(fileupload())
// Sanitiza data
app.use(mongoSanitize())
// Security header
app.use(helmetSecurity())
// Prevent xss attacker
app.use(xssClean())
// Rate limiting
const limiter = limit({
  windowMs: 10 * 60 * 60 *1000, // 10 mins
  max: 100
})
app.use(limiter)
// prevent htpp param pollution
app.use(hpp())
// Enable CORSE
app.use(cors())

// Set static folder
app.use(express.static(path.join(__dirname, 'public')))


app.use('/api/v1/bootcamps', bootcamps)
app.use('/api/v1/courses', courses)
app.use('/api/v1/auth', auth)
app.use('/api/v1/users', users)
app.use('/api/v1/reviews', reviews)
app.use(errorHandler)
const PORT = process.env.PORT || 5000

const server = app.listen(PORT,
  console.log(`Server listening in ${process.env.NODE_ENV} on port ${PORT}`.yellow.bold)
)

process.on('unhandledRejection', (err, promise) => {
  console.log('Error:', err.message.red)
  server.close(() => process.exit(1))
})