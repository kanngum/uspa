"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, Building2, Database, Search, ShieldCheck, ChevronDown } from "lucide-react";
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
                <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
                Powered by <a href="https://www.bamendatechresearchcenter.com/">BTRC</a>
              </span>
              <span className="text-rule-strong" aria-hidden="true">/</span>
              <span>2026/27 Available Programs</span>
            </div>

            <button
              type="button"
              onClick={onOpenUniversitySelector}
              className="mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-rule-strong bg-white px-3.5 py-2 text-[13px] font-semibold text-[#46505d] shadow-xs transition-colors hover:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            >
              <Building2 className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
              <span className="truncate">{universityName || "Select university"}</span>
              <ChevronDown className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            </button>

            <h1 className="max-w-[650px] text-5xl font-semibold leading-[1.05] tracking-[-0.055em] text-primary sm:text-6xl">
              Find Your Perfect
              <br />
              <span className="text-accent">University Programme</span>
            </h1>
            <p className="mt-6 max-w-[580px] text-[17px] leading-8 text-muted-ink">
              <b>Notice:</b> All Available programs Only for academic year 2026/27 are displayed on this platform.
            </p>

            <form onSubmit={onSearch} className="relative mt-8 max-w-[650px] rounded-control border border-rule-strong bg-white p-2 shadow-sm">
              <div className="flex items-center gap-3">
                <Search className="ml-3 h-5 w-5 shrink-0 text-subtle-ink" aria-hidden="true" />
                <input
                  aria-label="Search programmes"
                  value={searchQuery}
                  onChange={(event) => onSearchQueryChange(event.target.value)}
                  placeholder="Search by programme, subject, career, or code"
                  className="min-w-0 flex-1 bg-transparent py-3 text-sm text-ink outline-hidden placeholder:text-[#8b949e]"
                />
                <Button type="submit" variant="accent" className="shrink-0 gap-2 rounded-control px-4 py-3">
                  Find programmes
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
              {showSuggestions && (
                <div className="absolute left-2 right-2 top-full z-20 mt-2 overflow-hidden rounded-control border border-rule bg-white p-2 shadow-lg">
                  {suggestions.map((suggestion) => (
                    <Link
                      key={suggestion}
                      href={`/programmes?search=${encodeURIComponent(suggestion)}`}
                      className="flex min-h-11 items-center gap-2 rounded-control px-3 text-sm text-ink transition-colors hover:bg-paper-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                    >
                      <Search className="h-3.5 w-3.5 text-subtle-ink" aria-hidden="true" />
                      <span className="truncate">{suggestion}</span>
                    </Link>
                  ))}
                </div>
              )}
            </form>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-subtle-ink">
              <span className="inline-flex items-center gap-1.5">
                <Database className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                {catalogueCount !== undefined ? `${catalogueCount} programmes currently available` : "Current catalogue records"}
              </span>
            
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-3 border-t border-rule pt-5">
              <Link href="/programmes">
                <Button variant="primary" className="gap-2 rounded-control">
                  Browse programmes
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </Link>
              <Link href="/admission-checker">
                <Button variant="outline" className="rounded-control border-rule-strong bg-white text-primary hover:border-accent">
                  Check eligibility
                </Button>
              </Link>
              <Link href="/ai-advisor" className="inline-flex min-h-11 items-center gap-2 px-2 text-[13px] font-semibold text-accent-dark transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40">
                Ask the AI Advisor
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <RequirementsRecord programme={featuredProgramme} isLoading={featuredLoading} />
        </div>
      </div>
    </section>
  );
}
