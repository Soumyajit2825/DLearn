import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../../entities/user.entity';
import { Course } from '../../entities/course.entity';
import { Transaction } from '../../entities/transaction.entity';
import { AuditLog } from '../../entities/audit-log.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Course)
    private coursesRepository: Repository<Course>,
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
    @InjectRepository(AuditLog)
    private auditLogsRepository: Repository<AuditLog>,
  ) {}

  async getDashboardStats(): Promise<{
    totalUsers: number;
    totalInstructors: number;
    totalStudents: number;
    totalCourses: number;
    totalPublishedCourses: number;
    totalTransactions: number;
    totalRevenue: number;
  }> {
    const totalUsers = await this.usersRepository.count();
    const totalInstructors = await this.usersRepository.count({ where: { role: UserRole.INSTRUCTOR } });
    const totalStudents = await this.usersRepository.count({ where: { role: UserRole.STUDENT } });
    const totalCourses = await this.coursesRepository.count();
    const totalPublishedCourses = await this.coursesRepository.count({ where: { published: true } });
    const totalTransactions = await this.transactionsRepository.count();

    const transactions = await this.transactionsRepository.find({ where: { status: 'completed' as any } });
    const totalRevenue = transactions.reduce((sum, t) => sum + Number(t.amount), 0);

    return {
      totalUsers,
      totalInstructors,
      totalStudents,
      totalCourses,
      totalPublishedCourses,
      totalTransactions,
      totalRevenue,
    };
  }

  async getUsers(page = 1, limit = 10) {
    const [data, total] = await this.usersRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return { data, total };
  }

  async getCourses(page = 1, limit = 10) {
    const [data, total] = await this.coursesRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
      relations: { instructor: true },
    });
    return { data, total };
  }

  async getTransactions(page = 1, limit = 10) {
    const [data, total] = await this.transactionsRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
      relations: { user: true, wallet: true },
    });
    return { data, total };
  }

  async getAuditLogs(page = 1, limit = 20) {
    const [data, total] = await this.auditLogsRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return { data, total };
  }

  async banUser(userId: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }
    user.role = UserRole.STUDENT;
    return this.usersRepository.save(user);
  }
}
