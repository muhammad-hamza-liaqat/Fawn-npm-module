const mongoose = require ('mongoose');
const Fawn = require ('fawn');

mongoose.connect('mongodb://127.0.0.1/fawnModel');
const accountSchema = new mongoose.Schema({
  user: String,
  balance: Number,
});
const Account = mongoose.model('Account', accountSchema);
// Initialize Fawn
Fawn.init(mongoose);
async function performTransaction(fromUser, toUser, amount) {
  try {
    await Fawn.Task()
      .update('accounts', { user: fromUser }, { $inc: { balance: -amount } })
      .update('accounts', { user: toUser }, { $inc: { balance: amount } })
      .run();
    console.log('Transaction successful');
  } catch (error) {
    console.error(`Transaction failed: ${error}`);
  }
}
async function runFawn() {
  try {
    await Account.create([
      {user:'Hamza', balance : 150},
      {user:'Saad', balance : 100}
    ])
    const initialAccounts = await Account.find();
    console.log('Initial Account Balances:');
    initialAccounts.forEach(account => {
      console.log(`${account.user}: ${account.balance}`);
    });
    // Perform a transaction
    await performTransaction('Hamza', 'Saad', 50);
    const updatedAccounts = await Account.find();
    console.log('Balance after Transaction:');
    updatedAccounts.forEach(account => {
      console.log(`${account.user}: ${account.balance}`);
    });
  } catch (error) {
    console.error(`Error: ${error}`);
  }
}
runFawn();