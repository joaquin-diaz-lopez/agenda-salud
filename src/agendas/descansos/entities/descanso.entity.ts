import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger'; // <-- ¡Importación necesaria!
import { JornadaDiaria } from '../../jornadas-diarias/entities/jornada-diaria.entity';
import { SlotDisponibilidad } from '../../slots-disponibilidad/entities/slot-disponibilidad.entity';

@Entity('descansos')
export class Descanso {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    example: 'd1c2b3a4-5e6f-7890-1234-abcdef987654',
    description: 'Identificador único (UUID) del descanso.',
  })
  id: string;

  @Column({ name: 'id_jornada_diaria', type: 'uuid', nullable: false })
  @ApiProperty({
    example: 'f9e8d7c6-b5a4-3210-fedc-ba9876543210',
    description: 'ID de la jornada diaria a la que pertenece este descanso.',
  })
  idJornadaDiaria: string;

  @ManyToOne(() => JornadaDiaria, (jornada) => jornada.descansos, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_jornada_diaria' })
  jornadaDiaria: JornadaDiaria;

  @Column({
    type: 'timestamp with time zone',
    nullable: false,
    name: 'hora_inicio',
  })
  @ApiProperty({
    example: '2025-01-21T13:00:00Z',
    description: 'Hora de inicio del descanso (ISO 8601 con zona horaria).',
    type: 'string',
    format: 'date-time',
  })
  horaInicio: Date;

  @Column({
    type: 'timestamp with time zone',
    nullable: false,
    name: 'hora_fin',
  })
  @ApiProperty({
    example: '2025-01-21T14:00:00Z',
    description: 'Hora de fin del descanso (ISO 8601 con zona horaria).',
    type: 'string',
    format: 'date-time',
  })
  horaFin: Date;

  @Column({ type: 'varchar', length: 100, nullable: false })
  @ApiProperty({
    example: 'Almuerzo',
    description: 'Razón del descanso (ej. "Almuerzo", "Reunión").',
    maxLength: 100,
  })
  razon: string; // Ej. "Almuerzo", "Reunión", "Vacaciones", "Día Libre Personal"

  @OneToMany(() => SlotDisponibilidad, (slot) => slot.descanso)
  slots: SlotDisponibilidad[];
}
