// src/agendas/descanso.service.ts
import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Descanso } from './entities/descanso.entity';
import { CreateDescansoDto } from './dto/create-descanso.dto';
import { UpdateDescansoDto } from './dto/update-descanso.dto';
import { JornadaDiariaService } from './jornada-diaria.service'; // Necesario para validar Jornada Diaria
import { JornadaDiaria } from './entities/jornada-diaria.entity'; // Importa la entidad JornadaDiaria

/**
 * Servicio para la gestión de Descansos.
 * Permite definir períodos de no disponibilidad dentro de una jornada diaria.
 */
@Injectable()
export class DescansoService {
  constructor(
    @InjectRepository(Descanso)
    private descansoRepository: Repository<Descanso>,
    private jornadaDiariaService: JornadaDiariaService, // Inyecta JornadaDiariaService
  ) {}

  /**
   * Crea un nuevo período de descanso dentro de una jornada diaria.
   * Valida la existencia de la jornada diaria y la coherencia de los tiempos de descanso.
   * @param createDescansoDto El DTO con los datos para crear el descanso.
   * @returns El Descanso recién creado.
   * @throws NotFoundException Si la jornada diaria no existe.
   * @throws BadRequestException Si la hora de inicio es posterior o igual a la hora de fin.
   * @throws ConflictException Si el descanso se superpone con otro descanso o con los límites de la jornada.
   */
  async create(createDescansoDto: CreateDescansoDto): Promise<Descanso> {
    const { idJornadaDiaria, horaInicio, horaFin } = createDescansoDto;

    // 1. Validar existencia de la jornada diaria
    const jornadaDiaria =
      await this.jornadaDiariaService.findOne(idJornadaDiaria);
    if (!jornadaDiaria) {
      throw new NotFoundException(
        `Jornada Diaria con ID '${idJornadaDiaria}' no encontrada.`,
      );
    }

    // 2. Validar que horaInicio sea anterior a horaFin
    if (horaInicio >= horaFin) {
      throw new BadRequestException(
        'La hora de inicio del descanso debe ser anterior a la hora de fin del descanso.',
      );
    }

    // 3. Validar que el descanso esté dentro de los límites de la jornada diaria
    // Aseguramos que los objetos Date se construyan con la misma fecha para evitar problemas de día
    const jornadaFecha = jornadaDiaria.fecha; // Ya es un objeto Date

    // Extraer horas y minutos de las cadenas de tiempo de la jornada
    const [hInicioJ, mInicioJ] = jornadaDiaria.horaInicioTrabajo
      .split(':')
      .map(Number);
    const [hFinJ, mFinJ] = jornadaDiaria.horaFinTrabajo.split(':').map(Number);

    // Construir jornadaInicio y jornadaFin usando setUTCHours para consistencia UTC
    const jornadaInicio = new Date(jornadaFecha);
    jornadaInicio.setUTCHours(hInicioJ, mInicioJ, 0, 0);

    const jornadaFin = new Date(jornadaFecha);
    jornadaFin.setUTCHours(hFinJ, mFinJ, 0, 0);

    if (horaInicio < jornadaInicio || horaFin > jornadaFin) {
      throw new BadRequestException(
        'El descanso debe estar completamente dentro del horario de trabajo de la jornada diaria.',
      );
    }

    // 4. Verificar superposiciones con otros descansos existentes en la misma jornada
    const existingDescansos = await this.descansoRepository.find({
      where: { idJornadaDiaria },
    });

    for (const d of existingDescansos) {
      // Si hay solapamiento: (A_inicio < B_fin) && (A_fin > B_inicio)
      if (horaInicio < d.horaFin && horaFin > d.horaInicio) {
        throw new ConflictException(
          `El descanso se superpone con un descanso existente (ID: ${d.id}).`,
        );
      }
    }

    // 5. Crear la nueva instancia de la entidad Descanso
    const nuevoDescanso = this.descansoRepository.create({
      ...createDescansoDto, // 'razon' se copia desde aquí
      jornadaDiaria, // Asigna el objeto jornada diaria para la relación
    });

    // 6. Guardar el nuevo descanso en la base de datos
    return this.descansoRepository.save(nuevoDescanso);
  }

  /**
   * Busca todos los descansos.
   * Carga la relación 'jornadaDiaria'.
   * @returns Un array de descansos.
   */
  async findAll(): Promise<Descanso[]> {
    return this.descansoRepository.find({ relations: ['jornadaDiaria'] });
  }

  /**
   * Busca un descanso por su ID.
   * Carga la relación 'jornadaDiaria'.
   * @param id El ID del descanso a buscar.
   * @returns El Descanso si se encuentra, o null.
   */
  async findOne(id: string): Promise<Descanso | null> {
    return this.descansoRepository.findOne({
      where: { id },
      relations: ['jornadaDiaria'],
    });
  }

