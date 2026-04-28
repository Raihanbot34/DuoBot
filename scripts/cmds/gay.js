const DIG = require("discord-image-generation");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "gay",
    aliases: [],
    version: "1.0",
    author: "@tas33n",
    countDown: 5,
    role: 0,
    shortDescription: "Find out who's gay 😳",
    longDescription: "Add a gay filter to someone's avatar",
    category: "fun",
    guide: "{pn} @mention or reply",
  },

  onStart: async function ({ message, event, usersData }) {
    let uid;
    const mention = Object.keys(event.mentions);

    // UID নির্ধারণ (reply, mention বা self)
    if (event.type === "message_reply") {
      uid = event.messageReply.senderID;
    } else if (mention.length > 0) {
      uid = mention[0];
    } else {
      uid = event.senderID;
    }

    const url = await usersData.getAvatarUrl(uid);
    const img = await new DIG.Gay().getImage(url);
    const pathSave = `${__dirname}/tmp/gay.png`;

    fs.writeFileSync(pathSave, Buffer.from(img));

    let body = "🏳️‍🌈 Look... I found a gay!";
    if (!mention[0] && event.type !== "message_reply") {
      body = "😳 Baka! You’re gay!\n(You forgot to mention or reply someone)";
    }

    message.reply(
      {
        body,
        attachment: fs.createReadStream(pathSave),
      },
      () => fs.unlinkSync(pathSave)
    );
  },

  // 🟢 No Prefix Trigger
  onChat: async function ({ event, message, usersData }) {
    // যদি কেউ "gay" লেখে, তখনই কমান্ডটা রান করবে
    if (!event.body) return;
    const text = event.body.toLowerCase();

    // যেকোনো "gay" শব্দ থাকলে রান করাও
    if (text.includes("gay")) {
      let uid;
      const mention = Object.keys(event.mentions);

      if (event.type === "message_reply") {
        uid = event.messageReply.senderID;
      } else if (mention.length > 0) {
        uid = mention[0];
      } else {
        uid = event.senderID;
      }

      const url = await usersData.getAvatarUrl(uid);
      const img = await new DIG.Gay().getImage(url);
      const pathSave = `${__dirname}/tmp/gay.png`;

      fs.writeFileSync(pathSave, Buffer.from(img));

      message.reply(
        {
          body: "🏳️‍🌈 Look... I found a gay!",
          attachment: fs.createReadStream(pathSave),
        },
        () => fs.unlinkSync(pathSave)
      );
    }
  },
};
