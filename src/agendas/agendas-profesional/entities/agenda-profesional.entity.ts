import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger'; // <-- ¡Importación necesaria!
import { Profesional } from '../../../profesionales/entities/profesional.entity';
import { JornadaDiaria } from '../../jornadas-diarias/entities/jornada-diaria.entity';

@Entity('agendas_profesionales')
export class AgendaProfesional {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    description: 'Identificador único (UUID) de la Agenda Profesional.',
  })
  id: string;

  @Column({
    name: 'id_profesional',
    type: 'uuid',
    unique: true,
    nullable: false,
  })
  @ApiProperty({
    example: 'f9e8d7c6-b5a4-3210-fedc-ba9876543210',
    description:
      'ID del profesional de la salud asociado a esta agenda. Único.',
  })
  idProfesional: string;

  @OneToOne(() => Profesional, (profesional) => profesional.agenda, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_profesional' })
  profesional: Profesional; // Relación ORM, no se expone en DTOs simples

  @Column({ type: 'varchar', length: 100, nullable: true })
  @ApiProperty({
    example: 'Horario Regular Clínica X',
    description: 'Nombre descriptivo de la agenda (opcional).',
    required: false,
    maxLength: 100,
  })
  nombre: string; // Ej. "Horario Regular Clínica X", "Guardias de Noche"

  @OneToMany(() => JornadaDiaria, (jornada) => jornada.agendaProfesional)
  jornadasDiarias: JornadaDiaria[]; // Relación ORM
}
