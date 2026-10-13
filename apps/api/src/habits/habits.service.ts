import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Habit } from './entities/habit.entity';
import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';

@Injectable()
export class HabitsService {
  constructor(
    @InjectRepository(Habit)
    private readonly habitsRepository: Repository<Habit>,
  ) {}

  findAll(userId: number): Promise<Habit[]> {
    return this.habitsRepository.findBy({ userId });
  }

  async findOne(id: number, userId: number): Promise<Habit> {
    const habit = await this.habitsRepository.findOneBy({ id, userId });

    if (!habit) {
      throw new NotFoundException('Hábito não encontrado');
    }

    return habit;
  }

  async create(dto: CreateHabitDto, userId: number): Promise<Habit> {
    const habit = this.habitsRepository.create({
      title: dto.title,
      description: dto.description,
      period: dto.period,
      weekDays: dto.weekDays,
      frequency: dto.frequency,
      category: dto.category,
      userId,
    });
    return this.habitsRepository.save(habit);
  }

  async update(
    id: number,
    dto: UpdateHabitDto,
    userId: number,
  ): Promise<Habit> {
    const habit = await this.findOne(id, userId);
    Object.assign(habit, dto);

    return this.habitsRepository.save(habit);
  }

  async remove(id: number, userId: number): Promise<{ message: string }> {
    await this.findOne(id, userId);
    await this.habitsRepository.delete(id);

    return { message: 'Hábito excluído com sucesso' };
  }
}
