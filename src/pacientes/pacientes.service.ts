// src/pacientes/pacientes.service.ts
import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Paciente } from './entities/paciente.entity';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto'; // Importa el DTO de actualización
import { UsuariosService } from '../usuarios/usuarios.service'; // Necesario para buscar usuario
import { Usuario } from '../usuarios/entities/usuario.entity'; // Importa la entidad Usuario para tipado

/**
 * Servicio para la gestión de Pacientes.
 * Provee métodos para interactuar con la entidad Paciente en la base de datos,
 * incluyendo la creación, búsqueda y actualización de datos.
 */
@Injectable()
export class PacientesService {
  constructor(
    @InjectRepository(Paciente)
    private pacientesRepository: Repository<Paciente>,
    private usuariosService: UsuariosService, // Inyecta UsuariosService
  ) {}

  /**
   * Crea un nuevo paciente en la base de datos.
   * Valida la existencia del usuario asociado si se provee, y asegura que el email no esté en uso.
   * @param createPacienteDto El DTO con los datos para crear el paciente.
   * @returns El objeto Paciente recién creado y guardado.
   * @throws ConflictException Si el email ya está en uso o el usuario ya está asociado a un paciente.
   * @throws NotFoundException Si el usuario asociado no se encuentra.
   */
  async create(createPacienteDto: CreatePacienteDto): Promise<Paciente> {
    // 1. Verificar si el email ya está en uso por otro paciente, solo si se proporciona
    if (createPacienteDto.email) {
      const emailExistente = await this.pacientesRepository.findOne({
        where: { email: createPacienteDto.email },
      });
      if (emailExistente) {
        throw new ConflictException(
          `El email '${createPacienteDto.email}' ya está en uso por otro paciente.`,
        );
      }
    }

    let usuarioAsociado: Usuario | null = null;
    // 2. Si se proporciona un idUsuario, verificar si existe y no está ya asociado a un paciente.
    if (createPacienteDto.idUsuario) {
      usuarioAsociado = await this.usuariosService.buscarPorId(
        createPacienteDto.idUsuario,
      );
      if (!usuarioAsociado) {
        throw new NotFoundException(
          `Usuario con ID '${createPacienteDto.idUsuario}' no encontrado.`,
        );
      }
      if (usuarioAsociado.paciente) {
        throw new ConflictException(
          `El usuario con ID '${createPacienteDto.idUsuario}' ya está asociado a otro paciente.`,
        );
      }
    }

    // 3. Crear la nueva instancia de la entidad Paciente
    const nuevoPaciente = this.pacientesRepository.create({
      ...createPacienteDto,
      usuario: usuarioAsociado, // Asigna el objeto usuario o null
      idUsuario: usuarioAsociado ? usuarioAsociado.id : null, // Asigna el ID o null
    });

    // 4. Guardar el nuevo paciente en la base de datos
    return this.pacientesRepository.save(nuevoPaciente);
  }

  /**
   * Busca todos los pacientes existentes en la base de datos.
   * Carga la relación 'usuario' si existe.
   * @returns Una promesa que resuelve a un array de objetos Paciente.
   */
  async findAll(): Promise<Paciente[]> {
    return this.pacientesRepository.find({ relations: ['usuario'] });
  }

  /**
   * Busca un paciente por su ID único.
   * Carga la relación 'usuario' si existe.
   * @param id El ID (UUID) del paciente a buscar.
   * @returns Una promesa que resuelve al objeto Paciente si se encuentra, o null si no.
   */
  async findOne(id: string): Promise<Paciente | null> {
    return this.pacientesRepository.findOne({
      where: { id },
      relations: ['usuario'],
    });
  }

