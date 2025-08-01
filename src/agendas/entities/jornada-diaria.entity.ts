// src/agendas/entities/jornada-diaria.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { AgendaProfesional } from './agenda-profesional.entity';
import { SlotDisponibilidad } from './slot-disponibilidad.entity';
import { Descanso } from './descanso.entity';

@Entity('jornadas_diarias')
export class JornadaDiaria {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'id_agenda_profesional', type: 'uuid', nullable: false })
  idAgendaProfesional: string;

  @ManyToOne(() => AgendaProfesional, (agenda) => agenda.jornadasDiarias, {
    nullable: false,
    onDelete: 'CASCADE', // Si se borra la agenda, se borran las jornadas
  })
  @JoinColumn({ name: 'id_agenda_profesional' })
  agendaProfesional: AgendaProfesional;

  @Column({ type: 'date', nullable: false, unique: true }) // Una jornada por profesional por día
  fecha: Date;

  @Column({ type: 'time', nullable: false, name: 'hora_inicio_trabajo' })
  horaInicioTrabajo: string; // Ej. "09:00:00"

  @Column({ type: 'time', nullable: false, name: 'hora_fin_trabajo' })
  horaFinTrabajo: string; // Ej. "17:00:00"

  @OneToMany(() => SlotDisponibilidad, (slot) => slot.jornadaDiaria)
  slotsDisponibilidad: SlotDisponibilidad[];

  @OneToMany(() => Descanso, (descanso) => descanso.jornadaDiaria)
  descansos: Descanso[];
}
