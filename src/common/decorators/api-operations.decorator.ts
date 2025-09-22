// src/common/decorators/api-operations.decorator.ts
import { applyDecorators, HttpStatus, Type } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiParam,
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
 * @param responseModel (Opcional) Un DTO de respuesta para la documentación.
 */
export function ApiFindAllOperation<T extends Type<any>>(
  model: T,
  summary: string,
  responseModel?: Type<any>,
) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiOkResponse({
      description: `Lista de recursos ${model.name}s obtenida exitosamente.`,
      type: responseModel,
      isArray: true,
    }),
    ApiCommonResponses(),
  );
}

/**
 * Decorador que documenta una operación de obtención de un solo recurso por ID (GET).
 * @param model La clase de la entidad que se está obteniendo.
 * @param summary Un resumen de la operación.
 * @param responseModel (Opcional) Un DTO de respuesta para la documentación.
 */
export function ApiFindOneOperation<T extends Type<any>>(
  model: T,
  summary: string,
  responseModel?: Type<any>,
) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiOkResponse({
      description: `El recurso ${model.name} ha sido obtenido exitosamente.`,
      type: responseModel,
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
 * @param responseModel (Opcional) Un DTO de respuesta para la documentación.
 */
export function ApiUpdateOperation<T extends Type<any>>(
  model: T,
  summary: string,
  responseModel?: Type<any>, // <-- ¡El cambio clave! Se añade el parámetro.
) {
  const type = responseModel || model; // <-- Se usa el DTO si se proporciona, de lo contrario la entidad.
  return applyDecorators(
    ApiOperation({ summary }),
    ApiOkResponse({
      description: `El recurso ${model.name} ha sido actualizado exitosamente.`,
      type, // <-- Se utiliza la variable 'type'
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

/**
 * Decorador que documenta una operación de obtención de múltiples recursos
 * basada en un parámetro de la ruta.
 *
 * Combina @ApiOperation, @ApiOkResponse y @ApiParam para la documentación
 * automática de un endpoint GET que devuelve una lista de recursos.
 *
 * @param model La clase de la entidad que se está obteniendo (ej. Descanso).
 * @param summary Un resumen de la operación (ej. 'Busca descansos por ID de jornada').
 * @param paramName El nombre del parámetro en la ruta (ej. 'idJornadaDiaria').
 * @param responseModel El DTO de respuesta para la documentación.
 */
export function ApiFindAllByParamOperation<T extends Type<any>>(
  model: T,
  summary: string,
  paramName: string,
  responseModel: Type<any>,
) {
  return applyDecorators(
    ApiOperation({
      summary,
      description: `Obtiene una lista de ${model.name}s filtrada por el parámetro '${paramName}'.`,
    }),
    ApiParam({
      name: paramName,
      description: `El ID de la entidad relacionada (${paramName}).`,
      example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', // Ejemplo por defecto
    }),
    ApiOkResponse({
      description: `Lista de ${model.name}s obtenida exitosamente.`,
      type: responseModel,
      isArray: true,
    }),
    ApiCommonResponses(),
  );
}
