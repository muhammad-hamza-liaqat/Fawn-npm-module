const mongoose = require('mongoose');
const Fawn = require('fawn');

mongoose.connect('mongodb://localhost:27017/fawn');
const accountSchema = new mongoose.Schema({
  user: String,
  balance: Number,
});
const Account = mongoose.model('Account', accountSchema);
Fawn.init(mongoose);

async function performTransaction(fromUser, toUser, amount) {
  try {
    // Start the Fawn task
    await Fawn.Task()
      // Update sender  and receiver balance
      .update('accounts', { user: fromUser }, { $inc: { balance: -amount } })
      .update('accounts', { user: toUser }, { $inc: { balance: amount } })
      .run();
    console.log('Transaction successful');
  } catch (error) {
    console.error(`Transaction failed: ${error}`);
  }
  // const roller = Fawn.Roller();
  // await roller.roll();
  // console.log('Incomplete transactions rolled back');
}
async function main() {
  try {
    // insert initial data
    // await Account.create([
    //   { user: 'Talha', balance: 100 },
    //   { user: 'Burhan', balance: 100 },
    // ]);
    // starting account balance
    const initialAccounts = await Account.find();
    console.log('Initial Account Balances:');
    initialAccounts.forEach(account => {
      console.log(`${account.user}: ${account.balance}`);
    });
    // Perform a transaction
    await performTransaction('Muhammad', 'Hamza', 10);
    // account balance after transaction
    const updatedAccounts = await Account.find();
    console.log('\nAccount Balances after Transaction:');
    updatedAccounts.forEach(account => {
      console.log(`${account.user}: ${account.balance}`);
    });
  } catch (error) {
    console.error(`Error: ${error}`);
  }
}
main();
