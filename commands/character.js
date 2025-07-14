const axios = require("axios");

const characters = {
    makima: "https://kaiz-apis.gleeze.com/api/makima?ask=",
    gojo: "https://kaiz-apis.gleeze.com/api/gojo?ask=",
    yorforger: "https://kaiz-apis.gleeze.com/api/yor-forger?ask=",
    anna: "https://markdevs-last-api-p2y6.onrender.com/ashley?prompt=",
    esdeath: "https://kaiz-apis.gleeze.com/api/esdeath?ask=",
    fubuki: "https://kaiz-apis.gleeze.com/api/fubuki?ask=",
    goku: "https://kaiz-apis.gleeze.com/api/goku?ask=",
    senku: "https://kaiz-apis.gleeze.com/api/senku?ask=",
    naruto: "https://kaiz-apis.gleeze.com/api/naruto?ask=",
    nami: "https://kaiz-apis.gleeze.com/api/nami?ask=",
    mitsuri: "https://kaiz-apis.gleeze.com/api/mitsuri?ask=",
    cid: "https://kaiz-apis.gleeze.com/api/cid-kagenou?ask=",
};

module.exports = {
    name: "character",
    description: "Chat with AI characters like Makima, Gojo, Yor Forger, Esdeath, Goku, and more.",
    author: "Francis Loyd Raval",
    usage: "/character <name> <message>",
    cooldown: 5,

    async execute(api, event, args, commands, prefix, admins, appState, sendMessage) {
        const { threadID, senderID } = event;

        if (args.length < 2) {
            return sendMessage(api, {
                threadID,
                message: "⚠️ | Usage: /character <name> <message>\nExample: /character makima hello\n\n Available Character\n makima\ngoku\nyorforger\nanna\nesdeath\nfubuki\nsenku\nnaruto\nmitsuri\nnami "
            });
        }

        const character = args[1].toLowerCase();
        const message = args.slice(1).join(" ");

        if (!characters[character]) {
            return sendMessage(api, {
                threadID,
                message: "⚠️ | Character not found! Available characters: " + Object.keys(characters).join(", ")
            });
        }

        try {
            const apiUrl = `${characters[character]}${encodeURIComponent(message)}&uid=${senderID}`;
            const response = await axios.get(apiUrl);
            
            if (response.data && response.data.response) {
                sendMessage(api, { threadID, message: `💬 | ${character.toUpperCase()}:\n${response.data.response}` });
            } else {
                sendMessage(api, { threadID, message: "❌ | AI failed to respond. Try again later!" });
            }
        } catch (error) {
            sendMessage(api, { threadID, message: "❌ | Error connecting to AI API." });
            console.error(error);
        }
    }
};
