import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Enrollment, EnrollmentStatus } from '../../entities/enrollment.entity';
import { QuizAttempt } from '../../entities/quiz-attempt.entity';
import { AssignmentSubmission } from '../../entities/assignment-submission.entity';
import { Course } from '../../entities/course.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Enrollment)
    private enrollmentsRepository: Repository<Enrollment>,
    @InjectRepository(QuizAttempt)
    private quizAttemptsRepository: Repository<QuizAttempt>,
    @InjectRepository(AssignmentSubmission)
    private submissionsRepository: Repository<AssignmentSubmission>,
    @InjectRepository(Course)
    private coursesRepository: Repository<Course>,
  ) {}

  async getStudentStats(studentId: string) {
    const enrollments = await this.enrollmentsRepository.find({
      where: { studentId },
      relations: { course: true },
    });

    const completedCourses = enrollments.filter((e) => e.status === EnrollmentStatus.COMPLETED).length;
    const totalHours = enrollments.reduce((sum, e) => sum + (e.course?.duration || 0), 0);

    const quizAttempts = await this.quizAttemptsRepository.find({
      where: { studentId },
    });
    const avgScore = quizAttempts.length
      ? Math.round(quizAttempts.reduce((sum, q) => sum + q.score, 0) / quizAttempts.length)
      : 0;

    const submissions = await this.submissionsRepository.find({
      where: { studentId },
    });
    const avgAssignmentScore = submissions.length
      ? Math.round(submissions.reduce((sum, s) => sum + (s.score || 0), 0) / submissions.length)
      : 0;

    return {
      totalEnrollments: enrollments.length,
      completedCourses,
      inProgressCourses: enrollments.filter((e) => e.status === EnrollmentStatus.ACTIVE).length,
      totalHours,
      quizAverageScore: avgScore,
      assignmentAverageScore: avgAssignmentScore,
      enrollments,
    };
  }

  async getInstructorStats(instructorId: string) {
    const courses = await this.coursesRepository.find({
      where: { instructorId },
    });

    const courseIds = courses.map((c) => c.id);
    const totalStudents = await this.enrollmentsRepository.count({
      where: courseIds.length ? { courseId: In(courseIds) } : { courseId: '' },
    });

    const totalRevenue = courses.reduce((sum, c) => sum + Number(c.price || 0), 0);

    return {
      totalCourses: courses.length,
      publishedCourses: courses.filter((c) => c.published).length,
      totalStudents,
      totalRevenue,
      averageRating: courses.length
        ? courses.reduce((sum, c) => sum + Number(c.rating || 0), 0) / courses.length
        : 0,
      courses,
    };
  }
}
