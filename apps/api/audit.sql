SELECT
  (SELECT COUNT(*) FROM "Programme") AS programmes,
  (SELECT COUNT(*) FROM "DegreeType") AS degree_types,
  (SELECT COUNT(*) FROM "ProgrammeRequirement") AS requirements,
  (SELECT COUNT(*) FROM "Tuition") AS tuition_records,
  (SELECT COUNT(*) FROM "ProgrammeAdmissionRule") AS admission_rules,
  (SELECT COUNT(*) FROM "ProgrammeCareer") AS programme_careers,
  (SELECT COUNT(*) FROM "ProgrammeKeyword") AS programme_keywords;
