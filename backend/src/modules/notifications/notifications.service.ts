import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../../entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
  ) {}

  async create(dto: CreateNotificationDto): Promise<Notification> {
    const notification = this.notificationsRepository.create(dto);
    return this.notificationsRepository.save(notification);
  }

  async findAll(userId: string, page = 1, limit = 20): Promise<{ data: Notification[]; total: number; unreadCount: number }> {
    const [data, total] = await this.notificationsRepository.findAndCount({
      where: { userId },
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    const unreadCount = await this.notificationsRepository.count({
      where: { userId, read: false },
    });

    return { data, total, unreadCount };
  }

  async markRead(id: string, userId: string): Promise<Notification> {
    await this.notificationsRepository.update({ id, userId }, { read: true });
    return this.notificationsRepository.findOne({ where: { id } }) as Promise<Notification>;
  }

  async markAllRead(userId: string): Promise<{ message: string }> {
    await this.notificationsRepository.update({ userId, read: false }, { read: true });
    return { message: 'All notifications marked as read' };
  }

  async getUnreadCount(userId: string): Promise<{ unreadCount: number }> {
    const count = await this.notificationsRepository.count({
      where: { userId, read: false },
    });
    return { unreadCount: count };
  }
}
