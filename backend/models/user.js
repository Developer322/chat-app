const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            minlength: 3,
            required: [true, 'Username is required'],
            unique: true
        },
        password: {
            type: String,
            minlength: 3,
            required: [true, 'Password is required']
        }
    },
    { timestamps: true }
);

userSchema.pre('save', function (next) {
    const user = this;

    if (!user.isModified('password')) return next();

    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) return next(err);

            user.password = hash;
            next();
        });
    });
});

userSchema.pre('findOneAndUpdate', function (next) {
    let query = this;
    let update = query.getUpdate();

    if (!update.password) {
        return next();
    }

    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);

        bcrypt.hash(update.password, salt, (err, hash) => {
            if (err) return next(err);

            update.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

userSchema.plugin(uniqueValidator);

userSchema.set('toJSON', {
    transform: function (document, returnedObject) {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.password;
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
