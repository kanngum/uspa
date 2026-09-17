"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { GraduationCap, Plus, Trash2, Search, CheckCircle2, XCircle, AlertCircle, ArrowRight, RefreshCw, UserCheck, BookOpen, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import { useCheckEligibility } from "@/app/lib/hooks/useEligibility";
import { useSearchProgrammes } from "@/app/lib/hooks/useProgrammes";
import { useUniversity } from "@/app/lib/context/UniversityContext";
import { getEligibilityBadgeColor } from "@/app/lib/utils";

const oLevelSubjects = [
  { value: "English Language", label: "English Language" },
  { value: "Mathematics", label: "Mathematics" },
  { value: "Biology", label: "Biology" },
  { value: "Chemistry", label: "Chemistry" },
  { value: "Physics", label: "Physics" },
  { value: "Geography", label: "Geography" },
  { value: "History", label: "History" },
  { value: "Economics", label: "Economics" },
  { value: "Literature in English", label: "Literature in English" },
  { value: "French Language", label: "French Language" },
  { value: "Civic Education", label: "Civic Education" },
  { value: "Commerce", label: "Commerce" },
  { value: "Accounting", label: "Accounting" },
  { value: "Computer Science", label: "Computer Science" },
  { value: "Additional Mathematics", label: "Additional Mathematics" },
  { value: "Agricultural Science", label: "Agricultural Science" },
  { value: "Religious Studies", label: "Religious Studies" },
  { value: "Fine Arts", label: "Fine Arts" },
  { value: "Music", label: "Music" },
  { value: "Physical Education", label: "Physical Education" },
  { value: "Food and Nutrition", label: "Food and Nutrition" },
  { value: "Clothing and Textiles", label: "Clothing and Textiles" },
  { value: "Literature in French", label: "Literature in French" },
  { value: "Office Practice", label: "Office Practice" },
];

const aLevelSubjects = [
  { value: "Mathematics", label: "Mathematics" },
  { value: "Further Mathematics", label: "Further Mathematics" },
  { value: "Physics", label: "Physics" },
  { value: "Chemistry", label: "Chemistry" },
  { value: "Biology", label: "Biology" },
  { value: "Economics", label: "Economics" },
  { value: "Geography", label: "Geography" },
  { value: "History", label: "History" },
  { value: "Literature in English", label: "Literature in English" },
  { value: "French Language", label: "French Language" },
  { value: "Computer Science", label: "Computer Science" },
  { value: "Accounting", label: "Accounting" },
  { value: "Commerce", label: "Commerce" },
  { value: "English Language", label: "English Language" },
  { value: "Sociology", label: "Sociology" },
  { value: "Psychology", label: "Psychology" },
  { value: "Geology", label: "Geology" },
  { value: "Philosophy", label: "Philosophy" },
  { value: "Political Science", label: "Political Science" },
];

const gradeOptions = [
  { value: "A", label: "A - Excellent" },
  { value: "B", label: "B - Very Good" },
  { value: "C", label: "C - Good" },
  { value: "D", label: "D - Fair" },
  { value: "E", label: "E - Pass" },
  { value: "F", label: "F - Fail" },
];

const levelOptions = [
  { value: "UNDERGRADUATE", label: "Undergraduate" },
  { value: "POSTGRADUATE", label: "Postgraduate" },
  { value: "DOCTORATE", label: "Doctorate" },
  { value: "PROFESSIONAL", label: "Professional" },
];

const oLevelGradeOptions = [
  { value: "A1", label: "A1 - Excellent" },
  { value: "B2", label: "B2 - Very Good" },
  { value: "B3", label: "B3 - Good" },
  { value: "C4", label: "C4 - Credit" },
  { value: "C5", label: "C5 - Credit" },
  { value: "C6", label: "C6 - Credit" },
  { value: "D7", label: "D7 - Pass" },
  { value: "E8", label: "E8 - Pass" },
  { value: "F9", label: "F9 - Fail" },
];

