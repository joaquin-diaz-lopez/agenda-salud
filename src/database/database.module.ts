import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: configService.get<string>('DB_TYPE') as 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: +configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        schema: configService.get<string>('DB_SCHEMA'),

        // Esta notación encontrará automáticamente todas las entidades
        // dentro de la estructura de tu proyecto.
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],

        synchronize: configService.get<string>('SYNCHRONIZE_DB') === 'true',
        logging: ['query', 'error'],
        ssl:
          configService.get<string>('DB_SSL_MODE') === 'require'
            ? {
                rejectUnauthorized: false,
              }
            : false,
      }),
    }),
  ],
})
export class DatabaseModule {}
