var express = require('express');
var bodyParser = require('body-parser');

var { ObjectID } = require('mongodb');
var { mongoose } = require('./db/mongoose');

var { Todo } = require('./models/todo');
var { User } = require('./models/user');

var app = express();

const port = process.env.PORT || 3000;

app.use(bodyParser.json());

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

app.listen(port, () => {
    console.log(`Server running on port ${ port }`);
});

module.exports = { app };