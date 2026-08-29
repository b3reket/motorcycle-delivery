import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeliveryEntity, DeliveryStatus } from './entities/delivery.entity/delivery.entity';
import { IsNull, Repository } from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { DriverProfileEntity, DriverVerificationStatus } from 'src/users/entities/driver-profile.entity';

@Injectable()
export class DeliveriesService {
    constructor (
        @InjectRepository(DeliveryEntity)
        private readonly deliveryRepo: Repository<DeliveryEntity>, 

        @InjectRepository(UserEntity)
        private readonly userRepo: Repository<UserEntity>, 

        @InjectRepository(DriverProfileEntity)
        private readonly driverRepo: Repository<DriverProfileEntity>, 

    ) {}

    async createDelivery(
        userId: string,
        dto: CreateDeliveryDto
    ) {
        const user = await this.userRepo.findOne(
            {
                where: {id: userId}
            }
        )

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const delivery = this.deliveryRepo.create({
            customer: user,
            pickupAddress: dto.pickupAddress,
            destinationAddress: dto.destinationAddress,
            recipientName: dto.recipientName,
            recipientPhone: dto.recipientPhone,
            packageDescription: dto.packageDescription,
            packageWeight: dto.packageWeight,
            packageSize: dto.packageSize,
            deliveryFee: dto.deliveryFee,
        });

        const savedDelivery =
            await this.deliveryRepo.save(delivery);
        
        return {
            id: savedDelivery.id,
            pickupAddress: savedDelivery.pickupAddress,
            destinationAddress: savedDelivery.destinationAddress,
            recipientName: savedDelivery.recipientName,
            recipientPhone: savedDelivery.recipientPhone,
            packageDescription: savedDelivery.packageDescription,
            packageWeight: savedDelivery.packageWeight,
            packageSize: savedDelivery.packageSize,
            deliveryFee: savedDelivery.deliveryFee,
            status: savedDelivery.status,
            createdAt: savedDelivery.createdAt,
            updatedAt: savedDelivery.updatedAt,
        }
    }

    
    async getAvailableDeliveries(userId: string) {
        const driverProfile = await this.driverRepo.findOne({
            where: {
                user: {
                    id: userId
                },
            }
        })

        if (!driverProfile) {
            throw new ForbiddenException(
            'You are not registered as a driver',
            );
        }

        if ( driverProfile.verificationStatus !== DriverVerificationStatus.APPROVED) {
            throw new ForbiddenException(
            'Your driver account is not approved',
            );
        }

        return this.deliveryRepo.find({
            where: {
                status: DeliveryStatus.PENDING, 
                driver: IsNull()
            },
            order: {
                createdAt: 'DESC'
            }
        })
    }
    
}
