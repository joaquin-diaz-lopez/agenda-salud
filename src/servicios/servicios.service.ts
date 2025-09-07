// src/servicios/servicios.service.ts
import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Servicio } from './entities/servicio.entity';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { UpdateServicioDto } from './dto/update-servicio.dto';

/**
 * Servicio para la gestión de Servicios.
 * Provee métodos para interactuar con la entidad Servicio en la base de datos,
 * como la creación, lectura, actualización y eliminación.
 */
@Injectable()
export class ServiciosService {
  constructor(
    @InjectRepository(Servicio)
    private serviciosRepository: Repository<Servicio>,
  ) {}

  /**
   * Crea un nuevo servicio en la base de datos.
   * Valida si ya existe un servicio con el mismo nombre antes de guardar.
   * @param createServicioDto El DTO con los datos para crear el servicio.
   * @returns El objeto Servicio recién creado y guardado.
   * @throws ConflictException Si ya existe un servicio con el nombre proporcionado.
   */
  async create(createServicioDto: CreateServicioDto): Promise<Servicio> {
    const servicioExistente = await this.serviciosRepository.findOne({
      where: { nombre: createServicioDto.nombre },
    });

    if (servicioExistente) {
      throw new ConflictException(
        `El servicio '${createServicioDto.nombre}' ya existe.`,
      );
    }

    const nuevoServicio = this.serviciosRepository.create(createServicioDto);
    return this.serviciosRepository.save(nuevoServicio);
  }

  /**
   * Busca todos los servicios existentes en la base de datos.
   * @returns Una promesa que resuelve a un array de objetos Servicio.
   */
  async findAll(): Promise<Servicio[]> {
    return this.serviciosRepository.find();
  }

  /**
   * Busca un servicio por su ID único.
   * @param id El ID (UUID) del servicio a buscar.
   * @returns Una promesa que resuelve al objeto Servicio si se encuentra.
   * @throws NotFoundException Si no se encuentra un servicio con el ID proporcionado.
   */
  async findOne(id: string): Promise<Servicio> {
    const servicio = await this.serviciosRepository.findOne({ where: { id } });
    if (!servicio) {
      throw new NotFoundException(`Servicio con UUID "${id}" no encontrado.`);
    }
    return servicio;
  }

  /**
   * Actualiza un servicio existente por su ID.
   * @param id El ID (UUID) del servicio a actualizar.
   * @param updateServicioDto El DTO con los datos para la actualización.
   * @returns El objeto Servicio actualizado.
   * @throws NotFoundException Si no se encuentra un servicio con el ID proporcionado.
   */
  async update(
    id: string,
    updateServicioDto: UpdateServicioDto,
  ): Promise<Servicio> {
    const servicio = await this.findOne(id);
    this.serviciosRepository.merge(servicio, updateServicioDto);
    return this.serviciosRepository.save(servicio);
  }

  /**
   * Elimina un servicio por su ID.
   * @param id El ID (UUID) del servicio a eliminar.
   * @throws NotFoundException Si no se encuentra un servicio con el ID proporcionado.
   */
  async remove(id: string): Promise<void> {
    const resultado = await this.serviciosRepository.delete(id);
    if (resultado.affected === 0) {
      throw new NotFoundException(`Servicio con UUID "${id}" no encontrado.`);
    }
  }
}
