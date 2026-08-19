import { IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateQuizDto {
  @ApiProperty()
  @IsString()
  lessonId: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ default: 70 })
  @IsOptional()
  @IsNumber()
  passingScore?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  timeLimit?: number;
}
