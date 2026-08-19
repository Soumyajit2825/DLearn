import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Enrollment } from './enrollment.entity';
import { Certificate } from './certificate.entity';
import { Notification } from './notification.entity';
import { Transaction } from './transaction.entity';
import { Wallet } from './wallet.entity';
import { Course } from './course.entity';
import { QuizAttempt } from './quiz-attempt.entity';
import { AssignmentSubmission } from './assignment-submission.entity';
import { Integration } from './integration.entity';
import { Discussion } from './discussion.entity';
import { DiscussionReply } from './discussion-reply.entity';

export enum UserRole {
  STUDENT = 'student',
  INSTRUCTOR = 'instructor',
  ADMIN = 'admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.STUDENT })
  role: UserRole;

  @Column({ nullable: true })
  avatar: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ default: false })
  isOnboarded: boolean;

  @Column({ nullable: true })
  stellarPublicKey: string;

  @Column({ nullable: true })
  walletId: string;

  @Column({ nullable: true })
  refreshToken: string;

  get full_name(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.student)
  enrollments: Enrollment[];

  @OneToMany(() => Certificate, (certificate) => certificate.student)
  certificates: Certificate[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];

  @OneToMany(() => Wallet, (wallet) => wallet.user)
  wallets: Wallet[];

  @OneToMany(() => Course, (course) => course.instructor)
  courses: Course[];

  @OneToMany(() => QuizAttempt, (attempt) => attempt.student)
  quizAttempts: QuizAttempt[];

  @OneToMany(() => AssignmentSubmission, (submission) => submission.student)
  assignmentSubmissions: AssignmentSubmission[];

  @OneToMany(() => Integration, (integration) => integration.user)
  integrations: Integration[];

  @OneToMany(() => Discussion, (discussion) => discussion.user)
  discussions: Discussion[];

  @OneToMany(() => DiscussionReply, (reply) => reply.user)
  discussionReplies: DiscussionReply[];
}
