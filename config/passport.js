const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')
const User = require('../models/User')

module.exports = function (passport) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.BASE_URL + '/auth/google/callback'
    },
        async (accessToken, refreshToken, profile, done) => {
            const newUser = {
                googleID: profile.id,
                displayName: profile.displayName,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                image: profile.photos[0].value
            }
            try {
                let user = await User.findOne({ googleID: profile.id })

                if (user) {
                    done(null, user)
                } else {
                    user = await User.create(newUser)
                    done(null, user)
                }
            } catch (err) {
                console.error(err)
            }
        }))

    passport.serializeUser(function (user, cb) {
        process.nextTick(function () {
            return cb(null, user.id);
        });
    });

    passport.deserializeUser(async function (id, cb) {
        try {
            let user = await User.findById(id).exec()

            cb(null, user)
        } catch (err) {
            console.error(err)
        }
    });
}
