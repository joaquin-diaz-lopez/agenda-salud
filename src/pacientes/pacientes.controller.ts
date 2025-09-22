// src/pacientes/pacientes.controller.ts
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
import { ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';
import { PacientesService } from './pacientes.service';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { Paciente } from './entities/paciente.entity';
import {
  ApiCreateOperation,
  ApiFindAllOperation,
  ApiFindOneOperation,
  ApiUpdateOperation,
} from '../common/decorators/api-operations.decorator'; // Asegúrate de que este archivo exista y esté correcto
import { PacienteResponseDto } from './dto/paciente-response.dto';

/**
 * Controlador para la gestión de Pacientes.
 * Expone los endpoints HTTP para realizar operaciones CRUD básicas sobre los pacientes.
 */
@Controller('pacientes')
@ApiTags('Pacientes') // Agrega una etiqueta a este grupo de endpoints
export class PacientesController {
  constructor(private readonly pacientesService: PacientesService) {}

  /**
   * Crea un nuevo paciente.
   * Maneja las solicitudes POST a /pacientes.
   * @param createPacienteDto El DTO con los datos para crear el paciente.
   * @returns El paciente recién creado.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreateOperation(Paciente, 'Crea un nuevo paciente')
  @ApiBody({
    type: CreatePacienteDto,
    description: 'Datos para crear un nuevo paciente.',
    examples: {
      ejemplo1: {
        value: {
          nombre: 'Juan',
          apellido: 'Pérez',
          fechaNacimiento: '1990-05-21',
          telefono: '55-1234-5678',
          email: 'juan.perez@example.com',
          direccion: 'Calle Falsa 123, Ciudad de México',
          idUsuario: '123e4567-e89b-12d3-a456-426614174000',
        },
        description: 'Ejemplo de creación de un paciente con todos los campos.',
      },
      ejemplo2: {
        value: {
          nombre: 'Ana',
          apellido: 'García',
        },
        description:
          'Ejemplo de creación de un paciente con solo los campos obligatorios.',
      },
    },
  })
  @ApiResponse({
    status: 409,
    description:
      'El email ya está en uso o el usuario ya está asociado a otro paciente.',
  })
  @ApiResponse({
    status: 404,
    description: 'El usuario asociado no fue encontrado.',
  })
  async create(
    @Body() createPacienteDto: CreatePacienteDto,
  ): Promise<Paciente> {
    return this.pacientesService.create(createPacienteDto);
  }

  /**
   * Obtiene todos los pacientes.
   * Maneja las solicitudes GET a /pacientes.
   * @returns Un array de todos los pacientes.
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiFindAllOperation(
    Paciente,
    'Obtiene todos los pacientes',
    PacienteResponseDto,
  )
  async findAll(): Promise<Paciente[]> {
    return this.pacientesService.findAll();
  }

  /**
   * Obtiene un paciente específico por su ID.
   * Maneja las solicitudes GET a /pacientes/:id.
   * @param id El ID (UUID) del paciente a buscar.
   * @returns El paciente encontrado o null.
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiFindOneOperation(
    Paciente,
    'Obtiene un paciente por su ID',
    PacienteResponseDto,
  )
  async findOne(@Param('id') id: string): Promise<Paciente | null> {
    return this.pacientesService.findOne(id);
  }

  /**
   * Actualiza parcialmente un paciente existente.
   * Maneja las solicitudes PATCH a /pacientes/:id.
   * @param id El ID del paciente a actualizar.
   * @param updatePacienteDto El DTO con los datos parciales para actualizar.
   * @returns El objeto Paciente actualizado.
   */
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiUpdateOperation(Paciente, 'Actualiza un paciente por su ID')
  @ApiBody({
    type: UpdatePacienteDto,
    description: 'Datos parciales para actualizar un paciente.',
    examples: {
      ejemplo1: {
        value: {
          telefono: '55-9876-5432',
          direccion: 'Av. Siempre Viva 742',
        },
        description: 'Ejemplo de actualización de teléfono y dirección.',
      },
      ejemplo2: {
        value: {
          email: 'nuevo.email@example.com',
        },
        description: 'Ejemplo de actualización de solo el email.',
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'El email ya está en uso por otro paciente.',
  })
  async actualiza(
    @Param('id') id: string,
    @Body() updatePacienteDto: UpdatePacienteDto,
  ): Promise<Paciente> {
    return await this.pacientesService.actualiza(id, updatePacienteDto);
  }
}
