const expect = require('expect');
const request = require('supertest');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');

/**
 * Before each test the Todo Collection is set to empty so that we can 
 * proceed with the idea of the Collection is empty for each test that we 
 * encounter in the test suite.
 */
beforeEach((done) => {
    Todo.remove({}).then(() => done());
});

// test for creating a new todo
describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        var text = 'Test todo text';

        request(app)
            // send to post route
            .post('/todos')               
            // send post data              
            .send({ text })               
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
                 * at this point no errors so we can test the data that is entered 
                 * to our collection in the mongodb driver
                 */
                Todo.find().then((todos) => {
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
        .expect((response) => {
            expect(response.body.text).toBe();
        })
        .end((error, response) => {
            if (error) {
                return doNotTrack(error);
            }
            Todo.find().then((todos) => {
                expect(todos.length).toBe(0);
                expect(todos[0]).toBe();
                done();
            }).catch((e) => done(e));
        });
    });
});