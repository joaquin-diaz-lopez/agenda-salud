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
import { AgendaProfesionalService } from './agenda-profesional.service';
import { CreateAgendaProfesionalDto } from './dto/create-agenda-profesional.dto';
import { UpdateAgendaProfesionalDto } from './dto/update-agenda-profesional.dto';
import { AgendaProfesional } from './entities/agenda-profesional.entity';
import {
  // <-- Importaciones de decoradores personalizados
  ApiCreateOperation,
  ApiFindAllOperation,
  ApiFindOneOperation,
  ApiUpdateOperation,
} from '../../common/decorators/api-operations.decorator';

/**
 * Controlador para la gestión de Agendas Profesionales.
 * Expone los endpoints HTTP para realizar operaciones CRUD sobre las agendas generales de los profesionales.
 */
@Controller('agendas-profesionales') // Ruta base: /agendas-profesionales
@ApiTags('Agendas Profesionales') // <-- Etiqueta para agrupar en Swagger
export class AgendaProfesionalController {
  constructor(
    private readonly agendaProfesionalService: AgendaProfesionalService,
  ) {}

  /**
   * Crea una nueva agenda profesional.
   * @param createAgendaProfesionalDto El DTO con los datos para crear la agenda.
   * @returns La AgendaProfesional recién creada.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreateOperation(
    AgendaProfesional,
    'Crea una nueva agenda base para un profesional',
  ) // <-- Decorador personalizado
  @ApiBody({
    type: CreateAgendaProfesionalDto,
    description:
      'Datos necesarios para asignar una agenda a un profesional. El ID del profesional debe ser único en este contexto.',
  })
  @ApiResponse({
    // Documentación específica para conflicto de unicidad
    status: HttpStatus.CONFLICT,
    description:
      'Ya existe una agenda para el ID de profesional proporcionado (`idProfesional`).',
  })
  async create(
    @Body() createAgendaProfesionalDto: CreateAgendaProfesionalDto,
  ): Promise<AgendaProfesional> {
    return this.agendaProfesionalService.create(createAgendaProfesionalDto);
  }

  /**
   * Obtiene todas las agendas profesionales.
   * @returns Un array de todas las agendas profesionales.
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiFindAllOperation(
    AgendaProfesional,
    'Obtiene todas las agendas profesionales registradas',
  ) // <-- Decorador personalizado
  async findAll(): Promise<AgendaProfesional[]> {
    return this.agendaProfesionalService.findAll();
  }

  /**
   * Obtiene una agenda profesional específica por su ID.
   * @param id El ID (UUID) de la agenda a buscar.
   * @returns La AgendaProfesional encontrada o null.
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiFindOneOperation(
    AgendaProfesional,
    'Obtiene una agenda profesional por su ID',
  ) // <-- Decorador personalizado
  @ApiParam({
    name: 'id',
    description: 'ID (UUID) de la Agenda Profesional.',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  async findOne(@Param('id') id: string): Promise<AgendaProfesional | null> {
    return this.agendaProfesionalService.findOne(id);
  }

  /**
   * Busca una agenda profesional por el ID de un profesional.
   * @param idProfesional El ID (UUID) del profesional.
   * @returns La AgendaProfesional encontrada o null.
   */
  @Get('profesional/:idProfesional')
  @HttpCode(HttpStatus.OK)
  @ApiFindOneOperation(
    AgendaProfesional,
    'Obtiene la agenda por el ID de un profesional',
  ) // <-- Se usa FindOne ya que es una relación 1:1
  @ApiParam({
    name: 'idProfesional',
    description: 'ID (UUID) del profesional de la salud.',
    example: 'f9e8d7c6-b5a4-3210-fedc-ba9876543210',
  })
  async findByProfesionalId(
    @Param('idProfesional') idProfesional: string,
  ): Promise<AgendaProfesional | null> {
    return this.agendaProfesionalService.findByProfesionalId(idProfesional);
  }

  /**
   * Actualiza parcialmente una agenda profesional existente.
   * @param id El ID de la agenda a actualizar.
   * @param updateAgendaProfesionalDto El DTO con los datos parciales para actualizar.
   * @returns La AgendaProfesional actualizada.
   */
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiUpdateOperation(
    AgendaProfesional,
    'Actualiza parcialmente una agenda profesional por su ID',
  ) // <-- Decorador personalizado
  @ApiParam({
    name: 'id',
    description: 'ID (UUID) de la Agenda Profesional a actualizar.',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @ApiBody({
    type: UpdateAgendaProfesionalDto,
    description: 'Datos parciales para actualizar la agenda.',
  })
  async actualiza(
    @Param('id') id: string,
    @Body() updateAgendaProfesionalDto: UpdateAgendaProfesionalDto,
  ): Promise<AgendaProfesional> {
    return await this.agendaProfesionalService.actualiza(
      id,
      updateAgendaProfesionalDto,
    );
  }
}
