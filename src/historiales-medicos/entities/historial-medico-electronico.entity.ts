// src/historiales-medicos/entities/historial-medico-electronico.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Paciente } from '../../pacientes/entities/paciente.entity';

@Entity('historiales_medicos_electronicos')
export class HistorialMedicoElectronico {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'id_paciente', type: 'uuid', unique: true, nullable: false })
  idPaciente: string;

  @OneToOne(() => Paciente, (paciente) => paciente.historialMedicoElectronico, {
    nullable: false,
    onDelete: 'CASCADE', // Si se borra el paciente, se borra su historial
  })
  @JoinColumn({ name: 'id_paciente' })
  paciente: Paciente;

  @Column({ type: 'jsonb', nullable: true }) // Para almacenar datos JSON flexibles
  contenido: object; // Ej. { "diagnosticos": [], "tratamientos": [], "alergias": [] }

  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'fecha_ultima_actualizacion',
  })
  fechaUltimaActualizacion: Date;
}
