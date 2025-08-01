// src/pacientes/entities/paciente.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Cita } from '../../citas/entities/cita.entity'; // Se definirá
import { HistorialMedicoElectronico } from '../../historiales-medicos/entities/historial-medico-electronico.entity'; // Se definirá

@Entity('pacientes')
export class Paciente {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'id_usuario', type: 'uuid', unique: true, nullable: true }) // Puede o no tener usuario
  idUsuario: string;

  @OneToOne(() => Usuario, (usuario) => usuario.paciente, {
    nullable: true,
    onDelete: 'SET NULL', // Si se borra el usuario, el paciente puede existir sin cuenta
  })
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  @Column({ nullable: false, length: 100, name: 'nombre' })
  nombre: string;

  @Column({ nullable: false, length: 100, name: 'apellido' })
  apellido: string;

  @Column({ type: 'date', nullable: true, name: 'fecha_nacimiento' })
  fechaNacimiento: Date;

  @Column({ nullable: true, length: 20 })
  telefono: string;

  @Column({ unique: true, nullable: true, length: 150 })
  email: string;

  @Column({ nullable: true, length: 255 })
  direccion: string;

  @OneToMany(() => Cita, (cita) => cita.paciente)
  citas: Cita[];

  @OneToOne(() => HistorialMedicoElectronico, (hce) => hce.paciente)
  historialMedicoElectronico: HistorialMedicoElectronico;
}
