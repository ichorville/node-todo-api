require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

const { ObjectID } = require('mongodb');
const { mongoose } = require('./db/mongoose');

const { Todo } = require('./models/todo');
const { User } = require('./models/user');

const { authenticate } = require('./middleware/authenticate');

var app = express();

const port = process.env.PORT; 

app.use(bodyParser.json());

/** TODOS CONFIG */
/** 
 *  GET all todos
 */
app.get('/todos', (request, response) => {
    Todo.find().then((todos) => {
        response.send({
            // returned as an object so we could change the return value as we want
            todos: todos 
        });
    }, (error) => {
        response.status(400).send(error);
    });
});

/** 
 *  GET todo by ID
 */
app.get('/todos/:id', (request, response) => {
    // derive id from params from browser url
    var id = request.params.id;

    if (!ObjectID.isValid(id)) {
        // send back an empty body if invalid id is present
        return response.status(404).send();
    }

    Todo.findById(id).then((todo) => {
        if (!todo) {
            return response.status(404).send();
        }
        response.send({ 
            todo: todo 
        });
    }, (error) => {
        response.status(400).send(error);
    });
});

/** 
 *  POST todo
 */
app.post('/todos', (request, response) => {
    var todo = new Todo({
        text: request.body.text
    });

    todo.save().then((document) => {
        response.send(document);
    }, (error) => {
        response.status(400).send(error);
    });
});

/** 
 *  Delete todos
 */
app.delete('/todos/:id', (request, response) => {
    var id = request.params.id;

    if (!ObjectID.isValid(id)) {
        return response.status(404).send();
    }

    Todo.findByIdAndRemove(id).then((todo) => {
        if (!todo) {
            return response.status(404).send();
        }
        response.status(200).send({
            todo: todo
        });
    }).catch((error) => response.status(400).send());
});

/**
 *  Update Todo(s)
 */
app.patch('/todos/:id', (request, response) => {
    var id = request.params.id;
    // this consists of the subset of data the user pases to the url
    var body = _.pick(request.body, ['text', 'completed']);

    if (!ObjectID.isValid(id)) {
        return response.status(404).send();
    }

    // if body.completed is a boolean and if the property is true
    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    // find document by id and update
    Todo.findByIdAndUpdate(
        id,
        { $set: body },
        // return the new updated document
        { new: true }).then((todo) => {
            if (!todo) {
                return response.status(404).send();
            }
            response.send({
                todo: todo
            });
        }).catch((error) => response.status(404).send());
});

/** USER CONFIG */
/**
 *  POST user / Sign up
 */
app.post('/users', (request, response) => {
    var body = _.pick(request.body, ['email', 'password']);
    var user = new User(body);

    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        response.header('x-auth', token).send(user);
    }).catch((error) => {
        response.status(400).send(error);
    });
});

/**
 *  Login User
 */
app.post('/users/login', (request, response) => {
    var body = _.pick(request.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password).then((user) => {
        // generate token for the user if user exists (login is successful)
        return user.generateAuthToken().then((token) => {
            response.header('x-auth', token).send(user);
        });
    }).catch((error) => response.status(400).send());
});

/**
 *  GET current User
 */
app.get('/users/me', authenticate, (request, response) => {
    response.send(request.user);
});

app.listen(port, () => {
    console.log(`Server running on port ${ port }`);
});

/**
 *  DELETE user
 */
app.delete('/users/me/token', authenticate, (request, response) => {
    request.user.removeToken(request.token).then(() => {
        response.status(200).send();
    }, (error) => {
        response.status(400).send();
    });
});

module.exports = { app };