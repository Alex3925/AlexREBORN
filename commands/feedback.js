const nodemailer = require("nodemailer");

module.exports = {

    name: "feedback",

    description: "Send feedback via email.",

    usage: "/feedback | <your Gmail> | <message>",

    

    async run({ api, event }) {

        const args = event.body.split(" | ").map(arg => arg.trim());

        

        if (args.length < 3) {

            return api.sendMessage("⚠ Use: /feedback | <your Gmail> | <message>", event.threadID);

        }

        const userEmail = args[1];

        const message = args.slice(2).join(" ");

        

        const transporter = nodemailer.createTransport({

            service: "gmail",

            auth: {

                user: "korisawarezero@gmail.com",  // Replace with bot Gmail

                pass: "puqk txlt krae yxel"       // Replace your app Password not password of your gmail

            }

        });

        const mailOptions = {

            from: userEmail,

            to: "korisawaumuzaki@gmail.com",

            subject: `Feedback from ${userEmail}`,

            text: message

        };

        // Send Email (jur)

        try {

            await transporter.sendMail(mailOptions);

            api.sendMessage("✅ Your feedback has been sent successfully!", event.threadID);

        } catch (error) {

            console.error("Email error:", error);

            api.sendMessage("❌ Failed to send feedback. Please try again later.", event.threadID);

        }

    }

};