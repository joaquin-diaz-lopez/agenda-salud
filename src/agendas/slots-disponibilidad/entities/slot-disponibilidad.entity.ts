import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger'; // <-- ¡Importación necesaria!
import { JornadaDiaria } from '../../jornadas-diarias/entities/jornada-diaria.entity';
import { Cita } from '../../../citas/entities/cita.entity';
import { Descanso } from '../../descansos/entities/descanso.entity';

@Entity('slots_disponibilidad')
export class SlotDisponibilidad {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    example: 'e1d2c3b4-a5f6-7890-1234-567890fedcba',
    description: 'Identificador único (UUID) del slot de disponibilidad.',
  })
  id: string;

  @Column({ name: 'id_jornada_diaria', type: 'uuid', nullable: false })
  @ApiProperty({
    example: 'd1c2b3a4-5e6f-7890-1234-abcdef987654',
    description: 'ID de la jornada diaria a la que pertenece este slot.',
  })
  idJornadaDiaria: string;

  @ManyToOne(() => JornadaDiaria, (jornada) => jornada.slotsDisponibilidad, {
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
    example: '2025-01-21T10:00:00Z',
    description: 'Hora de inicio del slot (ISO 8601 con zona horaria).',
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
    example: '2025-01-21T10:30:00Z',
    description: 'Hora de fin del slot (ISO 8601 con zona horaria).',
    type: 'string',
    format: 'date-time',
  })
  horaFin: Date;

  @Column({ type: 'boolean', default: false, name: 'esta_reservado' })
  @ApiProperty({
    example: false,
    description: 'Indica si el slot está ocupado por una cita (reservado).',
  })
  estaReservado: boolean;

  @Column({ type: 'boolean', default: false, name: 'esta_bloqueado' })
  @ApiProperty({
    example: true,
    description:
      'Indica si el slot está bloqueado por un descanso, gestión o anulación.',
  })
  estaBloqueado: boolean;

  @OneToOne(() => Cita, (cita) => cita.slotDisponibilidad, {
    nullable: true,
    eager: true,
  })
  cita: Cita | null;

  @ManyToOne(() => Descanso, (descanso) => descanso.slots, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'id_descanso' })
  descanso: Descanso | null;
}
