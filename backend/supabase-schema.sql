-- DLearn Database Schema for Supabase
-- This is auto-generated from TypeORM entities
-- TypeORM synchronize=true will handle this automatically,
-- but this SQL is provided as a reference.

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom enum types
CREATE TYPE user_role AS ENUM ('student', 'instructor', 'admin');
CREATE TYPE lesson_type AS ENUM ('video', 'article', 'quiz', 'assignment');
CREATE TYPE enrollment_status AS ENUM ('active', 'completed', 'dropped');
CREATE TYPE submission_status AS ENUM ('submitted', 'graded', 'resubmitted');
CREATE TYPE question_type AS ENUM ('multiple_choice', 'true_false', 'short_answer');
CREATE TYPE notification_type AS ENUM ('enrollment', 'completion', 'certificate', 'payment', 'assignment', 'quiz', 'system');
CREATE TYPE transaction_type AS ENUM ('payment', 'payout', 'refund', 'deposit');
CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed');

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    "firstName" VARCHAR(255) NOT NULL,
    "lastName" VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'student',
    avatar VARCHAR(255),
    bio TEXT,
    "isEmailVerified" BOOLEAN DEFAULT false,
    "isOnboarded" BOOLEAN DEFAULT false,
    "stellarPublicKey" VARCHAR(255),
    "walletId" VARCHAR(255),
    "refreshToken" VARCHAR(255),
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "instructorId" UUID NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    "shortDescription" VARCHAR(255) NOT NULL,
    thumbnail VARCHAR(255),
    category VARCHAR(255) NOT NULL,
    level VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) DEFAULT 0,
    duration INTEGER DEFAULT 0,
    published BOOLEAN DEFAULT false,
    rating DECIMAL(3,2) DEFAULT 0,
    "enrollmentCount" INTEGER DEFAULT 0,
    tags TEXT[],
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Lessons table
CREATE TABLE IF NOT EXISTS lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "courseId" UUID NOT NULL REFERENCES courses(id),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    "videoUrl" VARCHAR(255),
    duration INTEGER DEFAULT 0,
    "orderIndex" INTEGER NOT NULL,
    "lessonType" lesson_type DEFAULT 'article',
    published BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Enrollments table
CREATE TABLE IF NOT EXISTS enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "studentId" UUID NOT NULL REFERENCES users(id),
    "courseId" UUID NOT NULL REFERENCES courses(id),
    progress DECIMAL(5,2) DEFAULT 0,
    "startedAt" TIMESTAMP,
    "completedAt" TIMESTAMP,
    status enrollment_status DEFAULT 'active',
    "transactionId" VARCHAR(255),
    "certificateId" VARCHAR(255),
    "createdAt" TIMESTAMP DEFAULT NOW()
);

-- Assignments table
CREATE TABLE IF NOT EXISTS assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "lessonId" UUID NOT NULL REFERENCES lessons(id),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    "dueDate" TIMESTAMP,
    "maxScore" INTEGER NOT NULL,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Assignment submissions table
CREATE TABLE IF NOT EXISTS assignment_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "assignmentId" UUID NOT NULL REFERENCES assignments(id),
    "studentId" UUID NOT NULL REFERENCES users(id),
    content TEXT NOT NULL,
    "fileUrl" VARCHAR(255),
    score INTEGER,
    feedback TEXT,
    status submission_status DEFAULT 'submitted',
    "submittedAt" TIMESTAMP DEFAULT NOW(),
    "gradedAt" TIMESTAMP
);

-- Quizzes table
CREATE TABLE IF NOT EXISTS quizzes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "lessonId" UUID NOT NULL REFERENCES lessons(id),
    title VARCHAR(255) NOT NULL,
    "passingScore" INTEGER DEFAULT 70,
    "timeLimit" INTEGER,
    "createdAt" TIMESTAMP DEFAULT NOW()
);

-- Questions table
CREATE TABLE IF NOT EXISTS questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "quizId" UUID NOT NULL REFERENCES quizzes(id),
    "questionText" TEXT NOT NULL,
    "questionType" question_type DEFAULT 'multiple_choice',
    options JSONB,
    "correctAnswer" TEXT NOT NULL,
    points INTEGER DEFAULT 1,
    "orderIndex" INTEGER NOT NULL
);

