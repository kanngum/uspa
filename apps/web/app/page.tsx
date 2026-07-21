"use client";

import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, GraduationCap, BookOpen, Bot, CheckSquare, Sparkles, Building2, Users, Award, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatsCardSkeleton, ProgrammeCardSkeleton } from "@/components/ui/loading";
import { useFaculties } from "@/app/lib/hooks/useFaculties";
import { useFeaturedProgrammes, useAutoComplete } from "@/app/lib/hooks/useProgrammes";

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { data: facultiesData, isLoading: facultiesLoading } = useFaculties();
  const { data: featuredData, isLoading: featuredLoading } = useFeaturedProgrammes();
  const { data: autoCompleteData } = useAutoComplete(searchQuery);

  const faculties = useMemo(() => {
    if (!facultiesData?.data) return [];
    return facultiesData.data.slice(0, 7).map((f: any) => ({
      name: f.name,
      abb: f.abbreviation || f.name.substring(0, 4).toUpperCase(),
      programmes: f._count?.departments || 0,
    }));
  }, [facultiesData]);

  const featuredProgrammes = useMemo(() => {
    if (!featuredData?.data) return [];
    return featuredData.data.slice(0, 4).map((p: any) => ({
      code: p.code,
      name: p.name,
      faculty: p.department?.academicUnit?.name || "",
      degree: p.degree,
      duration: p.duration,
    }));
  }, [featuredData]);

  const suggestions = useMemo(() => {
    if (!autoCompleteData?.data) return [];
    return autoCompleteData.data.map((s: any) => s.label || s.name).filter(Boolean);
  }, [autoCompleteData]);

  useEffect(() => {
    if (searchQuery.length >= 2) {
      setShowSuggestions(suggestions.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [searchQuery, suggestions]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/programmes?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const featuredCount = featuredProgrammes.length;
  const facultyCount = faculties.length;

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
        <div className="mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in">
            <Badge variant="info" className="mb-4">University of Bamenda</Badge>
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl lg:text-6xl">
              Find Your Perfect
              <span className="block text-blue-600 dark:text-blue-400">Academic Programme</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
              Discover programmes that match your qualifications. Get instant eligibility checks, 
              AI-powered recommendations, and personal guidance for your academic journey at UBa.
            </p>

            {/* Search */}
            <form onSubmit={handleSearch} className="mx-auto mt-8 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search programmes, subjects, or careers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white/90 py-4 pl-12 pr-36 text-base shadow-lg backdrop-blur-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-900/90 dark:text-zinc-50"
                />
                <Button type="submit" size="lg" className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-500">
                  Search <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              {/* Suggestions */}
              {showSuggestions && (
                <div className="mt-2 rounded-xl border border-zinc-200 bg-white p-2 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
                  {suggestions.map((s) => (
                    <Link key={s} href={`/programmes?search=${encodeURIComponent(s)}`}
                      className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    >
                      <Search className="h-3.5 w-3.5 text-zinc-400" />
                      {s}
                    </Link>
                  ))}
                </div>
              )}
            </form>

            {/* Quick action buttons */}
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/admission-checker">
                <Button variant="outline" className="gap-2">
                  <CheckSquare className="h-4 w-4" /> Check Eligibility
                </Button>
              </Link>
              <Link href="/ai-advisor">
                <Button variant="outline" className="gap-2">
                  <Bot className="h-4 w-4" /> AI Advisor
                </Button>
              </Link>
              <Link href="/programmes">
                <Button variant="outline" className="gap-2">
                  <BookOpen className="h-4 w-4" /> All Programmes
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { icon: BookOpen, label: "Programmes", value: featuredCount > 0 ? `${featuredCount * 20}+` : "80+" },
              { icon: Building2, label: "Faculties & Schools", value: facultyCount > 0 ? `${facultyCount}` : "9" },
              { icon: Users, label: "Students Guided", value: "5,000+" },
              { icon: Award, label: "Degree Types", value: "10+" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border border-zinc-200 bg-white/60 p-4 text-center backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/60">
                <stat.icon className="mx-auto h-6 w-6 text-blue-600 dark:text-blue-400" />
                <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">{stat.value}</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">How It Works</h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">Three simple steps to find your programme</p>
          </div>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {[
              { step: "01", title: "Enter Your Details", desc: "Tell us about your O/A Level subjects, grades, or career interests." },
              { step: "02", title: "Get Matched", desc: "Our system evaluates your eligibility against university and programme requirements." },
              { step: "03", title: "Explore & Decide", desc: "Review eligible programmes, compare options, and make an informed choice." },
            ].map((item) => (
              <div key={item.step} className="rounded-xl border border-zinc-200 bg-white p-6 text-center dark:border-zinc-800 dark:bg-zinc-900">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                  {item.step}
                </div>
                <h3 className="mt-4 font-semibold text-zinc-900 dark:text-zinc-50">{item.title}</h3>
                <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Programmes */}
      <section className="bg-zinc-50 py-16 dark:bg-zinc-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Featured Programmes</h2>
              <p className="mt-1 text-zinc-600 dark:text-zinc-400">Popular programmes at UBa</p>
            </div>
            <Link href="/programmes" className="hidden text-sm font-medium text-blue-600 hover:text-blue-500 sm:flex items-center gap-1">
              View all <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredLoading ? (
              <>
                <ProgrammeCardSkeleton />
                <ProgrammeCardSkeleton />
                <ProgrammeCardSkeleton />
                <ProgrammeCardSkeleton />
              </>
            ) : featuredProgrammes.length > 0 ? (
              featuredProgrammes.map((prog) => (
                <Link key={prog.code} href={`/programmes/${prog.code}`}>
                  <Card className="group transition-all hover:shadow-md">
                    <CardContent className="p-5">
                      <Badge variant="secondary" className="mb-3">{prog.degree}</Badge>
                      <h3 className="font-semibold text-zinc-900 group-hover:text-blue-600 dark:text-zinc-50 dark:group-hover:text-blue-400">
                        {prog.name}
                      </h3>
                      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{prog.faculty}</p>
                      <div className="mt-3 flex items-center gap-3 text-xs text-zinc-400">
                        <span>{prog.duration} years</span>
                        <span>{prog.code}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              <p className="col-span-4 text-center text-zinc-500">No featured programmes available</p>
            )}
          </div>
          <div className="mt-6 text-center sm:hidden">
            <Link href="/programmes">
              <Button variant="outline" className="gap-2">View all programmes <ArrowRight className="h-4 w-4" /></Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Faculties */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Our Faculties & Schools</h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">Browse programmes by faculty</p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {faculties.map((f) => (
              <Link key={f.abb} href={`/faculties/${f.abb.toLowerCase()}`}
                className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-4 transition-all hover:border-blue-200 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-800"
              >
                <div>
                  <p className="font-medium text-zinc-900 dark:text-zinc-50">{f.name}</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">{f.programmes} programmes</p>
                </div>
                <ChevronRight className="h-5 w-5 text-zinc-400" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-16 dark:from-blue-800 dark:to-indigo-800">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <Sparkles className="mx-auto h-10 w-10 text-blue-200" />
          <h2 className="mt-4 text-3xl font-bold text-white">Ready to Find Your Programme?</h2>
          <p className="mt-2 text-lg text-blue-100">Check your eligibility in seconds with our intelligent admission advisor.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/admission-checker">
              <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50">Check Eligibility</Button>
            </Link>
            <Link href="/ai-advisor">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">Ask AI Advisor</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

