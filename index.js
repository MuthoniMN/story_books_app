const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./config/db')

const app = express()
// load the environment variables
dotenv.config({ path: './config/config.env' })
const PORT = process.env.PORT || 5000

connectDB()

app.listen(PORT, () => console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV} mode.`))