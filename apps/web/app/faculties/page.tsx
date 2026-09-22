"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Building2, ChevronRight, GraduationCap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FacultyCardSkeleton } from "@/components/ui/loading";
import { EmptyState } from "@/components/ui/empty-state";
import { useFaculties } from "@/app/lib/hooks/useFaculties";
import { useUniversity } from "@/app/lib/context/UniversityContext";

export default function FacultiesPage() {
  const { selectedUniversity } = useUniversity();

  const {
    data: facultiesData,
    isLoading,
    isError,
  } = useFaculties(selectedUniversity?.id);

  const faculties = useMemo(() => {
    if (!facultiesData?.data) return [];

    return facultiesData.data.map((f: any) => ({
      id: f.id,
      name: f.name,
      abb:
        f.abbreviation ||
        f.name.substring(0, 4).toUpperCase(),
      description:
        f.description ||
        "Offering programmes in various disciplines.",
      departments: f.departments || [],
      departmentCount:
        f._count?.departments ||
        f.departments?.length ||
        0,
      programmeCount:
        f._count?.programmes || 0,
    }));
  }, [facultiesData]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="h-8 w-64 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
          <div className="mt-1 h-4 w-96 animate-pulse rounded bg-zinc-100 dark:bg-zinc-900" />
        </div>

        <div className="space-y-6">
          {[1, 2, 3, 4].map((i) => (
            <FacultyCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <EmptyState
          icon="alert"
          title="Failed to load faculties"
          description="We couldn't load the faculties. Please try again later."
          action={{ label: "Retry", href: "/faculties" }}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          Faculties & Schools
        </h1>

        <p className="mt-1 text-zinc-600 dark:text-zinc-400">
          Browse programmes offered by each faculty at{" "}
          {selectedUniversity?.name || "your selected university"}
        </p>
      </div>

      {faculties.length === 0 ? (
        <EmptyState
          icon="book"
          title="No faculties available"
          description="Faculties information is not available at the moment."
        />
      ) : (
        <div className="space-y-6">
          {faculties.map((faculty: any) => (
            <Card
              key={faculty.id || faculty.abb}
              className="overflow-hidden"
            >
              <CardContent className="p-0">
                <div className="grid md:grid-cols-3">
                  {/* Faculty Header */}
                  <div className="bg-gradient-to-br from-[#1B2A4A] to-[#2A3F66] p-6 dark:from-[#0A0F1A] dark:to-[#1B2A4A]">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#0FA3B1]">
                      <Building2 className="h-6 w-6 text-white" />
                    </div>

                    <h2 className="mt-4 text-xl font-bold text-white">
                      {faculty.name}
                    </h2>

                    <Badge variant="info" className="mt-2">
                      {faculty.abb}
                    </Badge>

                    <p className="mt-3 text-sm text-zinc-300">
                      {faculty.description}
                    </p>

                    <Link
                      href={`/faculties/${faculty.abb.toLowerCase()}`}
                    >
                      <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#0FA3B1] hover:text-[#0C8793]">
                        View all programmes
                        <ChevronRight className="h-4 w-4" />
                      </span>
                    </Link>
                  </div>

                  {/* Departments */}
                  <div className="col-span-2 p-6">
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      {faculty.departmentCount > 0
                        ? "Departments"
                        : "Overview"}
                    </h3>

                    {faculty.departments.length > 0 ? (
                      <div className="grid gap-3 sm:grid-cols-2">
                        {faculty.departments.map((dept: any) => (
                          <Link
                            key={dept.id || dept.name}
                            href={`/programmes?department=${encodeURIComponent(
                              dept.id || dept.name,
                            )}`}
                            className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white p-3 transition-all hover:border-blue-200 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-800"
                          >
                            <div className="flex items-center gap-2">
                              <GraduationCap className="h-4 w-4 text-zinc-400" />

                              <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                                {dept.name}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-xs text-zinc-400">
                                {dept._count?.programmes ||
                                  dept.programmes ||
                                  0}{" "}
                                programmes
                              </span>

                              <ChevronRight className="h-4 w-4 text-zinc-400" />
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-zinc-500">
                        {faculty.departmentCount} departments
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}