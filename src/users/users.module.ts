import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { DriverProfileEntity } from './entities/driver-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, DriverProfileEntity])], 
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
