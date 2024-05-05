const express = require("express")
const router = express.Router()
const { ensureAuth } = require("../middleware/auth")
const Story = require("../models/Story")
const upload = require('../config/multer');
const cloudinary = require('../config/cloudinary');

// @desc    Add a story page
// @route  GET /stories/add
router.get('/add', ensureAuth, (req, res) => {
    res.render('stories/add', {
        name: req.user.firstName,
        profileImage: req.user.image,
        displayName: req.user.displayName,
    })
})

// @desc    Add a story
// @route  POST /stories/add
router.post('/add', ensureAuth, upload.single("featuredImage"), async (req, res) => {
    try {
        req.body.user = req.user.id
        req.body.published = req.body.published === "publish" ? true : false

        //  saving image on Cloudinary
        cloudinary.uploader
            .upload(req.file.path, {
                public_id: req.body.storyTitle.replace(" ", "_")
            })
            .then(result=>{
                console.log(result)
                req.body.featuredImage = result.url;

                console.log(req.body);

                await Story.create(req.body)
                res.redirect('/dashboard')
            })
            .catch(err => console.error(err));

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
            name: req.user.firstName,
            profileImage: req.user.image,
            displayName: req.user.displayName,
            stories
        })
    } catch (err) {
        console.error(err)
        res.render('errors/500')
    }
})

// @desc    Get private stories
// @route  GET /stories/private
router.get('/private', ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({ user: req.user.id, status: 'private' }).populate('user').sort({ createdAt: "desc" }).lean()
        res.render('stories/private', {
            name: req.user.firstName,
            profileImage: req.user.image,
            displayName: req.user.displayName,
            stories
        })
    } catch (err) {
        console.error(err)
        res.render('errors/500')
    }
})

// @desc    Get drafts
// @route  GET /stories/drafts
router.get('/drafts', ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({ user: req.user.id, published: false }).populate('user').sort({ createdAt: "desc" }).lean()
        res.render('stories/drafts', {
            name: req.user.firstName,
            profileImage: req.user.image,
            displayName: req.user.displayName,
            stories
        })
    } catch (err) {
        console.error(err)
        res.render('errors/500')
    }
})

// @desc    Get story
// @route  GET /stories/:id
router.get('/:id', ensureAuth, async (req, res) => {
    try {
        const story = await Story.findById(req.params.id).populate('user').limit(3).lean()
        const stories = await Story.find({ user: req.user.id, _id: { $ne: req.params.id } }).lean()

        if (!story) {
            return res.render('error/404')
        }

        if (story.user != req.user.id) {
            res.redirect('/stories')
        } else {
            res.render('stories/story', {
                name: req.user.firstName,
                profileImage: req.user.image,
                displayName: req.user.displayName,
                story,
                stories,
                user: req.user
            })
        }
    } catch (err) {
        console.error(err)
        res.render('errors/500')
    }
})

// @desc    Get edit page
// @route  GET /stories/edit/:id
router.get('/edit/:id', ensureAuth, async (req, res) => {
    try {
        const story = await Story.findById(req.params.id).lean()
        if (!story) {
            return res.render('error/404')
        }

        if (story.user != req.user.id) {
            res.redirect('/stories')
        } else {
            res.render('stories/edit', {
                name: req.user.firstName,
                profileImage: req.user.image,
                displayName: req.user.displayName,
                story,
            })
        }
    } catch (err) {
        console.error(err)
        res.render('errors/500')
    }
})

// @desc    Edit story
// @route  PUT  /stories/edit/:id
router.put('/edit/:id', ensureAuth, async (req, res) => {
    try {
        const story = await Story.findById(req.params.id).lean()
        req.body.user = req.user.id
        req.body.published = req.body.published === "publish" ? true : false

        if (!story) {
            return res.render('error/404')
        }

        if (story.user != req.user.id) {
            res.redirect('/stories')
        } else {
            await Story.findByIdAndUpdate(req.params.id, req.body, {
                new: true,

            })
            res.redirect(`/stories/${req.params.id}`)
        }

    } catch (err) {
        console.error(err)
        res.render('errors/500')
    }
})

// @desc    Delete story
// @route  DELETE /stories/:id
router.delete('/:id', ensureAuth, async (req, res) => {
    try {
        await Story.deleteOne({ _id: req.params.id })
        res.redirect('/dashboard')
    } catch (err) {
        console.error(err)
        res.render('errors/500')
    }
})

module.exports = router