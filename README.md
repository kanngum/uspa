# USPA - UBa Smart Programme Advisor

A full-stack monorepo application for prospective students to discover academic programmes at the **University of Bamenda (UBa)**, check admission eligibility, get AI-powered recommendations, and explore career paths.

> **Live Demo**: Coming soon

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [API Modules](#api-modules)
- [Frontend Pages](#frontend-pages)
- [Shared Packages](#shared-packages)
- [Getting Started](#getting-started)
- [Development Guide](#development-guide)
- [Build & Deployment](#build--deployment)
- [Project Status](#project-status)

---

## Overview

USPA (UBa Smart Programme Advisor) helps prospective students:

- **🔍 Search** programmes by name, keywords, faculty, or degree type
- **✅ Check eligibility** by entering O/A Level subjects and grades
- **🤖 Get AI-powered recommendations** via natural language chat
- **⭐ Save favourites** and **compare** programmes side-by-side
- **📚 Browse** faculties, departments, and programme details
- **🔐 Create accounts** to save preferences and track history

### Core Features

| Feature | Status | Description |
|---------|--------|-------------|
| Programme Search | ✅ | Full-text search with filters, debounce, pagination |
| Programme Detail | ✅ | Tabs for overview, requirements, tuition, careers |
| Faculty Browser | ✅ | Faculties with department drill-down |
| Eligibility Checker | ✅ | Multi-step O/A Level subject + grade evaluation |
| AI Advisor Chat | ✅ | OpenAI-powered natural language querying |
| User Auth | ✅ | JWT-based registration, login, profile |
| Favourites | ✅ | Save/remove favourite programmes |
| Compare | ✅ | Side-by-side programme comparison table |
| Admin Dashboard | ✅ | Stats, programme management, analytics |
| Dark Mode | ✅ | System-aware theme with manual toggle |
| Responsive Design | ✅ | Mobile-first, all screen sizes |

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

### Data Flow

1. **Frontend** (Next.js) sends HTTP requests via the `ApiClient` class
2. **React Query hooks** manage caching, loading, and error states
3. **Backend** (NestJS) receives requests through controllers
4. **Service layer** handles business logic and database queries
5. **Prisma ORM** translates queries to PostgreSQL
6. **Response** flows back through the chain to the UI

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
| **clsx + tailwind-merge** | CSS class management |
| **Radix UI** | Accessible UI primitives (dialog, tabs, select, etc.) |
| **class-variance-authority** | Component variant management |

### Backend (`apps/api`)

| Technology | Purpose |
|------------|---------|
| **NestJS** | Node.js framework with modular architecture |
| **TypeScript** | Type safety |
| **Prisma ORM v7** | Database ORM with migrations |
| **PostgreSQL** | Primary database |
| **Passport.js + JWT** | Authentication |
| **bcrypt** | Password hashing |
| **OpenAI** | AI advisor integration |
| **class-validator** | Input validation |
| **Jest** | Testing framework |

### Infrastructure

| Technology | Purpose |
|------------|---------|
| **Turborepo** | Monorepo build system |
| **npm workspaces** | Package management |

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
│   │   │       └── data.ts           # Seed data
│   │   └── src/
│   │       ├── main.ts               # Entry point
│   │       ├── app.module.ts         # Root module
│   │       ├── prisma/               # Prisma service (global)
│   │       ├── admin/                # Admin module
│   │       ├── ai/                   # AI Advisor module
│   │       ├── auth/                 # Authentication module
│   │       ├── compare/              # Compare module
│   │       ├── departments/          # Departments module
│   │       ├── eligibility/          # Eligibility checker module
│   │       ├── faculties/            # Faculties module
│   │       ├── favourites/           # Favourites module
│   │       ├── programmes/           # Programmes module
│   │       └── recommendations/      # Recommendations module
│   │
│   ├── web/                          # Next.js frontend
│   │   ├── app/
│   │   │   ├── layout.tsx            # Root layout with providers
│   │   │   ├── page.tsx              # Home page
│   │   │   ├── globals.css           # Global styles + Tailwind
│   │   │   ├── admin/                # Admin dashboard
│   │   │   ├── admission-checker/    # Eligibility checker
│   │   │   ├── ai-advisor/           # AI chat advisor
│   │   │   ├── compare/              # Programme comparison
│   │   │   ├── faculties/            # Faculty listing + detail
│   │   │   ├── favourites/           # Saved programmes
│   │   │   ├── login/                # Login page
│   │   │   ├── programmes/           # Programme listing + detail
│   │   │   ├── register/             # Registration page
│   │   │   └── lib/
│   │   │       ├── api.ts            # API client service
│   │   │       ├── utils.ts          # Utility functions
│   │   │       └── hooks/            # React Query hooks
│   │   │           ├── useFaculties.ts
│   │   │           ├── useProgrammes.ts
│   │   │           ├── useEligibility.ts
│   │   │           ├── useRecommendations.ts
│   │   │           ├── useAi.ts
│   │   │           ├── useAuth.ts
│   │   │           ├── useFavourites.ts
│   │   │           ├── useCompare.ts
│   │   │           └── useAdmin.ts
│   │   ├── components/
│   │   │   ├── layout/               # Header, Footer
│   │   │   ├── providers/            # Query, Theme providers
│   │   │   └── ui/                   # UI component library
│   │   │       ├── badge.tsx
│   │   │       ├── button.tsx
│   │   │       ├── card.tsx
│   │   │       ├── empty-state.tsx
│   │   │       ├── error-boundary.tsx
│   │   │       ├── input.tsx
│   │   │       ├── loading.tsx
│   │   │       ├── select.tsx
│   │   │       └── toast.tsx
│   │   └── public/                   # Static assets
│
├── packages/                         # Shared packages
│   ├── config/                       # Constants, enums, config
│   ├── types/                        # TypeScript interfaces & DTOs
│   ├── utils/                        # Helper functions
│   └── validation/                   # Zod validation schemas
│
├── PLAN.md                           # Implementation plan
├── TODO.md                           # Task tracking
└── package.json                      # Root workspace config
```

---

## Database Schema

The database uses PostgreSQL with Prisma ORM. Key models include:

### Core Educational Structure

```
University ──► AcademicUnit (Faculties/Schools)
                └──► Department
                      └──► Programme
                              ├── ProgrammeRequirement
                              ├── Tuition
                              ├── ProgrammeCareer ──► Career
                              └── ProgrammeKeyword ──► Keyword
```

### Subjects & Requirements

```
Subject (O/A Level)
  └── ProgrammeRequirement (links subjects to programmes with minimum grades)
```

### Admission Rules (Rule Engine)

```
AdmissionRule (hierarchical: University → Faculty → Dept → Programme)
  └── RuleCondition (individual conditions with operators)
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
| `DegreeType` | BSC, BA, BENG, BED, LLB, MBBS, HND, DIPLOMA, PGD, MSC, MA, MENG, PHD |
| `ProgrammeLevel` | UNDERGRADUATE, POSTGRADUATE, DOCTORATE, PROFESSIONAL |
| `SubjectLevel` | O_LEVEL, A_LEVEL |
| `RequirementType` | REQUIRED, OPTIONAL |
| `UserRole` | STUDENT, FACULTY_ADMIN, ADMISSIONS_OFFICER, SUPER_ADMIN |
| `EligibilityStatus` | ELIGIBLE, CONDITIONALLY_ELIGIBLE, NOT_ELIGIBLE |

---

## API Modules

### `PrismaModule` (Global)
- `PrismaService` - Shared database service injected globally

### `FacultiesModule`
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/faculties` | GET | List all faculties with department counts |
| `/api/faculties/:id` | GET | Faculty detail with departments |

### `DepartmentsModule`
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/departments/:id/programmes` | GET | Programmes in a department |

### `ProgrammesModule`
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/programmes` | GET | Search with filters, pagination |
| `/api/programmes/:id` | GET | Programme detail with relations |
| `/api/programmes/auto-complete` | GET | Search suggestions |

### `EligibilityModule`
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/eligibility/check` | POST | Evaluate O/A Level subjects against requirements |

### `RecommendationsModule`
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/recommendations/similar/:id` | GET | Similar programmes |
| `/api/recommendations/alternatives` | POST | Alternative suggestions |

### `AiModule`
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/ai/ask` | POST | Natural language query with OpenAI |

### `AuthModule`
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register` | POST | User registration |
| `/api/auth/login` | POST | User login (returns JWT) |
| `/api/auth/profile` | GET | Current user profile |

### `FavouritesModule`
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/favourites` | GET | List saved programmes |
| `/api/favourites` | POST | Add favourite |
| `/api/favourites/:id` | DELETE | Remove favourite |

### `CompareModule`
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/compare` | POST | Compare multiple programmes |

### `AdminModule`
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/dashboard/stats` | GET | Dashboard statistics |
| `/api/admin/programmes` | GET | Programme management list |

---

## Frontend Pages

| Route | Page | Key Features |
|-------|------|-------------|
| `/` | Home | Hero search, featured programmes, faculty stats, how-it-works |
| `/programmes` | Programme Listing | Search with debounce, filters (degree, level, faculty), grid/list toggle, pagination |
| `/programmes/[code]` | Programme Detail | Tabs (overview, requirements, tuition, careers), similar programmes, favourites |
| `/faculties` | Faculty Listing | All faculties with departments and programme counts |
| `/faculties/[code]` | Faculty Detail | Departments with programme cards |
| `/admission-checker` | Eligibility Checker | Multi-step form (O Level → A Level → Results), grade selection |
| `/ai-advisor` | AI Advisor | Chat interface, suggested questions, programme cards |
| `/login` | Login | Email/password with validation |
| `/register` | Register | Name, email, password with confirmation |
| `/favourites` | Saved Programmes | List with remove, compare link |
| `/compare` | Programme Comparison | Side-by-side table comparing degree, duration, level, faculty, requirements |
| `/admin` | Admin Dashboard | Stats cards, programme table, management tabs |

### UI Component Library

| Component | Features |
|-----------|----------|
| `Button` | Variants: primary, outline, ghost, sizes: sm, lg, icon |
| `Card` | With CardHeader, CardContent, CardTitle, CardDescription |
| `Badge` | Variants: info, secondary, success, warning, destructive |
| `Input` | Styled text input with focus ring |
| `Select` | Native select with styled wrapper |
| `Toast` | Success/error/info/warning notifications with auto-dismiss |
| `EmptyState` | Icon + title + description + optional action button |
| `ErrorBoundary` | React error boundary with reload button |
| `Skeleton` | Loading skeletons for cards, lists, detail pages, tables, filters, chat messages |

---

## Shared Packages

| Package | Contents |
|---------|----------|
| `packages/config` | Constants, enums, role definitions |
| `packages/types` | TypeScript interfaces, DTOs, API response types |
| `packages/utils` | Helper functions (grade comparison, formatting) |
| `packages/validation` | Zod validation schemas |

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

# Install all dependencies (workspaces)
npm install

# Set up environment variables
cp apps/api/.env.example apps/api/.env
# Edit .env with your database credentials and OpenAI API key

# Run database migrations
cd apps/api
npx prisma migrate dev

# Seed the database with sample data
npx prisma db seed

# Return to root
cd ../..
```

### Running Development Servers

```bash
# Run both frontend and backend (from root)
npm run dev

# Or run individually:
# Frontend only
cd apps/web && npm run dev

# Backend only
cd apps/api && npm run start:dev
```

The frontend will be available at **http://localhost:3000** and the API at **http://localhost:3001**.

### Environment Variables

**`apps/api/.env`**:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/uspa"
JWT_SECRET="your-jwt-secret-key"
OPENAI_API_KEY="sk-your-openai-key"
```

**`apps/web/.env.local`**:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

---

## Development Guide

### Adding a New API Endpoint

1. Create a new module in `apps/api/src/` with controller, service, and module files
2. Add the module to `app.module.ts`
3. Implement database queries using `PrismaService`
4. Add corresponding frontend API method in `apps/web/app/lib/api.ts`
5. Create a React Query hook in `apps/web/app/lib/hooks/`

### Adding a New Page

1. Create a directory under `apps/web/app/` for the route
2. Add `page.tsx` (and optionally `layout.tsx`)
3. Import and use hooks from `@/app/lib/hooks/`
4. Add navigation link in `Header` component if needed

### Styling

- Uses **Tailwind CSS v4** with the `cn()` utility from `@/app/lib/utils`
- Supports dark mode via `dark:` prefix classes
- Theme is stored in `localStorage` with key `uspa_theme`

### State Management

- **Server state**: Managed by `@tanstack/react-query` with 5-minute stale time
- **Auth state**: JWT tokens stored in `localStorage` under `uspa_token`
- **UI state**: React `useState` for forms, modals, toggles
- **Compare**: Programme IDs stored in `localStorage` under `uspa_compare_ids`

---

## Build & Deployment

### Production Build

```bash
# Build all workspaces
npm run build

# Or build individually:
cd apps/web && npm run build    # Frontend
cd apps/api && npm run build    # Backend
```

### Build Output

The Next.js build produces **13 routes**:

| Route | Type |
|-------|------|
| `/` | Static |
| `/admin` | Static |
| `/admission-checker` | Static |
| `/ai-advisor` | Static |
| `/compare` | Static |
| `/faculties` | Static |
| `/faculties/[code]` | Dynamic (server-rendered) |
| `/favourites` | Static |
| `/login` | Static |
| `/programmes` | Static |
| `/programmes/[code]` | Dynamic (server-rendered) |
| `/register` | Static |

### Deployment

The application can be deployed to:

- **Frontend**: Vercel, Netlify, or any Node.js hosting
- **Backend**: Railway, Render, Heroku, or any Node.js hosting
- **Database**: PostgreSQL via Supabase, Railway, or managed DB

---

## Project Status

### Phase 1: Foundation ✅
- Enhanced Prisma Schema with all models
- Seed data for UBa faculties, departments, programmes
- Migration generated
- Shared packages populated

### Phase 2: API Backend ✅
- All 10 modules implemented:
  - Prisma, Faculties, Departments, Programmes
  - Eligibility Checker, Recommendations
  - AI Advisor, Auth, Favourites, Compare, Admin

### Phase 3: Web Frontend ✅
- All pages implemented with full UI:
  - Home, Programme listing/detail, Faculties
  - Admission Checker, AI Advisor
  - Auth pages, Favourites, Compare, Admin

### Phase 4: Integration & Polish ✅
- React Query hook library (9 hooks)
- UI components (loading, empty state, error boundary, toast)
- All pages integrated with real API hooks
- TypeScript compilation: **0 errors**
- Production build: **successful**

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## Acknowledgments

- University of Bamenda for academic programme data
- OpenAI for AI advisor capabilities
- Next.js, NestJS, and Prisma teams for excellent frameworks

