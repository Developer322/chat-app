const express = require('express');
const app = express();
const userRouter = require('./controllers/user.js');
const chatRouter = require('./controllers/chat.js');
const loginRouter = require('./controllers/login.js');
const secure = require('./utils/secureMiddleware.js');
const authenticate = require('./utils/authenticateMiddleware.js');
const errorHandlerMiddleware = require('./utils/errorHandler.js');
const mongoose = require('mongoose');
const session = require('express-session');
const config = require('./utils/config.js');
const MongoStore = require('connect-mongo');
const path = require('path');

//manage with gzipped files

app.use(express.json({ limit: '10kb' }));

const mongoUrl = config.MONGODB_URI;
mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const sessionStore = MongoStore.create({
    mongoUrl: mongoUrl,
    ttl: 14 * 24 * 60 * 60,
    autoRemove: 'native',
    collectionName: 'sessions'
});

const sessionMiddleware = session({
    secret: 'jtuftnvygt6655443jhxd309vcz5',
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: { maxAge: 60 * 60 * 1000 }
});

app.use(sessionMiddleware);

secure(app);
authenticate(app);

app.use((request, response, next) => {
    if (request.isAuthenticated()) {
        express.static('static/images')(request, response, next);
    } else {
        next();
    }
});

app.use('/api/user', userRouter);
app.use('/api/chats', chatRouter);
app.use('/api/login', loginRouter);

app.get('*.js', (request, response, next) => {
    request.url = `${request.url}.gz`;
    response.set('Content-Encoding', 'gzip');
    response.set('Content-Type', 'text/javascript');
    next();
});

app.get('*.css', (request, response, next) => {
  request.url = `${request.url}.gz`;
  response.set('Content-Encoding', 'gzip');
  response.set('Content-Type', 'text/css');
  next();
});

app.use(express.static('static/build'));

app.get('*', (request, response) => {
    response.sendFile(path.resolve(__dirname, 'static/build/index.html'));
});

app.use(errorHandlerMiddleware);

module.exports = { app, sessionMiddleware };
