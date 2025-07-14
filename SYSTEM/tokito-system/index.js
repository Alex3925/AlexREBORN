const fs = require("fs");

const path = require("path");

const commands = new Map();

const commandsDir = path.join(__dirname, "commands");

const configFile = path.join(__dirname, "config.json");

let config = { botAdmin: [], botModerator: [], Prefix: ["/"] };

try {

    config = JSON.parse(fs.readFileSync(configFile, "utf8"));

} catch (error) {

    console.error("Error loading Tokito System config.json:", error);

}

const loadCommands = () => {

    const commandFiles = fs.readdirSync(commandsDir).filter(file => file.endsWith(".js"));

    

    for (const file of commandFiles) {

        try {

            const command = require(`${commandsDir}/${file}`);

            if (command.manifest && command.manifest.name) {

                commands.set(command.manifest.name.toLowerCase(), command);

                if (command.manifest.aliases) {

                    command.manifest.aliases.forEach(alias => {

                        commands.set(alias.toLowerCase(), command);

                    });

                }

            }

        } catch (error) {

            console.error(`Error loading Tokito System command '${file}':`, error);

        }

    }

};

loadCommands();

console.log("Tokito System Commands Loaded:", [...commands.keys()]);

const executeCommand = async ({ chat, event, args }) => {

    const { threadID, senderID, body } = event;

    const message = body.trim();

    const prefix = config.Prefix[0];

    const isAdmin = config.botAdmin.includes(senderID);

    const isModerator = config.botModerator.includes(senderID);

    let commandName = message.startsWith(prefix) ? message.slice(prefix.length).split(/ +/)[0].toLowerCase() : null;

    let command = commandName ? commands.get(commandName) : null;

    if (command) {

        const { botAdmin, botModerator } = command.manifest.config;

        // Permission Handling

        if (botAdmin && botModerator) {

            if (!isAdmin && !isModerator) {

                return chat.send("❌ You must be a bot admin or bot moderator to use this command.");

            }

        } else if (botAdmin) {

            if (!isAdmin) {

                return chat.send("❌ You must be a bot admin to use this command.");

            }

        } else if (botModerator) {

            if (!isAdmin && !isModerator) {

                return chat.send("❌ You must be a bot moderator to use this command.");

            }

        }

        try {

            await command.deploy({

                chat: { send: (msg) => chat.sendMessage(msg, threadID) },

                args,

            });

            return true;

        } catch (error) {

            chat.sendMessage(`⚠️ Error executing Tokito System command: ${error.message}`, threadID);

        }

    }

    return false;

};

module.exports = { executeCommand };