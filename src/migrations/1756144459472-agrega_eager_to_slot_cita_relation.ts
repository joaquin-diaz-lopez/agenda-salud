import { MigrationInterface, QueryRunner } from 'typeorm';

export class AgregaEagerToSlotCitaRelation1756144459472
  implements MigrationInterface
{
  name = 'AgregaEagerToSlotCitaRelation1756144459472';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "agenda_salud_dev"."profesional_servicios" ADD CONSTRAINT "UQ_3edc4bfd5752e020d2edd9cd41c" UNIQUE ("id_profesional", "id_servicio")`,
    );
    await queryRunner.query(
      `ALTER TABLE "agenda_salud_dev"."jornadas_diarias" ADD CONSTRAINT "UQ_1730ac43ba61e087b352678c5e6" UNIQUE ("id_agenda_profesional", "fecha")`,
    );
    await queryRunner.query(
      `ALTER TABLE "agenda_salud_dev"."citas" ADD CONSTRAINT "FK_e6ae9e926e0bdd8cd7ba70fb041" FOREIGN KEY ("id_servicio") REFERENCES "agenda_salud_dev"."servicios"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "agenda_salud_dev"."citas" DROP CONSTRAINT "FK_e6ae9e926e0bdd8cd7ba70fb041"`,
    );
    await queryRunner.query(
      `ALTER TABLE "agenda_salud_dev"."jornadas_diarias" DROP CONSTRAINT "UQ_1730ac43ba61e087b352678c5e6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "agenda_salud_dev"."profesional_servicios" DROP CONSTRAINT "UQ_3edc4bfd5752e020d2edd9cd41c"`,
    );
  }
}
