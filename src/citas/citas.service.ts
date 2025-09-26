// src/citas/citas.service.ts
import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cita } from './entities/cita.entity';
import { CreateCitaDto } from './dto/create-cita.dto';
import { UpdateCitaDto } from './dto/update-cita.dto';

import { PacientesService } from '../pacientes/pacientes.service';
import { ProfesionalesService } from '../profesionales/profesionales.service';
import { ServiciosService } from '../servicios/servicios.service';

import { SlotDisponibilidadService } from 'src/agendas/slots-disponibilidad/slot-disponibilidad.service';
import { SlotDisponibilidad } from '../agendas/slots-disponibilidad/entities/slot-disponibilidad.entity';

/**
 * Servicio para la gestión de Citas.
 * Provee métodos para interactuar con la entidad Cita en la base de datos,
 * incluyendo la creación, búsqueda y actualización de citas,
 * realizando validaciones contra entidades relacionadas.
 */
@Injectable()
export class CitasService {
  constructor(
    @InjectRepository(Cita)
    private citasRepository: Repository<Cita>,
    private pacientesService: PacientesService,
    private profesionalesService: ProfesionalesService,
    private serviciosService: ServiciosService,
    private slotDisponibilidadService: SlotDisponibilidadService,
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
    const slotDisponibilidad: SlotDisponibilidad | null =
      await this.slotDisponibilidadService.findOne(idSlotDisponibilidad);
    if (!slotDisponibilidad) {
      throw new NotFoundException(
        `Slot de Disponibilidad con ID '${idSlotDisponibilidad}' no encontrado.`,
      );
    }

    if (slotDisponibilidad.estaReservado) {
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
      horaInicio: slotDisponibilidad.horaInicio,
      horaFin: slotDisponibilidad.horaFin,
      tipo,
      notas,
      // idEstadoCita se establecerá por defecto si su entidad Cita tiene un default.
      // Si necesita un estado específico (ej. "Programada") y no hay default,
      // debería buscar el ID de ese estado y asignarlo aquí.
    });

    // 7. Guardar la nueva cita en la base de datos
    const citaGuardada = await this.citasRepository.save(nuevaCita);

    // 8. Actualizar el SlotDisponibilidad para marcarlo como reservado y asociar la cita
    slotDisponibilidad.cita = citaGuardada;
    slotDisponibilidad.estaReservado = true;
    await this.slotDisponibilidadService.save(slotDisponibilidad);

    // 9. --- ¡PASO DE CORRECCIÓN CLAVE: RECARGAR LA CITA PARA OBTENER EL ESTADO MÁS ACTUALIZADO! ---
    const citaFinal = await this.citasRepository.findOne({
      where: { id: citaGuardada.id },
      relations: [
        'paciente',
        'profesional',
        'servicio',
        'slotDisponibilidad',
        'slotDisponibilidad.cita',
      ],
      // Aseguramos cargar todas las relaciones, incluyendo la inversa en slotDisponibilidad.cita
    });

    if (!citaFinal) {
      // Esto no debería pasar si la cita se guardó
      throw new NotFoundException(
        `Cita con ID '${citaGuardada.id}' no encontrada después de la creación.`,
      );
    }
    return citaFinal;
    // --- FIN PASO DE CORRECCIÓN CLAVE ---
  }

  /**
   * Busca todas las citas existentes en la base de datos.
   * Carga las relaciones paciente, profesional, servicio, slotDisponibilidad.
   * @returns Una promesa que resuelve a un array de objetos Cita.
   */
  async findAll(): Promise<Cita[]> {
    return this.citasRepository.find({
      relations: [
        'paciente',
        'profesional',
        'servicio',
        'slotDisponibilidad',
        'slotDisponibilidad.cita',
      ], // Cargar la inversa
    });
  }

  /**
   * Busca una cita por su ID único.
   * Carga las relaciones paciente, profesional, servicio, slotDisponibilidad.
   * @param id El ID (UUID) de la cita a buscar.
   * @returns Una promesa que resuelve al objeto Cita si se encuentra, o null.
   */
  async findOne(id: string): Promise<Cita | null> {
    return this.citasRepository.findOne({
      where: { id },
      relations: [
        'paciente',
        'profesional',
        'servicio',
        'slotDisponibilidad',
        'slotDisponibilidad.cita',
      ], // Cargar la inversa
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
    const citaToUpdate = await this.citasRepository.findOne({
      where: { id },
      relations: [
        'paciente',
        'profesional',
        'servicio',
        'slotDisponibilidad',
        'slotDisponibilidad.cita',
      ],
    });

    if (!citaToUpdate) {
      throw new NotFoundException(
        `Cita con ID '${id}' no encontrada para actualizar.`,
      );
    }

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
      if (nuevoSlot.estaReservado && nuevoSlot.cita?.id !== id) {
        throw new ConflictException(
          `El Slot de Disponibilidad con ID '${updateCitaDto.idSlotDisponibilidad}' ya está reservado por otra cita.`,
        );
      }

      if (
        citaToUpdate.slotDisponibilidad &&
        citaToUpdate.slotDisponibilidad.id !== nuevoSlot.id
      ) {
        citaToUpdate.slotDisponibilidad.estaReservado = false;
        citaToUpdate.slotDisponibilidad.cita = null;
        await this.slotDisponibilidadService.save(
          citaToUpdate.slotDisponibilidad,
        );
      }

      citaToUpdate.slotDisponibilidad = nuevoSlot;
      citaToUpdate.idSlotDisponibilidad = nuevoSlot.id;
      citaToUpdate.horaInicio = nuevoSlot.horaInicio;
      citaToUpdate.horaFin = nuevoSlot.horaFin;
      nuevoSlot.estaReservado = true;
      nuevoSlot.cita = citaToUpdate;
      await this.slotDisponibilidadService.save(nuevoSlot);
    }

    const {
      idPaciente: _,
      idProfesional: __,
      idServicio: ___,
      idSlotDisponibilidad: ____,
      ...restOfUpdateDto
    } = updateCitaDto;
    Object.assign(citaToUpdate, restOfUpdateDto);

    const updatedCita = await this.citasRepository.save(citaToUpdate);

    // Recargar la cita final para asegurar todas las relaciones actualizadas en la respuesta
    const citaFinal = await this.citasRepository.findOne({
      where: { id: updatedCita.id },
      relations: [
        'paciente',
        'profesional',
        'servicio',
        'slotDisponibilidad',
        'slotDisponibilidad.cita',
      ],
    });

    if (!citaFinal) {
      throw new NotFoundException(
        `Cita con ID '${updatedCita.id}' no encontrada después de la actualización.`,
      );
    }
    return citaFinal;
  }
}
