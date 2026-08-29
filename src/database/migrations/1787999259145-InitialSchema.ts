import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1787999259145 implements MigrationInterface {
    name = 'InitialSchema1787999259145'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."driver_profiles_verificationstatus_enum" AS ENUM('pending', 'approved', 'rejected')`);
        await queryRunner.query(`CREATE TABLE "driver_profiles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "motorcycleModel" character varying NOT NULL, "motorcyclePlateNumber" character varying NOT NULL, "driversLicenseNumber" character varying NOT NULL, "verificationStatus" "public"."driver_profiles_verificationstatus_enum" NOT NULL DEFAULT 'pending', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "UQ_db2ce52d5c4d350fb514783e72b" UNIQUE ("motorcyclePlateNumber"), CONSTRAINT "UQ_3ab3cd3e1dc2065e3ad910b1b42" UNIQUE ("driversLicenseNumber"), CONSTRAINT "REL_c22d0ffc4bff60e9a39c003759" UNIQUE ("userId"), CONSTRAINT "PK_6e002fc8a835351e070978fcad4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "phone" character varying NOT NULL, "passwordHash" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_a000cca60bcf04454e727699490" UNIQUE ("phone"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."deliveries_packagesize_enum" AS ENUM('small', 'medium', 'large')`);
        await queryRunner.query(`CREATE TYPE "public"."deliveries_status_enum" AS ENUM('pending', 'accepted', 'picked_up', 'in_transit', 'delivered', 'cancelled')`);
        await queryRunner.query(`CREATE TABLE "deliveries" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "pickupAddress" character varying NOT NULL, "destinationAddress" character varying NOT NULL, "recipientName" character varying NOT NULL, "recipientPhone" character varying NOT NULL, "packageDescription" character varying NOT NULL, "packageWeight" numeric(10,2) NOT NULL, "packageSize" "public"."deliveries_packagesize_enum" NOT NULL, "deliveryFee" numeric(10,2) NOT NULL, "status" "public"."deliveries_status_enum" NOT NULL DEFAULT 'pending', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "customerId" uuid NOT NULL, "driverId" uuid, CONSTRAINT "PK_a6ef225c5c5f0974e503bfb731f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "driver_profiles" ADD CONSTRAINT "FK_c22d0ffc4bff60e9a39c0037590" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "deliveries" ADD CONSTRAINT "FK_5cbaf0bed7a55ec4da5d4e558d3" FOREIGN KEY ("customerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "deliveries" ADD CONSTRAINT "FK_a6cc84e1c957ed2d25bd7eda4ba" FOREIGN KEY ("driverId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deliveries" DROP CONSTRAINT "FK_a6cc84e1c957ed2d25bd7eda4ba"`);
        await queryRunner.query(`ALTER TABLE "deliveries" DROP CONSTRAINT "FK_5cbaf0bed7a55ec4da5d4e558d3"`);
        await queryRunner.query(`ALTER TABLE "driver_profiles" DROP CONSTRAINT "FK_c22d0ffc4bff60e9a39c0037590"`);
        await queryRunner.query(`DROP TABLE "deliveries"`);
        await queryRunner.query(`DROP TYPE "public"."deliveries_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."deliveries_packagesize_enum"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "driver_profiles"`);
        await queryRunner.query(`DROP TYPE "public"."driver_profiles_verificationstatus_enum"`);
    }

}
