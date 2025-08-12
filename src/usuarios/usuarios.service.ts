// src/usuarios/usuarios.service.ts
import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto'; // Necesitarás crear este DTO
import * as bcrypt from 'bcrypt';
import { Rol } from '../roles/entities/rol.entity'; // Importa la entidad Rol

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private usuariosRepository: Repository<Usuario>,
    @InjectRepository(Rol) // Inyecta el repositorio de Rol para buscar roles
    private rolesRepository: Repository<Rol>,
  ) {}

  /**
   * Busca un usuario por su nombre de usuario.
   * Utilizado principalmente para la validación de credenciales durante el inicio de sesión.
   * @param nombreUsuario El nombre de usuario a buscar.
   * @returns El objeto Usuario si se encuentra, incluyendo su relación con el rol, o undefined.
   */
  async buscarPorNombreUsuario(nombreUsuario: string): Promise<Usuario | null> {
    const usuario = await this.usuariosRepository.findOne({
      where: { nombreUsuario },
      relations: ['rol'],
    });
    return usuario;
  }

  /**
   * Busca un usuario por su ID.
   * Utilizado para obtener detalles completos del usuario, incluyendo su rol.
   * @param id El ID del usuario a buscar.
   * @returns El objeto Usuario si se encuentra, incluyendo su relación con el rol, o null.
   */
  async buscarPorId(id: string): Promise<Usuario | null> {
    return this.usuariosRepository.findOne({
      where: { id },
      relations: ['rol'], // Asegura que la relación 'rol' se cargue
    });
  }

  /**
   * Crea un nuevo usuario en la base de datos.
   * Hashea la contraseña antes de guardarla y asocia el rol.
   * @param createUsuarioDto Datos para la creación del usuario.
   * @returns El usuario recién creado.
   * @throws ConflictException si el nombre de usuario ya existe.
   * @throws NotFoundException si el rol especificado no existe.
   */
  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    // 1. Verificar si el nombre de usuario ya existe
    const usuarioExistente = await this.usuariosRepository.findOne({
      where: { nombreUsuario: createUsuarioDto.nombreUsuario },
    });
    if (usuarioExistente) {
      throw new ConflictException('El nombre de usuario ya está en uso.');
    }

    // 2. Buscar el rol por su ID
    const rol = await this.rolesRepository.findOne({
      where: { id: createUsuarioDto.idRol },
    });
    if (!rol) {
      throw new NotFoundException(
        `El Rol con ID ${createUsuarioDto.idRol} no fue encontrado.`,
      );
    }

    // 3. Hashear la contraseña
    const contrasenaHasheada = await bcrypt.hash(
      createUsuarioDto.contrasena,
      10,
    );

    // 4. Crear la instancia del usuario
    const nuevoUsuario = this.usuariosRepository.create({
      nombreUsuario: createUsuarioDto.nombreUsuario,
      contrasena: contrasenaHasheada,
      rol: rol, // Asigna el objeto Rol completo
      idRol: rol.id, // También asigna el ID del rol
    });

    // 5. Guardar el usuario en la base de datos
    return this.usuariosRepository.save(nuevoUsuario);
  }

  // Puedes añadir otros métodos CRUD aquí (findAll, findOne, update, remove)
}
