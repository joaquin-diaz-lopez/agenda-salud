// src/agendas/entities/descanso.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { JornadaDiaria } from '../../jornadas-diarias/entities/jornada-diaria.entity';
import { SlotDisponibilidad } from '../../slots-disponibilidad/entities/slot-disponibilidad.entity';

@Entity('descansos')
export class Descanso {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'id_jornada_diaria', type: 'uuid', nullable: false })
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
  horaInicio: Date;

  @Column({
    type: 'timestamp with time zone',
    nullable: false,
    name: 'hora_fin',
  })
  horaFin: Date;

  @Column({ type: 'varchar', length: 100, nullable: false })
  razon: string; // Ej. "Almuerzo", "Reunión", "Vacaciones", "Día Libre Personal"

  @OneToMany(() => SlotDisponibilidad, (slot) => slot.descanso)
  slots: SlotDisponibilidad[]; // Los slots que este descanso "ocupa"
}
