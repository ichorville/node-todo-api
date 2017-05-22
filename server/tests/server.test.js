const expect = require('expect');
const request = require('supertest');

const { ObjectID } = require('mongodb');

const { app } = require('../server');
const { Todo } = require('../models/todo');
const { User } = require('../models/user');

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
            .set('x-auth', users[0].tokens[0].token)           
            .expect(200)
            .expect((response) => {
                // return the todos array if successful of the logged user
                expect(response.body.todos.length).toBe(1);
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
            .set('x-auth', users[0].tokens[0].token)   
            .expect(200)
            .expect((response) => {
                expect(response.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('should not return todo document created by other users', (done) => {
        request(app)
            .get(`/todos/${todos[1]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)   
            .expect(404)
            .end(done);
    });

    it('should return 404 if todo not found', (done) => {
        request(app)
            .get(`/todos/${new ObjectID()}`)
            .set('x-auth', users[0].tokens[0].token)   
            .expect(404)
            .end(done);
    });

    it('should return 404 for non-object ids', (done) => {
        request(app)
            .get(`/todos/123`)
            .set('x-auth', users[0].tokens[0].token)   
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
            // send headers
            .set('x-auth', users[0].tokens[0].token)           
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
        .set('x-auth', users[0].tokens[0].token)           
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
            .set('x-auth', users[1].tokens[0].token)        
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

    it('should not remove todo(s) of other users', (done) => {
        var hexId = todos[0]._id.toHexString();

        request(app)
            .delete(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)        
            .expect(404)
            .end((error, response) => {
                if (error) {
                    return done(error);
                }
                // checks wether id still exists 
                Todo.findById(hexId).then(result => {
                    expect(result).toExist ();
                    done();
                }).catch((error) => done(error));
            });
    });

    it('should return 404 if todo not found', (done) => {
        request(app)
            .delete(`/todos/${new ObjectID()}`)
            .set('x-auth', users[1].tokens[0].token)  
            .expect(404)
            .end(done);
    });

    it('should return 404 if object is invalid', (done) => {
        request(app)
            .delete(`/todos/2222222`)
            .set('x-auth', users[1].tokens[0].token)  
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
            .set('x-auth', users[0].tokens[0].token)  
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

    it('should not update tod0(s) of other users', (done) => {
        var id = todos[0]._id.toHexString();
        var text = 'We take it back';

        request(app)
            .patch(`/todos/${id}`)
            .set('x-auth', users[1].tokens[0].token)  
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
            .set('x-auth', users[1].tokens[0].token)  
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

/**
 * Authenticate User(s) tests
 */
describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            // set the headers through supertest
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((response) => {
                expect(response.body._id).toBe(users[0]._id.toHexString());
                expect(response.body.email).toBe(users[0].email);
            })
            .end(done);
    });

    it('should return 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((response) => {
                expect(response.body).toEqual({})
            })
            .end(done);
    });
});

/**
 *  Sign up User
 */
describe('POST /users', () => {
    it('should create a user', (done) => {
        var email = 'example@example.com';
        var password = '123adc!';

        request(app)
            .post('/users')
            .send({
                email: email,
                password: password
            })
            .expect(200)
            .expect((response) => {
                expect(response.headers['x-auth']).toExist();
                expect(response.body._id).toExist();
                expect(response.body.email).toBe(email);
            })
            .end((error) => {
                // for further testing we query the collection to check if user exists
                if (error) {
                    return done(error);
                }

                User.findOne({ email: email }).then((user) => {
                     expect(user).toExist();
                     expect(user.password).toNotBe(password);
                     done();
                }).catch((error) => done(error));
            });
    });

    it('should return validation errors if request invalid', (done) => {
        var email = 'any.email';
        var password = '123';

        request(app)
            .post('/users')
            // send a user with insufficient credentials
            .send({
                email: email,
                password: password
            })
            .expect(400)
            .end(done);
    });

    it('should not create user if email is in use', (done) => {
        request(app)
            .post('/users')
            // send a user with insufficient credentials
            .send({
                email: users[0].email,
                password: 'anypass'
            })
            .expect(400)
            .end(done);
    });
});

/**
 *  Login user test
 */
describe('POST /users/login', () => {
    it('should login user and return auth token', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: users[1].password
            })
            .expect(200)
            .expect((response) => {
                expect(response.headers['x-auth']).toExist();
            })
            .end((error, response) => {
                if (error) {
                    return done(error);
                }

                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens[1]).toInclude({
                        access: 'auth',
                        token: response.header['x-auth']
                    });
                    done();
                }).catch((error) => done(error));
            });
    });

    it('should reject invalid login', (done) => {
        request(app)
            .post('/users/login')
            // provide invalid login credentials
            .send({
                email: users[1].email,
                password: users[1].password + 'somecustompassword'
            })
            .expect(400)
            .expect((response) => {
                expect(response.headers['x-auth']).toNotExist();
            })
            .end((error, response) => {
                if (error) {
                    return done(error);
                }

                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens.length).toBe(1);
                    done();
                }).catch((error) => done(error));
            });
    });

});

/** 
 *  Delete User test
 */
describe('DELETE /users/me/token', () => {
    it('should remove auth token on logout', (done) => {
        request(app)
            .delete('/users/me/token')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .end((error, response) => {
                if (error) {
                    return done(error);
                }

                User.findById(users[0]._id).then((user) => {
                    expect(user.tokens[0]).toNotExist();
                    done();
                }).catch((error) => done(error));
            });
    });
});