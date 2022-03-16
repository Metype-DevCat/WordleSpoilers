const fs = require('node:fs');
const { Client, Collection, Intents } = require('discord.js');
const token = process.env['token'];
const CronJob = require('cron').CronJob;
var path = require('path');
const WordleWord = require( path.resolve( __dirname, "./wordle-word.js" ) );
const Database = require("@replit/database")
var wd = require("word-definition");

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

client.once('ready', () => {
	console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.login(token);

var job = new CronJob('0 1 0 * * *', function() {
  const word = WordleWord();
  console.log(word);
  const db = new Database();
  client.guilds.cache.map((guild) => {   
    db.get(`${guild.id}:spoiler`).then(value => {
      if(value == undefined) return;
      let channel = client.channels.cache.get(value);
      if(channel == undefined) return;
      let rand = randomIntFromInterval(1,9);
      if(rand >= 6)
        wd.getDef(word, "en", null, function(definition) {
          channel.send(`Wordle Spoiler! : \n||${definition.category}: ${definition.definition}||`)
        });
      else
        channel.send(`Wordle Spoiler! : \n||Letter ${rand} of the wordle is ${word.substring(rand-1,rand)}||`)
    });
  });
}, null, true, 'America/Chicago');
job.start();
