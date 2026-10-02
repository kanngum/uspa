
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { useCompare } from "@/app/lib/hooks/useCompare";

const COMPARE_STORAGE_KEY = "uspa_compare_ids";
const MAX_COMPARE_PROGRAMMES = 4;

type DegreeValue =
  | string
  | {
      id?: string | null;
      name?: string | null;
      code?: string | null;
    }
  | null
  | undefined;

type Programme = {
  id: string;
  code?: string | null;
  name?: string | null;
  degree?: DegreeValue;
  faculty?: string | null;
  duration?: string | number | null;
  level?: string | null;
  university?: {
    id?: string | null;
    name?: string | null;
    code?: string | null;
  } | null;
  department?: {
    id?: string | null;
    name?: string | null;
    academicUnit?: {
      id?: string | null;
      name?: string | null;
      university?: {
        id?: string | null;
        name?: string | null;
        code?: string | null;
      } | null;
    } | null;
  } | null;
  academicUnit?: {
    id?: string | null;
    name?: string | null;
  } | null;
  requirements?: Array<{
    id?: string | null;
    subjectId?: string | null;
    minimumGrade?: string | null;
    minimumCount?: number | null;
    subject?: {
      id?: string | null;
      name?: string | null;
      code?: string | null;
    } | null;
  }>;
  tuition?:
    | {
        amount?: number | null;
        currency?: string | null;
        period?: string | null;
      }
    | null;
  entryRequirements?: string | null;
  applicationStatus?: string | null;
  applicationDeadline?: string | null;
};

function unwrapResponse(payload: any): any {
  let current = payload;

  for (let i = 0; i < 5; i += 1) {
    if (
      current &&
      typeof current === "object" &&
      !Array.isArray(current) &&
      current.data !== undefined
    ) {
      current = current.data;
      continue;
    }

    break;
  }

  return current;
}

function extractProgrammes(payload: any): any[] {
  const unwrapped = unwrapResponse(payload);

  if (Array.isArray(unwrapped)) {
    return unwrapped;
  }

  if (!unwrapped || typeof unwrapped !== "object") {
    return [];
  }

  const candidates = [
    unwrapped.programmes,
    unwrapped.results,
    unwrapped.items,
    unwrapped.eligible,
    unwrapped.data,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate;
    }
  }

  return [];
}

function getDegreeName(degree?: DegreeValue): string {
  if (!degree) {
    return "";
  }

  if (typeof degree === "string") {
    return degree;
  }

  return degree.name || degree.code || "";
}

function normaliseProgramme(value: any): Programme | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const source =
    value.programme &&
    typeof value.programme === "object" &&
    !Array.isArray(value.programme)
      ? value.programme
      : value;

  if (!source.id || typeof source.id !== "string") {
    return null;
  }

  const department =
    source.department && typeof source.department === "object"
      ? source.department
      : null;

  const academicUnit =
    department?.academicUnit ||
    (source.academicUnit && typeof source.academicUnit === "object"
      ? source.academicUnit
      : null);

  const university =
    department?.academicUnit?.university ||
    (source.university && typeof source.university === "object"
      ? source.university
      : null);

  return {
    id: source.id,
    code: source.code ?? null,
    name: source.name ?? null,
    degree: getDegreeName(
      source.degree ?? source.degreeName ?? null,
    ),
    faculty: source.faculty ?? academicUnit?.name ?? null,
    duration: source.duration ?? null,
    level: source.level ?? null,
    university,
    department,
    academicUnit,
    requirements: Array.isArray(source.requirements)
      ? source.requirements
      : [],
    tuition:
      source.tuition && typeof source.tuition === "object"
        ? source.tuition
        : null,
    entryRequirements: source.entryRequirements ?? null,
    applicationStatus: source.applicationStatus ?? null,
    applicationDeadline: source.applicationDeadline ?? null,
  };
}

function formatTuition(tuition: Programme["tuition"]): string {
  if (!tuition) {
    return "Not specified";
  }

  const amount =
    typeof tuition.amount === "number"
      ? tuition.amount.toLocaleString()
      : tuition.amount;

  const currency = tuition.currency || "";
  const period = tuition.period ? ` / ${tuition.period}` : "";

  if (!amount && !currency) {
    return "Not specified";
  }

  return `${amount || ""} ${currency}${period}`.trim();
}

