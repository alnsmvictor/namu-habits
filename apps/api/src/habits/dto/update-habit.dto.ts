import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateHabitDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsIn(['diário', 'semanal'])
  frequency?: string;

  @IsOptional()
  @IsIn(['saúde', 'exercício', 'alimentação', 'mental'])
  category?: string;
}
