import {
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
}
