import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from '../../entities/question.entity';
import { Quiz } from '../../entities/quiz.entity';
import { CreateQuestionDto } from './questions/create-question.dto';
import { UpdateQuestionDto } from './questions/update-question.dto';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private questionsRepository: Repository<Question>,
    @InjectRepository(Quiz)
    private quizzesRepository: Repository<Quiz>,
  ) {}

  async create(quizId: string, dto: CreateQuestionDto): Promise<Question> {
    const quiz = await this.quizzesRepository.findOne({ where: { id: quizId } });
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }
    const question = this.questionsRepository.create({ ...dto, quizId });
    return this.questionsRepository.save(question);
  }

  async update(id: string, dto: UpdateQuestionDto): Promise<Question> {
    const question = await this.questionsRepository.findOne({ where: { id } });
    if (!question) {
      throw new NotFoundException('Question not found');
    }
    await this.questionsRepository.update(id, dto as any);
    return this.questionsRepository.findOne({ where: { id } }) as Promise<Question>;
  }

  async remove(id: string): Promise<void> {
    const question = await this.questionsRepository.findOne({ where: { id } });
    if (!question) {
      throw new NotFoundException('Question not found');
    }
    await this.questionsRepository.delete(id);
  }
}
