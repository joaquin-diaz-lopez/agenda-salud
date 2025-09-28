import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  HttpCode,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { ApiTags, ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger'; // <-- Importaciones de Swagger
import { CitasService } from './citas.service';
import { CreateCitaDto } from './dto/create-cita.dto';
import { UpdateCitaDto } from './dto/update-cita.dto';
import { Cita } from './entities/cita.entity';
import { CitaResponseDto } from './dto/cita-response.dto'; // <-- DTO de respuesta
import {
  // <-- Importaciones de decoradores personalizados
  ApiCreateOperation,
  ApiFindAllOperation,
  ApiFindOneOperation,
  ApiUpdateOperation,
} from '../common/decorators/api-operations.decorator';

/**
 * Controlador para la gestión de Citas.
 * Expone los endpoints HTTP para realizar operaciones CRUD básicas sobre las citas.
 */
@Controller('citas') // Define la ruta base para este controlador: /citas
@ApiTags('Citas') // <-- Etiqueta para agrupar en Swagger
export class CitasController {
  constructor(private readonly citasService: CitasService) {}

  /**
   * Crea una nueva cita.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreateOperation(Cita, 'Agenda una nueva cita', CitaResponseDto) // <-- Usando DTO de respuesta
  @ApiBody({
    type: CreateCitaDto,
    description:
      'Datos necesarios para agendar una cita. Valida la disponibilidad del Slot.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description:
      'Una de las entidades relacionadas (Paciente, Profesional, Servicio, Slot) no existe.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'El slot de disponibilidad ya está reservado.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'El servicio no es ofrecido por el profesional.',
  })
  async create(@Body() createCitaDto: CreateCitaDto): Promise<Cita> {
    return this.citasService.create(createCitaDto);
  }

  /**
   * Obtiene todas las citas.
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiFindAllOperation(Cita, 'Obtiene todas las citas', CitaResponseDto) // <-- Usando DTO de respuesta
  async findAll(): Promise<Cita[]> {
    return this.citasService.findAll();
  }

  /**
   * Obtiene una cita específica por su ID.
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiFindOneOperation(Cita, 'Obtiene una cita por su ID', CitaResponseDto) // <-- Usando DTO de respuesta
  @ApiParam({
    name: 'id',
    description: 'ID (UUID) de la cita a buscar.',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  async findOne(@Param('id') id: string): Promise<Cita | null> {
    return this.citasService.findOne(id);
  }

  /**
   * Actualiza parcialmente una cita existente.
   */
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiUpdateOperation(
    Cita,
    'Actualiza parcialmente una cita por su ID',
    CitaResponseDto,
  ) // <-- Usando DTO de respuesta
  @ApiParam({
    name: 'id',
    description: 'ID (UUID) de la cita a actualizar.',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @ApiBody({
    type: UpdateCitaDto,
    description:
      'Datos parciales para actualizar la cita (ej. tipo, notas o estado).',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description:
      'La cita o una de las nuevas entidades relacionadas (si se actualiza) no existe.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description:
      'Se intenta cambiar a un Slot de Disponibilidad que ya está reservado por otra cita.',
  })
  async actualiza(
    @Param('id') id: string,
    @Body() updateCitaDto: UpdateCitaDto,
  ): Promise<Cita> {
    return await this.citasService.actualiza(id, updateCitaDto);
  }
}
