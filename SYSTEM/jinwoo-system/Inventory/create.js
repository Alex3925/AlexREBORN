const axios = require("axios");

module.exports = {

    config: {

        name: "create",

        description: "Create a new bot using Page Access Token & Admin ID.",

        usage: "/create <pageAccessToken> <adminID>",

        hasPermission: 0

    },

    onStart: async function ({ api, event, args }) {

        const { threadID, messageID } = event;

        if (args.length < 2) {

            return api.sendMessage("⚠️ Usage: /create <pageAccessToken> <adminID>", threadID, messageID);

        }

        const [pageAccessToken, adminID] = args;

        const apiUrl = `https://betadash-pagebot-production.up.railway.app/create?pageAccessToken=${encodeURIComponent(pageAccessToken)}&adminid=${encodeURIComponent(adminID)}`;

        try {

            const { data } = await axios.get(apiUrl);

            api.sendMessage(data.message || "✅ Bot created successfully!", threadID, messageID);

        } catch {

            api.sendMessage("❌ Failed to create bot. Please check your Page Access Token and Admin ID.", threadID, messageID);

        }

    }

};
