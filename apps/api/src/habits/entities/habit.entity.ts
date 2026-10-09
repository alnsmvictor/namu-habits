
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn} from 'typeorm';

@Entity('habits')
export class Habit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'enum', enum: ['diário', 'semanal', 'mensal'] })
  frequency: string;

  @Column({
    type: 'enum',
    enum: ['saúde', 'exercício', 'alimentação', 'mental'],
  })
  category: string;

  @CreateDateColumn({ name: 'created_at', nullable: true })
  createdAt: Date;
}
