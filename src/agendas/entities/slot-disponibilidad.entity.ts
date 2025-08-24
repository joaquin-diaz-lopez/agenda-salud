// src/agendas/entities/slot-disponibilidad.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { JornadaDiaria } from './jornada-diaria.entity';
import { Cita } from '../../citas/entities/cita.entity';
import { Descanso } from './descanso.entity';

@Entity('slots_disponibilidad')
export class SlotDisponibilidad {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'id_jornada_diaria', type: 'uuid', nullable: false })
  idJornadaDiaria: string;

  @ManyToOne(() => JornadaDiaria, (jornada) => jornada.slotsDisponibilidad, {
    nullable: false,
    onDelete: 'CASCADE', // Si se borra la jornada, se borran sus slots
  })
  @JoinColumn({ name: 'id_jornada_diaria' })
  jornadaDiaria: JornadaDiaria;

  @Column({
    type: 'timestamp with time zone',
    nullable: false,
    name: 'hora_inicio',
  })
  horaInicio: Date;

  @Column({
    type: 'timestamp with time zone',
    nullable: false,
    name: 'hora_fin',
  })
  horaFin: Date;

  @Column({ type: 'boolean', default: false, name: 'esta_reservado' })
  estaReservado: boolean; // ¿Está este slot ocupado por una cita?

  @Column({ type: 'boolean', default: false, name: 'esta_bloqueado' })
  estaBloqueado: boolean; // ¿Está este slot bloqueado (por descanso, gestión, etc.)?

  @OneToOne(() => Cita, (cita) => cita.slotDisponibilidad, { nullable: true })
  cita: Cita | null;

  @ManyToOne(() => Descanso, (descanso) => descanso.slots, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'id_descanso' })
  descanso: Descanso | null;
}
