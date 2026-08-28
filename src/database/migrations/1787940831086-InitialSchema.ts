import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1787940831086 implements MigrationInterface {
    name = 'InitialSchema1787940831086'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."deliveries_packagesize_enum" AS ENUM('small', 'medium', 'large')`);
        await queryRunner.query(`CREATE TYPE "public"."deliveries_status_enum" AS ENUM('pending', 'accepted', 'picked_up', 'in_transit', 'delivered', 'cancelled')`);
        await queryRunner.query(`CREATE TABLE "deliveries" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "pickupAddress" character varying NOT NULL, "destinationAddress" character varying NOT NULL, "recipientName" character varying NOT NULL, "recipientPhone" character varying NOT NULL, "packageDescription" character varying NOT NULL, "packageWeight" numeric(10,2) NOT NULL, "packageSize" "public"."deliveries_packagesize_enum" NOT NULL, "deliveryFee" numeric(10,2) NOT NULL, "status" "public"."deliveries_status_enum" NOT NULL DEFAULT 'pending', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "customerId" uuid NOT NULL, "driverId" uuid, CONSTRAINT "PK_a6ef225c5c5f0974e503bfb731f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "deliveries" ADD CONSTRAINT "FK_5cbaf0bed7a55ec4da5d4e558d3" FOREIGN KEY ("customerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "deliveries" ADD CONSTRAINT "FK_a6cc84e1c957ed2d25bd7eda4ba" FOREIGN KEY ("driverId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deliveries" DROP CONSTRAINT "FK_a6cc84e1c957ed2d25bd7eda4ba"`);
        await queryRunner.query(`ALTER TABLE "deliveries" DROP CONSTRAINT "FK_5cbaf0bed7a55ec4da5d4e558d3"`);
        await queryRunner.query(`DROP TABLE "deliveries"`);
        await queryRunner.query(`DROP TYPE "public"."deliveries_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."deliveries_packagesize_enum"`);
    }

}
