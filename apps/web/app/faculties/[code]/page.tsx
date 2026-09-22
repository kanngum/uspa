"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Building2, GraduationCap, ChevronRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DetailPageSkeleton } from "@/components/ui/loading";
import { EmptyState } from "@/components/ui/empty-state";
import { useFaculty } from "@/app/lib/hooks/useFaculties";

export default function FacultyDetailPage() {
  const params = useParams();
  const code = params.code as string;
  const { data: facultyData, isLoading, isError } = useFaculty(code);
  const faculty = facultyData?.data;

  if (isLoading) return <DetailPageSkeleton />;

  if (isError || !faculty) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link href="/faculties" className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
          <ArrowLeft className="h-4 w-4" /> Back to Faculties
        </Link>
        <EmptyState
          icon="alert"
          title="Faculty not found"
          description={`The faculty "${code}" could not be found.`}
          action={{ label: "Browse Faculties", href: "/faculties" }}
        />
      </div>
    );
  }

  const departments = faculty.departments || [];
  const abbreviation = faculty.abbreviation || code.toUpperCase();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link href="/faculties" className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
          <ArrowLeft className="h-4 w-4" /> Back to Faculties
        </Link>
      </div>

      <div className="mb-8">
        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-blue-600">
          <Building2 className="h-8 w-8 text-white" />
        </div>
        <h1 className="mt-4 text-3xl font-bold text-zinc-900 dark:text-zinc-50">{faculty.name}</h1>
        <div className="mt-2 flex items-center gap-2">
          <Badge variant="info">{abbreviation}</Badge>
          <span className="text-sm text-zinc-500">{departments.length} departments</span>
        </div>
        {faculty.description && (
          <p className="mt-3 max-w-2xl text-zinc-600 dark:text-zinc-400">{faculty.description}</p>
        )}
      </div>

      {departments.length === 0 ? (
        <EmptyState
          icon="book"
          title="No departments listed"
          description="This faculty currently has no departments listed."
          action={{ label: "Browse Programmes", href: "/programmes" }}
        />
      ) : (
        <div className="space-y-6">
          {departments.map((dept: any) => {
            const programmes = dept.programmes || [];
            return (
              <Card key={dept.id || dept.name}>
                <CardContent className="p-6">
                  <h2 className="mb-4 text-xl font-bold text-zinc-900 dark:text-zinc-50">{dept.name}</h2>
                  {programmes.length > 0 ? (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {programmes.map((prog: any) => (
                        <Link key={prog.code || prog.id} href={`/programmes/${prog.code}`}
                          className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white p-4 transition-all hover:border-blue-200 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-800"
                        >
                          <div className="flex items-start gap-3">
                            <GraduationCap className="mt-0.5 h-5 w-5 text-blue-600 dark:text-blue-400" />
                            <div>
                              <p className="font-medium text-zinc-900 dark:text-zinc-50">{prog.name}</p>
                              <div className="mt-1 flex items-center gap-2 text-xs text-zinc-500">
                                <Badge variant="secondary">
                                  {typeof prog.degree === "object" && prog.degree !== null
                                    ? prog.degree.name || prog.degree.code || "N/A"
                                    : prog.degree || "N/A"}
                                </Badge>
                                {prog.duration && (
                                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{prog.duration} years</span>
                                )}
                                {prog.code && <span>{prog.code}</span>}
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-zinc-400" />
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-zinc-500">
                      {dept._count?.programmes || 0} programmes available in this department.
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
