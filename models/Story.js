const mongoose = require('mongoose')

const StorySchema = new mongoose.Schema({
    featuredImage: {
        type: String,
        required: true
    },
    storyTitle: {
        type: String,
        required: true
    },
    story: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: draft
    },
    published: {
        type: Boolean,
        required: true
    },
    createdAt: {
        type: Date
    }
})

module.exports = mongoose.model("Story", StorySchema)