// src/agendas/slot-disponibilidad.service.ts
import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SlotDisponibilidad } from './entities/slot-disponibilidad.entity';
import { CreateSlotDisponibilidadDto } from './dto/create-slot-disponibilidad.dto';
import { UpdateSlotDisponibilidadDto } from './dto/update-slot-disponibilidad.dto';
import { JornadaDiariaService } from './jornada-diaria.service'; // Necesario para validar Jornada Diaria
import { DescansoService } from './descanso.service'; // Necesario para verificar descansos
import { JornadaDiaria } from './entities/jornada-diaria.entity';
import { Descanso } from './entities/descanso.entity';

/**
 * Servicio para la gestión de Slots de Disponibilidad.
 * Encargado de generar, consultar y actualizar los slots de tiempo disponibles
 * de un profesional, tomando en cuenta sus jornadas y descansos.
 */
@Injectable()
export class SlotDisponibilidadService {
  constructor(
    @InjectRepository(SlotDisponibilidad)
    private slotDisponibilidadRepository: Repository<SlotDisponibilidad>,
    private jornadaDiariaService: JornadaDiariaService, // Inyecta JornadaDiariaService
    private descansoService: DescansoService, // Inyecta DescansoService
  ) {}

  /**
   * Genera slots de disponibilidad para una jornada diaria específica.
   * Este método es central para poblar la agenda de un profesional.
   * @param idJornadaDiaria El ID de la jornada diaria.
   * @param duracionSlotMinutos Duración de cada slot en minutos (ej. 30).
   * @returns Un array de SlotsDisponibilidad generados.
   * @throws NotFoundException Si la jornada diaria no existe.
   * @throws BadRequestException Si la duración del slot no es válida.
   */
  async generateSlots(
    idJornadaDiaria: string,
    duracionSlotMinutos: number,
  ): Promise<SlotDisponibilidad[]> {
    if (duracionSlotMinutos <= 0 || duracionSlotMinutos > 240) {
      // Limitar la duración razonablemente
      throw new BadRequestException(
        'La duración del slot debe ser un número positivo y razonable (ej. entre 1 y 240 minutos).',
      );
    }

    const jornada = await this.jornadaDiariaService.findOne(idJornadaDiaria);
    if (!jornada) {
      throw new NotFoundException(
        `Jornada Diaria con ID '${idJornadaDiaria}' no encontrada.`,
      );
    }

    const jornadaDateFromEntity = new Date(jornada.fecha);

    // Cargar los descansos asociados a esta jornada
    const descansos =
      await this.descansoService.findByJornadaDiariaId(idJornadaDiaria);

    const generatedSlots: SlotDisponibilidad[] = [];

    const jornadaFecha = jornadaDateFromEntity;

    const [hInicioJ, mInicioJ] = jornada.horaInicioTrabajo
      .split(':')
      .map(Number);
    const [hFinJ, mFinJ] = jornada.horaFinTrabajo.split(':').map(Number);

    const inicioJornada = new Date(jornadaFecha);
    inicioJornada.setUTCHours(hInicioJ, mInicioJ, 0, 0);

    const finJornada = new Date(jornadaFecha);
    finJornada.setUTCHours(hFinJ, mFinJ, 0, 0);

    let currentTime = inicioJornada;
    let slotCount = 0;

    while (currentTime < finJornada) {
      const slotEndTime = new Date(
        currentTime.getTime() + duracionSlotMinutos * 60 * 1000,
      );

      // Si el slot excede el fin de la jornada, ajustar o ignorar
      if (slotEndTime > finJornada) {
        break;
      }

      // Verificar si el slot se superpone con algún descanso
      let isOverlappingWithBreak = false;
      for (const descanso of descansos) {
        if (
          currentTime < descanso.horaFin &&
          slotEndTime > descanso.horaInicio
        ) {
          isOverlappingWithBreak = true;
          break;
        }
      }

      if (!isOverlappingWithBreak) {
        const newSlot = this.slotDisponibilidadRepository.create({
          jornadaDiaria: jornada,
          idJornadaDiaria: jornada.id,
          horaInicio: currentTime,
          horaFin: slotEndTime,
          estaReservado: false,
          estaBloqueado: false,
        });
        generatedSlots.push(newSlot);
      }

      currentTime = slotEndTime;
      slotCount++;
    }

    return this.slotDisponibilidadRepository.save(generatedSlots);
  }