-- Quiz attempts table
CREATE TABLE IF NOT EXISTS quiz_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "quizId" UUID NOT NULL REFERENCES quizzes(id),
    "studentId" UUID NOT NULL REFERENCES users(id),
    score INTEGER NOT NULL,
    "maxScore" INTEGER NOT NULL,
    passed BOOLEAN NOT NULL,
    answers JSONB NOT NULL,
    "startedAt" TIMESTAMP NOT NULL,
    "completedAt" TIMESTAMP NOT NULL
);

-- Discussions table
CREATE TABLE IF NOT EXISTS discussions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" UUID NOT NULL REFERENCES users(id),
    "courseId" UUID NOT NULL REFERENCES courses(id),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    pinned BOOLEAN DEFAULT false,
    "replyCount" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Discussion replies table
CREATE TABLE IF NOT EXISTS discussion_replies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "discussionId" UUID NOT NULL REFERENCES discussions(id),
    "userId" UUID NOT NULL REFERENCES users(id),
    content TEXT NOT NULL,
    "createdAt" TIMESTAMP DEFAULT NOW()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" UUID NOT NULL REFERENCES users(id),
    type notification_type NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    data JSONB,
    "createdAt" TIMESTAMP DEFAULT NOW()
);

-- Certificates table
CREATE TABLE IF NOT EXISTS certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "studentId" UUID NOT NULL REFERENCES users(id),
    "courseId" UUID NOT NULL REFERENCES courses(id),
    "enrollmentId" VARCHAR(255) NOT NULL,
    "certificateHash" VARCHAR(255) UNIQUE NOT NULL,
    "issuedAt" TIMESTAMP NOT NULL,
    revoked BOOLEAN DEFAULT false,
    metadata JSONB
);

-- Wallets table
CREATE TABLE IF NOT EXISTS wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" UUID NOT NULL REFERENCES users(id),
    "stellarPublicKey" VARCHAR(255) NOT NULL,
    "stellarSecretKey" VARCHAR(255) NOT NULL,
    balance DECIMAL(20,7) DEFAULT 0,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "walletId" UUID NOT NULL REFERENCES wallets(id),
    "userId" UUID NOT NULL REFERENCES users(id),
    type transaction_type NOT NULL,
    amount DECIMAL(20,7) NOT NULL,
    asset VARCHAR(255) DEFAULT 'XLM',
    status transaction_status DEFAULT 'pending',
    "stellarTxHash" VARCHAR(255),
    reference VARCHAR(255),
    description VARCHAR(255),
    "createdAt" TIMESTAMP DEFAULT NOW()
);

-- Integrations table
CREATE TABLE IF NOT EXISTS integrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" UUID NOT NULL REFERENCES users(id),
    provider VARCHAR(255) NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT,
    "expiresAt" TIMESTAMP,
    enabled BOOLEAN DEFAULT true,
    settings JSONB,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" VARCHAR(255),
    action VARCHAR(255) NOT NULL,
    entity VARCHAR(255) NOT NULL,
    "entityId" VARCHAR(255),
    metadata JSONB,
    "ipAddress" VARCHAR(255),
    "createdAt" TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_courses_instructor ON courses("instructorId");
CREATE INDEX idx_lessons_course ON lessons("courseId");
CREATE INDEX idx_enrollments_student ON enrollments("studentId");
CREATE INDEX idx_enrollments_course ON enrollments("courseId");
CREATE INDEX idx_certificates_student ON certificates("studentId");
CREATE INDEX idx_certificates_hash ON certificates("certificateHash");
CREATE INDEX idx_notifications_user ON notifications("userId");
CREATE INDEX idx_transactions_user ON transactions("userId");
CREATE INDEX idx_transactions_wallet ON transactions("walletId");
CREATE INDEX idx_discussions_course ON discussions("courseId");
CREATE INDEX idx_wallets_user ON wallets("userId");
