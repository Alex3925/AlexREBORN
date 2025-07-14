module.exports = {

  manifest: {

    name: "ping", // Command name

    aliases: ["p"], // Short alias

    developer: "YourName", // Your name

    description: "Responds with Pong!", // Command description

    usage: "/ping", // How to use it

    config: {

      botAdmin: false,

      botModerator: false,

      noPrefix: false,

      privateOnly: false

    }

  },

  async deploy({ chat }) {

    chat.send("Pong! 🏓");

  }

};