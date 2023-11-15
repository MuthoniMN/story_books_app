const moment = require('moment')

module.exports = {
    formatDate: function (date, format) {
        return moment(date).format(format)
    },
    stripTags: function (input) {
        return input.replace(/<(?:.|\n)*?>/gm, '')
    },
    editIcon: function (storyUser, loggedUser, storyId, floating = true) {
        if (storyUser._id.toString() == loggedUser._id.toString()) {
            if (floating) {
                return `<a href="/stories/edit/${storyId}" class="btn-floating halfway-fab red darken-1"><i class="fas fa-edit fa-small"></i></a>`
            } else {
                return `<a href="/stories/edit/${storyId}"><i class="fas fa-edit"></i></a>`
            }
        } else {
            return ''
        }
    },
}