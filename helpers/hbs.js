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
    getStatus: function (status) {
        return status === 'public'
    },
    select: function (selected, options) {
        return options
            .fn(this)
            .replace(
                new RegExp(' value="' + selected + '"'),
                '$& selected="selected"'
            )
            .replace(
                new RegExp('>' + selected + '</option>'),
                ' selected="selected"$&'
            )
    },
    deleteIcon: function (storyUser, loggedUser, storyId) {
        if (storyUser._id.toString() == loggedUser._id.toString()) {
            return `<div class="credentials editAndDelete right">
                <a href="/stories/edit/${storyId}" class="btn halfway-fab red darken-1"><i class="fas fa-edit fa-small"></i></a>
                <form action="/stories/{{_id}}" method="post">
                        <input type="hidden" name="_method" value="DELETE">
                        <button type="submit" class="btn red darken-1"><i class="fa-solid fa-trash fa-lg"></i></button>
                    </form>
            </div>`
        }
    },
}