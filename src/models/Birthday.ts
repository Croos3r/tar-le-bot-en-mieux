import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Birthday {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: 'varchar', length: 18 })
  userId!: string

  @Column({ type: 'date' })
  date!: Date

  @Column({ nullable: true, type: 'date' })
  lastNotified!: Date | null
}