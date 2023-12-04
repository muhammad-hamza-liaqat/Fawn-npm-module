const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1/fawnModel", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const accountSchema = new mongoose.Schema({
  user: String,
  balance: Number,
});

const Account = mongoose.model("Account", accountSchema);

async function initializeBalances() {
  // await Account.deleteMany(); // Clear existing documents

  await Account.create([
    { user: "Hamza", balance: 600 },
    { user: "Saad", balance: 100 },
  ]);
}

async function performTransaction(fromUser, toUser, amount) {
  try {
    // Check if the sender's balance is greater than or equal to the transaction amount
    const sender = await Account.findOne({ user: fromUser });
    if (!sender || sender.balance < amount) {
      console.log(
        `${fromUser} does not have sufficient balance to perform the transaction.`
      );
      throw new Error("Insufficient balance");
    }

    // Proceed with the transaction if the sender has sufficient balance
    await Account.updateOne({ user: fromUser }, { $inc: { balance: -amount } });
    await Account.updateOne({ user: toUser }, { $inc: { balance: amount } });

    console.log("Transaction successful");
  } catch (error) {
    console.error(`Transaction failed: ${error}`);
  }
}

async function runTransaction() {
  try {
    // Initialize initial account balances
    // await initializeBalances();

    // Print initial account balances
    const initialAccounts = await Account.find();
    console.log("Initial Account Balances:");
    initialAccounts.forEach((account) => {
      console.log(`${account.user}: ${account.balance}`);
    });

    // Perform a transaction only if Hamza's balance is greater than or equal to the transaction amount
    const hamza = await Account.findOne({ user: "Hamza" });
    if (hamza && hamza.balance >= 200) {
      await performTransaction("Hamza", "Saad", 200);
    } else {
      console.log(
        "Hamza does not have sufficient balance to initiate the transaction."
      );
    }

    // Print updated account balances
    const updatedAccounts = await Account.find();
    console.log("Balance after Transaction:");
    updatedAccounts.forEach((account) => {
      console.log(`${account.user}: ${account.balance}`);
    });
  } catch (error) {
    console.error(`Error: ${error}`);
  } finally {
    mongoose.connection.close();
  }
}

// Run the transaction
runTransaction();
