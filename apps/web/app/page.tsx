"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AdmissionsHero } from "@/components/home/AdmissionsHero";
import { ApplicantJourney } from "@/components/home/ApplicantJourney";
import { FeaturedProgrammeRecords } from "@/components/home/FeaturedProgrammeRecords";
import { TrustCta } from "@/components/home/TrustCta";
import { NewsPreview } from "@/components/home/NewsPreview";
import { useAnnouncements } from "@/app/lib/hooks/useAnnouncements";
import {
  useAutoComplete,
  useFeaturedProgrammes,
  useSearchProgrammes,
} from "@/app/lib/hooks/useProgrammes";
import { useUniversity } from "@/app/lib/context/UniversityContext";
import type { HomeProgrammeRecord } from "@/app/lib/types/home";

export default function Home() {
  const router = useRouter();
  const { selectedUniversity, setShowSelector } = useUniversity();

  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const { data: featuredData, isLoading: featuredLoading } =
    useFeaturedProgrammes(selectedUniversity?.id);

  const { data: announcementsData, isLoading: announcementsLoading } =
    useAnnouncements();

  const announcements = announcementsData?.data ?? [];

  const { data: catalogueData } = useSearchProgrammes({
    universityId: selectedUniversity?.id,
    page: 1,
    limit: 1,
  });

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
      facultyAbbreviation:
        programme.department?.academicUnit?.abbreviation,
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

  const suggestions = useMemo(() => {
    return (autoCompleteData?.data || [])
      .map((suggestion: any) => suggestion.label || suggestion.name)
      .filter(Boolean);
  }, [autoCompleteData]);

  useEffect(() => {
    setShowSuggestions(
      searchQuery.length >= 2 && suggestions.length > 0,
    );
  }, [searchQuery, suggestions]);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (searchQuery.trim()) {
      router.push(
        `/programmes?search=${encodeURIComponent(searchQuery.trim())}`,
      );
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

      <ApplicantJourney />

      <FeaturedProgrammeRecords
        programmes={featuredProgrammes}
        isLoading={featuredLoading}
      />

      <NewsPreview
        announcements={announcements}
        isLoading={announcementsLoading}
      />

      <TrustCta />
    </div>
  );
}