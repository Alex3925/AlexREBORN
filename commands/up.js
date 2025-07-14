const os = require('os');

module.exports = {
  name: 'uptime',
  description: 'Shows the uptime of the bot.',
  author: 'coffee',
  usage: '/uptime',
  async execute(api, event, args, commands, prefix, admins, appState, sendMessage) {
    const { threadID } = event;

    const uptimeSeconds = process.uptime();
    const uptimeMinutes = Math.floor(uptimeSeconds / 60);
    const uptimeHours = Math.floor(uptimeMinutes / 60);
    const uptimeDays = Math.floor(uptimeHours / 24);

    const uptimeMessage = `Cid Kagenou Bot uptime: ${uptimeDays} days, ${uptimeHours % 24} hours, ${uptimeMinutes % 60} minutes, ${Math.floor(uptimeSeconds % 60)} seconds.`;

    sendMessage(api, { threadID, message: uptimeMessage });
  },
};
