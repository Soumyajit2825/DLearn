import { PartialType } from '@nestjs/swagger';
import { ConnectIntegrationDto } from './connect-integration.dto';

export class UpdateIntegrationDto extends PartialType(ConnectIntegrationDto) {}
