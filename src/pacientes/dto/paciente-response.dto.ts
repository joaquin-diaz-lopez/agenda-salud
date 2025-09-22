// src/pacientes/dto/paciente-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { UsuarioResponseDto } from '../../usuarios/dto/usuario-response.dto'; // Asegúrate de tener este DTO

export class PacienteResponseDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Identificador único del paciente (UUID).',
  })
  id: string;

  @ApiProperty({
    example: 'Juan',
    description: 'Nombre del paciente.',
  })
  nombre: string;

  @ApiProperty({
    example: 'Pérez',
    description: 'Apellido del paciente.',
  })
  apellido: string;

  @ApiProperty({
    example: '1990-05-21',
    description: 'Fecha de nacimiento del paciente.',
    required: false,
  })
  fechaNacimiento: Date;

  @ApiProperty({
    example: '228-123-4567',
    description: 'Número de teléfono de contacto del paciente.',
    required: false,
  })
  telefono: string;

  @ApiProperty({
    example: 'juan.perez@example.com',
    description: 'Dirección de correo electrónico del paciente.',
    required: false,
  })
  email: string;

  @ApiProperty({
    example: 'Calle Falsa 123, Ciudad de México',
    description: 'Dirección de residencia del paciente.',
    required: false,
  })
  direccion: string;

  @ApiProperty({
    type: UsuarioResponseDto,
    description: 'Información del usuario asociado a este paciente.',
    required: false,
  })
  usuario?: UsuarioResponseDto;
}
