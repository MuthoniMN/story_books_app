const express = require("express")
const router = express.Router()
const { ensureAuth } = require("../middleware/auth")
const Story = require("../models/Story")
const upload = require('../config/cloudinary');

// @desc    Get story page
// @route  GET /stories/add
router.get('/add', ensureAuth, (req, res) => {
    res.render('stories/add')
})

// @desc    Add a story
// @route  POST /stories/add
router.post('/add', ensureAuth, upload.single("featuredImage"), async (req, res) => {
    try {
        req.body.user = req.user.id
        req.body.published = req.body.published === "Publish" ? true : false
        req.body.featuredImage = req.file.path

        await Story.create(req.body)
        res.redirect('/dashboard')

    } catch (err) {
        console.error(err)
        res.render('errors/500')
    }
})

module.exports = router