"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import * as Tabs from "@radix-ui/react-tabs";
import { GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCheckEligibility } from "@/app/lib/hooks/useEligibility";
import { useSearchProgrammes } from "@/app/lib/hooks/useProgrammes";
import { useUniversity } from "@/app/lib/context/UniversityContext";
import { EntryPathTabs } from "@/components/admission/EntryPathTabs";
import { EligibilityResults } from "@/components/admission/EligibilityResults";
import { EligibilityStepper } from "@/components/admission/EligibilityStepper";
import { PreviousDegreeForm } from "@/components/admission/PreviousDegreeForm";
import { SubjectEntryList } from "@/components/admission/SubjectEntryList";
import {
  EMPTY_PREVIOUS_DEGREE,
  MIN_A_LEVEL_SUBJECTS,
  MIN_O_LEVEL_SUBJECTS,
  createSubjectRows,
  getEligibilityBranch,
  getInitialStep,
  getSubjectValidationMessage,
} from "@/app/lib/eligibility";
import type { DegreeLevel, EligibilityResults as EligibilityResultsData, EligibilityStep, PreviousDegreeInput, StudentType, SubjectGradeEntry } from "@/app/lib/types/eligibility";

const oLevelSubjects = [
  "English Language", "Mathematics", "Biology", "Chemistry", "Physics", "Geography", "History", "Economics", "Literature in English", "French Language", "Civic Education", "Commerce", "Accounting", "Computer Science", "Additional Mathematics", "Agricultural Science", "Religious Studies", "Fine Arts", "Music", "Physical Education", "Food and Nutrition", "Clothing and Textiles", "Literature in French", "Office Practice",
].map((value) => ({ value, label: value }));

const aLevelSubjects = [
  "Mathematics", "Further Mathematics", "Physics", "Chemistry", "Biology", "Economics", "Geography", "History", "Literature in English", "French Language", "Computer Science", "Accounting", "Commerce", "English Language", "Sociology", "Psychology", "Geology", "Philosophy", "Political Science",
].map((value) => ({ value, label: value }));

const gradeOptions = ["A", "B", "C", "D", "E", "F"].map((value) => ({ value, label: `${value} - ${value === "A" ? "Excellent" : value === "B" ? "Very Good" : value === "C" ? "Good" : value === "D" ? "Fair" : value === "E" ? "Pass" : "Fail"}` }));
const oLevelGradeOptions = ["A", "B", "C", "D", "E",].map((value) => ({ value, label: value }));
const degreeLevels: Array<{ value: DegreeLevel; label: string }> = [
  { value: "UNDERGRADUATE", label: "Undergraduate" },
  { value: "POSTGRADUATE", label: "Postgraduate" },
  { value: "DOCTORATE", label: "Doctorate" },
  { value: "PROFESSIONAL", label: "Professional" },
];

