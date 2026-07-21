# USPA (UBa Smart Programme Advisor)

**Version:** 0.1.0 | **Current Phase:** Foundation Complete → Entering Backend Core API

A web platform that helps prospective students discover academic programmes at the **University of Bamenda (UBa)**, determine admission eligibility, compare programmes, and receive intelligent recommendations.

---

## Project Vision

The system is composed of four major parts:
- **Public Student Portal** — Browse, search, and compare programmes
- **Administrative Portal** — Manage academic data through forms and imports
- **Admission Recommendation Engine** — Evaluate eligibility based on O/A Level results
- **AI Assistant** — Natural language querying for programme discovery

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Turbo Monorepo                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │   apps/web   │  │   apps/api   │  │   packages/*     │  │
│  │  (Next.js)   │  │  (NestJS)    │  │  (shared libs)   │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────────────┘  │
│         │                  │                                │
│         │    HTTP/JSON     │                                │
│         └─────────────────►│                                │
│                            ▼                                │
│                     ┌──────────────┐                        │
│                     │   Prisma    │                         │
│                     │  (Postgres)  │                        │
│                     └──────────────┘                        │
└─────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

### Frontend (`apps/web`)
| Technology | Purpose |
|------------|---------|
| **Next.js 16** | React framework with App Router |
| **TypeScript** | Type safety |
| **Tailwind CSS v4** | Utility-first styling |
| **@tanstack/react-query v5** | Server state management |
| **lucide-react** | Icon library |

### Backend (`apps/api`)
| Technology | Purpose |
|------------|---------|
| **NestJS** | Node.js framework with modular architecture |
| **TypeScript** | Type safety |
| **Prisma ORM v7** | Database ORM with migrations |
| **PostgreSQL** | Primary database |
| **Passport.js + JWT** | Admin authentication |
| **bcrypt** | Password hashing |
| **class-validator** | Input validation |

### Infrastructure
| Technology | Purpose |
|------------|---------|
| **Turborepo** | Monorepo build system |
| **npm workspaces** | Package management |

---

## Database Schema

### Core Educational Structure
```
University ──► AcademicUnit (Faculties/Schools)
                └──► Department
                      └──► Programme
                              ├── ProgrammeRequirement ──► Subject
                              ├── Tuition
                              ├── ProgrammeCareer ──► Career
                              └── ProgrammeKeyword ──► Keyword
```

### Admission Rules
```
GeneralAdmissionRule (university-wide admission policies)
```

### Users & Personalization
```
User
  ├── SavedProgramme (favourites)
  ├── SearchHistory
  └── Announcement (authored)
```

### Enums
| Enum | Values |
|------|--------|
| `AcademicUnitType` | FACULTY, SCHOOL |
| `DegreeType` | BSC, BA, BENG, BED, LLB, MBBS, HND, DIPLOMA, PGD, MSC, MA, MENG, PHD, CERTIFICATE, BTECH, HPD |
| `ProgrammeLevel` | UNDERGRADUATE, POSTGRADUATE, DOCTORATE, PROFESSIONAL |
| `SubjectLevel` | O_LEVEL, A_LEVEL |
| `RequirementType` | REQUIRED, OPTIONAL |
| `UserRole` | VISITOR, STUDENT, ADMIN |
| `EligibilityStatus` | ELIGIBLE, CONDITIONALLY_ELIGIBLE, NOT_ELIGIBLE |

---

## Current Progress

### ✅ Phase 1: Foundation — Complete

**Infrastructure**
- Turbo Monorepo with npm workspaces
- Next.js 16 frontend (`apps/web`)
- NestJS backend (`apps/api`)
- Prisma ORM v7 with PostgreSQL
- TypeScript throughout
- Git repository
- VS Code workspace

**Database**
- Core models: University, AcademicUnit, Department, Programme, Tuition, Subject, ProgrammeRequirement, Career, ProgrammeCareer, Keyword, ProgrammeKeyword, User, SavedProgramme, SearchHistory, Announcement, GeneralAdmissionRule
- Prisma migration generated and applied
- Seed data with complete UBa academic catalogue:
  - 9 faculties/schools, 36+ departments, 30+ programmes
  - 30 O Level subjects, 23 A Level subjects
  - Programme requirements, careers, keywords, and tuition data

**Development Environment**
- PostgreSQL database configured
- Prisma migrations and client generation
- NestJS app structure with module scaffolding
- Next.js app structure with page routing

---

## Development Roadmap — Phase 2: Backend Core API 🟡

We are currently entering **Phase 2: Backend Core API**. The implementation order:

| Step | Module | Status |
|------|--------|--------|
| 2.1 | Prisma Module (global DI) | ✅ Complete |
| 2.2 | Academic Unit CRUD | 🟡 In Progress |
| 2.3 | Programme CRUD | 🟡 In Progress |
| 2.4 | Subject CRUD | 🔲 Pending |
| 2.5 | Programme Requirements CRUD | 🔲 Pending |
| 2.6 | Search Engine | 🔲 Pending |
| 2.7 | Eligibility Engine | 🔲 Pending |
| 2.8 | Authentication (Admin-only JWT) | 🔲 Pending |
| 2.9 | Admin Dashboard API | 🔲 Pending |

### Completed Backend Modules (Read-only MVP)

| Module | Endpoints |
|--------|-----------|
| Faculties | `GET /faculties`, `GET /faculties/:id`, `GET /faculties/stats`, `GET /faculties/:id/departments` |
| Departments | `GET /departments/:id/programmes` |
| Programmes | `GET /programmes`, `GET /programmes/:id`, `GET /programmes/code/:code`, `GET /programmes/featured`, `GET /programmes/autocomplete` |
| Eligibility | `POST /eligibility/check` |
| Recommendations | `GET /recommendations/similar/:id`, `POST /recommendations/alternatives` |
| AI Advisor | `POST /ai/ask` |
| Favourites | `GET /favourites`, `POST /favourites/:programmeId`, `DELETE /favourites/:programmeId` |
| Compare | `POST /compare`, `POST /compare/table` |
| Admin | `GET /admin/dashboard/stats`, `GET /admin/programmes`, `PUT /admin/programmes/:id`, `DELETE /admin/programmes/:id`, User management, Faculty/Department CRUD, Announcements |

### Frontend Pages (Under Construction)

| Route | Page | Status |
|-------|------|--------|
| `/` | Home | 🟡 Scaffolded |
| `/programmes` | Programme Listing | 🟡 Scaffolded |
| `/programmes/[code]` | Programme Detail | 🟡 Scaffolded |
| `/faculties` | Faculty Listing | 🟡 Scaffolded |
| `/faculties/[code]` | Faculty Detail | 🟡 Scaffolded |
| `/admission-checker` | Eligibility Checker | 🟡 Scaffolded |
| `/ai-advisor` | AI Advisor | 🟡 Scaffolded |
| `/login` | Login | 🟡 Scaffolded |
| `/register` | Register | 🟡 Scaffolded |
| `/favourites` | Saved Programmes | 🟡 Scaffolded |
| `/compare` | Programme Comparison | 🟡 Scaffolded |
| `/admin` | Admin Dashboard | 🟡 Scaffolded |

---

## Upcoming Phases

| Phase | Focus |
|-------|-------|
| **Phase 3** | Data Management (Manual entry, Excel/JSON import, duplicate detection) |
| **Phase 4** | Frontend Student Portal (Full UI integration with real API) |
| **Phase 5** | Advanced Features (Comparison, Saved programmes, Recommendations) |
| **Phase 6** | AI Integration (Natural language assistant, conversation memory) |
| **Phase 7** | Administration Portal (Full dashboard, analytics, system settings) |

---

## Development Principles

1. **Build the backend before the frontend** — Complete API before UI integration
2. **Complete one module before starting another** — No parallel module development
3. **Test every endpoint before moving on** — Each module must be verified
4. **Keep the Prisma schema stable** — Avoid unnecessary migrations
5. **Never hardcode programme data** — All academic data managed through Admin Portal
6. **MVP focused on University of Bamenda** — Architecture supports multiple universities
7. **Document each phase before beginning the next**

---

## Getting Started

### Prerequisites
- **Node.js** >= 18
- **npm** >= 9
- **PostgreSQL** >= 14

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/uspa.git
cd uspa

# Install all dependencies
npm install

# Set up environment variables
cp apps/api/.env.example apps/api/.env
# Edit .env with your database credentials

# Run database migrations
cd apps/api
npx prisma migrate dev

# Seed the database
npx prisma db seed

# Return to root
cd ../..
```

### Running Development Servers

```bash
# Run both frontend and backend
npm run dev

# Or individually:
cd apps/api && npm run start:dev   # Backend on :3001
cd apps/web && npm run dev         # Frontend on :3000
```

### Environment Variables

**`apps/api/.env`**:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/uspa"
JWT_SECRET="your-jwt-secret-key"
```

**`apps/web/.env.local`**:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Admin Access
After seeding, login with:
- **Email:** `admin@uba.cm`
- **Password:** `admin123`

---

## Project Structure

```
uspa/
├── apps/
│   ├── api/                          # NestJS backend
│   │   ├── prisma/
│   │   │   ├── schema.prisma         # Database schema
│   │   │   ├── migrations/           # Migration files
│   │   │   └── seed/
│   │   │       ├── seed.ts           # Seed script
│   │   │       └── data.ts           # Academic data
│   │   ├── generated/                # Prisma Client (generated)
│   │   └── src/
│   │       ├── main.ts
│   │       ├── app.module.ts
│   │       ├── prisma/               # Prisma service (global)
│   │       ├── admin/                # Admin module
│   │       ├── ai/                   # AI Advisor module
│   │       ├── auth/                 # Authentication module (admin-only)
│   │       ├── compare/              # Compare module
│   │       ├── departments/          # Departments module
│   │       ├── eligibility/          # Eligibility checker module
│   │       ├── faculties/            # Faculties module
│   │       ├── favourites/           # Favourites module
│   │       ├── programmes/           # Programmes module
│   │       └── recommendations/      # Recommendations module
│   └── web/                          # Next.js frontend
│       ├── app/
│       │   ├── layout.tsx
│       │   ├── page.tsx
│       │   ├── admin/
│       │   ├── admission-checker/
│       │   ├── ai-advisor/
│       │   ├── compare/
│       │   ├── faculties/
│       │   ├── favourites/
│       │   ├── login/
│       │   ├── programmes/
│       │   ├── register/
│       │   └── lib/
│       └── components/
├── packages/                         # Shared packages
│   ├── config/                       # Constants, enums
│   ├── types/                        # TypeScript interfaces & DTOs
│   ├── utils/                        # Helper functions
│   └── validation/                   # Zod validation schemas
├── README.md
├── PLAN.md
└── TODO.md
```

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## License

MIT License

