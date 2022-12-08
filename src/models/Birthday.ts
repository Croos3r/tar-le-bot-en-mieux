import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

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