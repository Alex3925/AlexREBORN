const axios = require("axios");

module.exports = {

    manifest: {

        name: "tokito",

        aliases: ["chat"],

        developer: "Aljur Pogoy",

        description: "Ask AI anything using Gemini Vision!",

        usage: "ai <question>",

        config: {

            botAdmin: false,

            botModerator: false,

            noPrefix: false,

            privateOnly: false,

        },

    },

    async deploy({ chat, args }) {

        if (!args.length) return chat.send("❌ Please provide a question. Example: `ai What is the capital of France?`");

        const query = args.join(" ");

        chat.send("⏳ Thinking...");

        try {

            const apiUrl = `https://kaiz-apis.gleeze.com/api/gemini-vision?q=${encodeURIComponent(query)}&uid=your-uid-here&imageUrl=`;

            const response = await axios.get(apiUrl);

            

            const reply = response.data.response || "⚠️ No response from AI.";

            chat.send(reply);

        } catch (error) {

            chat.send("⚠️ Error communicating with AI. Please try again later.");

            console.error("AI Error:", error.response?.data || error.message);

        }

    }

};