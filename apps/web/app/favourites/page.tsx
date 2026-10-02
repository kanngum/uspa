"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  Heart,
  Building2,
  Clock,
  Trash2,
  ArrowRight,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatsCardSkeleton } from "@/components/ui/loading";
import { EmptyState } from "@/components/ui/empty-state";
import { useToast } from "@/components/ui/toast";
import {
  useFavourites,
  useRemoveFavourite,
} from "@/app/lib/hooks/useFavourites";

const COMPARE_STORAGE_KEY = "uspa_compare_ids";
const MAX_COMPARE_PROGRAMMES = 4;

export default function FavouritesPage() {
  const { data: favData, isLoading, isError } = useFavourites();
  const removeFavourite = useRemoveFavourite();
  const { addToast } = useToast();

  const favourites = favData?.data || [];

  const programmes = useMemo(
    () =>
      favourites.map((f: any) => {
        const prog = f.programme || f;

        return {
          id: prog.id || f.id,
          code: prog.code || "",
          name: prog.name || "",
          degree: prog.degree || "",
          faculty:
            prog.department?.academicUnit?.name || prog.faculty || "",
          duration: prog.duration || "",
        };
      }),
    [favourites],
  );

  const compareIds = useMemo(
    () =>
      Array.from(
        new Set(
          programmes
            .map((programme: any) => programme.id)
            .filter(
              (id: unknown): id is string =>
                typeof id === "string" && id.length > 0,
            ),
        ),
      ).slice(0, MAX_COMPARE_PROGRAMMES),
    [programmes],
  );

  const compareHref =
    compareIds.length >= 2
      ? `/compare?ids=${encodeURIComponent(compareIds.join(","))}`
      : "/compare";

  const handleRemove = (id: string) => {
    removeFavourite.mutate(id, {
      onSuccess: () =>
        addToast("Programme removed from favourites", "success"),
      onError: () => addToast("Failed to remove programme", "error"),
    });
  };

  const handleCompare = () => {
    if (compareIds.length < 2) {
      addToast("Select at least two programmes to compare", "error");
      return;
    }

    localStorage.setItem(
      COMPARE_STORAGE_KEY,
      JSON.stringify(compareIds),
    );

    window.location.href = compareHref;
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="h-8 w-64 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
          <div className="mt-1 h-4 w-48 animate-pulse rounded bg-zinc-100 dark:bg-zinc-900" />
        </div>

        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <StatsCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <EmptyState
          icon="alert"
          title="Failed to load favourites"
          description="Please try again later."
          action={{
            label: "Retry",
            href: "/favourites",
          }}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Heart className="h-6 w-6 text-red-500" />

            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              Saved Programmes
            </h1>
          </div>

          <p className="mt-1 text-zinc-600 dark:text-zinc-400">
            {programmes.length}{" "}
            {programmes.length === 1 ? "programme" : "programmes"} saved
          </p>
        </div>

        {programmes.length >= 2 && (
          <Button
            variant="outline"
            className="w-full gap-2 sm:w-auto"
            onClick={handleCompare}
          >
            Compare
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>

      {programmes.length === 0 ? (
        <EmptyState
          icon="heart"
          title="No saved programmes"
          description="Start browsing programmes and save the ones you're interested in."
          action={{
            label: "Browse Programmes",
            href: "/programmes",
          }}
        />
      ) : (
        <div className="space-y-3">
          {programmes.map((prog: any) => (
            <Card key={prog.id}>
              <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-red-50 dark:bg-red-900/20">
                    <GraduationCap className="h-6 w-6 text-red-500" />
                  </div>

                  <div className="min-w-0">
                    <Link
                      href={`/programmes/${prog.code}`}
                      className="font-semibold text-zinc-900 hover:text-[#0FA3B1] dark:text-zinc-50 dark:hover:text-[#0FA3B1]"
                    >
                      {prog.name}
                    </Link>

                    <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-zinc-500">
                      {prog.degree && (
                        <Badge variant="secondary">{prog.degree}</Badge>
                      )}

                      {prog.faculty && (
                        <span className="flex items-center gap-1">
                          <Building2 className="h-3.5 w-3.5" />
                          {prog.faculty}
                        </span>
                      )}

                      {prog.duration && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {prog.duration} years
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2 self-end sm:self-auto">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemove(prog.id)}
                    disabled={removeFavourite.isPending}
                    aria-label={`Remove ${prog.name} from favourites`}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}