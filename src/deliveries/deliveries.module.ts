import { Module } from '@nestjs/common';
import { DeliveriesService } from './deliveries.service';
import { DeliveriesController } from './deliveries.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryEntity } from './entities/delivery.entity/delivery.entity';
import { UserEntity } from 'src/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([DeliveryEntity, UserEntity])
  ], 
  controllers: [DeliveriesController],
  providers: [DeliveriesService],
})
export class DeliveriesModule {}
