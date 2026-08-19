import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuizAttempt } from '../../entities/quiz-attempt.entity';
import { Quiz } from '../../entities/quiz.entity';
import { Question } from '../../entities/question.entity';
import { CreateAttemptDto } from './dto/create-attempt.dto';

@Injectable()
export class AttemptsService {
  constructor(
    @InjectRepository(QuizAttempt)
    private attemptsRepository: Repository<QuizAttempt>,
    @InjectRepository(Quiz)
    private quizzesRepository: Repository<Quiz>,
    @InjectRepository(Question)
    private questionsRepository: Repository<Question>,
  ) {}

  async attempt(quizId: string, studentId: string, dto: CreateAttemptDto): Promise<QuizAttempt> {
    const quiz = await this.quizzesRepository.findOne({
      where: { id: quizId },
      relations: { questions: true },
    });
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    const questions = await this.questionsRepository.find({
      where: { quizId },
      order: { orderIndex: 'ASC' },
    });

    let score = 0;
    let maxScore = 0;

    for (const question of questions) {
      maxScore += question.points;
      const userAnswer = dto.answers[question.id];
      if (userAnswer && userAnswer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim()) {
        score += question.points;
      }
    }

    const passed = (score / maxScore) * 100 >= quiz.passingScore;

    const attempt = this.attemptsRepository.create({
      quizId,
      studentId,
      score,
      maxScore,
      passed,
      answers: dto.answers,
      startedAt: new Date(Date.now() - 60000),
      completedAt: new Date(),
    });

    return this.attemptsRepository.save(attempt);
  }

  async findOne(id: string): Promise<QuizAttempt> {
    const attempt = await this.attemptsRepository.findOne({
      where: { id },
      relations: { quiz: true, student: true },
    });
    if (!attempt) {
      throw new NotFoundException('Attempt not found');
    }
    return attempt;
  }

  async getMyAttempts(quizId: string, studentId: string): Promise<QuizAttempt[]> {
    return this.attemptsRepository.find({
      where: { quizId, studentId },
      order: { completedAt: 'DESC' },
    });
  }
}
