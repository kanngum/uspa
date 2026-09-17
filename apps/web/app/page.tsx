"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AdmissionsHero } from "@/components/home/AdmissionsHero";
import { ApplicantJourney } from "@/components/home/ApplicantJourney";
import { FeaturedProgrammeRecords } from "@/components/home/FeaturedProgrammeRecords";
import { FacultyDirectoryPreview } from "@/components/home/FacultyDirectoryPreview";
import { RequirementsRecord } from "@/components/home/RequirementsRecord";
import { TrustCta } from "@/components/home/TrustCta";
import { useFaculties } from "@/app/lib/hooks/useFaculties";
import { useAutoComplete, useFeaturedProgrammes, useSearchProgrammes } from "@/app/lib/hooks/useProgrammes";
import { useUniversity } from "@/app/lib/context/UniversityContext";
import type { HomeFacultyRecord, HomeProgrammeRecord } from "@/app/lib/types/home";

export default function Home() {
  const router = useRouter();
  const { selectedUniversity, setShowSelector } = useUniversity();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { data: facultiesData, isLoading: facultiesLoading } = useFaculties(selectedUniversity?.id);
  const { data: featuredData, isLoading: featuredLoading } = useFeaturedProgrammes(selectedUniversity?.id);
  const { data: catalogueData } = useSearchProgrammes({ universityId: selectedUniversity?.id, page: 1, limit: 1 });
  const { data: autoCompleteData } = useAutoComplete(searchQuery);

  const featuredProgrammes = useMemo<HomeProgrammeRecord[]>(() => {
    return (featuredData?.data || []).map((programme: any) => ({
      id: programme.id,
      code: programme.code,
      name: programme.name,
      degree: programme.degree,
      level: programme.level,
      duration: programme.duration,
      faculty: programme.department?.academicUnit?.name || "",
      facultyAbbreviation: programme.department?.academicUnit?.abbreviation,
      tuition: programme.tuition?.[0]
        ? {
            amount: Number(programme.tuition[0].amount),
            currency: programme.tuition[0].currency,
            academicYear: programme.tuition[0].academicYear,
          }
        : undefined,
      requirementCount: programme._count?.requirements || 0,
    }));
  }, [featuredData]);

  const faculties = useMemo<HomeFacultyRecord[]>(() => {
    return (facultiesData?.data || []).map((faculty: any) => ({
      id: faculty.id,
      name: faculty.name,
      abbreviation: faculty.abbreviation || faculty.name.substring(0, 4).toUpperCase(),
      programmeCount: faculty._count?.programmes,
      type: faculty.type,
    }));
  }, [facultiesData]);

  const suggestions = useMemo(() => {
    return (autoCompleteData?.data || [])
      .map((suggestion: any) => suggestion.label || suggestion.name)
      .filter(Boolean);
  }, [autoCompleteData]);

  useEffect(() => {
    setShowSuggestions(searchQuery.length >= 2 && suggestions.length > 0);
  }, [searchQuery, suggestions]);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/programmes?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="bg-white text-ink">
      <div id="top">
        <AdmissionsHero
          universityName={selectedUniversity?.name}
          featuredProgramme={featuredProgrammes[0]}
          featuredLoading={featuredLoading}
          catalogueCount={catalogueData?.total}
          searchQuery={searchQuery}
          suggestions={suggestions}
          showSuggestions={showSuggestions}
          onSearchQueryChange={setSearchQuery}
          onSearch={handleSearch}
          onOpenUniversitySelector={() => setShowSelector(true)}
        />
      </div>

      <div className="border-b border-rule bg-paper-soft">
        <div className="mx-auto grid max-w-7xl gap-4 px-6 py-5 text-xs text-muted-ink sm:grid-cols-3 lg:px-8">
          <div><span className="font-mono text-lg font-semibold text-primary">{catalogueData?.total ?? "—"}</span><span className="ml-2">records in this catalogue</span></div>
          <div><span className="font-mono text-lg font-semibold text-primary">{faculties.length || "—"}</span><span className="ml-2">faculties and schools</span></div>
          <div><span className="font-semibold text-accent-dark">Listed requirements</span><span className="ml-2">clearly labelled for review</span></div>
        </div>
      </div>

      <ApplicantJourney />
      <FeaturedProgrammeRecords programmes={featuredProgrammes} isLoading={featuredLoading} />
      <FacultyDirectoryPreview faculties={faculties} isLoading={facultiesLoading} />
      <TrustCta />
    </div>
  );
}
