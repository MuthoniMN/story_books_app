const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')

const Story = require('../models/Story')
// @desc    Login/Landing Page
// @route    GET /
router.get('/', ensureGuest, (req, res) => {
    res.render('login', { layout: 'loggedIn' })
})

// @desc    Dashboard Page
// @route    GET /dashboard
router.get('/dashboard', ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({ user: req.user.id }).lean()
        res.render('dashboard', {
            name: req.user.firstName,
            profileImage: req.user.image,
            displayName: req.user.displayName,
            stories
        })
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }

})

// @desc    Profile Page
// @route    GET /profile
router.get('/profile', (req, res) => {
    res.render('profile')
})

module.exports = router