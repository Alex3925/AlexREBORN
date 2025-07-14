const axios = require('axios');

module.exports = {
    name: 'claude',
    description: 'Ask Claude 3 AI any question.',
    async execute(api, event, args, commands, prefix, admins, appState, sendMessage) {
        const { threadID } = event;
        const query = args.slice(1).join(' '); 

        if (!query) {
            return sendMessage(api, { threadID, message: 'Please provide a question.\nExample: /claude What is AI?' });
        }

        const apiUrl = `https://kaiz-apis.gleeze.com/api/claude3-haiku?ask=${encodeURIComponent(query)}`;

        try {
            const response = await axios.get(apiUrl);

            if (response.data && response.data.response) {
                const aiResponse = response.data.response;

                sendMessage(api, {
                    threadID,
                    message: `🤖 Claude 3 AI Response:\n\n${aiResponse}`
                });
            } else {
                sendMessage(api, { threadID, message: 'No response received from Claude 3 API.' });
            }
        } catch (error) {
            console.error('Error fetching Claude 3 response:', error);
            sendMessage(api, { threadID, message: 'Error retrieving response from Claude 3 AI.' });
        }
    }
};
