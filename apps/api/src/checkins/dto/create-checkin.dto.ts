import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateCheckinDto {
  @IsDateString()
  date: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
