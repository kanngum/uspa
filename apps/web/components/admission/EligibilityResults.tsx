import Link from "next/link";
import { AlertCircle, ArrowRight, CheckCircle2, Info, RefreshCw, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatEligibilityStatus, formatProgrammeLevel } from "@/app/lib/eligibility";
import type { EligibilityResultItem, EligibilityResults as EligibilityResultsData, EligibilityStatus } from "@/app/lib/types/eligibility";

interface EligibilityResultsProps {
  results: EligibilityResultsData;
  onReset: () => void;
}

const statusConfig: Record<EligibilityStatus, { icon: typeof CheckCircle2; accent: string; soft: string }> = {
  ELIGIBLE: { icon: CheckCircle2, accent: "text-green-700", soft: "border-green-200 bg-green-50" },
  CONDITIONALLY_ELIGIBLE: { icon: AlertCircle, accent: "text-amber-700", soft: "border-amber-200 bg-amber-50" },
  NOT_ELIGIBLE: { icon: XCircle, accent: "text-red-700", soft: "border-red-200 bg-red-50" },
};

function ResultCard({ result }: { result: EligibilityResultItem }) {
  const config = statusConfig[result.status];
  return (
    <article className="rounded-card border border-rule-strong bg-white p-5 shadow-xs sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h4 className="break-words text-lg font-semibold leading-6 text-ink">{result.name}</h4>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-ink">
            <Badge variant="secondary">{formatProgrammeLevel(result.level)}</Badge>
            <span className="font-mono">{result.code}</span>
          </div>
        </div>
        <span className={`inline-flex min-h-8 shrink-0 items-center rounded-full border px-3 text-xs font-semibold ${config.soft} ${config.accent}`}>
          {formatEligibilityStatus(result.status)}
        </span>
      </div>

      {(result.satisfiedRequirements.length > 0 || result.missingRequirements.length > 0) && (
        <div className="mt-5 grid gap-4 border-t border-rule pt-4 md:grid-cols-2">
          {result.satisfiedRequirements.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-green-700">Satisfied requirements</p>
              <ul className="mt-2 space-y-1 text-sm leading-5 text-muted-ink">
                {result.satisfiedRequirements.slice(0, 5).map((requirement) => <li key={requirement} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" aria-hidden="true" />{requirement}</li>)}
              </ul>
            </div>
          )}
          {result.missingRequirements.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-red-700">Needs confirmation</p>
              <ul className="mt-2 space-y-1 text-sm leading-5 text-muted-ink">
                {result.missingRequirements.slice(0, 5).map((requirement) => <li key={requirement} className="flex gap-2"><XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" aria-hidden="true" />{requirement}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-rule pt-4">
        <p className="flex max-w-xl gap-2 text-xs leading-5 text-subtle-ink"><Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" aria-hidden="true" />This is a comparison against listed requirements, not an official admission decision.</p>
        <Button variant="ghost" size="sm" asChild className="min-h-11 gap-1 text-accent-dark hover:bg-accent-soft">
          <Link href={`/programmes/${result.code}`}>Open record <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" /></Link>
        </Button>
      </div>
    </article>
  );
}

function ResultGroup({ title, icon: Icon, results }: { title: string; icon: typeof CheckCircle2; results: EligibilityResultItem[] }) {
  if (results.length === 0) return null;
  return (
    <section>
      <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-primary"><Icon className="h-5 w-5" aria-hidden="true" />{title}<span className="font-mono text-sm font-normal text-subtle-ink">{results.length}</span></h3>
      <div className="space-y-3">{results.slice(0, 12).map((result) => <ResultCard key={result.id || result.code} result={result} />)}</div>
      {results.length > 12 && <p className="mt-3 text-xs text-subtle-ink">Showing the first 12 records. Browse the catalogue for more options.</p>}
    </section>
  );
}

export function EligibilityResults({ results, onReset }: EligibilityResultsProps) {
  const config = statusConfig[results.status];
  const StatusIcon = config.icon;
  return (
    <div className="space-y-7 animate-fade-in">
      <section className={`rounded-record border-2 p-6 sm:p-8 ${config.soft}`}>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white"><StatusIcon className={`h-8 w-8 ${config.accent}`} aria-hidden="true" /></div>
          <div>
            <p className={`text-xs font-semibold uppercase tracking-[0.16em] ${config.accent}`}>Listed-requirements review</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-ink">{formatEligibilityStatus(results.status)}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-ink">{results.summary}</p>
          </div>
        </div>
        <p className="mt-6 flex gap-2 border-t border-current/10 pt-4 text-xs leading-5 text-muted-ink"><Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />Use these records to decide what to review next, then confirm final requirements, fees, and intake details with the institution.</p>
      </section>

      <ResultGroup title="Meets listed requirements" icon={CheckCircle2} results={results.eligible} />
      <ResultGroup title="Needs review" icon={AlertCircle} results={results.conditionallyEligible} />
      <ResultGroup title="Does not meet listed requirements" icon={XCircle} results={results.notEligible} />

      <div className="flex justify-center border-t border-rule pt-6">
        <Button type="button" variant="outline" onClick={onReset} className="min-h-11 gap-2 rounded-control border-rule-strong"><RefreshCw className="h-4 w-4" aria-hidden="true" /> Edit inputs</Button>
      </div>
    </div>
  );
}
