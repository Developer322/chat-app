const cors = require('cors');
const helmet = require('helmet');
const rateLimiter = require('express-rate-limit');
const slowDown = require('express-slow-down');

const secure = (app) => {
    app.use((req, res, next) => {
        res.removeHeader('X-Powered-By');
        next();
    });

    //app.use(
    //  cors({
    //    origin: [
    //      'http://localhost:3000',
    //      'http://localhost:3001'
    //    ],
    //    credentials: true
    //  })
    //);

    app.use(helmet());

    const limiter = rateLimiter({
        windowMs: 1 * 60 * 1000,
        max: 120
    });

    const speedLimiter = slowDown({
        windowMs: 1 * 60 * 1000,
        delayAfter: 100,
        delayMs: 1000
    });

    app.use(limiter);
    app.use(speedLimiter);
};

module.exports = secure;
