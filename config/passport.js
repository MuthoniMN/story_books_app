const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')
const User = require('../models/User')

module.exports = function (passport) {
    passport.use(GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback'
    },
        async (accessToken, refreshToken, profile, done) => {
            console.log(profile)
        }))

    passport.serializeUser(function (user, cb) {
        process.nextTick(function () {
            return cb(null, user.id);
        });
    });

    passport.deserializeUser(function (id, cb) {
        User.findById(id, (err, user) => cb(err, user))
    });
}