const axios = require("axios");

module.exports = {

    onChat: {

        name: "ai",

        aliases: ["chatbot", "ask"],

        developer: "Aljur Pogoy",

        description: "Ask AI a question.",

        usage: "ai <question>",

        config: {

            cidControl: false,

            alphaControl: false,

            deltaControl: false,

            zetaControl: false

        },

    },

    async deploy({ cid, args }) {

        if (!args.length) {

            return cid.kagenou("Please provide a question to ask the AI.");

        }

        const question = encodeURIComponent(args.join(" "));

        const apiUrl = `https://kaiz-apis.gleeze.com/api/gemini-vision?q=${question}&uid=`;

        try {

            const response = await axios.get(apiUrl);

            const answer = response.data.response || "I couldn't understand your question.";

            cid.kagenou(`🤖 AI says: ${answer}`);

        } catch (error) {

            cid.kagenou(`Error fetching AI response: ${error.message}`);

        }

    }

};