import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssignmentsController } from './assignments.controller';
import { SubmissionsController } from './submissions.controller';
import { AssignmentsService } from './assignments.service';
import { SubmissionsService } from './submissions.service';
import { Assignment } from '../../entities/assignment.entity';
import { AssignmentSubmission } from '../../entities/assignment-submission.entity';
import { Lesson } from '../../entities/lesson.entity';
import { Course } from '../../entities/course.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Assignment, AssignmentSubmission, Lesson, Course])],
  controllers: [AssignmentsController, SubmissionsController],
  providers: [AssignmentsService, SubmissionsService],
  exports: [AssignmentsService, SubmissionsService],
})
export class AssignmentsModule {}
