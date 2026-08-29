import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { DeliveriesService } from './deliveries.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateDeliveryDto } from './dto/create-delivery.dto';

@Controller('deliveries')
export class DeliveriesController {
  constructor(private readonly deliveriesService: DeliveriesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Req() req: Request & { user: {userId: string} },
    @Body() dto: CreateDeliveryDto
  ) {
    return this.deliveriesService.createDelivery(req.user.userId, dto)
  }
}
