"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { getCompleteSubjectCount } from "@/app/lib/eligibility";
import type { SubjectGradeEntry } from "@/app/lib/types/eligibility";

interface SubjectEntryListProps {
  level: "o" | "a";
  entries: SubjectGradeEntry[];
  subjectOptions: Array<{ value: string; label: string }>;
  gradeOptions: Array<{ value: string; label: string }>;
  minimumComplete: number;
  validationMessage?: string | null;
  onChange: (index: number, field: "subject" | "grade", value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}

export function SubjectEntryList({
  level,
  entries,
  subjectOptions,
  gradeOptions,
  minimumComplete,
  validationMessage,
  onChange,
  onAdd,
  onRemove,
}: SubjectEntryListProps) {
  const completeCount = getCompleteSubjectCount(entries);
  const label = level === "o" ? "O Level" : "A Level";

  return (
    <div className="space-y-4">
      {entries.map((entry, index) => (
        <div key={entry.id} className="grid min-w-0 gap-2 sm:grid-cols-[minmax(0,1fr)_8rem_auto]">
          <div>
            <label htmlFor={`${level}-subject-${entry.id}`} className="sr-only">{label} subject {index + 1}</label>
            <Select
              id={`${level}-subject-${entry.id}`}
              aria-label={`${label} subject ${index + 1}`}
              options={subjectOptions}
              placeholder="Select subject"
              value={entry.subject}
              onChange={(event) => onChange(index, "subject", event.target.value)}
              className="h-11 w-full"
            />
          </div>
          <div>
            <label htmlFor={`${level}-grade-${entry.id}`} className="sr-only">{label} grade {index + 1}</label>
            <Select
              id={`${level}-grade-${entry.id}`}
              aria-label={`${label} grade ${index + 1}`}
              options={gradeOptions}
              placeholder="Grade"
              value={entry.grade}
              onChange={(event) => onChange(index, "grade", event.target.value)}
              className="h-11 w-full"
            />
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={`Remove ${label} subject ${index + 1}`}
            onClick={() => onRemove(index)}
            disabled={entries.length <= 1}
            className="min-h-11 min-w-11 self-start text-red-500 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      ))}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-rule pt-4">
        <div>
          <p className="text-xs font-medium text-ink">{completeCount} of {minimumComplete} complete {label} subjects</p>
          <p className="mt-1 text-xs text-muted-ink">Choose a subject and grade for every row. Each subject should appear once.</p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={onAdd} className="min-h-11 gap-1 rounded-control border-rule-strong" disabled={entries.length >= (level === "o" ? 12 : 6)}>
          <Plus className="h-4 w-4" aria-hidden="true" /> Add subject
        </Button>
      </div>

      {validationMessage && (
        <p role="alert" className="rounded-control border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800">
          {validationMessage}
        </p>
      )}
    </div>
  );
}
