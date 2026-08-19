export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'student' | 'instructor' | 'admin';
  avatar_url?: string;
  bio?: string;
  stellar_wallet?: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail_url?: string;
  instructor_id: string;
  instructor?: User;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  price: number;
  currency: 'XLM' | 'USDC';
  duration_hours: number;
  syllabus: Lesson[];
  published: boolean;
  rating: number;
  enrolled_count: number;
  created_at: string;
  updated_at: string;
}

export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  description: string;
  content_type: 'video' | 'article' | 'quiz';
  content_url?: string;
  duration_minutes: number;
  order_index: number;
  is_free: boolean;
  created_at: string;
}

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  course?: Course;
  progress: number;
  completed_lessons: number;
  total_lessons: number;
  started_at: string;
  completed_at?: string;
  certificate_id?: string;
  payment_tx_hash?: string;
}

export interface Assignment {
  id: string;
  course_id: string;
  course?: Course;
  title: string;
  description: string;
  due_date: string;
  max_score: number;
  submission?: Submission;
  created_at: string;
}

export interface Submission {
  id: string;
  assignment_id: string;
  user_id: string;
  content: string;
  file_url?: string;
  score?: number;
  feedback?: string;
  submitted_at: string;
  graded_at?: string;
}

export interface Quiz {
  id: string;
  course_id: string;
  lesson_id: string;
  title: string;
  description: string;
  time_limit_minutes?: number;
  passing_score: number;
  questions: Question[];
  created_at: string;
}

export interface Question {
  id: string;
  quiz_id: string;
  question_text: string;
  question_type: 'multiple_choice' | 'true_false' | 'short_answer';
  options?: string[];
  correct_answer: string;
  points: number;
  order_index: number;
}

export interface QuizAttempt {
  id: string;
  quiz_id: string;
  user_id: string;
  answers: Record<string, string>;
  score: number;
  total_possible: number;
  passed: boolean;
  started_at: string;
  completed_at?: string;
}

export interface Certificate {
  id: string;
  user_id: string;
  course_id: string;
  course?: Course;
  user?: User;
  certificate_hash: string;
  issued_at: string;
  metadata_uri?: string;
  verified: boolean;
}

export interface Wallet {
  id: string;
  user_id: string;
  public_key: string;
  wallet_type: 'stellar' | 'corsair';
  is_primary: boolean;
  balance?: string;
  created_at: string;
}

export interface Transaction {
  id: string;
  from_user_id?: string;
  to_user_id?: string;
  from_user?: User;
  to_user?: User;
  amount: string;
  currency: 'XLM' | 'USDC';
  transaction_type: 'enrollment' | 'payout' | 'reward' | 'refund';
  reference_type?: string;
  reference_id?: string;
  tx_hash?: string;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  link?: string;
  created_at: string;
}

export interface Integration {
  id: string;
  user_id: string;
  provider: 'stellar' | 'corsair' | 'discord' | 'github';
  enabled: boolean;
  config?: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}
