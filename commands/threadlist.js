module.exports = {
    name: "threadlist",
    description: "Displays a list of threads with names and their IDs.",
    author: "coffee",
    usage: "/threadlist",

    async execute(api, event, args, commands, prefix, admins, appState, sendMessage) {
        const { threadID } = event;

        try {
            api.getThreadList(50, null, ["INBOX"], (err, list) => {
                if (err) {
                    console.error("Error fetching thread list:", err);
                    return sendMessage(api, { threadID, message: "❌ Failed to retrieve thread list." });
                }

                if (list.length === 0) {
                    return sendMessage(api, { threadID, message: "📂 No active threads found." });
                }

              
                const threadInfo = list.map(thread => `🔹 **${thread.name || "Unnamed Chat"}**\n📌 ID: ${thread.threadID}`).join("\n\n");
                
                const responseMessage = `📜Active Threads:\n\n${threadInfo}`;
                sendMessage(api, { threadID, message: responseMessage });
            });
        } catch (error) {
            console.error("Error executing threadlist command:", error);
            sendMessage(api, { threadID, message: "❌ An error occurred while retrieving thread list." });
        }
    }
};