  /**
   * Busca descansos por el ID de una jornada diaria.
   * @param idJornadaDiaria El ID de la jornada diaria.
   * @returns Un array de Descanso.
   */
  async findByJornadaDiariaId(idJornadaDiaria: string): Promise<Descanso[]> {
    return this.descansoRepository.find({
      where: { idJornadaDiaria },
      relations: ['jornadaDiaria'],
    });
  }

  /**
   * Actualiza parcialmente un descanso existente.
   * @param id El ID del descanso a actualizar.
   * @param updateDescansoDto El DTO con los datos parciales para actualizar.
   * @returns El Descanso actualizado.
   * @throws NotFoundException Si el descanso no se encuentra.
   * @throws BadRequestException Si la hora de inicio es posterior o igual a la hora de fin.
   * @throws ConflictException Si el descanso actualizado se superpone con otro descanso o con los límites de la jornada.
   */
  async actualiza(
    id: string,
    updateDescansoDto: UpdateDescansoDto,
  ): Promise<Descanso> {
    const descansoToUpdate = await this.descansoRepository.findOne({
      where: { id },
      relations: ['jornadaDiaria'],
    });

    if (!descansoToUpdate) {
      throw new NotFoundException(
        `Descanso con ID '${id}' no encontrado para actualizar.`,
      );
    }

    // Combinar datos actuales con los que se intentan actualizar
    const horaInicio =
      updateDescansoDto.horaInicio || descansoToUpdate.horaInicio;
    const horaFin = updateDescansoDto.horaFin || descansoToUpdate.horaFin;
    const razon = updateDescansoDto.razon || descansoToUpdate.razon;
    const idJornadaDiaria =
      updateDescansoDto.idJornadaDiaria || descansoToUpdate.idJornadaDiaria;

    // Validar horaInicio vs horaFin
    if (horaInicio >= horaFin) {
      throw new BadRequestException(
        'La hora de inicio del descanso debe ser anterior a la hora de fin del descanso.',
      );
    }

    let jornadaDiaria: JornadaDiaria = descansoToUpdate.jornadaDiaria; // Empieza con la jornada actual
    if (
      updateDescansoDto.idJornadaDiaria &&
      updateDescansoDto.idJornadaDiaria !== descansoToUpdate.idJornadaDiaria
    ) {
      const nuevaJornada = await this.jornadaDiariaService.findOne(
        updateDescansoDto.idJornadaDiaria,
      );
      if (!nuevaJornada) {
        throw new NotFoundException(
          `Nueva Jornada Diaria con ID '${updateDescansoDto.idJornadaDiaria}' no encontrada.`,
        );
      }
      jornadaDiaria = nuevaJornada; // Actualiza la referencia a la jornadaDiaria
      descansoToUpdate.jornadaDiaria = nuevaJornada;
      descansoToUpdate.idJornadaDiaria = nuevaJornada.id;
    }

    // Validar que el descanso esté dentro de los límites de la jornada diaria
    // Reconstruir los objetos Date para asegurar la coherencia de día
    const jornadaFecha = jornadaDiaria.fecha; // Aseguramos que sea Date

    const [hInicioJ, mInicioJ] = jornadaDiaria.horaInicioTrabajo
      .split(':')
      .map(Number);
    const [hFinJ, mFinJ] = jornadaDiaria.horaFinTrabajo.split(':').map(Number);

    const jornadaInicio = new Date(jornadaFecha);
    jornadaInicio.setUTCHours(hInicioJ, mInicioJ, 0, 0);

    const jornadaFin = new Date(jornadaFecha);
    jornadaFin.setUTCHours(hFinJ, mFinJ, 0, 0);

    if (horaInicio < jornadaInicio || horaFin > jornadaFin) {
      throw new BadRequestException(
        'El descanso debe estar completamente dentro del horario de trabajo de la jornada diaria.',
      );
    }

    // Verificar superposiciones con otros descansos (excluyendo el actual si no se ha movido)
    const existingDescansos = await this.descansoRepository.find({
      where: { idJornadaDiaria: jornadaDiaria.id },
    });

    for (const d of existingDescansos) {
      if (d.id === id) continue; // Ignorar el propio descanso que estamos actualizando
      if (horaInicio < d.horaFin && horaFin > d.horaInicio) {
        throw new ConflictException(
          `El descanso se superpone con un descanso existente (ID: ${d.id}).`,
        );
      }
    }

    // Aplicar otras actualizaciones primitivas
    const { idJornadaDiaria: _, ...restOfUpdateDto } = updateDescansoDto;
    Object.assign(descansoToUpdate, {
      ...restOfUpdateDto,
      horaInicio,
      horaFin,
      razon,
    });

    return this.descansoRepository.save(descansoToUpdate);
  }

  /**
   * Guarda una instancia de Descanso.
   * Util para manejar relaciones bidireccionales en otros servicios.
   * @param descanso La entidad Descanso a guardar.
   * @returns La entidad Descanso guardada.
   */
  async save(descanso: Descanso): Promise<Descanso> {
    return this.descansoRepository.save(descanso);
  }
}