  /**
   * Crea un slot de disponibilidad manualmente (generalmente no se usa directamente, sino a través de generateSlots).
   * @param createSlotDisponibilidadDto El DTO para crear el slot.
   * @returns El SlotDisponibilidad creado.
   */
  async create(
    createSlotDisponibilidadDto: CreateSlotDisponibilidadDto,
  ): Promise<SlotDisponibilidad> {
    const { idJornadaDiaria, horaInicio, horaFin } =
      createSlotDisponibilidadDto;

    const jornada = await this.jornadaDiariaService.findOne(idJornadaDiaria);
    if (!jornada) {
      throw new NotFoundException(
        `Jornada Diaria con ID '${idJornadaDiaria}' no encontrada.`,
      );
    }

    const newSlot = this.slotDisponibilidadRepository.create({
      ...createSlotDisponibilidadDto,
      jornadaDiaria: jornada,
      idJornadaDiaria: jornada.id,
      estaReservado: false,
      estaBloqueado: false,
    });
    return this.slotDisponibilidadRepository.save(newSlot);
  }

  /**
   * Busca todos los slots de disponibilidad.
   * Carga la relación 'jornadaDiaria'.
   * @returns Un array de slots de disponibilidad.
   */
  async findAll(): Promise<SlotDisponibilidad[]> {
    return this.slotDisponibilidadRepository.find({
      relations: ['jornadaDiaria', 'cita', 'descanso'],
    });
  }

  /**
   * Busca un slot de disponibilidad por su ID.
   * Carga las relaciones 'jornadaDiaria', 'cita', 'descanso'.
   * @param id El ID del slot a buscar.
   * @returns El SlotDisponibilidad si se encuentra, o null.
   */
  async findOne(id: string): Promise<SlotDisponibilidad | null> {
    return this.slotDisponibilidadRepository.findOne({
      where: { id },
      relations: ['jornadaDiaria', 'cita', 'descanso'],
    });
  }

  /**
   * Actualiza parcialmente un slot de disponibilidad existente.
   * @param id El ID del slot a actualizar.
   * @param updateSlotDisponibilidadDto El DTO con los datos parciales para actualizar.
   * @returns El SlotDisponibilidad actualizado.
   * @throws NotFoundException Si el slot no se encuentra.
   * @throws ConflictException Si se intenta reservar un slot ya ocupado.
   */
  async actualiza(
    id: string,
    updateSlotDisponibilidadDto: UpdateSlotDisponibilidadDto,
  ): Promise<SlotDisponibilidad> {
    const slotToUpdate = await this.slotDisponibilidadRepository.findOne({
      where: { id },
      relations: ['jornadaDiaria', 'cita', 'descanso'], // Cargar relaciones relevantes
    });

    if (!slotToUpdate) {
      throw new NotFoundException(
        `Slot de Disponibilidad con ID '${id}' no encontrado para actualizar.`,
      );
    }

    // Si se intenta actualizar idJornadaDiaria
    if (
      updateSlotDisponibilidadDto.idJornadaDiaria &&
      updateSlotDisponibilidadDto.idJornadaDiaria !==
        slotToUpdate.idJornadaDiaria
    ) {
      const nuevaJornada = await this.jornadaDiariaService.findOne(
        updateSlotDisponibilidadDto.idJornadaDiaria,
      );
      if (!nuevaJornada) {
        throw new NotFoundException(
          `Nueva Jornada Diaria con ID '${updateSlotDisponibilidadDto.idJornadaDiaria}' no encontrada.`,
        );
      }
      slotToUpdate.jornadaDiaria = nuevaJornada;
      slotToUpdate.idJornadaDiaria = nuevaJornada.id;
    }

    // Lógica para actualizar 'estaReservado'
    if (updateSlotDisponibilidadDto.estaReservado !== undefined) {
      if (
        updateSlotDisponibilidadDto.estaReservado === true &&
        slotToUpdate.estaBloqueado
      ) {
        throw new ConflictException(
          'No se puede reservar un slot que está bloqueado.',
        );
      }
      slotToUpdate.estaReservado = updateSlotDisponibilidadDto.estaReservado;
    }

    // Lógica para actualizar 'estaBloqueado'
    if (updateSlotDisponibilidadDto.estaBloqueado !== undefined) {
      if (
        updateSlotDisponibilidadDto.estaBloqueado === true &&
        slotToUpdate.estaReservado
      ) {
        throw new ConflictException(
          'No se puede bloquear un slot que ya está reservado.',
        );
      }
      slotToUpdate.estaBloqueado = updateSlotDisponibilidadDto.estaBloqueado;
    }

    // Aplicar otras actualizaciones primitivas
    const {
      idJornadaDiaria: _,
      estaReservado: __,
      estaBloqueado: ___,
      ...restOfUpdateDto
    } = updateSlotDisponibilidadDto;
    Object.assign(slotToUpdate, restOfUpdateDto);

    return this.slotDisponibilidadRepository.save(slotToUpdate);
  }

  /**
   * Guarda una instancia de SlotDisponibilidad.
   * Muy útil para manejar la relación bidireccional con Cita (marcar como reservado).
   * @param slot El slot de disponibilidad a guardar.
   * @returns El slot de disponibilidad guardado.
   */
  async save(slot: SlotDisponibilidad): Promise<SlotDisponibilidad> {
    return this.slotDisponibilidadRepository.save(slot);
  }
}
