import { Controller, Get, Headers, Param, ParseIntPipe } from '@nestjs/common';
import { HabitsService } from './habits.service';
import { Body, Delete, Patch, Post } from '@nestjs/common';
import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';

@Controller('habits')
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) {}

  @Get()
  findAll(@Headers('x-user-id') userId: string) {
    return this.habitsService.findAll(Number(userId));
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Headers('x-user-id') userId: string,
  ) {
    return this.habitsService.findOne(id, Number(userId));
  }

  @Post()
  create(@Body() dto: CreateHabitDto, @Headers('x-user-id') userId: string) {
    return this.habitsService.create(dto, Number(userId));
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateHabitDto,
    @Headers('x-user-id') userId: string,
  ) {
    return this.habitsService.update(id, dto, Number(userId));
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Headers('x-user-id') userId: string,
  ) {
    return this.habitsService.remove(id, Number(userId));
  }
}
