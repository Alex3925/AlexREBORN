const fs = require("fs-extra");

const path = require("path");

const login = require("chatbox-fca-remake");

const express = require("express");

const bodyParser = require("body-parser");

const system = require("./SYSTEM/second-system#1/index.js");

const tokitoSystem = require("./SYSTEM/tokito-system/index.js");

const cidKagenouSystem = require("./SYSTEM/cid-kagenou-system/index.js");

const jinwooSystem = require("./SYSTEM/jinwoo-system/index.js");

const apiHandler = require("./utils/apiHandler");

const commands = new Map();

const nonPrefixCommands = new Map();

const eventCommands = [];

const usersData = new Map();

const globalData = new Map();

const commandsDir = path.join(__dirname, "commands");

const bannedUsersFile = path.join(__dirname, "database", "bannedUsers.json");

const configFile = path.join(__dirname, "config.json");

let bannedUsers = {};

let config = { admins: [], Prefix: ["/"] };



global.client = {

    reactionListener: {},

    globalData: new Map()

};


const loadBannedUsers = () => {

    try {

        bannedUsers = JSON.parse(fs.readFileSync(bannedUsersFile, "utf8"));

    } catch {

        bannedUsers = {};

    }

};



const loadCommands = () => {

    const commandFiles = fs.readdirSync(commandsDir).filter(file => file.endsWith(".js"));

    for (const file of commandFiles) {

        try {

            const command = require(path.join(commandsDir, file));

            if (command.config && command.config.name && command.run) {

                commands.set(command.config.name.toLowerCase(), command);

                if (command.config.nonPrefix) nonPrefixCommands.set(command.config.name.toLowerCase(), command);

            } else if (command.name) { 

                commands.set(command.name.toLowerCase(), command);

                if (command.nonPrefix) nonPrefixCommands.set(command.name.toLowerCase(), command);

            }

            if (command.handleEvent) eventCommands.push(command);

        } catch (error) {

            console.error(`❌ Error loading command '${file}':`, error);

        }

    }

};

loadCommands();

console.log("✅ Commands loaded:", [...commands.keys()]);

console.log("✅ Non-Prefix Commands:", [...nonPrefixCommands.keys()]);

console.log(" Event Commands:", eventCommands.map(cmd => cmd.name));



let appState = {};

try {

    appState = JSON.parse(fs.readFileSync("./appstate.dev.json", "utf8"));

    console.log("✅ appState loaded successfully.");

} catch (error) {

    console.error("❌ Error loading appstate.json:", error);

}



try {

    config = JSON.parse(fs.readFileSync(configFile, "utf8"));

} catch (error) {

    console.error("❌ Error loading config.json:", error);

}

loadBannedUsers();



const startBot = async () => {

    login({ appState }, (err, api) => {

        if (err) {

            console.error("❌ Fatal error during Facebook login:", err);

            process.exit(1);

        }

        api.setOptions({

            forceLogin: true,

            listenEvents: true,

            logLevel: "silent",

            updatePresence: true,

            selfListen: false,

            bypassRegion: "PNB",

            userAgent: "Mozilla/5.0",

            online: false,

            autoMarkDelivery: false,

            autoMarkRead: false

        });

        console.log("✅ Successfully logged in to Facebook.");

        startListeningForMessages(api);

    });

};

const sendMessage = async (api, messageData) => {

    try {

        const { threadID, message } = messageData;

        if (!message || message.trim() === "") return;

        api.sendMessage(message, threadID, (err) => {

            if (err) console.error("❌ Error sending message:", err);

        });

    } catch (error) {

        console.error("❌ Error in sendMessage:", error);

    }

};

