"use client";

import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  Database,
  Search,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { RequirementsRecord } from "@/components/home/RequirementsRecord";
import type { HomeProgrammeRecord } from "@/app/lib/types/home";

interface AdmissionsHeroProps {
  universityName?: string;
  featuredProgramme?: HomeProgrammeRecord;
  featuredLoading?: boolean;
  catalogueCount?: number;
  searchQuery: string;
  suggestions: string[];
  showSuggestions: boolean;
  onSearchQueryChange: (value: string) => void;
  onSearch: (event: React.FormEvent<HTMLFormElement>) => void;
  onOpenUniversitySelector: () => void;
}

export function AdmissionsHero({
  universityName,
  featuredProgramme,
  featuredLoading = false,
  catalogueCount,
  searchQuery,
  suggestions,
  showSuggestions,
  onSearchQueryChange,
  onSearch,
  onOpenUniversitySelector,
}: AdmissionsHeroProps) {
  return (
    <section className="border-b border-rule bg-paper-soft">
      <div className="mx-auto max-w-7xl px-6 pb-16 pt-12 lg:px-8 lg:pb-20 lg:pt-16">
        <div className="grid items-start gap-12 lg:grid-cols-[1.08fr_.92fr] lg:gap-16">
          <div className="min-w-0">
            <div className="mb-6 flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.17em] text-subtle-ink">
              <span className="inline-flex items-center gap-2 text-accent-dark">
                <span
                  className="h-2 w-2 rounded-full bg-accent"
                  aria-hidden="true"
                />
                Powered by{" "}
                <a href="https://www.bamendatechresearchcenter.com/">
                  BTRC
                </a>
              </span>

              <span className="text-rule-strong" aria-hidden="true">
                /
              </span>

              <span>2026/27 Available Programs</span>
            </div>

            <button
              type="button"
              onClick={onOpenUniversitySelector}
              className="mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-rule-strong bg-white px-3.5 py-2 text-[13px] font-semibold text-[#46505d] shadow-xs transition-colors hover:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            >
              <Building2
                className="h-4 w-4 shrink-0 text-accent"
                aria-hidden="true"
              />

              <span className="truncate">
                {universityName || "Select university"}
              </span>

              <ChevronDown
                className="h-3.5 w-3.5 shrink-0"
                aria-hidden="true"
              />
            </button>

            <h1 className="max-w-[650px] text-3xl font-semibold leading-[1.08] tracking-[-0.045em] text-primary sm:text-4xl lg:text-5xl lg:leading-[1.05] lg:tracking-[-0.055em] xl:text-6xl">
              Find Your Perfect
              <br />
              <span className="text-accent">University Programme</span>
            </h1>

            <p className="mt-4 max-w-[580px] text-sm leading-6 text-muted-ink sm:mt-5 sm:text-[15px] sm:leading-7 lg:mt-6 lg:text-[17px] lg:leading-8">
              <b>Notice:</b> Only Available Programs for academic year 2026/27
              will displayed on this platform.
            </p>

            <form
              onSubmit={onSearch}
              className="relative mt-8 max-w-[650px] rounded-control border border-rule-strong bg-white p-2 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <Search
                  className="ml-3 h-5 w-5 shrink-0 text-subtle-ink"
                  aria-hidden="true"
                />

                <input
                  aria-label="Search programmes"
                  value={searchQuery}
                  onChange={(event) =>
                    onSearchQueryChange(event.target.value)
                  }
                  placeholder="Search by programme, subject, career, or code"
                  className="min-w-0 flex-1 bg-transparent py-3 text-sm text-ink outline-hidden placeholder:text-[#8b949e]"
                />

                <Button
                  type="submit"
                  variant="accent"
                  aria-label="Find programmes"
                  className="h-11 w-11 shrink-0 rounded-control p-0 sm:h-auto sm:w-auto sm:gap-2 sm:px-4 sm:py-3"
                >
                  <span className="hidden sm:inline">
                    Find programmes
                  </span>

                  <Search
                    className="h-4 w-4 sm:hidden"
                    aria-hidden="true"
                  />

                  <ArrowUpRight
                    className="hidden h-4 w-4 sm:block"
                    aria-hidden="true"
                  />
                </Button>
              </div>

              {showSuggestions && (
                <div className="absolute left-2 right-2 top-full z-20 mt-2 overflow-hidden rounded-control border border-rule bg-white p-2 shadow-lg">
                  {suggestions.map((suggestion) => (
                    <Link
                      key={suggestion}
                      href={`/programmes?search=${encodeURIComponent(
                        suggestion,
                      )}`}
                      className="flex min-h-11 items-center gap-2 rounded-control px-3 text-sm text-ink transition-colors hover:bg-paper-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                    >
                      <Search
                        className="h-3.5 w-3.5 text-subtle-ink"
                        aria-hidden="true"
                      />

                      <span className="truncate">{suggestion}</span>
                    </Link>
                  ))}
                </div>
              )}
            </form>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-subtle-ink">
              <span className="inline-flex items-center gap-1.5">
                <Database
                  className="h-3.5 w-3.5 text-accent"
                  aria-hidden="true"
                />

                {catalogueCount !== undefined
                  ? `${catalogueCount} programmes currently available`
                  : "Current catalogue records"}
              </span>
            </div>

            <div className="mt-8 flex flex-col gap-3 border-t border-rule pt-5 sm:mt-9 sm:flex-row sm:flex-wrap sm:items-center">
              <Link href="/programmes" className="w-full sm:w-auto">
                <Button
                  variant="primary"
                  className="min-h-12 w-full gap-2 rounded-control px-5 text-sm font-semibold shadow-md transition-transform hover:-translate-y-0.5 sm:w-auto"
                >
                  Browse programmes
                  <ArrowRight
                    className="h-4 w-4"
                    aria-hidden="true"
                  />
                </Button>
              </Link>

              <Link
                href="/admission-checker"
                className="w-full sm:w-auto"
              >
                <Button
                  variant="outline"
                  className="min-h-12 w-full rounded-control border-rule-strong bg-white px-5 text-sm font-semibold text-primary shadow-sm transition-all hover:-translate-y-0.5 hover:border-accent hover:bg-paper-soft dark:bg-zinc-900 dark:bg-[#1B2A4A] dark:text-white dark:hover:bg-[#15213A] sm:w-auto"
                >
                  Check eligibility
                </Button>
              </Link>

              <Link
                href="/ai-advisor"
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-control border border-transparent px-4 text-sm font-semibold text-accent-dark transition-all hover:-translate-y-0.5 hover:border-rule hover:bg-paper-soft hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 sm:w-auto"
              >
                Ask Our Intelligent AI Counselor

                <ArrowUpRight
                  className="h-4 w-4"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>

          <RequirementsRecord
            programme={featuredProgramme}
            isLoading={featuredLoading}
          />
        </div>
      </div>
    </section>
  );
}