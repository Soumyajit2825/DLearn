import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { QuestionType } from '../../../entities/question.entity';

export class CreateQuestionDto {
  @ApiProperty()
  @IsString()
  questionText: string;

  @ApiProperty({ enum: QuestionType, default: QuestionType.MULTIPLE_CHOICE })
  @IsOptional()
  @IsEnum(QuestionType)
  questionType?: QuestionType;

  @ApiProperty({ required: false })
  @IsOptional()
  options?: any;

  @ApiProperty()
  @IsString()
  correctAnswer: string;

  @ApiProperty({ default: 1 })
  @IsOptional()
  @IsNumber()
  points?: number;

  @ApiProperty()
  @IsNumber()
  orderIndex: number;
}
