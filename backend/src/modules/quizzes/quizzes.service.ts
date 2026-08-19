import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quiz } from '../../entities/quiz.entity';
import { Lesson } from '../../entities/lesson.entity';
import { Course } from '../../entities/course.entity';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';

@Injectable()
export class QuizzesService {
  constructor(
    @InjectRepository(Quiz)
    private quizzesRepository: Repository<Quiz>,
    @InjectRepository(Lesson)
    private lessonsRepository: Repository<Lesson>,
    @InjectRepository(Course)
    private coursesRepository: Repository<Course>,
  ) {}

  async findByLesson(lessonId: string): Promise<Quiz[]> {
    return this.quizzesRepository.find({
      where: { lessonId },
      relations: { questions: true },
    });
  }

  async findOne(id: string): Promise<Quiz> {
    const quiz = await this.quizzesRepository.findOne({
      where: { id },
      relations: { questions: true, lesson: true },
    });
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }
    return quiz;
  }

  async create(dto: CreateQuizDto, userId: string): Promise<Quiz> {
    const lesson = await this.lessonsRepository.findOne({ where: { id: dto.lessonId } });
    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }
    const course = await this.coursesRepository.findOne({ where: { id: lesson.courseId } });
    if (!course || course.instructorId !== userId) {
      throw new ForbiddenException('You can only add quizzes to your own courses');
    }
    const quiz = this.quizzesRepository.create(dto);
    return this.quizzesRepository.save(quiz);
  }

  async update(id: string, dto: UpdateQuizDto, userId: string): Promise<Quiz> {
    const quiz = await this.findOne(id);
    const lesson = await this.lessonsRepository.findOne({ where: { id: quiz.lessonId } });
    const course = await this.coursesRepository.findOne({ where: { id: lesson?.courseId } });
    if (!course || course.instructorId !== userId) {
      throw new ForbiddenException('You can only update quizzes in your own courses');
    }
    await this.quizzesRepository.update(id, dto as any);
    return this.findOne(id);
  }

  async remove(id: string, userId: string): Promise<void> {
    const quiz = await this.findOne(id);
    const lesson = await this.lessonsRepository.findOne({ where: { id: quiz.lessonId } });
    const course = await this.coursesRepository.findOne({ where: { id: lesson?.courseId } });
    if (!course || course.instructorId !== userId) {
      throw new ForbiddenException('You can only delete quizzes in your own courses');
    }
    await this.quizzesRepository.delete(id);
  }
}
