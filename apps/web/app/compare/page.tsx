"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, XCircle, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { useToast } from "@/components/ui/toast";
import { useCompare } from "@/app/lib/hooks/useCompare";

const defaultProgrammeIds: string[] = [];

export default function ComparePage() {
  const [programmeIds, setProgrammeIds] = useState<string[]>(defaultProgrammeIds);
  const [comparisonData, setComparisonData] = useState<any>(null);
  const { addToast } = useToast();
  const compareMutation = useCompare();

  // Attempt to load comparison from URL query params or localStorage
  useEffect(() => {
    const stored = localStorage.getItem("uspa_compare_ids");
    if (stored) {
      try {
        const ids = JSON.parse(stored);
        if (Array.isArray(ids) && ids.length >= 2) {
          setProgrammeIds(ids);
          compareMutation.mutate(ids, {
            onSuccess: (data: any) => setComparisonData(data?.data || data),
            onError: () => addToast("Failed to load comparison data", "error"),
          });
        }
      } catch {}
    }
  }, []);

  const programmes = comparisonData?.programmes ||
    comparisonData?.eligible ||
    comparisonData?.data ||
    [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link href="/favourites" className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
          <ArrowLeft className="h-4 w-4" /> Back to Saved
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Compare Programmes</h1>
        <p className="mt-1 text-zinc-600 dark:text-zinc-400">Side-by-side comparison of selected programmes</p>
      </div>

      {compareMutation.isPending && (
        <div className="flex justify-center py-20">
          <div className="space-y-4 w-full">
            <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-pulse" />
            <div className="h-64 bg-zinc-100 dark:bg-zinc-900 rounded-xl animate-pulse" />
          </div>
        </div>
      )}

      {compareMutation.isError && (
        <EmptyState
          icon="alert"
          title="Comparison failed"
          description="Could not load programme comparison data. Please try again."
          action={{ label: "Go to Favourites", href: "/favourites" }}
        />
      )}

      {!compareMutation.isPending && !compareMutation.isError && programmes.length === 0 && (
        <EmptyState
          icon="inbox"
          title="No programmes to compare"
          description="Select at least two programmes from your favourites to compare them."
          action={{ label: "Browse Programmes", href: "/programmes" }}
        />
      )}

      {programmes.length >= 2 && !compareMutation.isPending && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800">
                <th className="sticky left-0 z-10 bg-white px-6 py-4 text-left dark:bg-zinc-950">
                  <span className="text-xs font-medium uppercase text-zinc-500">Feature</span>
                </th>
                {programmes.slice(0, 4).map((prog: any, i: number) => (
                  <th key={i} className="px-6 py-4 text-left">
                    <Link href={`/programmes/${prog.code}`} className="font-semibold text-zinc-900 hover:text-blue-600 dark:text-zinc-50 dark:hover:text-blue-400">
                      {prog.name}
                    </Link>
                    <p className="mt-1 text-xs text-zinc-500">{prog.code}</p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {/* Degree */}
              <tr className="bg-white hover:bg-zinc-50 dark:bg-zinc-950 dark:hover:bg-zinc-900">
                <td className="sticky left-0 z-10 bg-white px-6 py-4 font-medium text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">Degree</td>
                {programmes.slice(0, 4).map((prog: any, i: number) => (
                  <td key={i} className="px-6 py-4 text-zinc-700 dark:text-zinc-300">{prog.degree || "N/A"}</td>
                ))}
              </tr>
              {/* Duration */}
              <tr className="bg-white hover:bg-zinc-50 dark:bg-zinc-950 dark:hover:bg-zinc-900">
                <td className="sticky left-0 z-10 bg-white px-6 py-4 font-medium text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">Duration</td>
                {programmes.slice(0, 4).map((prog: any, i: number) => (
                  <td key={i} className="px-6 py-4 text-zinc-700 dark:text-zinc-300">{prog.duration ? `${prog.duration} years` : "N/A"}</td>
                ))}
              </tr>
              {/* Level */}
              <tr className="bg-white hover:bg-zinc-50 dark:bg-zinc-950 dark:hover:bg-zinc-900">
                <td className="sticky left-0 z-10 bg-white px-6 py-4 font-medium text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">Level</td>
                {programmes.slice(0, 4).map((prog: any, i: number) => (
                  <td key={i} className="px-6 py-4 text-zinc-700 dark:text-zinc-300">{prog.level?.replace(/_/g, " ") || "N/A"}</td>
                ))}
              </tr>
              {/* Faculty */}
              <tr className="bg-white hover:bg-zinc-50 dark:bg-zinc-950 dark:hover:bg-zinc-900">
                <td className="sticky left-0 z-10 bg-white px-6 py-4 font-medium text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">Faculty</td>
                {programmes.slice(0, 4).map((prog: any, i: number) => {
                  const facultyName = prog.department?.academicUnit?.name || prog.faculty || "N/A";
                  return (
                    <td key={i} className="px-6 py-4 text-zinc-700 dark:text-zinc-300">{facultyName}</td>
                  );
                })}
              </tr>
              {/* Requirements table */}
              {programmes[0]?.requirements?.slice(0, 5).map((req: any, idx: number) => {
                const subjectName = req.subject?.name || req.subject || "Subject";
                return (
                  <tr key={idx} className="bg-white hover:bg-zinc-50 dark:bg-zinc-950 dark:hover:bg-zinc-900">
                    <td className="sticky left-0 z-10 bg-white px-6 py-4 font-medium text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">{subjectName}</td>
                    {programmes.slice(0, 4).map((prog: any, j: number) => {
                      const progReq = prog.requirements?.[idx];
                      const minGrade = progReq?.minimumGrade || progReq?.grade || "-";
                      const reqType = progReq?.requirementType || progReq?.type;
                      const isReq = reqType === "REQUIRED";
                      return (
                        <td key={j} className="px-6 py-4">
                          <div className="flex items-center gap-1.5">
                            {minGrade !== "-" ? (
                              isReq ? (
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                              ) : (
                                <span className="text-zinc-400">○</span>
                              )
                            ) : (
                              <XCircle className="h-4 w-4 text-zinc-300" />
                            )}
                            <span className={isReq ? "font-medium text-zinc-900 dark:text-zinc-50" : "text-zinc-500"}>
                              {minGrade}
                            </span>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {programmes.length >= 2 && !compareMutation.isPending && (
        <div className="mt-6 flex justify-between">
          <Link href="/favourites">
            <Button variant="outline"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Favourites</Button>
          </Link>
          <div className="flex gap-2">
            <Link href="/admission-checker">
              <Button variant="primary"><GraduationCap className="mr-2 h-4 w-4" /> Check Eligibility</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
