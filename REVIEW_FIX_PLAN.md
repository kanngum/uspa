# USPA Review Fix Plan

## Priority Order (High to Low)

### 🔴 CRITICAL (3)
1. **Backend: Add `POST /auth/register` endpoint** - AuthController + AuthService
2. **Frontend: Fix register page malformed JSX** - Unclosed divs
3. **Fix `CreateAcademicUnitDto` use `abbreviation` instead of `code`**

### 🟡 HIGH (4)
4. **Fix AcademicUnitsController response format** - Wrap in `{ success, data }`  
5. **Fix eligibility checker subject name mapping** - Use API-fetched subjects
6. **Fix programmes page faculty filter** - Use dynamic faculty options from API
7. **Allow non-admin users to log in** - Remove admin-only restriction for login

### 🟡 MEDIUM (3)
8. **Fix footer placeholder links** - Point to valid routes
9. **Update shared types UserRole to match Prisma schema** - VISITOR/STUDENT/ADMIN
10. **Add import upload/quick endpoints** - Implement missing ImportController endpoints

### 🟢 LOW (3)
11. **Add full-text search index to Programme table** - Prisma schema migration note
12. **Address SubjectModule duplication** - Remove duplicates
13. **Better error handling in AcademicUnitsService** - Add NotFoundException checks

