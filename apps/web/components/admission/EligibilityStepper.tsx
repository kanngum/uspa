import type { EligibilityStep } from "@/app/lib/types/eligibility";

interface EligibilityStepperProps {
  step: EligibilityStep;
  isPostgraduate: boolean;
  hasResults: boolean;
}

export function EligibilityStepper({ step, isPostgraduate, hasResults }: EligibilityStepperProps) {
  const steps = isPostgraduate
    ? [{ value: "previous-degree" as const, label: "Previous degree" }, { value: "results" as const, label: "Evidence" }]
    : [
        { value: "o-level" as const, label: "O Level" },
        { value: "a-level" as const, label: "A Level" },
        { value: "results" as const, label: "Evidence" },
      ];
  const activeIndex = hasResults ? steps.length - 1 : Math.max(0, steps.findIndex((item) => item.value === step));

  return (
    <div aria-label="Eligibility progress" className="mx-auto mb-8 flex max-w-2xl items-center justify-center gap-2">
      {steps.map((item, index) => (
        <div key={item.value} className="flex min-w-0 items-center gap-2">
          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${index <= activeIndex ? "bg-primary text-white" : "bg-muted text-subtle-ink"}`}>
            {index + 1}
          </div>
          <span className={`hidden text-sm sm:block ${index <= activeIndex ? "font-medium text-ink" : "text-subtle-ink"}`}>{item.label}</span>
          {index < steps.length - 1 && <div className="h-px w-8 bg-rule-strong sm:w-14" aria-hidden="true" />}
        </div>
      ))}
    </div>
  );
}
