const { MongoClient, ObjectID } = require('mongodb'); // Object destructuring; an ES6 method

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
       return console.log('Unable to connect to Mongodb server');
    }

    console.log('Connected to Mongodb server');

    db.collection('Todos').findOneAndUpdate({
        _id: new ObjectID('591d5be396d5294c4135a9bd')
    }, {
        $set: {
            completed: true
        }
    }, {
        returnOriginal: false
    }).then((result) => {
        console.log(result);
    });

    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID('591d46f89d114b2204f969ea')
    }, {
        $set: {
            name: 'Jennifer'
        },
        $inc: {
            age: 1
        }
    }, {
        returnOriginal: false
    }).then((result) => {
        console.log(result);
    });

    // db.close();
});