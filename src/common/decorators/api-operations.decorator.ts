// src/common/decorators/api-operations.decorator.ts
import { applyDecorators, HttpStatus, Type } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { ApiCommonResponses } from './api-responses.decorator';

/**
 * Decorador que documenta una operación de creación (POST).
 * @param model La clase de la entidad que se está creando.
 * @param summary Un resumen de la operación.
 */
export function ApiCreateOperation<T extends Type<any>>(
  model: T,
  summary: string,
) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiCreatedResponse({
      description: `El recurso ${model.name} ha sido creado exitosamente.`,
      type: model,
    }),
    ApiCommonResponses(),
  );
}

/**
 * Decorador que documenta una operación de obtención de múltiples recursos (GET).
 * @param model La clase de la entidad que se está obteniendo.
 * @param summary Un resumen de la operación.
 */
export function ApiFindAllOperation<T extends Type<any>>(
  model: T,
  summary: string,
) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiOkResponse({
      description: `Lista de recursos ${model.name}s obtenida exitosamente.`,
      type: [model],
    }),
    ApiCommonResponses(),
  );
}

/**
 * Decorador que documenta una operación de obtención de un solo recurso por ID (GET).
 * @param model La clase de la entidad que se está obteniendo.
 * @param summary Un resumen de la operación.
 */
export function ApiFindOneOperation<T extends Type<any>>(
  model: T,
  summary: string,
) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiOkResponse({
      description: `El recurso ${model.name} ha sido obtenido exitosamente.`,
      type: model,
    }),
    ApiNotFoundResponse({
      description: `El recurso ${model.name} no fue encontrado.`,
    }),
    ApiCommonResponses(),
  );
}

/**
 * Decorador que documenta una operación de actualización (PATCH).
 * @param model La clase de la entidad que se está actualizando.
 * @param summary Un resumen de la operación.
 */
export function ApiUpdateOperation<T extends Type<any>>(
  model: T,
  summary: string,
) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiOkResponse({
      description: `El recurso ${model.name} ha sido actualizado exitosamente.`,
      type: model,
    }),
    ApiNotFoundResponse({
      description: `El recurso ${model.name} no fue encontrado para su actualización.`,
    }),
    ApiCommonResponses(),
  );
}

/**
 * Decorador que documenta una operación de eliminación (DELETE).
 * @param model La clase de la entidad que se está eliminando.
 * @param summary Un resumen de la operación.
 */
export function ApiRemoveOperation<T extends Type<any>>(
  model: T,
  summary: string,
) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiResponse({
      status: HttpStatus.OK,
      description: `El recurso ${model.name} ha sido eliminado exitosamente.`,
    }),
    ApiNotFoundResponse({
      description: `El recurso ${model.name} no fue encontrado para su eliminación.`,
    }),
    ApiCommonResponses(),
  );
}
