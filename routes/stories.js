const express = require("express")
const router = express.Router()
const { ensureAuth } = require("../middleware/auth")

// @desc    Get story page
// @route /stories/add
router.get('/add', ensureAuth, (req, res) => {
    res.render('stories/add')
})

module.exports = router