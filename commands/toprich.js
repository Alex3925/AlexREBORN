const fs = require("fs");

const balanceFile = "./database/balance.json";

module.exports = {

    name: "toprich",

    description: "Shows the top richest players.",

    usage: "/toprich",

    async run({ api, event }) {

        if (!fs.existsSync(balanceFile)) return api.sendMessage("⚠ No balance data found!", event.threadID);

        let balanceData = JSON.parse(fs.readFileSync(balanceFile, "utf8"));

        let sortedUsers = Object.entries(balanceData)

            .map(([id, data]) => ({ id, ...data }))

            .sort((a, b) => (b.balance + b.bank) - (a.balance + a.bank))

            .slice(0, 10); // Top 10

        let message = "💰Top Richest Players:\n\n";

        let namePromises = sortedUsers.map(user =>

            new Promise(resolve => {

                api.getUserInfo(user.id, (err, info) => {

                    if (err) return resolve(` [Error] - UID: ${user.id}`);

                    let name = info[user.id].name;

                    resolve(`🏆 ${name} (UID: ${user.id})\n   🪙 Wallet: ${user.balance}\n   🏦 Bank: ${user.bank}\n`);

                });

            })

        );

        Promise.all(namePromises).then(names => {

            message += names.join("\n");

            api.sendMessage(message, event.threadID);

        });

    }

};