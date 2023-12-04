const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1/fawnModel', { useNewUrlParser: true, useUnifiedTopology: true });

const accountSchema = new mongoose.Schema({
  user: String,
  balance: Number,
});

const Account = mongoose.model('Account', accountSchema);

// setting the initial balance, static approach
const initialBalances = [
  { user: 'Hamza', balance: 600 },
  { user: 'Saad', balance: 100 },
];

async function performTransaction(fromUser, toUser, amount) {
  try {
    // amount check
    const sender = await Account.findOne({ user: fromUser });
    if (!sender || sender.balance < amount) {
      console.log(`${fromUser} does not have sufficient balance to perform the transaction.`);
      throw new Error('Insufficient balance');
    }

    await Account.updateOne({ user: fromUser }, { $inc: { balance: -amount } });
    await Account.updateOne({ user: toUser }, { $inc: { balance: amount } });

    console.log('Transaction successful');
  } catch (error) {
    console.error(`Transaction failed: ${error}`);
  }
}

async function initializeBalances() {
  // Check if initial balances already exist
  const existingBalances = await Account.find();
  if (existingBalances.length === 0) {
    // function initial balance runs, if there is no balance in the database before
    await Account.create(initialBalances);
    console.log('Initial balances created.');
  } else {
    console.log('initial balance already available');
  }
}

async function runTransaction() {
  try {
    // Initialize initial account balance
    await initializeBalances();

    // Print initial account balances
    const initialAccounts = await Account.find();
    console.log('Initial Account Balances:');
    initialAccounts.forEach(account => {
      console.log(`${account.user}: ${account.balance}`);
    });
    // transection, if hamza's balance is greater or equal to the transection amount to be done...
    const hamza = await Account.findOne({ user: 'Hamza' });
    if (hamza && hamza.balance >= 200) {
      await performTransaction('Hamza', 'Saad', 200);
    } else {
      console.log('Hamza doesnot have the enough balance to commit the trasection. Please Recharge again.');
    }

    // Print updated account balances
    const updatedAccounts = await Account.find();
    console.log('Balance after Transaction:');
    updatedAccounts.forEach(account => {
      console.log(`${account.user}: ${account.balance}`);
    });
  } catch (error) {
    console.error(`Error: ${error}`);
  } finally {
    mongoose.connection.close();
  }
}
// run the code....
runTransaction();
