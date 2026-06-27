const { findUid } = global.utils;
const cooldown = new Map();

/* ===== BOLD CHARACTER MAPS ===== */
const boldChars = {
  "a":"𝐚","b":"𝐛","c":"𝐜","d":"𝐝","e":"𝐞","f":"𝐟","g":"𝐠","h":"𝐡","i":"𝐢","j":"𝐣","k":"𝐤","l":"𝐥","m":"𝐦","n":"𝐧","o":"𝐨","p":"𝐩","q":"𝐪","r":"𝐫","s":"𝐬","t":"𝐭","u":"𝐮","v":"𝐯","w":"𝐰","x":"𝐱","y":"𝐲","z":"𝐳",
  "A":"𝐀","B":"𝐁","C":"𝐂","D":"𝐃","E":"𝐄","F":"𝐅","G":"𝐆","H":"𝐇","I":"𝐈","J":"𝐉","K":"𝐊","L":"𝐋","M":"𝐌","N":"𝐍","O":"𝐎","P":"𝐏","Q":"𝐐","R":"𝐑","S":"𝐒","T":"𝐓","U":"𝐔","V":"𝐕","W":"𝐖","X":"𝐗","Y":"𝐘","Z":"𝐙",
  "0":"𝟎","1":"𝟏","2":"𝟐","3":"𝟑","4":"𝟒","5":"𝟓","6":"𝟔","7":"𝟕","8":"𝟖","9":"𝟗",
  ".":"·"
};

const toBoldText = str => 
  str.toString().split("").map(c => boldChars[c] || c).join("");

module.exports = {
  config: {
    name: "balance",
    aliases: ["bal"],
    version: "1.8",
    author: "Arafat",
    role: 0,
    category: "economy",
    guide: {
      en: "{pn} | {pn} @tag | Reply to a message"
    }
  },

  onStart: async ({ message, usersData, event, api, args }) => {
    const senderID = event.senderID;
    const now = Date.now();

    /* ===== COOLDOWN (5 SEC) ===== */
    if (now - (cooldown.get(senderID) || 0) < 5000) {
      return message.reply("• ⏳ 𝐒𝐥𝐨𝐰 𝐝𝐨𝐰𝐧, 𝐛𝐚𝐛𝐲.");
    }
    cooldown.set(senderID, now);

    /* ===== TARGET LOGIC (Integrated from UID script) ===== */
    let targetIDs = [];

    // 1. Check for Reply
    if (event.messageReply?.senderID) {
      targetIDs.push(event.messageReply.senderID);
    } 
    // 2. Check for Mention / Tag
    else if (Object.keys(event.mentions).length > 0) {
      targetIDs = Object.keys(event.mentions);
    } 
    // 3. Check for Name Search / Fallback to Self
    else if (args.length > 0) {
      const query = args.join(" ").toLowerCase().replace("@", "");
      const threadInfo = await api.getThreadInfo(event.threadID);
      const ids = threadInfo.participantIDs || [];
      for (const uid of ids) {
        try {
          const name = (await usersData.getName(uid)).toLowerCase();
          if (name.includes(query)) {
            targetIDs.push(uid);
            break; // Find the first match
          }
        } catch (e) {}
      }
    } 
    
    // Default to sender if no targets found
    if (targetIDs.length === 0) targetIDs.push(senderID);

    /* ===== DATA PROCESSING ===== */
    let finalMsg = "";
    
    // Limit to processing first target found for clean output
    const targetID = targetIDs[0];

    const data = await usersData.get(targetID) || {};
    const money = data.money || 0;

    let name = "Unknown User";
    try {
      const info = await api.getUserInfo(targetID);
      name = info[targetID]?.name || name;
    } catch {}

    /* ===== SMART FORMAT ===== */
    const formatMoney = n => {
      let val;
      let suffix = "";
      if (n >= 1_000_000_000) {
        val = (n / 1_000_000_000).toFixed(1);
        suffix = "𝐁";
      } else if (n >= 1_000_000) {
        val = (n / 1_000_000).toFixed(1);
        suffix = "𝐌";
      } else if (n >= 1_000) {
        val = (n / 1_000).toFixed(1);
        suffix = "𝐊";
      } else {
        val = n.toString();
      }
      
      val = val.endsWith(".0") ? val.slice(0, -2) : val;
      return toBoldText(val) + suffix;
    };

    /* ===== FINAL MESSAGE ===== */
    return message.reply(
`>🎀 ${toBoldText(name)}

𝐁𝐚𝐛𝐲, 𝐘𝐨𝐮𝐫 𝐁𝐚𝐥𝐚𝐧𝐜𝐞: $${formatMoney(money)}`
    );
  }
};
