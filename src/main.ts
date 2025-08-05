import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  // Crea la instancia de la aplicación NestJS
  const app = await NestFactory.create(AppModule);

  // Obtén el servicio de configuración para acceder a las variables de entorno
  const configService = app.get(ConfigService);

  // Usa la variable de entorno 'PORT' o un valor por defecto (ej. 3000)
  const port = configService.get<number>('PORT') || 3000;

  // Escucha en el puerto configurado
  await app.listen(port);

  // Muestra el enlace y el puerto en la consola una vez que la aplicación ha iniciado
  console.log(`🚀 La aplicación está corriendo en: http://localhost:${port}`);
}
// Llama a la función bootstrap y maneja cualquier error potencial
bootstrap().catch((err) => console.error(err));
