import Link from "next/link";
import {
  ArrowUpRight,
  Building2,
  FlaskConical,
  Landmark,
  School,
  Settings2,
} from "lucide-react";
import type { HomeFacultyRecord } from "@/app/lib/types/home";

interface FacultyDirectoryPreviewProps {
  faculties: HomeFacultyRecord[];
  isLoading?: boolean;
}

const facultyIcons = [FlaskConical, Landmark, School, Settings2];

export function FacultyDirectoryPreview({
  faculties,
  isLoading = false,
}: FacultyDirectoryPreviewProps) {
  return (
    <section id="faculties" className="border-b border-rule bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:items-start lg:gap-20">
          
          {/* Introduction */}
          <div className="lg:sticky lg:top-24">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-accent" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-dark">
                Faculties / Schools
              </p>
            </div>

            <h2 className="mt-5 max-w-md text-3xl font-semibold leading-[1.08] tracking-[-0.045em] text-primary sm:text-4xl">
              Find your academic home.
            </h2>

            <p className="mt-5 max-w-md text-sm leading-7 text-muted-ink">
              Explore faculties and schools to discover the programmes,
              requirements, and academic options available at your university.
            </p>

            <Link
              href="/faculties"
              className="group mt-8 inline-flex min-h-11 items-center gap-2 rounded-control border border-rule-strong px-4 text-[13px] font-semibold text-primary transition-all hover:border-accent hover:bg-accent-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            >
              See all faculties and schools
              <ArrowUpRight
                className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>

          {/* Faculty Directory */}
          <div className="overflow-hidden rounded-2xl border border-rule-strong bg-paper-soft shadow-sm">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-rule bg-white px-5 py-4 sm:px-6">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-subtle-ink">
                  Academic directory
                </p>
                <p className="mt-1 text-sm font-medium text-primary">
                  Faculties and schools
                </p>
              </div>

              <span className="hidden text-[10px] font-semibold uppercase tracking-[0.14em] text-subtle-ink sm:block">
                Browse
              </span>
            </div>

            {/* Loading */}
            {isLoading ? (
              <div className="space-y-2 p-3 sm:p-4">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="h-[88px] animate-pulse rounded-xl bg-white"
                  />
                ))}
              </div>
            ) : faculties.length > 0 ? (
              <div className="p-3 sm:p-4">
                {faculties.slice(0, 4).map((faculty, index) => {
                  const Icon = facultyIcons[index] || Building2;

                  return (
                    <Link
                      key={faculty.id || faculty.abbreviation}
                      href={`/faculties/${faculty.abbreviation.toLowerCase()}`}
                      className="group relative flex min-h-[88px] items-center justify-between gap-5 rounded-xl border border-transparent bg-white px-4 py-4 transition-all duration-200 hover:border-rule-strong hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent/40 sm:px-5"
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        {/* Icon */}
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-rule bg-paper-soft text-accent transition-all duration-200 group-hover:border-accent/30 group-hover:bg-accent-soft">
                          <Icon
                            className="h-5 w-5"
                            aria-hidden="true"
                          />
                        </span>

                        {/* Faculty information */}
                        <div className="min-w-0">
                          <p className="truncate text-[15px] font-semibold text-ink">
                            {faculty.name}
                          </p>

                          <div className="mt-1.5 flex items-center gap-2">
                            <span className="font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-accent-dark">
                              {faculty.abbreviation}
                            </span>

                            <span className="h-1 w-1 rounded-full bg-rule-strong" />

                            <p className="truncate text-xs text-subtle-ink">
                              {faculty.programmeCount
                                ? `${faculty.programmeCount} programme records`
                                : "Programme records and requirements"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Arrow */}
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-rule bg-white transition-all duration-200 group-hover:border-accent group-hover:bg-accent group-hover:text-white">
                        <ArrowUpRight
                          className="h-4 w-4 text-subtle-ink transition-colors group-hover:text-white"
                          aria-hidden="true"
                        />
                      </span>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-white text-subtle-ink">
                  <Building2 className="h-5 w-5" aria-hidden="true" />
                </div>

                <p className="mt-4 text-sm font-medium text-primary">
                  No academic units available
                </p>

                <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-muted-ink">
                  Academic units are not available for this university yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
