import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Course } from './course.entity';

@Entity('certificates')
export class Certificate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  studentId: string;

  @Column()
  courseId: string;

  @Column()
  enrollmentId: string;

  @Column({ unique: true })
  certificateHash: string;

  @Column()
  issuedAt: Date;

  @Column({ default: false })
  revoked: boolean;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @ManyToOne(() => User, (user) => user.certificates)
  @JoinColumn({ name: 'studentId' })
  student: User;

  @ManyToOne(() => Course, (course) => course.certificates)
  @JoinColumn({ name: 'courseId' })
  course: Course;
}
