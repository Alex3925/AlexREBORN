module.exports = {
  name: "uid",
  category: "Utility",
  execute: async (api, event, args, commands, prefix, admins, appState, sendMessage) => {
    const { threadID, senderID, messageReply, mentions } = event;

    let targetID;
    let targetName;

  
    if (Object.keys(mentions).length > 0) {
      targetID = Object.keys(mentions)[0]; 
      targetName = mentions[targetID]; 
    } 
  
    else if (messageReply) {
      targetID = messageReply.senderID;
      targetName = "the replied user";
    } 
  
    else {
      targetID = senderID;
      targetName = "You";
    }

    // Send the UID as a response
    sendMessage(api, { threadID, message: `  ${targetName}'s UID: ${targetID}` });
  }
};