function AdmissionCheckerContent() {
  const searchParams = useSearchParams();
  const { selectedUniversity } = useUniversity();
  const [selectedLevel, setSelectedLevel] = useState<DegreeLevel>((searchParams.get("level") as DegreeLevel) || "UNDERGRADUATE");
  const [studentType, setStudentType] = useState<StudentType>("FRESHMAN");
  const [step, setStep] = useState<EligibilityStep>("o-level");
  const [oLevelSubjectsList, setOLevelSubjectsList] = useState<SubjectGradeEntry[]>(() => createSubjectRows());
  const [aLevelSubjectsList, setALevelSubjectsList] = useState<SubjectGradeEntry[]>(() => createSubjectRows());
  const [ugDegree, setUgDegree] = useState<PreviousDegreeInput>(EMPTY_PREVIOUS_DEGREE);
  const [inlineError, setInlineError] = useState<string | null>(null);
  const [results, setResults] = useState<EligibilityResultsData | null>(null);
  const checkEligibility = useCheckEligibility();

  const isPostgraduateLevel = selectedLevel === "POSTGRADUATE" || selectedLevel === "DOCTORATE";
  const branch = getEligibilityBranch(selectedLevel, studentType);
  const previousLevel = selectedLevel === "POSTGRADUATE" ? "UNDERGRADUATE" : selectedLevel === "DOCTORATE" ? "POSTGRADUATE" : null;
  const { data: previousProgrammes, isLoading: previousProgrammesLoading } = useSearchProgrammes(
    previousLevel ? { level: previousLevel, universityId: selectedUniversity?.id, limit: 200 } : { limit: 0 },
  );

  const degreeOptions = useMemo(() => (previousProgrammes?.data || []).map((programme: any) => ({ value: programme.code, label: `${programme.name} (${programme.code})` })), [previousProgrammes]);

  useEffect(() => {
    setStep(getInitialStep(branch));
    setInlineError(null);
    setResults(null);
    checkEligibility.reset();
  }, [branch]);

  const updateSubject = (level: "o" | "a", index: number, field: "subject" | "grade", value: string) => {
    const setter = level === "o" ? setOLevelSubjectsList : setALevelSubjectsList;
    setter((current) => current.map((entry, entryIndex) => entryIndex === index ? { ...entry, [field]: value } : entry));
    setInlineError(null);
  };

  const addSubject = (level: "o" | "a") => {
    const setter = level === "o" ? setOLevelSubjectsList : setALevelSubjectsList;
    setter((current) => [...current, createSubjectRows(1)[0]]);
  };

  const removeSubject = (level: "o" | "a", index: number) => {
    const setter = level === "o" ? setOLevelSubjectsList : setALevelSubjectsList;
    setter((current) => current.length > 1 ? current.filter((_, entryIndex) => entryIndex !== index) : current);
  };

  const resetForm = () => {
    setStep(getInitialStep(branch));
    setOLevelSubjectsList(createSubjectRows());
    setALevelSubjectsList(createSubjectRows());
    setUgDegree(EMPTY_PREVIOUS_DEGREE);
    setInlineError(null);
    setResults(null);
    checkEligibility.reset();
  };

  const submitCheck = () => {
    if (branch === "unsupported-entry") {
      setInlineError("This entry path is not supported by the current checker yet. Choose Freshman to review O/A Level subjects.");
      return;
    }

    if (branch === "previous-degree") {
      if (!ugDegree.degreeName || !ugDegree.classification) {
        setInlineError("Select your previous programme and classification before checking eligibility.");
        return;
      }
      runEligibility({
        oLevelSubjects: [],
        aLevelSubjects: [],
        level: selectedLevel,
        universityId: selectedUniversity?.id,
        studentType,
        ugDegree,
      });
      return;
    }

    const oLevelError = getSubjectValidationMessage("o", oLevelSubjectsList);
    if (oLevelError) {
      setInlineError(oLevelError);
      setStep("o-level");
      return;
    }
    const aLevelError = getSubjectValidationMessage("a", aLevelSubjectsList);
    if (aLevelError) {
      setInlineError(aLevelError);
      setStep("a-level");
      return;
    }

    runEligibility({
      oLevelSubjects: oLevelSubjectsList.filter((entry) => entry.subject && entry.grade).map((entry) => ({ name: entry.subject, grade: entry.grade })),
      aLevelSubjects: aLevelSubjectsList.filter((entry) => entry.subject && entry.grade).map((entry) => ({ name: entry.subject, grade: entry.grade })),
      level: selectedLevel,
      universityId: selectedUniversity?.id,
      studentType,
    });
  };

  const runEligibility = (input: Parameters<typeof checkEligibility.mutate>[0]) => {
    setInlineError(null);
    checkEligibility.mutate(input, {
      onSuccess: (data) => {
        setResults(data);
        setStep("results");
      },
      onError: (error) => setInlineError(error.message || "Couldn’t check eligibility. Review your inputs and try again."),
    });
  };

  const oLevelMessage = getSubjectValidationMessage("o", oLevelSubjectsList);
  const aLevelMessage = getSubjectValidationMessage("a", aLevelSubjectsList);
  const isChecking = checkEligibility.isPending;

  return (
    <div className="bg-paper-soft text-ink">
      <div className="mx-auto max-w-5xl px-6 py-10 sm:px-8 lg:py-14">
        <header className="mb-9 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-sm"><GraduationCap className="h-6 w-6" aria-hidden="true" /></div>
          <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-dark">Admissions desk</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-primary sm:text-4xl">Admission Eligibility Checker</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-muted-ink">Review your subjects or previous qualification against listed programme requirements. This is guidance, not an institution decision.</p>
        </header>

        {!results && (
          <Tabs.Root value={selectedLevel} onValueChange={(value) => setSelectedLevel(value as DegreeLevel)}>
            <Tabs.List aria-label="Degree level" className="mx-auto mb-7 grid max-w-4xl grid-cols-2 gap-1 rounded-card border border-rule bg-white p-1.5 shadow-xs sm:grid-cols-4">
              {degreeLevels.map((level) => <Tabs.Trigger key={level.value} value={level.value} className="min-h-11 rounded-control px-3 text-sm font-semibold text-muted-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 data-[state=active]:bg-primary data-[state=active]:text-white">{level.label}</Tabs.Trigger>)}
            </Tabs.List>

            {!isPostgraduateLevel && (
              <EntryPathTabs value={studentType} onValueChange={(value) => { setStudentType(value); setInlineError(null); }}>
                <Tabs.Content value="FRESHMAN" className="mt-8 focus-visible:outline-none">
                  <EligibilityStepper step={step} isPostgraduate={false} hasResults={false} />
                  {step === "o-level" && (
                    <Card className="rounded-record border-rule-strong bg-white shadow-xs">
                      <CardHeader className="border-b border-rule p-6 sm:p-7">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-dark">Step 1 of 2</p>
                        <CardTitle className="mt-2 text-2xl leading-tight tracking-[-0.03em] text-primary">O Level / GCE Ordinary Level subjects</CardTitle>
                        <CardDescription className="text-sm leading-6 text-muted-ink">Enter at least {MIN_O_LEVEL_SUBJECTS} complete O Level subject and grade pairs.</CardDescription>
                      </CardHeader>
                      <CardContent className="p-6 sm:p-7">
                        <SubjectEntryList level="o" entries={oLevelSubjectsList} subjectOptions={oLevelSubjects} gradeOptions={oLevelGradeOptions} minimumComplete={MIN_O_LEVEL_SUBJECTS} validationMessage={inlineError || oLevelMessage} onChange={(index, field, value) => updateSubject("o", index, field, value)} onAdd={() => addSubject("o")} onRemove={(index) => removeSubject("o", index)} />
                        <div className="mt-6 flex justify-end border-t border-rule pt-5"><Button type="button" variant="primary" onClick={() => { const error = getSubjectValidationMessage("o", oLevelSubjectsList); if (error) setInlineError(error); else { setInlineError(null); setStep("a-level"); } }} disabled={!!oLevelMessage} className="min-h-11 rounded-control">Next: A Level <span aria-hidden="true">→</span></Button></div>
                      </CardContent>
                    </Card>
                  )}
                  {step === "a-level" && (
                    <Card className="rounded-record border-rule-strong bg-white shadow-xs">
                      <CardHeader className="border-b border-rule p-6 sm:p-7">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-dark">Step 2 of 2</p>
                        <CardTitle className="mt-2 text-2xl leading-tight tracking-[-0.03em] text-primary">A Level / GCE Advanced Level subjects</CardTitle>
                        <CardDescription className="text-sm leading-6 text-muted-ink">Enter at least {MIN_A_LEVEL_SUBJECTS} complete A Level subject and grade pairs for a complete check.</CardDescription>
                      </CardHeader>
                      <CardContent className="p-6 sm:p-7">
                        <SubjectEntryList level="a" entries={aLevelSubjectsList} subjectOptions={aLevelSubjects} gradeOptions={gradeOptions} minimumComplete={MIN_A_LEVEL_SUBJECTS} validationMessage={inlineError || aLevelMessage} onChange={(index, field, value) => updateSubject("a", index, field, value)} onAdd={() => addSubject("a")} onRemove={(index) => removeSubject("a", index)} />
                        <div className="mt-6 flex justify-between border-t border-rule pt-5"><Button type="button" variant="outline" onClick={() => { setInlineError(null); setStep("o-level"); }} className="min-h-11 rounded-control border-rule-strong">Back</Button><Button type="button" variant="accent" onClick={submitCheck} disabled={!!aLevelMessage || isChecking} className="min-h-11 rounded-control">{isChecking ? "Checking listed requirements…" : "Check eligibility"}</Button></div>
                      </CardContent>
                    </Card>
                  )}
                </Tabs.Content>
                <Tabs.Content value="DIRECT_ENTRY" className="mt-8 focus-visible:outline-none"><UnsupportedEntryPath type="Direct Entry" onChooseFreshman={() => setStudentType("FRESHMAN")} /></Tabs.Content>
                <Tabs.Content value="TRANSFER" className="mt-8 focus-visible:outline-none"><UnsupportedEntryPath type="Transfer" onChooseFreshman={() => setStudentType("FRESHMAN")} /></Tabs.Content>
              </EntryPathTabs>
            )}

            {isPostgraduateLevel && (
              <Tabs.Content value={selectedLevel} className="mt-8 focus-visible:outline-none">
                <EligibilityStepper step={step} isPostgraduate hasResults={false} />
                <PreviousDegreeForm level={selectedLevel} value={ugDegree} degreeOptions={degreeOptions} isLoading={previousProgrammesLoading} isSubmitting={isChecking} onChange={setUgDegree} onSubmit={submitCheck} />
              </Tabs.Content>
            )}
          </Tabs.Root>
        )}

        {inlineError && !results && branch !== "unsupported-entry" && <p role="alert" className="mx-auto mt-5 max-w-3xl rounded-control border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">{inlineError}</p>}
        {results && <EligibilityResults results={results} onReset={resetForm} />}
      </div>
    </div>
  );
}

export default function AdmissionCheckerPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] bg-paper-soft" aria-label="Loading eligibility checker" />}>
      <AdmissionCheckerContent />
    </Suspense>
  );
}

function UnsupportedEntryPath({ type, onChooseFreshman }: { type: string; onChooseFreshman: () => void }) {
  return (
    <Card className="mx-auto max-w-3xl rounded-record border-amber-200 bg-amber-50 shadow-xs">
      <CardHeader className="p-6 sm:p-7">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-700">Branch not available yet</p>
        <CardTitle className="mt-2 text-2xl tracking-[-0.03em] text-primary">{type} review is not supported by this checker yet.</CardTitle>
        <CardDescription className="text-sm leading-6 text-amber-900/75">We do not want to show the freshman subject flow under a different entry label. Choose Freshman to review O/A Level subjects, or confirm your {type.toLowerCase()} requirements with the institution.</CardDescription>
      </CardHeader>
      <CardContent className="p-6 pt-0 sm:p-7"><Button type="button" variant="primary" onClick={onChooseFreshman} className="min-h-11 rounded-control">Use Freshman review</Button></CardContent>
    </Card>
  );
}
