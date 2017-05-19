var mongoose = require('mongoose');

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
    }
});

module.exports = { Todo };