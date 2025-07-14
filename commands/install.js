const fs = require("fs");
const path = require("path");

module.exports = {
    name: "install",
    author: "Aljur Pogoy",
    description: "Installs a command or event dynamically.",
    usage: "/install command <filename>.js <code> OR /install event <filename>.js <code>",
    async run({ api, event, args }) {
        if (args.length < 2) {
            return api.sendMessage("❌ Usage: /install <command/event> <filename>.js <code>", event.threadID);
        }

        const type = args[1].toLowerCase();
        const filename = args[1];
        const code = args.slice(2).join(" ");

        // Validate filename
        if (!filename.endsWith(".js")) {
            return api.sendMessage("❌ Filename must end with `.js`!", event.threadID);
        }

        // Validate type
        if (type !== "command" && type !== "event") {
            return api.sendMessage("❌ Invalid type! Use `/install command` or `/install event`.", event.threadID);
        }

        // Define the correct directory
        const directory = path.join(__dirname, "..", "commands");
        const filePath = path.join(directory, filename);

        // Ensure the directory exists
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true });
        }

        // Validate JavaScript code format
        if (!code.includes("module.exports = {")) {
            return api.sendMessage("❌ Invalid command/event structure!", event.threadID);
        }

        // Save the file
        try {
            fs.writeFileSync(filePath, code, "utf8");
            api.sendMessage(`✅ Successfully installed ${type}: ${filename}`, event.threadID);
        } catch (err) {
            api.sendMessage(`❌ Failed to install ${type}: ${err.message}`, event.threadID);
        }
    }
};
