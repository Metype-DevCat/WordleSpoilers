const Database = require("@replit/database")
const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require("fs");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('set-channel')
		.setDescription('Sets the channel for the spoilers!')
    .addStringOption(option =>
        option.setName("channel")
          .setDescription("The channel for the spoiler.")
          .setRequired(true)
      ),
	async execute(interaction) {
    let channel = interaction.options.get("channel").value;
    
    if(channel.startsWith("<#")){
      channel = channel.split("<#")[1].split(">")[0];
    }
    if(channel == undefined || isNaN(channel)){
      return interaction.reply("Invalid channel!")
    }
    if(!interaction.member.permissions.has("ADMINISTRATOR")){
        return interaction.reply("You can't change that!");
    }
    var path = require('path');
    const settings = require( path.resolve( __dirname, "../settings.json" ) );
    if(!settings[interaction.guild.id]) {
      settings[interaction.guild.id] = {};
    }
    settings[interaction.guild.id].spoilers = channel;
    console.log(settings);
    fs.writeFileSync(path.resolve( __dirname, "../settings.json" ) , JSON.stringify(settings, null, 2));
    return interaction.reply(`Okay! The new channel for spoilers is <#${channel}>`);
	},
};