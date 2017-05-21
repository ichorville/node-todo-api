const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

/** Create a User Schema in Mongodb */
var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{ VALUE } is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    }, 
    tokens: [{
        access: {
            type: String, 
            required: true
        },
        token: {
            type: String, 
            required: true
        }
    }]
});

// limit the response option that sends off from the server
UserSchema.methods.toJSON = function() {
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);
};


// fasleproof User schema by providing necessary properties for signUp/ Login
UserSchema.methods.generateAuthToken = function() {
    var user = this; // access the current user

    var access = 'auth';

    var token = jwt.sign({ _id: user._id.toHexString(), access: access }, 'ichorville').toString();

    user.tokens.push({
        access:  access,
        token: token
    });

    // the return value will be succesfully passed to the next then() call
    return user.save().then(() => {
        return token;
    });
};

// Find user by token
UserSchema.statics.findByToken = function(token) {
    var User = this; //  access from all users
    var decoded;

    try {
        decoded = jwt.verify(token, 'ichorville');
    } catch (error) {
        return Promise.reject();
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

/** Create a User Model */
var User = mongoose.model('User', UserSchema);

module.exports = { User };