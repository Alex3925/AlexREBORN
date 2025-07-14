const fs = require("fs");

const path = require("path");

module.exports = {

    name: "prefix",

    author: "Aljur Pogoy",

    nonPrefix: true,

    description: "Shows the bot's current prefixes for all systems.",

    

    async run({ api, event }) {

        try {

            

            const mainConfig = require("../config.json");

            const mainPrefix = mainConfig.Prefix?.[0] || "/";

          

            const tokitoConfigPath = path.join(__dirname, "..", "tokito-system", "config.json");

            const tokitoConfig = fs.existsSync(tokitoConfigPath) ? require(tokitoConfigPath) : { Prefix: ["?"] };

            const tokitoPrefix = tokitoConfig.Prefix?.[0] || "?";

            

            const cidConfigPath = path.join(__dirname, "..", "cid-kagenou-system", "config.json");

            const cidConfig = fs.existsSync(cidConfigPath) ? require(cidConfigPath) : { Prefix: ["!"] };

            const cidPrefix = cidConfig.Prefix?.[0] || "!";

            

            const vipConfigPath = path.join(__dirname, "..", "system", "config.json");

            const vipConfig = fs.existsSync(vipConfigPath) ? require(vipConfigPath) : { Prefix: ["+"] };

            const vipPrefix = vipConfig.Prefix?.[0] || "+";

            const message = 

                "System Prefix Information\n\n" +

                " [🌐] Main System Prefix: " + mainPrefix + "\n" +

                "[👾] Tokito System Prefix: " + tokitoPrefix + "\n" +

                "[🗡️] Cid-Kagenou System Prefix: " + cidPrefix + "\n" +

                "[🎭] VIP System Prefix: " + vipPrefix + "\n\n" +

                "To use commands, type the system prefix followed by the command name.";

            api.sendMessage(message, event.threadID, event.messageID);

        } catch (error) {

            console.error("Error loading prefixes:", error);

            api.sendMessage("âŒ Failed to load prefixes.", event.threadID, event.messageID);

        }

    }

};