const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const { engine } = require('express-handlebars')
const connectDB = require('./config/db')
const path = require('path')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const mongoose = require('mongoose')

const app = express()
// load the environment variables
dotenv.config({ path: './config/config.env' })

// Passport config
require('./config/passport')(passport)

connectDB()

//body parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Handlebars Helpers
const { formatDate, stripTags, editIcon } = require('./helpers/hbs')

// Handlebars
app.engine('.hbs', engine({
    helpers: {
        formatDate,
        stripTags,
        editIcon
    }, defaultLayout: 'main', extname: '.hbs'
}));
app.set('view engine', '.hbs')
app.set('views', './views')

// Session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
}))

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Static Folder
app.use(express.static(path.join(__dirname, 'public')))

// Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))

if (process.env.NODE_ENV == 'development') {
    app.use(morgan('dev'))
}

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV} mode.`))