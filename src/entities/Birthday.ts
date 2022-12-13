import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import database from '../utils/database.js'
import dayjs from 'dayjs'
import { TextChannel } from 'discord.js'
import { CronJob } from 'cron'
import { Client } from 'discordx'

@Entity()
export default class Birthday {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: 'varchar', length: 18, unique: true })
  userId!: string

  @Column({ type: 'date' })
  date!: Date
}

export function getRepository() {
  return database.getRepository(Birthday)
}

export async function getBirthdayForUser(userId: string) {
  return await getRepository().findOneBy({ userId })
}

export async function getAll(limit?: number, page?: number) {
  if (limit && page) {
    return await getRepository().find({
      take: limit,
      skip: limit * page,
    })
  } else {
    return await getRepository().find()
  }
}

export async function setBirthdayForUser(userId: string, date: Date) {
  if (!await getRepository().exist({ where: { userId } })) {
    await getRepository().save({ userId, date })
    return true
  } else {
    return (await getRepository().update({ userId }, { date }))?.affected === 1
  }
}

export async function removeBirthdayForUser(userId: string) {
  return (await getRepository().delete({ userId }))?.affected === 1
}

export async function notifyBirthdays(channel: TextChannel, ...birthdays: Birthday[]) {
  let thisYear = dayjs().year()
  let usersAges = birthdays.map(birthday => [ birthday.userId, thisYear - dayjs(birthday.date).year() ])

  if (usersAges.length === 0) {
    return
  }

  if (usersAges.length === 1) {
    let [ userId, age ] = usersAges[0]
    return await channel.send(`Today is <@${userId}>'s birthday! They are ${age} years old!`)
  }

  let usersAgesString = usersAges.map(([ userId, age ]) => `<@${userId}> (${age})`).join(', ')
  usersAgesString = usersAgesString.replace(/, ([^,]*)$/, ' and $1')
  return await channel.send(`Today is ${usersAgesString} birthdays!`)
}

export function startNotifierJob(bot: Client) {
  let job = new CronJob('0 0 12 * * *', async () => {
    let today = dayjs()
    let birthdays = (await getAll())
      .filter(birthday => dayjs(birthday.date).month() === today.month() && dayjs(birthday.date).date() === today.date())

    if (birthdays.length > 0) {
      await notifyBirthdays(await bot.channels.fetch(process.env.BIRTHDAY_CHANNEL_ID as string) as TextChannel, ...birthdays)
    }
  })
  job.start()
  return job
}