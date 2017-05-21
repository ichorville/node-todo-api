const expect = require('expect');
const request = require('supertest');

const { ObjectID } = require('mongodb');

const { app } = require('../server');
const { Todo } = require('../models/todo');

const { todos, users, populateTodos, populateUsers } = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

/**
 *  GET todos test
 */
describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((response) => {
                // return the todos array if successful
                expect(response.body.todos.length).toBe(2);
            })
            .end(done);
            // no further customizations are necessary as we are only testing 
            // to get all documents from the collection
    });
});

/**
 *  GET todo by id
 */
describe('GET /todos/:id', () => {
    it('should return todo document', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((response) => {
                expect(response.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('should return 404 if todo not found', (done) => {
        request(app)
            .get(`/todos/${new ObjectID()}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 for non-object ids', (done) => {
        request(app)
            .get(`/todos/123`)
            .expect(404)
            .end(done);
    });
});

/**
 *  POST todos tests
 */
// test for creating a new todo
describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        var text = 'Test todo text';

        request(app)
            // send to post route
            .post('/todos')               
            // send post data              
            .send({ text: text })               
            // expect http post call to be 200        
            .expect(200)                                
            .expect((response) => {
                // the return data to be of type text
                expect(response.body.text).toBe(text);  
            })
            .end((error, response) => {
                if (error) {
                    // show any error if present
                    return done(error);                 
                }
                /**
                 * at this point no errors so we can test wether the data that is entered 
                 * to our collection is in the mongodb driver
                 */
                Todo.find({ text }).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => done(e));
            });
    });
});

// should not crete a todo when invalid data is passed
describe('POST /todos', () => {
    it('should not create a new todo', (done) => {
        request(app)
        .post('/todos')
        .send({})
        .expect(400)
        .end((error, response) => {
            if (error) {
                return done(error);
            }
            Todo.find().then((todos) => {
                expect(todos.length).toBe(2);
                done();
            }).catch((e) => done(e));
        });
    });
});

/**
 *  DELETE todos
 */
describe('DELETE /todos/:id', () => {
    it('should remove a todo', (done) => {
        var hexId = todos[1]._id.toHexString();

        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect((response) => {
                // check wether deleted id is same as passed argument
                expect(response.body.todo._id).toBe(hexId);
            })
            .end((error, response) => {
                if (error) {
                    return done(error);
                }
                // checks wether deleted id still exists 
                Todo.findById(hexId).then(result => {
                    expect(result).toNotExist();
                    done();
                }).catch((error) => done(error));
            });
    });

    it('should return 404 if todo not found', (done) => {
        request(app)
            .delete(`/todos/${new ObjectID()}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 if object is invalid', (done) => {
        request(app)
            .delete(`/todos/2222222`)
            .expect(404)
            .end(done);
    });
});

/** 
 * UPDATE todo(s)
 */
describe('PATCH /todos/:id', () => {
    it('should update the todo', (done) => {
        var id = todos[0]._id.toHexString();
        var text = 'We take it back';

        request(app)
            .patch(`/todos/${id}`)
            .send({
                text: text,
                completed: true
            })
            .expect(200)
            .expect((response) => {
                expect(response.body.todo.text).toBe(text); 
                expect(response.body.todo.completed).toBe(true); 
                expect(response.body.todo.completedAt).toBeA('number');
            })
            .end(done);
    });

    it('should clear completedAt when todo is not completed', (done) => {
        var id = todos[1]._id.toHexString();
        var text = 'Test todo text';

        request(app)
            .patch(`/todos/${id}`)
            .send({
                text: text,
                completed: false
            })
            .expect(200)
            .expect((response) => {
                expect(response.body.todo.text).toBe(text); 
                expect(response.body.todo.completed).toBe(false); 
                expect(response.body.todo.completedAt).toNotExist();
            })
            .end(done);
    });
});
