import { Module } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { DriversController } from './drivers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriverProfileEntity } from 'src/users/entities/driver-profile.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { DeliveryEntity } from 'src/deliveries/entities/delivery.entity/delivery.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DriverProfileEntity, UserEntity, DeliveryEntity])],
  controllers: [DriversController],
  providers: [DriversService],
})
export class DriversModule {}
