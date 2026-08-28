import { Column, CreateDateColumn, Entity, OneToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { UserEntity } from "./user.entity";

export enum DriverVerificationStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
}

@Entity('driver_profiles')
export class DriverProfileEntity {
    @PrimaryColumn('uuid')
    id: string

    @OneToOne(() => UserEntity, (user) => user.driverProfile, {
        onDelete: 'CASCADE'
    })
    user: UserEntity

    @Column()
    motorcycleModel: string;

    @Column({ unique: true })
    motorcyclePlateNumber: string;

    @Column({ unique: true })
    driversLicenseNumber: string;

    @Column({
        type: 'enum',
        enum: DriverVerificationStatus,
        default: DriverVerificationStatus.PENDING
    })
    verificationStatus: DriverVerificationStatus;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}
