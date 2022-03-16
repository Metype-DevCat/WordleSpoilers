const Database = require("@replit/database")
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('report-incorrect')
		.setDescription('Sends a report whenever the spoiler seems to not match the word.'),
	async execute(interaction) {
    const db = new Database();
    db.get(`${interaction.guild.id}:reports`).then(value => {
      if(value == undefined) value = 0;
          db.set(`${interaction.guild.id}:reports`, value++).then(() => {
          return interaction.reply(`Report counted.`);
      });
    });
	},
};