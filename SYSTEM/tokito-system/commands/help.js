const fs = require("fs");

const path = require("path");

module.exports = {

    manifest: {

        name: "help",

        aliases: ["commands", "menu"],

        developer: "Aljur Pogoy",

        description: "Displays all available commands for the Tokito System, or details about a specific command.",

        usage: "help [command]",

        config: {

            botAdmin: false,

            botModerator: false,

       



        },

    },

    async deploy({ chat, args }) {

        const commandsDir = path.join(__dirname, "..", "commands");

        try {

            const commandFiles = fs.readdirSync(commandsDir).filter(file => file.endsWith(".js"));

            if (args.length > 0) {

                

                const commandName = args[0].toLowerCase();

                const commandFile = commandFiles.find(file => file.replace(".js", "").toLowerCase() === commandName);

                if (!commandFile) return chat.send(`❌ Command '${commandName}' not found.`);

                const command = require(path.join(commandsDir, commandFile));

                return chat.send(

                    `📜 Command Details:\n\n` +

                    `🔖 Name: ${command.manifest.name}\n` +

                    `🔖 Aliases: ${command.manifest.aliases?.join(", ") || "None"}\n` +

                    `🔖 Developer: ${command.manifest.developer}\n` +

                    `🔖 Description: ${command.manifest.description}\n` +

                    `🔖 Usage: ${command.manifest.usage || "Not provided"}`

                );

            }

            // Show all commands

            let commandList = [];

            let count = 1;

            commandFiles.forEach((file) => {

                const command = require(path.join(commandsDir, file));

                if (command.manifest && command.manifest.name) {

                    commandList.push(`🔹 ${count++}. ${command.manifest.name} - ${command.manifest.description}`);

                }

            });

            const helpMessage = 

                "====【 Tokito System Commands 】====\n\n" +

                (commandList.length > 0 ? commandList.join("\n") : "No available commands.") +

                "\n\n> Use `help <command>` for more details.";

            chat.send(helpMessage);

        } catch (error) {

            return chat.send("❌ Error loading command list.");

        }

    }

};