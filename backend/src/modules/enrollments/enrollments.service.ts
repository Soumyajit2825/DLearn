import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enrollment, EnrollmentStatus } from '../../entities/enrollment.entity';
import { Course } from '../../entities/course.entity';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectRepository(Enrollment)
    private enrollmentsRepository: Repository<Enrollment>,
    @InjectRepository(Course)
    private coursesRepository: Repository<Course>,
  ) {}

  async enroll(studentId: string, dto: CreateEnrollmentDto): Promise<Enrollment> {
    const course = await this.coursesRepository.findOne({ where: { id: dto.courseId } });
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const existing = await this.enrollmentsRepository.findOne({
      where: { studentId, courseId: dto.courseId },
    });
    if (existing) {
      throw new ConflictException('Already enrolled in this course');
    }

    const enrollment = this.enrollmentsRepository.create({
      studentId,
      courseId: dto.courseId,
      transactionId: dto.transactionId,
      startedAt: new Date(),
    });

    await this.coursesRepository.update(dto.courseId, {
      enrollmentCount: course.enrollmentCount + 1,
    });

    return this.enrollmentsRepository.save(enrollment);
  }

  async getMyEnrollments(studentId: string): Promise<Enrollment[]> {
    return this.enrollmentsRepository.find({
      where: { studentId },
      relations: { course: true },
      order: { createdAt: 'DESC' },
    });
  }

  async getCourseEnrollments(courseId: string): Promise<Enrollment[]> {
    return this.enrollmentsRepository.find({
      where: { courseId },
      relations: { student: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Enrollment> {
    const enrollment = await this.enrollmentsRepository.findOne({
      where: { id },
      relations: { course: true, student: true },
    });
    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }
    return enrollment;
  }

  async updateProgress(id: string, dto: UpdateProgressDto, studentId: string): Promise<Enrollment> {
    const enrollment = await this.findOne(id);
    if (enrollment.studentId !== studentId) {
      throw new NotFoundException('Enrollment not found');
    }

    enrollment.progress = dto.progress;

    if (dto.progress >= 100) {
      enrollment.status = EnrollmentStatus.COMPLETED;
      enrollment.completedAt = new Date();
    }

    return this.enrollmentsRepository.save(enrollment);
  }
}