function formatDeadline(deadline?: string | null): string {
  if (!deadline) {
    return "Not specified";
  }

  const date = new Date(deadline);

  if (Number.isNaN(date.getTime())) {
    return deadline;
  }

  return date.toLocaleDateString();
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined || value === "") {
    return "N/A";
  }

  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  if (typeof value === "object") {
    const objectValue = value as Record<string, unknown>;

    if (typeof objectValue.name === "string") {
      return objectValue.name;
    }

    if (typeof objectValue.code === "string") {
      return objectValue.code;
    }
  }

  return "N/A";
}

function EmptyCompareState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="flex min-h-72 flex-col items-center justify-center px-6 py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
          <GraduationCap className="h-8 w-8 text-zinc-400 dark:text-zinc-500" />
        </div>

        <h2 className="mt-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          {title}
        </h2>

        <p className="mt-2 max-w-sm text-zinc-500 dark:text-zinc-400">
          {description}
        </p>

        {action ? <div className="mt-6">{action}</div> : null}
      </CardContent>
    </Card>
  );
}

export default function ComparePage() {
  const [programmeIds, setProgrammeIds] = useState<string[]>([]);
  const [comparisonData, setComparisonData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const { addToast } = useToast();
  const compareMutation = useCompare();

  useEffect(() => {
    const loadComparison = async () => {
      setLoading(true);
      setLoadError(false);

      try {
        const params = new URLSearchParams(window.location.search);

        const queryIds = params.get("ids");
        const queryProgrammes = params.get("programmes");

        let selectedIds: string[] = [];

        if (queryIds) {
          selectedIds = queryIds
            .split(",")
            .map((id) => id.trim())
            .filter(Boolean);
        }

        if (selectedIds.length < 2 && queryProgrammes) {
          selectedIds = queryProgrammes
            .split(",")
            .map((id) => id.trim())
            .filter(Boolean);
        }

        if (selectedIds.length < 2) {
          const stored = localStorage.getItem(COMPARE_STORAGE_KEY);

          if (stored) {
            try {
              const parsed = JSON.parse(stored);

              if (Array.isArray(parsed)) {
                selectedIds = parsed
                  .filter(
                    (id): id is string =>
                      typeof id === "string" && id.length > 0,
                  )
                  .slice(0, MAX_COMPARE_PROGRAMMES);
              }
            } catch {
              localStorage.removeItem(COMPARE_STORAGE_KEY);
            }
          }
        }

        selectedIds = Array.from(new Set(selectedIds)).slice(
          0,
          MAX_COMPARE_PROGRAMMES,
        );

        setProgrammeIds(selectedIds);

        if (selectedIds.length < 2) {
          setComparisonData(null);
          setLoading(false);
          return;
        }

        localStorage.setItem(
          COMPARE_STORAGE_KEY,
          JSON.stringify(selectedIds),
        );

        compareMutation.mutate(selectedIds, {
          onSuccess: (data: any) => {
            const rawProgrammes = extractProgrammes(data);

            const programmes = rawProgrammes
              .map(normaliseProgramme)
              .filter(
                (programme): programme is Programme =>
                  programme !== null,
              );

            if (programmes.length < 2) {
              setLoadError(true);
              setComparisonData(null);
              setLoading(false);
              return;
            }

            setComparisonData({
              programmes,
            });

            setLoading(false);
          },

          onError: (error: any) => {
            console.error("Compare request failed:", error);

            setLoadError(true);
            setComparisonData(null);
            setLoading(false);

            addToast(
              "Failed to load comparison data. Please try again.",
              "error",
            );
          },
        });
      } catch (error) {
        console.error("Compare loading failed:", error);
        setLoadError(true);
        setLoading(false);
      }
    };

    void loadComparison();
  }, []);

  const programmes: Programme[] = comparisonData?.programmes || [];

  const requirementRows = useMemo(() => {
    const requirements = new Map<
      string,
      {
        subjectName: string;
        subjectId: string;
        values: Map<string, string>;
      }
    >();

    for (const programme of programmes) {
      for (const requirement of programme.requirements || []) {
        const subjectId =
          requirement.subjectId ||
          requirement.subject?.id ||
          requirement.subject?.code ||
          requirement.subject?.name ||
          requirement.id ||
          "";

        if (!subjectId) {
          continue;
        }

        const subjectName =
          requirement.subject?.name ||
          requirement.subject?.code ||
          subjectId;

        if (!requirements.has(subjectId)) {
          requirements.set(subjectId, {
            subjectName,
            subjectId,
            values: new Map<string, string>(),
          });
        }

        let value = "Required";

        if (requirement.minimumGrade) {
          value = requirement.minimumGrade;
        } else if (
          typeof requirement.minimumCount === "number" &&
          requirement.minimumCount > 0
        ) {
          value = `Minimum ${requirement.minimumCount}`;
        }

        requirements
          .get(subjectId)!
          .values.set(programme.id, value);
      }
    }

    return Array.from(requirements.values());
  }, [programmes]);

  const handleClear = () => {
    localStorage.removeItem(COMPARE_STORAGE_KEY);
    setProgrammeIds([]);
    setComparisonData(null);
    setLoadError(false);
    window.history.replaceState({}, "", "/compare");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-paper py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link
              href="/programmes"
              className="inline-flex items-center gap-2 text-sm font-medium text-secondary hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to programmes
            </Link>
          </div>

          <Card>
            <CardContent className="flex min-h-64 items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
                <p className="text-sm text-secondary">
                  Loading comparison...
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  if (loadError) {
    return (
      <main className="min-h-screen bg-paper py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link
              href="/programmes"
              className="inline-flex items-center gap-2 text-sm font-medium text-secondary hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to programmes
            </Link>
          </div>

          <EmptyCompareState
            title="Programmes could not be loaded"
            description="The selected programmes could not be found. Please select them again."
            action={
              <Button asChild variant="primary">
                <Link href="/programmes">Browse programmes</Link>
              </Button>
            }
          />
        </div>
      </main>
    );
  }

  if (programmes.length < 2) {
    return (
      <main className="min-h-screen bg-paper py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link
              href="/programmes"
              className="inline-flex items-center gap-2 text-sm font-medium text-secondary hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to programmes
            </Link>
          </div>

          <EmptyCompareState
            title="Select programmes to compare"
            description="Choose at least two programmes to see their differences side by side."
            action={
              <Button asChild variant="primary">
                <Link href="/programmes">Browse programmes</Link>
              </Button>
            }
          />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-paper py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link
              href="/programmes"
              className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-secondary hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to programmes
            </Link>

            <h1 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              Compare Programmes
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-secondary sm:text-base">
              Side-by-side comparison of selected programmes.
            </p>
          </div>

          <Button variant="outline" onClick={handleClear}>
            Clear comparison
          </Button>
        </div>

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="min-w-[900px] w-full border-collapse">
                <thead>
                  <tr className="border-b border-rule bg-paper-soft">
                    <th className="sticky left-0 z-10 min-w-48 border-r border-rule bg-paper-soft p-4 text-left text-sm font-semibold text-primary">
                      Programme
                    </th>

                    {programmes.map((programme) => (
                      <th
                        key={programme.id}
                        className="min-w-64 p-4 text-left align-top"
                      >
                        <div className="space-y-2">
                          <div className="text-base font-semibold text-primary">
                            {programme.name || "Unnamed programme"}
                          </div>

                          {programme.code && (
                            <div className="text-xs font-medium text-secondary">
                              {programme.code}
                            </div>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  <tr className="border-b border-rule">
                    <th className="sticky left-0 z-10 border-r border-rule bg-white p-4 text-left text-sm font-medium text-secondary">
                      University
                    </th>

                    {programmes.map((programme) => (
                      <td
                        key={programme.id}
                        className="p-4 text-sm text-primary"
                      >
                        {formatValue(programme.university?.name)}
                      </td>
                    ))}
                  </tr>

                  <tr className="border-b border-rule">
                    <th className="sticky left-0 z-10 border-r border-rule bg-white p-4 text-left text-sm font-medium text-secondary">
                      Academic Unit
                    </th>

                    {programmes.map((programme) => (
                      <td
                        key={programme.id}
                        className="p-4 text-sm text-primary"
                      >
                        {formatValue(
                          programme.department?.academicUnit?.name ||
                            programme.academicUnit?.name,
                        )}
                      </td>
                    ))}
                  </tr>

                  <tr className="border-b border-rule">
                    <th className="sticky left-0 z-10 border-r border-rule bg-white p-4 text-left text-sm font-medium text-secondary">
                      Department
                    </th>

                    {programmes.map((programme) => (
                      <td
                        key={programme.id}
                        className="p-4 text-sm text-primary"
                      >
                        {formatValue(programme.department?.name)}
                      </td>
                    ))}
                  </tr>

                  <tr className="border-b border-rule">
                    <th className="sticky left-0 z-10 border-r border-rule bg-white p-4 text-left text-sm font-medium text-secondary">
                      Degree
                    </th>

                    {programmes.map((programme) => (
                      <td
                        key={programme.id}
                        className="p-4 text-sm text-primary"
                      >
                        {getDegreeName(programme.degree)}
                      </td>
                    ))}
                  </tr>

                  <tr className="border-b border-rule">
                    <th className="sticky left-0 z-10 border-r border-rule bg-white p-4 text-left text-sm font-medium text-secondary">
                      Level
                    </th>

                    {programmes.map((programme) => (
                      <td
                        key={programme.id}
                        className="p-4 text-sm text-primary"
                      >
                        {formatValue(programme.level)}
                      </td>
                    ))}
                  </tr>

                  <tr className="border-b border-rule">
                    <th className="sticky left-0 z-10 border-r border-rule bg-white p-4 text-left text-sm font-medium text-secondary">
                      Duration
                    </th>

                    {programmes.map((programme) => (
                      <td
                        key={programme.id}
                        className="p-4 text-sm text-primary"
                      >
                        {formatValue(programme.duration)}
                      </td>
                    ))}
                  </tr>

                  <tr className="border-b border-rule">
                    <th className="sticky left-0 z-10 border-r border-rule bg-white p-4 text-left text-sm font-medium text-secondary">
                      Tuition
                    </th>

                    {programmes.map((programme) => (
                      <td
                        key={programme.id}
                        className="p-4 text-sm text-primary"
                      >
                        {formatTuition(programme.tuition)}
                      </td>
                    ))}
                  </tr>

                  <tr className="border-b border-rule">
                    <th className="sticky left-0 z-10 border-r border-rule bg-white p-4 text-left text-sm font-medium text-secondary">
                      Application status
                    </th>

                    {programmes.map((programme) => (
                      <td
                        key={programme.id}
                        className="p-4 text-sm text-primary"
                      >
                        {formatValue(programme.applicationStatus)}
                      </td>
                    ))}
                  </tr>

                  <tr className="border-b border-rule">
                    <th className="sticky left-0 z-10 border-r border-rule bg-white p-4 text-left text-sm font-medium text-secondary">
                      Application deadline
                    </th>

                    {programmes.map((programme) => (
                      <td
                        key={programme.id}
                        className="p-4 text-sm text-primary"
                      >
                        {formatDeadline(programme.applicationDeadline)}
                      </td>
                    ))}
                  </tr>

                  <tr className="border-b border-rule">
                    <th className="sticky left-0 z-10 border-r border-rule bg-white p-4 text-left align-top text-sm font-medium text-secondary">
                      Entry requirements
                    </th>

                    {programmes.map((programme) => (
                      <td
                        key={programme.id}
                        className="p-4 align-top text-sm leading-6 text-primary"
                      >
                        {programme.entryRequirements || "Not specified"}
                      </td>
                    ))}
                  </tr>

                  {requirementRows.length > 0 && (
                    <>
                      <tr className="border-b border-rule bg-paper-soft">
                        <th
                          colSpan={programmes.length + 1}
                          className="p-4 text-left text-sm font-semibold text-primary"
                        >
                          Programme Requirements
                        </th>
                      </tr>

                      {requirementRows.map((requirement) => (
                        <tr
                          key={String(requirement.subjectId)}
                          className="border-b border-rule"
                        >
                          <th className="sticky left-0 z-10 border-r border-rule bg-white p-4 text-left text-sm font-medium text-secondary">
                            {String(requirement.subjectName)}
                          </th>

                          {programmes.map((programme) => {
                            const value = requirement.values.get(
                              programme.id,
                            );

                            return (
                              <td
                                key={programme.id}
                                className="p-4 text-sm text-primary"
                              >
                                {value ? (
                                  <span className="inline-flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                    {value}
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-2 text-secondary">
                                    <XCircle className="h-4 w-4" />
                                    Not specified
                                  </span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {programmes.map((programme) => (
            <Card key={programme.id}>
              <CardContent className="flex items-center justify-between gap-4 p-4">
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-primary">
                    {programme.name || "Unnamed programme"}
                  </div>

                  {programme.code && (
                    <div className="mt-1 truncate text-xs text-secondary">
                      {programme.code}
                    </div>
                  )}
                </div>

                <Button asChild variant="outline" size="sm">
                  <Link
                    href={`/programmes/${programme.code || programme.id}`}
                  >
                    View
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {programmeIds.length > 0 && (
          <p className="mt-5 text-center text-xs text-secondary">
            Comparing {programmeIds.length} programme
            {programmeIds.length === 1 ? "" : "s"}.
          </p>
        )}
      </div>
    </main>
  );
}