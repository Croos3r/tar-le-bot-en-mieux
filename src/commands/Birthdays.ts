import { Discord, Slash, SlashGroup, SlashOption } from 'discordx'
import { ApplicationCommandOptionType, CommandInteraction, User } from 'discord.js'
import { addBirthdayForUser, getBirthdayForUser } from '../entities/Birthday.js'
import dayjs from 'dayjs'

@Discord()
@SlashGroup({
  name: 'birthday',
  description: 'Add your birtdhday and see others\'',
  nameLocalizations: {
    fr: 'anniversaire',
    'en-GB': 'birthday',
    'en-US': 'birthday',
  },
  descriptionLocalizations: {
    fr: 'Ajoutez votre anniversaire et voyez ceux des autres',
    'en-GB': 'Add your birtdhday and see others\'',
    'en-US': 'Add your birtdhday and see others\'',
  },
})
@SlashGroup('birthday')
export default class Birthdays {
  @Slash({
    name: 'get',
    description: 'Get the birthday of a user or your own',
    nameLocalizations: {
      fr: 'voir',
      'en-GB': 'get',
      'en-US': 'get',
    },
    descriptionLocalizations: {
      fr: 'Obtenez l\'anniversaire d\'un utilisateur ou le vôtre',
      'en-GB': 'Get the birthday of a user or your own',
      'en-US': 'Get the birthday of a user or your own',
    },
  })
  async get(
      @SlashOption({
        name: 'user',
        description: 'The user to get the birthday of',
        required: false,
        type: ApplicationCommandOptionType.User,
      }) user: User | undefined,
      interaction: CommandInteraction,
  ) {
    user = user ?? interaction.user
    let birthday = await getBirthdayForUser(user.id)

    if (birthday) {
      return await interaction.reply(`The birthday of ${user} is ${birthday.date}`)
    }

    await interaction.reply(`No birthday found for ${user.username}`)
  }

  @Slash({
    name: 'set',
    description: 'Set your birthday',
  })
  async set(
      @SlashOption({
        name: 'date',
        description: 'Your birthday',
        required: true,
        type: ApplicationCommandOptionType.String,
      }) date: string,
      interaction: CommandInteraction,
  ) {
    let birthday = await getBirthdayForUser(interaction.user.id)

    if (birthday) {
      return await interaction.reply(`You already have a birthday set to ${birthday.date}`)
    }

    let dateParsed = dayjs(date, 'DD/MM/YYYY', 'fr', true)

    if (!dateParsed.isValid() || dateParsed.isAfter(dayjs())) {
      return await interaction.reply(`The date ${date} is not valid`)
    }

    if (!await addBirthdayForUser(interaction.user.id, dateParsed.toDate())) {
      return await interaction.reply(`An error occurred while setting your birthday`)
    }

    await interaction.reply(`Your birthday has been set to ${date}`)
  }
}