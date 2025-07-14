module.exports = {

  name: "tagall",

  run: async ({ api, event }) => {

    const { threadID, senderID } = event;

   

    const config = require("../config.json");

    if (!config.vip.includes(senderID)) {

      return api.sendMessage("⛔ Only VIP users can use this command.", threadID);

    }

    api.getThreadInfo(threadID, (err, info) => {

      if (err) return api.sendMessage("❌ Error fetching members.", threadID);

      let mentions = [];

      let message = "📢 @everyone\n\n";

      info.participantIDs.forEach((id, index) => {

        if (id !== api.getCurrentUserID()) {

          mentions.push({ tag: `@User${index}`, id });

          message += `@User${index} `;

        }

      });

      api.sendMessage({ body: message, mentions }, threadID);

    });

  }

};