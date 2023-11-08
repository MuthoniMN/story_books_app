const express = require('express')
const passport = require('passport')
const router = express.Router()

// @desc    Authenticate with Google
// @route    GET /auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile'] }))

// @desc    After successful authentication
// @route    GET /auth/google/callback
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        // After succesful auth, redirect to the dashboard
        res.redirect('/dashboard')
    }
)

// @desc    Profile Page
// @route    GET /profile
router.get('/profile', (req, res) => {
    res.render('profile')
})

module.exports = router