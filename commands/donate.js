const fs = require("fs");

const balanceFile = "./database/balance.json";

module.exports = {

    name: "donate",

    description: "Donate money to another user.",

    usage: "/donate | <UID> | <amount>",

    async run({ api, event, args }) {

        if (args.length < 2) {

            return api.sendMessage("⚠ Use: /donate | <UID> | <amount>", event.threadID);

        }

        let [targetID, amount] = args;

        amount = parseInt(amount);

        if (isNaN(amount) || amount <= 0) {

            return api.sendMessage("⚠ Please enter a valid amount!", event.threadID);

        }

        if (!fs.existsSync(balanceFile)) return api.sendMessage("⚠ No balance data found!", event.threadID);

        let balanceData = JSON.parse(fs.readFileSync(balanceFile, "utf8"));

        let senderID = event.senderID;

        if (!balanceData[senderID] || balanceData[senderID].balance < amount) {

            return api.sendMessage("⚠ You don't have enough money to donate!", event.threadID);

        }

        balanceData[senderID].balance -= amount;

        balanceData[targetID] = balanceData[targetID] || { balance: 0, bank: 0 };

        balanceData[targetID].balance += amount;

        fs.writeFileSync(balanceFile, JSON.stringify(balanceData, null, 2));

        api.sendMessage(

            `✅ Successfully donated ${amount} coins to UID: ${targetID}!`,

            event.threadID

        );

    }

};