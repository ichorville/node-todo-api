const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

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
// this is an instance method
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

// Remove token from user when logging out
UserSchema.methods.removeToken = function(token ) {
    var user = this;

    return user.update({
        // another mongoose operator to remove items from an array in the database
        $pull: {
            tokens: {
                token: token
            }
        }
    });
};

// Find user by token; a static method
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

/** Find login user */
UserSchema.statics.findByCredentials = function(email, password) {
    var User = this;
    
    // get user by the email first
    return User.findOne({ email }).then((user) => {
        if (!user) {
            return Promise.reject();
        }

        // since bcrypt methods always work inside callbacks a new Promise is created
        // to access the bcrypt.compare method to compare the password
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (error, response) => {
                console.log(response);
                if (response) {
                    resolve(user);
                } else {
                    reject();
                }
            });
        });
    });
};



/** Before saving a user */
UserSchema.pre('save', function (next) {
    var user = this;

    if (user.isModified('password')) {
        bcrypt.genSalt(10, (error, salt) => {
            bcrypt.hash(user.password, salt, (error, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

/** Create a User Model */
var User = mongoose.model('User', UserSchema);

module.exports = { User };