const handleMessage = async (api, event) => {

    const { threadID, senderID, body } = event;

    if (!body) return;

    const message = body.trim();

    const words = message.split(/ +/);

    const prefix = config.Prefix[0];

    loadBannedUsers();

    if (bannedUsers[senderID]) {

        return api.sendMessage(`⚠ You are banned from using bot commands.\nReason: ${bannedUsers[senderID].reason}`, threadID);

    }

    let commandName = words[0].toLowerCase();

    let args = words.slice(1);

    let command = null;

    if (message.startsWith(prefix)) {

        commandName = message.slice(prefix.length).split(/ +/)[0].toLowerCase();

        args = message.slice(prefix.length).split(/ +/).slice(1);

        command = commands.get(commandName);

    } else {

        command = nonPrefixCommands.get(commandName);

    }

    if (command) {

        try {

            if (command.execute) {

                await command.execute(api, event, args, commands, prefix, config.admins, appState, sendMessage, apiHandler, usersData, globalData);

            } else if (command.run) {

                await command.run({ api, event, args, apiHandler, usersData, globalData });

            }

        } catch (error) {

            sendMessage(api, { threadID, message: `❌ Error executing command: ${error.message}` });

        }

    } else if (await tokitoSystem.executeCommand({ chat: api, event, args })) {

    } else if (await cidKagenouSystem.executeCommand({ cid: api, event, args })) {

    } else if (await jinwooSystem.executeCommand({ api, event })) {

    } else {

        await system.executeCommand({ api, event, args, apiHandler });

    }

};

const handleReaction = async (api, event) => {

    const { messageID, userID } = event;

    if (global.client.reactionListener[messageID]) {

        try {

            await global.client.reactionListener[messageID]({ userID, messageID });

            delete global.client.reactionListener[messageID];

        } catch (error) {

            console.error("❌ Error handling reaction:", error);

        }

    }

};

const handleEvent = async (api, event) => {

    for (const command of eventCommands) {

        try {

            if (command.handleEvent) await command.handleEvent({ api, event });

        } catch (error) {

            console.error(`❌ Error in event command '${command.config.name}':`, error);

        }

    }

};

const startListeningForMessages = (api) => {

    api.listenMqtt(async (err, event) => {

        if (err) {

            console.error("❌ Error listening for messages:", err);

            return;

        }

        if (event.type === "message") {

            await handleMessage(api, event);

        } else if (event.type === "message_reaction") {

            await handleReaction(api, event);

        } else {

            await handleEvent(api, event);

        }

        if (event.type === "event" && event.logMessageType === "log:subscribe") {

            const threadID = event.threadID;

            const addedUsers = event.logMessageData.addedParticipants;

            if (addedUsers.some(user => user.userFbId === api.getCurrentUserID())) {

                return api.sendMessage(`Thank you for inviting me here!`, threadID);

            }

        }

    });

};
startBot();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get("/api/v1/status", (req, res) => {
    res.json({ status: botAPI ? "online" : "offline" });
});

app.post("/api/v1/send", (req, res) => {
    if (!botAPI) return res.status(500).json({ error: "Bot is not online" });

    const { threadID, message } = req.body;
    if (!threadID || !message) return res.status(400).json({ error: "Missing threadID or message" });

    botAPI.sendMessage(message, threadID, (err) => {
        if (err) return res.status(500).json({ error: "Failed to send message" });

        res.json({ success: true, message: "Message sent" });
    });
});

app.get("/api/v1/history/:threadID", (req, res) => {
    if (!botAPI) return res.status(500).json({ error: "Bot is not online" });

    const threadID = req.params.threadID;
    botAPI.getThreadHistory(threadID, 10, (err, history) => {
        if (err) return res.status(500).json({ error: "Failed to get message history" });

        res.json({ success: true, history });
    });
});

app.get("/api/v1/command=/:command", async (req, res) => {
    if (!botAPI) return res.status(500).json({ error: "Bot is not online" });

    const commandName = req.params.command.toLowerCase();
    if (commandName === "help") {
        return res.json({ success: true, commands: [...commands.keys()] });
    }

    const command = commands.get(commandName);
    if (!command) return res.status(404).json({ error: "Command not found" });

    try {
        const result = await command.run({ api: botAPI, args: [], event: {} });
        res.json({ success: true, response: result || "Command executed." });
    } catch (error) {
        res.status(500).json({ error: "Failed to execute command" });
    }
});

app.listen(PORT, () => {
    console.log(`✅ API Server running on port ${PORT}`);
});
