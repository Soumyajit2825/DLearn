import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Integration } from '../../entities/integration.entity';
import { ConnectIntegrationDto } from './dto/connect-integration.dto';
import { UpdateIntegrationDto } from './dto/update-integration.dto';

@Injectable()
export class IntegrationsService {
  constructor(
    @InjectRepository(Integration)
    private integrationsRepository: Repository<Integration>,
  ) {}

  async findAll(userId: string): Promise<Integration[]> {
    return this.integrationsRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async connect(userId: string, dto: ConnectIntegrationDto): Promise<Integration> {
    const existing = await this.integrationsRepository.findOne({
      where: { userId, provider: dto.provider },
    });

    if (existing) {
      existing.accessToken = dto.accessToken;
      if (dto.refreshToken) existing.refreshToken = dto.refreshToken;
      if (dto.expiresAt) existing.expiresAt = dto.expiresAt;
      if (dto.settings) existing.settings = dto.settings;
      existing.enabled = true;
      return this.integrationsRepository.save(existing);
    }

    const integration = this.integrationsRepository.create({
      userId,
      ...dto,
    });
    return this.integrationsRepository.save(integration);
  }

  async update(id: string, userId: string, dto: UpdateIntegrationDto): Promise<Integration> {
    const integration = await this.integrationsRepository.findOne({ where: { id, userId } });
    if (!integration) {
      throw new NotFoundException('Integration not found');
    }
    await this.integrationsRepository.update(id, dto as any);
    return this.integrationsRepository.findOne({ where: { id } }) as Promise<Integration>;
  }

  async remove(id: string, userId: string): Promise<void> {
    const integration = await this.integrationsRepository.findOne({ where: { id, userId } });
    if (!integration) {
      throw new NotFoundException('Integration not found');
    }
    await this.integrationsRepository.delete(id);
  }

  async disconnect(id: string, userId: string): Promise<Integration> {
    const integration = await this.integrationsRepository.findOne({ where: { id, userId } });
    if (!integration) {
      throw new NotFoundException('Integration not found');
    }
    integration.enabled = false;
    return this.integrationsRepository.save(integration);
  }
}
