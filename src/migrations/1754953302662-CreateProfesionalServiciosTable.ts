import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableUnique,
} from 'typeorm';

export class CreateProfesionalServiciosTable1754953302662
  implements MigrationInterface
{
  // Método 'up': Se ejecuta cuando la migración es aplicada.
  // Define cómo se crea la tabla 'profesional_servicios' y sus restricciones.
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Crea la tabla 'profesional_servicios'
    await queryRunner.createTable(
      new Table({
        name: 'profesional_servicios',
        schema: 'agenda_salud_dev', // ¡Tu esquema de base de datos en Neon!
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()', // Requiere extensión uuid-ossp en Postgres
          },
          {
            name: 'id_profesional',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'id_servicio',
            type: 'uuid',
            isNullable: false,
          },
        ],
      }),
      true, // Ignora si la tabla ya existe
    );

    // Agrega la restricción UNIQUE para idProfesional e idServicio
    await queryRunner.createUniqueConstraint(
      'profesional_servicios', // Nombre de la tabla
      new TableUnique({
        columnNames: ['id_profesional', 'id_servicio'],
        name: 'UQ_profesional_servicio_composite', // Nombre opcional para la restricción
      }),
    );

    // Agrega la clave foránea a la tabla 'profesionales'
    await queryRunner.createForeignKey(
      'profesional_servicios',
      new TableForeignKey({
        columnNames: ['id_profesional'],
        referencedColumnNames: ['id'],
        referencedTableName: 'profesionales',
        onDelete: 'CASCADE', // Si el profesional se elimina, las asociaciones se eliminan
      }),
    );

    // Agrega la clave foránea a la tabla 'servicios'
    await queryRunner.createForeignKey(
      'profesional_servicios',
      new TableForeignKey({
        columnNames: ['id_servicio'],
        referencedColumnNames: ['id'],
        referencedTableName: 'servicios',
        onDelete: 'CASCADE', // Si el servicio se elimina, las asociaciones se eliminan
      }),
    );
  }

  // Método 'down': Se ejecuta cuando la migración es revertida.
  // Define cómo se eliminan las restricciones y la tabla.
  public async down(queryRunner: QueryRunner): Promise<void> {
    // Obtenemos la tabla para poder encontrar las claves foráneas y restricciones únicas
    const table = await queryRunner.getTable('profesional_servicios');

    // Solo procede si la tabla existe (es decir, no es undefined)
    if (table) {
      // <-- ¡VERIFICACIÓN AÑADIDA AQUÍ!
      // Elimina las claves foráneas
      const foreignKeyProfesional = table.foreignKeys.find((fk) =>
        fk.columnNames.includes('id_profesional'),
      );
      const foreignKeyServicio = table.foreignKeys.find((fk) =>
        fk.columnNames.includes('id_servicio'),
      );
      const uniqueConstraint = table.uniques.find(
        (uq) =>
          uq.columnNames.includes('id_profesional') &&
          uq.columnNames.includes('id_servicio'),
      );

      if (foreignKeyProfesional) {
        await queryRunner.dropForeignKey(
          'profesional_servicios',
          foreignKeyProfesional,
        );
      }
      if (foreignKeyServicio) {
        await queryRunner.dropForeignKey(
          'profesional_servicios',
          foreignKeyServicio,
        );
      }
      if (uniqueConstraint) {
        await queryRunner.dropUniqueConstraint(
          'profesional_servicios',
          uniqueConstraint.name || '',
        ); // Usar .name para dropUniqueConstraint
      }
    }

    // Elimina la tabla
    await queryRunner.dropTable('profesional_servicios', true, true, true);
  }
}
