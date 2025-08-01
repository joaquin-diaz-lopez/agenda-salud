// src/profesionales/entities/profesional.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { CentroDeSalud } from '../../centros-de-salud/entities/centro-de-salud.entity';
import { AgendaProfesional } from '../../agendas/entities/agenda-profesional.entity'; // Se definirá
import { Cita } from '../../citas/entities/cita.entity'; // Se definirá

@Entity('profesionales')
export class Profesional {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'id_usuario', type: 'uuid', unique: true, nullable: false })
  idUsuario: string;

  @OneToOne(() => Usuario, (usuario) => usuario.profesional, {
    nullable: false,
    onDelete: 'CASCADE', // Si se borra el usuario, se borra el profesional
  })
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  @Column({ nullable: false, length: 100, name: 'nombre' })
  nombre: string;

  @Column({ nullable: false, length: 100, name: 'apellido' })
  apellido: string;

  @Column({ unique: true, nullable: true, length: 150 })
  email: string;

  @Column({ nullable: true, length: 20 })
  telefono: string;

  @Column({ nullable: true, length: 100 })
  especialidad: string;

  @Column({ name: 'id_centro_salud', type: 'uuid', nullable: true })
  idCentroDeSalud: string;

  @ManyToOne(() => CentroDeSalud, (centro) => centro.profesionales, {
    nullable: true,
    onDelete: 'SET NULL', // Si se borra el centro, el profesional puede existir sin centro
  })
  @JoinColumn({ name: 'id_centro_salud' })
  centroDeSalud: CentroDeSalud;

  @OneToOne(() => AgendaProfesional, (agenda) => agenda.profesional)
  agenda: AgendaProfesional;

  @OneToMany(() => Cita, (cita) => cita.profesional)
  citas: Cita[];
}
