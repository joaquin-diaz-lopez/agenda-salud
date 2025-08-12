import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateServiciosTable1754871728169 implements MigrationInterface {
  // Método 'up': Se ejecuta cuando la migración es aplicada.
  // Define cómo se crea la tabla 'servicios'.
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'servicios', // Nombre de la tabla
        schema: 'agenda_salud_dev', // ¡Tu esquema de base de datos en Neon!
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()', // Genera UUIDs automáticamente (requiere extensión uuid-ossp en Postgres)
          },
          {
            name: 'nombre',
            type: 'varchar',
            length: '100',
            isUnique: true,
            isNullable: false, // Campo obligatorio
          },
          {
            name: 'descripcion',
            type: 'varchar',
            length: '255',
            isNullable: true, // Campo opcional
          },
          {
            name: 'duracion_minutos',
            type: 'int',
            isNullable: true, // Según tu entidad, puede ser nulo
          },
          {
            name: 'precio',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true, // Según tu entidad, puede ser nulo
          },
        ],
      }),
      true, // Si es 'true', ignorará el error si la tabla ya existe (útil en algunos casos, aunque no debería existir aquí)
    );
  }

  // Método 'down': Se ejecuta cuando la migración es revertida.
  // Define cómo se elimina la tabla 'servicios'.
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('servicios', true, true, true); // Elimina la tabla 'servicios'
  }
}
