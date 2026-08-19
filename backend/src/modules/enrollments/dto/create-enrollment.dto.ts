import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEnrollmentDto {
  @ApiProperty()
  @IsString()
  courseId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  transactionId?: string;
}
