import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';
import { PackageSize } from '../entities/delivery.entity/delivery.entity';

export class CreateDeliveryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  pickupAddress: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  destinationAddress: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  recipientName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  recipientPhone: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  packageDescription: string;

  @IsNumber()
  @IsPositive()
  packageWeight: number;

  @IsEnum(PackageSize)
  packageSize: PackageSize;

  @IsNumber()
  @IsPositive()
  deliveryFee: number;
}