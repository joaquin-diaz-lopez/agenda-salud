// src/profesional-servicios/profesional-servicios.controller.ts (Corregido)
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
// Asegúrate de importar ApiParam
import {
  ApiTags,
  ApiBody,
  ApiResponse,
  ApiParam,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { ProfesionalServiciosService } from './profesional-servicios.service';
import { CreateProfesionalServicioDto } from './dto/create-profesional-servicio.dto';
import { ProfesionalServicio } from './entities/profesional-servicio.entity';
import {
  ApiCreateOperation,
  ApiFindAllOperation,
  ApiFindOneOperation,
} from '../common/decorators/api-operations.decorator';
import { ProfesionalServicioResponseDto } from './dto/profesional-servicio-response.dto';

@Controller('profesional-servicios')
@ApiTags('Profesional Servicios')
export class ProfesionalServiciosController {
  constructor(
    private readonly profesionalServiciosService: ProfesionalServiciosService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreateOperation(
    ProfesionalServicio,
    'Crea una nueva asociación entre un profesional y un servicio',
    ProfesionalServicioResponseDto, // <-- ¡Uso del DTO de Respuesta!
  )
  @ApiBody({
    type: CreateProfesionalServicioDto,
    description: 'IDs del profesional y el servicio para crear la asociación.',
    examples: {
      ejemplo1: {
        value: {
          idProfesional: '123e4567-e89b-12d3-a456-426614174000',
          idServicio: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
        },
        description: 'Crea una nueva asociación válida.',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'El Profesional o el Servicio proporcionado no existe.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT, // 409
    description: 'La asociación entre el profesional y el servicio ya existe.',
  })
  async create(
    @Body() createProfesionalServicioDto: CreateProfesionalServicioDto,
  ): Promise<ProfesionalServicio> {
    return this.profesionalServiciosService.create(
      createProfesionalServicioDto,
    );
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiFindAllOperation(
    ProfesionalServicio,
    'Obtiene todas las asociaciones entre profesionales y servicios',
    ProfesionalServicioResponseDto,
  )
  async findAll(): Promise<ProfesionalServicio[]> {
    return this.profesionalServiciosService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiFindOneOperation(
    ProfesionalServicio,
    'Obtiene una asociación por su ID',
    ProfesionalServicioResponseDto,
  )
  @ApiParam({
    // <-- Documentación del parámetro de ruta
    name: 'id',
    description: 'ID (UUID) de la asociación ProfesionalServicio.',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  async findOne(@Param('id') id: string): Promise<ProfesionalServicio | null> {
    return this.profesionalServiciosService.findOne(id);
  }
}
