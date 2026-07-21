# USPA - Implementation Plan

## Phase 1: Foundation Expansion

### Step 2: Enhanced Prisma Schema
Add missing models to `prisma/schema.prisma`:
- **User** - Student, Faculty Admin, Admissions Officer, Super Admin roles
- **Role** enum - STUDENT, FACULTY_ADMIN, ADMISSIONS_OFFICER, SUPER_ADMIN
- **Career** - Career paths linked to programmes
- **Keyword** - Search keywords linked to programmes
- **ProgrammeCareer** - Many-to-many Programme ↔ Career
- **ProgrammeKeyword** - Many-to-many Programme ↔ Keyword
- **SavedProgramme** - User's saved/favourite programmes
- **SearchHistory** - User search tracking
- **Announcement** - University announcements
- **AdmissionRule** - Structured rule with conditions, hierarchy
- **RuleCondition** - Individual conditions for admission rules
- **AuditLog** - System audit trail

### Step 3: Install New Dependencies
- API: `bcrypt`, `@nestjs/jwt`, `@nestjs/passport`, `passport`, `passport-jwt`, `openai`, `class-validator`, `class-transformer`, `@types/bcrypt`
- Web: `lucide-react`, `clsx`, `tailwind-merge`, `class-variance-authority`, `@radix-ui/*` components

### Step 4: Generate Migration & Build Seed Data
- Run `npx prisma migrate dev`
- Comprehensive seed with:
  - All UBa faculties: FASA, FHS, FET, FLA, FSE, HTTTC Bambili, HTTTC Kumba, COLTECH, CBMS, etc.
  - Departments under each faculty
  - Realistic programmes with codes, degrees, durations
  - O/A Level subjects
  - Programme requirements matching real UBa criteria
  - Careers linked to programmes
  - Keywords for search
  - General admission rules
  - Tuition fees

### Step 5: Populate Shared Packages
- `packages/types/` - TypeScript interfaces, DTOs, API response types
- `packages/validation/` - Zod schemas for input validation
- `packages/utils/` - Helper functions (grade comparison, etc.)
- `packages/config/` - Constants, enums, role definitions

### Step 6: PrismaModule & Global Database Service
- Create `PrismaModule` with global `PrismaService`
- Wire into `AppModule`

---

## Phase 2: API Backend

### Step 7: Faculties Module
- `FacultiesController`, `FacultiesService`, `FacultiesModule`
- Endpoints: GET /faculties, GET /faculties/:id, GET /departments/:id/programmes

### Step 8: Programmes Module
- `ProgrammesController`, `ProgrammesService`, `ProgrammesModule`
- Search, filter, detail views with full-text search
- Auto-complete endpoint

### Step 9: Admission Rule Engine
- Rule evaluation service
- University → Faculty → Department → Programme hierarchy
- Configurable condition evaluation

### Step 10: Eligibility Checker
- POST /eligibility/check endpoint
- O/A Level subject + grade evaluation
- Returns: Eligible / Conditionally Eligible / Not Eligible with detailed reasons

### Step 11: Recommendation Engine
- Similar programmes based on subjects, careers
- Alternative suggestions
- Career-based exploration

### Step 12: AI Advisor Module
- OpenAI integration with RAG
- Natural language understanding for programme queries

### Step 13: Auth Module
- JWT-based authentication
- Registration, login, profile
- Role-based guards

### Step 14: Favourites & Compare
- Save/list/delete favourite programmes
- Compare multiple programmes side-by-side

### Step 15: Admin Module
- CRUD for programmes, users, faculties, departments
- Analytics dashboards

---

## Phase 3: Web Frontend

### Step 16: UI Package & shadcn/ui Setup
- Button, Card, Input, Dialog, Badge, etc.

### Step 17: Layout & Navigation
- Header with search, nav links, auth
- Footer
- Mobile responsive sidebar

### Step 18: Home Page
- Hero with search bar
- Featured programmes
- Faculty quick links
- Stats section

### Step 19: Programme Search & Listing
- Advanced filters
- Grid/list toggle
- Pagination
- Search results

### Step 20: Programme Detail Page
- Overview tab
- Requirements tab
- Tuition tab
- Careers tab
- Similar programmes sidebar

### Step 21: Faculty/Department Pages
- Faculty detail with departments
- Department detail with programmes

### Step 22: Admission Checker Page
- Multi-step form: O/L subjects → A/L subjects → Results
- Eligibility visualization

### Step 23: AI Advisor Chat
- Chat interface with message bubbles
- Streaming responses
- Suggested questions

### Step 24: Auth Pages
- Login form
- Registration form
- Profile page

### Step 25: Favourites & Compare
- Saved programmes list
- Compare view (table comparison)

### Step 26: Admin Dashboard
- Overview stats
- Programme management table
- User management
- Analytics charts

---

## Phase 4: Integration & Polish

### Step 27: API-Web Integration
- React Query setup
- API client service
- Environment configuration

### Step 28: Error Handling & UX
- Toast notifications
- Loading skeletons
- Empty states
- Error boundaries

### Step 29: Responsive Design & Dark Mode
- Mobile-first responsive
- Dark mode with persistence
- Accessibility improvements

### Step 30: Testing
- API unit tests
- E2E tests
- Component tests

