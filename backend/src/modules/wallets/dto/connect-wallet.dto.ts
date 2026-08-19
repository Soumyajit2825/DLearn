import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConnectWalletDto {
  @ApiProperty()
  @IsString()
  stellarPublicKey: string;

  @ApiProperty()
  @IsString()
  stellarSecretKey: string;
}
