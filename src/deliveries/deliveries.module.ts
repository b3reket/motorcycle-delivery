import { Module } from '@nestjs/common';
import { DeliveriesService } from './deliveries.service';
import { DeliveriesController } from './deliveries.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryEntity } from './entities/delivery.entity/delivery.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { DriverProfileEntity } from 'src/users/entities/driver-profile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([DeliveryEntity, UserEntity, DriverProfileEntity])
  ], 
  controllers: [DeliveriesController],
  providers: [DeliveriesService],
})
export class DeliveriesModule {}
