import { Discord, Slash, SlashGroup, SlashOption } from 'discordx'
import { ApplicationCommandOptionType, CommandInteraction, User } from 'discord.js'
import { getAll, getRepository as getBirthdayRepository, removeBirthdayForUser, setBirthdayForUser } from '../entities/Birthday.js'
import dayjs from 'dayjs'
import Birthdays from './Birthdays.js'

@Discord()
@SlashGroup({
  name: 'birthday-admin',
  description: 'Manage birthdays of users',
  nameLocalizations: {
    fr: 'anniversaire-admin',
    'en-GB': 'birthday-admin',
    'en-US': 'birthday-admin',
  },
  descriptionLocalizations: {
    fr: 'Gérer les anniversaires des utilisateurs',
    'en-GB': 'Manage birthdays of users',
    'en-US': 'Manage birthdays of users',
  },
  defaultMemberPermissions: [ 'Administrator' ],
})
@SlashGroup('birthday-admin')
export default class BirthdaysAdmin {
  public static BIRTHDAYS_PER_PAGE = 5

  @Slash({
    name: 'list',
    description: 'Get the birthday of each user',
    nameLocalizations: {
      fr: 'lister',
      'en-GB': 'list',
      'en-US': 'list',
    },
    descriptionLocalizations: {
      fr: 'Obtenez l\'anniversaire de chaque utilisateur',
      'en-GB': 'Get the birthday of each user',
      'en-US': 'Get the birthday of each user',
    },
  })
  async list(
      @SlashOption({
        name: 'page',
        description: 'The page to list',
        descriptionLocalizations: {
          fr: 'La page à lister',
          'en-GB': 'The page to list',
          'en-US': 'The page to list',
        },
        required: false,
        type: ApplicationCommandOptionType.Integer,
      }) page: number | undefined,
      interaction: CommandInteraction,
  ) {
    page = (page ?? 1) - 1
    let birthdaysCount = await getBirthdayRepository().count()

    if (page < 0 || page > birthdaysCount / BirthdaysAdmin.BIRTHDAYS_PER_PAGE) {
      return await interaction.reply(`Invalid page number. There is a total of ${((birthdaysCount / BirthdaysAdmin.BIRTHDAYS_PER_PAGE) + 1).toFixed(0)} page(s).`)
    }

    let birthdays = await getAll(BirthdaysAdmin.BIRTHDAYS_PER_PAGE, page)

    if (birthdays.length === 0) {
      return await interaction.reply('No birthdays found')
    }

    await interaction.reply({
      embeds: [ {
        title: 'Birthdays',
        description: birthdays.map(birthday => `<@${birthday.userId}> - ${dayjs(birthday.date).format(Birthdays.FORMAT)}`).join('\n'),
        footer: {
          text: `Page ${page + 1}`,
        },
      } ],
    })
  }

  @Slash({
    name: 'delete',
    description: 'Delete the birthday of a user',
    nameLocalizations: {
      fr: 'supprimer',
      'en-GB': 'delete',
      'en-US': 'delete',
    },
    descriptionLocalizations: {
      fr: 'Supprimez l\'anniversaire d\'un utilisateur',
      'en-GB': 'Delete the birthday of a user',
      'en-US': 'Delete the birthday of a user',
    },
  })
  async delete(
      @SlashOption({
        name: 'user',
        description: 'The user to delete the birthday of',
        nameLocalizations: {
          fr: 'utilisateur',
          'en-GB': 'user',
          'en-US': 'user',
        },
        descriptionLocalizations: {
          fr: 'L\'utilisateur dont vous souhaitez supprimer l\'anniversaire',
          'en-GB': 'The user to delete the birthday of',
          'en-US': 'The user to delete the birthday of',
        },
        required: true,
        type: ApplicationCommandOptionType.User,
      }) user: User,
      interaction: CommandInteraction,
  ) {
    if (await removeBirthdayForUser(user.id)) {
      return await interaction.reply(`Deleted birthday for <@${user.id}>`)
    } else {
      return await interaction.reply(`No birthday found for <@${user.id}>`)
    }
  }

  @Slash({
    name: 'set',
    description: 'Set the birthday of a user',
    nameLocalizations: {
      fr: 'définir',
      'en-GB': 'set',
      'en-US': 'set',
    },
    descriptionLocalizations: {
      fr: 'Définissez l\'anniversaire d\'un utilisateur',
      'en-GB': 'Set the birthday of a user',
      'en-US': 'Set the birthday of a user',
    },
  })
  async set(
      @SlashOption({
        name: 'user',
        description: 'The user to set the birthday of',
        nameLocalizations: {
          fr: 'utilisateur',
          'en-GB': 'user',
          'en-US': 'user',
        },
        descriptionLocalizations: {
          fr: 'L\'utilisateur dont vous souhaitez définir l\'anniversaire',
          'en-GB': 'The user to set the birthday of',
          'en-US': 'The user to the birthday of',
        },
        required: true,
        type: ApplicationCommandOptionType.User,
      }) user: User,
      @SlashOption({
        name: 'date',
        description: 'The date of the user\'s birthday',
        descriptionLocalizations: {
          fr: 'La date de l\'anniversaire de l\'utilisateur',
          'en-GB': 'The date of the user\'s birthday',
          'en-US': 'The date of the user\'s birthday',
        },
        required: true,
        type: ApplicationCommandOptionType.String,
      }) date: string,
      interaction: CommandInteraction,
  ) {
    let dateParsed = dayjs(date, Birthdays.FORMAT, 'fr', true)

    if (!dateParsed.isValid() || dateParsed.isAfter(dayjs())) {
      return await interaction.reply(`The date ${date} is not valid`)
    }

    await setBirthdayForUser(interaction.user.id, dateParsed.toDate())
    await interaction.reply(`The birthday of <@${user.id}> has been set to ${date}`)
  }
}