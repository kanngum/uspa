# JSON Import Guide — USPA

This guide explains how to upload JSON data into the USPA system through the Admin Import interface.

---

## 1. Prerequisites

- You must have an **ADMIN account** (login at `/login`)
- Access the import page at `/admin/import`
- The API server must be running on `http://localhost:3001`

---

## 2. Import Workflow (3 Steps)

### Step 1 — Input Data

1. Select an **Import Type** from the dropdown
2. Either:
   - **Upload a `.json` file** by clicking the "Upload .json file" button, OR
   - **Paste JSON** directly into the textarea
3. Click **"Validate and Preview"**

### Step 2 — Validate & Preview

- The system checks every row for required fields, duplicates, and foreign key references
- Valid rows show a ✅ green checkmark; invalid rows show a ❌ red X
- Hover over errors to see what needs fixing
- If there are errors, fix the JSON and re-validate

### Step 3 — Confirm Import

- Click **"Confirm Import"** (only enabled if all rows are valid)
- The system inserts the data into the database
- A summary shows how many rows were **Created**, **Skipped**, or had **Errors**

---

## 3. JSON Format for Each Import Type

### 3.1 Faculties (`faculties`)

Import faculties/schools under the university. A **University** must already exist in the database (seeded automatically).

```json
[
  {
    "name": "Faculty of Science",
    "abbreviation": "FOS",
    "description": "Faculty of Science",
    "type": "FACULTY"
  },
  {
    "name": "College of Technology",
    "abbreviation": "COLTECH",
    "description": "College of Technology",
    "type": "SCHOOL"
  }
]
```

| Field          | Required | Description                                                                |
|----------------|----------|----------------------------------------------------------------------------|
| `name`         | ✅ Yes    | Faculty/School name (must be unique; case-insensitive check)               |
| `abbreviation` | ❌ No     | Short code (e.g., FOS, COLTECH)                                            |
| `description`  | ❌ No     | Optional description                                                       |
| `type`         | ❌ No     | `"FACULTY"` (default) or `"SCHOOL"`                                        |

### 3.2 Departments (`departments`)

Departments belong to a Faculty/School. The referenced **faculties must already exist** in the database.

```json
[
  {
    "name": "Department of Computer Science",
    "abbreviation": "CS",
    "description": "Computer Science department",
    "facultyName": "Faculty of Science"
  },
  {
    "name": "Department of Mathematics",
    "facultyName": "Faculty of Science"
  }
]
```

| Field          | Required | Description                                           |
|----------------|----------|-------------------------------------------------------|
| `name`         | ✅ Yes    | Department name                                       |
| `abbreviation` | ❌ No     | Short code                                            |
| `description`  | ❌ No     | Optional description                                  |
| `facultyId`    | ❌ No     | UUID of the parent faculty (use `facultyName` instead) |
| `facultyName`  | ❌ No     | Name of the parent faculty (case-insensitive match)    |

> **Note:** You can reference the parent faculty by either `facultyId` (UUID in DB) or `facultyName` (human-readable name). Using `facultyName` is easier.

### 3.3 Programmes (`programmes`)

Full programme catalogue. The referenced **departments must already exist**.

```json
[
  {
    "name": "Bachelor of Science in Computer Science",
    "code": "CS-BSC-01",
    "degree": "BSC",
    "level": "UNDERGRADUATE",
    "duration": 3,
    "description": "A 3-year undergraduate programme",
    "departmentName": "Department of Computer Science"
  },
  {
    "name": "Master of Science in Data Science",
    "code": "DS-MSC-01",
    "degree": "MSC",
    "level": "POSTGRADUATE",
    "duration": 2,
    "description": "",
    "departmentName": "Department of Computer Science"
  }
]
```

| Field            | Required | Description                                                            |
|------------------|----------|------------------------------------------------------------------------|
| `name`           | ✅ Yes    | Programme name                                                         |
| `code`           | ✅ Yes    | Unique programme code (e.g., CS-BSC-01). Must be unique in the system  |
| `degree`         | ✅ Yes    | Degree type — one of: `BSC`, `BA`, `BENG`, `BED`, `LLB`, `MBBS`, `HND`, `DIPLOMA`, `PGD`, `MSC`, `MA`, `MENG`, `PHD`, `CERTIFICATE`, `BTECH`, `HPD` |
| `level`          | ✅ Yes    | Programme level — `UNDERGRADUATE`, `POSTGRADUATE`, `DOCTORATE`, or `PROFESSIONAL` |
| `duration`       | ✅ Yes    | Duration in years (integer)                                            |
| `description`    | ❌ No     | Optional description                                                   |
| `departmentId`   | ❌ No     | UUID of the parent department (use `departmentName` instead)           |
| `departmentName` | ❌ No     | Name of the parent department (case-insensitive match)                 |

### 3.4 Subjects (`subjects`)

O Level and A Level subjects. Names must be **unique** (case-insensitive).

```json
[
  { "name": "Mathematics", "code": "MATH", "level": "O_LEVEL" },
  { "name": "English Language", "code": "ENG", "level": "O_LEVEL" },
  { "name": "Biology", "code": "BIO", "level": "A_LEVEL" },
  { "name": "Chemistry", "code": "CHEM", "level": "A_LEVEL" },
  { "name": "Physics", "code": "PHY", "level": "A_LEVEL" }
]
```

| Field   | Required | Description                                    |
|---------|----------|------------------------------------------------|
| `name`  | ✅ Yes    | Subject name (must be unique)                  |
| `code`  | ❌ No     | Subject code (e.g., MATH, BIO)                 |
| `level` | ✅ Yes    | `"O_LEVEL"` or `"A_LEVEL"` (case-insensitive)  |

### 3.5 Requirements (`requirements`)

