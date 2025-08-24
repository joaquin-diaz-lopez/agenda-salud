import { MigrationInterface, QueryRunner, TableUnique } from 'typeorm';

export class AdjustJornadaDiariaUniqueConstraint1755992138064
  implements MigrationInterface
{
  // <-- ¡Actualice este nombre de clase!
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Eliminar la restricción UNIQUE existente en la columna 'fecha'
    const table = await queryRunner.getTable('jornadas_diarias');
    if (table) {
      const uniqueFecha = table.uniques.find(
        (uq) => uq.columnNames.includes('fecha') && uq.columnNames.length === 1,
      );
      if (uniqueFecha) {
        await queryRunner.dropUniqueConstraint('jornadas_diarias', uniqueFecha);
        console.log(
          `Restricción UNIQUE en 'fecha' eliminada de 'jornadas_diarias'.`,
        );
      }
    }

    // 2. Añadir la nueva restricción UNIQUE compuesta en 'id_agenda_profesional' y 'fecha'
    await queryRunner.createUniqueConstraint(
      'jornadas_diarias',
      new TableUnique({
        columnNames: ['id_agenda_profesional', 'fecha'],
        name: 'UQ_jornada_profesional_fecha', // Nombre explícito para la restricción
      }),
    );
    console.log(
      `Restricción UNIQUE compuesta en 'id_agenda_profesional' y 'fecha' añadida a 'jornadas_diarias'.`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // En el 'down', eliminamos la restricción compuesta y, si se desea, recreamos la original.
    const table = await queryRunner.getTable('jornadas_diarias');
    if (table) {
      const uniqueComposite = table.uniques.find(
        (uq) => uq.name === 'UQ_jornada_profesional_fecha',
      );
      if (uniqueComposite) {
        await queryRunner.dropUniqueConstraint(
          'jornadas_diarias',
          uniqueComposite,
        );
        console.log(
          `Restricción UNIQUE compuesta eliminada de 'jornadas_diarias'.`,
        );
      }
    }
    // No recrearemos la restricción 'unique' en 'fecha' ya que el diseño corregido no la tiene.
    // Si fuera estrictamente necesario revertir a la versión anterior, se haría aquí.
    console.log(
      `No se recrea la restricción UNIQUE original en 'fecha' en la reversión.`,
    );
  }
}
