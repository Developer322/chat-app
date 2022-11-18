const userRouter = require('express').Router();
const User = require('../models/user.js');
const sanitize = require('mongo-sanitize');
const passport = require('passport');

userRouter.post(
    '/',
    async (request, response, next) => {
        try {
            const username = sanitize(request?.body?.username);
            const password = sanitize(request?.body?.password);

            if (
                !(
                    typeof username === 'string' &&
                    username.length >= 3 &&
                    typeof password === 'string' &&
                    password.length >= 3
                )
            ) {
                next({
                    statusCode: 400,
                    message: 'Username or password is invalid'
                });
            }

            const user = new User({ username, password });
            request.savedUser = await user.save();
            next();
        } catch (err) {
            next(err);
        }
    },
    passport.authenticate('local'),
    (request, response) => {
        response.status(200).send(request?.session?.passport?.user);
    }
);

module.exports = userRouter;
