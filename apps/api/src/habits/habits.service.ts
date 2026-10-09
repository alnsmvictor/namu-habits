import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Habit } from './entities/habit.entity';
import { CreateHabitDto } from './dto/create-habit.dto';

@Injectable()
export class HabitsService {
  constructor(
    @InjectRepository(Habit)
    private readonly habitsRepository: Repository<Habit>,
  ) {}

  findAll(): Promise<Habit[]> {
    return this.habitsRepository.find();
  }

  async create(dto: CreateHabitDto): Promise<Habit> {
    const habit = this.habitsRepository.create(dto);
    return this.habitsRepository.save(habit);
  }
}