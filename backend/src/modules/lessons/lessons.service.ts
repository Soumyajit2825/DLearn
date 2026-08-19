import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Lesson } from '../../entities/lesson.entity';
import { Course } from '../../entities/course.entity';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lesson)
    private lessonsRepository: Repository<Lesson>,
    @InjectRepository(Course)
    private coursesRepository: Repository<Course>,
  ) {}

  async findByCourse(courseId: string): Promise<Lesson[]> {
    return this.lessonsRepository.find({
      where: { courseId, published: true },
      order: { orderIndex: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Lesson> {
    const lesson = await this.lessonsRepository.findOne({ where: { id }, relations: { course: true } });
    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }
    return lesson;
  }

  async create(dto: CreateLessonDto, userId: string): Promise<Lesson> {
    const course = await this.coursesRepository.findOne({ where: { id: dto.courseId } });
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    if (course.instructorId !== userId) {
      throw new ForbiddenException('You can only add lessons to your own courses');
    }
    const lesson = this.lessonsRepository.create(dto);
    return this.lessonsRepository.save(lesson);
  }

  async update(id: string, dto: UpdateLessonDto, userId: string): Promise<Lesson> {
    const lesson = await this.findOne(id);
    const course = await this.coursesRepository.findOne({ where: { id: lesson.courseId } });
    if (!course || course.instructorId !== userId) {
      throw new ForbiddenException('You can only update lessons in your own courses');
    }
    await this.lessonsRepository.update(id, dto as any);
    return this.findOne(id);
  }

  async remove(id: string, userId: string): Promise<void> {
    const lesson = await this.findOne(id);
    const course = await this.coursesRepository.findOne({ where: { id: lesson.courseId } });
    if (!course || course.instructorId !== userId) {
      throw new ForbiddenException('You can only delete lessons in your own courses');
    }
    await this.lessonsRepository.delete(id);
  }

  async reorder(items: { id: string; orderIndex: number }[]): Promise<Lesson[]> {
    const promises = items.map((item) =>
      this.lessonsRepository.update(item.id, { orderIndex: item.orderIndex }),
    );
    await Promise.all(promises);
    return this.lessonsRepository.findBy({ id: In(items.map((i) => i.id)) });
  }
}
