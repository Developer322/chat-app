const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
    {
        alt: {
            type: String,
            required: [true, 'Alt is required']
        },
        title: {
            type: String,
            required: [true, 'Title is required']
        },
        subtitle: {
            type: String,
            required: [true, 'Subtitle is required']
        },
        avatar: {
            type: String,
            required: [true, 'Avatar link is required']
        },
        messages: ['Message']
    },
    { timestamps: true }
);

chatSchema.set('toJSON', {
    transform: function (document, returnedObject) {
        returnedObject.id = returnedObject._id.toString();
        returnedObject.date = returnedObject.updatedAt;
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.createdAt;
        delete returnedObject.updatedAt;
    }
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
