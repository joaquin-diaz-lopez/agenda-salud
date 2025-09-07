// src/usuarios/usuarios.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { Usuario } from './entities/usuario.entity';
import {
  ApiCreateOperation,
  ApiFindOneOperation,
} from '../common/decorators/api-operations.decorator';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Usuarios')
@ApiBearerAuth()
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  @ApiCreateOperation(Usuario, 'Crea un nuevo usuario')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    return this.usuariosService.create(createUsuarioDto);
  }

  @Get(':id')
  @ApiFindOneOperation(Usuario, 'Obtiene un usuario por su ID')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<Usuario | null> {
    return this.usuariosService.buscarPorId(id);
  }
}
