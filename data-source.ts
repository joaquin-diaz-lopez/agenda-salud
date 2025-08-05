import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import * as path from 'path';

config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  schema: process.env.DB_SCHEMA,
  entities: [__dirname + '/src/**/*.entity{.ts,.js}'],
  migrations: [path.join(__dirname, 'src/migrations/*.{ts,js}')],
  synchronize: false, // Siempre false para migraciones
  logging: true,
  ssl:
    process.env.DB_SSL_MODE === 'require'
      ? {
          rejectUnauthorized: false,
        }
      : false,
});

export default AppDataSource;
