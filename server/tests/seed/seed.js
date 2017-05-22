const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');

const { Todo } = require('../../models/todo'); 
const { User } = require('../../models/user');

var userOneId = new ObjectID();
var userTwoId = new ObjectID();
 
const todos = [
    {   
        _id: new ObjectID(),
        text: 'First test todo',
        _creator: userOneId
    },
    {
        _id: new ObjectID(),
        text: 'Second test todo',
        completed: true,
        completedAt: 233629,
        _creator: userTwoId
    }
];

const users = [
    {
        _id: userOneId,
        email: 'jay@example.com',
        password: 'userOnePass',
        tokens: [
            {
                access: 'auth',
                token: jwt.sign({ _id: userOneId, access: 'auth' }, 'ichorville').toString()
            }
        ]
    },
    {
        _id: userTwoId,
        email: 'mjzeel@gmail.com',
        password: 'userTwoPass',
        tokens: [
            {
                access: 'auth',
                token: jwt.sign({ _id: userTwoId, access: 'auth' }, 'ichorville').toString()
            }
        ]
    }
];

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        // a mongoose functon which adds data to the collection
        return Todo.insertMany(todos);
    }).then(() => done());
};

const populateUsers = (done) => {
    User.remove({}).then(() => {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save(); 

        // results to wait so when the promise resolves, the two users are
        // added into the database with no harm done
        return Promise.all([userOne, userTwo]);
    }).then(() => done());
};

module.exports = {
    todos, 
    users,
    populateTodos,
    populateUsers
};