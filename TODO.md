# USPA Phase 3 Implementation Todo

## Phase 3: Data Management

### Step 1: Add Missing Admin CRUD Endpoints (Backend)
- [x] Add tuition CRUD to admin controller/service
- [x] Add career CRUD to admin controller/service
- [x] Add keyword CRUD to admin controller/service
- [x] Add GeneralAdmissionRule CRUD to admin controller/service
- [x] Add Department delete endpoint to admin controller/service
- [x] Add programme-career/keyword association endpoints
- [x] Add Faculty delete endpoint with guards
- [x] Add duplicate detection endpoints (/admin/duplicates/*)

### Step 2: Create Import Module (Backend)
- [x] Create `import/import.module.ts`
- [x] Create `import/import.controller.ts` with POST /import/validate, /import/preview, /import/confirm
- [x] Create `import/import.service.ts` with parse, validate, preview, import logic
- [x] Register ImportModule in AppModule

### Step 3: Add Duplicate Detection (Backend)
- [x] Add GET /admin/duplicates/faculties endpoint
- [x] Add GET /admin/duplicates/programmes endpoint
- [x] Add GET /admin/duplicates/subjects endpoint

### Step 4: Update Frontend API Client
- [x] Add tuition, career, keyword, admission rules methods
- [x] Add import endpoints methods
- [x] Add duplicate detection methods
- [x] Add department delete method
- [x] Add programme requirement management methods

### Step 5: Create Frontend Hooks
- [x] Create useAdminTuition.ts
- [x] Create useAdminCareers.ts
- [x] Create useAdminKeywords.ts
- [x] Create useAdminImport.ts
- [x] Update useAdmin.ts with new methods
- [x] Add requirement hooks

### Step 6: Complete Admin Dashboard Frontend
- [x] Build full Programmes tab with CRUD modals
- [x] Build Users tab with role management
- [x] Build Subjects tab with CRUD
- [x] Build Tuition tab
- [x] Build Careers tab
- [x] Build Keywords tab
- [x] Build Requirements tab
- [x] Build Announcements tab (complete)
- [x] Build Import tab
- [x] Build Duplicates tab
- [x] Build Analytics tab with real charts

### Step 7: Admin Import Page
- [x] Create admin/import inline tab with JSON upload UI
- [x] Add validate, preview, confirm workflow
- [x] Show import results

### Step 8: Admin Duplicates Page
- [x] Create admin/duplicates inline tab
- [x] Show duplicate detection results
- [x] Add merge/resolve actions

