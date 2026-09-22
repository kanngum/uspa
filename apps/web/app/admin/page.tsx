"use client";

import { useState, useMemo, useCallback } from "react";
import {
  Shield,
  Users,
  BookOpen,
  Building2,
  TrendingUp,
  BarChart3,
  Plus,
  Search,
  Edit,
  Pencil,
  Trash2,
  RefreshCw,
  X,
  Save,
  Upload,
  AlertTriangle,
  CheckCircle,
  XCircle,
  DollarSign,
  GraduationCap,
  Briefcase,
  Key,
  ToggleLeft,
  ToggleRight,
  AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  StatsCardSkeleton,
  TableRowSkeleton,
} from "@/components/ui/loading";
import { EmptyState } from "@/components/ui/empty-state";

import {
  useAdminStats,
  useAdminProgrammes,
  useCreateProgramme,
  useUpdateProgramme,
  useDeleteProgramme,
  useAdminUsers,
  useUpdateUserRole,
  useToggleUserActive,
  useAdminSubjects,
  useCreateSubject,
  useUpdateSubject,
  useDeleteSubject,
  useAdminTuition,
  useCreateTuition,
  useUpdateTuition,
  useDeleteTuition,
  useAdminCareers,
  useCreateCareer,
  useUpdateCareer,
  useDeleteCareer,
  useAdminKeywords,
  useCreateKeyword,
  useDeleteKeyword,
  useAdminDepartments,
  useCreateAdminDepartment,
  useUpdateAdminDepartment,
  useDeleteAdminDepartment,
  useAdminFaculties,
  useAdminUniversities,
  useCreateAdminUniversity,
  useAdminAcademicUnitTypes,
  useCreateAdminAcademicUnit,
  useUpdateAdminAcademicUnit,
  useDeleteAdminAcademicUnit,
  useAdminAdmissionRules,
  useCreateAdmissionRule,
  useUpdateAdmissionRule,
  useDeleteAdmissionRule,
  useDuplicateFaculties,
  useDuplicateProgrammes,
  useDuplicateSubjects,
  useProgrammesByFaculty,
  usePopularSearches,
  useProgrammeRequirements,
  useCreateProgrammeRequirement,
  useUpdateProgrammeRequirement,
  useDeleteProgrammeRequirement,
  useImportValidate,
  useImportConfirm,
  useCatalogueReview,
  useResolveCatalogueReview,
} from "@/app/lib/hooks/useAdmin";

import {
  useAdminAnnouncements,
  useCreateAnnouncement,
  useUpdateAnnouncement,
  useToggleAnnouncement,
  useDeleteAnnouncement,
  useAnnouncementCategories,
  useCreateAnnouncementCategory,
  useToggleAnnouncementCategory,
} from "@/app/lib/hooks/useAnnouncements";

type ModalMode = "create" | "edit" | null;

function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl dark:bg-zinc-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            {title}
          </h3>

          <button
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const showToast = useCallback(
    (type: "success" | "error", message: string) => {
      setToast({ type, message });
      setTimeout(() => setToast(null), 3000);
    },
    [],
  );

  const { data: statsData, isLoading: statsLoading } = useAdminStats();
  const { data: facultiesData } = useProgrammesByFaculty();
  const { data: popularSearches } = usePopularSearches(5);

  const stats = useMemo(() => {
    const s = statsData?.data || statsData;

    if (!s) return null;

    return [
      {
        title: "Total Programmes",
        value: s.totalProgrammes ?? "-",
        icon: BookOpen,
        color: "blue",
      },
      {
        title: "Faculties/Schools",
        value: s.totalFaculties ?? "-",
        icon: Building2,
        color: "purple",
      },
      {
        title: "Registered Users",
        value: s.totalUsers ?? "-",
        icon: Users,
        color: "green",
      },
      {
        title: "Search Queries",
        value: s.totalSearches ?? "-",
        icon: TrendingUp,
        color: "orange",
      },
    ];
  }, [statsData]);

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "academic-structure", label: "Academic Structure", icon: Building2 },
    { id: "programmes", label: "Programmes", icon: GraduationCap },
    {
      id: "catalogue-review",
      label: "Catalogue Review",
      icon: AlertTriangle,
    },
    { id: "subjects", label: "Subjects", icon: BookOpen },
    { id: "users", label: "Users", icon: Users },
    { id: "tuition", label: "Tuition", icon: DollarSign },
    { id: "careers", label: "Careers", icon: Briefcase },
    { id: "keywords", label: "Keywords", icon: Key },
    {
      id: "admission-rules",
      label: "Admission Rules",
      icon: AlertCircle,
    },
    { id: "requirements", label: "Requirements", icon: BookOpen },
    { id: "announcements", label: "Announcements", icon: MailIcon },
    { id: "import", label: "Import", icon: Upload },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
    { id: "duplicates", label: "Duplicates", icon: AlertTriangle },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {toast && (
        <div
          className={`fixed right-4 top-4 z-50 flex items-center gap-2 rounded-lg px-4 py-3 text-sm text-white shadow-lg ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <XCircle className="h-4 w-4" />
          )}
          {toast.message}
        </div>
      )}

      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-900 dark:bg-zinc-50">
            <Shield className="h-5 w-5 text-white dark:text-zinc-900" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              Admin Dashboard
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Manage programmes, users, and system settings
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6 overflow-x-auto border-b border-zinc-200 dark:border-zinc-800">
        <nav className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setPage(1);
                setSearch("");
              }}
              className={`flex items-center gap-2 whitespace-nowrap px-4 pb-3 pt-2 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "border-b-2 border-zinc-900 text-zinc-900 dark:border-zinc-50 dark:text-zinc-50"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === "dashboard" && (
        <DashboardTab
          stats={stats}
          statsLoading={statsLoading}
          facultiesData={facultiesData}
          popularSearches={popularSearches}
        />
      )}
      {activeTab === "academic-structure" && <AcademicStructureTab />}
      {activeTab === "programmes" && (
        <ProgrammesTab
          page={page}
          setPage={setPage}
          search={search}
          setSearch={setSearch}
          showToast={showToast}
        />
      )}

      {activeTab === "catalogue-review" && (
        <CatalogueReviewTab
          page={page}
          setPage={setPage}
          showToast={showToast}
        />
      )}

      {activeTab === "subjects" && (
        <SubjectsTab
          page={page}
          setPage={setPage}
          search={search}
          setSearch={setSearch}
          showToast={showToast}
        />
      )}

      {activeTab === "users" && (
        <UsersTab
          page={page}
          setPage={setPage}
          search={search}
          setSearch={setSearch}
          showToast={showToast}
        />
      )}

      {activeTab === "tuition" && (
        <TuitionTab
          page={page}
          setPage={setPage}
          showToast={showToast}
        />
      )}

      {activeTab === "careers" && (
        <CareersTab
          page={page}
          setPage={setPage}
          search={search}
          setSearch={setSearch}
          showToast={showToast}
        />
      )}

      {activeTab === "keywords" && (
        <KeywordsTab
          page={page}
          setPage={setPage}
          search={search}
          setSearch={setSearch}
          showToast={showToast}
        />
      )}

      {activeTab === "admission-rules" && (
        <AdmissionRulesTab
          page={page}
          setPage={setPage}
          showToast={showToast}
        />
      )}

      {activeTab === "requirements" && (
        <RequirementsTab showToast={showToast} />
      )}

      {activeTab === "announcements" && (
        <AnnouncementsTab showToast={showToast} />
      )}

      {activeTab === "import" && <ImportTab showToast={showToast} />}

      {activeTab === "analytics" && <AnalyticsTab />}

      {activeTab === "duplicates" && <DuplicatesTab />}
    </div>
  );
}

function MailIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function DashboardTab({
  stats,
  statsLoading,
  facultiesData,
  popularSearches,
}: any) {
  return (
    <>
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsLoading ? (
          [1, 2, 3, 4].map((i) => <StatsCardSkeleton key={i} />)
        ) : stats ? (
          stats.map((stat: any) => (
            <Card key={stat.title}>
              <CardContent className="p-5">
                <div
                  className={`inline-flex rounded-lg p-2 ${
                    stat.color === "blue"
                      ? "bg-blue-100 dark:bg-blue-900/30"
                      : stat.color === "green"
                        ? "bg-green-100 dark:bg-green-900/30"
                        : stat.color === "purple"
                          ? "bg-purple-100 dark:bg-purple-900/30"
                          : "bg-orange-100 dark:bg-orange-900/30"
                  }`}
                >
                  <stat.icon
                    className={`h-5 w-5 ${
                      stat.color === "blue"
                        ? "text-blue-600 dark:text-blue-400"
                        : stat.color === "green"
                          ? "text-green-600 dark:text-green-400"
                          : stat.color === "purple"
                            ? "text-purple-600 dark:text-purple-400"
                            : "text-orange-600 dark:text-orange-400"
                    }`}
                  />
                </div>

                <p className="mt-3 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                  {stat.value}
                </p>

                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {stat.title}
                </p>
              </CardContent>
            </Card>
          ))
        ) : null}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Programmes by Faculty
            </CardTitle>
          </CardHeader>

          <CardContent>
            {facultiesData?.data ? (
              <div className="space-y-3">
                {facultiesData.data.slice(0, 8).map((f: any) => (
                  <div
                    key={f.id}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      {f.abbreviation || f.name}
                    </span>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-zinc-400">
                        {f.departmentCount} dept(s)
                      </span>

                      <Badge variant="secondary">
                        {f.programmeCount} programmes
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center py-8 text-zinc-400">
                <BarChart3 className="mr-2 h-5 w-5" />
                Loading...
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Popular Searches
            </CardTitle>
          </CardHeader>

          <CardContent>
            {popularSearches?.data ? (
              <div className="space-y-3">
                {popularSearches.data.map((s: any, i: number) => (
                  <div
                    key={i}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">
                      {s.query}
                    </span>

                    <Badge>{s.count} searches</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center py-8 text-zinc-400">
                <TrendingUp className="mr-2 h-5 w-5" />
                No search data yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
//Academic Structure Tab
// Academic Structure Tab
function AcademicStructureTab() {
  const { data, isLoading } = useAdminUniversities();
  const createUniversity = useCreateAdminUniversity();

  const universities = Array.isArray(data?.data) ? data.data : [];

  const [selectedUniversityId, setSelectedUniversityId] = useState("");
  const [selectedAcademicUnitId, setSelectedAcademicUnitId] =
    useState("");

  const {
    data: academicUnitsData,
    isLoading: academicUnitsLoading,
  } = useAdminFaculties(selectedUniversityId);

  const academicUnits = Array.isArray(academicUnitsData?.data)
    ? academicUnitsData.data
    : [];

  const {
    data: academicUnitTypesData,
    isLoading: academicUnitTypesLoading,
  } = useAdminAcademicUnitTypes();

  const academicUnitTypes = Array.isArray(
    academicUnitTypesData?.data,
  )
    ? academicUnitTypesData.data
    : [];

  const {
    data: departmentsData,
    isLoading: departmentsLoading,
  } = useAdminDepartments({
    universityId: selectedUniversityId || undefined,
    academicUnitId: selectedAcademicUnitId || undefined,
    page: 1,
    limit: 200,
  });

  const departments = Array.isArray(departmentsData?.data)
    ? departmentsData.data
    : [];

  const createDepartment = useCreateAdminDepartment();
  const updateDepartment = useUpdateAdminDepartment();
  const deleteDepartment = useDeleteAdminDepartment();

  const createAcademicUnit = useCreateAdminAcademicUnit();
  const updateAcademicUnit = useUpdateAdminAcademicUnit();
  const deleteAcademicUnit = useDeleteAdminAcademicUnit();

  const [universityName, setUniversityName] = useState("");
  const [universityAbbreviation, setUniversityAbbreviation] =
    useState("");
  const [universityWebsite, setUniversityWebsite] = useState("");
  const [universityDescription, setUniversityDescription] =
    useState("");

  const [academicUnitModal, setAcademicUnitModal] = useState<{
    mode: "create" | "edit" | null;
    item?: any;
  }>({
    mode: null,
  });

  const [academicUnitName, setAcademicUnitName] = useState("");
  const [academicUnitAbbreviation, setAcademicUnitAbbreviation] =
    useState("");
  const [academicUnitDescription, setAcademicUnitDescription] =
    useState("");
  const [academicUnitType, setAcademicUnitType] = useState("");

  const [departmentModal, setDepartmentModal] = useState<{
    mode: "create" | "edit" | null;
    item?: any;
  }>({
    mode: null,
  });

  const [departmentName, setDepartmentName] = useState("");
  const [departmentAbbreviation, setDepartmentAbbreviation] =
    useState("");
  const [departmentDescription, setDepartmentDescription] =
    useState("");
  const [departmentAcademicUnitId, setDepartmentAcademicUnitId] =
    useState("");

  const handleCreateUniversity = () => {
    const name = universityName.trim();
    const abbreviation = universityAbbreviation.trim();
    const website = universityWebsite.trim();
    const description = universityDescription.trim();

    if (!name || !abbreviation) {
      return;
    }

    createUniversity.mutate(
      {
        name,
        abbreviation,
        website: website || undefined,
        description: description || undefined,
      },
      {
        onSuccess: () => {
          setUniversityName("");
          setUniversityAbbreviation("");
          setUniversityWebsite("");
          setUniversityDescription("");
        },
      },
    );
  };

  const getAcademicUnitType = (unit: any) => {
    if (!unit?.type) {
      return "Academic Unit";
    }

    if (typeof unit.type === "string") {
      return unit.type;
    }

    if (typeof unit.type === "object") {
      return (
        unit.type.name ||
        unit.type.code ||
        "Academic Unit"
      );
    }

    return "Academic Unit";
  };

  const resetAcademicUnitForm = () => {
    setAcademicUnitName("");
    setAcademicUnitAbbreviation("");
    setAcademicUnitDescription("");

    const defaultType =
      academicUnitTypes.find(
        (type: any) =>
          type?.code?.toUpperCase() === "FACULTY",
      )?.code ||
      academicUnitTypes[0]?.code ||
      "";

    setAcademicUnitType(defaultType);
  };

  const openCreateAcademicUnit = () => {
    resetAcademicUnitForm();

    setAcademicUnitModal({
      mode: "create",
    });
  };

  const openEditAcademicUnit = (unit: any) => {
    const typeCode =
      typeof unit?.type === "object" && unit.type !== null
        ? unit.type.code || ""
        : typeof unit?.type === "string"
          ? unit.type
          : "";

    setAcademicUnitName(unit?.name || "");
    setAcademicUnitAbbreviation(unit?.abbreviation || "");
    setAcademicUnitDescription(unit?.description || "");
    setAcademicUnitType(typeCode);

    setAcademicUnitModal({
      mode: "edit",
      item: unit,
    });
  };

  const closeAcademicUnitModal = () => {
    setAcademicUnitModal({
      mode: null,
    });

    resetAcademicUnitForm();
  };

  const handleSaveAcademicUnit = () => {
    const name = academicUnitName.trim();
    const abbreviation = academicUnitAbbreviation.trim();
    const description = academicUnitDescription.trim();
    const type = academicUnitType.trim();

    if (!name || !selectedUniversityId || !type) {
      return;
    }

    if (academicUnitModal.mode === "create") {
      createAcademicUnit.mutate(
        {
          name,
          abbreviation: abbreviation || undefined,
          description: description || undefined,
          universityId: selectedUniversityId,
          type,
        },
        {
          onSuccess: () => {
            closeAcademicUnitModal();
          },
        },
      );

      return;
    }

    if (
      academicUnitModal.mode === "edit" &&
      academicUnitModal.item?.id
    ) {
      updateAcademicUnit.mutate(
        {
          id: academicUnitModal.item.id,
          input: {
            name,
            abbreviation,
            description,
            type,
          },
        },
        {
          onSuccess: () => {
            closeAcademicUnitModal();
          },
        },
      );
    }
  };

  const handleDeleteAcademicUnit = (unit: any) => {
    if (!unit?.id) {
      return;
    }

    const confirmed = window.confirm(
      `Delete academic unit "${unit.name}"? This can only be done if it has no departments.`,
    );

    if (!confirmed) {
      return;
    }

    deleteAcademicUnit.mutate(unit.id, {
      onSuccess: () => {
        if (selectedAcademicUnitId === unit.id) {
          setSelectedAcademicUnitId("");
        }
      },
    });
  };

  const resetDepartmentForm = () => {
    setDepartmentName("");
    setDepartmentAbbreviation("");
    setDepartmentDescription("");
    setDepartmentAcademicUnitId(selectedAcademicUnitId);
  };

  const openCreateDepartment = () => {
    resetDepartmentForm();

    setDepartmentModal({
      mode: "create",
    });
  };

  const openEditDepartment = (department: any) => {
    setDepartmentName(department?.name || "");
    setDepartmentAbbreviation(
      department?.abbreviation || "",
    );
    setDepartmentDescription(
      department?.description || "",
    );
    setDepartmentAcademicUnitId(
      department?.academicUnitId ||
        department?.academicUnit?.id ||
        selectedAcademicUnitId,
    );

    setDepartmentModal({
      mode: "edit",
      item: department,
    });
  };

  const closeDepartmentModal = () => {
    setDepartmentModal({
      mode: null,
    });

    resetDepartmentForm();
  };

  const handleSaveDepartment = () => {
    const name = departmentName.trim();
    const abbreviation = departmentAbbreviation.trim();
    const description = departmentDescription.trim();

    if (!name || !departmentAcademicUnitId) {
      return;
    }

    if (departmentModal.mode === "create") {
      createDepartment.mutate(
        {
          name,
          abbreviation: abbreviation || undefined,
          description: description || undefined,
          academicUnitId: departmentAcademicUnitId,
        },
        {
          onSuccess: () => {
            closeDepartmentModal();
          },
        },
      );

      return;
    }

    if (
      departmentModal.mode === "edit" &&
      departmentModal.item?.id
    ) {
      updateDepartment.mutate(
        {
          id: departmentModal.item.id,
          input: {
            name,
            abbreviation,
            description,
            academicUnitId: departmentAcademicUnitId,
          },
        },
        {
          onSuccess: () => {
            closeDepartmentModal();
          },
        },
      );
    }
  };

  const handleDeleteDepartment = (department: any) => {
    if (!department?.id) {
      return;
    }

    const confirmed = window.confirm(
      `Delete department "${department.name}"? This can only be done if it has no programmes.`,
    );

    if (!confirmed) {
      return;
    }

    deleteDepartment.mutate(department.id);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-primary">
          Academic Structure
        </h2>

        <p className="mt-1 text-sm text-secondary">
          Manage universities, academic units, departments, and
          their relationships.
        </p>
      </div>

      <div className="rounded-card border border-rule bg-white p-6 shadow-sm">
        <div>
          <h3 className="text-base font-semibold text-primary">
            Add University
          </h3>

          <p className="mt-1 text-sm text-secondary">
            Create a university that can contain academic units.
          </p>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <input
            value={universityName}
            onChange={(e) =>
              setUniversityName(e.target.value)
            }
            placeholder="University name"
            className="min-h-11 rounded-control border border-rule bg-white px-3 text-sm text-primary placeholder:text-secondary md:col-span-2"
          />

          <input
            value={universityAbbreviation}
            onChange={(e) =>
              setUniversityAbbreviation(e.target.value)
            }
            placeholder="Abbreviation"
            className="min-h-11 rounded-control border border-rule bg-white px-3 text-sm text-primary placeholder:text-secondary"
          />

          <input
            value={universityWebsite}
            onChange={(e) =>
              setUniversityWebsite(e.target.value)
            }
            placeholder="Website"
            className="min-h-11 rounded-control border border-rule bg-white px-3 text-sm text-primary placeholder:text-secondary"
          />

          <textarea
            value={universityDescription}
            onChange={(e) =>
              setUniversityDescription(e.target.value)
            }
            placeholder="Description"
            rows={3}
            className="rounded-control border border-rule bg-white px-3 py-2 text-sm text-primary placeholder:text-secondary md:col-span-2"
          />
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            disabled={createUniversity.isPending}
            onClick={handleCreateUniversity}
            className="min-h-11 rounded-control bg-primary px-5 text-sm font-semibold text-white disabled:opacity-50"
          >
            {createUniversity.isPending
              ? "Adding..."
              : "Add University"}
          </button>
        </div>
      </div>

      <div className="rounded-card border border-rule bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-base font-semibold text-primary">
              Academic Units
            </h3>

            <p className="mt-1 text-sm text-secondary">
              Select a university to manage its academic units.
            </p>
          </div>

          {selectedUniversityId && (
            <button
              type="button"
              onClick={openCreateAcademicUnit}
              className="min-h-10 rounded-control bg-primary px-4 text-sm font-semibold text-white"
            >
              Add Academic Unit
            </button>
          )}
        </div>

        <div className="mt-5">
          <label
            htmlFor="structure-university"
            className="mb-2 block text-sm font-medium text-primary"
          >
            University
          </label>

          <select
            id="structure-university"
            value={selectedUniversityId}
            onChange={(e) => {
              setSelectedUniversityId(e.target.value);
              setSelectedAcademicUnitId("");
            }}
            className="min-h-11 w-full rounded-control border border-rule bg-white px-3 text-sm text-primary md:max-w-xl"
          >
            <option value="">
              Select a university
            </option>

            {universities.map((university: any) => (
              <option
                key={university.id}
                value={university.id}
              >
                {typeof university.name === "string"
                  ? university.name
                  : "Unnamed University"}
              </option>
            ))}
          </select>
        </div>

        {selectedUniversityId && (
          <div className="mt-5">
            {academicUnitsLoading ? (
              <p className="text-sm text-secondary">
                Loading academic units...
              </p>
            ) : academicUnits.length === 0 ? (
              <div className="rounded-control border border-dashed border-rule p-5">
                <p className="text-sm text-secondary">
                  No academic units found for this university.
                </p>

                <button
                  type="button"
                  onClick={openCreateAcademicUnit}
                  className="mt-3 text-sm font-semibold text-accent-dark hover:underline"
                >
                  Add the first academic unit
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {academicUnits.map((unit: any) => {
                  const typeName =
                    getAcademicUnitType(unit);

                  const abbreviation =
                    typeof unit?.abbreviation === "string"
                      ? unit.abbreviation
                      : "";

                  const isSelected =
                    selectedAcademicUnitId === unit.id;

                  return (
                    <div
                      key={unit.id}
                      className={`rounded-control border p-4 ${
                        isSelected
                          ? "border-primary bg-paper-soft"
                          : "border-rule"
                      }`}
                    >
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedAcademicUnitId(
                              unit.id,
                            )
                          }
                          className="text-left"
                        >
                          <p className="font-medium text-primary">
                            {typeof unit?.name === "string"
                              ? unit.name
                              : "Unnamed Academic Unit"}
                          </p>

                          <p className="text-sm text-secondary">
                            {typeName}
                            {abbreviation
                              ? ` • ${abbreviation}`
                              : ""}
                          </p>
                        </button>

                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              openEditAcademicUnit(unit)
                            }
                            className="min-h-10 rounded-control border border-rule-strong px-4 text-sm font-semibold text-primary hover:border-accent hover:bg-paper-soft"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteAcademicUnit(unit)
                            }
                            disabled={
                              deleteAcademicUnit.isPending
                            }
                            className="min-h-10 rounded-control border border-rule-strong px-4 text-sm font-semibold text-red-600 hover:border-red-300 hover:bg-red-50 disabled:opacity-50"
                          >
                            Delete
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedAcademicUnitId(
                                unit.id,
                              );
                              resetDepartmentForm();
                              setDepartmentModal({
                                mode: "create",
                              });
                            }}
                            className="min-h-10 rounded-control border border-rule-strong px-4 text-sm font-semibold text-primary hover:border-accent hover:bg-paper-soft"
                          >
                            Add Department
                          </button>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="mt-4 border-t border-rule pt-4">
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <p className="text-sm font-semibold text-primary">
                                Departments
                              </p>

                              <p className="text-xs text-secondary">
                                Departments belonging to{" "}
                                {unit.name}.
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={openCreateDepartment}
                              className="min-h-10 rounded-control bg-primary px-4 text-sm font-semibold text-white"
                            >
                              Add Department
                            </button>
                          </div>

                          <div className="mt-4">
                            {departmentsLoading ? (
                              <p className="text-sm text-secondary">
                                Loading departments...
                              </p>
                            ) : departments.length === 0 ? (
                              <p className="text-sm text-secondary">
                                No departments found for this
                                academic unit.
                              </p>
                            ) : (
                              <div className="space-y-2">
                                {departments.map(
                                  (department: any) => (
                                    <div
                                      key={department.id}
                                      className="rounded-control border border-rule p-4"
                                    >
                                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                          <p className="font-medium text-primary">
                                            {department.name}
                                          </p>

                                          <p className="text-sm text-secondary">
                                            {department.abbreviation ||
                                              "No abbreviation"}

                                            {typeof department
                                              ?._count
                                              ?.programmes ===
                                            "number"
                                              ? ` • ${department._count.programmes} programme${
                                                  department
                                                    ._count
                                                    .programmes ===
                                                  1
                                                    ? ""
                                                    : "s"
                                                }`
                                              : ""}
                                          </p>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                          <button
                                            type="button"
                                            onClick={() =>
                                              openEditDepartment(
                                                department,
                                              )
                                            }
                                            className="min-h-9 rounded-control border border-rule-strong px-3 text-xs font-semibold text-primary hover:border-accent hover:bg-paper-soft"
                                          >
                                            Edit
                                          </button>

                                          <button
                                            type="button"
                                            onClick={() =>
                                              handleDeleteDepartment(
                                                department,
                                              )
                                            }
                                            disabled={
                                              deleteDepartment.isPending
                                            }
                                            className="min-h-9 rounded-control border border-rule-strong px-3 text-xs font-semibold text-red-600 hover:border-red-300 hover:bg-red-50 disabled:opacity-50"
                                          >
                                            Delete
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  ),
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {academicUnitModal.mode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl rounded-card border border-rule bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-primary">
                  {academicUnitModal.mode === "create"
                    ? "Add Academic Unit"
                    : "Edit Academic Unit"}
                </h3>

                <p className="mt-1 text-sm text-secondary">
                  {academicUnitModal.mode === "create"
                    ? "Add an academic unit to the selected university."
                    : "Update the academic unit details."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeAcademicUnitModal}
                className="text-sm text-secondary hover:text-primary"
              >
                Close
              </button>
            </div>

            <div className="mt-5 space-y-4">
              {academicUnitModal.mode === "create" && (
                <div className="rounded-control border border-rule bg-paper-soft px-4 py-3">
                  <p className="text-xs font-medium text-secondary">
                    University
                  </p>

                  <p className="mt-1 text-sm font-semibold text-primary">
                    {
                      universities.find(
                        (university: any) =>
                          university.id ===
                          selectedUniversityId,
                      )?.name
                    }
                  </p>
                </div>
              )}

              <div>
                <label
                  htmlFor="academic-unit-type"
                  className="mb-2 block text-sm font-medium text-primary"
                >
                  Academic Unit Type
                </label>

                <select
                  id="academic-unit-type"
                  value={academicUnitType}
                  onChange={(e) =>
                    setAcademicUnitType(e.target.value)
                  }
                  disabled={academicUnitTypesLoading}
                  className="min-h-11 w-full rounded-control border border-rule bg-white px-3 text-sm text-primary disabled:opacity-50"
                >
                  <option value="">
                    {academicUnitTypesLoading
                      ? "Loading types..."
                      : "Select a type"}
                  </option>

                  {academicUnitTypes.map((type: any) => (
                    <option
                      key={type.id}
                      value={type.code}
                    >
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              <input
                value={academicUnitName}
                onChange={(e) =>
                  setAcademicUnitName(e.target.value)
                }
                placeholder="Academic unit name"
                className="min-h-11 w-full rounded-control border border-rule bg-white px-3 text-sm text-primary placeholder:text-secondary"
              />

              <input
                value={academicUnitAbbreviation}
                onChange={(e) =>
                  setAcademicUnitAbbreviation(
                    e.target.value,
                  )
                }
                placeholder="Abbreviation"
                className="min-h-11 w-full rounded-control border border-rule bg-white px-3 text-sm text-primary placeholder:text-secondary"
              />

              <textarea
                value={academicUnitDescription}
                onChange={(e) =>
                  setAcademicUnitDescription(
                    e.target.value,
                  )
                }
                placeholder="Description"
                rows={3}
                className="w-full rounded-control border border-rule bg-white px-3 py-2 text-sm text-primary placeholder:text-secondary"
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeAcademicUnitModal}
                className="min-h-11 rounded-control border border-rule-strong px-5 text-sm font-semibold text-primary"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveAcademicUnit}
                disabled={
                  createAcademicUnit.isPending ||
                  updateAcademicUnit.isPending ||
                  academicUnitTypesLoading
                }
                className="min-h-11 rounded-control bg-primary px-5 text-sm font-semibold text-white disabled:opacity-50"
              >
                {createAcademicUnit.isPending ||
                updateAcademicUnit.isPending
                  ? "Saving..."
                  : academicUnitModal.mode === "create"
                    ? "Add Academic Unit"
                    : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {departmentModal.mode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl rounded-card border border-rule bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-primary">
                  {departmentModal.mode === "create"
                    ? "Add Department"
                    : "Edit Department"}
                </h3>

                <p className="mt-1 text-sm text-secondary">
                  Assign the department to an academic unit.
                </p>
              </div>

              <button
                type="button"
                onClick={closeDepartmentModal}
                className="text-sm text-secondary hover:text-primary"
              >
                Close
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label
                  htmlFor="department-academic-unit"
                  className="mb-2 block text-sm font-medium text-primary"
                >
                  Academic Unit
                </label>

                <select
                  id="department-academic-unit"
                  value={departmentAcademicUnitId}
                  onChange={(e) =>
                    setDepartmentAcademicUnitId(
                      e.target.value,
                    )
                  }
                  className="min-h-11 w-full rounded-control border border-rule bg-white px-3 text-sm text-primary"
                >
                  <option value="">
                    Select an academic unit
                  </option>

                  {academicUnits.map((unit: any) => (
                    <option
                      key={unit.id}
                      value={unit.id}
                    >
                      {unit.name}
                    </option>
                  ))}
                </select>
              </div>

              <input
                value={departmentName}
                onChange={(e) =>
                  setDepartmentName(e.target.value)
                }
                placeholder="Department name"
                className="min-h-11 w-full rounded-control border border-rule bg-white px-3 text-sm text-primary placeholder:text-secondary"
              />

              <input
                value={departmentAbbreviation}
                onChange={(e) =>
                  setDepartmentAbbreviation(
                    e.target.value,
                  )
                }
                placeholder="Abbreviation"
                className="min-h-11 w-full rounded-control border border-rule bg-white px-3 text-sm text-primary placeholder:text-secondary"
              />

              <textarea
                value={departmentDescription}
                onChange={(e) =>
                  setDepartmentDescription(
                    e.target.value,
                  )}
                placeholder="Description"
                rows={3}
                className="w-full rounded-control border border-rule bg-white px-3 py-2 text-sm text-primary placeholder:text-secondary"
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeDepartmentModal}
                className="min-h-11 rounded-control border border-rule-strong px-5 text-sm font-semibold text-primary"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveDepartment}
                disabled={
                  createDepartment.isPending ||
                  updateDepartment.isPending
                }
                className="min-h-11 rounded-control bg-primary px-5 text-sm font-semibold text-white disabled:opacity-50"
              >
                {createDepartment.isPending ||
                updateDepartment.isPending
                  ? "Saving..."
                  : departmentModal.mode === "create"
                    ? "Add Department"
                    : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-card border border-rule bg-white p-6 shadow-sm">
        <h3 className="text-base font-semibold text-primary">
          Universities
        </h3>

        {isLoading ? (
          <p className="mt-4 text-sm text-secondary">
            Loading universities...
          </p>
        ) : universities.length === 0 ? (
          <p className="mt-4 text-sm text-secondary">
            No universities found.
          </p>
        ) : (
          <div className="mt-4 space-y-2">
            {universities.map((university: any) => (
              <div
                key={university.id}
                className="rounded-control border border-rule p-4"
              >
                <p className="font-medium text-primary">
                  {typeof university.name === "string"
                    ? university.name
                    : "Unnamed University"}
                </p>

                <p className="text-sm text-secondary">
                  {typeof university.abbreviation === "string"
                    ? university.abbreviation
                    : "No abbreviation"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
//Programmes Tab
function ProgrammesTab({
  page,
  setPage,
  search,
  setSearch,
  showToast,
}: any) {
  const { data, isLoading } = useAdminProgrammes(
    page,
    20,
    search || undefined,
  );

  const { data: universitiesData } = useAdminUniversities();

  const createMutation = useCreateProgramme();
  const updateMutation = useUpdateProgramme();
  const deleteMutation = useDeleteProgramme();

  const [modal, setModal] = useState<{
    mode: ModalMode;
    item?: any;
  }>({ mode: null });

  const emptyForm = {
    code: "",
    name: "",
    degree: "BSC",
    level: "UNDERGRADUATE",
    duration: "",
    description: "",
    universityId: "",
    academicUnitId: "",
    departmentId: "",
    isActive: true,
    isFeatured: false,
    featuredOrder: 1,
  };

  const [form, setForm] = useState(emptyForm);

  const { data: academicUnitsData } = useAdminFaculties(
    form.universityId || undefined,
  );

  const { data: departmentsData } = useAdminDepartments({
    universityId: form.universityId || undefined,
    academicUnitId: form.academicUnitId || undefined,
    page: 1,
    limit: 200,
  });

  const programmes = useMemo(() => {
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data)) return data;
    return [];
  }, [data]);

  const universities = useMemo(() => {
    const value = universitiesData?.data || universitiesData;
    return Array.isArray(value) ? value : [];
  }, [universitiesData]);

  const academicUnits = useMemo(() => {
    const value = academicUnitsData?.data || academicUnitsData;
    return Array.isArray(value) ? value : [];
  }, [academicUnitsData]);

  const departments = useMemo(() => {
    const value = departmentsData?.data || departmentsData;
    return Array.isArray(value) ? value : [];
  }, [departmentsData]);

  const totalPages = data?.totalPages || 1;

  const openCreate = () => {
    setForm({ ...emptyForm });
    setModal({ mode: "create" });
  };

  const openEdit = (item: any) => {
    const universityId =
      item.department?.academicUnit?.university?.id || "";

    const academicUnitId =
      item.department?.academicUnit?.id || "";

    const degreeValue =
      typeof item.degree === "object" && item.degree !== null
        ? item.degree.code || item.degree.name || "BSC"
        : item.degree || "BSC";

    setForm({
      code: item.code || "",
      name: item.name || "",
      degree: degreeValue,
      level: item.level || "UNDERGRADUATE",
      duration:
        item.duration !== undefined && item.duration !== null
         ? String(item.duration)
         : "",
      description: item.description || "",
      universityId,
      academicUnitId,
      departmentId: item.departmentId || "",
      isActive: item.isActive !== false,
      isFeatured: item.isFeatured === true,
      featuredOrder: item.featuredOrder || 1,
    });

    setModal({ mode: "edit", item });
  };

  const handleUniversityChange = (universityId: string) => {
    setForm({
      ...form,
      universityId,
      academicUnitId: "",
      departmentId: "",
    });
  };

  const handleAcademicUnitChange = (academicUnitId: string) => {
    setForm({
      ...form,
      academicUnitId,
      departmentId: "",
    });
  };

  const handleDepartmentChange = (departmentId: string) => {
    setForm({
      ...form,
      departmentId,
    });
  };

  const handleSubmit = async () => {
    if (!form.code.trim() || !form.name.trim()) {
      showToast("error", "Programme code and name are required");
      return;
    }

    if (!form.universityId) {
      showToast("error", "University is required");
      return;
    }

    if (!form.academicUnitId) {
      showToast("error", "Academic unit is required");
      return;
    }

    if (!form.departmentId) {
      showToast("error", "Department is required");
      return;
    }

    try {
      const payload = {
        code: form.code.trim(),
        name: form.name.trim(),
        degree: form.degree,
        level: form.level,
        duration: form.duration.trim() || undefined,
        description: form.description.trim() || undefined,
        departmentId: form.departmentId,
        isActive: form.isActive,
        isFeatured: form.isFeatured,
        featuredOrder: form.isFeatured
          ? Number(form.featuredOrder) || 1
          : null,
      };

      if (modal.mode === "create") {
        await createMutation.mutateAsync(payload as any);
        showToast("success", "Programme created");
      } else if (modal.mode === "edit" && modal.item) {
        await updateMutation.mutateAsync({
          id: modal.item.id,
          input: payload,
        });
        showToast("success", "Programme updated");
      }

      setModal({ mode: null });
    } catch (err: any) {
      showToast("error", err.message);
    }
  };

  const handleDelete = async (item: any) => {
    if (!confirm(`Delete programme "${item.name}"?`)) return;

    try {
      await deleteMutation.mutateAsync(item.id);
      showToast("success", "Programme deleted");
    } catch (err: any) {
      showToast("error", err.message);
    }
  };

  return (
    <>
      <div className="mb-4 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />

          <input
            type="text"
            placeholder="Search programmes..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-10 pr-4 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
          />
        </div>

        <Button onClick={openCreate} className="gap-1">
          <Plus className="h-4 w-4" />
          Add Programme
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800">
                  <th className="px-4 pb-3 pt-4 text-left font-medium text-zinc-500">
                    Code
                  </th>
                  <th className="px-4 pb-3 pt-4 text-left font-medium text-zinc-500">
                    Name
                  </th>
                  <th className="px-4 pb-3 pt-4 text-left font-medium text-zinc-500">
                    Faculty
                  </th>
                  <th className="px-4 pb-3 pt-4 text-left font-medium text-zinc-500">
                    Degree
                  </th>
                  <th className="px-4 pb-3 pt-4 text-left font-medium text-zinc-500">
                    Duration
                  </th>
                  <th className="px-4 pb-3 pt-4 text-left font-medium text-zinc-500">
                    Featured
                  </th>
                  <th className="px-4 pb-3 pt-4 text-left font-medium text-zinc-500">
                    Status
                  </th>
                  <th className="px-4 pb-3 pt-4 text-left font-medium text-zinc-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {isLoading ? (
                  [1, 2, 3, 4, 5].map((i) => (
                    <TableRowSkeleton key={i} cols={8} />
                  ))
                ) : programmes.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-12 text-center text-zinc-500"
                    >
                      No programmes found
                    </td>
                  </tr>
                ) : (
                  programmes.map((programme: any) => (
                    <tr
                      key={programme.id}
                      className="border-b border-zinc-100 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/50"
                    >
                      <td className="px-4 py-3 font-mono text-xs text-zinc-500">
                        {programme.code}
                      </td>

                      <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-50">
                        {programme.name}
                      </td>

                      <td className="px-4 py-3 text-zinc-500">
                        {programme.department?.academicUnit?.abbreviation ||
                          programme.department?.academicUnit?.name ||
                          programme.department?.name ||
                          "-"}
                      </td>

                      <td className="px-4 py-3">
                        <Badge variant="outline">
                          {typeof programme.degree === "object" &&
                          programme.degree !== null
                            ? programme.degree.name ||
                              programme.degree.code ||
                              "Programme"
                            : programme.degree || "Programme"}
                        </Badge>
                      </td>

                      <td className="px-4 py-3 text-zinc-500">
                        {programme.duration || "-"}
                      </td>

                      <td className="px-4 py-3">
                        {programme.isFeatured ? (
                          <Badge variant="success">
                            #{programme.featuredOrder || 1}
                          </Badge>
                        ) : (
                          <Badge variant="secondary">No</Badge>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        <Badge
                          variant={
                            programme.isActive ? "success" : "secondary"
                          }
                        >
                          {programme.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEdit(programme)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(programme)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-zinc-200 px-4 py-3 dark:border-zinc-800">
              <span className="text-sm text-zinc-500">
                Page {page} of {totalPages}
              </span>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {modal.mode && (
        <Modal
          title={
            modal.mode === "create"
              ? "Create Programme"
              : "Edit Programme"
          }
          onClose={() => setModal({ mode: null })}
        >
          <div className="max-h-[75vh] space-y-4 overflow-y-auto pr-1">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Code *
                </label>

                <input
                  type="text"
                  value={form.code}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      code: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Degree
                </label>

                <select
                  value={form.degree}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      degree: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                >
                  {[
                    "BSC",
                    "BA",
                    "BENG",
                    "BED",
                    "LLB",
                    "MBBS",
                    "HND",
                    "DIPLOMA",
                    "PGD",
                    "MSC",
                    "MA",
                    "MENG",
                    "PHD",
                    "BTECH",
                  ].map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Name *
              </label>

              <input
                type="text"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Level
                </label>

                <select
                  value={form.level}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      level: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                >
                  <option value="UNDERGRADUATE">
                    Undergraduate
                  </option>
                  <option value="POSTGRADUATE">
                    Postgraduate
                  </option>
                  <option value="DOCTORATE">
                    Doctorate
                  </option>
                  <option value="PROFESSIONAL">
                    Professional
                  </option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Duration
                </label>

                <input
                  type="text"
                  value={form.duration}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      duration: e.target.value,
                    })
                  }
                  placeholder="e.g. 4 years"
                  className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                University *
              </label>

              <select
                value={form.universityId}
                onChange={(e) =>
                  handleUniversityChange(e.target.value)
                }
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
              >
                <option value="">Select university...</option>

                {universities.map((university: any) => (
                  <option
                    key={university.id}
                    value={university.id}
                  >
                    {university.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Academic Unit *
              </label>

              <select
                value={form.academicUnitId}
                onChange={(e) =>
                  handleAcademicUnitChange(e.target.value)
                }
                disabled={!form.universityId}
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:disabled:bg-zinc-900"
              >
                <option value="">
                  {form.universityId
                    ? "Select academic unit..."
                    : "Select university first..."}
                </option>

                {academicUnits.map((unit: any) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.name}
                    {unit.abbreviation
                      ? ` (${unit.abbreviation})`
                      : ""}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Department *
              </label>

              <select
                value={form.departmentId}
                onChange={(e) =>
                  handleDepartmentChange(e.target.value)
                }
                disabled={!form.academicUnitId}
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:disabled:bg-zinc-900"
              >
                <option value="">
                  {form.academicUnitId
                    ? "Select department..."
                    : "Select academic unit first..."}
                </option>

                {departments.map((department: any) => (
                  <option
                    key={department.id}
                    value={department.id}
                  >
                    {department.name}
                    {department.abbreviation
                      ? ` (${department.abbreviation})`
                      : ""}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Description
              </label>

              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
                rows={4}
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
              />
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) =>
                  setForm({
                    ...form,
                    isActive: e.target.checked,
                  })
                }
              />
              Active
            </label>

            <div className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-700">
              <label className="flex items-center gap-2 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      isFeatured: e.target.checked,
                    })
                  }
                />
                Featured on homepage
              </label>

              {form.isFeatured && (
                <div className="mt-3">
                  <label className="mb-1 block text-sm font-medium">
                    Display order
                  </label>

                  <input
                    type="number"
                    min={1}
                    value={form.featuredOrder}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        featuredOrder:
                          Number(e.target.value) || 1,
                      })
                    }
                    className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setModal({ mode: null })}
              >
                Cancel
              </Button>

              <Button
                onClick={handleSubmit}
                disabled={
                  createMutation.isPending ||
                  updateMutation.isPending
                }
              >
                <Save className="mr-1 h-4 w-4" />
                {modal.mode === "create"
                  ? "Create"
                  : "Save"}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

function CatalogueReviewTab({
  page,
  setPage,
  showToast,
}: any) {
  const { data, isLoading } = useCatalogueReview(page, 20);
  const resolve = useResolveCatalogueReview();

  const [selected, setSelected] = useState<any>(null);
  const [form, setForm] = useState<any>({});

  const payload = data || {
    data: [],
    totalPages: 1,
  };

  const open = (item: any) => {
    setSelected(item);

    setForm({
      applicationDeadline: item.applicationDeadline
        ? new Date(item.applicationDeadline)
            .toISOString()
            .slice(0, 10)
        : "",
      applicationStatus:
        item.applicationStatus || "Open",
      sourceCode: item.sourceCode || "",
      feeAmount: item.tuition?.[0]?.amount || "",
      feePeriod:
        item.tuition?.[0]?.feePeriod || "UNKNOWN",
      academicYear:
        item.tuition?.[0]?.academicYear ||
        item.applicationCycle ||
        "2026/2027",
    });
  };

  const save = async () => {
    try {
      await resolve.mutateAsync({
        id: selected.id,
        input: {
          ...form,
          feeAmount:
            form.feeAmount === ""
              ? undefined
              : Number(form.feeAmount),
        },
      });

      showToast(
        "success",
        "Catalogue record updated",
      );

      setSelected(null);
    } catch (error: any) {
      showToast(
        "error",
        error.message || "Could not update record",
      );
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            Catalogue Review Queue
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="mb-4 text-sm text-zinc-500">
            Correct the flagged information and save. A record
            automatically leaves this queue once all checks pass.
          </p>

          {isLoading ? (
            <p className="py-6 text-sm text-zinc-500">
              Loading review queue...
            </p>
          ) : payload?.data?.length ? (
            <div className="space-y-3">
              {payload.data.map((item: any) => (
                <div
                  key={item.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
                >
                  <div>
                    <p className="font-medium text-zinc-900 dark:text-zinc-50">
                      {item.name}
                    </p>

                    <p className="mt-1 text-xs text-zinc-500">
                      {item.department?.academicUnit?.abbreviation} ·{" "}
                      {item.sourceCode || item.code}
                    </p>

                    <p className="mt-1 text-sm text-amber-700 dark:text-amber-400">
                      {item.reviewNotes}
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => open(item)}
                  >
                    <Edit className="mr-1 h-4 w-4" />
                    Review
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon="book"
              title="Catalogue is clear"
              description="No programmes need data review."
            />
          )}

          {payload?.totalPages > 1 && (
            <div className="mt-5 flex justify-end gap-2">
              <Button
                variant="outline"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>

              <Button
                variant="outline"
                disabled={page >= payload.totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {selected && (
        <Modal
          title={`Review: ${selected.name}`}
          onClose={() => setSelected(null)}
        >
          <div className="space-y-4">
            <label className="block text-sm">
              Official programme code
              <input
                value={form.sourceCode}
                onChange={(e) =>
                  setForm({
                    ...form,
                    sourceCode: e.target.value,
                  })
                }
                className="mt-1 w-full rounded border p-2 dark:bg-zinc-800"
              />
            </label>

            <label className="block text-sm">
              Application deadline
              <input
                type="date"
                value={form.applicationDeadline}
                onChange={(e) =>
                  setForm({
                    ...form,
                    applicationDeadline:
                      e.target.value,
                  })
                }
                className="mt-1 w-full rounded border p-2 dark:bg-zinc-800"
              />
            </label>

            <label className="block text-sm">
              Application status
              <select
                value={form.applicationStatus}
                onChange={(e) =>
                  setForm({
                    ...form,
                    applicationStatus:
                      e.target.value,
                  })
                }
                className="mt-1 w-full rounded border p-2 dark:bg-zinc-800"
              >
                <option>Open</option>
                <option>Closed</option>
              </select>
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="block text-sm">
                Fee (XAF)
                <input
                  type="number"
                  min="1"
                  value={form.feeAmount}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      feeAmount: e.target.value,
                    })
                  }
                  className="mt-1 w-full rounded border p-2 dark:bg-zinc-800"
                />
              </label>

              <label className="block text-sm">
                Fee type
                <select
                  value={form.feePeriod}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      feePeriod: e.target.value,
                    })
                  }
                  className="mt-1 w-full rounded border p-2 dark:bg-zinc-800"
                >
                  <option value="ANNUAL">Annual</option>
                  <option value="FIRST_YEAR">
                    First year
                  </option>
                  <option value="PROGRAMME_TOTAL">
                    Programme total
                  </option>
                  <option value="UNKNOWN">
                    Unknown
                  </option>
                </select>
              </label>
            </div>

            <label className="block text-sm">
              Academic year
              <input
                value={form.academicYear}
                onChange={(e) =>
                  setForm({
                    ...form,
                    academicYear: e.target.value,
                  })
                }
                className="mt-1 w-full rounded border p-2 dark:bg-zinc-800"
              />
            </label>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setSelected(null)}
              >
                Cancel
              </Button>

              <Button
                onClick={save}
                disabled={resolve.isPending}
              >
                <Save className="mr-1 h-4 w-4" />
                Save and re-check
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function SubjectsTab({
  page,
  setPage,
  search,
  setSearch,
  showToast,
}: any) {
  const [levelFilter, setLevelFilter] = useState("");

  const { data, isLoading } = useAdminSubjects(
    page,
    50,
    search || undefined,
    levelFilter || undefined,
  );

  const createMutation = useCreateSubject();
  const updateMutation = useUpdateSubject();
  const deleteMutation = useDeleteSubject();

  const [modal, setModal] = useState<{
    mode: ModalMode;
    item?: any;
  }>({ mode: null });

  const [form, setForm] = useState({
    name: "",
    code: "",
    level: "O_LEVEL",
  });

  const subjects = useMemo(() => {
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data)) return data;
    return [];
  }, [data]);

  const totalPages = data?.totalPages || 1;

  const openCreate = () => {
    setForm({
      name: "",
      code: "",
      level: "O_LEVEL",
    });

    setModal({ mode: "create" });
  };

  const openEdit = (item: any) => {
    setForm({
      name: item.name,
      code: item.code || "",
      level: item.level,
    });

    setModal({ mode: "edit", item });
  };

  const handleSubmit = async () => {
    try {
      if (modal.mode === "create") {
        await createMutation.mutateAsync(form);
        showToast("success", "Subject created");
      } else if (modal.mode === "edit" && modal.item) {
        await updateMutation.mutateAsync({
          id: modal.item.id,
          input: form,
        });
        showToast("success", "Subject updated");
      }

      setModal({ mode: null });
    } catch (err: any) {
      showToast("error", err.message);
    }
  };

  const handleDelete = async (item: any) => {
    if (!confirm(`Delete "${item.name}"?`)) return;

    try {
      await deleteMutation.mutateAsync(item.id);
      showToast("success", "Subject deleted");
    } catch (err: any) {
      showToast("error", err.message);
    }
  };

  return (
    <>
      <div className="mb-4 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />

          <input
            type="text"
            placeholder="Search subjects..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-10 pr-4 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
          />
        </div>

        <select
          value={levelFilter}
          onChange={(e) => {
            setLevelFilter(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
        >
          <option value="">All Levels</option>
          <option value="O_LEVEL">O Level</option>
          <option value="A_LEVEL">A Level</option>
        </select>

        <Button onClick={openCreate} className="gap-1">
          <Plus className="h-4 w-4" />
          Add Subject
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800">
                  <th className="px-4 pb-3 pt-4 text-left font-medium text-zinc-500">
                    Name
                  </th>
                  <th className="px-4 pb-3 pt-4 text-left font-medium text-zinc-500">
                    Code
                  </th>
                  <th className="px-4 pb-3 pt-4 text-left font-medium text-zinc-500">
                    Level
                  </th>
                  <th className="px-4 pb-3 pt-4 text-left font-medium text-zinc-500">
                    Requirements
                  </th>
                  <th className="px-4 pb-3 pt-4 text-left font-medium text-zinc-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {isLoading ? (
                  [1, 2, 3, 4, 5].map((i) => (
                    <TableRowSkeleton key={i} cols={5} />
                  ))
                ) : subjects.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-12 text-center text-zinc-500"
                    >
                      No subjects found
                    </td>
                  </tr>
                ) : (
                  subjects.map((subj: any) => (
                    <tr
                      key={subj.id}
                      className="border-b border-zinc-100 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/50"
                    >
                      <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-50">
                        {subj.name}
                      </td>

                      <td className="px-4 py-3 text-zinc-500">
                        {subj.code || "-"}
                      </td>

                      <td className="px-4 py-3">
                        <Badge
                          variant={
                            subj.level === "O_LEVEL"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {subj.level.replace("_", " ")}
                        </Badge>
                      </td>

                      <td className="px-4 py-3 text-zinc-500">
                        {subj._count?.requirements ?? 0}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEdit(subj)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(subj)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-zinc-200 px-4 py-3 dark:border-zinc-800">
              <span className="text-sm text-zinc-500">
                Page {page} of {totalPages}
              </span>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {modal.mode && (
        <Modal
          title={
            modal.mode === "create"
              ? "Create Subject"
              : "Edit Subject"
          }
          onClose={() => setModal({ mode: null })}
        >
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Name *
              </label>

              <input
                type="text"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Code
              </label>

              <input
                type="text"
                value={form.code}
                onChange={(e) =>
                  setForm({
                    ...form,
                    code: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Level *
              </label>

              <select
                value={form.level}
                onChange={(e) =>
                  setForm({
                    ...form,
                    level: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
              >
                <option value="O_LEVEL">O Level</option>
                <option value="A_LEVEL">A Level</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setModal({ mode: null })}
              >
                Cancel
              </Button>

              <Button onClick={handleSubmit}>
                <Save className="mr-1 h-4 w-4" />
                {modal.mode === "create"
                  ? "Create"
                  : "Save"}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

function UsersTab({
  page,
  setPage,
  search,
  setSearch,
  showToast,
}: any) {
  const { data, isLoading } = useAdminUsers(
    page,
    20,
    search || undefined,
  );

  const updateRole = useUpdateUserRole();
  const toggleActive = useToggleUserActive();

  const users = useMemo(() => {
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data)) return data;
    return [];
  }, [data]);

  const totalPages = data?.totalPages || 1;

  const handleRoleChange = async (
    userId: string,
    role: string,
  ) => {
    try {
      await updateRole.mutateAsync({
        id: userId,
        role,
      });

      showToast("success", "Role updated");
    } catch (err: any) {
      showToast("error", err.message);
    }
  };

  const handleToggleActive = async (
    userId: string,
  ) => {
    try {
      await toggleActive.mutateAsync(userId);
      showToast("success", "User status toggled");
    } catch (err: any) {
      showToast("error", err.message);
    }
  };

  return (
    <>
      <div className="mb-4 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />

          <input
            type="text"
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-10 pr-4 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800">
                  <th className="px-4 pb-3 pt-4 text-left font-medium text-zinc-500">
                    Name
                  </th>
                  <th className="px-4 pb-3 pt-4 text-left font-medium text-zinc-500">
                    Email
                  </th>
                  <th className="px-4 pb-3 pt-4 text-left font-medium text-zinc-500">
                    Role
                  </th>
                  <th className="px-4 pb-3 pt-4 text-left font-medium text-zinc-500">
                    Status
                  </th>
                  <th className="px-4 pb-3 pt-4 text-left font-medium text-zinc-500">
                    Saved
                  </th>
                  <th className="px-4 pb-3 pt-4 text-left font-medium text-zinc-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {isLoading ? (
                  [1, 2, 3, 4, 5].map((i) => (
                    <TableRowSkeleton key={i} cols={6} />
                  ))
                ) : users.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-12 text-center text-zinc-500"
                    >
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user: any) => (
                    <tr
                      key={user.id}
                      className="border-b border-zinc-100 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/50"
                    >
                      <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-50">
                        {user.firstName} {user.lastName}
                      </td>

                      <td className="px-4 py-3 text-zinc-500">
                        {user.email}
                      </td>

                      <td className="px-4 py-3">
                        <select
                          value={user.role}
                          onChange={(e) =>
                            handleRoleChange(
                              user.id,
                              e.target.value,
                            )
                          }
                          className="rounded border border-zinc-200 px-2 py-1 text-xs dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                        >
                          {[
                            "VISITOR",
                            "STUDENT",
                            "ADMIN",
                          ].map((r) => (
                            <option
                              key={r}
                              value={r}
                            >
                              {r}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="px-4 py-3">
                        <Badge
                          variant={
                            user.isActive
                              ? "success"
                              : "secondary"
                          }
                        >
                          {user.isActive
                            ? "Active"
                            : "Inactive"}
                        </Badge>
                      </td>

                      <td className="px-4 py-3 text-zinc-500">
                        {user._count?.savedProgrammes ?? 0}
                      </td>

                      <td className="px-4 py-3">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleToggleActive(
                              user.id,
                            )
                          }
                          title="Toggle active"
                        >
                          {user.isActive ? (
                            <ToggleRight className="h-4 w-4 text-green-500" />
                          ) : (
                            <ToggleLeft className="h-4 w-4 text-red-500" />
                          )}
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-zinc-200 px-4 py-3 dark:border-zinc-800">
              <span className="text-sm text-zinc-500">
                Page {page} of {totalPages}
              </span>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}

function TuitionTab({
  page,
  setPage,
  showToast,
}: any) {
  const { data, isLoading } = useAdminTuition(
    page,
    50,
  );

  const createMutation = useCreateTuition();
  const updateMutation = useUpdateTuition();
  const deleteMutation = useDeleteTuition();

  const [modal, setModal] = useState<{
    mode: ModalMode;
    item?: any;
  }>({ mode: null });

  const [form, setForm] = useState({
    programmeCode: "",
    academicYear:
      new Date().getFullYear().toString(),
    amount: 0,
    currency: "XAF",
  });

  const items = useMemo(() => {
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data)) return data;
    return [];
  }, [data]);

  const openCreate = () => {
    setForm({
      programmeCode: "",
      academicYear:
        new Date().getFullYear().toString(),
      amount: 0,
      currency: "XAF",
    });

    setModal({ mode: "create" });
  };

  const openEdit = (item: any) => {
    setForm({
      programmeCode:
        item.programme?.code || "",
      academicYear: item.academicYear,
      amount: Number(item.amount),
      currency: item.currency,
    });

    setModal({ mode: "edit", item });
  };

  const handleSubmit = async () => {
    try {
      if (modal.mode === "create") {
        await createMutation.mutateAsync(
          form as any,
        );
        showToast(
          "success",
          "Tuition record created",
        );
      } else if (
        modal.mode === "edit" &&
        modal.item
      ) {
        await updateMutation.mutateAsync({
          id: modal.item.id,
          input: form,
        });
        showToast(
          "success",
          "Tuition updated",
        );
      }

      setModal({ mode: null });
    } catch (err: any) {
      showToast("error", err.message);
    }
  };

  const handleDelete = async (item: any) => {
    if (
      !confirm("Delete this tuition record?")
    )
      return;

    try {
      await deleteMutation.mutateAsync(
        item.id,
      );
      showToast(
        "success",
        "Tuition record deleted",
      );
    } catch (err: any) {
      showToast("error", err.message);
    }
  };

  return (
    <>
      <div className="mb-4 flex items-center gap-3">
        <p className="text-sm text-zinc-500">
          Manage tuition fees per programme and academic year.
        </p>

        <Button
          onClick={openCreate}
          className="ml-auto gap-1"
        >
          <Plus className="h-4 w-4" />
          Add Tuition
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800">
                  <th className="px-4 pb-3 pt-4 text-left font-medium text-zinc-500">
                    Programme
                  </th>
                  <th className="px-4 pb-3 pt-4 text-left font-medium text-zinc-500">
                    Code
                  </th>
                  <th className="px-4 pb-3 pt-4 text-left font-medium text-zinc-500">
                    Academic Year
                  </th>
                  <th className="px-4 pb-3 pt-4 text-left font-medium text-zinc-500">
                    Amount
                  </th>
                  <th className="px-4 pb-3 pt-4 text-left font-medium text-zinc-500">
                    Currency
                  </th>
                  <th className="px-4 pb-3 pt-4 text-left font-medium text-zinc-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {isLoading ? (
                  [1, 2, 3].map((i) => (
                    <TableRowSkeleton
                      key={i}
                      cols={6}
                    />
                  ))
                ) : items.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-12 text-center text-zinc-500"
                    >
                      No tuition records found
                    </td>
                  </tr>
                ) : (
                  items.map((item: any) => (
                    <tr
                      key={item.id}
                      className="border-b border-zinc-100 dark:border-zinc-800"
                    >
                      <td className="px-4 py-3 text-zinc-900 dark:text-zinc-50">
                        {item.programme?.name ||
                          "Unknown"}
                      </td>

                      <td className="px-4 py-3 font-mono text-zinc-500">
                        {item.programme?.code ||
                          "-"}
                      </td>

                      <td className="px-4 py-3 text-zinc-600">
                        {item.academicYear}
                      </td>

                      <td className="px-4 py-3 font-medium">
                        {Number(
                          item.amount,
                        ).toLocaleString()}
                      </td>

                      <td className="px-4 py-3">
                        <Badge variant="outline">
                          {item.currency}
                        </Badge>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              openEdit(item)
                            }
                          >
                            <Edit className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              handleDelete(item)
                            }
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {modal.mode && (
        <Modal
          title={
            modal.mode === "create"
              ? "Add Tuition"
              : "Edit Tuition"
          }
          onClose={() =>
            setModal({ mode: null })
          }
        >
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Programme Code *
              </label>

              <input
                type="text"
                value={form.programmeCode}
                onChange={(e) =>
                  setForm({
                    ...form,
                    programmeCode:
                      e.target.value,
                  })
                }
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Academic Year
                </label>

                <input
                  type="text"
                  value={form.academicYear}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      academicYear:
                        e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Currency
                </label>

                <select
                  value={form.currency}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      currency:
                        e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                >
                  <option value="XAF">
                    XAF
                  </option>
                  <option value="USD">
                    USD
                  </option>
                  <option value="EUR">
                    EUR
                  </option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Amount *
              </label>

              <input
                type="number"
                value={form.amount}
                onChange={(e) =>
                  setForm({
                    ...form,
                    amount:
                      parseFloat(
                        e.target.value,
                      ) || 0,
                  })
                }
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() =>
                  setModal({ mode: null })
                }
              >
                Cancel
              </Button>

              <Button onClick={handleSubmit}>
                <Save className="mr-1 h-4 w-4" />
                {modal.mode === "create"
                  ? "Add"
                  : "Save"}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

function CareersTab({
  page,
  setPage,
  search,
  setSearch,
  showToast,
}: any) {
  const { data, isLoading } = useAdminCareers(
    page,
    50,
    search || undefined,
  );

  const createMutation = useCreateCareer();
  const updateMutation = useUpdateCareer();
  const deleteMutation = useDeleteCareer();

  const [modal, setModal] = useState<{
    mode: ModalMode;
    item?: any;
  }>({ mode: null });

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const items = useMemo(() => {
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data)) return data;
    return [];
  }, [data]);

  const openCreate = () => {
    setForm({
      name: "",
      description: "",
    });

    setModal({ mode: "create" });
  };

  const openEdit = (item: any) => {
    setForm({
      name: item.name,
      description:
        item.description || "",
    });

    setModal({ mode: "edit", item });
  };

  const handleSubmit = async () => {
    try {
      if (modal.mode === "create") {
        await createMutation.mutateAsync(form);
        showToast(
          "success",
          "Career created",
        );
      } else if (
        modal.mode === "edit" &&
        modal.item
      ) {
        await updateMutation.mutateAsync({
          id: modal.item.id,
          input: form,
        });

        showToast(
          "success",
          "Career updated",
        );
      }

      setModal({ mode: null });
    } catch (err: any) {
      showToast("error", err.message);
    }
  };

  const handleDelete = async (item: any) => {
    if (
      !confirm(
        `Delete career "${item.name}"?`,
      )
    )
      return;

    try {
      await deleteMutation.mutateAsync(
        item.id,
      );

      showToast(
        "success",
        "Career deleted",
      );
    } catch (err: any) {
      showToast("error", err.message);
    }
  };

  return (
    <>
      <div className="mb-4 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />

          <input
            type="text"
            placeholder="Search careers..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-10 pr-4 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
          />
        </div>

        <Button
          onClick={openCreate}
          className="gap-1"
        >
          <Plus className="h-4 w-4" />
          Add Career
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800">
                  <th className="px-4 pb-3 pt-4 text-left font-medium text-zinc-500">
                    Name
                  </th>
                  <th className="px-4 pb-3 pt-4 text-left font-medium text-zinc-500">
                    Description
                  </th>
                  <th className="px-4 pb-3 pt-4 text-left font-medium text-zinc-500">
                    Programmes
                  </th>
                  <th className="px-4 pb-3 pt-4 text-left font-medium text-zinc-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {isLoading ? (
                  [1, 2, 3].map((i) => (
                    <TableRowSkeleton
                      key={i}
                      cols={4}
                    />
                  ))
                ) : items.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-12 text-center text-zinc-500"
                    >
                      No careers found
                    </td>
                  </tr>
                ) : (
                  items.map((item: any) => (
                    <tr
                      key={item.id}
                      className="border-b border-zinc-100 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/50"
                    >
                      <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-50">
                        {item.name}
                      </td>

                      <td className="px-4 py-3 text-zinc-500">
                        {item.description ||
                          "-"}
                      </td>

                      <td className="px-4 py-3">
                        <Badge variant="outline">
                          {item._count
                            ?.programmes ??
                            0}
                        </Badge>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              openEdit(item)
                            }
                          >
                            <Edit className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              handleDelete(item)
                            }
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {modal.mode && (
        <Modal
          title={
            modal.mode === "create"
              ? "Create Career"
              : "Edit Career"
          }
          onClose={() =>
            setModal({ mode: null })
          }
        >
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Name *
              </label>

              <input
                type="text"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Description
              </label>

              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description:
                      e.target.value,
                  })
                }
                rows={3}
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() =>
                  setModal({ mode: null })
                }
              >
                Cancel
              </Button>

              <Button onClick={handleSubmit}>
                <Save className="mr-1 h-4 w-4" />
                {modal.mode === "create"
                  ? "Create"
                  : "Save"}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

function KeywordsTab({
  page,
  setPage,
  search,
  setSearch,
  showToast,
}: any) {
  const { data, isLoading } = useAdminKeywords(
    page,
    50,
    search || undefined,
  );

  const createMutation = useCreateKeyword();
  const deleteMutation = useDeleteKeyword();

  const [word, setWord] = useState("");

  const items = useMemo(() => {
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data)) return data;
    return [];
  }, [data]);

  const handleCreate = async () => {
    if (!word.trim()) return;

    try {
      await createMutation.mutateAsync({
        word: word.trim(),
      });

      showToast(
        "success",
        "Keyword created",
      );

      setWord("");
    } catch (err: any) {
      showToast("error", err.message);
    }
  };

  const handleDelete = async (item: any) => {
    if (
      !confirm(
        `Delete keyword "${item.word}"?`,
      )
    )
      return;

    try {
      await deleteMutation.mutateAsync(
        item.id,
      );

      showToast(
        "success",
        "Keyword deleted",
      );
    } catch (err: any) {
      showToast("error", err.message);
    }
  };

  return (
    <>
      <div className="mb-4 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />

          <input
            type="text"
            placeholder="Search keywords..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-10 pr-4 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
          />
        </div>

        <input
          type="text"
          placeholder="New keyword..."
          value={word}
          onChange={(e) =>
            setWord(e.target.value)
          }
          className="rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
        />

        <Button
          onClick={handleCreate}
          className="gap-1"
        >
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800">
                  <th className="px-4 pb-3 pt-4 text-left font-medium text-zinc-500">
                    Word
                  </th>
                  <th className="px-4 pb-3 pt-4 text-left font-medium text-zinc-500">
                    Programmes
                  </th>
                  <th className="px-4 pb-3 pt-4 text-left font-medium text-zinc-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {isLoading ? (
                  [1, 2, 3].map((i) => (
                    <TableRowSkeleton
                      key={i}
                      cols={3}
                    />
                  ))
                ) : items.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="py-12 text-center text-zinc-500"
                    >
                      No keywords found
                    </td>
                  </tr>
                ) : (
                  items.map((item: any) => (
                    <tr
                      key={item.id}
                      className="border-b border-zinc-100 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/50"
                    >
                      <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-50">
                        {item.word}
                      </td>

                      <td className="px-4 py-3">
                        <Badge variant="outline">
                          {item._count
                            ?.programmes ??
                            0}
                        </Badge>
                      </td>

                      <td className="px-4 py-3">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleDelete(item)
                          }
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

function AdmissionRulesTab({
  page,
  setPage,
  showToast,
}: any) {
  const { data, isLoading } =
    useAdminAdmissionRules(page, 50);

  const createMutation =
    useCreateAdmissionRule();

  const updateMutation =
    useUpdateAdmissionRule();

  const deleteMutation =
    useDeleteAdmissionRule();

  const [modal, setModal] = useState<{
    mode: ModalMode;
    item?: any;
  }>({ mode: null });

  const [form, setForm] = useState({
    title: "",
    description: "",
    isActive: true,
  });

  const items = useMemo(() => {
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data)) return data;
    return [];
  }, [data]);

  const openCreate = () => {
    setForm({
      title: "",
      description: "",
      isActive: true,
    });

    setModal({ mode: "create" });
  };

  const openEdit = (item: any) => {
    setForm({
      title: item.title,
      description: item.description,
      isActive: item.isActive,
    });

    setModal({ mode: "edit", item });
  };

  const handleSubmit = async () => {
    try {
      if (modal.mode === "create") {
        await createMutation.mutateAsync(form);
        showToast(
          "success",
          "Admission rule created",
        );
      } else if (
        modal.mode === "edit" &&
        modal.item
      ) {
        await updateMutation.mutateAsync({
          id: modal.item.id,
          input: form,
        });

        showToast(
          "success",
          "Admission rule updated",
        );
      }

      setModal({ mode: null });
    } catch (err: any) {
      showToast("error", err.message);
    }
  };

  const handleDelete = async (item: any) => {
    if (
      !confirm(
        "Delete this admission rule?",
      )
    )
      return;

    try {
      await deleteMutation.mutateAsync(
        item.id,
      );

      showToast(
        "success",
        "Admission rule deleted",
      );
    } catch (err: any) {
      showToast("error", err.message);
    }
  };

  return (
    <>
      <div className="mb-4 flex items-center gap-3">
        <p className="text-sm text-zinc-500">
          Manage general admission rules for the university.
        </p>

        <Button
          onClick={openCreate}
          className="ml-auto gap-1"
        >
          <Plus className="h-4 w-4" />
          Add Rule
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800">
                  <th className="px-4 pb-3 pt-4 text-left font-medium text-zinc-500">
                    Title
                  </th>
                  <th className="px-4 pb-3 pt-4 text-left font-medium text-zinc-500">
                    Description
                  </th>
                  <th className="px-4 pb-3 pt-4 text-left font-medium text-zinc-500">
                    Status
                  </th>
                  <th className="px-4 pb-3 pt-4 text-left font-medium text-zinc-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {isLoading ? (
                  [1, 2, 3].map((i) => (
                    <TableRowSkeleton
                      key={i}
                      cols={4}
                    />
                  ))
                ) : items.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-12 text-center text-zinc-500"
                    >
                      No admission rules
                    </td>
                  </tr>
                ) : (
                  items.map((item: any) => (
                    <tr
                      key={item.id}
                      className="border-b border-zinc-100 dark:border-zinc-800"
                    >
                      <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-50">
                        {item.title}
                      </td>

                      <td className="max-w-md truncate px-4 py-3 text-zinc-500">
                        {item.description}
                      </td>

                      <td className="px-4 py-3">
                        <Badge
                          variant={
                            item.isActive
                              ? "success"
                              : "secondary"
                          }
                        >
                          {item.isActive
                            ? "Active"
                            : "Inactive"}
                        </Badge>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              openEdit(item)
                            }
                          >
                            <Edit className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              handleDelete(item)
                            }
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {modal.mode && (
        <Modal
          title={
            modal.mode === "create"
              ? "Add Admission Rule"
              : "Edit Admission Rule"
          }
          onClose={() =>
            setModal({ mode: null })
          }
        >
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Title *
              </label>

              <input
                type="text"
                value={form.title}
                onChange={(e) =>
                  setForm({
                    ...form,
                    title: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Description *
              </label>

              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description:
                      e.target.value,
                  })
                }
                rows={4}
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) =>
                  setForm({
                    ...form,
                    isActive:
                      e.target.checked,
                  })
                }
                id="isActive"
              />

              <label
                htmlFor="isActive"
                className="text-sm"
              >
                Active
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() =>
                  setModal({ mode: null })
                }
              >
                Cancel
              </Button>

              <Button onClick={handleSubmit}>
                <Save className="mr-1 h-4 w-4" />
                {modal.mode === "create"
                  ? "Create"
                  : "Save"}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

function RequirementsTab({
  showToast,
}: any) {
  const [selectedProgrammeId, setSelectedProgrammeId] =
    useState("");

  const { data: programmesData } =
    useAdminProgrammes(1, 200);

  const { data: subjectsData } =
    useAdminSubjects(1, 200);

  const {
    data: reqsData,
    isLoading: reqsLoading,
  } = useProgrammeRequirements(
    selectedProgrammeId || null,
  );

  const createMutation =
    useCreateProgrammeRequirement();

  const updateMutation =
    useUpdateProgrammeRequirement();

  const deleteMutation =
    useDeleteProgrammeRequirement();

  const programmes = useMemo(() => {
    const d =
      programmesData?.data ||
      programmesData;

    return Array.isArray(d) ? d : [];
  }, [programmesData]);

  const subjects = useMemo(() => {
    const d =
      subjectsData?.data ||
      subjectsData;

    return Array.isArray(d) ? d : [];
  }, [subjectsData]);

  const requirements = useMemo(() => {
    const d =
      reqsData?.data?.requirements ||
      [];

    return Array.isArray(d) ? d : [];
  }, [reqsData]);

  const [modal, setModal] = useState<{
    mode: ModalMode;
    item?: any;
  }>({ mode: null });

  const [form, setForm] = useState({
    subjectId: "",
    requirementType: "REQUIRED",
    minimumGrade: "",
  });

  const openCreate = () => {
    if (!selectedProgrammeId) {
      showToast(
        "error",
        "Select a programme first",
      );
      return;
    }

    setForm({
      subjectId: "",
      requirementType: "REQUIRED",
      minimumGrade: "",
    });

    setModal({ mode: "create" });
  };

  const openEdit = (item: any) => {
    setForm({
      subjectId: item.subjectId,
      requirementType:
        item.requirementType,
      minimumGrade:
        item.minimumGrade || "",
    });

    setModal({ mode: "edit", item });
  };

  const handleSubmit = async () => {
    try {
      if (modal.mode === "create") {
        await createMutation.mutateAsync({
          programmeId:
            selectedProgrammeId,
          input: form,
        });

        showToast(
          "success",
          "Requirement added",
        );
      } else if (
        modal.mode === "edit" &&
        modal.item
      ) {
        await updateMutation.mutateAsync({
          id: modal.item.id,
          input: {
            requirementType:
              form.requirementType,
            minimumGrade:
              form.minimumGrade,
          },
        });

        showToast(
          "success",
          "Requirement updated",
        );
      }

      setModal({ mode: null });
    } catch (err: any) {
      showToast("error", err.message);
    }
  };

  const handleDelete = async (item: any) => {
    if (
      !confirm(
        "Remove this requirement?",
      )
    )
      return;

    try {
      await deleteMutation.mutateAsync(
        item.id,
      );

      showToast(
        "success",
        "Requirement removed",
      );
    } catch (err: any) {
      showToast("error", err.message);
    }
  };

  return (
    <>
      <div className="mb-4 flex items-center gap-3">
        <div className="relative flex-1">
          <select
            value={selectedProgrammeId}
            onChange={(e) =>
              setSelectedProgrammeId(
                e.target.value,
              )
            }
            className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
          >
            <option value="">
              Select a programme...
            </option>

            {programmes.map((p: any) => (
              <option
                key={p.id}
                value={p.id}
              >
                {p.code} - {p.name}
              </option>
            ))}
          </select>
        </div>

        <Button
          onClick={openCreate}
          className="gap-1"
          disabled={!selectedProgrammeId}
        >
          <Plus className="h-4 w-4" />
          Add Requirement
        </Button>
      </div>

      {selectedProgrammeId && (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800">
                    <th className="px-4 pb-3 pt-4 text-left font-medium text-zinc-500">
                      Subject
                    </th>
                    <th className="px-4 pb-3 pt-4 text-left font-medium text-zinc-500">
                      Level
                    </th>
                    <th className="px-4 pb-3 pt-4 text-left font-medium text-zinc-500">
                      Type
                    </th>
                    <th className="px-4 pb-3 pt-4 text-left font-medium text-zinc-500">
                      Min Grade
                    </th>
                    <th className="px-4 pb-3 pt-4 text-left font-medium text-zinc-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {reqsLoading ? (
                    [1, 2, 3].map((i) => (
                      <TableRowSkeleton
                        key={i}
                        cols={5}
                      />
                    ))
                  ) : requirements.length ===
                    0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-12 text-center text-zinc-500"
                      >
                        No requirements for this programme
                      </td>
                    </tr>
                  ) : (
                    requirements.map(
                      (req: any) => (
                        <tr
                          key={req.id}
                          className="border-b border-zinc-100 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/50"
                        >
                          <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-50">
                            {req.subject?.name}
                          </td>

                          <td className="px-4 py-3">
                            <Badge variant="outline">
                              {req.subject?.level?.replace(
                                "_",
                                " ",
                              )}
                            </Badge>
                          </td>

                          <td className="px-4 py-3">
                            <Badge
                              variant={
                                req.requirementType ===
                                "REQUIRED"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {
                                req.requirementType
                              }
                            </Badge>
                          </td>

                          <td className="px-4 py-3 text-zinc-600">
                            {req.minimumGrade ||
                              "-"}
                          </td>

                          <td className="px-4 py-3">
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  openEdit(
                                    req,
                                  )
                                }
                              >
                                <Edit className="h-4 w-4" />
                              </Button>

                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  handleDelete(
                                    req,
                                  )
                                }
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ),
                    )
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {!selectedProgrammeId && (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <BookOpen className="mr-2 h-5 w-5 text-zinc-400" />

            <p className="text-zinc-500">
              Select a programme to manage its admission requirements
            </p>
          </CardContent>
        </Card>
      )}

      {modal.mode && (
        <Modal
          title={
            modal.mode === "create"
              ? "Add Requirement"
              : "Edit Requirement"
          }
          onClose={() =>
            setModal({ mode: null })
          }
        >
          <div className="space-y-4">
            {modal.mode === "create" && (
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Subject *
                </label>

                <select
                  value={form.subjectId}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      subjectId:
                        e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                >
                  <option value="">
                    Select subject...
                  </option>

                  {subjects.map(
                    (s: any) => (
                      <option
                        key={s.id}
                        value={s.id}
                      >
                        {s.name} (
                        {s.level.replace(
                          "_",
                          " ",
                        )}
                        )
                      </option>
                    ),
                  )}
                </select>
              </div>
            )}

            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Requirement Type
              </label>

              <select
                value={
                  form.requirementType
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    requirementType:
                      e.target.value,
                  })
                }
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
              >
                <option value="REQUIRED">
                  Required
                </option>
                <option value="OPTIONAL">
                  Optional
                </option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Minimum Grade
              </label>

              <input
                type="text"
                value={form.minimumGrade}
                onChange={(e) =>
                  setForm({
                    ...form,
                    minimumGrade:
                      e.target.value,
                  })
                }
                placeholder="e.g. C6, D, etc."
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() =>
                  setModal({ mode: null })
                }
              >
                Cancel
              </Button>

              <Button onClick={handleSubmit}>
                <Save className="mr-1 h-4 w-4" />
                {modal.mode === "create"
                  ? "Add"
                  : "Save"}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

function ImportTab({
  showToast,
}: any) {
  const [importType, setImportType] =
    useState("faculties");

  const [jsonInput, setJsonInput] =
    useState("");

  const [step, setStep] = useState<
    "input" | "preview" | "result"
  >("input");

  const [
    validationResult,
    setValidationResult,
  ] = useState<any>(null);

  const [
    importResult,
    setImportResult,
  ] = useState<any>(null);

  const [loading, setLoading] =
    useState(false);

  const validateMutation =
    useImportValidate();

  const confirmMutation =
    useImportConfirm();

  const importTypes = [
    {
      value: "faculties",
      label: "Faculties",
    },
    {
      value: "departments",
      label: "Departments",
    },
    {
      value: "programmes",
      label: "Programmes",
    },
    {
      value: "subjects",
      label: "Subjects",
    },
    {
      value: "requirements",
      label: "Requirements",
    },
    {
      value: "tuition",
      label: "Tuition",
    },
    {
      value: "careers",
      label: "Careers",
    },
  ];

  const parsedData = useMemo(() => {
    try {
      const p = JSON.parse(
        jsonInput,
      );

      return Array.isArray(p)
        ? p
        : [];
    } catch {
      return [];
    }
  }, [jsonInput]);

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file =
      e.target.files?.[0];

    if (!file) return;

    const reader =
      new FileReader();

    reader.onload = (event) => {
      try {
        const text =
          event.target
            ?.result as string;

        const parsed =
          JSON.parse(text);

        setJsonInput(
          JSON.stringify(
            Array.isArray(parsed)
              ? parsed
              : [parsed],
            null,
            2,
          ),
        );
      } catch {
        showToast(
          "error",
          "Invalid JSON file",
        );
      }
    };

    reader.readAsText(file);
  };

  const handleValidate = async () => {
    if (!jsonInput.trim()) {
      showToast(
        "error",
        "Please enter JSON data",
      );
      return;
    }

    if (parsedData.length === 0) {
      showToast(
        "error",
        "No valid JSON array found",
      );
      return;
    }

    setLoading(true);

    try {
      const res =
        await validateMutation.mutateAsync(
          {
            type: importType,
            data: parsedData,
          },
        );

      setValidationResult(
        res.data || res,
      );

      setStep("preview");
    } catch (err: any) {
      showToast(
        "error",
        err.message,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    setLoading(true);

    try {
      const res =
        await confirmMutation.mutateAsync(
          {
            type: importType,
            data: parsedData,
          },
        );

      setImportResult(
        res.data || res,
      );

      setStep("result");

      showToast(
        "success",
        "Import completed",
      );
    } catch (err: any) {
      showToast(
        "error",
        err.message,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setJsonInput("");
    setStep("input");
    setValidationResult(null);
    setImportResult(null);
  };

  return (
    <>
      <div className="mb-4 flex items-center gap-3">
        <select
          value={importType}
          onChange={(e) => {
            setImportType(
              e.target.value,
            );
            setStep("input");
            setValidationResult(null);
            setImportResult(null);
          }}
          className="rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
        >
          {importTypes.map((t) => (
            <option
              key={t.value}
              value={t.value}
            >
              {t.label}
            </option>
          ))}
        </select>

        <label className="cursor-pointer rounded-lg border border-zinc-200 px-3 py-2 text-sm hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800">
          <Upload className="mr-1 inline h-4 w-4" />
          Upload JSON

          <input
            type="file"
            accept=".json"
            onChange={
              handleFileUpload
            }
            className="hidden"
          />
        </label>

        <Button
          onClick={handleValidate}
          disabled={
            loading ||
            !jsonInput.trim()
          }
          className="ml-auto gap-1"
        >
          {loading ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <CheckCircle className="h-4 w-4" />
          )}
          Validate
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          {step === "input" && (
            <>
              <p className="mb-2 text-sm text-zinc-500">
                Paste JSON array data for{" "}
                {
                  importTypes.find(
                    (t) =>
                      t.value ===
                      importType,
                  )?.label
                }
                :
              </p>

              <textarea
                value={jsonInput}
                onChange={(e) =>
                  setJsonInput(
                    e.target.value,
                  )
                }
                rows={10}
                placeholder={`[
  { "name": "Example", ... },
  { "name": "Example 2", ... }
]`}
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 font-mono text-xs dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
              />

              <p className="mt-1 text-xs text-zinc-400">
                {parsedData.length} rows
                parsed
              </p>
            </>
          )}

          {step === "preview" &&
            validationResult && (
              <>
                <div className="mb-3 flex items-center gap-3">
                  <Badge
                    variant={
                      validationResult.valid
                        ? "success"
                        : "secondary"
                    }
                  >
                    {validationResult.valid
                      ? "Valid"
                      : "Has Errors"}
                  </Badge>

                  <span className="text-sm text-zinc-500">
                    {
                      validationResult.validRows
                    }
                    /
                    {
                      validationResult.totalRows
                    }{" "}
                    valid rows
                  </span>

                  {validationResult.errorRows >
                    0 && (
                    <span className="text-sm text-red-500">
                      {
                        validationResult.errorRows
                      }{" "}
                      error(s)
                    </span>
                  )}
                </div>

                {validationResult.errors
                  ?.length > 0 && (
                  <div className="mb-3 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900 dark:bg-red-900/20">
                    <p className="mb-1 text-sm font-medium text-red-700 dark:text-red-400">
                      Errors:
                    </p>

                    {validationResult.errors
                      .slice(0, 10)
                      .map(
                        (
                          err: any,
                          i: number,
                        ) => (
                          <p
                            key={i}
                            className="text-xs text-red-600 dark:text-red-300"
                          >
                            Row{" "}
                            {err.row}:{" "}
                            {
                              err.field
                            }{" "}
                            -{" "}
                            {
                              err.message
                            }
                          </p>
                        ),
                      )}
                  </div>
                )}

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-zinc-200 dark:border-zinc-800">
                        {validationResult.preview?.[0] &&
                          Object.keys(
                            validationResult
                              .preview[0],
                          )
                            .filter(
                              (k) =>
                                !k.startsWith(
                                  "_",
                                ),
                            )
                            .map(
                              (
                                key: string,
                              ) => (
                                <th
                                  key={key}
                                  className="px-3 pb-2 pt-1 text-left font-medium text-zinc-500"
                                >
                                  {key}
                                </th>
                              ),
                            )}
                      </tr>
                    </thead>

                    <tbody>
                      {validationResult.preview
                        ?.slice(0, 20)
                        .map(
                          (
                            row: any,
                            i: number,
                          ) => (
                            <tr
                              key={i}
                              className={`border-b border-zinc-100 dark:border-zinc-800 ${
                                !row._valid
                                  ? "bg-red-50 dark:bg-red-900/10"
                                  : ""
                              }`}
                            >
                              {Object.entries(
                                row,
                              )
                                .filter(
                                  ([k]) =>
                                    !k.startsWith(
                                      "_",
                                    ),
                                )
                                .map(
                                  (
                                    [
                                      ,
                                      val,
                                    ]: any,
                                    j,
                                  ) => (
                                    <td
                                      key={j}
                                      className="px-3 py-2 text-xs text-zinc-700 dark:text-zinc-300"
                                    >
                                      {typeof val ===
                                      "object"
                                        ? JSON.stringify(
                                            val,
                                          )
                                        : String(
                                            val ??
                                              "",
                                          )}
                                    </td>
                                  ),
                                )}
                            </tr>
                          ),
                        )}
                    </tbody>
                  </table>

                  {validationResult.preview
                    ?.length > 20 && (
                    <p className="py-2 text-center text-xs text-zinc-400">
                      Showing 20 of{" "}
                      {
                        validationResult
                          .preview
                          .length
                      }{" "}
                      rows
                    </p>
                  )}
                </div>

                <div className="mt-4 flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={
                      handleReset
                    }
                  >
                    Cancel
                  </Button>

                  <Button
                    onClick={
                      handleImport
                    }
                    disabled={
                      loading ||
                      !validationResult.valid
                    }
                  >
                    {loading ? (
                      <RefreshCw className="mr-1 h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="mr-1 h-4 w-4" />
                    )}
                    Confirm Import (
                    {
                      validationResult.validRows
                    }{" "}
                    rows)
                  </Button>
                </div>
              </>
            )}

          {step === "result" &&
            importResult && (
              <div className="py-4 text-center">
                <CheckCircle className="mx-auto h-12 w-12 text-green-500" />

                <h3 className="mt-3 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  {importResult.message}
                </h3>

                <div className="mt-4 flex justify-center gap-6">
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      {
                        importResult.created
                      }
                    </p>
                    <p className="text-sm text-zinc-500">
                      Created
                    </p>
                  </div>

                  <div>
                    <p className="text-2xl font-bold text-zinc-400">
                      {
                        importResult.skipped ||
                        0
                      }
                    </p>
                    <p className="text-sm text-zinc-500">
                      Skipped
                    </p>
                  </div>

                  <div>
                    <p className="text-2xl font-bold text-red-500">
                      {
                        importResult
                          .errors
                          ?.length ||
                        0
                      }
                    </p>
                    <p className="text-sm text-zinc-500">
                      Errors
                    </p>
                  </div>
                </div>

                {importResult.errors
                  ?.length > 0 && (
                  <div className="mt-4 text-left">
                    <p className="mb-1 text-sm font-medium text-red-500">
                      Errors:
                    </p>

                    {importResult.errors.map(
                      (
                        err: any,
                        i: number,
                      ) => (
                        <p
                          key={i}
                          className="text-xs text-red-400"
                        >
                          {err.item}:{" "}
                          {err.reason}
                        </p>
                      ),
                    )}
                  </div>
                )}

                <Button
                  className="mt-4"
                  onClick={handleReset}
                >
                  Import More
                </Button>
              </div>
            )}
        </CardContent>
      </Card>
    </>
  );
}

function AnnouncementsTab({
  showToast,
}: any) {
  const [
    publishedFilter,
    setPublishedFilter,
  ] = useState<string>("");

  const [modal, setModal] =
    useState(false);

  const [
    categoryModal,
    setCategoryModal,
  ] = useState(false);

  const [
    editingId,
    setEditingId,
  ] = useState<string | null>(
    null,
  );

  const { data, isLoading } =
    useAdminAnnouncements(
      publishedFilter === "true"
        ? true
        : publishedFilter === "false"
          ? false
          : undefined,
    );

  const {
    data: categoriesData,
  } =
    useAnnouncementCategories();

  const createMutation =
    useCreateAnnouncement();

  const updateMutation =
    useUpdateAnnouncement();

  const toggleMutation =
    useToggleAnnouncement();

  const deleteMutation =
    useDeleteAnnouncement();

  const createCategoryMutation =
    useCreateAnnouncementCategory();

  const toggleCategoryMutation =
    useToggleAnnouncementCategory();

  const emptyForm = {
    title: "",
    summary: "",
    content: "",
    featuredImage: "",
    slug: "",
    categoryId: "",
    programmeId: "",
    applicationCycle: "",
    applicationStatus: "",
    applicationDeadline: "",
    applicationUrl: "",
    officialSourceUrl: "",
    source: "",
    sourceDocument: "",
    lastVerified: "",
    published: false,
  };

  const emptyCategoryForm = {
    name: "",
    description: "",
    slug: "",
    displayOrder: 0,
    icon: "",
  };

  const [form, setForm] =
    useState(emptyForm);

  const [
    categoryForm,
    setCategoryForm,
  ] = useState(
    emptyCategoryForm,
  );

  const items = useMemo(() => {
    if (Array.isArray(data?.data))
      return data.data;

    if (Array.isArray(data))
      return data;

    return [];
  }, [data]);

  const categories = useMemo(() => {
    if (
      Array.isArray(
        categoriesData?.data,
      )
    ) {
      return categoriesData.data;
    }

    if (Array.isArray(categoriesData))
      return categoriesData;

    return [];
  }, [categoriesData]);

  const activeCategories =
    categories.filter(
      (category: any) =>
        category.isActive,
    );

  const resetForm = () => {
    setForm({
      ...emptyForm,
    });

    setEditingId(null);
  };

  const openCreate = () => {
    resetForm();
    setModal(true);
  };

  const openEdit = (item: any) => {
    setEditingId(item.id);

    setForm({
      title: item.title ?? "",
      summary: item.summary ?? "",
      content: item.content ?? "",
      featuredImage:
        item.featuredImage ?? "",
      slug: item.slug ?? "",
      categoryId:
        item.categoryId ?? "",
      programmeId:
        item.programmeId ?? "",
      applicationCycle:
        item.applicationCycle ?? "",
      applicationStatus:
        item.applicationStatus ?? "",
      applicationDeadline:
        item.applicationDeadline
          ? new Date(
              item.applicationDeadline,
            )
              .toISOString()
              .slice(0, 10)
          : "",
      applicationUrl:
        item.applicationUrl ?? "",
      officialSourceUrl:
        item.officialSourceUrl ?? "",
      source: item.source ?? "",
      sourceDocument:
        item.sourceDocument ?? "",
      lastVerified:
        item.lastVerified
          ? new Date(
              item.lastVerified,
            )
              .toISOString()
              .slice(0, 10)
          : "",
      published: Boolean(
        item.published,
      ),
    });

    setModal(true);
  };

  const handleSave = async (
    publish?: boolean,
  ) => {
    if (!form.title.trim()) {
      showToast(
        "error",
        "News title is required",
      );
      return;
    }

    if (!form.content.trim()) {
      showToast(
        "error",
        "News content is required",
      );
      return;
    }

    const payload = {
      title: form.title.trim(),
      summary:
        form.summary.trim() ||
        undefined,
      content: form.content.trim(),
      featuredImage:
        form.featuredImage.trim() ||
        undefined,
      slug:
        form.slug.trim() ||
        undefined,
      categoryId:
        form.categoryId ||
        undefined,
      programmeId:
        form.programmeId.trim() ||
        undefined,
      applicationCycle:
        form.applicationCycle.trim() ||
        undefined,
      applicationStatus:
        form.applicationStatus ||
        undefined,
      applicationDeadline:
        form.applicationDeadline ||
        undefined,
      applicationUrl:
        form.applicationUrl.trim() ||
        undefined,
      officialSourceUrl:
        form.officialSourceUrl.trim() ||
        undefined,
      source:
        form.source.trim() ||
        undefined,
      sourceDocument:
        form.sourceDocument.trim() ||
        undefined,
      lastVerified:
        form.lastVerified ||
        undefined,
      published:
        publish !== undefined
          ? publish
          : form.published,
    };

    try {
      if (editingId) {
        await updateMutation.mutateAsync(
          {
            id: editingId,
            input: payload,
          },
        );

        showToast(
          "success",
          payload.published
            ? "News article published"
            : "News article saved",
        );
      } else {
        await createMutation.mutateAsync(
          payload,
        );

        showToast(
          "success",
          payload.published
            ? "News article published"
            : "News article saved",
        );
      }

      setModal(false);
      resetForm();
    } catch (err: any) {
      showToast(
        "error",
        err.message ||
          "Unable to save news article",
      );
    }
  };

  const handleToggle = async (
    id: string,
  ) => {
    try {
      await toggleMutation.mutateAsync(
        id,
      );

      showToast(
        "success",
        "Publication status updated",
      );
    } catch (err: any) {
      showToast(
        "error",
        err.message ||
          "Unable to update publication status",
      );
    }
  };

  const handleDelete = async (
    item: any,
  ) => {
    if (
      !confirm(
        `Delete news article "${item.title}"?`,
      )
    )
      return;

    try {
      await deleteMutation.mutateAsync(
        item.id,
      );

      showToast(
        "success",
        "News article deleted",
      );
    } catch (err: any) {
      showToast(
        "error",
        err.message ||
          "Unable to delete news article",
      );
    }
  };

  const handleCreateCategory =
    async () => {
      if (!categoryForm.name.trim()) {
        showToast(
          "error",
          "Category name is required",
        );
        return;
      }

      try {
        await createCategoryMutation.mutateAsync(
          {
            name:
              categoryForm.name.trim(),
            description:
              categoryForm.description
                .trim() ||
              undefined,
            slug:
              categoryForm.slug.trim() ||
              undefined,
            displayOrder:
              Number(
                categoryForm.displayOrder,
              ) || 0,
            icon:
              categoryForm.icon.trim() ||
              undefined,
          },
        );

        showToast(
          "success",
          "Category created",
        );

        setCategoryForm({
          ...emptyCategoryForm,
        });

        setCategoryModal(false);
      } catch (err: any) {
        showToast(
          "error",
          err.message ||
            "Unable to create category",
        );
      }
    };

  const handleToggleCategory =
    async (id: string) => {
      try {
        await toggleCategoryMutation.mutateAsync(
          id,
        );

        showToast(
          "success",
          "Category status updated",
        );
      } catch (err: any) {
        showToast(
          "error",
          err.message ||
            "Unable to update category",
        );
      }
    };

  const inputClass =
    "w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50";

  const labelClass =
    "mb-1.5 block text-sm font-medium text-zinc-800 dark:text-zinc-200";

  const updateField = (
    field: keyof typeof form,
    value: string | boolean,
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  return (
    <>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <select
          value={publishedFilter}
          onChange={(e) =>
            setPublishedFilter(
              e.target.value,
            )
          }
          className="rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
        >
          <option value="">
            All news
          </option>
          <option value="true">
            Published
          </option>
          <option value="false">
            Drafts
          </option>
        </select>

        <div className="ml-auto flex gap-2">
          <Button
            variant="outline"
            onClick={() =>
              setCategoryModal(true)
            }
            className="gap-1.5"
          >
            Categories
          </Button>

          <Button
            onClick={openCreate}
            className="gap-1.5"
          >
            <Plus className="h-4 w-4" />
            New Article
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          [1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <StatsCardSkeleton />
              </CardContent>
            </Card>
          ))
        ) : items.length === 0 ? (
          <EmptyState
            icon="inbox"
            title="No news articles"
            description="Create your first news article to get started"
          />
        ) : (
          items.map((item: any) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                        {item.title}
                      </h3>

                      <Badge
                        variant={
                          item.published
                            ? "success"
                            : "secondary"
                        }
                      >
                        {item.published
                          ? "Published"
                          : "Draft"}
                      </Badge>

                      {item.category
                        ?.name && (
                        <Badge variant="secondary">
                          {
                            item.category
                              .name
                          }
                        </Badge>
                      )}

                      {item.applicationStatus && (
                        <Badge variant="secondary">
                          {
                            item.applicationStatus
                          }
                        </Badge>
                      )}
                    </div>

                    {item.summary && (
                      <p className="mt-1.5 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
                        {item.summary}
                      </p>
                    )}

                    <p className="mt-2 text-xs text-zinc-400">
                      By{" "}
                      {
                        item.author
                          ?.firstName
                      }{" "}
                      {
                        item.author
                          ?.lastName
                      }
                      {" · "}
                      {new Date(
                        item.createdAt,
                      ).toLocaleDateString()}
                      {item.programme
                        ?.name && (
                        <>
                          {" · "}
                          {
                            item
                              .programme
                              .name
                          }
                        </>
                      )}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        openEdit(item)
                      }
                      title="Edit article"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        handleToggle(
                          item.id,
                        )
                      }
                      title={
                        item.published
                          ? "Unpublish"
                          : "Publish"
                      }
                    >
                      {item.published ? (
                        <ToggleRight className="h-4 w-4 text-green-500" />
                      ) : (
                        <ToggleLeft className="h-4 w-4" />
                      )}
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        handleDelete(item)
                      }
                      title="Delete article"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {modal && (
        <Modal
          title={
            editingId
              ? "Edit News Article"
              : "Create News Article"
          }
          onClose={() => {
            setModal(false);
            resetForm();
          }}
        >
          <div className="max-h-[75vh] space-y-6 overflow-y-auto pr-1">
            <section>
              <div className="mb-4 border-b border-zinc-200 pb-2 dark:border-zinc-700">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  Article
                </h3>

                <p className="mt-0.5 text-xs text-zinc-500">
                  The main public-facing information.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={labelClass}>
                    Title *
                  </label>

                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) =>
                      updateField(
                        "title",
                        e.target.value,
                      )
                    }
                    placeholder="e.g. 2026/2027 Undergraduate Admissions Open"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Summary
                  </label>

                  <textarea
                    value={form.summary}
                    onChange={(e) =>
                      updateField(
                        "summary",
                        e.target.value,
                      )
                    }
                    rows={3}
                    placeholder="Short introduction shown on the news listing."
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Content *
                  </label>

                  <textarea
                    value={form.content}
                    onChange={(e) =>
                      updateField(
                        "content",
                        e.target.value,
                      )
                    }
                    rows={10}
                    placeholder="Write the full news article here..."
                    className={inputClass}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>
                      Category
                    </label>

                    <select
                      value={
                        form.categoryId
                      }
                      onChange={(e) =>
                        updateField(
                          "categoryId",
                          e.target.value,
                        )
                      }
                      className={inputClass}
                    >
                      <option value="">
                        No category
                      </option>

                      {activeCategories.map(
                        (
                          category: any,
                        ) => (
                          <option
                            key={
                              category.id
                            }
                            value={
                              category.id
                            }
                          >
                            {
                              category.name
                            }
                          </option>
                        ),
                      )}
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>
                      Slug
                    </label>

                    <input
                      type="text"
                      value={form.slug}
                      onChange={(e) =>
                        updateField(
                          "slug",
                          e.target.value,
                        )
                      }
                      placeholder="Generated automatically if empty"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>
                    Featured image URL
                  </label>

                  <input
                    type="url"
                    value={
                      form.featuredImage
                    }
                    onChange={(e) =>
                      updateField(
                        "featuredImage",
                        e.target.value,
                      )
                    }
                    placeholder="https://..."
                    className={inputClass}
                  />
                </div>
              </div>
            </section>

            <section>
              <div className="mb-4 border-b border-zinc-200 pb-2 dark:border-zinc-700">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  Admission Details
                </h3>

                <p className="mt-0.5 text-xs text-zinc-500">
                  Use these fields when the article concerns admissions.
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>
                      Application status
                    </label>

                    <select
                      value={
                        form.applicationStatus
                      }
                      onChange={(e) =>
                        updateField(
                          "applicationStatus",
                          e.target.value,
                        )
                      }
                      className={inputClass}
                    >
                      <option value="">
                        Not specified
                      </option>
                      <option value="Open">
                        Open
                      </option>
                      <option value="Closing Soon">
                        Closing Soon
                      </option>
                      <option value="Closed">
                        Closed
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>
                      Application cycle
                    </label>

                    <input
                      type="text"
                      value={
                        form.applicationCycle
                      }
                      onChange={(e) =>
                        updateField(
                          "applicationCycle",
                          e.target.value,
                        )
                      }
                      placeholder="e.g. 2026/2027"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>
                      Application deadline
                    </label>

                    <input
                      type="date"
                      value={
                        form.applicationDeadline
                      }
                      onChange={(e) =>
                        updateField(
                          "applicationDeadline",
                          e.target.value,
                        )
                      }
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Programme ID
                    </label>

                    <input
                      type="text"
                      value={
                        form.programmeId
                      }
                      onChange={(e) =>
                        updateField(
                          "programmeId",
                          e.target.value,
                        )
                      }
                      placeholder="Existing programme ID"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>
                    Application URL
                  </label>

                  <input
                    type="url"
                    value={
                      form.applicationUrl
                    }
                    onChange={(e) =>
                      updateField(
                        "applicationUrl",
                        e.target.value,
                      )
                    }
                    placeholder="Official application link"
                    className={inputClass}
                  />
                </div>
              </div>
            </section>

            <section>
              <div className="mb-4 border-b border-zinc-200 pb-2 dark:border-zinc-700">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  Source and Verification
                </h3>

                <p className="mt-0.5 text-xs text-zinc-500">
                  Record where the information came from.
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>
                      Source / Publisher
                    </label>

                    <input
                      type="text"
                      value={
                        form.source
                      }
                      onChange={(e) =>
                        updateField(
                          "source",
                          e.target.value,
                        )
                      }
                      placeholder="e.g. University of Bamenda"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Source document
                    </label>

                    <input
                      type="text"
                      value={
                        form.sourceDocument
                      }
                      onChange={(e) =>
                        updateField(
                          "sourceDocument",
                          e.target.value,
                        )
                      }
                      placeholder="e.g. 2026/2027 Admission Notice"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>
                    Official source URL
                  </label>

                  <input
                    type="url"
                    value={
                      form.officialSourceUrl
                    }
                    onChange={(e) =>
                      updateField(
                        "officialSourceUrl",
                        e.target.value,
                      )
                    }
                    placeholder="Official source page"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Last verified
                  </label>

                  <input
                    type="date"
                    value={
                      form.lastVerified
                    }
                    onChange={(e) =>
                      updateField(
                        "lastVerified",
                        e.target.value,
                      )
                    }
                    className={inputClass}
                  />
                </div>
              </div>
            </section>

            <section>
              <div className="mb-4 border-b border-zinc-200 pb-2 dark:border-zinc-700">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  Publishing
                </h3>
              </div>

              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-zinc-200 p-3 dark:border-zinc-700">
                <input
                  type="checkbox"
                  checked={
                    form.published
                  }
                  onChange={(e) =>
                    updateField(
                      "published",
                      e.target.checked,
                    )
                  }
                  className="mt-0.5 h-4 w-4"
                />

                <span>
                  <span className="block text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    Publish this article
                  </span>

                  <span className="mt-0.5 block text-xs text-zinc-500">
                    Published articles appear on the public News section.
                  </span>
                </span>
              </label>
            </section>

            <div className="sticky bottom-0 -mx-1 flex flex-col-reverse gap-2 border-t border-zinc-200 bg-white pt-4 sm:flex-row sm:justify-end dark:border-zinc-700 dark:bg-zinc-900">
              <Button
                variant="outline"
                onClick={() => {
                  setModal(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>

              <Button
                variant="outline"
                onClick={() =>
                  handleSave(false)
                }
                disabled={
                  createMutation.isPending ||
                  updateMutation.isPending
                }
              >
                <Save className="mr-1.5 h-4 w-4" />
                Save Draft
              </Button>

              <Button
                onClick={() =>
                  handleSave(true)
                }
                disabled={
                  createMutation.isPending ||
                  updateMutation.isPending
                }
              >
                <Save className="mr-1.5 h-4 w-4" />
                {editingId
                  ? "Update and Publish"
                  : "Publish"}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {categoryModal && (
        <Modal
          title="News Categories"
          onClose={() =>
            setCategoryModal(false)
          }
        >
          <div className="space-y-5">
            <section>
              <div className="mb-3">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  Existing Categories
                </h3>

                <p className="mt-0.5 text-xs text-zinc-500">
                  Control which categories are available to editors.
                </p>
              </div>

              {categories.length === 0 ? (
                <p className="rounded-lg border border-dashed border-zinc-200 p-4 text-center text-sm text-zinc-500 dark:border-zinc-700">
                  No categories yet.
                </p>
              ) : (
                <div className="space-y-2">
                  {categories.map(
                    (category: any) => (
                      <div
                        key={category.id}
                        className="flex items-center justify-between rounded-lg border border-zinc-200 px-3 py-2.5 dark:border-zinc-700"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                              {
                                category.name
                              }
                            </span>

                            <Badge
                              variant={
                                category.isActive
                                  ? "success"
                                  : "secondary"
                              }
                            >
                              {category.isActive
                                ? "Active"
                                : "Inactive"}
                            </Badge>
                          </div>

                          <p className="mt-0.5 text-xs text-zinc-500">
                            {category
                              ._count
                              ?.announcements ??
                              0}{" "}
                            article
                            {category
                              ._count
                              ?.announcements ===
                            1
                              ? ""
                              : "s"}
                          </p>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleToggleCategory(
                              category.id,
                            )
                          }
                        >
                          {category.isActive
                            ? "Deactivate"
                            : "Activate"}
                        </Button>
                      </div>
                    ),
                  )}
                </div>
              )}
            </section>

            <section className="border-t border-zinc-200 pt-5 dark:border-zinc-700">
              <h3 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                Add Category
              </h3>

              <div className="space-y-3">
                <div>
                  <label className={labelClass}>
                    Name *
                  </label>

                  <input
                    type="text"
                    value={
                      categoryForm.name
                    }
                    onChange={(e) =>
                      setCategoryForm({
                        ...categoryForm,
                        name: e.target.value,
                      })
                    }
                    placeholder="e.g. Admissions"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Description
                  </label>

                  <textarea
                    value={
                      categoryForm.description
                    }
                    onChange={(e) =>
                      setCategoryForm({
                        ...categoryForm,
                        description:
                          e.target.value,
                      })
                    }
                    rows={2}
                    placeholder="Brief description"
                    className={inputClass}
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>
                      Slug
                    </label>

                    <input
                      type="text"
                      value={
                        categoryForm.slug
                      }
                      onChange={(e) =>
                        setCategoryForm({
                          ...categoryForm,
                          slug: e.target.value,
                        })
                      }
                      placeholder="Generated automatically"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Display order
                    </label>

                    <input
                      type="number"
                      value={
                        categoryForm.displayOrder
                      }
                      onChange={(e) =>
                        setCategoryForm({
                          ...categoryForm,
                          displayOrder:
                            Number(
                              e.target.value,
                            ) || 0,
                        })
                      }
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>
                    Icon
                  </label>

                  <input
                    type="text"
                    value={
                      categoryForm.icon
                    }
                    onChange={(e) =>
                      setCategoryForm({
                        ...categoryForm,
                        icon: e.target.value,
                      })
                    }
                    placeholder="Optional icon name"
                    className={inputClass}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={() =>
                      setCategoryForm({
                        ...emptyCategoryForm,
                      })
                    }
                  >
                    Clear
                  </Button>

                  <Button
                    onClick={
                      handleCreateCategory
                    }
                    disabled={
                      createCategoryMutation.isPending
                    }
                  >
                    <Plus className="mr-1.5 h-4 w-4" />
                    Add Category
                  </Button>
                </div>
              </div>
            </section>

            <div className="flex justify-end border-t border-zinc-200 pt-4 dark:border-zinc-700">
              <Button
                variant="outline"
                onClick={() =>
                  setCategoryModal(false)
                }
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

function AnalyticsTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          Analytics
        </CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-zinc-500">
          Analytics data is not available.
        </p>
      </CardContent>
    </Card>
  );
}

function DuplicatesTab() {
  const {
    data: facultyDupes,
    isLoading: floading,
  } = useDuplicateFaculties();

  const {
    data: programmeDupes,
    isLoading: ploading,
  } = useDuplicateProgrammes();

  const {
    data: subjectDupes,
    isLoading: sloading,
  } = useDuplicateSubjects();

  const faculties = useMemo(() => {
    const d = facultyDupes?.data;
    return Array.isArray(d) ? d : [];
  }, [facultyDupes]);

  const programmes = useMemo(() => {
    const d = programmeDupes?.data;
    return Array.isArray(d) ? d : [];
  }, [programmeDupes]);

  const subjects = useMemo(() => {
    const d = subjectDupes?.data;
    return Array.isArray(d) ? d : [];
  }, [subjectDupes]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Building2 className="h-4 w-4" />
            Faculty Duplicates
          </CardTitle>
        </CardHeader>

        <CardContent>
          {floading ? (
            <StatsCardSkeleton />
          ) : faculties.length === 0 ? (
            <p className="text-sm text-green-600">
              <CheckCircle className="mr-1 inline h-4 w-4" />
              No duplicate faculties found
            </p>
          ) : (
            faculties.map((group: any) => (
              <div
                key={group.name}
                className="mb-3 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900 dark:bg-red-900/20"
              >
                <p className="mb-2 text-sm font-medium text-red-700 dark:text-red-400">
                  <AlertTriangle className="mr-1 inline h-4 w-4" />
                  "{group.name}" appears{" "}
                  {group.count} times
                </p>

                {group.items?.map(
                  (item: any) => (
                    <p
                      key={item.id}
                      className="ml-6 text-xs text-zinc-600 dark:text-zinc-400"
                    >
                      • ID: {item.id} (
                      {item.abbreviation})
                    </p>
                  ),
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <GraduationCap className="h-4 w-4" />
            Programme Duplicates
          </CardTitle>
        </CardHeader>

        <CardContent>
          {ploading ? (
            <StatsCardSkeleton />
          ) : programmes.length === 0 ? (
            <p className="text-sm text-green-600">
              <CheckCircle className="mr-1 inline h-4 w-4" />
              No duplicate programmes found
            </p>
          ) : (
            programmes.map(
              (group: any, i: number) => (
                <div
                  key={i}
                  className="mb-3 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900 dark:bg-red-900/20"
                >
                  <p className="mb-2 text-sm font-medium text-red-700 dark:text-red-400">
                    <AlertTriangle className="mr-1 inline h-4 w-4" />
                    Duplicate{" "}
                    {group.field}: "
                    {group.value}" (
                    {group.count} times)
                  </p>

                  {group.items?.map(
                    (item: any) => (
                      <p
                        key={item.id}
                        className="ml-6 text-xs text-zinc-600 dark:text-zinc-400"
                      >
                        • {item.code} -{" "}
                        {item.name}
                      </p>
                    ),
                  )}
                </div>
              ),
            )
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <BookOpen className="h-4 w-4" />
            Subject Duplicates
          </CardTitle>
        </CardHeader>

        <CardContent>
          {sloading ? (
            <StatsCardSkeleton />
          ) : subjects.length === 0 ? (
            <p className="text-sm text-green-600">
              <CheckCircle className="mr-1 inline h-4 w-4" />
              No duplicate subjects found
            </p>
          ) : (
            subjects.map((group: any) => (
              <div
                key={group.name}
                className="mb-3 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900 dark:bg-red-900/20"
              >
                <p className="mb-2 text-sm font-medium text-red-700 dark:text-red-400">
                  <AlertTriangle className="mr-1 inline h-4 w-4" />
                  "{group.name}" appears{" "}
                  {group.count} times
                </p>

                {group.items?.map(
                  (item: any) => (
                    <p
                      key={item.id}
                      className="ml-6 text-xs text-zinc-600 dark:text-zinc-400"
                    >
                      • ID: {item.id} (
                      {item.level})
                    </p>
                  ),
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}

