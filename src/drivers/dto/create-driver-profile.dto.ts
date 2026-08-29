import {
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateDriverProfileDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  motorcycleModel: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  motorcyclePlateNumber: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  driversLicenseNumber: string;
}