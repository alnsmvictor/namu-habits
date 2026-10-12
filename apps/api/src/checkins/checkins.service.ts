import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Habit } from '../habits/entities/habit.entity';
import { CreateCheckinDto } from './dto/create-checkin.dto';
import { Checkin } from './entities/checkin.entity';

@Injectable()
export class CheckinsService {
  constructor(
    @InjectRepository(Checkin)
    private readonly checkinsRepository: Repository<Checkin>,
    @InjectRepository(Habit)
    private readonly habitsRepository: Repository<Habit>,
  ) {}

  async create(
    habitId: number,
    dto: CreateCheckinDto,
    userId: number,
  ): Promise<Checkin> {
    const habit = await this.habitsRepository.findOneBy({
      id: habitId,
      userId,
    });

    if (!habit) {
      throw new NotFoundException('Hábito não encontrado');
    }

    const weekDays = habit.weekDays ?? [0, 1, 2, 3, 4, 5, 6];

    if (!this.isHabitDay(dto.date, weekDays)) {
      throw new BadRequestException(
        'Hábito não está programado para esta data',
      );
    }

    const existingCheckin = await this.checkinsRepository.findOneBy({
      habitId,
      date: dto.date,
    });

    if (existingCheckin) {
      throw new ConflictException('Já existe um check-in para essa data');
    }

    const checkin = this.checkinsRepository.create({
      habitId,
      ...dto,
    });

    return this.checkinsRepository.save(checkin);
  }

  async findAllByHabit(habitId: number, userId: number): Promise<Checkin[]> {
    const habit = await this.habitsRepository.findOneBy({
      id: habitId,
      userId,
    });

    if (!habit) {
      throw new NotFoundException('Hábito não encontrado');
    }

    return this.checkinsRepository.find({
      where: { habitId },
      order: { date: 'DESC' },
    });
  }

  async remove(
    habitId: number,
    checkinId: number,
    userId: number,
  ): Promise<{ message: string }> {
    const habit = await this.habitsRepository.findOneBy({
      id: habitId,
      userId,
    });

    if (!habit) {
      throw new NotFoundException('Hábito não encontrado');
    }

    const checkin = await this.checkinsRepository.findOneBy({
      id: checkinId,
      habitId,
    });

    if (!checkin) {
      throw new NotFoundException('Check-in não encontrado');
    }

    await this.checkinsRepository.delete(checkinId);

    return { message: 'Check-in removido com sucesso' };
  }

  private isHabitDay(date: string, weekDays: number[]): boolean {
    const day = new Date(`${date}T12:00:00Z`).getUTCDay();
    const weekDayIndex = day === 0 ? 6 : day - 1;

    return weekDays.includes(weekDayIndex);
  }
}
