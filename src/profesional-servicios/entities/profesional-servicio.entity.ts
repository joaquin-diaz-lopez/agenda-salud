// src/profesional-servicios/entities/profesional-servicio.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Unique,
  Column,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger'; // <-- Importación necesaria
import { Profesional } from '../../profesionales/entities/profesional.entity';
import { Servicio } from '../../servicios/entities/servicio.entity';

@Entity('profesional_servicios', { schema: 'agenda_salud_dev' })
@Unique(['idProfesional', 'idServicio'])
export class ProfesionalServicio {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    description: 'ID de la asociación.',
  })
  id: string;

  @Column({ name: 'id_profesional', type: 'uuid', nullable: false })
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'UUID del profesional asociado.',
  })
  idProfesional: string;

  @Column({ name: 'id_servicio', type: 'uuid', nullable: false })
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    description: 'UUID del servicio asociado.',
  })
  idServicio: string;

  @ManyToOne(
    () => Profesional,
    (profesional) => profesional.profesionalServicios,
    {
      nullable: false,
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'id_profesional' })
  profesional: Profesional;

  @ManyToOne(() => Servicio, (servicio) => servicio.profesionalServicios, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_servicio' })
  servicio: Servicio;
}
