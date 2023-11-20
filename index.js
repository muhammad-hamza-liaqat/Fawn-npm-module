const mongoose = require('mongoose');
const Fawn = require('fawn');

mongoose.Promise = global.Promise;


mongoose.connect('mongodb://localhost:27017/fawnModel');


const db = mongoose.connection;


db.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});


db.once('open', async () => {
    console.log('Mongoose connection established.');

      Fawn.init("mongodb://localhost:27017/fawnModel");

    
    try {
        await Fawn.Task()
            .save('Person', { name: 'John Doe', age: 30, email: 'john@example.com' })
            .update('Person', { name: 'John Doe' }, { $set: { age: 31 } })
            .run();

        console.log('Transaction completed successfully.');
    } catch (error) {
        console.error('Transaction failed:', error);
    } finally {
        mongoose.connection.close();
    }
});
