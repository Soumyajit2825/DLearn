import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, MoreThanOrEqual, LessThanOrEqual, Between } from 'typeorm';
import { Course } from '../../entities/course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { QueryCoursesDto } from './dto/query-courses.dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private coursesRepository: Repository<Course>,
  ) {}

  async create(dto: CreateCourseDto, instructorId: string): Promise<Course> {
    const course = this.coursesRepository.create({
      ...dto,
      instructorId,
    });
    return this.coursesRepository.save(course);
  }

  async findAll(query: QueryCoursesDto) {
    const { search, category, level, minPrice, maxPrice, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC' } = query;

    const where: any = { published: true };

    if (search) {
      where.title = Like(`%${search}%`);
    }
    if (category) {
      where.category = category;
    }
    if (level) {
      where.level = level;
    }
    if (minPrice !== undefined && maxPrice !== undefined) {
      where.price = Between(minPrice, maxPrice);
    } else if (minPrice !== undefined) {
      where.price = MoreThanOrEqual(minPrice);
    } else if (maxPrice !== undefined) {
      where.price = LessThanOrEqual(maxPrice);
    }

    const [data, total] = await this.coursesRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { [sortBy]: sortOrder },
      relations: { instructor: true },
    });

    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<Course> {
    const course = await this.coursesRepository.findOne({
      where: { id },
      relations: { instructor: true, lessons: true },
    });
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    return course;
  }

  async update(id: string, dto: UpdateCourseDto, userId: string): Promise<Course> {
    const course = await this.findOne(id);
    if (course.instructorId !== userId) {
      throw new ForbiddenException('You can only update your own courses');
    }
    await this.coursesRepository.update(id, dto as any);
    return this.findOne(id);
  }

  async remove(id: string, userId: string): Promise<void> {
    const course = await this.findOne(id);
    if (course.instructorId !== userId) {
      throw new ForbiddenException('You can only delete your own courses');
    }
    await this.coursesRepository.delete(id);
  }

  async publish(id: string, userId: string): Promise<Course> {
    const course = await this.findOne(id);
    if (course.instructorId !== userId) {
      throw new ForbiddenException('You can only publish your own courses');
    }
    course.published = true;
    return this.coursesRepository.save(course);
  }

  async getInstructorCourses(instructorId: string): Promise<Course[]> {
    return this.coursesRepository.find({
      where: { instructorId },
      order: { createdAt: 'DESC' },
    });
  }
}
