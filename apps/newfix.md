Yes. We had a fairly broad improvement plan for USPA. The important thing is that we **did not intend to jump straight into AI**. We wanted to make the core platform reliable first.

## USPA improvement plan

### 1. Complete the academic hierarchy
This was one of the major improvements and is now largely implemented.

``` 
University
   ↓
Academic Unit
   ↓
Department
   ↓
Programme
```

The admin should be able to:

- Create and manage universities
- Create and manage academic units
- Create and manage departments
- Create and manage programmes
- Filter programmes through the hierarchy
- Keep data belonging to different universities properly separated
We also moved away from hard-coded faculty assumptions toward configurable **Academic Units** and **Degree Types**.

---

## 2. Make Programme management complete
We wanted a programme to become a complete information record rather than just a programme name.

Each programme should properly support:

- Degree
- Programme level
- Duration
- Description
- Award type
- Entry requirements
- Application deadline
- Application status
- Application cycle
- Source document
- Admission rules
- Subject requirements
- Tuition
- Careers
- Keywords
- Announcements
- Active/inactive status

### Recently added
We started adding:

```
isFeatured
featuredOrder
```

This will allow administrators to select and order featured programmes.

---

# 3. Audit all Programme child data
This was our **next major audit**.

For every programme, we wanted to verify:

```
Programme
├── Degree
├── Requirements
├── Tuition
├── Admission Rules
├── Careers
└── Keywords
```

The plan was specifically:

```
Schema
   ↓
API
   ↓
Admin interface
   ↓
Frontend
   ↓
University scoping
```

We agreed to **measure what currently exists first**, rather than immediately modifying things.

---

# 4. Improve the admission/eligibility engine
This is one of the most important parts of USPA.

We wanted the system to check:

### General university rules first
Then:

### Faculty/academic-unit rules
Then:

### Programme-specific rules
The result should clearly distinguish:

- **Eligible**
- **Conditionally eligible**
- **Not eligible**
- Missing requirements
- Why the requirement was not met
- Possible alternative programmes
The rules engine was planned to support things such as:

- O/L minimum subjects
- A/L minimum subjects
- One-sitting requirements
- Compulsory subjects
- Optional subjects
- Minimum grades
- English requirements
- Mathematics requirements
- Direct entry
- Conversion routes
- Special qualifications
- Programme-specific rules
- Remarks/explanations
The known current baseline includes:

```
A/L ≥ 2 subjects in one sitting
O/L ≥ 4 subjects
English test exception
Remedial Mathematics when O/L Mathematics is absent
```

---

# 5. Improve Programme search
The search system was planned to go beyond exact programme names.

Users should eventually be able to search using:

- Programme name
- Keyword
- Academic unit
- Department
- Career
- Subject
- Degree
- Programme level
We also discussed:

- Autocomplete
- Better keyword matching
- Fuzzy search
- More useful search results

---

# 6. Programme comparison
Users should be able to compare programmes side by side.

For example:

InformationProgramme AProgramme BDegreeDurationRequirementsTuitionCareersAdmission status

The goal is to make programme selection easier without forcing users to open several pages separately.

---

# 7. Saved programmes and history
We already have the underlying concepts for:

- Saved programmes
- Search history
The improvement plan was to make these useful in the user experience.

A student should be able to:

- Save a programme
- Return to it later
- Review previous searches
- Compare saved programmes

---

# 8. Recommendation system
After the core eligibility system is reliable, we planned a recommendation layer.

This includes:

### Alternative programmes
If a student does not qualify for Programme A, USPA can identify programmes whose requirements better match their results.

### Similar programmes
For example:

```
Software Engineering
Computer Science
Information Technology
Computer Engineering
```

### Career-based recommendations
A user could express an interest such as:

> "I want to work in cybersecurity."
USPA could identify relevant programmes and career pathways.

### Gap analysis
Instead of simply saying:

> Not eligible.
The system should explain:

> You are missing Mathematics and Physics.
That gives the student actionable information.

---

# 9. Improve the Programme results experience
We had also been refining the UI.

The direction was:

- Classic
- Professional
- Clean
- Not flashy
- Easy to scan
- Preserve the existing colour scheme
- Avoid unnecessary visual redesigns
We specifically wanted programme results to look more polished and useful.

