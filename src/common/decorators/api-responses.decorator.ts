// src/common/decorators/api-responses.decorator.ts
import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';

export function ApiCommonResponses() {
  return applyDecorators(
    ApiBadRequestResponse({ description: 'Datos de la solicitud inválidos.' }),
    ApiUnauthorizedResponse({
      description: 'No autorizado. Se requiere autenticación.',
    }),
    ApiForbiddenResponse({
      description: 'Prohibido. No tiene permisos para acceder a este recurso.',
    }),
    ApiNotFoundResponse({ description: 'Recurso no encontrado.' }),
    ApiInternalServerErrorResponse({
      description: 'Error interno del servidor.',
    }),
  );
}
