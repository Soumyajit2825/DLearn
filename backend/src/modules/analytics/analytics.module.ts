import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { Enrollment } from '../../entities/enrollment.entity';
import { QuizAttempt } from '../../entities/quiz-attempt.entity';
import { AssignmentSubmission } from '../../entities/assignment-submission.entity';
import { Course } from '../../entities/course.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Enrollment, QuizAttempt, AssignmentSubmission, Course])],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
