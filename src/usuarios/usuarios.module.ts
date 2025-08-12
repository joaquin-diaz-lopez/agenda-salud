// src/usuarios/usuarios.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosService } from './usuarios.service';
import { Usuario } from './entities/usuario.entity';
import { Rol } from '../roles/entities/rol.entity'; // Importa la entidad Rol
import { UsuariosController } from './usuarios.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario, Rol]), // Asegúrate de listar Usuario y Rol
  ],
  providers: [UsuariosService],
  controllers: [UsuariosController],
  exports: [UsuariosService], // ¡Importante para que AuthService pueda usarlo!
})
export class UsuariosModule {}
