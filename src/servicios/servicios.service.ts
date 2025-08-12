// src/servicios/servicios.service.ts
import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Servicio } from './entities/servicio.entity'; // Importa la entidad Servicio
import { CreateServicioDto } from './dto/create-servicio.dto'; // Importa el DTO de creación

/**
 * Servicio para la gestión de Servicios.
 * Provee métodos para interactuar con la entidad Servicio en la base de datos,
 * como la creación de nuevos servicios.
 */
@Injectable()
export class ServiciosService {
  constructor(
    @InjectRepository(Servicio) // Inyecta el repositorio de TypeORM para la entidad Servicio
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
    // 1. Verificar si ya existe un servicio con el mismo nombre
    const servicioExistente = await this.serviciosRepository.findOne({
      where: { nombre: createServicioDto.nombre },
    });

    if (servicioExistente) {
      throw new ConflictException(
        `El servicio '${createServicioDto.nombre}' ya existe.`,
      );
    }

    // 2. Crear una nueva instancia de la entidad Servicio con los datos del DTO
    const nuevoServicio = this.serviciosRepository.create(createServicioDto);

    // 3. Guardar el nuevo servicio en la base de datos
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
   * @returns Una promesa que resuelve al objeto Servicio si se encuentra, o null si no.
   */
  async findOne(id: string): Promise<Servicio | null> {
    return this.serviciosRepository.findOne({ where: { id } });
  }

  // Puedes añadir aquí otros métodos como `update` o `remove` si los necesitas más adelante.
}
