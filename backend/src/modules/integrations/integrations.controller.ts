import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { IntegrationsService } from './integrations.service';
import { ConnectIntegrationDto } from './dto/connect-integration.dto';
import { UpdateIntegrationDto } from './dto/update-integration.dto';
import { JwtAuthGuard } from '../auth/auth.guard';

@ApiTags('Integrations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('integrations')
export class IntegrationsController {
  constructor(private readonly integrationsService: IntegrationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all integrations' })
  findAll(@Req() req) {
    return this.integrationsService.findAll(req.user.id);
  }

  @Post('connect')
  @ApiOperation({ summary: 'Connect a new integration' })
  connect(@Req() req, @Body() dto: ConnectIntegrationDto) {
    return this.integrationsService.connect(req.user.id, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an integration' })
  update(@Param('id') id: string, @Req() req, @Body() dto: UpdateIntegrationDto) {
    return this.integrationsService.update(id, req.user.id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an integration' })
  remove(@Param('id') id: string, @Req() req) {
    return this.integrationsService.remove(id, req.user.id);
  }

  @Post(':id/disconnect')
  @ApiOperation({ summary: 'Disconnect an integration' })
  disconnect(@Param('id') id: string, @Req() req) {
    return this.integrationsService.disconnect(id, req.user.id);
  }
}
