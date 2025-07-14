const axios = require("axios");

module.exports = {
  name: "translator",
  category: "Utility",
  author: "Aljur Pogoy",
  execute: async (api, event, args, commands, prefix, admins, appState, sendMessage) => {
    const { threadID } = event;

    if (args.length < 2) {
      return sendMessage(api, {
        threadID,
        message: "❌ Usage: /translator <language_code> <text>\nExample: /translator en Hola"
      });
    }

    const language = args.shift();
    const text = args.join(" ");

    try {
      const response = await axios.post("https://libretranslate.de/translate", {
        q: text,
        source: "auto",
        target: language
      });

      if (!response.data || !response.data.translatedText) {
        return sendMessage(api, { threadID, message: "❌ Translation failed. Try again later!" });
      }

      sendMessage(api, {
        threadID,
        message: `Translated to ${language}:**\n${response.data.translatedText}`
      });

    } catch (error) {
      console.error("Translator API Error:", error);
      sendMessage(api, { threadID, message: "❌ Error translating text. Try again later!" });
    }
  },
};