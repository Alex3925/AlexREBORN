const os = require("os");

module.exports = {

  name: "systeminfo",

  run: async ({ api, event }) => {

    const { threadID, senderID } = event;

  

    const config = require("../config.json");

    if (!config.vip.includes(senderID)) {

      return api.sendMessage("⛔ Only VIP users can use this command.", threadID);

    }

    const uptime = os.uptime();

    const totalMem = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);

    const freeMem = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);

    const cpuModel = os.cpus()[0].model;

    

    let info = `💻 System Info:\n`;

    info += `🕒 Uptime: ${Math.floor(uptime / 60)} minutes\n`;

    info += `🛠 CPU: ${cpuModel}\n`;

    info += `🗂 RAM: ${freeMem}GB / ${totalMem}GB free\n`;

    api.sendMessage(info, threadID);

  }

};