import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssignmentSubmission, SubmissionStatus } from '../../entities/assignment-submission.entity';
import { Assignment } from '../../entities/assignment.entity';
import { Course } from '../../entities/course.entity';
import { Lesson } from '../../entities/lesson.entity';
import { SubmitAssignmentDto } from './dto/submit-assignment.dto';
import { GradeSubmissionDto } from './dto/grade-submission.dto';

@Injectable()
export class SubmissionsService {
  constructor(
    @InjectRepository(AssignmentSubmission)
    private submissionsRepository: Repository<AssignmentSubmission>,
    @InjectRepository(Assignment)
    private assignmentsRepository: Repository<Assignment>,
    @InjectRepository(Lesson)
    private lessonsRepository: Repository<Lesson>,
    @InjectRepository(Course)
    private coursesRepository: Repository<Course>,
  ) {}

  async submit(assignmentId: string, studentId: string, dto: SubmitAssignmentDto): Promise<AssignmentSubmission> {
    const assignment = await this.assignmentsRepository.findOne({ where: { id: assignmentId } });
    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    const existing = await this.submissionsRepository.findOne({
      where: { assignmentId, studentId },
    });

    if (existing) {
      existing.content = dto.content;
      if (dto.fileUrl) existing.fileUrl = dto.fileUrl;
      existing.status = SubmissionStatus.RESUBMITTED;
      return this.submissionsRepository.save(existing);
    }

    const submission = this.submissionsRepository.create({
      assignmentId,
      studentId,
      content: dto.content,
      fileUrl: dto.fileUrl,
      submittedAt: new Date(),
    });

    return this.submissionsRepository.save(submission);
  }

  async getSubmissions(assignmentId: string, userId: string): Promise<AssignmentSubmission[]> {
    const assignment = await this.assignmentsRepository.findOne({ where: { id: assignmentId } });
    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    const lesson = await this.lessonsRepository.findOne({ where: { id: assignment.lessonId } });
    const course = await this.coursesRepository.findOne({ where: { id: lesson?.courseId } });

    if (course && course.instructorId !== userId) {
      throw new ForbiddenException('Only instructors can view all submissions');
    }

    return this.submissionsRepository.find({
      where: { assignmentId },
      relations: { student: true },
      order: { submittedAt: 'DESC' },
    });
  }

  async grade(submissionId: string, dto: GradeSubmissionDto, userId: string): Promise<AssignmentSubmission> {
    const submission = await this.submissionsRepository.findOne({
      where: { id: submissionId },
      relations: { assignment: { lesson: { course: true } } },
    });

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    const course = submission.assignment.lesson.course;
    if (course.instructorId !== userId) {
      throw new ForbiddenException('Only instructors can grade submissions');
    }

    submission.score = dto.score;
    submission.feedback = dto.feedback ?? null;
    submission.status = SubmissionStatus.GRADED;
    submission.gradedAt = new Date();

    return this.submissionsRepository.save(submission);
  }
}
