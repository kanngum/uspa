# Implementation TODO

## Backend Changes
- [x] Add `normalizeNestedData()`, `completeImport()`, `uploadAndValidate()` to ImportService
- [x] Add POST /import/upload and POST /import/quick endpoints to ImportController
- [x] Allow all active users (STUDENT role) to log in

## Frontend API & Hooks
- [x] Add `importUpload()` and `importQuick()` methods to api.ts
- [x] Add `useImportUpload()` and `useImportQuick()` hooks to useAdmin.ts

## Register Flow
- [x] Add register mutation to useAuth.ts
- [x] Update register page to call API (not just show warning)

## Import Page Enhancement
- [ ] Add drag-and-drop zone with visual feedback
- [ ] Auto-detect import type from JSON structure (e.g., `{ academicUnits: [...] }`)
- [ ] One-click "Quick Import" button
- [ ] Show detected type badge for nested JSON uploads

## Verification
- [ ] Restart NestJS backend on port 3001
- [ ] Verify no TypeScript errors
