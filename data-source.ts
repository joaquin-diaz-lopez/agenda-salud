// data-source.ts (en la raíz del proyecto)
import { DataSource } from 'typeorm';
import { config } from 'dotenv'; // Para cargar variables de entorno
import * as path from 'path';

// Cargar variables de entorno
config();

// Importa todas tus entidades aquí
import { Usuario } from './src/usuarios/entities/usuario.entity';
import { Rol } from './src/roles/entities/rol.entity';
import { Profesional } from './src/profesionales/entities/profesional.entity';
import { Paciente } from './src/pacientes/entities/paciente.entity';
import { CentroDeSalud } from './src/centros-de-salud/entities/centro-de-salud.entity';
import { AgendaProfesional } from './src/agendas/entities/agenda-profesional.entity';
import { JornadaDiaria } from './src/agendas/entities/jornada-diaria.entity';
import { SlotDisponibilidad } from './src/agendas/entities/slot-disponibilidad.entity';
import { Descanso } from './src/agendas/entities/descanso.entity';
import { Cita } from './src/citas/entities/cita.entity';
import { HistorialMedicoElectronico } from './src/historiales-medicos/entities/historial-medico-electronico.entity';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  schema: process.env.DB_SCHEMA,
  entities: [
    Usuario,
    Rol,
    Profesional,
    Paciente,
    CentroDeSalud,
    AgendaProfesional,
    JornadaDiaria,
    SlotDisponibilidad,
    Descanso,
    Cita,
    HistorialMedicoElectronico,
  ],
  migrations: [path.join(__dirname, 'src/migrations/*.{ts,js}')],
  synchronize: false, // ¡Siempre false en el DataSource para migraciones!
  logging: true,
});

export default AppDataSource;
