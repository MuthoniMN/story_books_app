const express = require("express")
const router = express.Router()

// @desc    Add a story
// @route /stories/add
router.get('/add', (req, res) => {
    res.render('stories/add')
})

module.exports = router