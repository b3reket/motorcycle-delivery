import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DeliveriesModule } from './deliveries/deliveries.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriversModule } from './drivers/drivers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: false,
      ssl: true
    }),
    
    AuthModule, UsersModule, DeliveriesModule, DriversModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
