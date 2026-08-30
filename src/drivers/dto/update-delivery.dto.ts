import { PartialType } from '@nestjs/mapped-types';
import { CreateDeliveryDto } from 'src/deliveries/dto/create-delivery.dto';



export class UpdateDeliveryDto extends PartialType(
  CreateDeliveryDto,
) {}