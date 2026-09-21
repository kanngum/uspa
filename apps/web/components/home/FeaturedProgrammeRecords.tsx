import Link from "next/link";
import {
  ArrowUpRight,
  Building2,
  Clock3,
  ListChecks,
} from "lucide-react";
import type { HomeProgrammeRecord } from "@/app/lib/types/home";
import {
  formatDuration,
  formatProgrammeLevel,
} from "@/app/lib/eligibility";
import { Card, CardContent } from "@/components/ui/card";

interface FeaturedProgrammeRecordsProps {
  programmes: HomeProgrammeRecord[];
  isLoading?: boolean;
}

function ProgrammeRecord({
  programme,
}: {
  programme: HomeProgrammeRecord;
}) {
  return (
    <Link
      href={`/programmes/${programme.code}`}
      className="group block min-w-0 rounded-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
    >
      <Card className="h-full rounded-card border-rule-strong bg-white shadow-xs transition-colors group-hover:border-accent dark:bg-zinc-900">
        <CardContent className="flex h-full flex-col p-6 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <span className="rounded-full bg-accent-soft px-2.5 py-1 text-[11px] font-bold text-accent-dark">
              {programme.degree}
            </span>

            <span className="min-w-0 max-w-[45%] break-all text-right font-mono text-[10px] leading-4 text-subtle-ink">
              {programme.code}
            </span>
          </div>

          <h3 className="mt-7 break-words text-[21px] font-semibold leading-7 tracking-[-0.03em] text-ink dark:text-zinc-50 group-hover:text-accent-dark">
            {programme.name}
          </h3>

          <div className="mt-6 border-t border-rule pt-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-subtle-ink">
              Record details
            </p>

            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-muted-ink">
              <span className="inline-flex items-center gap-1.5">
                <Clock3
                  className="h-3.5 w-3.5 text-accent"
                  aria-hidden="true"
                />
                {formatDuration(programme.duration)}
              </span>

              <span className="inline-flex items-center gap-1.5">
                <Building2
                  className="h-3.5 w-3.5 text-accent"
                  aria-hidden="true"
                />
                {programme.faculty || "Academic unit not listed"}
              </span>

              <span className="inline-flex items-center gap-1.5">
                <ListChecks
                  className="h-3.5 w-3.5 text-accent"
                  aria-hidden="true"
                />
                {programme.requirementCount
                  ? `${programme.requirementCount} requirements`
                  : formatProgrammeLevel(programme.level)}
              </span>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-rule pt-4 text-xs font-semibold text-accent-dark">
            <span>Open programme record</span>

            <ArrowUpRight
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export function FeaturedProgrammeRecords({
  programmes,
  isLoading = false,
}: FeaturedProgrammeRecordsProps) {
  return (
    <section
      id="programmes"
      className="border-b border-rule bg-paper"
    >
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-2xl font-semibold tracking-[-0.03em] text-ink sm:text-3xl">
              Featured Programmes
            </p>
          </div>

          <Link
            href="/programmes"
            className="inline-flex min-h-11 items-center gap-2 text-[13px] font-semibold text-accent-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          >
            View all Programs

            <ArrowUpRight
              className="h-4 w-4"
              aria-hidden="true"
            />
          </Link>
        </div>

        <div className="mt-9 grid gap-5 md:grid-cols-2">
          {isLoading ? (
            <>
              <div className="h-72 animate-pulse rounded-card border border-rule bg-white dark:bg-zinc-900" />
              <div className="h-72 animate-pulse rounded-card border border-rule bg-white dark:bg-zinc-900" />
              <div className="h-72 animate-pulse rounded-card border border-rule bg-white dark:bg-zinc-900" />
              <div className="h-72 animate-pulse rounded-card border border-rule bg-white dark:bg-zinc-900" />
            </>
          ) : programmes.length > 0 ? (
            programmes
              .slice(0, 4)
              .map((programme) => (
                <ProgrammeRecord
                  key={programme.id || programme.code}
                  programme={programme}
                />
              ))
          ) : (
            <div className="rounded-card border border-rule-strong bg-white p-7 text-sm text-muted-ink dark:bg-zinc-900 dark:text-zinc-300 md:col-span-2">
              Programme records are not available for this university yet.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}