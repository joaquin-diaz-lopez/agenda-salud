// src/roles/roles.service.ts
import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rol } from './entities/rol.entity';
import { CreateRolDto } from './dto/create-rol.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Rol)
    private rolesRepository: Repository<Rol>,
  ) {}

  async create(createRolDto: CreateRolDto): Promise<Rol> {
    const rolExistente = await this.rolesRepository.findOne({
      where: { nombre: createRolDto.nombre },
    });
    if (rolExistente) {
      throw new ConflictException(`El rol '${createRolDto.nombre}' ya existe.`);
    }
    const nuevoRol = this.rolesRepository.create(createRolDto);
    return this.rolesRepository.save(nuevoRol);
  }

  async findAll(): Promise<Rol[]> {
    return this.rolesRepository.find();
  }

  async findOne(id: string): Promise<Rol | null> {
    return this.rolesRepository.findOne({ where: { id } });
  }

  async findByNombre(nombre: string): Promise<Rol | null> {
    return this.rolesRepository.findOne({ where: { nombre } });
  }

  // Puedes añadir métodos para actualizar y eliminar si los necesitas
}
