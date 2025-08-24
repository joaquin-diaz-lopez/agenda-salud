// src/profesional-servicios/profesional-servicios.service.ts
import {
  Injectable,
  ConflictException,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfesionalServicio } from './entities/profesional-servicio.entity';
import { CreateProfesionalServicioDto } from './dto/create-profesional-servicio.dto';
import { ProfesionalesService } from '../profesionales/profesionales.service'; // Necesario para validar profesional
import { ServiciosService } from '../servicios/servicios.service'; // Necesario para validar servicio

/**
 * Servicio para la gestión de asociaciones entre Profesionales y Servicios.
 * Permite registrar qué servicios específicos ofrece cada profesional.
 */
@Injectable()
export class ProfesionalServiciosService {
  constructor(
    @InjectRepository(ProfesionalServicio)
    private profesionalServiciosRepository: Repository<ProfesionalServicio>,
    private serviciosService: ServiciosService, // Inyecta el servicio de servicios
    @Inject(forwardRef(() => ProfesionalesService))
    private profesionalesService: ProfesionalesService,
  ) {}

  /**
   * Crea una nueva asociación entre un profesional y un servicio.
   * Verifica la existencia del profesional y el servicio, y asegura que la asociación no exista ya.
   * @param createProfesionalServicioDto El DTO con los IDs del profesional y del servicio.
   * @returns La asociación ProfesionalServicio recién creada.
   * @throws NotFoundException Si el profesional o el servicio no existen.
   * @throws ConflictException Si la asociación ya existe.
   */
  async create(
    createProfesionalServicioDto: CreateProfesionalServicioDto,
  ): Promise<ProfesionalServicio> {
    const { idProfesional, idServicio } = createProfesionalServicioDto;

    // 1. Verificar si el profesional existe
    const profesional = await this.profesionalesService.findOne(idProfesional);
    if (!profesional) {
      throw new NotFoundException(
        `Profesional con ID ${idProfesional} no encontrado.`,
      );
    }

    // 2. Verificar si el servicio existe
    const servicio = await this.serviciosService.findOne(idServicio);
    if (!servicio) {
      throw new NotFoundException(
        `Servicio con ID ${idServicio} no encontrado.`,
      );
    }

    // 3. Verificar si la asociación ya existe para evitar duplicados (gracias a @Unique en la entidad)
    const asociacionExistente =
      await this.profesionalServiciosRepository.findOne({
        where: { idProfesional, idServicio },
      });

    if (asociacionExistente) {
      throw new ConflictException(
        `La asociación entre el profesional ${idProfesional} y el servicio ${idServicio} ya existe.`,
      );
    }

    // 4. Crear y guardar la nueva asociación
    const nuevaAsociacion = this.profesionalServiciosRepository.create({
      idProfesional,
      idServicio,
      profesional, // Asociar los objetos completos para relaciones si es necesario
      servicio,
    });

    return this.profesionalServiciosRepository.save(nuevaAsociacion);
  }

  /**
   * Busca todas las asociaciones profesional-servicio.
   * @returns Una promesa que resuelve a un array de objetos ProfesionalServicio.
   */
  async findAll(): Promise<ProfesionalServicio[]> {
    return this.profesionalServiciosRepository.find({
      relations: ['profesional', 'servicio'],
    });
  }

  /**
   * Busca una asociación profesional-servicio por su ID único.
   * @param id El ID (UUID) de la asociación a buscar.
   * @returns Una promesa que resuelve al objeto ProfesionalServicio si se encuentra, o null si no.
   */
  async findOne(id: string): Promise<ProfesionalServicio | null> {
    return this.profesionalServiciosRepository.findOne({
      where: { id },
      relations: ['profesional', 'servicio'],
    });
  }
  /**
   * Busca una asociación Profesional-Servicio por el ID del profesional y el ID del servicio.
   * @param idProfesional El ID del profesional.
   * @param idServicio El ID del servicio.
   * @returns La asociación ProfesionalServicio si se encuentra, o null.
   */
  async findByProfesionalAndServicio(
    idProfesional: string,
    idServicio: string,
  ): Promise<ProfesionalServicio | null> {
    return this.profesionalServiciosRepository.findOne({
      where: { idProfesional, idServicio },
    });
  }
}
