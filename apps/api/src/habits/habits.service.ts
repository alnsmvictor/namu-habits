import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findOne(id: number): Promise<Habit> {
    const habit = await this.habitsRepository.findOneBy({ id });

    if (!habit) {
      throw new NotFoundException('Hábito não encontrado');
    }

    return habit;
  }

  async create(dto: CreateHabitDto): Promise<Habit> {
    const habit = this.habitsRepository.create(dto);
    return this.habitsRepository.save(habit);
  }
}
