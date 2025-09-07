// src/servicios/servicios.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ServiciosService } from './servicios.service';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { UpdateServicioDto } from './dto/update-servicio.dto';
import { Servicio } from './entities/servicio.entity';
import {
  ApiCreateOperation,
  ApiFindAllOperation,
  ApiFindOneOperation,
  ApiUpdateOperation,
  ApiRemoveOperation,
} from '../common/decorators/api-operations.decorator';

@Controller('servicios')
export class ServiciosController {
  constructor(private readonly serviciosService: ServiciosService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreateOperation(Servicio, 'Crea un nuevo servicio')
  @ApiBody({
    type: CreateServicioDto,
    description: 'Datos para crear un nuevo servicio.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'El servicio con ese nombre ya existe.',
  })
  async create(
    @Body() createServicioDto: CreateServicioDto,
  ): Promise<Servicio> {
    return this.serviciosService.create(createServicioDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiFindAllOperation(Servicio, 'Obtiene todos los servicios')
  async findAll(): Promise<Servicio[]> {
    return this.serviciosService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiFindOneOperation(Servicio, 'Obtiene un servicio por su ID')
  @ApiParam({
    name: 'id',
    description: 'UUID del servicio a buscar.',
    type: String,
    example: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6',
  })
  async findOne(@Param('id') id: string): Promise<Servicio> {
    return this.serviciosService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiUpdateOperation(Servicio, 'Actualiza un servicio por su ID')
  @ApiBody({
    type: UpdateServicioDto,
    description: 'Datos para actualizar el servicio.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID del servicio a actualizar.',
    type: String,
    example: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6',
  })
  async update(
    @Param('id') id: string,
    @Body() updateServicioDto: UpdateServicioDto,
  ): Promise<Servicio> {
    return this.serviciosService.update(id, updateServicioDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiRemoveOperation(Servicio, 'Elimina un servicio por su ID')
  @ApiParam({
    name: 'id',
    description: 'UUID del servicio a eliminar.',
    type: String,
    example: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.serviciosService.remove(id);
  }
}
