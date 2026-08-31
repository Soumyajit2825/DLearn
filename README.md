# DLearn — Decentralized Learning & Credentialing Platform

A decentralized Web3 learning platform where learners purchase courses using **Stellar (XLM)**, earn tamper-proof verifiable on-chain certificates and academic credentials through **Soroban smart contracts**, and automate educational workflows with **Corsair**.

Traditional education platforms suffer from walled-garden credentials, expensive and fragmented payment gateways, manual verification hurdles, and siloed collaboration tools. DLearn replaces these friction points with frictionless Stellar micropayments, trustless on-chain credential registries, instant public verification, and seamless third-party automations — all settled on Stellar.

---

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Smart Contracts](#smart-contracts)
- [Frontend ↔ Smart Contract Integration](#frontend--smart-contract-integration)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Deploying the Contracts](#deploying-the-contracts)
- [Roadmap](#roadmap)
- [License](#license)

---

## Features

- **Decentralized Course Marketplace** — Discover, filter, and enroll in interactive, modular courses published by verified instructors.
- **Stellar Native Payments** — Direct XLM course purchases via connected **Freighter Wallet**, with automatic platform fee deduction and instructor escrow.
- **Verifiable Soroban Credentials** — Immutable certificates and academic credentials minted and recorded on Soroban smart contracts.
- **Public Verification Portal** — Instant, cryptographic certificate verification via public URL or QR code checking against SHA-256 hashes and on-chain records.
- **Modular Learning & Assessments** — Canvas-style interactive lesson viewer, video players, quizzes with instant grading, and assignment submissions.
- **Instructor Economy & Payouts** — Dedicated instructor portal for authoring courses, designing quizzes, tracking student performance, and withdrawing earnings.
- **Learner Rewards & Incentives** — Smart-contract-driven achievement badges and reward tokens claimable upon milestone completion.
- **Corsair Automated Workflows** — Trigger automated GitHub Classroom repo creation, Google Calendar schedule sync, Discord/Slack community invitations, and certificate email alerts.
- **Discussion Forums & Peer Collaboration** — Context-aware Q&A forums per course module with upvotes, instructor badges, and real-time updates.
- **Enterprise-Grade Role Architecture** — Granular RBAC supporting Students, Instructors, Educational Institutions, and Platform Administrators.

---

## Architecture

```
┌─────────────────────────┐          ┌──────────────────────────┐          ┌─────────────────────────┐
│     Frontend            │   REST   │      Backend             │   RPC    │    Stellar Network      │
│   Next.js 16 (React 19) │ ───────► │      NestJS 10           │ ───────► │  Soroban RPC + Horizon  │
│   Freighter Wallet      │   JWT    │  PostgreSQL (TypeORM)    │          │  5 Soroban Smart        │
│   Lucide UI / Tailwind  │ ◄─────── │  Auth / RBAC / Gateway   │ ◄─────── │  Contracts              │
└─────────────────────────┘          └──────────────────────────┘          └─────────────────────────┘
             │                                     │                                    │
             │ Stellar Horizon                     │ Webhooks & APIs                    │ On-Chain State
             │ Native XLM Payments                 │ Corsair Engine                     │ & Verifications
             ▼                                     ▼                                    ▼
      Learner Wallets                     External Ecosystem                    Soroban Registries
   (Balances & Receipts)              (GitHub, Gmail, Slack, LMS)          (Certificates, Enrollments)
```

**User Flow:** Learner connects Freighter wallet → Explores course catalog → Signs XLM payment on Stellar testnet → Backend registers enrollment and synchronizes with Soroban `EnrollmentContract` → Learner finishes lessons and passes quizzes → `CertificateContract` and `CompletionContract` mint cryptographic certificate on-chain → Corsair dispatches email certificates, Google Calendar deadlines, and GitHub repos.

---

## Smart Contracts

DLearn deploys a modular suite of **5 Soroban smart contracts** written in Rust using the `soroban-sdk` (v20+), compiled for the `wasm32v1-none` target.

### Deployed Contracts (Stellar Testnet)

| Contract | Testnet Contract Address | Explorer Link |
|---|---|---|
| **EnrollmentContract** | `CDU77LF7ENAMW2563MXU547GPC5V533RVQ5I6PL2G7LXVDI3SAGQXZ4L` | [Stellar Lab](https://lab.stellar.org/r/testnet/contract/CDU77LF7ENAMW2563MXU547GPC5V533RVQ5I6PL2G7LXVDI3SAGQXZ4L) |
| **CertificateContract** | `CD5QYK7KCARW7JNK6YM2XIGKYRYJ2G5YW33HL6RMQCSP4EJQPBGUWPXG` | [Stellar Lab](https://lab.stellar.org/r/testnet/contract/CD5QYK7KCARW7JNK6YM2XIGKYRYJ2G5YW33HL6RMQCSP4EJQPBGUWPXG) |
| **CompletionContract** | `CCK2XJUKYMNLBPXL6YRCUY2APX6UK3PTKP2Q5B6B2V4YL4GYSBPFCCH7` | [Stellar Lab](https://lab.stellar.org/r/testnet/contract/CCK2XJUKYMNLBPXL6YRCUY2APX6UK3PTKP2Q5B6B2V4YL4GYSBPFCCH7) |
| **VerificationContract** | `CAOFTOKW3O5GAXHXC5FMOMEXYH3STRMEAM7AXMII6BJHDCQPISF4HOA6` | [Stellar Lab](https://lab.stellar.org/r/testnet/contract/CAOFTOKW3O5GAXHXC5FMOMEXYH3STRMEAM7AXMII6BJHDCQPISF4HOA6) |
| **RewardContract** | `CB7ZCDL4NSX7TVRJJPL6JESJ4K5QDLF3W2QPBL4MCHRY7JLOJ2N5PHNV` | [Stellar Lab](https://lab.stellar.org/r/testnet/contract/CB7ZCDL4NSX7TVRJJPL6JESJ4K5QDLF3W2QPBL4MCHRY7JLOJ2N5PHNV) |

**Deployer Address:** `GC5SM6R2DOOHGUN55J7O33ZDSTI33IEOM7VY3F4ZNSKRJAAQSWLWZIRE`

---

### Contract Functions Overview

#### 1. `EnrollmentContract`
- `init(admin: Address)` — Initializes contract admin.
- `enroll(student: Address, course_id: u32)` — Records a new verified student enrollment.
- `get_enrollment(student: Address) -> Option<Enrollment>` — Queries enrollment status, timestamp, and progress.
- `update_progress(student: Address, progress: u32)` — Updates milestone percentage.
- `mark_completed(student: Address, certificate_id: Symbol)` — Sets enrollment status to completed with certificate linkage.

#### 2. `CertificateContract`
- `init(admin: Address)` — Initializes contract admin.
- `issue(admin: Address, student: Address, course_id: u32, course_name: String, grade: String, hash: String) -> Symbol` — Issues on-chain certificate with SHA-256 hash.
- `verify(certificate_id: Symbol) -> Option<Certificate>` — Resolves certificate details, student address, and issuance timestamp.
- `revoke(admin: Address, certificate_id: Symbol)` — Marks certificate as revoked if compromised.
- `get_student_certificates(student: Address) -> Vec<Certificate>` — Returns all credentials owned by a student.

#### 3. `CompletionContract`
- `record_completion(instructor: Address, student: Address, course_id: u32, score: u32, max_score: u32, passed: bool, quiz_results: Map<Symbol, u32>)` — Attests academic course completion and quiz score breakdown.
- `get_completion(student: Address, course_id: u32) -> Option<Completion>` — Reads completion grade and verification status.

#### 4. `VerificationContract`
- `issue_credential(issuer: Address, subject: Address, credential_type: String, expires_at: Option<u64>, metadata: String) -> Symbol` — Emits custom educational credentials.
- `verify_credential(credential_id: Symbol) -> Option<Credential>` — Read-only entitlement & credential verification.
- `verify_by_metadata(metadata: String) -> Option<Credential>` — Looks up credentials by embedded hash/metadata.

#### 5. `RewardContract`
- `award_reward(admin: Address, student: Address, reward_type: Symbol, amount: i128) -> u32` — Grants achievement tokens/scholarships.
- `claim_reward(student: Address, reward_id: u32)` — Claims reward payout to student's Stellar address.

---

## Frontend ↔ Smart Contract Integration

DLearn uses a hybrid architecture combining fast Web2 database responsiveness with immutable Web3 on-chain settlement and verification.

### Integration Flow

```
1. WALLET CONNECTION & AUTH
   ├─ Learner connects Freighter extension → Retrieves Stellar Public Key (G...)
   ├─ Queries account balance & reserves via Horizon REST API
   └─ Requests auth challenge → Signs payload with Freighter → Obtains NestJS JWT

2. COURSE PURCHASE & ENROLLMENT
   ├─ Learner clicks "Enroll with XLM"
   ├─ Freighter builds & signs Stellar Payment Operation to Treasury Wallet
   ├─ Transaction submitted to Stellar Horizon → Receives txHash
   ├─ Backend validates txHash on Horizon → Credits course enrollment in DB
   └─ Invokes Soroban EnrollmentContract.enroll() to anchor access on-chain

3. ASSESSMENT & ON-CHAIN ISSUANCE
   ├─ Learner completes lessons and passes course quizzes (>= 80%)
   ├─ Backend computes SHA-256 Hash: SHA256(studentId + courseId + timestamp)
   ├─ Backend calls Soroban CertificateContract.issue() with course hash & grade
   └─ Certificate ID & Transaction Memo persisted in PostgreSQL and returned to student

4. PUBLIC VERIFICATION
   ├─ Employer/Institution visits /verify/:hash or /verify/:certId
   ├─ Queries backend API & simulates Soroban verify(certificate_id) via RPC
   └─ Returns cryptographic proof: Student Address, Course Name, Issue Date & On-Chain Status
```

### Key Code Paths

| Layer | File Path | Role |
|---|---|---|
| Frontend Wallet Bridge | `frontend/src/lib/freighter.ts` | Freighter connection, network detection, transaction signing |
| Frontend Stellar Client | `frontend/src/lib/stellar.ts` | Horizon balance lookups, stroops math, Friendbot funding |
| Frontend Contracts Config | `frontend/src/lib/contracts.ts` | Deployed Soroban contract addresses & RPC config |
| Frontend API Client | `frontend/src/lib/api.ts` | Authenticated client for NestJS backend endpoints |
| Backend Stellar Bridge | `backend/src/modules/payments/` | Horizon payment verification & escrow settlement |
| Backend Certificate Engine | `backend/src/modules/certificates/` | SHA-256 hash generation, certificate lifecycle |
| Backend Integrations | `backend/src/modules/integrations/` | Corsair automation engine (GitHub Classroom, Calendar) |

---

## Tech Stack

| Layer | Technology | Description |
|---|---|---|
| **Frontend** | **Next.js 16** (App Router), **React 19**, **Tailwind CSS 4** | Ultra-responsive modern UI with minimalist Notion-inspired aesthetic |
| **Icons & Design** | **Lucide React**, Custom CSS Design System | Clean typography, dark/light modes, accessible widgets |
| **Backend** | **NestJS 10**, **TypeScript**, **TypeORM** | Modular microservice-ready backend architecture |
| **Database** | **PostgreSQL** / **Supabase** | Relational data store for courses, lessons, users, quizzes |
| **Blockchain** | **Stellar Network** (Horizon API) | Instant, low-fee XLM payments and settlement |
| **Smart Contracts** | **Soroban SDK** (Rust, `wasm32v1-none`) | 5 on-chain smart contracts managing academic records |
| **Wallet** | **Freighter Browser Extension** | Non-custodial Web3 authentication and transaction signing |
| **Workflow Automation** | **Corsair** | OAuth-based sync for GitHub Classroom, Gmail, Discord, Calendar |

---

## Project Structure

```
DLearn/
├── contract/                       # Soroban Smart Contracts (Rust)
│   ├── Cargo.toml                  # Cargo workspace definition
│   ├── contract-addresses.json     # Deployed Testnet contract registry
│   └── contracts/
│       ├── enrollment/             # EnrollmentContract (student progress & state)
│       ├── certificate/            # CertificateContract (on-chain certificates)
│       ├── completion/             # CompletionContract (grades & quiz results)
│       ├── verification/           # VerificationContract (public credential check)
│       └── reward/                 # RewardContract (scholarships & reward tokens)
│
├── backend/                        # NestJS API Backend
│   ├── src/
│   │   ├── config/                 # TypeORM & environment configuration
│   │   ├── entities/               # Database entities (User, Course, Certificate, etc.)
│   │   └── modules/
│   │       ├── auth/               # Wallet challenge-response & JWT auth
│   │       ├── courses/            # Course creation, catalog, and curriculum
│   │       ├── lessons/            # Lesson content, markdown, video embeds
│   │       ├── enrollments/        # Enrollment state & Soroban anchoring
│   │       ├── certificates/       # SHA-256 generation & on-chain verification
│   │       ├── quizzes/            # Quiz evaluation & score calculation
│   │       ├── assignments/        # Student submissions & grading
│   │       ├── payments/           # Stellar Horizon transaction verification
│   │       ├── wallets/            # Wallet balance & transaction tracking
│   │       ├── discussions/        # Module discussion forums & comments
│   │       ├── integrations/       # Corsair workflow automation connectors
│   │       ├── analytics/          # Learning analytics & instructor revenue
│   │       └── admin/              # User, course, and platform governance
│   └── supabase-schema.sql         # SQL schema definitions for PostgreSQL
│
└── frontend/                       # Next.js 16 Web Application
    └── src/
        ├── app/
        │   ├── page.tsx            # Landing page (Hero, Features, Pricing, Testimonials)
        │   ├── login/ / signup/    # Authentication & wallet connect flows
        │   ├── onboarding/         # Role selection (Student vs Instructor) & profile setup
        │   ├── pricing/            # Course & membership pricing plans
        │   ├── verify/             # Public certificate verification portal
        │   └── dashboard/          # Authenticated user dashboard
        │       ├── courses/        # Course player, syllabus, lessons & quizzes
        │       ├── marketplace/    # Explore & purchase courses
        │       ├── certificates/   # Earned credential showcase & PDF export
        │       ├── instructor/     # Course builder & analytics portal
        │       ├── assignments/    # Student assignment submissions
        │       ├── discussions/    # Course community forums
        │       └── settings/       # Profile, wallet, notification & Corsair settings
        ├── components/             # Reusable UI component library (Modals, Badges, Toast)
        └── lib/                    # api.ts, freighter.ts, stellar.ts, contracts.ts
```

---

## Getting Started

### Prerequisites

- **Node.js**: `v20.x` or higher
- **Package Manager**: `npm` or `pnpm`
- **Rust & Cargo**: `1.79+` (only needed for smart contract development)
- **Soroban CLI**: `cargo install --locked soroban-cli` (for contract compilation)
- **Freighter Wallet**: Extension installed in Chrome/Brave/Firefox ([freighter.app](https://www.freighter.app/))
- **PostgreSQL**: Local instance or free Supabase project

---

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Configure environment
cp .env .env.local

# Run database migrations (or execute supabase-schema.sql in PostgreSQL)
# Start the NestJS development server
npm run start:dev
```

The backend server will start on [http://localhost:8001](http://localhost:8001).

---

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Next.js development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Default Value | Description |
|---|---|---|
| `PORT` | `8001` | Server port |
| `NODE_ENV` | `development` | Environment mode (`development` / `production`) |
| `DB_HOST` | `localhost` | PostgreSQL host |
| `DB_PORT` | `5432` | PostgreSQL port |
| `DB_USER` | `postgres` | PostgreSQL user |
| `DB_PASSWORD` | `postgres` | PostgreSQL password |
| `DB_NAME` | `learning_platform` | Database name |
| `JWT_SECRET` | `learnix-jwt-secret-prod-2024-x8k9m2n4` | Secret key for signing JWT tokens |
| `JWT_EXPIRES_IN` | `7d` | Token validity duration |
| `CORS_ORIGIN` | `http://localhost:3000` | Allowed frontend origin |
| `STELLAR_NETWORK` | `testnet` | Stellar network (`testnet` / `public`) |
| `STELLAR_HORIZON_URL` | `https://horizon-testnet.stellar.org` | Horizon REST API endpoint |
| `STELLAR_RPC_URL` | `https://soroban-testnet.stellar.org` | Soroban RPC endpoint |
| `STELLAR_NETWORK_PASSPHRASE` | `Test SDF Network ; September 2015` | Network passphrase |
| `STELLAR_TREASURY_PUBLIC_KEY`| `GC5SM6R2...` | Platform payout & fee receiver wallet |
| `STELLAR_TREASURY_SECRET_KEY`| `S...` | Treasury private key for automated rewards |

### Frontend (`frontend/.env.local`)

| Variable | Default Value | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8001` | Backend API base URL |
| `NEXT_PUBLIC_STELLAR_NETWORK` | `testnet` | Active Stellar network |
| `NEXT_PUBLIC_HORIZON_URL` | `https://horizon-testnet.stellar.org` | Public Horizon endpoint |
| `NEXT_PUBLIC_SOROBAN_RPC_URL` | `https://soroban-testnet.stellar.org` | Soroban RPC server |

---

## API Endpoints

### Authentication & Wallets
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/signup` | Register new user account |
| `POST` | `/auth/login` | Email/Password login |
| `POST` | `/auth/wallet-login` | Challenge-based Freighter wallet login |
| `GET` | `/auth/profile` | Retrieve authenticated user profile |
| `GET` | `/wallets/me` | Fetch connected Stellar wallet details |
| `POST` | `/wallets/link` | Associate a new Stellar address with user profile |

### Courses & Lessons
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/courses` | Search & filter published course catalog |
| `GET` | `/courses/:id` | Retrieve comprehensive course details & syllabus |
| `POST` | `/courses` | Create new course (Instructor / Admin) |
| `PUT` | `/courses/:id` | Update course curriculum or metadata |
| `POST` | `/lessons` | Create lessons with markdown content & video links |
| `GET` | `/lessons/course/:courseId` | List all lessons in a course |

### Enrollments & Payments
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/enrollments/my` | Get all courses enrolled by current user |
| `POST` | `/enrollments` | Enroll into course |
| `POST` | `/payments/verify-stellar` | Verify on-chain XLM transaction and confirm enrollment |
| `GET` | `/payments/history` | User payment receipts & transaction hashes |

### Assessments & Quizzes
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/quizzes/lesson/:lessonId` | Get quiz questions for a lesson |
| `POST` | `/quizzes/submit` | Submit quiz answers and calculate grade |
| `POST` | `/assignments/submit` | Submit project assignment URL/file |

### Certificates & Verification
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/certificates/my` | List all certificates issued to logged-in user |
| `POST` | `/certificates/issue` | Mint certificate and anchor hash on Soroban |
| `GET` | `/certificates/verify/:hash` | Public endpoint to verify certificate by SHA-256 hash |
| `GET` | `/certificates/:id` | Retrieve full certificate metadata |

### Integrations (Corsair)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/integrations` | List user's connected services |
| `POST` | `/integrations/connect` | Connect GitHub, Google Calendar, Slack, or Discord |
| `DELETE` | `/integrations/:id` | Disconnect third-party integration |

---

## Deploying the Contracts

All 5 contracts are managed under `contract/`. To build and redeploy to Stellar Testnet:

### 1. Setup Rust & Soroban CLI

```bash
# Add WASM compilation target
rustup target add wasm32v1-none

# Install Soroban CLI
cargo install --locked soroban-cli

# Register Stellar Testnet
soroban network add testnet \
  --rpc-url https://soroban-testnet.stellar.org \
  --network-passphrase "Test SDF Network ; September 2015"

# Generate and fund deployer account
soroban keys generate --network testnet deployer
soroban keys fund deployer --network testnet
```

### 2. Build WASM Binaries

```bash
cd contract
cargo build --target wasm32v1-none --release
```

Compiled `.wasm` binaries will be output to `contract/target/wasm32v1-none/release/`.

### 3. Deploy to Testnet

```bash
# Deploy Enrollment Contract
soroban contract deploy \
  --wasm target/wasm32v1-none/release/enrollment_contract.wasm \
  --source deployer \
  --network testnet

# Deploy Certificate Contract
soroban contract deploy \
  --wasm target/wasm32v1-none/release/certificate_contract.wasm \
  --source deployer \
  --network testnet

# Deploy Completion Contract
soroban contract deploy \
  --wasm target/wasm32v1-none/release/completion_contract.wasm \
  --source deployer \
  --network testnet

# Deploy Verification Contract
soroban contract deploy \
  --wasm target/wasm32v1-none/release/verification_contract.wasm \
  --source deployer \
  --network testnet

# Deploy Reward Contract
soroban contract deploy \
  --wasm target/wasm32v1-none/release/reward_contract.wasm \
  --source deployer \
  --network testnet
```

After deployment, update `contract/contract-addresses.json` and `frontend/src/lib/contracts.ts` with the new addresses.

---

## Roadmap

- [x] Full Course Marketplace & Canvas Lesson Viewer
- [x] Freighter Wallet Integration & Stellar Testnet XLM Payments
- [x] 5 Soroban Smart Contracts for Enrollment, Certificates, Completion, Verification, and Rewards
- [x] Public Certificate Verification Portal with Cryptographic Hash Anchoring
- [x] Instructor Analytics, Quiz Authoring & Revenue Dashboard
- [x] Corsair Third-Party Integrations Engine (GitHub Classroom, Google Calendar, Discord)
- [ ] Stellar Mainnet Deployment & Multi-Asset Support (USDC payments)
- [ ] Soulbound NFT (SBT) Certificate Visual Metadata rendering on IPFS / Arweave
- [ ] Automated Peer-Review Grading Smart Contracts
- [ ] Mobile App with Passkey-based Stellar Key Management

---

## License

This project is licensed under the [MIT License](LICENSE).
