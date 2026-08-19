import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class IssueCertificateDto {
  @ApiProperty()
  @IsString()
  studentId: string;

  @ApiProperty()
  @IsString()
  courseId: string;

  @ApiProperty()
  @IsString()
  enrollmentId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  metadata?: any;
}
