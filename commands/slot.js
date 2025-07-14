const fs = require("fs");

const path = require("path");

const balancePath = path.join(__dirname, "..", "database", "balance.json");

module.exports = {

    name: "slot",

    description: "Play the slot machine and win coins!",

    usage: "/slot <amount>",

    

    run: async ({ api, event, args }) => {

        if (!fs.existsSync(balancePath)) fs.writeFileSync(balancePath, "{}");

        const balanceData = JSON.parse(fs.readFileSync(balancePath));

        const userID = event.senderID;

        const betAmount = parseInt(args[0]);

        if (!betAmount || betAmount <= 0) {

            return api.sendMessage("⚠ Please enter a valid bet amount!\nExample: `/slot 100`", event.threadID);

        }

        if (!balanceData[userID] || balanceData[userID].balance < betAmount) {

            return api.sendMessage("❌ You don't have enough coins to bet!", event.threadID);

        }

        const symbols = ["🍒", "🍋", "🍉", "⭐", "💎"];

        const slot1 = symbols[Math.floor(Math.random() * symbols.length)];

        const slot2 = symbols[Math.floor(Math.random() * symbols.length)];

        const slot3 = symbols[Math.floor(Math.random() * symbols.length)];

        let winnings = 0;

        let resultMessage = "";

        if (slot1 === slot2 && slot2 === slot3) {

            winnings = betAmount * 5;

            resultMessage = "🎉 JACKPOT! You won 5x your bet!";

        } else if (slot1 === slot2 || slot2 === slot3 || slot1 === slot3) {

            winnings = betAmount * 2;

            resultMessage = "✨ You won **2x your bet**!";

        } else {

            winnings = -betAmount;

            resultMessage = "😢 You lost! Try again!";

        }

        balanceData[userID].balance += winnings;

        fs.writeFileSync(balancePath, JSON.stringify(balanceData, null, 2));

        api.sendMessage(

            `🎰Slot Machine🎰\n\n[ ${slot1} | ${slot2} | ${slot3} ]\n\n${resultMessage}\n\n💰Balance: ${balanceData[userID].balance} coins`,

            event.threadID

        );

    }

};