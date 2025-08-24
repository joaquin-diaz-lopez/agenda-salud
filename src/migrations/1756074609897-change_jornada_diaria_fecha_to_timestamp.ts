// src/migrations/1756074609897-change_jornada_diaria_fecha_to_timestamp.ts
import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

// ¡Asegúrese de que el nombre de esta clase coincida con el nombre de su archivo de migración!
export class ChangeJornadaDiariaFechaToTimestamp1756074609897
  implements MigrationInterface
{
  name = 'ChangeJornadaDiariaFechaToTimestamp1756074609897'; // <-- Ajuste este nombre si es diferente

  public async up(queryRunner: QueryRunner): Promise<void> {
    // --- Comandos de migración que TypeORM generó y que no están relacionados con 'fecha' ---
    // (Asegúrese de que estos comandos coincidan con los que TypeORM generó en su archivo)
    // Por ejemplo, si TypeORM generó:
    await queryRunner.query(
      `ALTER TABLE "agenda_salud_dev"."profesional_servicios" DROP CONSTRAINT "UQ_profesional_servicio_composite"`,
    );
    await queryRunner.query(
      `ALTER TABLE "agenda_salud_dev"."jornadas_diarias" DROP CONSTRAINT "UQ_jornada_profesional_fecha"`,
    ); // Esto es solo un ejemplo, su migración podría no tenerlo
    await queryRunner.query(
      `ALTER TABLE "agenda_salud_dev"."citas" ADD "id_servicio" uuid NOT NULL`,
    );
    // --- FIN de comandos no relacionados con 'fecha' ---

    // --- INICIO DE LA SECUENCIA DE MIGRACIÓN ROBUSTA PARA 'fecha' ---

    // 1. Renombrar la columna 'fecha' existente a un nombre temporal
    await queryRunner.renameColumn(
      'jornadas_diarias',
      'fecha',
      'jornada_temp_old_fecha',
    );

    // 2. Añadir la nueva columna 'fecha' con el tipo TIMESTAMP WITH TIME ZONE, inicialmente NULLABLE
    await queryRunner.addColumn(
      'jornadas_diarias',
      new TableColumn({
        name: 'fecha',
        type: 'timestamp with time zone',
        isNullable: true, // Temporalmente nullable
      }),
    );

    // 3. Copiar y convertir los datos de la columna antigua a la nueva.
    //    Los valores DATE se convertirán a TIMESTAMP WITH TIME ZONE a medianoche UTC.
    //    Si la columna antigua pudiera tener NULLs (aunque la entidad dice NOT NULL), se manejaría aquí.
    await queryRunner.query(
      `UPDATE "agenda_salud_dev"."jornadas_diarias" SET "fecha" = "jornada_temp_old_fecha"::timestamp with time zone`,
    );

    // 4. Eliminar la columna temporal antigua
    await queryRunner.dropColumn('jornadas_diarias', 'jornada_temp_old_fecha');

    // 5. Alterar la nueva columna 'fecha' para que sea NOT NULL (ahora que ya tiene valores)
    await queryRunner.query(
      `ALTER TABLE "agenda_salud_dev"."jornadas_diarias" ALTER COLUMN "fecha" SET NOT NULL`,
    );

    // --- FIN DE LA SECUENCIA DE MIGRACIÓN ROBUSTA PARA 'fecha' ---
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // --- Comandos de reversión que TypeORM generó para lo que no es 'fecha' ---
    // (Asegúrese de que estos comandos coincidan con los que TypeORM generó en su archivo)
    // Por ejemplo, si TypeORM generó:
    await queryRunner.query(
      `ALTER TABLE "agenda_salud_dev"."citas" DROP COLUMN "id_servicio"`,
    );
    await queryRunner.query(
      `ALTER TABLE "agenda_salud_dev"."jornadas_diarias" ADD CONSTRAINT "UQ_jornada_profesional_fecha" UNIQUE ("id_agenda_profesional", "fecha")`,
    ); // Esto es solo un ejemplo, su migración podría no tenerlo
    await queryRunner.query(
      `ALTER TABLE "agenda_salud_dev"."profesional_servicios" ADD CONSTRAINT "UQ_profesional_servicio_composite" UNIQUE ("id_profesional", "id_servicio")`,
    );
    // --- FIN de comandos de reversión no relacionados con 'fecha' ---

    // --- INICIO DE LA SECUENCIA DE REVERSIÓN ROBUSTA PARA 'fecha' ---

    // 1. Alterar la columna 'fecha' para que sea NULLABLE (temporalmente para la reversión)
    await queryRunner.query(
      `ALTER TABLE "agenda_salud_dev"."jornadas_diarias" ALTER COLUMN "fecha" DROP NOT NULL`,
    );

    // 2. Añadir la columna temporal antigua con el tipo 'date'
    await queryRunner.addColumn(
      'jornadas_diarias',
      new TableColumn({
        name: 'jornada_temp_old_fecha',
        type: 'date',
        isNullable: true, // Temporalmente nullable para la reversión
      }),
    );

    // 3. Copiar y convertir los datos de la nueva columna a la antigua
    await queryRunner.query(
      `UPDATE "agenda_salud_dev"."jornadas_diarias" SET "jornada_temp_old_fecha" = "fecha"::date`,
    );

    // 4. Eliminar la nueva columna 'fecha'
    await queryRunner.dropColumn('jornadas_diarias', 'fecha');

    // 5. Renombrar la columna temporal a 'fecha'
    await queryRunner.renameColumn(
      'jornadas_diarias',
      'jornada_temp_old_fecha',
      'fecha',
    );

    // 6. Alterar la columna 'fecha' para que sea NOT NULL de nuevo (como estaba originalmente)
    await queryRunner.query(
      `ALTER TABLE "agenda_salud_dev"."jornadas_diarias" ALTER COLUMN "fecha" SET NOT NULL`,
    );

    // --- FIN DE LA SECUENCIA DE REVERSIÓN ROBUSTA PARA 'fecha' ---
  }
}
