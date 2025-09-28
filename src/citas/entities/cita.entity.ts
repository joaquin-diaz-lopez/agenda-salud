import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import {
  CITA_ESTADOS_VALIDOS,
  CITA_ESTADO_DEFAULT,
  MAX_LENGTH_NOTES,
  MAX_LENGTH_NAME,
} from '../../common/constants/domain.constants';
import { Paciente } from '../../pacientes/entities/paciente.entity';
import { Profesional } from '../../profesionales/entities/profesional.entity';
import { SlotDisponibilidad } from '../../agendas/slots-disponibilidad/entities/slot-disponibilidad.entity';
import { Servicio } from '../../servicios/entities/servicio.entity';

@Entity('citas')
export class Cita {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    description: 'ID de la Cita.',
  })
  id: string;

  @Column({ name: 'id_paciente', type: 'uuid', nullable: false })
  @ApiProperty({
    example: 'f9e8d7c6-b5a4-3210-fedc-ba9876543210',
    description: 'ID del paciente.',
  })
  idPaciente: string;

  @ManyToOne(() => Paciente, (paciente) => paciente.citas, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'id_paciente' })
  paciente: Paciente;

  @Column({ name: 'id_profesional', type: 'uuid', nullable: false })
  @ApiProperty({
    example: 'b1c2d3e4-f5a6-7890-1234-567890abcdef',
    description: 'ID del profesional.',
  })
  idProfesional: string;

  @ManyToOne(() => Profesional, (profesional) => profesional.citas, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'id_profesional' })
  profesional: Profesional;

  @Column({ name: 'id_servicio', type: 'uuid', nullable: false })
  @ApiProperty({
    example: 'c1d2e3f4-a5b6-7890-1234-567890abcdef',
    description: 'ID del servicio.',
  })
  idServicio: string;

  @ManyToOne(() => Servicio, (servicio) => servicio.citas, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'id_servicio' })
  servicio: Servicio;

  @Column({
    name: 'id_slot_disponibilidad',
    type: 'uuid',
    unique: true,
    nullable: false,
  })
  @ApiProperty({
    example: 'd1e2f3a4-b5c6-7890-1234-567890abcdef',
    description: 'ID del slot reservado.',
  })
  idSlotDisponibilidad: string;

  @OneToOne(() => SlotDisponibilidad, (slot) => slot.cita, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'id_slot_disponibilidad' })
  slotDisponibilidad: SlotDisponibilidad;

  @Column({
    type: 'timestamp with time zone',
    nullable: false,
    name: 'hora_inicio',
  })
  @ApiProperty({
    example: '2025-02-15T09:00:00Z',
    description: 'Hora de inicio de la cita.',
  })
  horaInicio: Date;

  @Column({
    type: 'timestamp with time zone',
    nullable: false,
    name: 'hora_fin',
  })
  @ApiProperty({
    example: '2025-02-15T09:30:00Z',
    description: 'Hora de fin de la cita.',
  })
  horaFin: Date;

  @Column({ type: 'varchar', length: MAX_LENGTH_NAME, nullable: false }) // <-- Usamos constante
  @ApiProperty({
    example: 'Subsecuente',
    description: 'Tipo de cita.',
    maxLength: MAX_LENGTH_NAME,
  }) // <-- Usamos constante
  tipo: string;

  @Column({
    type: 'varchar',
    length: MAX_LENGTH_NAME,
    default: CITA_ESTADO_DEFAULT, // <-- Usamos constante
  })
  @ApiProperty({
    example: CITA_ESTADO_DEFAULT,
    description: 'Estado de la cita.',
    maxLength: MAX_LENGTH_NAME,
    enum: CITA_ESTADOS_VALIDOS, // <-- Usamos constante
  })
  estado: string;

  @Column({ nullable: true, length: MAX_LENGTH_NOTES }) // <-- Usamos constante
  @ApiProperty({
    example: 'Llamar al paciente el día anterior.',
    description: 'Notas.',
    required: false,
    nullable: true,
    maxLength: MAX_LENGTH_NOTES,
  }) // <-- Usamos constante
  notas: string;
}
