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
import { ApiTags, ApiBody, ApiParam } from '@nestjs/swagger';
import { DescansoService } from './descanso.service';
import { CreateDescansoDto } from './dto/create-descanso.dto';
import { UpdateDescansoDto } from './dto/update-descanso.dto'; // <-- ¡Importación necesaria!
import { Descanso } from './entities/descanso.entity';
import {
  ApiCreateOperation,
  ApiFindAllOperation,
  ApiFindOneOperation,
  ApiUpdateOperation,
} from '../../common/decorators/api-operations.decorator';
import { DescansoResponseDto } from './dto/descanso-response.dto';
// Nota: ApiFindAllByParamOperation no es necesario si se usa ApiFindAllOperation con ApiParam.

/**
 * Controlador para la gestión de Descansos.
 * Expone los endpoints HTTP para definir y gestionar los períodos de no disponibilidad dentro de una jornada diaria.
 */
@Controller('descansos')
@ApiTags('Descansos')
export class DescansoController {
  constructor(private readonly descansoService: DescansoService) {}

  /**
   * Crea un nuevo período de descanso.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreateOperation(Descanso, 'Crea un nuevo período de descanso')
  @ApiBody({
    type: CreateDescansoDto,
    description: 'Datos para crear un nuevo descanso.',
  })
  async create(
    @Body() createDescansoDto: CreateDescansoDto,
  ): Promise<Descanso> {
    return this.descansoService.create(createDescansoDto);
  }

  /**
   * Obtiene todos los descansos.
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiFindAllOperation(
    Descanso,
    'Obtiene todos los descansos',
    DescansoResponseDto, // <-- Usamos el DTO de respuesta
  )
  async findAll(): Promise<Descanso[]> {
    return this.descansoService.findAll();
  }

  /**
   * Obtiene un descanso específico por su ID.
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiFindOneOperation(
    Descanso,
    'Obtiene un descanso por su ID',
    DescansoResponseDto, // <-- Usamos el DTO de respuesta
  )
  @ApiParam({
    name: 'id',
    description: 'ID (UUID) del descanso a buscar.',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  async findOne(@Param('id') id: string): Promise<Descanso | null> {
    return this.descansoService.findOne(id);
  }

  /**
   * Busca descansos por el ID de una jornada diaria.
   */
  @Get('jornada/:idJornadaDiaria')
  @HttpCode(HttpStatus.OK)
  @ApiFindAllOperation(
    Descanso,
    'Busca descansos por el ID de la jornada diaria',
    DescansoResponseDto, // <-- Usamos el DTO de respuesta
  )
  @ApiParam({
    name: 'idJornadaDiaria',
    description:
      'ID (UUID) de la jornada diaria para la cual se buscan los descansos.',
    example: 'f9e8d7c6-b5a4-3210-fedc-ba9876543210',
  })
  async findByJornadaDiariaId(
    @Param('idJornadaDiaria') idJornadaDiaria: string,
  ): Promise<Descanso[]> {
    return this.descansoService.findByJornadaDiariaId(idJornadaDiaria);
  }

  /**
   * Actualiza parcialmente un descanso existente.
   */
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiUpdateOperation(
    Descanso,
    'Actualiza un descanso por su ID',
    DescansoResponseDto, // <-- Usamos el DTO de respuesta
  )
  @ApiParam({
    name: 'id',
    description: 'ID (UUID) del descanso a actualizar.',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @ApiBody({
    type: UpdateDescansoDto,
    description: 'Datos parciales para actualizar un descanso.',
  })
  async actualiza(
    @Param('id') id: string,
    @Body() updateDescansoDto: UpdateDescansoDto,
  ): Promise<Descanso> {
    return await this.descansoService.actualiza(id, updateDescansoDto);
  }
}
