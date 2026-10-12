import { Controller, Get, Headers } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('habits/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  getDashboard(@Headers('x-user-id') userId: string) {
    return this.dashboardService.getDashboard(Number(userId));
  }
}
