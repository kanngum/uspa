# USPA Development Plan v2.0

**Version:** 0.1.0 | **Current Phase:** Foundation Complete → Phase 2: Backend Core API

---

## Phase 1: Foundation ✅ (Complete)

### Infrastructure
- ✅ Turbo Monorepo setup with npm workspaces
- ✅ Next.js 16 frontend (apps/web)
- ✅ NestJS backend (apps/api)
- ✅ Prisma ORM v7 with PostgreSQL
- ✅ TypeScript throughout
- ✅ Git repository
- ✅ VS Code workspace

### Database Schema
- ✅ University, AcademicUnit, Department, Programme
- ✅ Subject (O/A Level), ProgrammeRequirement
- ✅ Tuition, Career, ProgrammeCareer, Keyword, ProgrammeKeyword
- ✅ User, SavedProgramme, SearchHistory, Announcement
- ✅ GeneralAdmissionRule
- ✅ Prisma migration generated
- ✅ Seed data with UBa academic catalogue

### Development Environment
- ✅ PostgreSQL configured
- ✅ Prisma migrations
- ✅ Prisma Client generation
- ✅ NestJS app structure
- ✅ Next.js app structure

---

## Phase 2: Backend Core API 🟡 (Current)

Build a stable REST API before designing the frontend.

| Step | Module | Status | Deliverables |
|------|--------|--------|-------------|
| 2.1 | Prisma Module | ✅ Done | PrismaModule, PrismaService, global DI |
| 2.2 | Academic Unit Module | 🟡 In Progress | GET /academic-units, GET /:id, POST, PATCH, DELETE |
| 2.3 | Programme Module | 🟡 In Progress | GET /programmes, GET /:code, POST, PATCH, DELETE |
| 2.4 | Subject Module | 🔲 Pending | GET /subjects, POST, PATCH, DELETE |
| 2.5 | Programme Requirements | 🔲 Pending | GET /programmes/:id/requirements, POST, PATCH, DELETE |
| 2.6 | Search Engine | 🔲 Pending | Full text search, filters, autocomplete |
| 2.7 | Eligibility Engine | 🟡 In Progress | POST /eligibility/check (MVP done) |
| 2.8 | Authentication | 🔲 Pending | JWT admin-only auth |
| 2.9 | Admin Dashboard API | 🟡 In Progress | Dashboard stats, programme/user mgmt |

### Implementation Order
1. ✅ Prisma Module — Single database service
2. **Academic Unit Module** — CRUD with validation, pagination, search
3. **Programme Module** — CRUD with degree/faculty filters
4. **Subject Module** — CRUD for O/A Level subjects
5. **Programme Requirements** — Manage admission requirements
6. **Search Engine** — Full text search, autocomplete
7. **Eligibility Engine** — Subject/grade evaluation
8. **Authentication** — Admin-only JWT auth
9. **Admin Dashboard API** — Full management endpoints

---

## Phase 3: Data Management 🔲

- Manual Entry (forms for university, faculty, programme, tuition, requirements)
- Excel Import (upload → validate → preview → import)
- JSON Import (upload → validate → preview → import)
- Duplicate Detection (faculties, programmes, subjects)

---

## Phase 4: Frontend (Student Portal) 🔲

- Home, Academic Units, Programmes, Programme Details
- Search, Eligibility Checker, Login, Register
- Cards, Tables, Filters, Pagination, Navigation

---

## Phase 5: Advanced Features 🔲

- Programme Comparison (tuition, duration, requirements, careers)
- Saved Programmes (bookmark programmes)
- Search History (track previous searches)
- Recommendations (related programmes)
- Announcements (programme-specific notices)

---

## Phase 6: AI Integration 🔲

- Natural language assistant
- Conversation memory
- Personalized recommendations
- Career guidance

---

## Phase 7: Administration Portal 🔲

- Dashboard, Academic Units, Programmes, Subjects
- Requirements, Users, Announcements
- Imports, System Settings, Analytics

---

## Current Backend Module Status

| Module | Type | Status |
|--------|------|--------|
| PrismaModule | Infrastructure | ✅ Done |
| FacultiesController | Read-only | ⚠️ Needs CRUD |
| DepartmentsController | Read-only | ⚠️ Needs CRUD |
| ProgrammesController | Read-only | ⚠️ Needs CRUD |
| EligibilityController | Action | ✅ MVP |
| RecommendationsController | Read-only | ✅ MVP |
| AiController | Action | ✅ MVP |
| AuthController | Auth | ⚠️ Needs admin-only |
| FavouritesController | Auth | ✅ MVP |
| CompareController | Action | ✅ MVP |
| AdminController | Admin | 🟡 Partial |

---

## Development Principles

1. Build the backend before the frontend
2. Complete one module before starting another
3. Test every endpoint before moving on
4. Keep the Prisma schema stable
5. Never hardcode programme data; all data managed through Admin Portal
6. Keep MVP focused on University of Bamenda; architecture supports multiple universities
7. Document each phase before beginning the next

