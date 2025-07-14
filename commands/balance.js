const fs = require("fs");

const path = require("path");

const balancePath = path.join(__dirname, "..", "database", "balance.json");

module.exports = {

    name: "balance",

    description: "Check your wallet and bank balance.",

    usage: "/balance",

    

    run: async ({ api, event }) => {

        if (!fs.existsSync(balancePath)) fs.writeFileSync(balancePath, "{}");

        const balanceData = JSON.parse(fs.readFileSync(balancePath));

        const userID = event.senderID;

        if (!balanceData[userID]) {

            balanceData[userID] = { balance: 1000, bank: 0 };

            fs.writeFileSync(balancePath, JSON.stringify(balanceData, null, 2));

        }

        const { balance, bank } = balanceData[userID];

        api.sendMessage(

            `💰 Your Balance:\n\n💸 Wallet: ${balance} coins\n🏦 Bank: ${bank} coins`,

            event.threadID

        );

    }

};