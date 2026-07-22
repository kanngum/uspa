"use client";

import Link from "next/link";
import { Heart, BookOpen, Building2, Clock, Trash2, ArrowRight, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatsCardSkeleton } from "@/components/ui/loading";
import { EmptyState } from "@/components/ui/empty-state";
import { useToast } from "@/components/ui/toast";
import { useFavourites, useRemoveFavourite } from "@/app/lib/hooks/useFavourites";

export default function FavouritesPage() {
  const { data: favData, isLoading, isError } = useFavourites();
  const removeFavourite = useRemoveFavourite();
  const { addToast } = useToast();

  const favourites = favData?.data || [];

  const handleRemove = (id: string) => {
    removeFavourite.mutate(id, {
      onSuccess: () => addToast("Programme removed from favourites", "success"),
      onError: () => addToast("Failed to remove programme", "error"),
    });
  };

  const programmes = favourites.map((f: any) => {
    const prog = f.programme || f;
    return {
      id: f.id || prog.id,
      code: prog.code || "",
      name: prog.name || "",
      degree: prog.degree || "",
      faculty: prog.department?.academicUnit?.name || prog.faculty || "",
      duration: prog.duration || "",
    };
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="h-8 w-64 bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-pulse" />
          <div className="mt-1 h-4 w-48 bg-zinc-100 dark:bg-zinc-900 rounded animate-pulse" />
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
          action={{ label: "Retry", href: "/favourites" }}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Heart className="h-6 w-6 text-red-500" />
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Saved Programmes</h1>
          </div>
          <p className="mt-1 text-zinc-600 dark:text-zinc-400">
            {programmes.length} {programmes.length === 1 ? "programme" : "programmes"} saved
          </p>
        </div>
        {programmes.length >= 2 && (
          <Link href="/compare">
            <Button variant="outline" className="gap-2">Compare <ArrowRight className="h-4 w-4" /></Button>
          </Link>
        )}
      </div>

      {programmes.length === 0 ? (
        <EmptyState
          icon="heart"
          title="No saved programmes"
          description="Start browsing programmes and save the ones you're interested in."
          action={{ label: "Browse Programmes", href: "/programmes" }}
        />
      ) : (
        <div className="space-y-3">
          {programmes.map((prog: any) => (
            <Card key={prog.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-50 dark:bg-red-900/20">
                    <GraduationCap className="h-6 w-6 text-red-500" />
                  </div>
                  <div>
                    <Link href={`/programmes/${prog.code}`} className="font-semibold text-zinc-900 hover:text-[#0FA3B1] dark:text-zinc-50 dark:hover:text-[#0FA3B1]">
                      {prog.name}
                    </Link>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-zinc-500">
                      {prog.degree && <Badge variant="secondary">{prog.degree}</Badge>}
                      {prog.faculty && <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" />{prog.faculty}</span>}
                      {prog.duration && <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{prog.duration} years</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleRemove(prog.id)} disabled={removeFavourite.isPending}>
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