  /**
   * Actualiza parcialmente un paciente existente utilizando el método save().
   * Realiza validaciones para asegurar la existencia del paciente y evitar conflictos de email.
   * @param id El ID del paciente a actualizar.
   * @param updatePacienteDto El DTO con los datos parciales para actualizar.
   * @returns El objeto Paciente actualizado.
   * @throws NotFoundException Si el paciente no se encuentra.
   * @throws ConflictException Si el email (si se actualiza) ya está en uso por otro paciente.
   */
  async actualiza(
    id: string,
    updatePacienteDto: UpdatePacienteDto,
  ): Promise<Paciente> {
    // 1. Verificar si el paciente existe y recuperarlo
    const pacienteToUpdate = await this.pacientesRepository.findOne({
      where: { id },
      relations: ['usuario'], // Carga la relación 'usuario' si es necesario para el retorno completo o validaciones
    });

    if (!pacienteToUpdate) {
      throw new NotFoundException(
        `Paciente con ID '${id}' no encontrado para actualizar.`,
      );
    }

    // 2. Si se intenta actualizar el email, verificar que no esté ya en uso por otro paciente
    // Solo verificar si el email está presente en el DTO de actualización, es diferente al actual, Y no es null
    if (
      updatePacienteDto.email &&
      updatePacienteDto.email !== pacienteToUpdate.email
    ) {
      const emailEnUso = await this.pacientesRepository.findOne({
        where: { email: updatePacienteDto.email },
      });
      // Si se encuentra un paciente con ese email Y su ID es diferente al que estamos actualizando
      if (emailEnUso && emailEnUso.id !== id) {
        throw new ConflictException(
          `El email '${updatePacienteDto.email}' ya está en uso por otro paciente.`,
        );
      }
    }

    // --- Lógica para actualizar idUsuario y la relación 'usuario' ---
    if (
      updatePacienteDto.idUsuario !== undefined &&
      updatePacienteDto.idUsuario !== pacienteToUpdate.idUsuario
    ) {
      // Si el idUsuario se establece a null, desasocia el usuario existente
      if (updatePacienteDto.idUsuario === null) {
        if (pacienteToUpdate.usuario) {
          pacienteToUpdate.usuario.paciente = null; // Desasociar del usuario anterior
          await this.usuariosService.saveUsuario(pacienteToUpdate.usuario); // Guardar el usuario actualizado
        }
        pacienteToUpdate.idUsuario = null;
        pacienteToUpdate.usuario = null;
      } else {
        // Si se proporciona un nuevo idUsuario
        const nuevoUsuario: Usuario | null =
          await this.usuariosService.buscarPorId(updatePacienteDto.idUsuario);
        if (!nuevoUsuario) {
          throw new NotFoundException(
            `Nuevo Usuario con ID '${updatePacienteDto.idUsuario}' no encontrado.`,
          );
        }
        // Verificar si el nuevo usuario ya está asociado a otro paciente (que no sea el actual que estamos modificando)
        if (nuevoUsuario.paciente && nuevoUsuario.paciente.id !== id) {
          throw new ConflictException(
            `El Usuario con ID '${updatePacienteDto.idUsuario}' ya está asociado a otro paciente.`,
          );
        }

        // Si el paciente ya tenía un usuario asociado, desasócialo primero del usuario antiguo
        if (
          pacienteToUpdate.usuario &&
          pacienteToUpdate.usuario.id !== nuevoUsuario.id
        ) {
          pacienteToUpdate.usuario.paciente = null;
          await this.usuariosService.saveUsuario(pacienteToUpdate.usuario);
        }

        // Asociar el nuevo usuario al paciente
        pacienteToUpdate.idUsuario = nuevoUsuario.id;
        pacienteToUpdate.usuario = nuevoUsuario;
        nuevoUsuario.paciente = pacienteToUpdate; // Asegurarse de la bidireccionalidad
        await this.usuariosService.saveUsuario(nuevoUsuario); // Guardar el nuevo usuario con la relación actualizada
      }
    }
    // --- Fin lógica para idUsuario y relación 'usuario' ---

    // 3. Aplicar las actualizaciones parciales a las propiedades primitivas de la entidad cargada.
    // Usamos Object.assign, excluyendo `idUsuario` ya que lo manejamos explícitamente arriba.
    const { idUsuario: _, ...restOfUpdateDto } = updatePacienteDto; // Desestructura para excluir idUsuario
    Object.assign(pacienteToUpdate, restOfUpdateDto);

    // 4. Guardar la entidad actualizada en la base de datos.
    return this.pacientesRepository.save(pacienteToUpdate);
  }

  // Puedes añadir otros métodos como `remove` si los necesitas más adelante.
}
