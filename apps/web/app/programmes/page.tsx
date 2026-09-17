"use client";

import { Suspense, useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, Filter, Grid3X3, List, ChevronRight, BookOpen, Clock, Building2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { ProgrammeCardSkeleton, ProgrammeListSkeleton, FilterSkeleton, SearchResultHeaderSkeleton } from "@/components/ui/loading";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { useSearchProgrammes } from "@/app/lib/hooks/useProgrammes";
import { useFaculties } from "@/app/lib/hooks/useFaculties";
import { useUniversity } from "@/app/lib/context/UniversityContext";

const degreeOptions = [
  { value: "BSC", label: "BSc" },
  { value: "BA", label: "BA" },
  { value: "BENG", label: "BEng" },
  { value: "BED", label: "BEd" },
  { value: "LLB", label: "LLB" },
  { value: "MBBS", label: "MBBS" },
  { value: "HND", label: "HND" },
  { value: "MSC", label: "MSc" },
  { value: "MA", label: "MA" },
  { value: "PHD", label: "PhD" },
];

const levelOptions = [
  { value: "UNDERGRADUATE", label: "Undergraduate" },
  { value: "POSTGRADUATE", label: "Postgraduate" },
  { value: "DOCTORATE", label: "Doctorate" },
  { value: "PROFESSIONAL", label: "Professional" },
];

function ProgrammesContent() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("search") || "");
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    degree: "",
    level: "",
    faculty: "",
    sortBy: "name",
    minFee: "",
    maxFee: "",
  });

  const { selectedUniversity } = useUniversity();
  const { data: facultiesData } = useFaculties();
  const { data: programmesData, isLoading, isError } = useSearchProgrammes({
    query: debouncedQuery || undefined,
    universityId: selectedUniversity?.id || undefined,
    degreeType: filters.degree || undefined,
    level: filters.level || undefined,
    facultyId: filters.faculty || undefined,
    minFee: filters.minFee ? Number(filters.minFee) : undefined,
    maxFee: filters.maxFee ? Number(filters.maxFee) : undefined,
    page,
    limit: 12,
  });

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const programmes = useMemo(() => {
    if (!programmesData?.data) return [];
    return programmesData.data;
  }, [programmesData]);

  const total = programmesData?.total || 0;
  const totalPages = programmesData?.totalPages || 1;

  const facultyOptions = useMemo(() => {
    if (!facultiesData?.data) return [];
    return facultiesData.data.map((f: any) => ({
      value: f.id,
      label: f.name,
    }));
  }, [facultiesData]);

  const sortedProgrammes = useMemo(() => {
    const sorted = [...programmes];
    switch (filters.sortBy) {
      case "name-desc":
        return sorted.sort((a: any, b: any) => b.name.localeCompare(a.name));
      case "duration":
        return sorted.sort((a: any, b: any) => a.duration - b.duration);
      case "duration-desc":
        return sorted.sort((a: any, b: any) => b.duration - a.duration);
      default:
        return sorted.sort((a: any, b: any) => a.name.localeCompare(b.name));
    }
  }, [programmes, filters.sortBy]);

  const handleClearFilters = () => {
    setFilters({ degree: "", level: "", faculty: "", sortBy: "name", minFee: "", maxFee: "" });
    setQuery("");
    setDebouncedQuery("");
    setPage(1);
  };

  const handleApplyFilters = () => {
    setPage(1);
    setShowFilters(false);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Programmes</h1>
        <p className="mt-1 text-zinc-600 dark:text-zinc-400">
Browse all programmes offered across faculties and schools
        </p>
      </div>

      {/* Search & Filters Bar */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search programmes by name, keyword, or code..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-[#1B2A4A] focus:outline-none focus:ring-1 focus:ring-[#1B2A4A]/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="gap-2">
              <Filter className="h-4 w-4" /> Filters
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setView("grid")} className={view === "grid" ? "bg-zinc-100 dark:bg-zinc-800" : ""}>
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setView("list")} className={view === "list" ? "bg-zinc-100 dark:bg-zinc-800" : ""}>
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-500">Degree Type</label>
                <Select
                  options={degreeOptions}
                  placeholder="All Degrees"
                  value={filters.degree}
                  onChange={(e) => setFilters({ ...filters, degree: e.target.value })}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-500">Level</label>
                <Select
                  options={levelOptions}
                  placeholder="All Levels"
                  value={filters.level}
                  onChange={(e) => setFilters({ ...filters, level: e.target.value })}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-500">Faculty</label>
                <Select
                  options={[
                    { value: "all", label: "All Faculties" },
                    ...facultyOptions,
                  ]}
                  placeholder="All Faculties"
                  value={filters.faculty}
                  onChange={(e) => setFilters({ ...filters, faculty: e.target.value === "all" ? "" : e.target.value })}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-500">Sort By</label>
                <Select
                  options={[
                    { value: "name", label: "Name (A-Z)" },
                    { value: "name-desc", label: "Name (Z-A)" },
                    { value: "duration", label: "Duration (Shortest)" },
                    { value: "duration-desc", label: "Duration (Longest)" },
                  ]}
                  value={filters.sortBy}
                  onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                />
              </div>
            </div>
            {/* Tuition Fee Range Filter */}
            <div className="mt-4 border-t border-zinc-100 pt-4 dark:border-zinc-700">
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-zinc-500">Tuition Fee (XAF):</label>
              </div>
              <div className="mt-2 flex items-center gap-3">
                <input
                  type="number"
                  placeholder="Min fee"
                  value={filters.minFee}
                  onChange={(e) => setFilters({ ...filters, minFee: e.target.value })}
                  className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus:border-[#1B2A4A] focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
                />
                <span className="text-zinc-400">to</span>
                <input
                  type="number"
                  placeholder="Max fee"
                  value={filters.maxFee}
                  onChange={(e) => setFilters({ ...filters, maxFee: e.target.value })}
                  className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus:border-[#1B2A4A] focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
                />
              </div>
            </div>
            <div className="mt-3 flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setFilters({ degree: "", level: "", faculty: "", sortBy: "name", minFee: "", maxFee: "" })}>
                Clear Filters
              </Button>
              <Button size="sm" onClick={handleApplyFilters}>Apply Filters</Button>
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      {isLoading ? (
        <SearchResultHeaderSkeleton />
      ) : isError ? (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          <AlertCircle className="h-4 w-4" /> Failed to load programmes. Please try again.
        </div>
      ) : (
        <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
          Showing <span className="font-medium text-zinc-900 dark:text-zinc-50">{total}</span> programme{total !== 1 ? "s" : ""}
        </p>
      )}

      {/* Loading State */}
      {isLoading ? (
        view === "grid" ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => <ProgrammeCardSkeleton key={i} />)}
          </div>
        ) : (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => <ProgrammeListSkeleton key={i} />)}
          </div>
        )
      ) : isError ? (
        <EmptyState
          icon="alert"
          title="Unable to load programmes"
          description="There was a problem fetching programmes. Please try again later."
        />
      ) : sortedProgrammes.length === 0 ? (
        <EmptyState
          icon="search"
          title="No programmes found"
          description={debouncedQuery ? `No programmes matching "${debouncedQuery}". Try different search terms or filters.` : "No programmes match the selected filters."}
          action={{ label: "Clear Filters", href: "/programmes" }}
        />
      ) : view === "grid" ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sortedProgrammes.map((prog: any) => (
            <Link key={prog.id} href={`/programmes/${prog.code}`}>
              <Card className="group h-full transition-all hover:shadow-md">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <Badge variant="secondary">{prog.degree}</Badge>
                    <span className="text-xs text-zinc-400">{prog.code}</span>
                  </div>
                  <h3 className="mt-3 font-semibold text-zinc-900 group-hover:text-blue-600 dark:text-zinc-50 dark:group-hover:text-blue-400">
                    {prog.name}
                  </h3>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                      <Building2 className="h-3.5 w-3.5" />
                      {prog.department?.academicUnit?.name || "N/A"}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                      <Clock className="h-3.5 w-3.5" />
                      {prog.duration} {prog.duration === 1 ? "year" : "years"}
                    </div>
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400">
                    {prog.description || "A comprehensive programme designed to equip students with relevant knowledge and skills."}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="space-y-3">
          {sortedProgrammes.map((prog: any) => (
            <Link key={prog.id} href={`/programmes/${prog.code}`}>
              <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-4 transition-all hover:border-blue-200 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-800">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">{prog.name}</h3>
                      <Badge variant="secondary">{prog.degree}</Badge>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
                      <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" />{prog.department?.academicUnit?.name || "N/A"}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{prog.duration} years</span>
                      <span>{prog.code}</span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-zinc-400" />
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && !isError && totalPages > 1 && (
        <div className="mt-8 flex items-center justify-between">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProgrammesPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-20 text-center"><p className="text-zinc-500">Loading programmes...</p></div>}>
      <ProgrammesContent />
    </Suspense>
  );
}

