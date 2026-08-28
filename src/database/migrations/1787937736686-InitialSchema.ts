import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1787937736686 implements MigrationInterface {
    name = 'InitialSchema1787937736686'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."driver_profiles_verificationstatus_enum" AS ENUM('pending', 'approved', 'rejected')`);
        await queryRunner.query(`CREATE TABLE "driver_profiles" ("id" uuid NOT NULL, "motorcycleModel" character varying NOT NULL, "motorcyclePlateNumber" character varying NOT NULL, "driversLicenseNumber" character varying NOT NULL, "verificationStatus" "public"."driver_profiles_verificationstatus_enum" NOT NULL DEFAULT 'pending', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_db2ce52d5c4d350fb514783e72b" UNIQUE ("motorcyclePlateNumber"), CONSTRAINT "UQ_3ab3cd3e1dc2065e3ad910b1b42" UNIQUE ("driversLicenseNumber"), CONSTRAINT "PK_6e002fc8a835351e070978fcad4" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "driver_profiles"`);
        await queryRunner.query(`DROP TYPE "public"."driver_profiles_verificationstatus_enum"`);
    }

}
