# USPA Phase 2 Implementation Todo

## Step 1: Subject Module (New Module)
- [x] Create `subjects/subject.controller.ts` with CRUD endpoints
- [x] Create `subjects/subject.service.ts` with business logic
- [x] Create `subjects/subject.module.ts` with DI wiring
- [x] Register SubjectModule in AppModule

## Step 2: Programme Requirements Module (New Module)
- [x] Create `requirements/requirements.controller.ts` with CRUD endpoints
- [x] Create `requirements/requirements.service.ts` with business logic
- [x] Create `requirements/requirements.module.ts` with DI wiring
- [x] Register RequirementsModule in AppModule

## Step 3: Academic Unit CRUD (Update Existing)
- [x] Add POST /faculties endpoint
- [x] Add PATCH /faculties/:id endpoint
- [x] Add DELETE /faculties/:id endpoint
- [x] Add pagination & search to GET /faculties

## Step 4: Programme CRUD (Update Existing)
- [x] Add POST /programmes endpoint
- [x] Add PATCH /programmes/:id endpoint
- [x] Add DELETE /programmes/:id endpoint

## Step 5: Search Engine Optimization
- [x] Add pagination & search to GET /faculties
- [x] Add faculty type filter (FACULTY/SCHOOL)
- [x] Improve autocomplete with career/keyword matching (already existed in backend)
- [ ] Add full-text search support (requires DB index, for later)

## Step 6: Eligibility Engine Improvements
- [x] MVP done - subject/grade evaluation
- [ ] Add weighted scoring system (future enhancement)
- [ ] Better conditional eligibility logic (future enhancement)

## Step 7: Authentication & Authorization Refinements
- [x] Apply @Roles('ADMIN') decorator to admin controller
- [x] Ensure RolesGuard properly restricts admin routes
- [x] Login restricted to admin roles only (already in AuthService)

## Step 8: Complete Admin API
- [x] Add POST /admin/programmes (create programme)
- [x] Add subject management from admin (GET/POST/PUT/DELETE)
- [x] Add delete faculty/dept logic (already existed via admin endpoints)
- [x] Admin endpoints now protected with @Roles('ADMIN')

## Step 9: Fix Frontend API Client
- [x] Fix autocomplete endpoint URL pattern
- [x] Fix favourites endpoints (POST/DELETE to use programmeId in URL)
- [x] Add missing API methods (subjects, comparison table, admin users)
- [x] Fix recommendations endpoints to match backend pattern
- [x] Remove register endpoint (backend doesn't have it)
- [x] Fix eligibility input to use subjectId instead of name

## Step 10: Frontend Page Implementation
- [x] Programmes listing page - Full UI with grid/list views, search, filters, pagination
- [x] Programme detail page - Overview, requirements, tuition, careers tabs + sidebar with similar programmes
- [x] Faculty listing page - All faculties with department lists and programme counts
- [x] Faculty detail page - Faculty info with departments and their programmes
- [x] Admission checker page - Step-by-step O/A Level input with eligibility results
- [x] AI advisor page - Chat interface with programme suggestions and follow-up queries
- [x] Compare page - Side-by-side comparison table of up to 4 programmes
- [x] Favourites page - Saved programmes list with remove functionality
- [x] Login page - Admin login with form validation and auth status
- [x] Register page - Updated to show restricted registration notice (admin-only system)
- [x] Admin dashboard - Stats cards, programme table, tabs for management sections

## Step 11: Frontend Hook & Lint Alignment
- [x] Fixed `useEligibility.ts` - Changed input from `{name, grade}` to `{subjectId, grade}`
- [x] Fixed `useFavourites.ts` - Changed `removeFavourite` to accept `programmeId` instead of stored fav id
- [x] Fixed `useRecommendations.ts` - Removed unused `useMutation` import
- [x] Fixed `useAuth.ts` - Removed non-existent `register` export, added `enabled` guard for profile query
- [x] Fixed `register/page.tsx` - Removed `register` mutation usage, added restricted registration notice
- [x] Fixed `api.ts` - Aligned all endpoints with actual backend routes
- [x] Fixed `eligibility.controller.ts` - Removed unused `ValidationPipe` import
- [x] Fixed `requirements.controller.ts` - Removed unused `Query` import

