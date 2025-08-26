// src/profesionales/profesionales.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  HttpCode,
  HttpStatus,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ProfesionalesService } from './profesionales.service';
import { CreateProfesionalDto } from './dto/create-profesional.dto';
import { UpdateProfesionalDto } from './dto/update-profesional.dto';
import { Profesional } from './entities/profesional.entity';

// --- ¡NUEVAS IMPORTACIONES PARA EL CONTROL DE ACCESO! ---
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Para asegurar que el usuario esté autenticado
import { RolesGuard } from '../common/guards/roles.guard'; // Tu guard de roles personalizado
import { Roles } from '../common/decorators/roles.decorator'; // Tu decorador de roles personalizado
// --- FIN NUEVAS IMPORTACIONES ---

/**
 * Controlador para la gestión de Profesionales.
 * Expone los endpoints HTTP para realizar operaciones CRUD básicas sobre los profesionales.
 */
@Controller('profesionales')
@UseGuards(JwtAuthGuard, RolesGuard) // Aplica JwtAuthGuard y RolesGuard a TODAS las rutas de este controlador
export class ProfesionalesController {
  constructor(private readonly profesionalesService: ProfesionalesService) {}

  /**
   * Crea un nuevo profesional.
   * SOLO ACCESIBLE para roles 'Administrador' o 'Profesional'.
   * @param createProfesionalDto El DTO con los datos para crear el profesional.
   * @returns El profesional recién creado.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles('Administrador', 'Profesional') // <-- ¡Aquí usamos tu decorador!
  async create(
    @Body() createProfesionalDto: CreateProfesionalDto,
  ): Promise<Profesional> {
    return this.profesionalesService.create(createProfesionalDto);
  }

  /**
   * Obtiene todos los profesionales.
   * Accesible para todos los usuarios autenticados (no requiere roles específicos más allá del JWT).
   * @returns Un array de todos los profesionales.
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  // No se especifica @Roles aquí, por lo que RolesGuard no restringirá por roles para este método.
  // Sin embargo, JwtAuthGuard sigue protegiéndolo.
  async findAll(): Promise<Profesional[]> {
    return this.profesionalesService.findAll();
  }

  /**
   * Obtiene un profesional específico por su ID.
   * Accesible para todos los usuarios autenticados.
   * @param id El ID (UUID) del profesional a buscar.
   * @returns El profesional encontrado o null.
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<Profesional | null> {
    return this.profesionalesService.findOne(id);
  }

  /**
   * Actualiza parcialmente un profesional existente.
   * SOLO ACCESIBLE para roles 'Administrador' o 'Profesional'.
   * @param id El ID del profesional a actualizar.
   * @param updateProfesionalDto El DTO con los datos parciales para actualizar.
   * @returns El objeto Profesional actualizado.
   */
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @Roles('Administrador', 'Profesional') // <-- Aquí usamos tu decorador!
  async actualiza(
    @Param('id') id: string,
    @Body() updateProfesionalDto: UpdateProfesionalDto,
  ): Promise<Profesional> {
    return await this.profesionalesService.actualiza(id, updateProfesionalDto);
  }
}
