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
import { JornadaDiariaService } from './jornada-diaria.service';
import { CreateJornadaDiariaDto } from './dto/create-jornada-diaria.dto';
import { UpdateJornadaDiariaDto } from './dto/update-jornada-diaria.dto';
import { JornadaDiaria } from './entities/jornada-diaria.entity';
import {
  // <-- Importaciones de decoradores personalizados
  ApiCreateOperation,
  ApiFindAllOperation,
  ApiFindOneOperation,
  ApiUpdateOperation,
  ApiFindAllByParamOperation,
} from '../../common/decorators/api-operations.decorator';

/**
 * Controlador para la gestión de Jornadas Diarias.
 * Expone los endpoints HTTP para realizar operaciones CRUD sobre los horarios de trabajo diarios de un profesional.
 */
@Controller('jornadas-diarias') // Ruta base: /jornadas-diarias
@ApiTags('Jornadas Diarias') // <-- Etiqueta para agrupar en Swagger
export class JornadaDiariaController {
  constructor(private readonly jornadaDiariaService: JornadaDiariaService) {}

  /**
   * Crea una nueva jornada diaria.
   * @param createJornadaDiariaDto El DTO con los datos para crear la jornada.
   * @returns La JornadaDiaria recién creada.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreateOperation(
    JornadaDiaria,
    'Crea una nueva jornada diaria para una agenda',
  )
  @ApiBody({
    type: CreateJornadaDiariaDto,
    description:
      'Datos necesarios para crear una jornada. La combinación de idAgendaProfesional y fecha debe ser única.',
  })
  @ApiResponse({
    // Documentación específica para conflicto de unicidad
    status: HttpStatus.CONFLICT,
    description:
      'Ya existe una jornada diaria para esta agenda en la fecha especificada.',
  })
  async create(
    @Body() createJornadaDiariaDto: CreateJornadaDiariaDto,
  ): Promise<JornadaDiaria> {
    return this.jornadaDiariaService.create(createJornadaDiariaDto);
  }

  /**
   * Obtiene todas las jornadas diarias.
   * @returns Un array de todas las jornadas diarias.
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiFindAllOperation(
    JornadaDiaria,
    'Obtiene todas las jornadas diarias registradas',
  ) // <-- Decorador personalizado
  async findAll(): Promise<JornadaDiaria[]> {
    return this.jornadaDiariaService.findAll();
  }

  /**
   * Obtiene una jornada diaria específica por su ID.
   * @param id El ID (UUID) de la jornada a buscar.
   * @returns La JornadaDiaria encontrada o null.
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiFindOneOperation(JornadaDiaria, 'Obtiene una jornada diaria por su ID') // <-- Decorador personalizado
  @ApiParam({
    name: 'id',
    description: 'ID (UUID) de la Jornada Diaria.',
    example: 'd1c2b3a4-5e6f-7890-1234-abcdef987654',
  })
  async findOne(@Param('id') id: string): Promise<JornadaDiaria | null> {
    return this.jornadaDiariaService.findOne(id);
  }

  /**
   * Busca jornadas diarias por el ID de una agenda profesional.
   * @param idAgendaProfesional El ID (UUID) de la agenda profesional.
   * @returns Un array de JornadaDiaria.
   */
  @Get('agenda/:idAgendaProfesional')
  @HttpCode(HttpStatus.OK)
  // Uso el decorador específico para búsqueda por parámetro de ruta que devuelve un array
  @ApiFindAllByParamOperation(
    JornadaDiaria,
    'Busca jornadas diarias por ID de agenda profesional',
    'idAgendaProfesional', // Nombre del parámetro en la ruta
    JornadaDiaria, // Modelo de respuesta (puede ser un DTO o la Entidad)
  )
  async findByAgendaProfesionalId(
    @Param('idAgendaProfesional') idAgendaProfesional: string,
  ): Promise<JornadaDiaria[]> {
    return this.jornadaDiariaService.findByAgendaProfesionalId(
      idAgendaProfesional,
    );
  }

  /**
   * Actualiza parcialmente una jornada diaria existente.
   * @param id El ID de la jornada a actualizar.
   * @param updateJornadaDiariaDto El DTO con los datos parciales para actualizar.
   * @returns La JornadaDiaria actualizada.
   */
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiUpdateOperation(
    JornadaDiaria,
    'Actualiza parcialmente una jornada diaria por su ID',
  ) // <-- Decorador personalizado
  @ApiParam({
    name: 'id',
    description: 'ID (UUID) de la Jornada Diaria a actualizar.',
    example: 'd1c2b3a4-5e6f-7890-1234-abcdef987654',
  })
  @ApiBody({
    type: UpdateJornadaDiariaDto,
    description: 'Datos parciales para actualizar la jornada.',
  })
  async actualiza(
    @Param('id') id: string,
    @Body() updateJornadaDiariaDto: UpdateJornadaDiariaDto,
  ): Promise<JornadaDiaria> {
    return await this.jornadaDiariaService.actualiza(
      id,
      updateJornadaDiariaDto,
    );
  }
}
