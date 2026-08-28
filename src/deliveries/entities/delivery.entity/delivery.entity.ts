import { UserEntity } from "../../../users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum DeliveryStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  PICKED_UP = 'picked_up',
  IN_TRANSIT = 'in_transit',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export enum PackageSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
}


@Entity('deliveries')
export class DeliveryEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @ManyToOne(() => UserEntity, {
        nullable: false,
        onDelete: 'RESTRICT'
    })
    customer: UserEntity

    @ManyToOne(() => UserEntity, {
        nullable: true,
        onDelete: 'SET NULL'
    })
    driver: UserEntity | null

    @Column()
    pickupAddress: string;

    @Column()
    destinationAddress: string;

    @Column()
    recipientName: string;

    @Column()
    recipientPhone: string;

    @Column()
    packageDescription: string;


    @Column('decimal', { precision: 10, scale: 2 })
    packageWeight: number;

    @Column({
        type: 'enum',
        enum: PackageSize
    })
    packageSize: PackageSize;

    @Column('decimal', { precision: 10, scale: 2 })
    deliveryFee: number;

    @Column({
        type: 'enum',
        enum: DeliveryStatus,
        default: DeliveryStatus.PENDING,
    })
    status: DeliveryStatus;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
