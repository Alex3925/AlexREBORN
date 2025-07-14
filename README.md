# Introduction 
## The Seven Shadows

The Seven Shadows are Cid Kagenou's elite shadow organization.  Each member possesses unique skills and plays a crucial role in Cid's plans.

| King of Shadow garden | Image             | Description                                                                        |
|--------------|----------------------|------------------------------------------------------------------------------------|
| Cid Kagenou (King)        | ![Shadow](image/Shadow.jpg) | Cid Kagenou a.k.a shadow is the king of shadow garden and the seven shadows, and his loyal comrades Alpha is the strongest leader in Seven shadows.                                   |

| Member Name | Image             | Description                                                                        |
|--------------|----------------------|------------------------------------------------------------------------------------|
| Alpha (Leader)       | ![Alpha](image/Alpha.jpg) | [Alpha is the strongest of the Seven Shadow Garden, a powerful magic swordsman. He's a loyal and determined individual, always putting the well-being of his comrades first. However, his true strength is hidden beneath a seemingly playful and carefree exterior.]                                            |
| Beta         | ![Beta](image/Beta.jpg)  | [Beta is the brains of the group, a skilled strategist and an expert in magic. She's known for her calm and collected demeanor, but she can also be incredibly ruthless when necessary.] |
| Gamma        | ![Gamma](image/Gamma.jpg) | [Gamma is a master of martial arts, wielding her fists with incredible speed and power. She's fiercely independent and often acts as the voice of reason within the Seven Shadow Garden.]|
| Delta        | ![Delta](image/Delta.jpg) | [Delta is a skilled archer and marksman, known for her pinpoint accuracy. She's fiercely loyal to her comrades and will stop at nothing to protect them.]|
| Epsilon      | ![Epsilon](image/Epsilon.jpg) | [Epsilon is a master of illusions and deception, capable of manipulating the minds of others. He's a cunning and manipulative individual, but he also has a strong sense of justice.]|
| Zeta         | ![Zeta](image/Zeta.jpg)  | [Zeta is a master of stealth and infiltration, capable of moving through shadows undetected. She's a skilled assassin and a deadly opponent in close combat.] |
| Eta          | ![Eta](image/Eta.jpg)   | [Eta is a skilled healer and a master of life magic. She's a kind and compassionate individual, always willing to help those in need.]  |

## License
```
MIT License

Copyright (c) Date: January 20, 2025 | Name and Organization name Aljur Pogoy/GeoArchonsTeam

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

## Examples For making Comamnds

```node.js
module.exports = {
  name: 'test',
  category: 'Test',
  execute: async (api, event, args, commands, prefix, admins, appState, sendMessage) => {
    const { threadID } = event;
    sendMessage(api, { threadID, message: 'This is a test command!' });
  },
};
```
## To create an command for tokito-system, this system is request from Francis Ownersv2 
```node.js
module.exports = {

  manifest: {

    name: "ping", 

    aliases: ["p"], 

    developer: "YourName", 

    description: "Responds with Pong!",

    usage: "/ping", 

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
```
## To create an command for jinwoo-system
```node.js
const axios = require("axios");

module.exports = {
    config: {
        name: "ping",
        description: "Check bot response time.",
        usage: "/ping",
        hasPermission: 0
    },

    onStart: async function ({ api, event }) {
        const { threadID, messageID } = event;
        const start = Date.now();

        api.sendMessage("🏓 Pinging...", threadID, (err, info) => {
            if (err) return;

            const end = Date.now();
            const ping = end - start;

            api.editMessage(`🏓 Pong! Response time: ${ping}ms`, info.messageID);
        });
    }
};
```
## To create an command for second-system which is the VIP system
```node.js
module.exports = {

    name: "ping",

    run: async ({ api, event }) => {

        api.sendMessage("Pong!", event.threadID);

    }

};
```
## To create an command for cid-kagenou-system
```node.js
const axios = require("axios");

module.exports = {
    onChat: {
        name: "ping",
        aliases: ["latency", "pong"],
        developer: "Aljur Pogoy",
        description: "Check the bot's response time.",
        usage: "ping",
        config: {
            cidControl: false,
            alphaControl: false,
            deltaControl: false,
            zetaControl: false
        },
    },

    async deploy({ cid }) {
        const start = Date.now();

        const message = await cid.kagenou("🏓 Pinging...");
        const end = Date.now();

        const ping = end - start;
        cid.kagenou(`🏓 Pong! Response time: ${ping}ms`);
    }
};
```
## To handle the non-prefix comamnd
```node.js
if (commandName === 'prefix' && commands.has('prefix')) {
        const command = commands.get('prefix');
// In another way
module.exports = {
    name: "ping",
    nonPrefix: true, // Handle the nonPrefix commands
     async run ({ api, event }) => {

        api.sendMessage("Pong!", event.threadID);

    }

};
```

## Put your uid in config.json
```node.js
{
  "admins": ["100073129302064","100080383844941","61560407754490"]
}
```
## Put your appstate on appstate.json file (recommend not to use your main account)
```node.js
{}
```

## To Run the Kagenou Bot, login first in [Render](render.com)
 ```
npm start or npm install
```
## Start Comamnd
```
node index.js
```

# Credits to ws3-fca 
ws3-fca [Click Here](https://www.npmjs.com/package/ws3-fca)