export default function AdmissionCheckerPage() {
  const searchParams = useSearchParams();
  const { selectedUniversity } = useUniversity();
  const [step, setStep] = useState(1);
  const [oLevelSubjectsList, setOLevelSubjectsList] = useState([{ subject: "", grade: "" }]);
  const [aLevelSubjectsList, setALevelSubjectsList] = useState([{ subject: "", grade: "" }]);
  const [selectedLevel, setSelectedLevel] = useState(searchParams.get("level") || "UNDERGRADUATE");
  const [studentType, setStudentType] = useState<"FRESHMAN" | "DIRECT_ENTRY" | "TRANSFER">("FRESHMAN");
  const [ugDegree, setUgDegree] = useState({ degreeName: "", institution: "", graduationYear: "", classification: "", degreeLabel: "", previousProgrammeId: "" });
  const [results, setResults] = useState<any>(null);
  const { addToast } = useToast();
  const checkEligibility = useCheckEligibility();

  const isPostgraduateLevel = selectedLevel === "POSTGRADUATE" || selectedLevel === "DOCTORATE";

  // Fetch programmes for the degree dropdown
  // POSTGRADUATE -> previous level is UNDERGRADUATE
  // DOCTORATE -> previous level is POSTGRADUATE (Masters)
  const previousLevel = selectedLevel === "POSTGRADUATE" ? "UNDERGRADUATE" : selectedLevel === "DOCTORATE" ? "POSTGRADUATE" : null;
  const { data: previousProgrammes } = useSearchProgrammes(
    previousLevel ? { level: previousLevel, universityId: selectedUniversity?.id, limit: 200 } : { limit: 0 }
  );

  const degreeOptions = useMemo(() => {
    if (!previousProgrammes?.data) return [];
    return previousProgrammes.data.map((p: any) => ({
      value: p.code,
      label: `${p.name} (${p.code})`,
    }));
  }, [previousProgrammes]);

  // Reset degree selection when level changes
  useEffect(() => {
    setUgDegree({ degreeName: "", institution: "", graduationYear: "", classification: "", degreeLabel: "", previousProgrammeId: "" });
  }, [selectedLevel]);

  const addSubject = (level: "o" | "a") => {
    if (level === "o") {
      if (oLevelSubjectsList.length < 12) {
        setOLevelSubjectsList([...oLevelSubjectsList, { subject: "", grade: "" }]);
      }
    } else {
      if (aLevelSubjectsList.length < 6) {
        setALevelSubjectsList([...aLevelSubjectsList, { subject: "", grade: "" }]);
      }
    }
  };

  const removeSubject = (level: "o" | "a", index: number) => {
    if (level === "o") {
      if (oLevelSubjectsList.length > 1) {
        setOLevelSubjectsList(oLevelSubjectsList.filter((_, i) => i !== index));
      }
    } else {
      if (aLevelSubjectsList.length > 1) {
        setALevelSubjectsList(aLevelSubjectsList.filter((_, i) => i !== index));
      }
    }
  };

  const updateSubject = (level: "o" | "a", index: number, field: "subject" | "grade", value: string) => {
    if (level === "o") {
      const updated = [...oLevelSubjectsList];
      updated[index] = { ...updated[index], [field]: value };
      setOLevelSubjectsList(updated);
    } else {
      const updated = [...aLevelSubjectsList];
      updated[index] = { ...updated[index], [field]: value };
      setALevelSubjectsList(updated);
    }
  };

  const handleCheck = () => {
    if (isPostgraduateLevel) {
      if (!ugDegree.degreeName || !ugDegree.classification) {
        addToast("Please select your degree and classification", "warning");
        return;
      }

      checkEligibility.mutate(
        {
          oLevelSubjects: [],
          aLevelSubjects: [],
          level: selectedLevel,
          ugDegree: {
            ...ugDegree,
            // Find the programme name from the selected code
            degreeLabel: previousProgrammes?.data?.find((p: any) => p.code === ugDegree.degreeName)?.name || ugDegree.degreeName,
          },
        },
        {
          onSuccess: (data: any) => {
            setResults(data?.data || data);
            addToast("Eligibility check complete!", "success");
          },
          onError: (error: any) => {
            addToast(error?.message || "Failed to check eligibility", "error");
          },
        }
      );
      return;
    }

    const oLevelSubjects = oLevelSubjectsList
      .filter(s => s.subject && s.grade)
      .map(s => ({ name: s.subject, grade: s.grade }));

    const aLevelSubjects = aLevelSubjectsList
      .filter(s => s.subject && s.grade)
      .map(s => ({ name: s.subject, grade: s.grade }));

    if (oLevelSubjects.length === 0 || aLevelSubjects.length === 0) {
      addToast("Please enter at least one subject in each section", "warning");
      return;
    }

    checkEligibility.mutate(
      { oLevelSubjects, aLevelSubjects, level: selectedLevel },
      {
        onSuccess: (data: any) => {
          setResults(data?.data || data);
          addToast("Eligibility check complete!", "success");
        },
        onError: (error: any) => {
          addToast(error?.message || "Failed to check eligibility", "error");
        },
      }
    );
  };

  const resetForm = () => {
    setStep(1);
    setOLevelSubjectsList([{ subject: "", grade: "" }]);
    setALevelSubjectsList([{ subject: "", grade: "" }]);
    setUgDegree({ degreeName: "", institution: "", graduationYear: "", classification: "", degreeLabel: "", previousProgrammeId: "" });
    setResults(null);
    checkEligibility.reset();
  };

  const hasSubjects = (list: typeof oLevelSubjectsList) => list.some(s => s.subject && s.grade);
  const isChecking = checkEligibility.isPending;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#1B2A4A] dark:bg-[#0FA3B1]/20">
          <GraduationCap className="h-6 w-6 text-white dark:text-[#0FA3B1]" />
        </div>
        <h1 className="mt-4 text-3xl font-bold text-zinc-900 dark:text-zinc-50">Admission Eligibility Checker</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
Enter your O and A Level subjects to see which programmes you qualify for.
        </p>
      </div>

      {/* Degree Level Selector */}
      {!results && (
        <div className="mb-6 flex justify-center">
          <div className="inline-flex items-center gap-3 rounded-lg border border-zinc-200 bg-white p-2 dark:border-zinc-700 dark:bg-zinc-900">
            <span className="ml-2 text-xs font-medium text-zinc-500">Degree Level:</span>
            {levelOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSelectedLevel(opt.value)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  selectedLevel === opt.value
                    ? "bg-[#1B2A4A] text-white dark:bg-[#0FA3B1]"
                    : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Student Type Selector */}
      {!results && (
        <div className="mb-6 flex justify-center">
          <div className="inline-flex items-center gap-3 rounded-lg border border-zinc-200 bg-white p-2 dark:border-zinc-700 dark:bg-zinc-900">
            <span className="ml-2 text-xs font-medium text-zinc-500">Entry Type:</span>
            {[
              { value: "FRESHMAN", label: "Freshman", icon: BookOpen },
              { value: "DIRECT_ENTRY", label: "Direct Entry", icon: FileText },
              { value: "TRANSFER", label: "Transfer", icon: UserCheck },
            ].map((opt) => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.value}
                  onClick={() => setStudentType(opt.value as typeof studentType)}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    studentType === opt.value
                      ? "bg-[#1B2A4A] text-white dark:bg-[#0FA3B1]"
                      : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Progress Steps */}
      {!isPostgraduateLevel && (
        <div className="mb-8 flex items-center justify-center gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                (!results && step >= s) || (results && s <= 3) ? "bg-[#1B2A4A] text-white" : "bg-zinc-100 text-zinc-400 dark:bg-zinc-800"
              }`}>
                {s}
              </div>
              <span className={`text-sm ${(!results && step >= s) || results ? "text-zinc-900 dark:text-zinc-50" : "text-zinc-400"}`}>
                {s === 1 ? "O Level" : s === 2 ? "A Level" : "Results"}
              </span>
              {s < 3 && <div className="h-px w-8 bg-zinc-200 dark:bg-zinc-700" />}
            </div>
          ))}
        </div>
      )}

      {/* Postgraduate: Previous Degree Form */}
      {isPostgraduateLevel && !results && (
        <Card>
          <CardHeader>
            <CardTitle>{selectedLevel === "POSTGRADUATE" ? "Undergraduate" : "Masters"} Degree Information</CardTitle>
            <CardDescription>
              Select your {selectedLevel === "POSTGRADUATE" ? "undergraduate" : "masters"} degree from the list of programmes in the system.
              This helps us check programme-specific requirements for {selectedLevel === "POSTGRADUATE" ? "postgraduate" : "doctorate"} admission.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-500">Degree Name</label>
              <Select
                options={[
                  { value: "", label: `Select your ${selectedLevel === "POSTGRADUATE" ? "undergraduate" : "masters"} degree` },
                  ...degreeOptions,
                ]}
                placeholder={`Select your ${selectedLevel === "POSTGRADUATE" ? "undergraduate" : "masters"} degree`}
                value={ugDegree.degreeName}
                onChange={(e) => {
                  const selectedProg = previousProgrammes?.data?.find((p: any) => p.code === e.target.value);
                  setUgDegree({
                    ...ugDegree,
                    degreeName: e.target.value,
                    degreeLabel: selectedProg ? selectedProg.name : e.target.value,
                    previousProgrammeId: selectedProg?.id || "",
                  });
                }}
              />
              {!previousProgrammes && previousLevel && (
                <p className="mt-1 text-xs text-zinc-400">Loading programmes...</p>
              )}
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-500">Institution</label>
              <input
                type="text"
                placeholder="e.g. University of Buea"
                value={ugDegree.institution}
                onChange={(e) => setUgDegree({ ...ugDegree, institution: e.target.value })}
                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus:border-[#1B2A4A] focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-500">Graduation Year</label>
                <input
                  type="number"
                  placeholder="e.g. 2023"
                  min="1980"
                  max="2030"
                  value={ugDegree.graduationYear}
                  onChange={(e) => setUgDegree({ ...ugDegree, graduationYear: e.target.value })}
                  className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus:border-[#1B2A4A] focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-500">Classification</label>
                <Select
                  options={[
                    { value: "", label: "Select classification" },
                    { value: "First Class Honours", label: "First Class Honours" },
                    { value: "Second Class Upper", label: "Second Class Upper (2:1)" },
                    { value: "Second Class Lower", label: "Second Class Lower (2:2)" },
                    { value: "Third Class", label: "Third Class" },
                    { value: "Pass", label: "Pass" },
                    { value: "Distinction", label: "Distinction" },
                    { value: "Merit", label: "Merit" },
                  ]}
                  placeholder="Select classification"
                  value={ugDegree.classification}
                  onChange={(e) => setUgDegree({ ...ugDegree, classification: e.target.value })}
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button onClick={handleCheck} disabled={!ugDegree.degreeName || !ugDegree.classification || isChecking}>
                {isChecking ? (
                  <>Checking...</>
                ) : (
                  <><Search className="mr-2 h-4 w-4" /> Check Eligibility</>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 1: O Level */}
      {!isPostgraduateLevel && step === 1 && !results && (
        <Card>
          <CardHeader>
            <CardTitle>O Level / GCE Ordinary Level Subjects</CardTitle>
            <CardDescription>Enter at least 4 O Level subjects with your grades</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {oLevelSubjectsList.map((item, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="flex-1">
                  <Select
                    options={oLevelSubjects}
                    placeholder="Select subject"
                    value={item.subject}
                    onChange={(e) => updateSubject("o", index, "subject", e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="w-28">
                  <Select
                    options={oLevelGradeOptions}
                    placeholder="Grade"
                    value={item.grade}
                    onChange={(e) => updateSubject("o", index, "grade", e.target.value)}
                  />
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeSubject("o", index)} disabled={oLevelSubjectsList.length <= 1}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
            {oLevelSubjectsList.length < 12 && (
              <Button variant="outline" size="sm" onClick={() => addSubject("o")} className="mt-2 gap-1">
                <Plus className="h-4 w-4" /> Add Subject
              </Button>
            )}
            <div className="mt-6 flex justify-end">
              <Button onClick={() => setStep(2)} disabled={!hasSubjects(oLevelSubjectsList)}>
                Next: A Level <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: A Level */}
      {!isPostgraduateLevel && step === 2 && !results && (
        <Card>
          <CardHeader>
            <CardTitle>A Level / GCE Advanced Level Subjects</CardTitle>
            <CardDescription>Enter your A Level subjects and grades</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {aLevelSubjectsList.map((item, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="flex-1">
                  <Select
                    options={aLevelSubjects}
                    placeholder="Select subject"
                    value={item.subject}
                    onChange={(e) => updateSubject("a", index, "subject", e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="w-28">
                  <Select
                    options={gradeOptions}
                    placeholder="Grade"
                    value={item.grade}
                    onChange={(e) => updateSubject("a", index, "grade", e.target.value)}
                  />
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeSubject("a", index)} disabled={aLevelSubjectsList.length <= 1}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
            {aLevelSubjectsList.length < 6 && (
              <Button variant="outline" size="sm" onClick={() => addSubject("a")} className="mt-2 gap-1">
                <Plus className="h-4 w-4" /> Add Subject
              </Button>
            )}
            <div className="mt-6 flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button onClick={handleCheck} disabled={!hasSubjects(aLevelSubjectsList) || isChecking}>
                {isChecking ? (
                  <>Checking...</>
                ) : (
                  <><Search className="mr-2 h-4 w-4" /> Check Eligibility</>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {results && (
        <div className="space-y-6 animate-fade-in">
          {/* Summary */}
          <Card className={`border-2 ${
            results.status === "ELIGIBLE" ? "border-green-500" :
            results.status === "CONDITIONALLY_ELIGIBLE" ? "border-yellow-500" :
            results.status === "NOT_ELIGIBLE" ? "border-red-500" :
            "border-zinc-300"
          }`}>
            <CardContent className="p-6 text-center">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                {results.status === "ELIGIBLE" ? (
                  <CheckCircle2 className="h-8 w-8 text-green-500" />
                ) : results.status === "CONDITIONALLY_ELIGIBLE" ? (
                  <AlertCircle className="h-8 w-8 text-yellow-500" />
                ) : results.status === "NOT_ELIGIBLE" ? (
                  <XCircle className="h-8 w-8 text-red-500" />
                ) : (
                  <AlertCircle className="h-8 w-8 text-zinc-400" />
                )}
              </div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                {results.status === "ELIGIBLE" ? "You are Eligible!" :
                 results.status === "CONDITIONALLY_ELIGIBLE" ? "Conditionally Eligible" :
                 results.status === "NOT_ELIGIBLE" ? "Not Eligible" :
                 "Eligibility Result"}
              </h2>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                {results.summary || "Based on your subjects and grades, here are your options:"}
              </p>
            </CardContent>
          </Card>

          {/* Eligible Programmes */}
          {results.eligible && results.eligible.length > 0 && (
            <div>
              <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-green-600 dark:text-green-400">
                <CheckCircle2 className="h-5 w-5" /> Eligible Programmes
              </h3>
              <div className="space-y-3">
                {results.eligible.map((prog: any, i: number) => (
                  <Card key={prog.code || i} className="border-green-200 dark:border-green-900">
                    <CardContent className="flex items-center justify-between p-4">
                      <div>
<p className="font-semibold text-zinc-900 dark:text-zinc-50">{prog.name || prog.programme?.name}</p>
                        <p className="flex items-center gap-2 text-sm text-zinc-500">
                          {prog.level && <Badge variant="secondary">{prog.level.replace(/_/g, " ")}</Badge>}
                          {prog.faculty || prog.programme?.department?.academicUnit?.name || ""} · {prog.code || prog.programme?.code}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        {prog.matchScore != null && <Badge variant="success">{prog.matchScore}% Match</Badge>}
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/programmes/${prog.code || prog.programme?.code}`}>
                            View <ArrowRight className="ml-1 h-3 w-3" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Conditionally Eligible */}
          {results.conditionallyEligible && results.conditionallyEligible.length > 0 && (
            <div>
              <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-yellow-600 dark:text-yellow-400">
                <AlertCircle className="h-5 w-5" /> Conditionally Eligible
              </h3>
              <div className="space-y-3">
                {results.conditionallyEligible.map((prog: any, i: number) => (
                  <Card key={prog.code || i}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-zinc-900 dark:text-zinc-50">{prog.name || prog.programme?.name}</p>
                          <p className="text-sm text-zinc-500">
                            {prog.faculty || prog.programme?.department?.academicUnit?.name || ""} · {prog.code || prog.programme?.code}
                          </p>
                        </div>
                        {prog.matchScore != null && <Badge variant="warning">{prog.matchScore}% Match</Badge>}
                      </div>
                      {prog.missingRequirements && prog.missingRequirements.length > 0 && (
                        <div className="mt-3 rounded-lg bg-yellow-50 p-3 dark:bg-yellow-900/20">
                          <p className="text-xs font-medium text-yellow-800 dark:text-yellow-400">Missing Requirements:</p>
                          <ul className="mt-1 list-inside list-disc text-xs text-yellow-700 dark:text-yellow-500">
                            {prog.missingRequirements.map((m: string, j: number) => (
                              <li key={j}>{m}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Not Eligible */}
          {results.notEligible && results.notEligible.length > 0 && (
            <div>
              <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-red-600 dark:text-red-400">
                <XCircle className="h-5 w-5" /> Not Eligible
              </h3>
              <div className="space-y-3">
                {results.notEligible.map((prog: any, i: number) => (
                  <Card key={prog.code || i}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-zinc-900 dark:text-zinc-50">{prog.name || prog.programme?.name}</p>
                          <p className="text-sm text-zinc-500">
                            {prog.faculty || prog.programme?.department?.academicUnit?.name || ""} · {prog.code || prog.programme?.code}
                          </p>
                        </div>
                        {prog.matchScore != null && <Badge variant="destructive">{prog.matchScore}% Match</Badge>}
                      </div>
                      {prog.missingRequirements && prog.missingRequirements.length > 0 && (
                        <div className="mt-3 rounded-lg bg-red-50 p-3 dark:bg-red-900/20">
                          <p className="text-xs font-medium text-red-800 dark:text-red-400">Missing Requirements:</p>
                          <ul className="mt-1 list-inside list-disc text-xs text-red-700 dark:text-red-500">
                            {prog.missingRequirements.map((m: string, j: number) => (
                              <li key={j}>{m}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {checkEligibility.isError && (
            <Card className="border-red-300">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-red-600">
                  {(checkEligibility.error as any)?.message || "Something went wrong. Please try again."}
                </p>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-center gap-3">
            <Button variant="outline" onClick={resetForm} className="gap-2">
              <RefreshCw className="h-4 w-4" /> Check Again
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

