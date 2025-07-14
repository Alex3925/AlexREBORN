const fs = require("fs");

const path = require("path");

module.exports = {

    onChat: {

        name: "help",

        aliases: ["commands", "menu"],

        developer: "Francis Loyd Raval",

        description: "Displays all available commands for the Cid-Kagenou System, or details about a specific command.",

        usage: "help [command]",

        config: {

            cidControl: true,

            alphaControl: false,

            deltaControl: false,

            zetaControl: false

        },

    },

    

    async deploy({ cid, args }) {

        const commandsDir = path.join(__dirname, "..", "commands");

        try {

            const commandFiles = fs.readdirSync(commandsDir).filter(file => file.endsWith(".js"));

            if (args.length > 0) {

                // Show specific command details

                const commandName = args[0].toLowerCase();

                const commandFile = commandFiles.find(file => file.replace(".js", "").toLowerCase() === commandName);

                if (!commandFile) return cid.kagenou(`❌ Command '${commandName}' not found.`);

                const command = require(path.join(commandsDir, commandFile));

                return cid.kagenou(

                    `📜 Command Details:\n\n` +

                    `🔖 Name: ${command.onChat.name}\n` +

                    `🔖 Aliases: ${command.onChat.aliases?.join(", ") || "None"}\n` +

                    `🔖 Developer: ${command.onChat.developer}\n` +

                    `🔖 Description: ${command.onChat.description}\n` +

                    `🔖 Usage: ${command.onChat.usage || "Not provided"}`

                );

            }

            // Show all commands

            let commandList = [];

            let count = 1;

            commandFiles.forEach((file) => {

                const command = require(path.join(commandsDir, file));

                if (command.onChat && command.onChat.name) {

                    commandList.push(`🔹 ${count++}. ${command.onChat.name} - ${command.onChat.description}`);

                }

            });

            const helpMessage = 

                "====【 Cid-Kagenou System Commands 】====\n\n" +

                (commandList.length > 0 ? commandList.join("\n") : "No available commands.") +

                "\n\n> Use `help <command>` for more details.";

            cid.kagenou(helpMessage);

        } catch (error) {

            return cid.kagenou("❌ Error loading command list.");

        }

    }

};