const expect = require('expect');
const request = require('supertest');

const { app } = require('../server');
const { Todo } = require('../models/todo');

const todos = [
    {
        text: 'First test todo'
    },
    {
        text: 'Second test todo'
    }
];

beforeEach((done) => {
    Todo.remove({}).then(() => {
        // a mongoose functon which adds data to the collection
        return Todo.insertMany(todos);
    }).then(() => done());
});

/**
 *  GET todos tests
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