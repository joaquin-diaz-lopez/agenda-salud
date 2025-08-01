// src/usuarios/entities/usuario.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Rol } from '../../roles/entities/rol.entity';
import { Profesional } from '../../profesionales/entities/profesional.entity';
import { Paciente } from '../../pacientes/entities/paciente.entity';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
    nullable: false,
    length: 100,
    name: 'nombre_usuario',
  })
  nombreUsuario: string; // nombre_usuario

  @Column({ nullable: false })
  contrasena: string; // contrasena (hash)

  @Column({ name: 'id_rol', type: 'uuid', nullable: false })
  idRol: string;

  @ManyToOne(() => Rol, (rol) => rol.usuarios, {
    eager: true,
    nullable: false,
    onDelete: 'RESTRICT', // No se borra el rol si tiene usuarios asociados
  })
  @JoinColumn({ name: 'id_rol' })
  rol: Rol;

  @OneToOne(() => Profesional, (profesional) => profesional.usuario, {
    nullable: true,
  })
  profesional: Profesional;

  @OneToOne(() => Paciente, (paciente) => paciente.usuario, { nullable: true })
  paciente: Paciente;
}
