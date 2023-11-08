const express = require('express')
const router = express.Router()

// @desc    Login/Landing Page
// @route    GET /
router.get('/', (req, res) => {
    res.send('Login')
})

// @desc    Dashboard Page
// @route    GET /dashboard
router.get('/dashboard', (req, res) => {
    res.send('Dashboard')
})

// @desc    Profile Page
// @route    GET /profile
router.get('/profile', (req, res) => {
    res.send('Profile')
})

module.exports = router