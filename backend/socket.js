const Message = require('./models/message.js');
const Chat = require('./models/chat.js');
const mongoose = require('mongoose');
const { Server } = require('socket.io');

const addMessageHandler = (server, sessionMiddleware) => {
    const io = new Server(server, {
        allowRequest: (request, callback) => {
            const noOriginHeader = request.headers.origin === undefined;
            callback(null, noOriginHeader);
        }
    });

    const wrap = (middleware) => (socket, next) =>
        middleware(socket.request, {}, next);
    io.use(wrap(sessionMiddleware));

    const getMessages = async (chatId) => {
        //only 50 last messages returned
        const chat = await Chat.findById(chatId)
            .slice('messages', 50)
            .populate({
                path: 'messages',
                populate: {
                    path: 'author',
                    model: 'User',
                    select: 'username'
                }
            })
            .exec();

        return chat?.messages;
    };

    const onConnection = (socket) => {
        const { chatId } = socket.handshake.query;
        const user = socket?.request?.session?.passport?.user;
        if (!user) {
            return;
        }
        socket.chatId = chatId;
        socket.user = user;
        socket.join(chatId);

        socket.on('disconnect', () => socket.leave(chatId));

        socket.on('message:add', async ({ text }) => {
            const newMessage = {
                author: mongoose.Types.ObjectId(user.id),
                text,
                createdAt: new Date()
            };
            const addedMessage = await Chat.findOneAndUpdate(
                { _id: mongoose.Types.ObjectId(socket.chatId) },
                { $push: { messages: newMessage } }
            );
            newMessage.author = {
                id: user.id,
                username: user.username
            };
            const result = {
                text,
                createdAt: newMessage.createdAt,
                author: {
                    id: user.id,
                    username: user.username
                }
            };

            io.in(chatId).emit('messages', [result]);
        });

        socket.on('message:get', async () => {
            const messages = await getMessages(socket.chatId);
            io.to(socket.id).emit('messages', messages);
        });
    };

    io.on('connection', onConnection);
};

module.exports = addMessageHandler;
