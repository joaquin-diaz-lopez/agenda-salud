// src/config/swagger.config.ts
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Agenda de Salud')
    .setDescription(
      'Documentación de la API para la gestión de Agenda de Salud',
    )
    .setVersion('1.0')
    .addTag('Roles', 'Gestión de roles de usuario')
    .addTag('Usuarios', 'Gestión de usuarios del sistema')
    .addTag(
      'Servicios',
      'Gestión de los servicios que prestan los profesionales de salud',
    )
    .addTag('Profesionales')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
      docExpansion: 'none',
    },
    customSiteTitle: 'Documentación API',
  });
}
