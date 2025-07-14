const fs = require("fs");

const path = require("path");

const axios = require("axios");

const request = require("request");

module.exports = {

    name: "fbcover",

    description: "Generate a Facebook cover image with custom details.",

    usage: "fbcover <Name> <Subname> <Phone> <Address> <Email> <Color>",

    async run({ api, event, args }) {

        const { threadID, senderID } = event;

        if (args.length < 6) {

            return api.sendMessage(

                "⚠ Usage: fbcover <Name> <Subname> <Phone> <Address> <Email> <Color>\n" +

                "Example: fbcover Mark Zuckerberg n/a USA zuck@gmail.com Cyan",

                threadID

            );

        }

        const [name, subname, phone, address, email, color] = args;

        const imagePath = path.join(__dirname, "cache", `fbcover_${senderID}.png`);

        const imageUrl = `https://api.zetsu.xyz/canvas/fbcover?name=${encodeURIComponent(name)}&subname=${encodeURIComponent(subname)}&sdt=${encodeURIComponent(phone)}&address=${encodeURIComponent(address)}&email=${encodeURIComponent(email)}&uid=${senderID}&color=${encodeURIComponent(color)}`;

        try {

            api.sendMessage("⏳ Generating your Facebook cover, please wait...", threadID);

            await new Promise((resolve, reject) => {

                request(imageUrl)

                    .pipe(fs.createWriteStream(imagePath))

                    .on("finish", resolve)

                    .on("error", reject);

            });

            api.sendMessage({

                body: `✅ Facebook cover for ${name} has been generated!`,

                attachment: fs.createReadStream(imagePath)

            }, threadID, () => fs.unlinkSync(imagePath));

            

        } catch (error) {

            console.error("Error generating fbcover:", error);

            api.sendMessage("❌ Failed to generate the Facebook cover. Please try again later.", threadID);

        }

    }

};