import { DataSource } from 'typeorm'
import Birthday from '../models/Birthday.js'

export default new DataSource({
  type: 'sqlite',
  database: process.env.DATABASE_FILE as string,
  synchronize: true,
  entities: [
    Birthday,
  ],
})