"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Clock, Building2, BookOpen, GraduationCap, Heart, Share2, CheckCircle2, AlertCircle, ChevronRight, Award, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DetailPageSkeleton } from "@/components/ui/loading";
import { EmptyState } from "@/components/ui/empty-state";
import { useToast } from "@/components/ui/toast";
import { useProgramme } from "@/app/lib/hooks/useProgrammes";
import { useSimilarProgrammes } from "@/app/lib/hooks/useRecommendations";
import { useAddFavourite, useRemoveFavourite, useFavourites } from "@/app/lib/hooks/useFavourites";

const oLevelGeneral = [
  { subject: "English Language", grade: "C6" },
  { subject: "Mathematics", grade: "C6" },
  { subject: "Any Science Subject", grade: "C6" },
];

export default function ProgrammeDetailPage() {
  const params = useParams();
  const code = params.code as string;
  const [activeTab, setActiveTab] = useState("overview");
  const { addToast } = useToast();

  const { data: progData, isLoading, isError } = useProgramme(code);
  const programme = progData?.data;
  const programmeId = programme?.id || "";

  const { data: similarData } = useSimilarProgrammes(programmeId);
  const similarProgrammes = similarData?.data || [];

  const { data: favData } = useFavourites();
  const addFavourite = useAddFavourite();
  const removeFavourite = useRemoveFavourite();

  // Determine if this programme is in user's favourites
  const favourites = favData?.data || [];
  const [isFavourite, setIsFavourite] = useState(
    favourites.some((f: any) => {
      const progId = f.programme?.id || f.programmeId || f.id;
      return progId === programmeId;
    })
  );

  useEffect(() => {
    if (favData?.data) {
      const isSaved = favData.data.some((f: any) => {
        const progId = f.programme?.id || f.programmeId || f.id;
        return progId === programmeId;
      });
      setIsFavourite(isSaved);
    }
  }, [favData, programmeId]);

  const handleToggleFavourite = () => {
    if (!programme) return;
    if (isFavourite) {
      removeFavourite.mutate(programme.id, {
        onSuccess: () => {
          setIsFavourite(false);
          addToast("Removed from favourites", "success");
        },
        onError: () => addToast("Failed to remove", "error"),
      });
    } else {
      addFavourite.mutate(programme.id, {
        onSuccess: () => {
          setIsFavourite(true);
          addToast("Saved to favourites", "success");
        },
        onError: () => addToast("Failed to save", "error"),
      });
    }
  };

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "requirements", label: "Requirements" },
    { id: "tuition", label: "Tuition & Fees" },
    { id: "careers", label: "Careers" },
  ];

  if (isLoading) return <DetailPageSkeleton />;

  if (isError || !programme) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link href="/programmes" className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900">
          <ArrowLeft className="h-4 w-4" /> Back to Programmes
        </Link>
        <EmptyState
          icon="alert"
          title="Programme not found"
          description={`The programme "${code}" could not be found.`}
          action={{ label: "Browse Programmes", href: "/programmes" }}
        />
      </div>
    );
  }

  // Parse nested data
  const dept = programme.department;
  const deptName = dept?.name || "N/A";
  const faculty = dept?.academicUnit;
  const facultyName = faculty?.name || "N/A";
  const facultyAbb = faculty?.abbreviation || "";
  const requirements = programme.requirements || [];
  const tuitionData = programme.tuition || [];
  const careersData = programme.careers?.map((c: any) => c.career?.name || c.name) || [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link href="/programmes" className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
          <ArrowLeft className="h-4 w-4" /> Back to Programmes
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Header */}
          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="info">{programme.degree}</Badge>
              <Badge variant="secondary">{programme.level?.replace(/_/g, " ")}</Badge>
              <span className="text-xs text-zinc-400">{programme.code}</span>
            </div>
            <h1 className="mt-3 text-3xl font-bold text-zinc-900 dark:text-zinc-50">{programme.name}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
              <span className="flex items-center gap-1.5">
                <Building2 className="h-4 w-4" /> {facultyName}
              </span>
              <span className="flex items-center gap-1.5">
                <BookOpen className="h-4 w-4" /> {deptName}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" /> {programme.duration} years
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mb-6 flex flex-wrap gap-2">
            <Link href={`/admission-checker?programme=${programme.code}`}>
              <Button variant="primary">
                <GraduationCap className="mr-1.5 h-4 w-4" /> Check Eligibility
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={handleToggleFavourite}
              className={isFavourite ? "text-red-500" : ""}
            >
              <Heart className={`mr-1.5 h-4 w-4 ${isFavourite ? "fill-current" : ""}`} />
              {isFavourite ? "Saved" : "Save"}
            </Button>
            <Button variant="outline">
              <Share2 className="mr-1.5 h-4 w-4" /> Share
            </Button>
          </div>

          {/* Tabs */}
          <div className="mb-6 border-b border-zinc-200 dark:border-zinc-800">
            <nav className="flex gap-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-3 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400"
                      : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-50">Programme Overview</h2>
                  <div className="whitespace-pre-line text-zinc-600 dark:text-zinc-400">
                    {programme.description || "No description available."}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-50">O Level Requirements</h2>
                  <div className="space-y-2">
                    {oLevelGeneral.map((req, i) => (
                      <div key={i} className="flex items-center justify-between rounded-lg bg-zinc-50 p-3 dark:bg-zinc-900">
                        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{req.subject}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="warning">REQUIRED</Badge>
                          <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Min: {req.grade}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-zinc-500">At least four (4) O Level credits including English and Mathematics</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-50">A Level Subject Requirements</h2>
                  {requirements.length > 0 ? (
                    <div className="space-y-2">
                      {requirements.map((req: any, i: number) => {
                        const subjectName = req.subject?.name || req.subject || "Unknown";
                        const minGrade = req.minimumGrade || req.grade || "N/A";
                        const reqType = req.requirementType || req.type || "REQUIRED";
                        return (
                          <div key={i} className="flex items-center justify-between rounded-lg bg-zinc-50 p-3 dark:bg-zinc-900">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{subjectName}</span>
                              {reqType === "REQUIRED" ? (
                                <CheckCircle2 className="h-4 w-4 text-red-500" />
                              ) : (
                                <AlertCircle className="h-4 w-4 text-yellow-500" />
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={reqType === "REQUIRED" ? "destructive" : "warning"}>{reqType}</Badge>
                              <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Min: {minGrade}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-zinc-500">No specific A Level subject requirements listed.</p>
                  )}
                  <p className="mt-3 text-xs text-zinc-500">At least two (2) A Level passes in relevant subjects</p>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "requirements" && (
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">University General Requirements</h2>
                  <div className="space-y-3">
                    {[
                      "At least four (4) O Level credits including English Language and Mathematics",
                      "At least two (2) A Level passes or equivalent",
                      "Minimum grade of C6 in English and Mathematics at O Level",
                      "Specific faculty and department requirements apply",
                    ].map((req, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-500 shrink-0" />
                        <span className="text-sm text-zinc-600 dark:text-zinc-400">{req}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {requirements.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">Programme-Specific A Level Requirements</h2>
                    <p className="mb-3 text-sm text-zinc-500 dark:text-zinc-400">
                      The following A Level subjects are required or recommended for this programme:
                    </p>
                    <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
                      <table className="w-full text-sm">
                        <thead className="bg-zinc-50 dark:bg-zinc-900">
                          <tr>
                            <th className="px-4 py-3 text-left font-medium text-zinc-900 dark:text-zinc-50">Subject</th>
                            <th className="px-4 py-3 text-left font-medium text-zinc-900 dark:text-zinc-50">Minimum Grade</th>
                            <th className="px-4 py-3 text-left font-medium text-zinc-900 dark:text-zinc-50">Type</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                          {requirements.map((req: any, i: number) => {
                            const subjectName = req.subject?.name || req.subject || "Unknown";
                            const minGrade = req.minimumGrade || req.grade || "N/A";
                            const reqType = req.requirementType || req.type || "REQUIRED";
                            return (
                              <tr key={i} className="bg-white dark:bg-zinc-950">
                                <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-50">{subjectName}</td>
                                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{minGrade}</td>
                                <td className="px-4 py-3">
                                  <Badge variant={reqType === "REQUIRED" ? "destructive" : "warning"}>{reqType}</Badge>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {activeTab === "tuition" && (
            <Card>
              <CardContent className="p-6">
                <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">Tuition & Fees</h2>
                {tuitionData.length > 0 ? (
                  <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
                    <table className="w-full text-sm">
                      <thead className="bg-zinc-50 dark:bg-zinc-900">
                        <tr>
                          <th className="px-4 py-3 text-left font-medium text-zinc-900 dark:text-zinc-50">Academic Year</th>
                          <th className="px-4 py-3 text-right font-medium text-zinc-900 dark:text-zinc-50">Amount (XAF)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                        {tuitionData.map((t: any, i: number) => (
                          <tr key={i} className="bg-white dark:bg-zinc-950">
                            <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-50">{t.academicYear || t.year || "N/A"}</td>
                            <td className="px-4 py-3 text-right font-semibold text-zinc-900 dark:text-zinc-50">
                              {(t.amount || 0).toLocaleString()} FCFA
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-sm text-zinc-500">Tuition information not available.</p>
                )}
                <p className="mt-3 text-xs text-zinc-500">Tuition fees are subject to change. Please verify with the university.</p>
              </CardContent>
            </Card>
          )}

          {activeTab === "careers" && (
            <Card>
              <CardContent className="p-6">
                <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">Career Opportunities</h2>
                {careersData.length > 0 ? (
                  <>
                    <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
                      Graduates of this programme can pursue careers in:
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {careersData.map((career: string, i: number) => (
                        <div key={i} className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
                          <Award className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          <span className="text-sm text-zinc-700 dark:text-zinc-300">{career}</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-zinc-500">Career information not available.</p>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Similar Programmes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Similar Programmes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {similarProgrammes.length > 0 ? (
                similarProgrammes.slice(0, 5).map((s: any) => (
                  <Link key={s.id || s.code} href={`/programmes/${s.code}`}
                    className="flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  >
                    <div>
                      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{s.name}</p>
                      <p className="text-xs text-zinc-500">{s.code}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-zinc-400" />
                  </Link>
                ))
              ) : (
                <p className="text-sm text-zinc-500">No similar programmes found.</p>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href={`/admission-checker?programme=${programme.code}`}>
                <Button variant="outline" className="w-full justify-start">
                  <GraduationCap className="mr-2 h-4 w-4" /> Check Eligibility
                </Button>
              </Link>
              {facultyAbb && (
                <Link href={`/programmes?faculty=${facultyAbb}`}>
                  <Button variant="outline" className="w-full justify-start">
                    <Building2 className="mr-2 h-4 w-4" /> More from {facultyAbb}
                  </Button>
                </Link>
              )}
              <Link href="/ai-advisor">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" /> Ask AI Advisor
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Key Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Key Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: "Degree Type", value: programme.degree },
                { label: "Level", value: programme.level?.replace(/_/g, " ") },
                { label: "Duration", value: `${programme.duration} years` },
                { label: "Faculty", value: facultyName },
                { label: "Department", value: deptName },
              ].map((item) => (
                <div key={item.label} className="flex justify-between text-sm">
                  <span className="text-zinc-500 dark:text-zinc-400">{item.label}</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-50">{item.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

