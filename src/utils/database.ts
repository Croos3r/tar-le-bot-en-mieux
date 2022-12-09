import { DataSource } from 'typeorm'
import Birthday from '../entities/Birthday.js'

export default new DataSource({
  type: 'sqlite',
  database: process.env.DATABASE_FILE as string,
  synchronize: true,
  entities: [
    Birthday,
  ],
})