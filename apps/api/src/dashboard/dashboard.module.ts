import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Habit } from '../habits/entities/habit.entity';
import { Checkin } from '../checkins/entities/checkin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Habit, Checkin])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
