// src/profesionales/profesionales.service.ts
import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profesional } from './entities/profesional.entity';
import { CreateProfesionalDto } from './dto/create-profesional.dto';
import { UsuariosService } from '../usuarios/usuarios.service';
import { CentroDeSalud } from '../centros-de-salud/entities/centro-de-salud.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';

@Injectable()
export class ProfesionalesService {
  constructor(
    @InjectRepository(Profesional)
    private profesionalesRepository: Repository<Profesional>,
    private usuariosService: UsuariosService,
    @InjectRepository(CentroDeSalud)
    private centroDeSaludRepository: Repository<CentroDeSalud>,
  ) {}

  async create(
    createProfesionalDto: CreateProfesionalDto,
  ): Promise<Profesional> {
    // Desestructuración con tipos explícitos para mayor seguridad y claridad para ESLint
    const {
      idUsuario,
      email,
      nombre,
      apellido,
      especialidad,
      telefono,
      idCentroDeSalud,
    } = createProfesionalDto;

    // 1. Verificar si el usuario asociado existe y no está ya asociado a un profesional
    const usuario: Usuario | null =
      await this.usuariosService.buscarPorId(idUsuario);

    if (!usuario) {
      throw new NotFoundException(
        `Usuario con ID '${idUsuario}' no encontrado.`,
      );
    }

    // AHORA `usuario.profesional` es de tipo `Profesional | null` gracias a la corrección en Usuario.entity.ts
    if (usuario.profesional) {
      throw new ConflictException(
        `El usuario con ID '${idUsuario}' ya está asociado a otro profesional.`,
      );
    }

    // 2. Verificar si el email ya está en uso por otro profesional
    const emailExistente = await this.profesionalesRepository.findOne({
      where: { email },
    });
    if (emailExistente) {
      throw new ConflictException(
        `El email '${email}' ya está en uso por otro profesional.`,
      );
    }

    // 3. Si se provee idCentroDeSalud, verificar si el centro de salud existe
    if (idCentroDeSalud) {
      const centroDeSalud = await this.centroDeSaludRepository.findOne({
        where: { id: idCentroDeSalud },
      });
      if (!centroDeSalud) {
        throw new NotFoundException(
          `Centro de Salud con ID '${idCentroDeSalud}' no encontrado.`,
        );
      }
    }

    // 4. Crear una nueva instancia de la entidad Profesional
    const nuevoProfesional =
      this.profesionalesRepository.create(createProfesionalDto);

    // 5. Guardar el nuevo profesional en la base de datos
    return this.profesionalesRepository.save(nuevoProfesional);
  }

  async findAll(): Promise<Profesional[]> {
    return this.profesionalesRepository.find({
      relations: ['usuario', 'centroDeSalud'],
    });
  }

  async findOne(id: string): Promise<Profesional | null> {
    return this.profesionalesRepository.findOne({
      where: { id },
      relations: ['usuario', 'centroDeSalud'],
    });
  }
}
