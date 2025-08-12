// src/servicios/entities/servicio.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ProfesionalServicio } from '../../profesional-servicios/entities/profesional-servicio.entity';
import { Cita } from '../../citas/entities/cita.entity';

@Entity('servicios', { schema: 'agenda_salud_dev' }) // Asegura que el esquema coincida
export class Servicio {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'nombre',
    type: 'varchar',
    length: 100,
    unique: true,
    nullable: false,
  })
  nombre: string;

  @Column({ name: 'descripcion', type: 'varchar', length: 255, nullable: true })
  descripcion: string;

  @Column({ name: 'duracion_minutos', type: 'int', nullable: true })
  duracionMinutos: number;

  @Column({
    name: 'precio',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  precio: number;

  // Relación Uno a Muchos con ProfesionalServicio
  // Un Servicio puede ser ofrecido por MUCHOS Profesionales.
  // Esta es la parte inversa de la relación ManyToOne en ProfesionalServicio.
  @OneToMany(
    () => ProfesionalServicio,
    (profesionalServicio) => profesionalServicio.servicio,
  )
  profesionalServicios: ProfesionalServicio[];

  // Relación Uno a Muchos con Cita
  // Un Servicio puede ser parte de MUCHAS Citas.
  // Esta es la parte inversa de la relación ManyToOne en Cita.
  @OneToMany(() => Cita, (cita) => cita.servicio)
  citas: Cita[];
}
