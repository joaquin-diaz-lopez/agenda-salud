// src/agendas/entities/agenda-profesional.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Profesional } from '../../profesionales/entities/profesional.entity';
import { JornadaDiaria } from '../jornadas-diarias/entities/jornada-diaria.entity';

@Entity('agendas_profesionales')
export class AgendaProfesional {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'id_profesional',
    type: 'uuid',
    unique: true,
    nullable: false,
  })
  idProfesional: string;

  @OneToOne(() => Profesional, (profesional) => profesional.agenda, {
    nullable: false,
    onDelete: 'CASCADE', // Si se borra el profesional, se borra su agenda
  })
  @JoinColumn({ name: 'id_profesional' })
  profesional: Profesional;

  @Column({ type: 'varchar', length: 100, nullable: true })
  nombre: string; // Ej. "Horario Regular Clínica X", "Guardias de Noche"

  @OneToMany(() => JornadaDiaria, (jornada) => jornada.agendaProfesional)
  jornadasDiarias: JornadaDiaria[];
}
