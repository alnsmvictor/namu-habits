
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Habit } from '../../habits/entities/habit.entity';

@Entity('checkins')
export class Checkin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'habit_id' })
  habitId: number;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @ManyToOne(() => Habit)
  @JoinColumn({ name: 'habit_id' })
  habit: Habit;
}
