# Implementation Plan - Multi-University Support

## Step 1: UniversitySelector - Keyboard Navigation ✅
- [x] Add ArrowUp/ArrowDown/Enter/Escape handlers
- [x] Track focused index with useState
- [x] Add onKeyDown to each button

## Step 2: Backend - universityId Filter for Programmes ✅
- [x] Add `universityId` param to `ProgrammesService.search()`
- [x] Update `ProgrammesController` to accept query param

## Step 3: Backend - universityId Filter for Faculties ✅
- [x] Add `universityId` param to `FacultiesService.findAll()`
- [x] Update `FacultiesController`

## Step 4: Frontend API - Add universityId to hooks ✅
- [x] Update `useSearchProgrammes` to accept universityId
- [x] Update `useFaculties` to accept universityId
- [x] Update `api.ts` with universityId params
- [x] Update `useFeaturedProgrammes`

## Step 5: Frontend - Filter Homepage Programmes by University ✅
- [x] Update `featuredProgrammes` query with university context
- [x] Update stats to reflect selected university
- [x] Update header to show selected university name

## Step 6: Frontend - Filter Programmes Page by University ✅
- [x] Update `programmes/page.tsx` to filter by selected university

## Step 7: Frontend - Filter Admission Checker by University ✅
- [x] Update `admission-checker/page.tsx`

## Step 8: Admin - Universities Tab ✅
- [x] Add universities admin hooks
- [x] Add universities API endpoints
- [x] Build university management UI in admin

## Step 9: Admin - Programme Creation with University Context ✅
- [x] Add university selector to programme create/edit modal
- [x] Filter departments by selected university

## Step 10: Admin - Faculties/Departments with University Context ✅
- [x] Add university filter to faculties/departments management

## Step 11: Footer - Remove UBa-specific info
- [x] Replace UBa contact info with BTRC info
- [x] Make footer generic (not university-specific)

## Step 12: AI Advisor - Verify functionality
- [x] AI advisor service logic reviewed and working

