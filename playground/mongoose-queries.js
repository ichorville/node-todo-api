const { ObjectID } = require('mongodb');

const { mongoose } = require('../server/db/mongoose');
const { Todo } = require('../server/models/todo');
const { User } = require('../server/models/user');

/**
 *  Get Todo by ID
 */

// a custom id of an existing document in the collection 
// for the time being
const id = '5920008f544c221fd048f347';

// check wether id is valid (follows mongodb id creation algorithm)
if (!ObjectID.isValid(id)) {
    return console.log('Todo ID not valid :(');
}

// returns the object(s) with the given id
Todo.find({
    _id: id // mongoose converts this onto an objectId itself 
}).then((todos) => {
    console.log('Todos ', todos);
});

// return the first object that fits the provided argument
Todo.findOne({
    _id: id 
}).then((todo) => {
    console.log('Todo ', todo);
});

// find by id
Todo.findById(id).then((todo) => {
    if (!todo) {
      return console.log('Id not found');
    }
    console.log('Todo by Id ', todo);
}).catch((error) => console.log(error));

/**
 *  GET User by ID
 */
const userId = '591e95ade7029b0f84128707';

if (!ObjectID.isValid(userId)) {
    return console.log('User ID not valid :(');
}

// find by id
User.findById(userId).then((user) => {
    if (!user) {
      return console.log('Id not found');
    }
    console.log('User by Id ', user);
}).catch((error) => console.log(error));