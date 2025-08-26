// data-source.ts (en la raíz del proyecto)
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

  // --- ¡CORRECCIÓN CLAVE AQUÍ: USAR process.cwd() PARA RUTAS ABSOLUTAS! ---
  // Las entidades compiladas estarán en `dist/**/*.entity.js`
  entities: [path.join(process.cwd(), 'dist', '**', '*.entity{.ts,.js}')],
  // Las migraciones compiladas estarán en `dist/src/migrations/*.js`
  migrations: [path.join(process.cwd(), 'dist', 'src', 'migrations', '*.js')],
  // --- FIN CORRECCIÓN ---

  synchronize: false, // Siempre false para migraciones en producción
  logging: true,
  ssl:
    process.env.DB_SSL_MODE === 'require'
      ? {
          rejectUnauthorized: false,
        }
      : false,
});

export default AppDataSource;
