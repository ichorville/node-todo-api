var mongoose = require('mongoose');

/** Create a User Model */
var User = mongoose.model('User', {
    email: {
        type: String,
        require: true,
        minlength: 1,
        trim: true
    }
});

module.exports = { User };