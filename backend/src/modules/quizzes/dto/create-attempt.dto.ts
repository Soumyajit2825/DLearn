import { IsArray, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAttemptDto {
  @ApiProperty({ type: 'object', additionalProperties: true })
  @IsObject()
  answers: Record<string, any>;
}
