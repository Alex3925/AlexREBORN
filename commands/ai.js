// THIS AI COMMAND IS CONVERTED BY JUN JAAM AND ME OFC, BUT THANKS 

const { post } = require("axios");

module.exports = {

    name: "ai",

    nonPrefix: true,

    description: "AI chatbot with multiple assistant personalities and models.",

    usage: "ai  <message>",

    async run({ api, event, usersData, globalData }) {

        if (!usersData || !globalData) {

            return api.sendMessage("Ã¢Å¡  Error: Missing required data storage.", event.threadID);

        }

        const args = event.body.trim().split(/\s+/);

        const senderID = event.senderID;

        const threadID = event.threadID;

        const assistantTypes = ["lover", "helpful", "friendly", "toxic", "bisaya", "horny", "tagalog", "websearch"];

        const models = { 1: "llama", 2: "gemini" };

        let ads = "";

        if (await isAdmin(senderID, globalData)) {

            ads = `To change model use:\nai model <num>\nTo allow NSFW use:\nai nsfw on/off`;

        }

        const numList = assistantTypes.map((i, x) => `${x + 1}. ${i}`).join("\n");

        const userData = usersData.has(senderID) ? await usersData.get(senderID) : { settings: {} };

        const userName = userData.name || "User";

        const systemType = userData.settings?.system || "helpful";

        const gender = userData.gender === 2 ? "male" : "female";

       

        if (args.length === 1) {

            return api.sendMessage(

                {

                    body: `Hello @${userName}, choose your assistant:\n${numList}\nExample: ai set friendly\n\n${ads}`,

                    mentions: [{ id: senderID, tag: `@${userName}` }]

                },

                threadID

            );

        }

     

        if (args.length >= 3 && args[1].toLowerCase() === "set") {

            const choice = args[2].toLowerCase();

            if (assistantTypes.includes(choice)) {

                await usersData.set(senderID, { settings: { ...userData.settings, system: choice } });

                return api.sendMessage(

                    {

                        body: `Ã¢Å“â€¦ Assistant changed to ${choice}, @${userName}.`,

                        mentions: [{ id: senderID, tag: `@${userName}` }]

                    },

                    threadID

                );

            }

            return api.sendMessage(

                {

                    body: `Ã¢Å¡  Invalid choice.\nAllowed: ${assistantTypes.join(", ")}\nExample: ai set friendly`,

                    mentions: [{ id: senderID, tag: `@${userName}` }]

                },

                threadID

            );

        }

      
        const msg = event.messageReply;

        let url = undefined;

        if (msg && msg.attachments?.length > 0) {

            const attachment = msg.attachments[0];

            if (["photo", "video", "audio", "sticker"].includes(attachment.type)) {

                url = {

                    link: attachment.url,

                    type: attachment.type === "photo" || attachment.type === "sticker" ? "image" :

                        attachment.type === "video" ? "mp4" : "mp3"

                };

            }

        }

       

        const prompt = args.slice(1).join(" ");

        if (!prompt && !url) {

            return api.sendMessage("Ã¢Å¡  Please provide a message or reply to an image/video/audio.", threadID);

        }

        let Gpt = globalData.has("gpt") ? await globalData.get("gpt") : { data: { model: "llama", nsfw: false } };

        try {

            const { result, media } = await ai({

                prompt,

                id: senderID,

                name: userName,

                system: systemType, 

                gender,

                model: Gpt.data.model,

                nsfw: Gpt.data.nsfw,

                link: url

            });

            let messageData = {

                body: `@${userName}, ${result}`,

                mentions: [{ id: senderID, tag: `@${userName}` }]

            };

            if (media) {

                messageData.attachment = await global.utils.getStreamFromURL(media);

            }

            api.sendMessage(messageData, threadID);

        } catch (error) {

            return api.sendMessage(

                {

                    body: `Ã¢Å¡  Error: ${error.message}, @${userName}.`,

                    mentions: [{ id: senderID, tag: `@${userName}` }]

                },

                threadID

            );

        }

    }

};

async function ai({ prompt, id, name, system, gender, model, nsfw = false, link = "" }) {

    try {

        const res = await post(

            "https://test-api-v3.onrender.com/g4o_v2",

            {

                id,

                prompt,

                name,

                model,

                system,

                customSystem: [

{ 

default: "You are a helpful assistant" 

}, 

{

websearch: "websearch"

}

],

                gender,

                nsfw,

                url: link?.link || undefined, // Use the extracted attachment URL

                config: [

                    {

                        gemini: {

                            apikey: "AIzaSyAqigdIL9j61bP-KfZ1iz6tI9Q5Gx2Ex_o",

                            model: "gemini-1.5-flash"

                        },

                        llama: {

                            model: "llama-3.2-90b-vision-preview"

                        }

                    }

                ]

            },

            {

                headers: {

                    "Content-Type": "application/json",

                    Authorization: "Bearer test"

                }

            }

        );

        return res.data;

    } catch (err) {

        const e = err.response?.data;

        return {

            result: typeof e === "string" ? e : e?.error || JSON.stringify(e)

        };

    }

}

async function isAdmin(userID, globalData) {

    const botData = globalData.has("config") ? await globalData.get("config") : { admins: [] };

    return botData.admins.includes(userID);

}