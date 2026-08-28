import { DataSource } from "typeorm";
import 'dotenv/config'

export default new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: [__dirname + '/src/**/*.entity.ts'],
    migrations: [__dirname + '/src/database/migrations/*.ts'],
    ssl: true,
})
