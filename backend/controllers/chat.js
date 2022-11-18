const chatRouter = require('express').Router();
const Chat = require('../models/chat.js');

chatRouter.get('/', async (request, response, next) => {
    try {
        if (request.isAuthenticated()) {
            const chats = await Chat.find({});
            response.status(200).send(chats);
        } else {
            response.status(403).json({ message: 'Not authorized' });
        }
    } catch (err) {
        next(err);
    }
});

module.exports = chatRouter;
