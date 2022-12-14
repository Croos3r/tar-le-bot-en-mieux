import { Discord, Slash, SlashGroup, SlashOption } from 'discordx'
import { ApplicationCommandOptionType, CommandInteraction, User } from 'discord.js'
import { getBirthdayForUser, setBirthdayForUser } from '../entities/Birthday.js'
import dayjs from 'dayjs'
import { InteractionReplier } from '../utils/discordjs.js'

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
  public static FORMAT = 'DD/MM/YYYY'

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
      nameLocalizations: {
        fr: 'utilisateur',
        'en-GB': 'user',
        'en-US': 'user',
      },
      required: false,
      type: ApplicationCommandOptionType.User,
    }) user: User | undefined,
    interaction: CommandInteraction,
  ) {
    const replier = new InteractionReplier(interaction, true)
    user = user ?? interaction.user
    let birthday = await getBirthdayForUser(user.id)

    if (birthday) {
      return await replier.replyMessage(`The birthday of ${user} is ${dayjs(birthday.date).format(Birthdays.FORMAT)}`)
    }

    await replier.replyMessage(`No birthday found for ${user}`)
  }

  @Slash({
    name: 'set',
    description: 'Set your birthday',
    nameLocalizations: {
      fr: 'ajouter',
      'en-GB': 'set',
      'en-US': 'set',
    },
    descriptionLocalizations: {
      fr: 'Définissez votre anniversaire',
      'en-GB': 'Set your birthday',
      'en-US': 'Set your birthday',
    },
  })
  async set(
    @SlashOption({
      name: 'date',
      description: 'Your birthday',
      descriptionLocalizations: {
        fr: 'Votre anniversaire',
        'en-GB': 'Your birthday',
        'en-US': 'Your birthday',
      },
      required: true,
      type: ApplicationCommandOptionType.String,
    }) date: string,
    interaction: CommandInteraction,
  ) {
    const replier = new InteractionReplier(interaction, true)
    let birthday = await getBirthdayForUser(interaction.user.id)

    if (birthday) {
      return await replier.replyMessage(`You already have your birthday set to ${dayjs(birthday.date).format(Birthdays.FORMAT)}`)
    }

    let dateParsed = dayjs(date, Birthdays.FORMAT)

    if (!dateParsed.isValid() || dateParsed.isAfter(dayjs())) {
      return await replier.replyMessage(`The date ${date} is not valid. Format: ${Birthdays.FORMAT}`)
    }

    await setBirthdayForUser(interaction.user.id, dateParsed.toDate())
    await replier.replyMessage(`Your birthday has been set to ${dateParsed.format(Birthdays.FORMAT)}`)
  }
}