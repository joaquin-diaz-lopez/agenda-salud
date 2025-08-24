// src/citas/citas.service.ts
import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cita } from './entities/cita.entity'; // Importa la entidad Cita
import { CreateCitaDto } from './dto/create-cita.dto'; // Importa el DTO de creación de Cita
import { UpdateCitaDto } from './dto/update-cita.dto'; // Importa el DTO de actualización de Cita

import { PacientesService } from '../pacientes/pacientes.service'; // Servicio para validar Paciente
import { ProfesionalesService } from '../profesionales/profesionales.service'; // Servicio para validar Profesional
import { ServiciosService } from '../servicios/servicios.service'; // Servicio para validar Servicio

import { SlotDisponibilidadService } from '../agendas/slot-disponibilidad.service'; // Servicio para validar y gestionar SlotDisponibilidad

/**
 * Servicio para la gestión de Citas.
 * Provee métodos para interactuar con la entidad Cita en la base de datos,
 * incluyendo la creación, búsqueda y actualización de citas,
 * realizando validaciones contra entidades relacionadas.
 */
@Injectable()
export class CitasService {
  constructor(
    @InjectRepository(Cita) // Inyecta el repositorio de TypeORM para la entidad Cita
    private citasRepository: Repository<Cita>,
    private pacientesService: PacientesService, // Inyecta PacientesService
    private profesionalesService: ProfesionalesService, // Inyecta ProfesionalesService
    private serviciosService: ServiciosService, // Inyecta ServiciosService
    private slotDisponibilidadService: SlotDisponibilidadService, // Inyecta SlotDisponibilidadService
  ) {}

  /**
   * Crea una nueva cita en la base de datos.
   * Realiza validaciones extensas para asegurar la existencia de todas las entidades relacionadas
   * y la disponibilidad del slot.
   * El estado inicial de la cita se establece automáticamente a 'Programada' por el valor por defecto en la entidad.
   * @param createCitaDto El DTO con los datos para crear la cita.
   * @returns El objeto Cita recién creado y guardado.
   * @throws NotFoundException Si alguna entidad relacionada (paciente, profesional, servicio, slot) no existe.
   * @throws ConflictException Si el slot de disponibilidad ya está reservado.
   * @throws BadRequestException Si el servicio no es ofrecido por el profesional.
   */
  async create(createCitaDto: CreateCitaDto): Promise<Cita> {
    const {
      idPaciente,
      idProfesional,
      idServicio,
      idSlotDisponibilidad,
      tipo,
      notas,
    } = createCitaDto;

    // 1. Validar existencia del Paciente
    const paciente = await this.pacientesService.findOne(idPaciente);
    if (!paciente) {
      throw new NotFoundException(
        `Paciente con ID '${idPaciente}' no encontrado.`,
      );
    }

    // 2. Validar existencia del Profesional
    const profesional = await this.profesionalesService.findOne(idProfesional);
    if (!profesional) {
      throw new NotFoundException(
        `Profesional con ID '${idProfesional}' no encontrado.`,
      );
    }

    // 3. Validar existencia del Servicio
    const servicio = await this.serviciosService.findOne(idServicio);
    if (!servicio) {
      throw new NotFoundException(
        `Servicio con ID '${idServicio}' no encontrado.`,
      );
    }

    // 4. Validar si el Profesional ofrece este Servicio (usando la tabla intermedia ProfesionalServicio)
    const profesionalOfreceServicio =
      await this.profesionalesService.profesionalOfreceServicio(
        idProfesional,
        idServicio,
      );
    if (!profesionalOfreceServicio) {
      throw new BadRequestException(
        `El Profesional con ID '${idProfesional}' no ofrece el Servicio con ID '${idServicio}'.`,
      );
    }

    // 5. Validar existencia y disponibilidad del SlotDisponibilidad
    const slotDisponibilidad =
      await this.slotDisponibilidadService.findOne(idSlotDisponibilidad);
    if (!slotDisponibilidad) {
      throw new NotFoundException(
        `Slot de Disponibilidad con ID '${idSlotDisponibilidad}' no encontrado.`,
      );
    }
    if (slotDisponibilidad.cita) {
      // Si el slot ya tiene una cita asociada
      throw new ConflictException(
        `El Slot de Disponibilidad con ID '${idSlotDisponibilidad}' ya está reservado.`,
      );
    }

    // 6. Crear la nueva instancia de la entidad Cita
    const nuevaCita = this.citasRepository.create({
      paciente,
      idPaciente: paciente.id,
      profesional,
      idProfesional: profesional.id,
      servicio,
      idServicio: servicio.id,
      slotDisponibilidad,
      idSlotDisponibilidad: slotDisponibilidad.id,
      horaInicio: slotDisponibilidad.horaInicio, // Derivar de SlotDisponibilidad
      horaFin: slotDisponibilidad.horaFin, // Derivar de SlotDisponibilidad
      tipo,
      notas,
      // El campo 'estado' se establecerá automáticamente a 'Programada' por el valor por defecto en la entidad Cita.
    });

    // 7. Guardar la nueva cita en la base de datos
    const citaGuardada = await this.citasRepository.save(nuevaCita);

    // 8. Actualizar el SlotDisponibilidad para marcarlo como reservado
    slotDisponibilidad.cita = citaGuardada; // Asociar la cita al slot
    await this.slotDisponibilidadService.save(slotDisponibilidad); // Guardar el slot actualizado

    return citaGuardada;
  }

