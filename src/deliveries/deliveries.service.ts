import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeliveryEntity, DeliveryStatus } from './entities/delivery.entity/delivery.entity';
import { IsNull, Repository } from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { DriverProfileEntity, DriverVerificationStatus } from 'src/users/entities/driver-profile.entity';
import { UpdateDeliveryDto } from 'src/drivers/dto/update-delivery.dto';

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

    async acceptDelivery(userId: string, deliverId: string) {
        const driverProfile = await this.driverRepo.findOne({
            where: {
                user: {
                    id: userId
                }
            }
        })

    if (!driverProfile) {
        throw new ForbiddenException(
        'You are not registered as a driver',
        );
    }   
    
    if (
        driverProfile.verificationStatus !==
        DriverVerificationStatus.APPROVED
    ) {
        throw new ForbiddenException(
        'Your driver account is not approved',
        );
    }

    const delivery = await this.deliveryRepo.findOne({
        where: {
            id: deliverId
        }
    })

    if (!delivery) {
        throw new NotFoundException('Delivery not found');
    }

    if (delivery.status !== DeliveryStatus.PENDING) {
        throw new ConflictException(
        'This delivery is no longer available',
        );
    }

    if (delivery.driver) {
        throw new ConflictException(
        'this delivery has already been accepted',
        );
    }

    const driver = await this.userRepo.findOne({
        where: {
            id: userId
        }
    })

    if (!driver) {
        throw new NotFoundException('User not found');
    }

    delivery.driver = driver
    delivery.status = DeliveryStatus.ACCEPTED

    const savedDelivery = await this.deliveryRepo.save(delivery)


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

    async markAsPickedUp(deliverId: string, userId: string) {
        const driverProfile = await this.driverRepo.findOne({
            where: {
                user: {id: userId}
            }
        })

        if (!driverProfile) {
            throw new ForbiddenException(
            'You are not registered as a driver',
            );
        }
        
        if (driverProfile.verificationStatus !== DriverVerificationStatus.APPROVED) {
            throw new ForbiddenException(
            'Your driver account is not approved',
            );
        }

        const delivery = await this.deliveryRepo.findOne({
            where: {id: deliverId},
            relations: {driver: true}
        })

        if (!delivery) {
            throw new NotFoundException('Delivery not found');
        }

        if (!delivery.driver || delivery.driver.id !== userId) {
            throw new ForbiddenException(
            'You are not the driver assigned to this delivery',
            );
        }

        if (delivery.status !== DeliveryStatus.ACCEPTED) {
            throw new ConflictException(
            'Delivery must be accepted before pickup',
            );
        }

        delivery.status = DeliveryStatus.PICKED_UP

        const savedDelivery = await this.deliveryRepo.save(delivery)

        return {
            id: savedDelivery.id,
            status: savedDelivery.status,
            updatedAt: savedDelivery.updatedAt,
        }
    }

    async markAsInTransit(deliverId: string, userId: string) {
        const driverProfile = await this.driverRepo.findOne({
            where: {
                user: {id: userId}
            }
        })

        if (!driverProfile) {
            throw new ForbiddenException(
            'You are not registered as a driver',
            );
        }
        
        if (driverProfile.verificationStatus !== DriverVerificationStatus.APPROVED) {
            throw new ForbiddenException(
            'Your driver account is not approved',
            );
        }

        const delivery = await this.deliveryRepo.findOne({
            where: {id: deliverId},
            relations: {driver: true}
        })

        if (!delivery) {
            throw new NotFoundException('Delivery not found');
        }

        if (!delivery.driver || delivery.driver.id !== userId) {
            throw new ForbiddenException(
            'You are not the driver assigned to this delivery',
            );
        }

        if (delivery.status !== DeliveryStatus.PICKED_UP) {
            throw new ConflictException(
            'Delivery must be picked up before it can be in transit',
            );
        }

        delivery.status = DeliveryStatus.IN_TRANSIT

        const savedDelivery = await this.deliveryRepo.save(delivery)

        return {
            id: savedDelivery.id,
            status: savedDelivery.status,
            updatedAt: savedDelivery.updatedAt,
        }

    }

    async markAsDelivered(deliverId: string, userId: string) {
        const driverProfile = await this.driverRepo.findOne({
            where: {
            user: {id: userId}
        }
        })

        if (!driverProfile) {
            throw new ForbiddenException(
            'You are not registered as a driver',
            );
        }
        
        if (driverProfile.verificationStatus !== DriverVerificationStatus.APPROVED) {
            throw new ForbiddenException(
            'Your driver account is not approved',
            );
        }

        const delivery = await this.deliveryRepo.findOne({
            where: {id: deliverId},
            relations: {driver: true}
        })

        if (!delivery) {
            throw new NotFoundException('Delivery not found');
        }

        if (!delivery.driver || delivery.driver.id !== userId) {
            throw new ForbiddenException(
            'You are not the driver assigned to this delivery',
            );
        }   

        if (delivery.status !== DeliveryStatus.IN_TRANSIT) {
            throw new ConflictException(
            'Delivery must be picked up before it can be in transit',
            );
        }

        delivery.status = DeliveryStatus.DELIVERED

        const savedDelivery = await this.deliveryRepo.save(delivery)

        return {
            id: savedDelivery.id,
            status: savedDelivery.status,
            updatedAt: savedDelivery.updatedAt,
        }
    }

    async getMyDeliveries(userId: string) {
        const deliveries = await this.deliveryRepo.find({
            where: {
                customer: {
                    id: userId
                }
            },
            relations: {
                driver: true
            },
            order: {
                createdAt: 'DESC'
            }
        }


    )

    return deliveries.map((delivery) => ({
        id: delivery.id,
        pickupAddress: delivery.pickupAddress,
        destinationAddress: delivery.destinationAddress,
        recipientName: delivery.recipientName,
        recipientPhone: delivery.recipientPhone,
        packageDescription: delivery.packageDescription,
        packageWeight: delivery.packageWeight,
        packageSize: delivery.packageSize,
        deliveryFee: delivery.deliveryFee,
        status: delivery.status,
        driver: delivery.driver
        ? {
            id: delivery.driver.id,
            name: delivery.driver.name,
            phone: delivery.driver.phone,
            }
        : null,
        createdAt: delivery.createdAt,
        updatedAt: delivery.updatedAt,
    }));

    }

    async cancelDelivery(deliveryId: string, userId: string) {
        const delivery = await this.deliveryRepo.findOne({
            where: {
                id: deliveryId
            },
            relations: {
                customer: true
            }
        })

         if (!delivery) {
            throw new NotFoundException('Delivery not found');
        }

        if (delivery.customer.id !== userId) {
            throw new ForbiddenException(
            'You are not the customer who created this delivery',
            );
        }

         if (delivery.status !== DeliveryStatus.PENDING) {
            throw new ConflictException(
            'Only pending deliveries can be cancelled',
            );
        }

        delivery.status = DeliveryStatus.CANCELLED

        const savedDelivery = await this.deliveryRepo.save(delivery)

        return {
            id: savedDelivery.id,
            status: savedDelivery.status,
            updatedAt: savedDelivery.updatedAt,
        }

    }

    async updateDelivery(
        deliveryId: string,
        userId: string,
        dto: UpdateDeliveryDto,
    ) {
        const delivery = await this.deliveryRepo.findOne({
            where: {
                id: deliveryId
            },
            relations: {
                customer: true
            }
        })

        if (!delivery) {
            throw new NotFoundException('Delivery not found');
        }

        if (delivery.customer.id !== userId) {
            throw new ForbiddenException(
            'You are not the customer who created this delivery',
            );
        }

        if (delivery.status !== DeliveryStatus.PENDING) {
            throw new ConflictException(
            'Only pending deliveries can be edited',
            );
        }

        console.log('UPDATE DTO:', dto);

        Object.assign(delivery, dto)

        const savedDelivery = await this.deliveryRepo.save(delivery)

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

    async getMyDriverDeliveries(userId: string) {
        const deliveries = await this.deliveryRepo.find({
            where: {
                driver: {
                    id: userId,
                },
            },
            relations: {
                customer: true,
            },
            order: {
                createdAt: 'DESC',
            },
        });

         return deliveries.map((delivery) => ({
            id: delivery.id,
            pickupAddress: delivery.pickupAddress,
            destinationAddress: delivery.destinationAddress,
            recipientName: delivery.recipientName,
            recipientPhone: delivery.recipientPhone,
            packageDescription: delivery.packageDescription,
            packageWeight: delivery.packageWeight,
            packageSize: delivery.packageSize,
            deliveryFee: delivery.deliveryFee,
            status: delivery.status,

            customer: delivery.customer
                ? {
                    id: delivery.customer.id,
                    name: delivery.customer.name,
                    phone: delivery.customer.phone,
                }
                : null,

            createdAt: delivery.createdAt,
            updatedAt: delivery.updatedAt,
        }));


    }

}