---

# 10. Improve the university/programme selection interface
We had worked on the selection experience, including the university selector.

The interface should:

- Handle many universities cleanly
- Have a smaller/scrollable dropdown
- Avoid oversized lists
- Make selection straightforward
The larger design goal was to make the academic journey feel logical:

```
University
   ↓
Academic Unit
   ↓
Department
   ↓
Programme
```

We also wanted the journey/tree presentation to be **horizontal rather than a long vertical map** where appropriate.

---

# 11. Admin system improvements
The administrator should be able to manage the actual academic catalogue rather than relying on developers.

Planned management areas included:

- Universities
- Academic Units
- Departments
- Programmes
- Degree Types
- Subjects
- Requirements
- Admission Rules
- Keywords
- Careers
- Tuition
- Deadlines
- Announcements
- Programme status
- Featured programmes
The admin side should also support reviewing imported data and identifying records that need attention.

---

# 12. Catalogue/data quality controls
We planned an explicit **Catalogue Review** process.

This is important because USPA's recommendations are only as good as the underlying university data.

We wanted to detect things such as:

- Incomplete programmes
- Missing requirements
- Missing tuition
- Missing admission rules
- Missing careers
- Missing keywords
- Duplicate records
- Incorrect university relationships
- Programmes requiring review
The `needsReview` and `reviewNotes` fields already support part of this concept.

---

# 13. University data isolation
Because USPA is designed around a university hierarchy, we identified university isolation as something that needs auditing.

For example:

```
University A
    Programme A1
    Programme A2

University B
    Programme B1
    Programme B2
```

A query for University A should never accidentally return University B's programmes.

This needs to be checked across:

- API
- Admin
- Search
- Eligibility
- Recommendations
- Compare
- Favourites
- Analytics

---

# 14. Analytics
We planned analytics around how users interact with the system.

Potential areas already identified include:

- Searches
- Programme views
- Saved programmes
- Eligibility checks
- Recommendations
- Popular programmes
- User activity
The purpose is not just statistics. It can help identify what students are actually looking for.

---

# 15. AI Advisor
**AI was deliberately planned after the core system is stable.**

The architecture we discussed was:

```
User question
      ↓
NLP / context extraction
      ↓
Structured USPA data retrieval
      ↓
Relevant university/programme/rule data
      ↓
Grounded LLM response
      ↓
Clear explanation
```

The important principle is:

> **The AI should retrieve verified USPA data rather than invent university information.**
This is especially important for admission requirements.

---

# 16. Future AI capabilities
The broader AI roadmap included:

- Natural-language programme advisor
- Programme explanations
- Eligibility explanations
- Career guidance
- OCR for result slips/documents
- WhatsApp interaction
- Voice interaction
- Scholarship information
But these were **later-stage improvements**, not the immediate priority.

---

# 17. Other planned intelligent features
The broader roadmap also included:

- Intelligent programme discovery
- Career pathways
- Gap analysis
- Similar-programme recommendations
- Alternative-programme recommendations
- Context-aware search

---

# 18. The overall development order we agreed on
The most important part is the order.

We were essentially moving toward:

```
PHASE 1
Core academic structure
        ↓
PHASE 2
Programme data completeness
        ↓
PHASE 3
Admission and eligibility accuracy
        ↓
PHASE 4
Search / Compare / Favourites
        ↓
PHASE 5
Recommendations
        ↓
PHASE 6
Catalogue quality + Analytics
        ↓
PHASE 7
AI Advisor
        ↓
PHASE 8
OCR / WhatsApp / Voice / other advanced features
```

### Where we actually are now
I would place us around:

```
Academic hierarchy        ✅ Implemented
Core database structure   ✅ Strong foundation
Prisma configuration      ✅ Working
Programme model           ✅ Strong foundation
Featured programmes       🟡 In progress
Programme audit           🟡 Next major task
Database connection       🔴 Currently blocked by .env/Docker
Eligibility audit         🟡 Pending
Search/Compare audit      🟡 Pending
Recommendations           🟡 Pending
AI Advisor                ⏳ Later
```

So our immediate job is **not to start building another feature**.

It is to get PostgreSQL/Docker working again, then continue the **systematic audit of the existing USPA implementation**. That prevents us from adding new code on top of hidden problems.