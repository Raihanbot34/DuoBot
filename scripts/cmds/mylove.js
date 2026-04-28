const fs = require("fs");
const jimp = require("jimp");

module.exports = {
    config: {
        name: "mylove",
        version: "2.0",
        author: "ajmaul",
        countDown: 5,
        role: 0,
        shortDescription: "Love Match",
        longDescription: "Random / Mention / Reply Love Match",
        category: "LOVE",
        guide: {
            en: "{pn} / {pn} @tag / reply"
        }
    },

    onStart: async function ({ message, event, api }) {
        const mention = Object.keys(event.mentions);
        const sender = event.senderID;

        let target;

        if (event.type === "message_reply") {
            target = event.messageReply.senderID;
        } else if (mention.length > 0) {
            target = mention[0];
        } else {
            const threadInfo = await api.getThreadInfo(event.threadID);
            const members = threadInfo.participantIDs;
            const filtered = members.filter(id => id != sender);
            target = filtered[Math.floor(Math.random() * filtered.length)];
        }

        const imgPath = await bal(sender, target);

        return message.reply({
            body: "💖 Love Match Complete 💖",
            attachment: fs.createReadStream(imgPath)
        });
    }
};

async function bal(one, two) {
    const avone = await jimp.read(`https://graph.facebook.com/${one}/picture?width=512&height=512`);
    avone.circle();

    const avtwo = await jimp.read(`https://graph.facebook.com/${two}/picture?width=512&height=512`);
    avtwo.circle();

    const pth = "abcd.jpg";
    const img = await jimp.read("https://i.imgur.com/PLNYNUV.jpeg");

    img.resize(1000, 560)
        .composite(avone.resize(268, 280), 108, 155)
        .composite(avtwo.resize(258, 275), 627, 155);

    await img.writeAsync(pth);
    return pth;
}
