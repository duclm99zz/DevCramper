const express = require('express')
const dotenv = require('dotenv')


// Routes files
const bootcamps = require('./routes/bootcamp')
// Load env vars

dotenv.config({ path: './config/config.env' })

const app = express()


const logger = (req, res, next) => {
  req.hello = 'Hello World'
  console.log('Middleware run')
  next()
}

app.use(logger)

app.use('/api/v1/bootcamps', bootcamps);
const PORT = process.env.PORT || 5000

app.listen(PORT,
  console.log(`Server listening in ${process.env.NODE_ENV} on port ${PORT}`)
)