"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import type { PreviousDegreeInput } from "@/app/lib/types/eligibility";

interface PreviousDegreeFormProps {
  level: "POSTGRADUATE" | "DOCTORATE";
  value: PreviousDegreeInput;
  degreeOptions: Array<{ value: string; label: string }>;
  isLoading: boolean;
  isSubmitting: boolean;
  onChange: (value: PreviousDegreeInput) => void;
  onSubmit: () => void;
}

export function PreviousDegreeForm({ level, value, degreeOptions, isLoading, isSubmitting, onChange, onSubmit }: PreviousDegreeFormProps) {
  const previousLevel = level === "POSTGRADUATE" ? "undergraduate" : "masters";
  const title = level === "POSTGRADUATE" ? "Undergraduate degree information" : "Masters degree information";

  return (
    <Card className="rounded-record border-rule-strong bg-white shadow-xs">
      <CardHeader className="border-b border-rule p-6 sm:p-7">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-dark">Previous qualification</p>
        <CardTitle className="mt-2 text-2xl leading-tight tracking-[-0.03em] text-primary">{title}</CardTitle>
        <CardDescription className="max-w-2xl text-sm leading-6 text-muted-ink">
          Select the previous programme and classification used for this listed-requirements review. The institution makes the final admissions decision.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 p-6 sm:p-7">
        <div>
          <label htmlFor="previous-degree" className="mb-2 block text-sm font-semibold text-ink">Previous {previousLevel} programme</label>
          <Select
            id="previous-degree"
            options={degreeOptions}
            placeholder={`Select your ${previousLevel} degree`}
            value={value.degreeName}
            onChange={(event) => {
              const selected = degreeOptions.find((option) => option.value === event.target.value);
              onChange({ ...value, degreeName: event.target.value, degreeLabel: selected?.label || event.target.value, previousProgrammeId: event.target.value });
            }}
            className="h-11"
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="previous-institution" className="mb-2 block text-sm font-semibold text-ink">Institution <span className="font-normal text-subtle-ink">(optional)</span></label>
            <input id="previous-institution" value={value.institution} onChange={(event) => onChange({ ...value, institution: event.target.value })} placeholder="e.g. University of Buea" className="h-11 w-full rounded-control border border-rule-strong bg-white px-3 text-sm text-ink outline-hidden transition-colors placeholder:text-subtle-ink focus:border-accent focus:ring-2 focus:ring-accent/20" />
          </div>
          <div>
            <label htmlFor="graduation-year" className="mb-2 block text-sm font-semibold text-ink">Graduation year <span className="font-normal text-subtle-ink">(optional)</span></label>
            <input id="graduation-year" type="number" min="1980" max="2035" value={value.graduationYear} onChange={(event) => onChange({ ...value, graduationYear: event.target.value })} placeholder="e.g. 2023" className="h-11 w-full rounded-control border border-rule-strong bg-white px-3 text-sm text-ink outline-hidden transition-colors placeholder:text-subtle-ink focus:border-accent focus:ring-2 focus:ring-accent/20" />
          </div>
        </div>
        <div>
          <label htmlFor="degree-classification" className="mb-2 block text-sm font-semibold text-ink">Classification</label>
          <Select
            id="degree-classification"
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
            value={value.classification}
            onChange={(event) => onChange({ ...value, classification: event.target.value })}
            className="h-11"
          />
        </div>
        {isLoading && <p className="text-xs text-subtle-ink">Loading previous programmes…</p>}
        <div className="flex justify-end border-t border-rule pt-5">
          <Button type="button" variant="accent" onClick={onSubmit} disabled={!value.degreeName || !value.classification || isSubmitting} className="min-h-11 gap-2 rounded-control">
            <Search className="h-4 w-4" aria-hidden="true" />
            {isSubmitting ? "Checking listed requirements…" : "Check eligibility"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
