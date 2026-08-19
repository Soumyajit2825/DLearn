import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Quiz } from './quiz.entity';
import { User } from './user.entity';

@Entity('quiz_attempts')
export class QuizAttempt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  quizId: string;

  @Column()
  studentId: string;

  @Column()
  score: number;

  @Column()
  maxScore: number;

  @Column()
  passed: boolean;

  @Column({ type: 'jsonb' })
  answers: any;

  @Column()
  startedAt: Date;

  @Column()
  completedAt: Date;

  @ManyToOne(() => Quiz, (quiz) => quiz.attempts)
  @JoinColumn({ name: 'quizId' })
  quiz: Quiz;

  @ManyToOne(() => User, (user) => user.quizAttempts)
  @JoinColumn({ name: 'studentId' })
  student: User;
}
