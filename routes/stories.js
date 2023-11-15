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
    console.log(req.body)
    try {
        req.body.user = req.user.id
        req.body.published = req.body.published === "publish" ? true : false
        req.body.featuredImage = req.file.path.substring(req.file.path.replace('public/', ''))

        await Story.create(req.body)
        res.redirect('/dashboard')

    } catch (err) {
        console.error(err)
        res.render('errors/500')
    }
})

// @desc    Get public stories
// @route  GET /stories/
router.get('/', ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({ status: 'public' }).populate('user').sort({ createdAt: "desc" }).lean()
        res.render('stories/public', {
            stories
        })
    } catch (err) {
        console.error(err)
        res.render('errors/500')
    }
})

// @desc    Get public stories
// @route  GET /stories/
router.get('/:id', ensureAuth, async (req, res) => {
    try {
        const story = await Story.findById(req.params.id).populate('user').lean()
        res.render('stories/story', {
            story
        })
    } catch (err) {
        console.error(err)
        res.render('errors/500')
    }
})

module.exports = router