import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeliveryEntity } from './entities/delivery.entity/delivery.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { CreateDeliveryDto } from './dto/create-delivery.dto';

@Injectable()
export class DeliveriesService {
    constructor (
        @InjectRepository(DeliveryEntity)
        private readonly deliveryRepo: Repository<DeliveryEntity>, 

        @InjectRepository(UserEntity)
        private readonly userRepo: Repository<UserEntity>, 

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
    
}
