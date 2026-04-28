module.exports = {
  config: {
    name: "girl",
    aliases: ["girl"],
    version: "1.0",
    author: "AceGun",
    countDown: 5,
    role: 0,
    shortDescription: "Send a random girl photo",
    longDescription: "",
    category: "media",
    guide: "{pn}"
  },

  onStart: async function ({ message, event }) {
    // Array of links
    const links = [
      "https://i.postimg.cc/wTJNSC1G/E-B9ea-WQAAst-Yg.jpg",
      "https://i.postimg.cc/sgrWyTSD/E-B9eb-AWUAINyt-B.jpg",
      "https://i.postimg.cc/TYcj48LJ/E02i-P-q-XIAE62tu.jpg",
      "https://i.postimg.cc/MpK0ks12/E02i-P-w-WYAEbvgg.jpg",
      "https://i.postimg.cc/k5LWbqzq/E02i-P-x-XIAAy-K2k.jpg",
      // add the rest of your links here...
    ];

    // Pick a random link
    const randomLink = links[Math.floor(Math.random() * links.length)];

    // Send the image
    await message.send({
      body: "Here’s a random girl photo for you! 🌸",
      attachment: await global.utils.getStreamFromURL(randomLink)
    });
  }
};
