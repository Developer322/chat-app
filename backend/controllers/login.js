const loginRouter = require('express').Router();
const passport = require('passport');

loginRouter.post('/', passport.authenticate('local'), (request, response) => {
    response.status(200).send({ message: 'Already authenticated' });
});

loginRouter.post('/logout', (request, response, next) => {
    request.logout({}, (err) => {
        if (!err) response.status(200).end();
        if (err) next('Logout error');
    });
});

module.exports = loginRouter;
