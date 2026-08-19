import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizzesController } from './quizzes.controller';
import { QuestionsController } from './questions.controller';
import { AttemptsController } from './attempts.controller';
import { QuizzesService } from './quizzes.service';
import { QuestionsService } from './questions.service';
import { AttemptsService } from './attempts.service';
import { Quiz } from '../../entities/quiz.entity';
import { Question } from '../../entities/question.entity';
import { QuizAttempt } from '../../entities/quiz-attempt.entity';
import { Lesson } from '../../entities/lesson.entity';
import { Course } from '../../entities/course.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Quiz, Question, QuizAttempt, Lesson, Course])],
  controllers: [QuizzesController, QuestionsController, AttemptsController],
  providers: [QuizzesService, QuestionsService, AttemptsService],
  exports: [QuizzesService, QuestionsService, AttemptsService],
})
export class QuizzesModule {}
