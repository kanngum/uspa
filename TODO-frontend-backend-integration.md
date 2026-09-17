# Frontend-Backend Integration Fixes TODO

## 🔴 Critical Issues

### Step 1: Enable CORS on Backend
- [x] Add `app.enableCors()` in `apps/api/src/main.ts`

### Step 2: Add Faculty Lookup by Abbreviation
- [x] Add `GET /faculties/code/:code` endpoint in faculties controller
- [x] Add `findByCode` method in faculties service (supports abbreviation, name, or ID)
- [x] Add `getFacultyByCode()` method in frontend api.ts
- [x] Update `useFaculty()` hook to try code first, fallback to ID

### Step 3: Fix Programme Detail Page (Code vs ID)
- [x] Add `getProgrammeByCode()` method in api.ts
- [x] Add `getFeaturedProgrammes()` method in api.ts
- [x] Add `register()` method in api.ts
- [x] Update `useProgramme()` hook to try code first, fallback to ID
- [x] Update `useFeaturedProgrammes()` hook to use dedicated endpoint

### Step 4: Fix Featured Programmes Hook
- [x] Add `getFeaturedProgrammes()` in api.ts
- [x] Update `useFeaturedProgrammes()` hook to use the dedicated endpoint

### Step 5: Fix Eligibility Checker - Subject Name to ID Resolution
- [x] Update `useCheckEligibility()` hook to resolve subject names to IDs before calling API
- [x] Fetch subjects list and build name-to-ID mapping
- [x] Transform backend `EligibilityResult[]` response to match frontend expected format (`eligible`, `conditionallyEligible`, `notEligible`, `status`, `summary`)

### Step 6: Fix Favourites for Unauthenticated Users
- [x] Add auth token check to `useFavourites()` hook

### Step 7: Add Register Endpoint
- [ ] Add `POST /auth/register` to auth controller
- [ ] Add register logic in auth service
- [ ] Update frontend register page to call API

## 🟡 Nice-to-Have
- [ ] Test all endpoints work end-to-end

