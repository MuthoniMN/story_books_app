const express = require('express')
const dotenv = require('dotenv')

const app = express()
dotenv.config({ path: './config/config.env' })

app.listen(process.env.PORT, () => console.log("Server is running"))