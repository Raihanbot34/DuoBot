const senderID = event.senderID;

const senderBalance = (await usersData.get(senderID, "money")) || 0;
const targetBalance = (await usersData.get(targetID, "money")) || 0;

// 🎁 Gift system (if target অন্য কেউ হয়)
if (targetID !== senderID) {
  if (senderBalance < amount) {
    return message.reply("❌ You don't have enough balance!");
  }

  await usersData.set(senderID, senderBalance - amount, "money");
  await usersData.set(targetID, targetBalance + amount, "money");

  const senderName = await usersData.getName(senderID);
  const targetName = await usersData.getName(targetID);

  return message.reply(
    `🎁 Gift Sent!\n👤 From: ${senderName}\n👤 To: ${targetName}\n💸 Amount: $${amount.toLocaleString()}`
  );
}

// ➕ Self add (আগের মতোই)
const newBalance = oldBalance + amount;

await usersData.set(targetID, newBalance, "money");

const name = await usersData.getName(targetID);
const displayAmount = Number(newBalance).toLocaleString();

return message.reply(
  `💸 Balance Added!\n👤 You (${name})\n➕ Added: ${amount.toLocaleString()}\n💰 Total: $${displayAmount}`
);
