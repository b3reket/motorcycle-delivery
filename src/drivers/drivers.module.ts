import { Module } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { DriversController } from './drivers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriverProfileEntity } from 'src/users/entities/driver-profile.entity';
import { UserEntity } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DriverProfileEntity, UserEntity])],
  controllers: [DriversController],
  providers: [DriversService],
})
export class DriversModule {}
