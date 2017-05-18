const { MongoClient, ObjectID } = require('mongodb'); // Object destructuring; an ES6 method

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
       return console.log('Unable to connect to Mongodb server');
    }

    console.log('Connected to Mongodb server');

    // find all documents
    db.collection('Todos').find().toArray().then((docs) => {
        console.log('All Todos')
        console.log(JSON.stringify(docs, undefined, 4));
    }, (err) => {
        console.log('Unable to fetch todos');
    });

    // find only incomplete todos
    db.collection('Todos').find({ completed: false }).toArray().then((docs) => {
        console.log('Incomplete');
        console.log(JSON.stringify(docs, undefined, 4));
    }, (err) => {
        console.log('Unable to fetch todos');
    });

    // find todos by id
    db.collection('Todos').find({ 
        _id: ObjectID('591d4f7378de1b31a30aa89d') // have to aqquire id in such a way
    }).toArray().then((docs) => {
        console.log('Get by ID');
        console.log(JSON.stringify(docs, undefined, 4));
    }, (err) => {
        console.log('Unable to fetch todos');
    });

    // get todos count
    db.collection('Todos').find().count().then((count) => {
        console.log(`Todo count is: ${count}`);
    }, (err) => {
        console.log('Unable to fetch todos');
    });

    // find all users
    db.collection('Users').find().toArray().then((docs) => {
        console.log('All Users')
        console.log(JSON.stringify(docs, undefined, 4));
    }, (err) => {
        console.log('Unable to fetch users');
    });

    // find all users: name is Jay
    db.collection('Users').find({ name: 'Jay Connor' }).toArray().then((docs) => {
        console.log('All Users: name is Jay Connor')
        console.log(JSON.stringify(docs, undefined, 4));
    }, (err) => {
        console.log('Unable to fetch users');
    });

    // find all users count
    db.collection('Users').find().count().then((count) => {
        console.log(`User count is ${count}`);
    }, (err) => {
        console.log('Unable to fetch users');
    });
    
    // db.close();
});