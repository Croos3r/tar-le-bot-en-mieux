import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import database from '../utils/database.js'

@Entity()
export default class Birthday {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: 'varchar', length: 18, unique: true })
  userId!: string

  @Column({ type: 'date' })
  date!: Date

  @Column({ nullable: true, type: 'date', default: null })
  lastNotified!: Date | null
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

export async function addBirthdayForUser(userId: string, date: Date) {
  return (await getRepository().insert({ userId, date }))?.identifiers.length === 1
}

export async function removeBirthdayForUser(userId: string) {
  return (await getRepository().delete({ userId }))?.affected === 1
}

export async function setBirthdayLastNotifiedTodayForUser(userId: string) {
  return (await getRepository().update({ userId }, { userId, lastNotified: new Date() }))?.affected === 1
}