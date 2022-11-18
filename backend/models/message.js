const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    text: {
        type: String,
        required: [true, 'Text is required']
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Author is required']
    },
    createdAt: {
        type: Date,
        required: [true, 'Date is required']
    }
});

messageSchema.set('toJSON', {
    transform: function (document, returnedObject) {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject.createdAt;
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
