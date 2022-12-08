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

export const birthdayRepository = database.getRepository(Birthday)

export async function getBirthdayForUser(userId: string) {
  return await birthdayRepository.find({ where: { userId } })
}

export async function addBirthdayForUser(userId: string, date: Date) {
  const birthday = birthdayRepository.create({ userId, date })
  await birthdayRepository.save(birthday)
}

export async function removeBirthdayForUser(userId: string) {
  await birthdayRepository.delete({ userId })
}

export async function setBirthdayLastNotifiedTodayForUser(userId: string) {
  await birthdayRepository.update({ userId }, { userId, lastNotified: new Date() })
}