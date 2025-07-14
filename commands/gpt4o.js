const axios = require("axios");

module.exports = {

    name: "gpt4o",

    description: "AI-powered Gemini Vision for text and image recognition.",

    usage: "gemini <message> | Reply to an image",

    

    async run({ api, event }) {

        const senderID = event.senderID;

        const threadID = event.threadID;

        let query = event.body.slice(7).trim(); 

        let imageUrl = "";


        if (event.messageReply && event.messageReply.attachments.length > 0) {

            const attachment = event.messageReply.attachments[0];

            if (attachment.type === "photo") {

                imageUrl = attachment.url; 

            }

        }

        

        if (!query && !imageUrl) {

            return api.sendMessage("📷 Please provide a query or reply to an image.", threadID);

        }

      

        try {

            const response = await axios.get(`https://kaiz-apis.gleeze.com/api/gemini-vision`, {

                params: {

                    q: query || "Describe this image",

                    uid: senderID,

                    imageUrl: imageUrl

                }

            });

            

            return api.sendMessage(response.data.result, threadID);

        } catch (error) {

            return api.sendMessage(`❌ Error: ${error.response?.data?.error || error.message}`, threadID);

        }

    }

};