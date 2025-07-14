const fs = require("fs");

const path = require("path");

module.exports = {

    name: "bank",

    description: "Deposit or withdraw money from your bank.",

    usage: "/bank | deposit | <amount> or /bank | withdraw | <amount>",

    async run({ api, event, args }) {

        const balanceFile = path.join(__dirname, "..", "database", "balance.json");

        const userID = event.senderID;

    

        const input = args.join(" ").split("|").map(a => a.trim());

        if (input.length !== 3) {

            return api.sendMessage("⚠ Use: /bank | deposit | <amount> or /bank | withdraw | <amount>", event.threadID);

        }

        const action = input[1].toLowerCase();

        const amount = parseInt(input[2]);

        if (!["deposit", "withdraw"].includes(action) || isNaN(amount) || amount <= 0) {

            return api.sendMessage("⚠ Please enter a valid amount.\n\nExample:\n✅ /bank | deposit | 1000\n✅ /bank | withdraw | 500", event.threadID);

        }

      

        let balanceData = {};

        if (fs.existsSync(balanceFile)) {

            balanceData = JSON.parse(fs.readFileSync(balanceFile, "utf8"));

        }

        if (!balanceData[userID]) {

            balanceData[userID] = { balance: 0, bank: 0 };

        }

      

        if (action === "deposit") {

            if (balanceData[userID].balance < amount) {

                return api.sendMessage(`❌ You don't have enough balance to deposit!\n💰 Current Balance: ${balanceData[userID].balance}`, event.threadID);

            }

            balanceData[userID].balance -= amount;

            balanceData[userID].bank += amount;

            api.sendMessage(`✅ Successfully deposited 💰 ${amount} coins into your bank!\n🏦 New Bank Balance: ${balanceData[userID].bank}`, event.threadID);

        }

        

        else if (action === "withdraw") {

            if (balanceData[userID].bank < amount) {

                return api.sendMessage(`❌ You don't have enough in your bank to withdraw!\n🏦 Current Bank Balance: ${balanceData[userID].bank}`, event.threadID);

            }

            balanceData[userID].bank -= amount;

            balanceData[userID].balance += amount;

            api.sendMessage(`✅ Successfully withdrew 💸 ${amount} coins from your bank!\n💰 New Balance: ${balanceData[userID].balance}`, event.threadID);

        }

        

        fs.writeFileSync(balanceFile, JSON.stringify(balanceData, null, 2));

    }

};