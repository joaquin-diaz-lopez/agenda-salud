// src/centros-de-salud/entities/centro-de-salud.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Profesional } from '../../profesionales/entities/profesional.entity';

@Entity('centros_de_salud')
export class CentroDeSalud {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: false, length: 150 })
  nombre: string;

  @Column({ nullable: true, length: 255 })
  direccion: string;

  @Column({ nullable: true, length: 20 })
  telefono: string;

  @Column({ unique: true, nullable: true, length: 150 })
  email: string;

  @OneToMany(() => Profesional, (profesional) => profesional.centroDeSalud)
  profesionales: Profesional[];
}
