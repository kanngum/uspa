"use client";

import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Check,
  Loader2,
  Plus,
  Search,
  Tags,
  X,
} from "lucide-react";
import Link from "next/link";

import { api } from "@/app/lib/api";
import {
  useAddProgrammeKeyword,
  useAdminKeywords,
  useAdminProgrammes,
  useRemoveProgrammeKeyword,
} from "@/app/lib/hooks/useAdmin";

type Programme = {
  id: string;
  code?: string;
  name?: string;
  keywords?: Array<{
    id?: string;
    word?: string;
    keyword?: {
      id?: string;
      word?: string;
    };
  }>;
};

type Keyword = {
  id: string;
  word: string;
};

export default function ProgrammeKeywordAssignmentPage() {
  const queryClient = useQueryClient();

  const [programmeSearch, setProgrammeSearch] = useState("");
  const [keywordSearch, setKeywordSearch] = useState("");
  const [selectedProgrammeId, setSelectedProgrammeId] = useState("");

  const { data: programmesData, isLoading: programmesLoading } =
    useAdminProgrammes(
      1,
      200,
      programmeSearch.trim() || undefined,
    );

  const { data: keywordsData, isLoading: keywordsLoading } =
    useAdminKeywords(1, 500);

  const {
    data: programmeDetailData,
    isLoading: programmeDetailLoading,
  } = useQuery({
    queryKey: ["programme", selectedProgrammeId],
    queryFn: async () => {
      const response = await api.getProgramme(
        selectedProgrammeId,
      );

      return response?.data || response;
    },
    enabled: Boolean(selectedProgrammeId),
  });

  const addKeywordMutation = useAddProgrammeKeyword();
  const removeKeywordMutation =
    useRemoveProgrammeKeyword();

  const programmes = useMemo<Programme[]>(() => {
    const data =
      programmesData?.data || programmesData;

    return Array.isArray(data) ? data : [];
  }, [programmesData]);

  const keywords = useMemo<Keyword[]>(() => {
    const data =
      keywordsData?.data || keywordsData;

    if (!Array.isArray(data)) {
      return [];
    }

    return data
      .map((keyword: any) => ({
        id: keyword.id,
        word: keyword.word,
      }))
      .filter(
        (keyword: Keyword) =>
          Boolean(keyword.id) && Boolean(keyword.word),
      );
  }, [keywordsData]);

  const selectedProgramme = useMemo<Programme | null>(() => {
    const detail =
      programmeDetailData?.programme ||
      programmeDetailData;

    if (detail?.id) {
      return detail as Programme;
    }

    return (
      programmes.find(
        (programme) =>
          programme.id === selectedProgrammeId,
      ) || null
    );
  }, [
    programmeDetailData,
    programmes,
    selectedProgrammeId,
  ]);

  const assignedKeywords = useMemo<Keyword[]>(() => {
    const raw =
      selectedProgramme?.keywords || [];

    return raw
      .map((item: any) => {
        const keyword =
          item.keyword || item;

        return {
          id: keyword.id || item.keywordId || "",
          word: keyword.word || "",
        };
      })
      .filter(
        (keyword: Keyword) =>
          Boolean(keyword.id) && Boolean(keyword.word),
      );
  }, [selectedProgramme]);

  const assignedKeywordIds = useMemo(
    () =>
      new Set(
        assignedKeywords.map(
          (keyword) => keyword.id,
        ),
      ),
    [assignedKeywords],
  );

  const availableKeywords = useMemo(() => {
    const normalizedSearch =
      keywordSearch.trim().toLowerCase();

    return keywords.filter((keyword) => {
      if (assignedKeywordIds.has(keyword.id)) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      return keyword.word
        .toLowerCase()
        .includes(normalizedSearch);
    });
  }, [
    keywords,
    keywordSearch,
    assignedKeywordIds,
  ]);

  const isMutating =
    addKeywordMutation.isPending ||
    removeKeywordMutation.isPending;

  const handleAddKeyword = (keywordId: string) => {
    if (!selectedProgrammeId || isMutating) {
      return;
    }

    addKeywordMutation.mutate(
      {
        programmeId: selectedProgrammeId,
        keywordId,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [
              "programme",
              selectedProgrammeId,
            ],
          });
        },
      },
    );
  };

  const handleRemoveKeyword = (keywordId: string) => {
    if (!selectedProgrammeId || isMutating) {
      return;
    }

    removeKeywordMutation.mutate(
      {
        programmeId: selectedProgrammeId,
        keywordId,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [
              "programme",
              selectedProgrammeId,
            ],
          });
        },
      },
    );
  };

  return (
    <main className="min-h-screen bg-background px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/admin"
              className="mb-3 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Admin
            </Link>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Tags className="h-5 w-5 text-primary" />
              </div>

              <div>
                <h1 className="text-2xl font-semibold tracking-tight">
                  Programme Keyword Assignment
                </h1>

                <p className="text-sm text-muted-foreground">
                  Assign and remove search keywords from programmes.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <section className="rounded-xl border bg-card shadow-sm">
            <div className="border-b p-4">
              <h2 className="font-semibold">
                Select Programme
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Search and select the programme you want to manage.
              </p>

              <div className="relative mt-4">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <input
                  value={programmeSearch}
                  onChange={(event) =>
                    setProgrammeSearch(
                      event.target.value,
                    )
                  }
                  placeholder="Search programmes..."
                  className="h-10 w-full rounded-md border bg-background pl-9 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="max-h-[600px] overflow-y-auto p-2">
              {programmesLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : programmes.length === 0 ? (
                <div className="px-4 py-12 text-center text-sm text-muted-foreground">
                  No programmes found.
                </div>
              ) : (
                <div className="space-y-1">
                  {programmes.map((programme) => {
                    const selected =
                      programme.id ===
                      selectedProgrammeId;

                    return (
                      <button
                        key={programme.id}
                        type="button"
                        onClick={() =>
                          setSelectedProgrammeId(
                            programme.id,
                          )
                        }
                        className={`w-full rounded-lg border px-3 py-3 text-left transition ${
                          selected
                            ? "border-primary bg-primary/5"
                            : "border-transparent hover:border-border hover:bg-muted/50"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">
                              {programme.name ||
                                "Unnamed programme"}
                            </p>

                            {programme.code && (
                              <p className="mt-1 truncate text-xs text-muted-foreground">
                                {programme.code}
                              </p>
                            )}
                          </div>

                          {selected && (
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          <section className="rounded-xl border bg-card shadow-sm">
            {!selectedProgrammeId ? (
              <div className="flex min-h-[500px] flex-col items-center justify-center px-6 text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Tags className="h-6 w-6 text-muted-foreground" />
                </div>

                <h2 className="font-semibold">
                  No programme selected
                </h2>

                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  Select a programme from the list to manage
                  its keywords.
                </p>
              </div>
            ) : (
              <>
                <div className="border-b p-5">
                  {programmeDetailLoading ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading programme...
                    </div>
                  ) : (
                    <>
                      <h2 className="font-semibold">
                        {selectedProgramme?.name ||
                          "Programme"}
                      </h2>

                      {selectedProgramme?.code && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {selectedProgramme.code}
                        </p>
                      )}
                    </>
                  )}
                </div>

                <div className="grid gap-6 p-5 md:grid-cols-2">
                  <div>
                    <div className="mb-3">
                      <h3 className="text-sm font-semibold">
                        Assigned Keywords
                      </h3>

                      <p className="mt-1 text-xs text-muted-foreground">
                        Keywords currently associated with this programme.
                      </p>
                    </div>

                    {programmeDetailLoading ? (
                      <div className="flex items-center justify-center rounded-lg border border-dashed py-10">
                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                      </div>
                    ) : assignedKeywords.length === 0 ? (
                      <div className="rounded-lg border border-dashed px-4 py-10 text-center">
                        <p className="text-sm text-muted-foreground">
                          No keywords assigned yet.
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {assignedKeywords.map(
                          (keyword) => (
                            <div
                              key={keyword.id}
                              className="inline-flex items-center gap-1.5 rounded-full border bg-muted/40 px-3 py-1.5 text-sm"
                            >
                              <span>
                                {keyword.word}
                              </span>

                              <button
                                type="button"
                                disabled={isMutating}
                                onClick={() =>
                                  handleRemoveKeyword(
                                    keyword.id,
                                  )
                                }
                                className="rounded-full p-0.5 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive disabled:cursor-not-allowed disabled:opacity-50"
                                aria-label={`Remove ${keyword.word}`}
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ),
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="mb-3">
                      <h3 className="text-sm font-semibold">
                        Add Keywords
                      </h3>

                      <p className="mt-1 text-xs text-muted-foreground">
                        Select keywords that describe this programme.
                      </p>
                    </div>

                    <div className="relative mb-3">
                      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                      <input
                        value={keywordSearch}
                        onChange={(event) =>
                          setKeywordSearch(
                            event.target.value,
                          )
                        }
                        placeholder="Search keywords..."
                        className="h-10 w-full rounded-md border bg-background pl-9 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </div>

                    <div className="max-h-[360px] overflow-y-auto rounded-lg border p-2">
                      {keywordsLoading ? (
                        <div className="flex items-center justify-center py-10">
                          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                        </div>
                      ) : availableKeywords.length ===
                        0 ? (
                        <div className="px-4 py-10 text-center text-sm text-muted-foreground">
                          {keywordSearch
                            ? "No matching unassigned keywords."
                            : "All available keywords are assigned."}
                        </div>
                      ) : (
                        <div className="space-y-1">
                          {availableKeywords.map(
                            (keyword) => (
                              <button
                                key={keyword.id}
                                type="button"
                                disabled={isMutating}
                                onClick={() =>
                                  handleAddKeyword(
                                    keyword.id,
                                  )
                                }
                                className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <span>
                                  {keyword.word}
                                </span>

                                <Plus className="h-4 w-4 text-muted-foreground" />
                              </button>
                            ),
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}