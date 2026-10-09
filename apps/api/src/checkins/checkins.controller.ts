import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { CreateCheckinDto } from './dto/create-checkin.dto';
import { CheckinsService } from './checkins.service';

@Controller('habits/:habitId/checkins')
export class CheckinsController {
  constructor(private readonly checkinsService: CheckinsService) {}

  @Get()
  findAll(@Param('habitId', ParseIntPipe) habitId: number) {
    return this.checkinsService.findAllByHabit(habitId);
  }

  @Post()
  create(
    @Param('habitId', ParseIntPipe) habitId: number,
    @Body() dto: CreateCheckinDto,
  ) {
    return this.checkinsService.create(habitId, dto);
  }
}
