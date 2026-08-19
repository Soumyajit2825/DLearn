import { IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReplyDto {
  @ApiProperty()
  @IsUUID()
  discussionId: string;

  @ApiProperty()
  @IsString()
  content: string;
}
