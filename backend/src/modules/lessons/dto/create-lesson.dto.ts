import { IsString, IsOptional, IsNumber, IsBoolean, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { LessonType } from '../../../entities/lesson.entity';

export class CreateLessonDto {
  @ApiProperty()
  @IsString()
  courseId: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  videoUrl?: string;

  @ApiProperty({ default: 0 })
  @IsOptional()
  @IsNumber()
  duration?: number;

  @ApiProperty()
  @IsNumber()
  orderIndex: number;

  @ApiProperty({ enum: LessonType, default: LessonType.ARTICLE })
  @IsOptional()
  @IsEnum(LessonType)
  lessonType?: LessonType;

  @ApiProperty({ default: false })
  @IsOptional()
  @IsBoolean()
  published?: boolean;
}
