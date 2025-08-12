// src/centros-de-salud/centros-de-salud.service.ts
import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CentroDeSalud } from './entities/centro-de-salud.entity'; // Importa la entidad CentroDeSalud
import { CreateCentroDeSaludDto } from './dto/create-centro-de-salud.dto'; // Importa el DTO de creación

/**
 * Servicio para la gestión de Centros de Salud.
 * Provee métodos para interactuar con la entidad CentroDeSalud en la base de datos,
 * incluyendo la creación y búsqueda de centros.
 */
@Injectable()
export class CentrosDeSaludService {
  constructor(
    @InjectRepository(CentroDeSalud) // Inyecta el repositorio de TypeORM para la entidad CentroDeSalud
    private centrosDeSaludRepository: Repository<CentroDeSalud>,
  ) {}

  /**
   * Crea un nuevo centro de salud en la base de datos.
   * Valida si ya existe un centro con el mismo nombre antes de guardar.
   * @param createCentroDeSaludDto El DTO con los datos para crear el centro.
   * @returns El objeto CentroDeSalud recién creado y guardado.
   * @throws ConflictException Si ya existe un centro de salud con el nombre proporcionado.
   */
  async create(
    createCentroDeSaludDto: CreateCentroDeSaludDto,
  ): Promise<CentroDeSalud> {
    // 1. Verificar si ya existe un centro de salud con el mismo nombre
    const centroExistente = await this.centrosDeSaludRepository.findOne({
      where: { nombre: createCentroDeSaludDto.nombre },
    });

    if (centroExistente) {
      throw new ConflictException(
        `El centro de salud '${createCentroDeSaludDto.nombre}' ya existe.`,
      );
    }

    // 2. Crear una nueva instancia de la entidad CentroDeSalud con los datos del DTO
    const nuevoCentro = this.centrosDeSaludRepository.create(
      createCentroDeSaludDto,
    );

    // 3. Guardar el nuevo centro en la base de datos
    return this.centrosDeSaludRepository.save(nuevoCentro);
  }

  /**
   * Busca todos los centros de salud existentes en la base de datos.
   * @returns Una promesa que resuelve a un array de objetos CentroDeSalud.
   */
  async findAll(): Promise<CentroDeSalud[]> {
    return this.centrosDeSaludRepository.find();
  }

  /**
   * Busca un centro de salud por su ID único.
   * @param id El ID (UUID) del centro de salud a buscar.
   * @returns Una promesa que resuelve al objeto CentroDeSalud si se encuentra, o null si no.
   */
  async findOne(id: string): Promise<CentroDeSalud | null> {
    return this.centrosDeSaludRepository.findOne({ where: { id } });
  }

  // Puedes añadir aquí otros métodos como `update` o `remove` si los necesitas más adelante.
}
