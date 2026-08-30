import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { DeliveriesService } from './deliveries.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from 'src/drivers/dto/update-delivery.dto';

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

  @Get('available')
  @UseGuards(JwtAuthGuard)
  getAvailableDeliveries(@Req() req: Request & {user: { userId: string}}) {
    return this.deliveriesService.getAvailableDeliveries(req.user.userId)
  }

  @Patch(':id/accept') 
  @UseGuards(JwtAuthGuard)
  acceptDelivery(
    @Param('id') id: string,
    @Req() req: Request & {user: {userId: string}}
  ) {
    return this.deliveriesService.acceptDelivery(req.user.userId, id)
  }

  @Patch(':id/pickup') 
  @UseGuards(JwtAuthGuard)  
  pickUp(
    @Param('id') id: string,
    @Req() req: Request & {user: {userId: string} }
  ) {
    return this.deliveriesService.markAsPickedUp(id, req.user.userId)
  }

  @Patch(':id/in-transit') 
  @UseGuards(JwtAuthGuard)  
  inTransit(
    @Param('id') id: string,
    @Req() req: Request & {user: {userId: string} }
  ) {
    return this.deliveriesService.markAsInTransit(id, req.user.userId)
  }

  @Patch(':id/delivered') 
  @UseGuards(JwtAuthGuard)  
  delivered(
    @Param('id') id: string,
    @Req() req: Request & {user: {userId: string} }
  ) {
    return this.deliveriesService.markAsDelivered(id, req.user.userId)
  }

  @Get('my-deliveries')
  @UseGuards(JwtAuthGuard)
  getMyDeliveries(@Req() req: Request & {user: {userId: string}}) {
    return this.deliveriesService.getMyDeliveries(req.user.userId)
  }

  @Patch(':id/cancel')
  @UseGuards(JwtAuthGuard)
  cancelDelivery(
    @Param('id') id: string,
    @Req() req: Request & {user: {userId: string}} 
  ) {
    return this.deliveriesService.cancelDelivery(id, req.user.userId)
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  updateDelivery(
    @Param('id') id: string,
    @Req() req: Request & {user: {userId: string}},
    dto: UpdateDeliveryDto
  ) {
    return this.deliveriesService.updateDelivery(id, req.user.userId, dto)
  }

}
