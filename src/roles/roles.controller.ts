// src/roles/roles.controller.ts
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
import { RolesService } from './roles.service';
import { CreateRolDto } from './dto/create-rol.dto';
import { Rol } from './entities/rol.entity';
import {
  ApiCreateOperation,
  ApiFindAllOperation,
  ApiFindOneOperation,
} from '../common/decorators/api-operations.decorator';

@Controller('roles')
@ApiTags('Roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreateOperation(Rol, 'Crea un nuevo rol')
  @ApiBody({
    type: CreateRolDto,
    description: 'Datos para crear un nuevo rol.',
  })
  @ApiResponse({
    status: 409,
    description: 'El rol con ese nombre ya existe.',
  })
  async create(@Body() createRolDto: CreateRolDto): Promise<Rol> {
    return this.rolesService.create(createRolDto);
  }

  @Get()
  @ApiFindAllOperation(Rol, 'Obtiene todos los roles')
  async findAll(): Promise<Rol[]> {
    return this.rolesService.findAll();
  }

  @Get(':uuid')
  @ApiFindOneOperation(Rol, 'Obtiene un rol por su ID')
  async findOne(@Param('uuid') id: string): Promise<Rol> {
    return this.rolesService.findOne(id);
  }
}
