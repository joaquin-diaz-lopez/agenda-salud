// src/citas/entities/cita.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Paciente } from '../../pacientes/entities/paciente.entity';
import { Profesional } from '../../profesionales/entities/profesional.entity';
import { SlotDisponibilidad } from '../../agendas/entities/slot-disponibilidad.entity';
import { Servicio } from 'src/servicios/entities/servicio.entity';

@Entity('citas')
export class Cita {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'id_paciente', type: 'uuid', nullable: false })
  idPaciente: string;

  @ManyToOne(() => Paciente, (paciente) => paciente.citas, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'id_paciente' })
  paciente: Paciente;

  @Column({ name: 'id_profesional', type: 'uuid', nullable: false })
  idProfesional: string;

  @ManyToOne(() => Profesional, (profesional) => profesional.citas, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'id_profesional' })
  profesional: Profesional;

  @Column({ name: 'id_servicio', type: 'uuid', nullable: false })
  idServicio: string; // Columna para la clave foránea del servicio

  @ManyToOne(() => Servicio, (servicio) => servicio.citas, {
    nullable: false, // Una cita SIEMPRE debe estar asociada a un servicio
    onDelete: 'RESTRICT', // No se borra el servicio si tiene citas asociadas
  })
  @JoinColumn({ name: 'id_servicio' }) // Especifica la columna de la clave foránea
  servicio: Servicio;

  @Column({
    name: 'id_slot_disponibilidad',
    type: 'uuid',
    unique: true,
    nullable: false,
  })
  idSlotDisponibilidad: string;

  @OneToOne(() => SlotDisponibilidad, (slot) => slot.cita, {
    nullable: false,
    onDelete: 'RESTRICT', // No se borra el slot si tiene una cita
  })
  @JoinColumn({ name: 'id_slot_disponibilidad' })
  slotDisponibilidad: SlotDisponibilidad;

  @Column({
    type: 'timestamp with time zone',
    nullable: false,
    name: 'hora_inicio',
  })
  horaInicio: Date; // Derivada de SlotDisponibilidad, pero útil para consultas directas

  @Column({
    type: 'timestamp with time zone',
    nullable: false,
    name: 'hora_fin',
  })
  horaFin: Date; // Derivada de SlotDisponibilidad, pero útil para consultas directas

  @Column({ type: 'varchar', length: 50, nullable: false })
  tipo: string; // Ej. "Primera vez", "Subsecuente", "Extraordinaria"

  @Column({ type: 'varchar', length: 50, default: 'Programada' })
  estado: string; // Ej. "Programada", "Confirmada", "Cancelada", "Completada", "No Presentado"

  @Column({ nullable: true, length: 255 })
  notas: string;
}
