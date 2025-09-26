// src/agendas/slot-disponibilidad.controller.ts
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
import { SlotDisponibilidadService } from './slot-disponibilidad.service';
import { CreateSlotDisponibilidadDto } from './dto/create-slot-disponibilidad.dto';
import { UpdateSlotDisponibilidadDto } from './dto/update-slot-disponibilidad.dto';
import { GenerateSlotsDto } from './dto/generate-slots.dto'; // Importa el nuevo DTO
import { SlotDisponibilidad } from './entities/slot-disponibilidad.entity';

/**
 * Controlador para la gestión de Slots de Disponibilidad.
 * Expone los endpoints HTTP para generar, consultar y actualizar los slots de tiempo disponibles.
 */
@Controller('slots-disponibilidad') // Ruta base: /slots-disponibilidad
export class SlotDisponibilidadController {
  constructor(
    private readonly slotDisponibilidadService: SlotDisponibilidadService,
  ) {}

  /**
   * Genera múltiples slots de disponibilidad para una jornada diaria específica.
   * Este es un endpoint clave para poblar la agenda de un profesional.
   * @param generateSlotsDto El DTO con el ID de la jornada y la duración de los slots.
   * @returns Un array de SlotsDisponibilidad generados.
   */
  @Post('generate')
  @HttpCode(HttpStatus.CREATED)
  async generateSlots(
    @Body() generateSlotsDto: GenerateSlotsDto,
  ): Promise<SlotDisponibilidad[]> {
    const { idJornadaDiaria, duracionSlotMinutos } = generateSlotsDto;
    return this.slotDisponibilidadService.generateSlots(
      idJornadaDiaria,
      duracionSlotMinutos,
    );
  }

  /**
   * Crea un único slot de disponibilidad (uso menos común, se prefiere 'generate').
   * @param createSlotDisponibilidadDto El DTO con los datos para crear el slot.
   * @returns El SlotDisponibilidad recién creado.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createSlotDisponibilidadDto: CreateSlotDisponibilidadDto,
  ): Promise<SlotDisponibilidad> {
    return this.slotDisponibilidadService.create(createSlotDisponibilidadDto);
  }

  /**
   * Obtiene todos los slots de disponibilidad.
   * @returns Un array de todos los slots de disponibilidad.
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<SlotDisponibilidad[]> {
    return this.slotDisponibilidadService.findAll();
  }

  /**
   * Obtiene un slot de disponibilidad específico por su ID.
   * @param id El ID (UUID) del slot a buscar.
   * @returns El SlotDisponibilidad encontrado o null.
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<SlotDisponibilidad | null> {
    return this.slotDisponibilidadService.findOne(id);
  }

  /**
   * Actualiza parcialmente un slot de disponibilidad existente.
   * @param id El ID del slot a actualizar.
   * @param updateSlotDisponibilidadDto El DTO con los datos parciales para actualizar.
   * @returns El SlotDisponibilidad actualizado.
   */
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async actualiza(
    @Param('id') id: string,
    @Body() updateSlotDisponibilidadDto: UpdateSlotDisponibilidadDto,
  ): Promise<SlotDisponibilidad> {
    return await this.slotDisponibilidadService.actualiza(
      id,
      updateSlotDisponibilidadDto,
    );
  }
}
