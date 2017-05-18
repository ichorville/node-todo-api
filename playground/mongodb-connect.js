// const MongoClient = require('mongodb').MongoClient;

const { MongoClient, ObjectID } = require('mongodb'); // Object destructuring; an ES6 method
 /**
  * Object destructuring simply lets you to grab a property of an object 
  * and assign it into a variable
  * 
  * var user = { name: 'Jay'};
  * var { name } = user;
  * console.log(name) // prints Jay on screen
  */

  /**
   * ObjectID is used to generate unique IDs
   */

  var obj = new ObjectID();
  console.log(obj); 

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
       return console.log('Unable to connect to Mongodb server');
    }

    console.log('Connected to Mongodb server');

    // // insert a document to the collection 'Todos'
    // db.collection('Todos').insertOne({
    //     text: 'Something to do',
    //     completed: 'fasle'
    // }, (err, result) => {
    //     if (err) {
    //         return console.log('Unable to insert todo', err);
    //     }

    //     console.log(JSON.stringify(result.ops, undefined, 4));
    // });

    // // insert a document to the colelction 'Users'
    // db.collection('Users').insertOne({
    //     name: 'Jay Connor',
    //     age: 22,
    //     location: 'Ichorville'
    // }, (err, result) => {
    //     if (err) {
    //         return console.log('Unable to insert user', err);
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 4));
    // });

    db.close();
});