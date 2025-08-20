import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  // Crea la instancia de la aplicación NestJS
  const app = await NestFactory.create(AppModule);

  // --- ¡AÑADE ESTA LÍNEA PARA HABILITAR EL PARSEO DE JSON EXPLÍCITAMENTE! ---
  app.use(express.json()); // Habilita el middleware para parsear cuerpos JSON
  // --- FIN DE LA ADICIÓN ---

  // --- ¡LÍNEA PARA HABILITAR EL VALIDATIONPIPE GLOBALMENTE! ---
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades que no están definidas en el DTO
      forbidNonWhitelisted: true, // Lanza un error si hay propiedades no definidas
      transform: true, // Transforma el payload a una instancia del DTO
    }),
  );
  // --- FIN DE LA ADICIÓN ---

  // Obtén el servicio de configuración para acceder a las variables de entorno
  const configService = app.get(ConfigService);

  // Usa la variable de entorno 'PORT' o un valor por defecto (ej. 3000)
  const port = configService.get<number>('PORT') || 3000;

  const config = new DocumentBuilder()
    .setTitle('Agenda de Salud')
    .setDescription('API de Agenda de Salud')
    .setVersion('1.0')
    .addTag('profesionales') // Opcional: añade tags para agrupar tus endpoints
    .addBearerAuth() // Si usas JWT u otros tokens de portador
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // 'api' es la ruta donde se servirá la documentación (ej. http://localhost:3000/api)

  // Escucha en el puerto configurado
  await app.listen(port);

  // Muestra el enlace y el puerto en la consola una vez que la aplicación ha iniciado
  console.log(`🚀 La aplicación está corriendo en: http://localhost:${port}`);
}
// Llama a la función bootstrap y maneja cualquier error potencial
bootstrap().catch((err) => console.error(err));
