import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Unique,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger'; // <-- ¡Importación necesaria!
import { AgendaProfesional } from '../../agendas-profesional/entities/agenda-profesional.entity';
import { SlotDisponibilidad } from '../../slots-disponibilidad/entities/slot-disponibilidad.entity';
import { Descanso } from '../../descansos/entities/descanso.entity';

@Entity('jornadas_diarias')
@Unique(['idAgendaProfesional', 'fecha'])
export class JornadaDiaria {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    example: 'd1c2b3a4-5e6f-7890-1234-abcdef987654',
    description: 'Identificador único (UUID) de la Jornada Diaria.',
  })
  id: string;

  @Column({ name: 'id_agenda_profesional', type: 'uuid', nullable: false })
  @ApiProperty({
    example: 'f9e8d7c6-b5a4-3210-fedc-ba9876543210',
    description: 'ID de la agenda profesional a la que pertenece esta jornada.',
  })
  idAgendaProfesional: string;

  @ManyToOne(() => AgendaProfesional, (agenda) => agenda.jornadasDiarias, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_agenda_profesional' })
  agendaProfesional: AgendaProfesional; // Relación ORM

  @Column({ type: 'timestamp with time zone', nullable: false })
  @ApiProperty({
    example: '2025-01-20T06:00:00.000Z', // Se documenta como ISO 8601 con TZ
    description:
      'Fecha y hora (incluyendo zona horaria) para la cual aplica la jornada.',
  })
  fecha: Date;

  @Column({ type: 'time', nullable: false, name: 'hora_inicio_trabajo' })
  @ApiProperty({
    example: '09:00',
    description: 'Hora de inicio de la jornada en formato HH:MM.',
    format: 'time',
  })
  horaInicioTrabajo: string; // Ej. "09:00:00"

  @Column({ type: 'time', nullable: false, name: 'hora_fin_trabajo' })
  @ApiProperty({
    example: '17:00',
    description: 'Hora de fin de la jornada en formato HH:MM.',
    format: 'time',
  })
  horaFinTrabajo: string; // Ej. "17:00:00"

  @OneToMany(() => SlotDisponibilidad, (slot) => slot.jornadaDiaria)
  slotsDisponibilidad: SlotDisponibilidad[]; // Relación ORM

  @OneToMany(() => Descanso, (descanso) => descanso.jornadaDiaria)
  descansos: Descanso[]; // Relación ORM
}
