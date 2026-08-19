import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Discussion } from '../../entities/discussion.entity';
import { DiscussionReply } from '../../entities/discussion-reply.entity';
import { CreateDiscussionDto } from './dto/create-discussion.dto';
import { UpdateDiscussionDto } from './dto/update-discussion.dto';
import { CreateReplyDto } from './dto/create-reply.dto';

@Injectable()
export class DiscussionsService {
  constructor(
    @InjectRepository(Discussion)
    private discussionsRepository: Repository<Discussion>,
    @InjectRepository(DiscussionReply)
    private repliesRepository: Repository<DiscussionReply>,
  ) {}

  async create(userId: string, dto: CreateDiscussionDto): Promise<Discussion> {
    const discussion = this.discussionsRepository.create({
      userId,
      courseId: dto.courseId,
      title: dto.title,
      content: dto.content,
      pinned: dto.pinned || false,
    });
    return this.discussionsRepository.save(discussion);
  }

  async findAll(courseId?: string, page = 1, limit = 20): Promise<{ data: Discussion[]; total: number }> {
    const where: any = {};
    if (courseId) where.courseId = courseId;

    const [data, total] = await this.discussionsRepository.findAndCount({
      where,
      relations: { user: true },
      order: { pinned: 'DESC', createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total };
  }

  async findOne(id: string): Promise<Discussion> {
    const discussion = await this.discussionsRepository.findOne({
      where: { id },
      relations: { user: true, replies: { user: true } },
    });
    if (!discussion) throw new NotFoundException('Discussion not found');
    return discussion;
  }

  async update(id: string, userId: string, dto: UpdateDiscussionDto): Promise<Discussion> {
    const discussion = await this.findOne(id);
    if (discussion.userId !== userId) {
      throw new ForbiddenException('You can only edit your own discussions');
    }
    await this.discussionsRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string, userId: string): Promise<void> {
    const discussion = await this.findOne(id);
    if (discussion.userId !== userId) {
      throw new ForbiddenException('You can only delete your own discussions');
    }
    await this.repliesRepository.delete({ discussionId: id });
    await this.discussionsRepository.delete(id);
  }

  async addReply(userId: string, dto: CreateReplyDto): Promise<DiscussionReply> {
    const discussion = await this.findOne(dto.discussionId);
    const reply = this.repliesRepository.create({
      discussionId: dto.discussionId,
      userId,
      content: dto.content,
    });
    const saved = await this.repliesRepository.save(reply);
    await this.discussionsRepository.update(dto.discussionId, { replyCount: discussion.replyCount + 1 });
    return saved;
  }
}
