const express = require('express')
const router = express.Router()

// @desc    Login/Landing Page
// @route    GET /
router.get('/', (req, res) => {
    res.render('login')
})

// @desc    Dashboard Page
// @route    GET /dashboard
router.get('/dashboard', (req, res) => {
    res.render('dashboard')
})

// @desc    Profile Page
// @route    GET /profile
router.get('/profile', (req, res) => {
    res.render('profile')
})

module.exports = router