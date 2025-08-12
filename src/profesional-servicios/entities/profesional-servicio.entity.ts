// src/profesional-servicios/entities/profesional-servicio.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Unique,
  Column,
} from 'typeorm';
import { Profesional } from '../../profesionales/entities/profesional.entity';
import { Servicio } from '../../servicios/entities/servicio.entity';

@Entity('profesional_servicios', { schema: 'agenda_salud_dev' })
@Unique(['idProfesional', 'idServicio']) // Asegura que una combinación de profesional y servicio sea única
export class ProfesionalServicio {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Columnas para los IDs de claves foráneas. Se definen explícitamente para claridad
  // y para su uso en DTOs o en la restricción @Unique.
  @Column({ name: 'id_profesional', type: 'uuid', nullable: false })
  idProfesional: string;

  @Column({ name: 'id_servicio', type: 'uuid', nullable: false })
  idServicio: string;

  // Relación Muchos a Uno con Profesional
  // Un registro de ProfesionalServicio pertenece a UN Profesional.
  // Un Profesional puede tener MUCHOS ProfesionalServicio.
  @ManyToOne(
    () => Profesional,
    (profesional) => profesional.profesionalServicios,
    {
      nullable: false, // Este registro SIEMPRE debe estar asociado a un profesional
      onDelete: 'CASCADE', // Si se elimina el profesional, se eliminan sus asociaciones a servicios
    },
  )
  @JoinColumn({ name: 'id_profesional' }) // Indica que 'id_profesional' es la clave foránea
  profesional: Profesional;

  // Relación Muchos a Uno con Servicio
  // Un registro de ProfesionalServicio pertenece a UN Servicio.
  // Un Servicio puede tener MUCHOS ProfesionalServicio.
  @ManyToOne(() => Servicio, (servicio) => servicio.profesionalServicios, {
    nullable: false, // Este registro SIEMPRE debe estar asociado a un servicio
    onDelete: 'CASCADE', // Si se elimina el servicio, se eliminan sus asociaciones a profesionales
  })
  @JoinColumn({ name: 'id_servicio' }) // Indica que 'id_servicio' es la clave foránea
  servicio: Servicio;
}
