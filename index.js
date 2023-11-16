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
const methodOverride = require('method-override')

const app = express()
// load the environment variables
dotenv.config({ path: './config/config.env' })

// Passport config
require('./config/passport')(passport)

connectDB()

//body parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Method Overriding
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
    }
}))

// Handlebars Helpers
const { formatDate, stripTags, editIcon, select } = require('./helpers/hbs')

// Handlebars
app.engine('.hbs', engine({
    helpers: {
        formatDate,
        stripTags,
        editIcon,
        select
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

// Set global var
app.use(function (req, res, next) {
    res.locals.user = req.user || null
    next()
})

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