import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Checkin } from '../../checkins/entities/checkin.entity';
import { User } from '../../auth/entities/user.entity';

@Entity('habits')
export class Habit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'enum', enum: ['MANHA', 'TARDE', 'NOITE'] })
  period: string;

  @Column({ name: 'week_days', type: 'json' })
  weekDays: number[];

  @Column({ type: 'enum', enum: ['diário', 'semanal', 'mensal'] })
  frequency: string;

  @Column({
    type: 'enum',
    enum: ['saúde', 'exercício', 'alimentação', 'mental'],
  })
  category: string;

  @CreateDateColumn({ name: 'created_at', nullable: true })
  createdAt: Date;

  @OneToMany(() => Checkin, (checkin) => checkin.habit)
  checkins: Checkin[];

  @ManyToOne(() => User, (user) => user.habits, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
