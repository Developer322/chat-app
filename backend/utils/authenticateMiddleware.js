const passport = require('passport');
const User = require('../models/user.js');
const LocalStrategy = require('passport-local').Strategy;

const authenticate = (app) => {
    passport.use(
        new LocalStrategy((username, password, done) => {
            User.findOne({ username: username }, (err, user) => {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false, { message: 'User not found.' });
                }
                if (!user.comparePassword(password)) {
                    return done(null, false, { message: 'Invalid password.' });
                }
                return done(null, user);
            });
        })
    );

    passport.serializeUser((user, done) => {
        done(null, { id: user._id, username: user.username });
    });

    passport.deserializeUser((user, done) => {
        User.findById(user.id, (err, user) => {
            if (err) {
                return done(err);
            }
            done(null, user);
        });
    });

    app.use(passport.initialize());
    app.use(passport.session());
};

module.exports = authenticate;
