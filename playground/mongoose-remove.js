const { ObjectID } = require('mongodb');

const { mongoose } = require('../server/db/mongoose');
const { Todo } = require('../server/models/todo');
const { User } = require('../server/models/user');

// removes all documents from the collection
Todo.remove({}).then((result) => {
    console.log(result);
});

// Todo.findOneAndRemove
Todo.findOneAndRemove({_id:'some id' }).then((result) => {
    // deletes the first item that matches the peovided argument
    console.log(result);
});

// remove document by id
Todo.findByIdAndRemove(`some id`).then((result) => {
    console.log(result);
});