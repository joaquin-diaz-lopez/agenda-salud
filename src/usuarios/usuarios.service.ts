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
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

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

  /**
   * Guarda una instancia de Usuario.
   * Útil para actualizar la entidad Usuario después de modificar sus relaciones (ej. paciente o profesional).
   * @param usuario La entidad Usuario a guardar.
   * @returns La entidad Usuario guardada.
   */
  async saveUsuario(usuario: Usuario): Promise<Usuario> {
    return this.usuariosRepository.save(usuario);
  }

  /**
   * 🚨 NUEVO MÉTODO: Obtiene todos los usuarios.
   * Excluye la contraseña por defecto (gracias a select: false en la Entidad).
   * @returns Una lista de todos los objetos Usuario, incluyendo su rol.
   */
  async findAll(): Promise<Usuario[]> {
    return this.usuariosRepository.find({
      relations: ['rol'],
    });
  }

  // 🚨 MÉTODO PARA AUTH: Permite obtener la contraseña hasheada
  // Usará el Query Builder para añadir select('usuario.contrasena')
  async findByUsernameForAuth(nombreUsuario: string): Promise<Usuario | null> {
    return this.usuariosRepository
      .createQueryBuilder('usuario')
      .addSelect('usuario.contrasena')
      .where('usuario.nombreUsuario = :nombreUsuario', { nombreUsuario })
      .getOne();
  }
  /**
   * 🚨 NUEVO MÉTODO: Actualiza parcialmente un usuario.
   * Maneja el hasheo de la contraseña si se proporciona.
   * @param id ID del usuario a actualizar.
   * @param updateUsuarioDto Datos a actualizar.
   * @returns El usuario actualizado.
   * @throws NotFoundException si el usuario o rol no existen.
   */
  async update(
    id: string,
    updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<Usuario> {
    const usuario = await this.buscarPorId(id); // Reusa el método para encontrar el usuario

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID "${id}" no encontrado.`);
    }

    // 1. Manejo y Hasheo de Contraseña
    if (updateUsuarioDto.contrasena) {
      updateUsuarioDto.contrasena = await bcrypt.hash(
        updateUsuarioDto.contrasena,
        10,
      );
    }

    // 2. Manejo de Rol (si se proporciona un nuevo idRol)
    let rol: Rol | null | undefined = undefined;
    if (updateUsuarioDto.idRol) {
      rol = await this.rolesRepository.findOne({
        where: { id: updateUsuarioDto.idRol },
      });
      if (rol === null) {
        throw new NotFoundException(
          `El Rol con ID ${updateUsuarioDto.idRol} no fue encontrado.`,
        );
      }
    }

    // 3. Aplicar las actualizaciones a la entidad existente
    // Usa Object.assign o merge para aplicar solo los campos provistos.
    const usuarioActualizado = this.usuariosRepository.merge(usuario, {
      ...updateUsuarioDto,
      rol: rol, // Sobrescribe la relación 'rol' si se encontró un nuevo rol
      idRol: updateUsuarioDto.idRol,
    });

    // 4. Guardar y retornar el usuario
    return this.usuariosRepository.save(usuarioActualizado);
  }

  /**
   * 🚨 NUEVO MÉTODO: Elimina un usuario por su ID.
   * @param id ID del usuario a eliminar.
   * @returns El usuario eliminado (opcionalmente) o un resultado de TypeORM.
   * @throws NotFoundException si el usuario no existe.
   */
  async remove(id: string): Promise<void> {
    const result = await this.usuariosRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Usuario con ID "${id}" no encontrado.`);
    }
    // No devolvemos la entidad para indicar que la acción fue exitosa (204 No Content).
  }
}
