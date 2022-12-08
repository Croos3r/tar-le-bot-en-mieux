import { dirname, importx } from '@discordx/importer'
import type { Interaction } from 'discord.js'
import { IntentsBitField } from 'discord.js'
import { Client } from 'discordx'
import database from './utils/database.js'

export const bot = new Client(
    {
      // To use only guild command
      // botGuilds: [(client) => client.guilds.cache.map((guild) => guild.id)],

      // Discord intents
      intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessageReactions,
        IntentsBitField.Flags.DirectMessages,
        IntentsBitField.Flags.DirectMessageReactions,
        IntentsBitField.Flags.MessageContent,
      ],

      // Debug logs are disabled in silent mode
      silent: false,
    },
)

bot.once('ready', async () => {
  // Make sure all guilds are cached
  await bot.guilds.fetch()

  // Synchronize applications commands with Discord
  await bot.initApplicationCommands()

  // To clear all guild commands, uncomment this line,
  // This is useful when moving from guild commands to global commands
  // It must only be executed once
  //
  //  await bot.clearApplicationCommands(
  //    ...bot.guilds.cache.map((g) => g.id)
  //  );

  console.log('Bot started')
})

bot.on('interactionCreate', (interaction: Interaction) => {
  bot.executeInteraction(interaction)
})

async function run() {
  // The following syntax should be used in the commonjs environment
  //
  // await importx(__dirname + "/{events,commands}/**/*.{ts,js}");

  // The following syntax should be used in the ECMAScript environment
  await importx(`${dirname(import.meta.url)}/{events,commands}/**/*.{ts,js}`)

  // Let's start the bot
  if (!process.env.BOT_TOKEN) {
    throw Error('Could not find BOT_TOKEN in your environment')
  }

  if (!process.env.DATABASE_FILE) {
    throw Error('Could not find DATABASE_FILE in your environment')
  }

  if (!process.env.BIRTHDAY_CHANNEL_ID) {
    throw Error('Could not find BIRTHDAY_CHANNEL_ID in your environment')
  }

  await database.initialize()
  // Log in with your bot token
  await bot.login(process.env.BOT_TOKEN)
}

run()
