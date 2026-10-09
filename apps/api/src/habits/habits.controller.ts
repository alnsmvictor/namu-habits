import { Controller, Get } from '@nestjs/common';
import { HabitsService } from './habits.service';
import { Body, Post } from '@nestjs/common';
import { CreateHabitDto } from './dto/create-habit.dto';

@Controller('habits')
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) {}

  @Get()
  findAll() {
    return this.habitsService.findAll();
  }

  @Post()
  create(@Body() dto: CreateHabitDto) {
    return this.habitsService.create(dto);
  }
}