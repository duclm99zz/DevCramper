const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const colors = require('colors')
const errorHandler = require('./middleware/error')
const connectDB = require('./config/db')


// Routes files
const bootcamps = require('./routes/bootcamp')
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

app.use('/api/v1/bootcamps', bootcamps)
app.use(errorHandler)
const PORT = process.env.PORT || 5000

const server = app.listen(PORT,
  console.log(`Server listening in ${process.env.NODE_ENV} on port ${PORT}`.yellow.bold)
)

process.on('unhandledRejection', (err, promise) => {
  console.log('Error:', err.message.red)
  server.close(() => process.exit(1))
})