const axios = require("axios");

module.exports = {

    name: "gemini",

    nonPrefix: true,

    author: "Aljur Pogoy",

    description: "Recognize images and answer queries using Gemini API.",

    async run({ api, event, args }) {

        const query = args.join(" ");

        let imageUrl = null;

      

        if (event.messageReply && event.messageReply.attachments.length > 0) {

            const attachment = event.messageReply.attachments[1];

            if (attachment.type === "photo") {

                imageUrl = attachment.url;

            } else {

                return api.sendMessage("❌ Please reply to an image!", event.threadID, event.messageID);

            }

        }

        if (!query && !imageUrl) {

            return api.sendMessage("❌ Please provide a query or reply to an image!", event.threadID, event.messageID);

        }

        // API Request

        const apiUrl = `https://kaiz-apis.gleeze.com/api/gemini-vision?q=${encodeURIComponent(query)}&uid=${event.senderID}&imageUrl=${encodeURIComponent(imageUrl || "")}`;

        try {

            const { data } = await axios.get(apiUrl);

            if (data && data.response) {

                api.sendMessage(`💬 Cid Kagenou response:\n${data.response}`, event.threadID, (err, msg) => {

                    if (!err && msg) {

                        global.Cid.onReply.set(msg.messageID, {

                            commandName: "gemini",

                            senderID: event.senderID

                        });

                    }

                });

            } else {

                api.sendMessage("❌ No response received from the API.", event.threadID, event.messageID);

            }

        } catch (error) {

            api.sendMessage(`❌ Error: ${error.message}`, event.threadID, event.messageID);

        }

    },

    async onReply({ api, event }) {

        const replyData = global.Cid.onReply.get(event.messageReply.messageID);

        if (!replyData || replyData.commandName !== "gemini") return;

        const query = event.body.trim();

        if (!query) {

            return api.sendMessage("❌ Please provide a follow-up query!", event.threadID, event.messageID);

        }

        // API Request for follow-up

        const apiUrl = `https://kaiz-apis.gleeze.com/api/gemini-vision?q=${encodeURIComponent(query)}&uid=${event.senderID}`;

        try {

            const { data } = await axios.get(apiUrl);

            if (data && data.response) {

                api.sendMessage(`💬 Cid Kagenou response:\n${data.response}`, event.threadID, event.messageID);

            } else {

                api.sendMessage("❌ No response received from the API.", event.threadID, event.messageID);

            }

        } catch (error) {

            api.sendMessage(`❌ Error: ${error.message}`, event.threadID, event.messageID);

        }

    }

};