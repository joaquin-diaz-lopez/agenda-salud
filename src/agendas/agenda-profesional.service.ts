// src/agendas/agenda-profesional.service.ts
import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AgendaProfesional } from './entities/agenda-profesional.entity';
import { CreateAgendaProfesionalDto } from './dto/create-agenda-profesional.dto';
import { UpdateAgendaProfesionalDto } from './dto/update-agenda-profesional.dto';
import { ProfesionalesService } from '../profesionales/profesionales.service'; // Necesario para validar Profesional

/**
 * Servicio para la gestión de Agendas Profesionales.
 * Permite la creación y gestión de la agenda principal de un profesional.
 */
@Injectable()
export class AgendaProfesionalService {
  constructor(
    @InjectRepository(AgendaProfesional)
    private agendaProfesionalRepository: Repository<AgendaProfesional>,
    private profesionalesService: ProfesionalesService, // Inyecta ProfesionalesService
  ) {}

  /**
   * Crea una nueva agenda profesional.
   * Valida la existencia del profesional y asegura que no tenga ya una agenda.
   * @param createAgendaProfesionalDto El DTO con los datos para crear la agenda.
   * @returns La AgendaProfesional recién creada.
   * @throws NotFoundException Si el profesional no existe.
   * @throws ConflictException Si el profesional ya tiene una agenda.
   */
  async create(
    createAgendaProfesionalDto: CreateAgendaProfesionalDto,
  ): Promise<AgendaProfesional> {
    const { idProfesional } = createAgendaProfesionalDto;

    // 1. Verificar si el profesional existe
    const profesional = await this.profesionalesService.findOne(idProfesional);
    if (!profesional) {
      throw new NotFoundException(
        `Profesional con ID '${idProfesional}' no encontrado.`,
      );
    }

    // 2. Verificar si el profesional ya tiene una agenda
    // Asumimos que la entidad Profesional carga su relación 'agenda' (eager: true o en findOne)
    if (profesional.agenda) {
      throw new ConflictException(
        `El Profesional con ID '${idProfesional}' ya tiene una agenda asociada.`,
      );
    }

    // 3. Crear la nueva instancia de la entidad AgendaProfesional
    const nuevaAgenda = this.agendaProfesionalRepository.create({
      ...createAgendaProfesionalDto,
      profesional, // Asigna el objeto profesional para la relación
    });

    // 4. Guardar la nueva agenda en la base de datos
    return this.agendaProfesionalRepository.save(nuevaAgenda);
  }

  /**
   * Busca todas las agendas profesionales.
   * Carga la relación 'profesional'.
   * @returns Un array de agendas profesionales.
   */
  async findAll(): Promise<AgendaProfesional[]> {
    return this.agendaProfesionalRepository.find({
      relations: ['profesional'],
    });
  }

  /**
   * Busca una agenda profesional por su ID.
   * Carga la relación 'profesional'.
   * @param id El ID de la agenda a buscar.
   * @returns La AgendaProfesional si se encuentra, o null.
   */
  async findOne(id: string): Promise<AgendaProfesional | null> {
    return this.agendaProfesionalRepository.findOne({
      where: { id },
      relations: ['profesional'],
    });
  }

  /**
   * Busca una agenda profesional por el ID del profesional.
   * @param idProfesional El ID del profesional.
   * @returns La AgendaProfesional si se encuentra, o null.
   */
  async findByProfesionalId(
    idProfesional: string,
  ): Promise<AgendaProfesional | null> {
    return this.agendaProfesionalRepository.findOne({
      where: { idProfesional },
      relations: ['profesional'],
    });
  }

  /**
   * Actualiza parcialmente una agenda profesional existente.
   * @param id El ID de la agenda a actualizar.
   * @param updateAgendaProfesionalDto El DTO con los datos parciales para actualizar.
   * @returns La AgendaProfesional actualizada.
   * @throws NotFoundException Si la agenda no se encuentra.
   * @throws ConflictException Si se intenta asociar a un profesional que ya tiene agenda.
   */
  async actualiza(
    id: string,
    updateAgendaProfesionalDto: UpdateAgendaProfesionalDto,
  ): Promise<AgendaProfesional> {
    const agendaToUpdate = await this.agendaProfesionalRepository.findOne({
      where: { id },
      relations: ['profesional'],
    });

    if (!agendaToUpdate) {
      throw new NotFoundException(
        `Agenda Profesional con ID '${id}' no encontrada para actualizar.`,
      );
    }

    // Si se intenta actualizar idProfesional
    if (
      updateAgendaProfesionalDto.idProfesional &&
      updateAgendaProfesionalDto.idProfesional !== agendaToUpdate.idProfesional
    ) {
      const nuevoProfesional = await this.profesionalesService.findOne(
        updateAgendaProfesionalDto.idProfesional,
      );
      if (!nuevoProfesional) {
        throw new NotFoundException(
          `Nuevo Profesional con ID '${updateAgendaProfesionalDto.idProfesional}' no encontrado.`,
        );
      }
      // Verificar si el nuevo profesional ya tiene una agenda
      if (nuevoProfesional.agenda && nuevoProfesional.agenda.id !== id) {
        throw new ConflictException(
          `El Profesional con ID '${updateAgendaProfesionalDto.idProfesional}' ya tiene una agenda asociada.`,
        );
      }

      agendaToUpdate.profesional = nuevoProfesional;
      agendaToUpdate.idProfesional = nuevoProfesional.id;
    }

    // Aplicar otras actualizaciones primitivas
    const { idProfesional: _, ...restOfUpdateDto } = updateAgendaProfesionalDto;
    Object.assign(agendaToUpdate, restOfUpdateDto);

    return this.agendaProfesionalRepository.save(agendaToUpdate);
  }

  /**
   * Guarda una instancia de AgendaProfesional.
   * Util para manejar relaciones bidireccionales en otros servicios.
   * @param agenda La entidad AgendaProfesional a guardar.
   * @returns La entidad AgendaProfesional guardada.
   */
  async save(agenda: AgendaProfesional): Promise<AgendaProfesional> {
    return this.agendaProfesionalRepository.save(agenda);
  }
}
