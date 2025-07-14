module.exports.config = {

    name: 'ping',

    description: 'Responds with Pong!',

    usage: 'ping'

};

module.exports.run = ({ api, event }) => {

    const { threadID } = event;

    api.sendMessage('Pong!', threadID);

};