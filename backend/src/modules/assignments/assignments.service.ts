import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Assignment } from '../../entities/assignment.entity';
import { Lesson } from '../../entities/lesson.entity';
import { Course } from '../../entities/course.entity';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';

@Injectable()
export class AssignmentsService {
  constructor(
    @InjectRepository(Assignment)
    private assignmentsRepository: Repository<Assignment>,
    @InjectRepository(Lesson)
    private lessonsRepository: Repository<Lesson>,
    @InjectRepository(Course)
    private coursesRepository: Repository<Course>,
  ) {}

  async findByLesson(lessonId: string): Promise<Assignment[]> {
    return this.assignmentsRepository.find({
      where: { lessonId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Assignment> {
    const assignment = await this.assignmentsRepository.findOne({
      where: { id },
      relations: { lesson: true },
    });
    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }
    return assignment;
  }

  async create(dto: CreateAssignmentDto, userId: string): Promise<Assignment> {
    const lesson = await this.lessonsRepository.findOne({ where: { id: dto.lessonId } });
    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }
    const course = await this.coursesRepository.findOne({ where: { id: lesson.courseId } });
    if (!course || course.instructorId !== userId) {
      throw new ForbiddenException('You can only add assignments to your own courses');
    }
    const assignment = this.assignmentsRepository.create(dto);
    return this.assignmentsRepository.save(assignment);
  }

  async update(id: string, dto: UpdateAssignmentDto, userId: string): Promise<Assignment> {
    const assignment = await this.findOne(id);
    const lesson = await this.lessonsRepository.findOne({ where: { id: assignment.lessonId } });
    const course = await this.coursesRepository.findOne({ where: { id: lesson?.courseId } });
    if (!course || course.instructorId !== userId) {
      throw new ForbiddenException('You can only update assignments in your own courses');
    }
    await this.assignmentsRepository.update(id, dto as any);
    return this.findOne(id);
  }

  async remove(id: string, userId: string): Promise<void> {
    const assignment = await this.findOne(id);
    const lesson = await this.lessonsRepository.findOne({ where: { id: assignment.lessonId } });
    const course = await this.coursesRepository.findOne({ where: { id: lesson?.courseId } });
    if (!course || course.instructorId !== userId) {
      throw new ForbiddenException('You can only delete assignments in your own courses');
    }
    await this.assignmentsRepository.delete(id);
  }
}
