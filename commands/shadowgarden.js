const fs = require("fs");

const path = require("path");

module.exports = {

    name: "shadowgarden",

    author: "aljur",

    description: "Sends a random 'Yamete' image when triggered.",

    nonPrefix: true,

    async run({ api, event }) {

        const { threadID, messageID, body } = event;

      

        if (/^shadowgarden/i.test(body)) {

            const folderPath = path.join(__dirname, "cache");

            

            

            const imageFiles = fs.readdirSync(folderPath).filter(file => file.endsWith(".jpg") || file.endsWith(".png"));

            if (imageFiles.length === 0) {

                return api.sendMessage("❌ No images found!", threadID, messageID);

            }

          

            const randomImage = imageFiles[Math.floor(Math.random() * imageFiles.length)];

            const imagePath = path.join(folderPath, randomImage);

        

            api.sendMessage({

                attachment: fs.createReadStream(imagePath)

            }, threadID, messageID);

        }

    }

};