  /**
   * Busca todas las citas existentes en la base de datos.
   * Carga las relaciones paciente, profesional, servicio, slotDisponibilidad.
   * @returns Una promesa que resuelve a un array de objetos Cita.
   */
  async findAll(): Promise<Cita[]> {
    return this.citasRepository.find({
      relations: ['paciente', 'profesional', 'servicio', 'slotDisponibilidad'],
    });
  }

  /**
   * Busca una cita por su ID único.
   * Carga las relaciones paciente, profesional, servicio, slotDisponibilidad.
   * @param id El ID (UUID) de la cita a buscar.
   * @returns Una promesa que resuelve al objeto Cita si se encuentra, o null si no.
   */
  async findOne(id: string): Promise<Cita | null> {
    return this.citasRepository.findOne({
      where: { id },
      relations: ['paciente', 'profesional', 'servicio', 'slotDisponibilidad'],
    });
  }

  /**
   * Actualiza parcialmente una cita existente utilizando el método save().
   * Realiza validaciones para asegurar la existencia de la cita y otras entidades relacionadas
   * si se intentan actualizar sus IDs.
   * @param id El ID de la cita a actualizar.
   * @param updateCitaDto El DTO con los datos parciales para actualizar.
   * @returns El objeto Cita actualizado.
   * @throws NotFoundException Si la cita o alguna entidad relacionada no se encuentra.
   * @throws ConflictException Si se intenta reservar un slot ya ocupado.
   * @throws BadRequestException Si el servicio no es ofrecido por el profesional (si se cambia).
   */
  async actualiza(id: string, updateCitaDto: UpdateCitaDto): Promise<Cita> {
    // 1. Verificar si la cita existe y recuperarla
    const citaToUpdate = await this.citasRepository.findOne({
      where: { id },
      relations: ['paciente', 'profesional', 'servicio', 'slotDisponibilidad'],
    });

    if (!citaToUpdate) {
      throw new NotFoundException(
        `Cita con ID '${id}' no encontrada para actualizar.`,
      );
    }

    // 2. Manejo de actualización de relaciones y claves foráneas
    // Para idPaciente
    if (
      updateCitaDto.idPaciente &&
      updateCitaDto.idPaciente !== citaToUpdate.idPaciente
    ) {
      const nuevoPaciente = await this.pacientesService.findOne(
        updateCitaDto.idPaciente,
      );
      if (!nuevoPaciente)
        throw new NotFoundException(
          `Nuevo Paciente con ID '${updateCitaDto.idPaciente}' no encontrado.`,
        );
      citaToUpdate.paciente = nuevoPaciente;
      citaToUpdate.idPaciente = nuevoPaciente.id;
    }

    // Para idProfesional
    if (
      updateCitaDto.idProfesional &&
      updateCitaDto.idProfesional !== citaToUpdate.idProfesional
    ) {
      const nuevoProfesional = await this.profesionalesService.findOne(
        updateCitaDto.idProfesional,
      );
      if (!nuevoProfesional)
        throw new NotFoundException(
          `Nuevo Profesional con ID '${updateCitaDto.idProfesional}' no encontrado.`,
        );
      citaToUpdate.profesional = nuevoProfesional;
      citaToUpdate.idProfesional = nuevoProfesional.id;
    }

    // Para idServicio
    if (
      updateCitaDto.idServicio &&
      updateCitaDto.idServicio !== citaToUpdate.idServicio
    ) {
      const nuevoServicio = await this.serviciosService.findOne(
        updateCitaDto.idServicio,
      );
      if (!nuevoServicio)
        throw new NotFoundException(
          `Nuevo Servicio con ID '${updateCitaDto.idServicio}' no encontrado.`,
        );

      if (!citaToUpdate.profesional) {
        throw new BadRequestException(
          'Profesional no asociado para validar el servicio (estado inesperado).',
        );
      }
      const profesionalOfreceNuevoServicio =
        await this.profesionalesService.profesionalOfreceServicio(
          citaToUpdate.profesional.id,
          nuevoServicio.id,
        );
      if (!profesionalOfreceNuevoServicio) {
        throw new BadRequestException(
          `El Profesional con ID '${citaToUpdate.profesional.id}' no ofrece el nuevo Servicio con ID '${nuevoServicio.id}'.`,
        );
      }
      citaToUpdate.servicio = nuevoServicio;
      citaToUpdate.idServicio = nuevoServicio.id;
    }

    // Para idSlotDisponibilidad
    if (
      updateCitaDto.idSlotDisponibilidad &&
      updateCitaDto.idSlotDisponibilidad !== citaToUpdate.idSlotDisponibilidad
    ) {
      const nuevoSlot = await this.slotDisponibilidadService.findOne(
        updateCitaDto.idSlotDisponibilidad,
      );
      if (!nuevoSlot)
        throw new NotFoundException(
          `Nuevo Slot de Disponibilidad con ID '${updateCitaDto.idSlotDisponibilidad}' no encontrado.`,
        );
      if (nuevoSlot.cita && nuevoSlot.cita.id !== id) {
        throw new ConflictException(
          `El Slot de Disponibilidad con ID '${updateCitaDto.idSlotDisponibilidad}' ya está reservado por otra cita.`,
        );
      }
      // Liberar el slot antiguo si se cambia de slot
      if (
        citaToUpdate.slotDisponibilidad &&
        citaToUpdate.slotDisponibilidad.id !== nuevoSlot.id
      ) {
        citaToUpdate.slotDisponibilidad.cita = null;
        await this.slotDisponibilidadService.save(
          citaToUpdate.slotDisponibilidad,
        );
      }
      citaToUpdate.slotDisponibilidad = nuevoSlot;
      citaToUpdate.idSlotDisponibilidad = nuevoSlot.id;
      citaToUpdate.horaInicio = nuevoSlot.horaInicio;
      citaToUpdate.horaFin = nuevoSlot.horaFin;
      // Marcar el nuevo slot como reservado
      nuevoSlot.cita = citaToUpdate;
      await this.slotDisponibilidadService.save(nuevoSlot);
    }

    // El campo 'estado' es una columna primitiva en la entidad, no se espera en el DTO para actualizaciones.
    // Si se quisiera actualizar el estado, se haría a través de un método específico o se añadiría al DTO.
    // updateCitaDto.estado no existe, por lo tanto, se omite cualquier referencia.

    // 3. Aplicar las actualizaciones parciales a las propiedades primitivas de la entidad
    // Excluímos los IDs de relaciones ya que los manejamos explícitamente arriba, y 'estado' porque no está en el DTO.
    const {
      idPaciente: _,
      idProfesional: __,
      idServicio: ___,
      idSlotDisponibilidad: ____,
      ...restOfUpdateDto
    } = updateCitaDto;
    Object.assign(citaToUpdate, restOfUpdateDto);

    // 4. Guardar la entidad actualizada en la base de datos.
    return this.citasRepository.save(citaToUpdate);
  }

  // Puedes añadir otros métodos como `remove` si los necesitas más adelante.
}
