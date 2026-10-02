SELECT 'AcademicUnits without University' AS check_name, COUNT(*) AS problems
FROM "AcademicUnit" a
LEFT JOIN "University" u ON u.id = a."universityId"
WHERE u.id IS NULL

UNION ALL

SELECT 'Departments without AcademicUnit', COUNT(*)
FROM "Department" d
LEFT JOIN "AcademicUnit" a ON a.id = d."academicUnitId"
WHERE a.id IS NULL

UNION ALL

SELECT 'Programmes without Department', COUNT(*)
FROM "Programme" p
LEFT JOIN "Department" d ON d.id = p."departmentId"
WHERE d.id IS NULL

UNION ALL

SELECT 'Programmes without DegreeType', COUNT(*)
FROM "Programme" p
LEFT JOIN "DegreeType" d ON d.id = p."degreeId"
WHERE d.id IS NULL

UNION ALL

SELECT 'Requirements without Programme', COUNT(*)
FROM "ProgrammeRequirement" r
LEFT JOIN "Programme" p ON p.id = r."programmeId"
WHERE p.id IS NULL

UNION ALL

SELECT 'Tuition without Programme', COUNT(*)
FROM "Tuition" t
LEFT JOIN "Programme" p ON p.id = t."programmeId"
WHERE p.id IS NULL

UNION ALL

SELECT 'Admission rules without Programme', COUNT(*)
FROM "ProgrammeAdmissionRule" r
LEFT JOIN "Programme" p ON p.id = r."programmeId"
WHERE p.id IS NULL

UNION ALL

SELECT 'Programme careers without Programme', COUNT(*)
FROM "ProgrammeCareer" pc
LEFT JOIN "Programme" p ON p.id = pc."programmeId"
WHERE p.id IS NULL

UNION ALL

SELECT 'Programme careers without Career', COUNT(*)
FROM "ProgrammeCareer" pc
LEFT JOIN "Career" c ON c.id = pc."careerId"
WHERE c.id IS NULL

UNION ALL

SELECT 'Programme keywords without Programme', COUNT(*)
FROM "ProgrammeKeyword" pk
LEFT JOIN "Programme" p ON p.id = pk."programmeId"
WHERE p.id IS NULL

UNION ALL

SELECT 'Programme keywords without Keyword', COUNT(*)
FROM "ProgrammeKeyword" pk
LEFT JOIN "Keyword" k ON k.id = pk."keywordId"
WHERE k.id IS NULL

ORDER BY problems DESC, check_name;
