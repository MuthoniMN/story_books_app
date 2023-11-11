const mongoose = require('mongoose')

const StorySchema = new mongoose.Schema({
    featuredImage: {
        type: String,
        required: true
    },
    storyTitle: {
        type: String,
        required: true,
        trim: true
    },
    story: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'public',
        enum: ['public', 'private']
    },
    published: {
        type: Boolean,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    createdAt: {
        type: Date
    }
})

module.exports = mongoose.model("Story", StorySchema)