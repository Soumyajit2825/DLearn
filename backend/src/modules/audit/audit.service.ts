import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from '../../entities/audit-log.entity';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private auditLogsRepository: Repository<AuditLog>,
  ) {}

  async log(action: string, entity: string, entityId?: string, userId?: string, metadata?: any, ipAddress?: string): Promise<AuditLog> {
    const log = this.auditLogsRepository.create({
      action,
      entity,
      entityId,
      userId,
      metadata,
      ipAddress,
    });
    return this.auditLogsRepository.save(log);
  }

  async findAll(page = 1, limit = 20): Promise<{ data: AuditLog[]; total: number }> {
    const [data, total] = await this.auditLogsRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },

    });
    return { data, total };
  }
}
