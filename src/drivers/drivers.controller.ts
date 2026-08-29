import { Body, Controller, Get, Post, Req, Request, UseGuards } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateDriverProfileDto } from './dto/create-driver-profile.dto';

@Controller('drivers')
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Req() request: Request & { user: { userId: string } },
    @Body() dto: CreateDriverProfileDto) {
      return this.driversService.createDriverProfile(request.user.userId, dto)
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMyDriverProfile(@Req() req: Request & { user: {userId: string} }) {
    return this.driversService.getMyDriverProfile(req.user.userId)
  }
}
