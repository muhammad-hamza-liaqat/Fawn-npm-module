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
    // instead of using fawn.init("mongoose"), uses this line it will resolve the issue module instance not declared!
    Fawn.init("mongodb://localhost:27017/fawnModel");

    // schema
    const bankAccountSchema = new mongoose.Schema({
        accountNumber: { type: String, required: true, unique: true },
        balance: { type: Number, default: 0 },
    });

    // Create the BankAccount model
    const BankAccount = mongoose.model('BankAccount', bankAccountSchema);

    try {
        // Create two bank accounts
        await BankAccount.create([
            { accountNumber: 'account101', balance: 1500 },
            { accountNumber: 'account202', balance: 500 },
        ]);

        console.log('Initial bank account balances:');
        const initialBalances = await BankAccount.find();
        console.log(initialBalances);

        // Use Fawn to perform a transaction: Transfer $200 from account '123456' to '789012'
        await Fawn.Task()
            .update('BankAccount', { accountNumber: 'Uniqueaccount101' }, { $inc: { balance: -1000 } })
            .update('BankAccount', { accountNumber: 'account202' }, { $inc: { balance: +1000 } })
            .run();

        console.log('Transaction completed successfully.');

        // Check the final balances after the transaction
        const finalBalances = await BankAccount.find();
        console.log('Final bank account balances:');
        console.log(finalBalances);
    } catch (error) {
        console.error('Transaction failed:', error);
    } finally {
        mongoose.connection.close();
    }
});
