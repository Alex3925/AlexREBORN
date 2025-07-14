// THANK YOU SA OWNERSV2


const axios = require("axios");

module.exports = {

    name: "soundcloud",

    author: "Aljur",

    description: "Search and download songs from SoundCloud.",

    

    async run({ api, event, args }) {

        const { threadID, messageID } = event;

        const query = args.join(" ");

        if (!query) {

            return api.sendMessage(" Please provide a song title!", threadID, messageID);

        }

        try {

            

            const searchURL = `https://haji-mix.up.railway.app/api/soundcloud?title=${encodeURIComponent(query)}`;

            

            

            

            

            

            

            const audioResponse = await axios.get(searchURL, { responseType: "stream" });

            api.sendMessage({

                body: `🎶 Now Playing`,

                attachment: audioResponse.data

            }, threadID, messageID);

        } catch (error) {

            console.error("❌ Error fetching SoundCloud song:" + error.response?.data || error.message);

            api.sendMessage(" An error occurred! Please try again later.", threadID, messageID);

        }

    }

};