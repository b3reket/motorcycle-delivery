import { ConflictException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DriverProfileEntity, DriverVerificationStatus } from 'src/users/entities/driver-profile.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateDriverProfileDto } from './dto/create-driver-profile.dto';
import { DeliveryEntity, DeliveryStatus } from 'src/deliveries/entities/delivery.entity/delivery.entity';

@Injectable()
export class DriversService {
    constructor (
        @InjectRepository(DriverProfileEntity)
        private readonly driverRepo: Repository<DriverProfileEntity>,
        
        @InjectRepository(UserEntity)
        private readonly userRepo: Repository<UserEntity>,

        @InjectRepository(DeliveryEntity)
        private readonly deliveryRepo: Repository<DeliveryEntity>
    ) {}

    async createDriverProfile(userId: string, dto: CreateDriverProfileDto) {
        const user = await this.userRepo.findOne({
            where: {id: userId}
        })

        if (!user) {
            throw new ConflictException('User not found');
        }

        const existingProfile = await this.driverRepo.findOne({
        where: {
            user: {
            id: userId,
            },
        },
        });

        if (existingProfile) {
            throw new ConflictException(
                'You already have a driver profile',
            );
        }

        const driverProfile = this.driverRepo.create({
            user,
            motorcycleModel: dto.motorcycleModel,
            motorcyclePlateNumber: dto.motorcyclePlateNumber,
            driversLicenseNumber: dto.driversLicenseNumber,
        });

        const savedDriverProfile = await this.driverRepo.save(driverProfile);

        return {
             id: savedDriverProfile.id,
            motorcycleModel: savedDriverProfile.motorcycleModel,
            motorcyclePlateNumber: savedDriverProfile.motorcyclePlateNumber,
            driversLicenseNumber: savedDriverProfile.driversLicenseNumber,
            verificationStatus: savedDriverProfile.verificationStatus,
            createdAt: savedDriverProfile.createdAt,
            updatedAt: savedDriverProfile.updatedAt,
        }
    }

    async getMyDriverProfile(userId: string) {
        const driverProfile = await this.driverRepo.findOne({
            where: {
            user: {
                id: userId,
            },
            },
        });

        if (!driverProfile) {
            return null;
        }

         return {
            id: driverProfile.id,
            motorcycleModel: driverProfile.motorcycleModel,
            motorcyclePlateNumber: driverProfile.motorcyclePlateNumber,
            driversLicenseNumber: driverProfile.driversLicenseNumber,
            verificationStatus: driverProfile.verificationStatus,
            createdAt: driverProfile.createdAt,
            updatedAt: driverProfile.updatedAt,
        };
        
    }

    async getApprovedDriverProfile(userId: string) {
        const driverProfile = await this.driverRepo.findOne({
            where: {
            user: {
                id: userId,
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

        return driverProfile


    }

}
