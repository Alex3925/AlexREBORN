const fs = require("fs");

const path = require("path");

const commands = new Map();

const commandsDir = __dirname + "/commands";

const configFile = __dirname + "/config.json";

let config = {

    cidControl: [],

    alphaControl: [],

    deltaControl: [],

    zetaControl: [],

    Prefix: ["!"]

};

try {

    config = JSON.parse(fs.readFileSync(configFile, "utf8"));

} catch (error) {

    console.error("Error loading Cid-Kagenou System config.json:", error);

}

const loadCommands = () => {

    const commandFiles = fs.readdirSync(commandsDir).filter(file => file.endsWith(".js"));

    for (const file of commandFiles) {

        try {

            const command = require(`${commandsDir}/${file}`);

            if (command.onChat && command.onChat.name) {

                commands.set(command.onChat.name.toLowerCase(), command);

                if (command.onChat.aliases) {

                    command.onChat.aliases.forEach(alias => {

                        commands.set(alias.toLowerCase(), command);

                    });

                }

            }

        } catch (error) {

            console.error(`Error loading Cid-Kagenou System command '${file}':`, error);

        }

    }

};

loadCommands();

console.log("Cid-Kagenou System Commands Loaded:", [...commands.keys()]);

const extractCommand = (message) => {

    const prefix = config.Prefix[0];

    if (!message.startsWith(prefix)) return { commandName: null, args: [] };

    const words = message.slice(prefix.length).trim().split(/\s+/);

    const commandName = words.shift()?.toLowerCase();

    

    return { commandName, args: words };

};

const executeCommand = async ({ cid, event }) => {

    const { senderID, threadID, body } = event;

    const message = body.trim();

    const { commandName, args } = extractCommand(message);

    if (!commandName) return false;

    

    let command = commands.get(commandName);

    if (!command) return false;

    const isCidControl = config.cidControl.includes(senderID);

    const isAlphaControl = config.alphaControl.includes(senderID);

    const isDeltaControl = config.deltaControl.includes(senderID);

    const isZetaControl = config.zetaControl.includes(senderID);

    if (command.onChat.config.cidControl && !isCidControl) {

        return cid.kagenou("⛔ You need Cid-Control permission to use this command.", threadID);

    }

    if (command.onChat.config.alphaControl && !isAlphaControl) {

        return cid.kagenou("⛔ You need Alpha-Control permission to use this command.", threadID);

    }

    if (command.onChat.config.deltaControl && !isDeltaControl) {

        return cid.kagenou("⛔ You need Delta-Control permission to use this command.", threadID);

    }

    if (command.onChat.config.zetaControl && !isZetaControl) {

        return cid.kagenou("⛔ You need Zeta-Control permission to use this command.", threadID);

    }

    try {

        await command.deploy({

            cid: {

                kagenou: (msg) => cid.sendMessage(msg, threadID),

            },

            args

        });

        return true;

    } catch (error) {

        cid.kagenou(`Error executing Cid-Kagenou System command: ${error.message}`, threadID);

    }

    return false;

};

module.exports = { executeCommand };