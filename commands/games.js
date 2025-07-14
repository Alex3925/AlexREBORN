const fs = require("fs");

const path = require("path");

const balanceFile = path.join(__dirname, "..", "database", "balance.json");

module.exports = {

    name: "games",

    description: "Play multiple mini-games and win money!",

    usage: "/games | <game> | <bet>",

    

    async run({ api, event }) {

        const args = event.body.split(" | ").map(arg => arg.trim());

        if (args.length < 3) {

            return api.sendMessage(

                "⚠ Use: /games | <game> | <bet>\n\n🎮 Available Games:\n- slots\n- dice\n- card\n- guess\n- rps\n- coinflip\n- higherlower\n- archery\n- treasure\n- bonecollect", 

                event.threadID

            );

        }

        const game = args[1].toLowerCase();

        const betAmount = parseInt(args[2]);

        const senderID = event.senderID;

        if (isNaN(betAmount) || betAmount <= 0) {

            return api.sendMessage("⚠ Please enter a valid bet amount!", event.threadID);

        }

        let balanceData = {};

        try {

            balanceData = JSON.parse(fs.readFileSync(balanceFile, "utf8"));

        } catch {

            balanceData = {};

        }

        if (!balanceData[senderID]) {

            balanceData[senderID] = { balance: 1000, bank: 0 };

        }

        if (balanceData[senderID].balance < betAmount) {

            return api.sendMessage("❌ You don't have enough balance!", event.threadID);

        }

        let resultMessage = "";

        let winAmount = 0;

        let won = false;

        switch (game) {

            case "slots":

                const symbols = ["🍒", "🍋", "🍉", "⭐", "💎"];

                const slot1 = symbols[Math.floor(Math.random() * symbols.length)];

                const slot2 = symbols[Math.floor(Math.random() * symbols.length)];

                const slot3 = symbols[Math.floor(Math.random() * symbols.length)];

                won = slot1 === slot2 && slot2 === slot3;

                winAmount = won ? betAmount * 3 : 0;

                resultMessage = `🎰 Slot Machine 🎰\n[ ${slot1} | ${slot2} | ${slot3} ]\n\n${won ? `🎉 You won ${winAmount}!` : "❌ You lost!"}`;

                break;

            case "dice":

                const userRoll = Math.floor(Math.random() * 6) + 1;

                const botRoll = Math.floor(Math.random() * 6) + 1;

                won = userRoll > botRoll;

                winAmount = won ? betAmount * 2 : 0;

                resultMessage = `🎲 Dice Roll 🎲\nYou rolled: ${userRoll}\nBot rolled: ${botRoll}\n\n${won ? `🎉 You won ${winAmount}!` : "❌ You lost!"}`;

                break;

            case "card":

                const userCard = Math.floor(Math.random() * 13) + 1;

                const botCard = Math.floor(Math.random() * 13) + 1;

                won = userCard > botCard;

                winAmount = won ? betAmount * 2 : 0;

                resultMessage = `🃏 Card Draw 🃏\nYou drew: ${userCard}\nBot drew: ${botCard}\n\n${won ? `🎉 You won ${winAmount}!` : "❌ You lost!"}`;

                break;

            case "coinflip":

                const flipResult = Math.random() < 0.5 ? "Heads" : "Tails";

                won = Math.random() < 0.5;

                winAmount = won ? betAmount * 2 : 0;

                resultMessage = `🎯 Coin Flip 🎯\nThe coin landed on: ${flipResult}\n\n${won ? `🎉 You won ${winAmount}!` : "❌ You lost!"}`;

                break;

            case "higherlower":

                const currentNumber = Math.floor(Math.random() * 100) + 1;

                const nextNumber = Math.floor(Math.random() * 100) + 1;

                const guess = args[3]?.toLowerCase();

                if (!["higher", "lower"].includes(guess)) {

                    return api.sendMessage("⚠ Guess higher or lower!\nExample: /games | higherlower | 500 | higher", event.threadID);

                }

                won = (guess === "higher" && nextNumber > currentNumber) || (guess === "lower" && nextNumber < currentNumber);

                winAmount = won ? betAmount * 2 : 0;

                resultMessage = `🎮 Higher or Lower 🎮\nCurrent number: ${currentNumber}\nNext number: ${nextNumber}\n\n${won ? `🎉 You won ${winAmount}!` : "❌ You lost!"}`;

                break;

            case "archery":

                won = Math.random() < 0.5;

                winAmount = won ? betAmount * 3 : 0;

                resultMessage = `🏹 Archery 🏹\nYou ${won ? "hit the bullseye! 🎯" : "missed... ❌"}\n\n${won ? `🎉 You won ${winAmount}!` : "❌ Better luck next time!"}`;

                break;

            case "treasure":

                won = Math.random() < 0.4;

                winAmount = won ? betAmount * 4 : 0;

                resultMessage = `💰 Treasure Hunt 💰\nYou ${won ? "found a treasure! 🏆" : "found nothing..."}\n\n${won ? `🎉 You won ${winAmount}!` : "❌ Better luck next time!"}`;

                break;

            case "bonecollect":

                const bones = ["💀", "🦴", "☠️"];

                const foundBone = bones[Math.floor(Math.random() * bones.length)];

                winAmount = foundBone === "💀" ? betAmount * 3 : foundBone === "🦴" ? betAmount * 2 : 0;

                won = winAmount > 0;

                resultMessage = `🦴 Bone Collect 🦴\nYou found: ${foundBone}\n\n${won ? `🎉 You won ${winAmount}!` : "❌ Nothing valuable..."}`;

                break;

            default:

                return api.sendMessage("⚠ Invalid game. Use: slots, dice, card, guess, rps, coinflip, higherlower, archery, treasure, bonecollect.", event.threadID);

        }

        balanceData[senderID].balance += won ? winAmount : -betAmount;

        fs.writeFileSync(balanceFile, JSON.stringify(balanceData, null, 2));

        api.sendMessage(resultMessage, event.threadID);

    }

};