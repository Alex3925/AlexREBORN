//YOU CAN CHANGE THIS API BECAUSE THIS API IS NOW NOT WORK




const axios = require("axios");

module.exports = {
  name: "spamsms",
  category: "Fun",
  execute: async (api, event, args, commands, prefix, admins, appState, sendMessage) => {
    const { threadID } = event;

    // Check if the user provided enough arguments
    if (args.length < 3) {
      sendMessage(api, { threadID, message: "❌ Usage: /spamsms <phone> <count> <interval_in_seconds>" });
      return;
    }

    // Extract parameters
    const phone = args[1];
    const count = parseInt(args[1]);
    const interval = parseInt(args[2]);

    // Validate inputs
    if (isNaN(count) || isNaN(interval) || count <= 0 || interval <= 0) {
      sendMessage(api, { threadID, message: "❌ Invalid count or interval. Please enter numbers greater than 0." });
      return;
    }

    try {
      // Construct the API URL
      const apiUrl = `https://kaiz-apis.gleeze.com/api/spamsms?phone=${phone}&count=${count}&interval=${interval}`;

      // Send request to API
      const response = await axios.get(apiUrl);

      // Check API response
      if (response.data.success) {
        sendMessage(api, { threadID, message: `✅ Successfully sent ${count} spam SMS to ${phone} every ${interval} seconds.` });
      } else {
        sendMessage(api, { threadID, message: `❌ Failed to send SMS: ${response.data.message || "Unknown error"}` });
      }
    } catch (error) {
      console.error("Error in spamsms command:", error);
      sendMessage(api, { threadID, message: "❌ Failed to send spam SMS. API might be down." });
    }
  },
};
