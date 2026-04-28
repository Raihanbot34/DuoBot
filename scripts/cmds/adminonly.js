const fs = require("fs-extra");
const { config } = global.GoatBot;
const { client } = global;

module.exports = {
	config: {
		name: "adminonly",
		aliases: ["adonly", "onlyad", "onlyadmin"],
		version: "2.1",
		author: "Ajmaul MOD FIX",
		countDown: 5,
		role: 3,
		description: "Only admin can use bot (silent mode)",
		category: "owner",
		guide: "{pn} on/off"
	},

	onStart: async function ({ args, message }) {
		let value;

		if (args[0] == "on")
			value = true;
		else if (args[0] == "off")
			value = false;
		else
			return message.reply("Use: adminonly on/off");

		config.adminOnly = {
			enable: value,
			silent: true
		};

		fs.writeFileSync(client.dirConfig, JSON.stringify(config, null, 2));

		return message.reply(
			value
				? "✅ Admin Only Mode ON (Only admins can use bot)"
				: "❌ Admin Only Mode OFF (Everyone can use bot)"
		);
	},

	onChat: async function ({ event }) {
		const senderID = String(event.senderID);

		const admins = (global.GoatBot.config.adminBot || []).map(id => String(id));

		if (global.GoatBot.config.adminOnly?.enable) {
			if (!admins.includes(senderID)) {
				return; // silent ignore
			}
		}
	}
};