Admission subject requirements for programmes. Both the **programme** and **subject** must already exist.

```json
[
  {
    "programmeCode": "CS-BSC-01",
    "subjectName": "Mathematics",
    "requirementType": "REQUIRED",
    "minimumGrade": "C"
  },
  {
    "programmeCode": "CS-BSC-01",
    "subjectName": "English Language",
    "requirementType": "REQUIRED",
    "minimumGrade": "C"
  },
  {
    "programmeCode": "CS-BSC-01",
    "subjectName": "Physics",
    "requirementType": "OPTIONAL"
  }
]
```

| Field             | Required | Description                                              |
|-------------------|----------|----------------------------------------------------------|
| `programmeCode`   | ✅ Yes    | Programme code (must exist in DB)                        |
| `programmeId`     | ❌ No     | UUID of the programme (use `programmeCode` instead)      |
| `subjectName`     | ✅ Yes    | Subject name (must exist in DB, case-insensitive match)  |
| `subjectId`       | ❌ No     | UUID of the subject (use `subjectName` instead)          |
| `requirementType` | ❌ No     | `"REQUIRED"` (default) or `"OPTIONAL"`                   |
| `minimumGrade`    | ❌ No     | Minimum grade required (e.g., `"C"`, `"B"`, `"A"`)      |

### 3.6 Tuition (`tuition`)

Programme tuition fees per academic year. The **programme** must already exist.

```json
[
  {
    "programmeCode": "CS-BSC-01",
    "academicYear": "2024/2025",
    "amount": 500000,
    "currency": "XAF"
  },
  {
    "programmeCode": "CS-BSC-01",
    "academicYear": "2025/2026",
    "amount": 550000,
    "currency": "XAF"
  },
  {
    "programmeCode": "DS-MSC-01",
    "academicYear": "2024/2025",
    "amount": 750000,
    "currency": "XAF"
  }
]
```

| Field           | Required | Description                                              |
|-----------------|----------|----------------------------------------------------------|
| `programmeCode` | ✅ Yes    | Programme code (must exist in DB)                        |
| `programmeId`   | ❌ No     | UUID of the programme (use `programmeCode` instead)      |
| `academicYear`  | ✅ Yes    | e.g., `"2024/2025"`, `"2025/2026"`                      |
| `amount`        | ✅ Yes    | Tuition amount (number, e.g., 500000)                    |
| `currency`      | ❌ No     | Currency code — defaults to `"XAF"`                     |

### 3.7 Careers (`careers`)

Career names and descriptions. Names must be **unique**.

```json
[
  { "name": "Software Engineer", "description": "Designs and develops software applications" },
  { "name": "Data Scientist", "description": "Analyzes complex data to inform business decisions" },
  { "name": "Network Administrator", "description": "Manages and maintains computer networks" }
]
```

| Field         | Required | Description         |
|---------------|----------|---------------------|
| `name`        | ✅ Yes    | Career name (unique) |
| `description` | ❌ No     | Optional description |

---

## 4. Example: Full Import Sequence (Recommended Order)

Since many import types depend on previously imported data, follow this order:

```
1. Faculties     → (no dependencies)
2. Departments   → (needs: Faculties)
3. Programmes    → (needs: Departments)
4. Subjects      → (no dependencies)
5. Requirements  → (needs: Programmes + Subjects)
6. Tuition       → (needs: Programmes)
7. Careers       → (no dependencies)
```

### Sample File: `scripts/faculties.json`

The repo includes a sample file at `scripts/faculties.json` with University of Bamenda data. However, note that this file has a **nested structure** (wraps data under `university` and `academicUnits` keys). The import system expects a **flat array** of objects. So if you want to use that file, you need to extract just the `academicUnits` array:

```json
[
  { "name": "Faculty of Arts", "abbreviation": "FA", "type": "FACULTY", "description": "Faculty of Arts" },
  { "name": "Faculty of Science", "abbreviation": "FOS", "type": "FACULTY", "description": "Faculty of Science" },
  { "name": "College of Technology", "abbreviation": "COLTECH", "type": "SCHOOL", "description": "College of Technology" }
]
```

---

## 5. Using cURL (Direct API Access)

You can also call the import API directly for automation:

### Validate
```bash
curl -X POST http://localhost:3001/api/import/validate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "type": "faculties",
    "data": [
      { "name": "Faculty of Science", "abbreviation": "FOS", "type": "FACULTY" }
    ]
  }'
```

### Confirm Import
```bash
curl -X POST http://localhost:3001/api/import/confirm \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "type": "faculties",
    "data": [
      { "name": "Faculty of Science", "abbreviation": "FOS", "type": "FACULTY", "description": "Faculty of Science" }
    ]
  }'
```

---

## 6. Troubleshooting

| Error | Cause | Solution |
|-------|-------|----------|
| `No university found` | No University record in DB | Run the seed script first |
| `"X" already exists` | Duplicate name/code | Use a unique value or delete the existing record first |
| `Faculty not found: X` | Referenced faculty doesn't exist | Import faculties first, or check the name spelling |
| `Department not found` | Referenced department doesn't exist | Import departments first |
| `Programme not found` | Referenced programme doesn't exist | Import programmes first |
| `Subject not found` | Referenced subject doesn't exist | Import subjects first |
| `401 Unauthorized` | No valid JWT token | Log in as admin via `/login` |
| `403 Forbidden` | User is not ADMIN | Contact another admin to upgrade your role |

---

## 7. Starting the Dev Server

```bash
# Terminal 1 — Start the API
cd apps/api && npm run start:dev

# Terminal 2 — Start the frontend
cd apps/web && npm run dev

# Frontend: http://localhost:3000
# API: http://localhost:3001
```

Then go to **http://localhost:3000/admin/import** to access the import page.

