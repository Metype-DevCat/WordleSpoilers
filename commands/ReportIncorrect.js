const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require("fs");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('report-incorrect')
		.setDescription('Sends a report whenever the spoiler seems to not match the word.'),
	async execute(interaction) {
    var path = require('path');
    const settings = require( path.resolve( __dirname, "../settings.json" ) );
    if(!settings[interaction.guild.id]) {
      settings[interaction.guild.id] = {};
    }
    let value = settings[interaction.guild.id].reports
    if(value == undefined) value = 0;
    settings[interaction.guild.id].reports++;
    fs.writeFileSync(path.resolve( __dirname, "../settings.json" ) ,JSON.stringify(settings, null, 2));
    return interaction.reply(`Report counted.`);
	},
};