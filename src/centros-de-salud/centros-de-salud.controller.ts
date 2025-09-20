import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';
import { CentrosDeSaludService } from './centros-de-salud.service';
import { CreateCentroDeSaludDto } from './dto/create-centro-de-salud.dto';
import { CentroDeSalud } from './entities/centro-de-salud.entity';
import {
  ApiCreateOperation,
  ApiFindAllOperation,
  ApiFindOneOperation,
} from '../common/decorators/api-operations.decorator';
import { CentroDeSaludResponseDto } from './dto/centro-de-salud-response.dto';

/**
 * Controlador para la gestión de Centros de Salud.
 * Expone los endpoints HTTP para realizar operaciones CRUD básicas sobre los centros de salud.
 */
@Controller('centros-de-salud')
@ApiTags('Centros de Salud')
export class CentrosDeSaludController {
  constructor(private readonly centrosDeSaludService: CentrosDeSaludService) {}

  /**
   * Crea un nuevo centro de salud.
   * Maneja las solicitudes POST a /centros-de-salud.
   * @param createCentroDeSaludDto El DTO con los datos para crear el centro de salud.
   * @returns El centro de salud recién creado.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreateOperation(CentroDeSalud, 'Crea un nuevo centro de salud')
  @ApiBody({
    type: CreateCentroDeSaludDto,
    description: 'Datos para crear un nuevo centro de salud.',
    examples: {
      ejemplo1: {
        value: {
          nombre: 'Centro de Salud Acajete',
          direccion: 'Calle Principal #123, Acajete, Ver.',
          telefono: '228-123-4567',
          email: 'contacto@centrosaludacajete.org',
        },
        description: 'Ejemplo de creación de un centro de salud completo.',
      },
      ejemplo2: {
        value: {
          nombre: 'Consultorio Particular',
          direccion: 'Av. Siempres Vivas #55',
        },
        description:
          'Ejemplo de creación de un centro de salud con solo los campos obligatorios.',
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'El centro de salud con ese nombre ya existe.',
  })
  async create(
    @Body() createCentroDeSaludDto: CreateCentroDeSaludDto,
  ): Promise<CentroDeSalud> {
    return this.centrosDeSaludService.create(createCentroDeSaludDto);
  }

  /**
   * Obtiene todos los centros de salud.
   * Maneja las solicitudes GET a /centros-de-salud.
   * @returns Un array de todos los centros de salud.
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiFindAllOperation(
    CentroDeSalud,
    'Obtiene todos los centros de salud',
    CentroDeSaludResponseDto, // Se pasa el DTO de respuesta aquí
  )
  async findAll(): Promise<CentroDeSalud[]> {
    return this.centrosDeSaludService.findAll();
  }

  /**
   * Obtiene un centro de salud específico por su ID.
   * Maneja las solicitudes GET a /centros-de-salud/:id.
   * @param id El ID (UUID) del centro de salud a buscar.
   * @returns El centro de salud encontrado o null.
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiFindOneOperation(
    CentroDeSalud,
    'Obtiene un centro de salud por su ID',
    CentroDeSaludResponseDto, // Se pasa el DTO de respuesta aquí
  )
  async findOne(@Param('id') id: string): Promise<CentroDeSalud | null> {
    return this.centrosDeSaludService.findOne(id);
  }
}
