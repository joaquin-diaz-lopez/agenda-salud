import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveIdCitaFromSlotDisponibilidad1755991638038
  implements MigrationInterface
{
  // <-- ¡Actualice este nombre de clase!
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Eliminar la clave foránea 'id_cita' si existe (es posible que no tenga un nombre por defecto en todos los DBs)
    const table = await queryRunner.getTable('slots_disponibilidad');
    if (table) {
      const foreignKey = table.foreignKeys.find(
        (fk) =>
          fk.columnNames.includes('id_cita') &&
          fk.referencedTableName === 'citas',
      );
      if (foreignKey) {
        await queryRunner.dropForeignKey('slots_disponibilidad', foreignKey);
        console.log(
          `Clave foránea 'id_cita' eliminada de 'slots_disponibilidad'.`,
        );
      }
    }

    // 2. Eliminar la columna 'id_cita'
    await queryRunner.dropColumn('slots_disponibilidad', 'id_cita');
    console.log(`Columna 'id_cita' eliminada de 'slots_disponibilidad'.`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // En el 'down', si se desea, se puede recrear la columna y la clave foránea.
    // Sin embargo, dado que la entidad corregida no la tiene, no la recrearemos aquí.
    // Si fuera necesario para una reversión completa a un estado anterior, la lógica iría aquí.
    console.log(
      `No se recrea la columna 'id_cita' en 'slots_disponibilidad' en la reversión.`,
    );
  }
}
