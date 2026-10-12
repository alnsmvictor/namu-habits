import {
  Body,
  Controller,
  Get,
  Headers,
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
  findAll(
    @Param('habitId', ParseIntPipe) habitId: number,
    @Headers('x-user-id') userId: string,
  ) {
    return this.checkinsService.findAllByHabit(habitId, Number(userId));
  }

  @Post()
  create(
    @Param('habitId', ParseIntPipe) habitId: number,
    @Body() dto: CreateCheckinDto,
    @Headers('x-user-id') userId: string,
  ) {
    return this.checkinsService.create(habitId, dto, Number(userId));
  }
}
