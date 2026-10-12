import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateHabitDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsIn(['MANHA', 'TARDE', 'NOITE'])
  period: string;

  @IsIn(['diário', 'semanal'])
  frequency: string;

  @IsIn(['saúde', 'exercício', 'alimentação', 'mental'])
  category: string;
}
