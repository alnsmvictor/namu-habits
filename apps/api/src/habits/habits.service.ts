import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Habit } from './entities/habit.entity';

@Injectable()
export class HabitsService {
  constructor(
    @InjectRepository(Habit)
    private readonly habitsRepository: Repository<Habit>,
  ) {}

  findAll(): Promise<Habit[]> {
    return this.habitsRepository.find();
  }
}