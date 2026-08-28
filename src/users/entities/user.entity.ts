import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { DriverProfileEntity } from "./driver-profile.entity";

@Entity('users')
export class UserEntity {
    
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column({ unique: true})
    phone: string;

    @Column()
    passwordHash: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToOne(() => DriverProfileEntity, (driverProfile) => driverProfile.user)
    driverProfile: DriverProfileEntity

}
