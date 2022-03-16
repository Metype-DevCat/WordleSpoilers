const Database = require("@replit/database")
const { SlashCommandBuilder } = require('@discordjs/builders');

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
    const db = new Database()    
    console.log(`${interaction.guild.id}:spoiler`);
    db.set(`${interaction.guild.id}:spoiler`, `${channel}`).then(() => {
      return interaction.reply(`Okay! The new channel for spoilers is <#${channel}>`);
    });
	},
};