import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Discussion } from './discussion.entity';

@Entity('discussion_replies')
export class DiscussionReply {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  discussionId: string;

  @Column()
  userId: string;

  @Column({ type: 'text' })
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Discussion, (discussion) => discussion.replies)
  @JoinColumn({ name: 'discussionId' })
  discussion: Discussion;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;
}
