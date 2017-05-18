const { MongoClient, ObjectID } = require('mongodb'); 

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
       return console.log('Unable to connect to Mongodb server');
    }

    console.log('Connected to Mongodb server');

    //Delete Many documents
    db.collection('Todos').deleteMany({ text: 'Eat lunch'}).then((result) => {
        console.log('Delete Many');
        console.log(result);
    });

    // Delete one document
    /**
     * this method deletes one of many documents(multiple documents) where if u find
     * multiple documents, it only deletes the first one and stops right there
     */
    db.collection('Todos').deleteOne({ text: 'Eat lunch'}).then((result) => {
        console.log('Delete Many');
        console.log(result);
    });

    // Find one and delete one
    /**
     * this method finds the first object that fits the argument and returns 
     * the document to the user reporting the status
     */
    db.collection('Todos').findOneAndDelete({ completed: false }).then((result) => {
        console.log('Find one and Delete one');
        console.log(result);
    });

    db.collection('Users').deleteMany({ name: 'Jake' }).then((result) => {
        console.log('Delete all Jake(s)');
        console.log(result);
    });

     db.collection('Users').findOneAndDelete({
         _id: ObjectID('591d5f3a96d5294c4135aa8c')
     }).then((result) => {
        console.log('Delete Harper');
        console.log(result);
    });


    // db.close();
});