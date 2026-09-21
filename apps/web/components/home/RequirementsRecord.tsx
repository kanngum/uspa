import {
  ArrowUpRight,
  BookOpen,
  Clock3,
  FileCheck2,
  Info,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import type { HomeProgrammeRecord } from "@/app/lib/types/home";
import {
  formatDuration,
  formatProgrammeCode,
  formatProgrammeLevel,
} from "@/app/lib/eligibility";
import { formatCurrency } from "@/app/lib/utils";

interface RequirementsRecordProps {
  programme?: HomeProgrammeRecord;
  isLoading?: boolean;
}

export function RequirementsRecord({
  programme,
  isLoading = false,
}: RequirementsRecordProps) {
  const title =
    programme?.name ||
    (isLoading
      ? "Loading programme information"
      : "Programme information unavailable");

  const code = formatProgrammeCode(programme?.code);

  const details = [
    {
      label: "Programme level",
      value: formatProgrammeLevel(programme?.level),
      icon: BookOpen,
    },
    {
      label: "Duration",
      value: formatDuration(programme?.duration),
      icon: Clock3,
    },
    {
      label: "Admission requirements",
      value: programme?.requirementCount
        ? `${programme.requirementCount} listed subject records`
        : "View listed subjects and grades",
      icon: FileCheck2,
    },
    {
      label: "Tuition",
      value: programme?.tuition
        ? formatCurrency(
            programme.tuition.amount,
            programme.tuition.currency
          )
        : "See the current programme record",
      icon: Wallet,
    },
  ];

  return (
    <div className="relative min-w-0 lg:pt-4">
      {/* Compact summary for phones and tablets */}
      <div className="lg:hidden">
        <div className="mb-4 flex items-center gap-3">
          <span className="h-px w-8 bg-accent" />
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-subtle-ink">
            Programme information
          </p>
        </div>

        <article className="overflow-hidden rounded-2xl border border-rule-strong bg-white shadow-record">
          <div className="border-b border-rule bg-primary px-5 py-5 text-white">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <span className="inline-flex rounded-full bg-accent px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-white">
                  Featured programme
                </span>

                <h2 className="mt-3 text-[19px] font-semibold leading-tight tracking-[-0.025em]">
                  {title}
                </h2>

                {code && (
                  <p className="mt-2 font-mono text-[10px] text-white/70">
                    {code}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-px bg-rule">
            {details.map((detail) => {
              const Icon = detail.icon;

              return (
                <div
                  key={detail.label}
                  className="min-w-0 bg-white px-4 py-3.5"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent-dark">
                      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>

                    <div className="min-w-0">
                      <p className="text-[9px] font-semibold uppercase tracking-[0.11em] text-subtle-ink">
                        {detail.label}
                      </p>

                      <p className="mt-1 break-words text-xs font-semibold leading-4 text-primary">
                        {detail.value}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-rule bg-paper-soft px-5 py-4">
            <div className="flex items-start gap-2.5">
              <Info
                className="mt-0.5 h-4 w-4 shrink-0 text-gold-soft"
                aria-hidden="true"
              />

              <p className="text-[11px] leading-5 text-muted-ink">
                Confirm final requirements, fees, and intake details with the
                institution before applying.
              </p>
            </div>

            {programme?.code && (
              <Link
                href={`/programmes/${programme.code}`}
                className="group mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-control bg-primary px-4 text-xs font-semibold text-white transition-all hover:bg-primary-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
              >
                View full programme details
                <ArrowUpRight
                  className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            )}
          </div>
        </article>
      </div>

      {/* Full programme record for desktop */}
      <div className="hidden lg:block">
        {/* Small section label */}
        <div className="mb-5 flex items-center gap-3">
          <span className="h-px w-8 bg-accent" />
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-subtle-ink">
            Programme information
          </p>
        </div>

        <article className="overflow-hidden rounded-2xl border border-rule-strong bg-white shadow-record">
          {/* Programme heading */}
          <div className="relative overflow-hidden border-b border-rule bg-primary px-6 py-7 text-white sm:px-8">
            <div className="absolute right-0 top-0 h-32 w-32 translate-x-10 -translate-y-10 rounded-full border border-white/10" />
            <div className="absolute right-8 top-8 h-16 w-16 rounded-full border border-accent/20" />

            <div className="relative">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-accent px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
                  Featured programme
                </span>
              </div>

              <h2 className="mt-5 max-w-2xl text-[24px] font-semibold leading-tight tracking-[-0.035em] sm:text-[28px]">
                {title}
              </h2>
            </div>
          </div>

          {/* Programme facts */}
          <div className="bg-paper-soft p-4 sm:p-5">
            <div className="grid gap-3 sm:grid-cols-2">
              {details.map((detail) => {
                const Icon = detail.icon;

                return (
                  <div
                    key={detail.label}
                    className="group rounded-xl border border-rule bg-white p-4 transition-colors hover:border-accent/30"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent-dark">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>

                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-subtle-ink">
                          {detail.label}
                        </p>

                        <p className="mt-1.5 break-words text-sm font-semibold leading-5 text-primary">
                          {detail.value}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Guidance */}
          <div className="border-t border-rule bg-white px-6 py-5 sm:px-8">
            <div className="flex gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold-soft/20">
                <Info className="h-4 w-4 text-gold-soft" aria-hidden="true" />
              </span>

              <div>
                <p className="text-xs font-semibold text-primary">
                  Before you apply
                </p>

                <p className="mt-1 text-xs leading-5 text-muted-ink">
                  USPA uses information listed in the university catalogue.
                  Confirm final requirements, fees, and intake details with the
                  institution before applying.
                </p>
              </div>
            </div>

            {programme?.code && (
              <Link
                href={`/programmes/${programme.code}`}
                className="group mt-5 inline-flex min-h-11 items-center gap-2 rounded-control bg-primary px-4 text-xs font-semibold text-white transition-all hover:bg-primary-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
              >
                View full programme details
                <ArrowUpRight
                  className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            )}
          </div>
        </article>

        {/* Supporting caption */}
        <div className="mt-4 flex items-center gap-3 px-1">
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-subtle-ink">
            Explore
          </span>

          <span
            className="h-px flex-1 bg-rule-strong"
            aria-hidden="true"
          />

          <span className="text-[10px] uppercase tracking-[0.14em] text-subtle-ink">
            Compare. Verify. Decide.
          </span>
        </div>
      </div>
    </div>
  );
}