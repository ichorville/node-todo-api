const mongoose = require('mongoose');

/** Create a Todo Model */
var Todo = mongoose.model('Todo', {
    text: {
        type: String,
        required: true, // this property is a must
        minlength: 1,   // minimum length should be one; not even ''
        trim: true      // removes all whitespaces: eg '   john'
    }, 
    completed: {
        type: Boolean,
        default: false
    }, 
    completedAt: {
        type: Number, 
        default: null
    },
    _creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});

module.exports = { Todo };