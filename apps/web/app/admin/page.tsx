"use client";

import { useState, useMemo, useCallback } from "react";
import {
  Shield, Users, BookOpen, Building2, TrendingUp, BarChart3,
  Plus, Search, Edit, Trash2, RefreshCw, X, Save, Upload,
  AlertTriangle, CheckCircle, XCircle, Clock, Mail, UserCog,
  ToggleLeft, ToggleRight, Download, AlertCircle, FileSpreadsheet,
  Hash, DollarSign, GraduationCap, Briefcase, Key,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatsCardSkeleton, TableRowSkeleton } from "@/components/ui/loading";
import { EmptyState } from "@/components/ui/empty-state";
import {
  useAdminStats, useAdminProgrammes, useCreateProgramme, useUpdateProgramme, useDeleteProgramme,
  useAdminUsers, useUpdateUserRole, useToggleUserActive,
  useAdminSubjects, useCreateSubject, useUpdateSubject, useDeleteSubject,
  useAdminTuition, useCreateTuition, useUpdateTuition, useDeleteTuition,
  useAdminCareers, useCreateCareer, useUpdateCareer, useDeleteCareer,
  useAdminKeywords, useCreateKeyword, useUpdateKeyword, useDeleteKeyword,
  useAdminAdmissionRules, useCreateAdmissionRule, useUpdateAdmissionRule, useDeleteAdmissionRule,
  useAdminAnnouncements, useCreateAnnouncement, useToggleAnnouncement, useDeleteAnnouncement,
  useDuplicateFaculties, useDuplicateProgrammes, useDuplicateSubjects,
  useProgrammesByFaculty, usePopularSearches, useUserStats, useRecentSearches,
  useProgrammeRequirements, useCreateProgrammeRequirement, useUpdateProgrammeRequirement, useDeleteProgrammeRequirement,
  useImportValidate, useImportPreview, useImportConfirm,
} from "@/app/lib/hooks/useAdmin";

type ModalMode = 'create' | 'edit' | null;

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl dark:bg-zinc-900" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{title}</h3>
          <button onClick={onClose} className="rounded-lg p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800">
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
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = useCallback((type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Stats
  const { data: statsData, isLoading: statsLoading } = useAdminStats();
  const { data: facultiesData } = useProgrammesByFaculty();
  const { data: popularSearches } = usePopularSearches(5);

  const stats = useMemo(() => {
    const s = statsData?.data || statsData;
    if (!s) return null;
    return [
      { title: "Total Programmes", value: s.totalProgrammes ?? "-", icon: BookOpen, color: "blue" as const },
      { title: "Faculties/Schools", value: s.totalFaculties ?? "-", icon: Building2, color: "purple" as const },
      { title: "Registered Users", value: s.totalUsers ?? "-", icon: Users, color: "green" as const },
      { title: "Search Queries", value: s.totalSearches ?? "-", icon: TrendingUp, color: "orange" as const },
    ];
  }, [statsData]);

  const iconColors: Record<string, string> = { blue: "text-blue-600 dark:text-blue-400", green: "text-green-600 dark:text-green-400", purple: "text-purple-600 dark:text-purple-400", orange: "text-orange-600 dark:text-orange-400" };
  const iconBgs: Record<string, string> = { blue: "bg-blue-100 dark:bg-blue-900/30", green: "bg-green-100 dark:bg-green-900/30", purple: "bg-purple-100 dark:bg-purple-900/30", orange: "bg-orange-100 dark:bg-orange-900/30" };

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "programmes", label: "Programmes", icon: GraduationCap },
    { id: "subjects", label: "Subjects", icon: BookOpen },
    { id: "users", label: "Users", icon: Users },
    { id: "tuition", label: "Tuition", icon: DollarSign },
    { id: "careers", label: "Careers", icon: Briefcase },
    { id: "keywords", label: "Keywords", icon: Key },
    { id: "admission-rules", label: "Admission Rules", icon: AlertCircle },
    { id: "requirements", label: "Requirements", icon: BookOpen },
    { id: "announcements", label: "Announcements", icon: Mail },
    { id: "import", label: "Import", icon: Upload },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
    { id: "duplicates", label: "Duplicates", icon: AlertTriangle },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Toast */}
      {toast && (
        <div className={`fixed right-4 top-4 z-50 flex items-center gap-2 rounded-lg px-4 py-3 text-sm text-white shadow-lg ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-900 dark:bg-zinc-50">
            <Shield className="h-5 w-5 text-white dark:text-zinc-900" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Admin Dashboard</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Manage programmes, users, and system settings</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 overflow-x-auto border-b border-zinc-200 dark:border-zinc-800">
        <nav className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setPage(1); setSearch(""); }}
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

      {/* ==================== DASHBOARD TAB ==================== */}
      {activeTab === "dashboard" && <DashboardTab stats={stats} statsLoading={statsLoading} facultiesData={facultiesData} popularSearches={popularSearches} />}

      {/* ==================== PROGRAMMES TAB ==================== */}
      {activeTab === "programmes" && <ProgrammesTab page={page} setPage={setPage} search={search} setSearch={setSearch} showToast={showToast} />}

      {/* ==================== SUBJECTS TAB ==================== */}
      {activeTab === "subjects" && <SubjectsTab page={page} setPage={setPage} search={search} setSearch={setSearch} showToast={showToast} />}

      {/* ==================== USERS TAB ==================== */}
      {activeTab === "users" && <UsersTab page={page} setPage={setPage} search={search} setSearch={setSearch} showToast={showToast} />}

      {/* ==================== TUITION TAB ==================== */}
      {activeTab === "tuition" && <TuitionTab page={page} setPage={setPage} showToast={showToast} />}

      {/* ==================== CAREERS TAB ==================== */}
      {activeTab === "careers" && <CareersTab page={page} setPage={setPage} search={search} setSearch={setSearch} showToast={showToast} />}

      {/* ==================== KEYWORDS TAB ==================== */}
      {activeTab === "keywords" && <KeywordsTab page={page} setPage={setPage} search={search} setSearch={setSearch} showToast={showToast} />}

      {/* ==================== ADMISSION RULES TAB ==================== */}
      {activeTab === "admission-rules" && <AdmissionRulesTab page={page} setPage={setPage} showToast={showToast} />}

      {/* ==================== REQUIREMENTS TAB ==================== */}
      {activeTab === "requirements" && <RequirementsTab showToast={showToast} />}

      {/* ==================== ANNOUNCEMENTS TAB ==================== */}
      {activeTab === "announcements" && <AnnouncementsTab showToast={showToast} />}

      {/* ==================== IMPORT TAB ==================== */}
      {activeTab === "import" && <ImportTab showToast={showToast} />}

      {/* ==================== ANALYTICS TAB ==================== */}
      {activeTab === "analytics" && <AnalyticsTab />}

      {/* ==================== DUPLICATES TAB ==================== */}
      {activeTab === "duplicates" && <DuplicatesTab />}
    </div>
  );
}

// ==================== DASHBOARD TAB ====================
function DashboardTab({ stats, statsLoading, facultiesData, popularSearches }: any) {
  return (
    <>
      {/* Stats Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsLoading ? (
          [1, 2, 3, 4].map((i) => <StatsCardSkeleton key={i} />)
        ) : stats ? (
          stats.map((stat: any) => (
            <Card key={stat.title}>
              <CardContent className="p-5">
                <div className={`inline-flex rounded-lg p-2 ${stat.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30' : stat.color === 'green' ? 'bg-green-100 dark:bg-green-900/30' : stat.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/30' : 'bg-orange-100 dark:bg-orange-900/30'}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color === 'blue' ? 'text-blue-600 dark:text-blue-400' : stat.color === 'green' ? 'text-green-600 dark:text-green-400' : stat.color === 'purple' ? 'text-purple-600 dark:text-purple-400' : 'text-orange-600 dark:text-orange-400'}`} />
                </div>
                <p className="mt-3 text-2xl font-bold text-zinc-900 dark:text-zinc-50">{stat.value}</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">{stat.title}</p>
              </CardContent>
            </Card>
          ))
        ) : null}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Programmes by Faculty */}
        <Card>
          <CardHeader><CardTitle className="text-base">Programmes by Faculty</CardTitle></CardHeader>
          <CardContent>
            {facultiesData?.data ? (
              <div className="space-y-3">
                {facultiesData.data.slice(0, 8).map((f: any) => (
                  <div key={f.id} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{f.abbreviation || f.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-zinc-400">{f.departmentCount} dept(s)</span>
                      <Badge variant="secondary">{f.programmeCount} programmes</Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center py-8 text-zinc-400">
                <BarChart3 className="mr-2 h-5 w-5" /> Loading...
              </div>
            )}
          </CardContent>
        </Card>

        {/* Popular Searches */}
        <Card>
          <CardHeader><CardTitle className="text-base">Popular Searches</CardTitle></CardHeader>
          <CardContent>
            {popularSearches?.data ? (
              <div className="space-y-3">
                {popularSearches.data.map((s: any, i: number) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">{s.query}</span>
                    <Badge>{s.count} searches</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center py-8 text-zinc-400">
                <TrendingUp className="mr-2 h-5 w-5" /> No search data yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

// ==================== PROGRAMMES TAB ====================
function ProgrammesTab({ page, setPage, search, setSearch, showToast }: any) {
  const { data, isLoading } = useAdminProgrammes(page, 20, search || undefined);
  const createMutation = useCreateProgramme();
  const updateMutation = useUpdateProgramme();
  const deleteMutation = useDeleteProgramme();

  const [modal, setModal] = useState<{ mode: ModalMode; item?: any }>({ mode: null });
  const [form, setForm] = useState({ code: "", name: "", degree: "", level: "", duration: 3, description: "", departmentId: "" });

  const openCreate = () => {
    setForm({ code: "", name: "", degree: "BSC", level: "UNDERGRADUATE", duration: 3, description: "", departmentId: "" });
    setModal({ mode: "create" });
  };

  const openEdit = (item: any) => {
    setForm({
      code: item.code || "",
      name: item.name || "",
      degree: item.degree || "",
      level: item.level || "",
      duration: item.duration || 3,
      description: item.description || "",
      departmentId: item.departmentId || "",
    });
    setModal({ mode: "edit", item });
  };

  const handleSubmit = async () => {
    try {
      if (modal.mode === "create") {
        await createMutation.mutateAsync(form);
        showToast("success", `Programme "${form.name}" created`);
      } else if (modal.mode === "edit" && modal.item) {
        await updateMutation.mutateAsync({ id: modal.item.id, input: form });
        showToast("success", "Programme updated");
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
      showToast("success", "Programme deleted");
    } catch (err: any) {
      showToast("error", err.message);
    }
  };

  const programmes = useMemo(() => {
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data)) return data;
    return [];
  }, [data]);

  const totalPages = data?.totalPages || 1;

  return (
    <>
      <div className="mb-4 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text" placeholder="Search programmes by name or code..."
            value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-10 pr-4 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
          />
        </div>
        <Button onClick={openCreate} className="gap-1"><Plus className="h-4 w-4" /> Add Programme</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800">
                  <th className="px-4 pb-3 pt-4 text-left font-medium text-zinc-500">Code</th>
                  <th className="px-4 pb-3 pt-4 text-left font-medium text-zinc-500">Name</th>
                  <th className="px-4 pb-3 pt-4 text-left font-medium text-zinc-500">Faculty</th>
                  <th className="px-4 pb-3 pt-4 text-left font-medium text-zinc-500">Degree</th>
                  <th className="px-4 pb-3 pt-4 text-left font-medium text-zinc-500">Duration</th>
                  <th className="px-4 pb-3 pt-4 text-left font-medium text-zinc-500">Status</th>
                  <th className="px-4 pb-3 pt-4 text-left font-medium text-zinc-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  [1, 2, 3, 4, 5].map((i) => <TableRowSkeleton key={i} cols={7} />)
                ) : programmes.length === 0 ? (
                  <tr><td colSpan={7} className="py-12 text-center text-zinc-500">No programmes found</td></tr>
                ) : (
                  programmes.map((prog: any) => (
                    <tr key={prog.id} className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                      <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-50">{prog.code}</td>
                      <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">{prog.name}</td>
                      <td className="px-4 py-3 text-zinc-500">{prog.department?.academicUnit?.abbreviation || "N/A"}</td>
                      <td className="px-4 py-3"><Badge variant="outline">{prog.degree}</Badge></td>
                      <td className="px-4 py-3 text-zinc-600">{prog.duration}yrs</td>
                      <td className="px-4 py-3">
                        <Badge variant={prog.isActive !== false ? "success" : "secondary"}>
                          {prog.isActive !== false ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" onClick={() => openEdit(prog)}><Edit className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(prog)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-zinc-200 px-4 py-3 dark:border-zinc-800">
              <span className="text-sm text-zinc-500">Page {page} of {totalPages}</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
                <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Modal */}
      {modal.mode && (
        <Modal title={modal.mode === "create" ? "Create Programme" : "Edit Programme"} onClose={() => setModal({ mode: null })}>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Code *</label>
              <input type="text" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })}
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Name *</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Degree</label>
                <select value={form.degree} onChange={(e) => setForm({ ...form, degree: e.target.value })}
                  className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50">
                  {["BSC", "BA", "BENG", "BED", "LLB", "MBBS", "HND", "DIPLOMA", "PGD", "MSC", "MA", "MENG", "PHD", "BTECH"].map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Level</label>
                <select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}
                  className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50">
                  {["UNDERGRADUATE", "POSTGRADUATE", "DOCTORATE", "PROFESSIONAL"].map(l => (
                    <option key={l} value={l}>{l.replace("_", " ")}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Duration (years)</label>
              <input type="number" min={1} max={8} value={form.duration} onChange={(e) => setForm({ ...form, duration: parseInt(e.target.value) || 3 })}
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50" />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setModal({ mode: null })}>Cancel</Button>
              <Button onClick={handleSubmit}>
                <Save className="mr-1 h-4 w-4" /> {modal.mode === "create" ? "Create" : "Save"}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

// ==================== SUBJECTS TAB ====================
function SubjectsTab({ page, setPage, search, setSearch, showToast }: any) {
  const [levelFilter, setLevelFilter] = useState("");
  const { data, isLoading } = useAdminSubjects(page, 50, search || undefined, levelFilter || undefined);
  const createMutation = useCreateSubject();
  const updateMutation = useUpdateSubject();
  const deleteMutation = useDeleteSubject();

  const [modal, setModal] = useState<{ mode: ModalMode; item?: any }>({ mode: null });
  const [form, setForm] = useState({ name: "", code: "", level: "O_LEVEL" });

  const subjects = useMemo(() => {
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data)) return data;
    return [];
  }, [data]);

  const totalPages = data?.totalPages || 1;

  const openCreate = () => { setForm({ name: "", code: "", level: "O_LEVEL" }); setModal({ mode: "create" }); };
  const openEdit = (item: any) => { setForm({ name: item.name, code: item.code || "", level: item.level }); setModal({ mode: "edit", item }); };

  const handleSubmit = async () => {
    try {
      if (modal.mode === "create") { await createMutation.mutateAsync(form); showToast("success", "Subject created"); }
      else if (modal.mode === "edit" && modal.item) { await updateMutation.mutateAsync({ id: modal.item.id, input: form }); showToast("success", "Subject updated"); }
      setModal({ mode: null });
    } catch (err: any) { showToast("error", err.message); }
  };

  const handleDelete = async (item: any) => {
    if (!confirm(`Delete "${item.name}"?`)) return;
    try { await deleteMutation.mutateAsync(item.id); showToast("success", "Subject deleted"); }
    catch (err: any) { showToast("error", err.message); }
  };

  return (
    <>
      <div className="mb-4 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input type="text" placeholder="Search subjects..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-10 pr-4 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50" />
        </div>
        <select value={levelFilter} onChange={(e) => { setLevelFilter(e.target.value); setPage(1); }}
          className="rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50">
          <option value="">All Levels</option>
          <option value="O_LEVEL">O Level</option>
          <option value="A_LEVEL">A Level</option>
        </select>
        <Button onClick={openCreate} className="gap-1"><Plus className="h-4 w-4" /> Add Subject</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800">
                  <th className="px-4 pb-3 pt-4 text-left font-medium text-zinc-500">Name</th>
                  <th className="px-4 pb-3 pt-4 text-left font-medium text-zinc-500">Code</th>
                  <th className="px-4 pb-3 pt-4 text-left font-medium text-zinc-500">Level</th>
                  <th className="px-4 pb-3 pt-4 text-left font-medium text-zinc-500">Requirements</th>
                  <th className="px-4 pb-3 pt-4 text-left font-medium text-zinc-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? [1, 2, 3, 4, 5].map((i) => <TableRowSkeleton key={i} cols={5} />)
                : subjects.length === 0 ? <tr><td colSpan={5} className="py-12 text-center text-zinc-500">No subjects found</td></tr>
                : subjects.map((subj: any) => (
                  <tr key={subj.id} className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                    <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-50">{subj.name}</td>
                    <td className="px-4 py-3 text-zinc-500">{subj.code || "-"}</td>
                    <td className="px-4 py-3"><Badge variant={subj.level === "O_LEVEL" ? "default" : "secondary"}>{subj.level.replace("_", " ")}</Badge></td>
                    <td className="px-4 py-3 text-zinc-500">{subj._count?.requirements ?? 0}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(subj)}><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(subj)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-zinc-200 px-4 py-3 dark:border-zinc-800">
              <span className="text-sm text-zinc-500">Page {page} of {totalPages}</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
                <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {modal.mode && (
        <Modal title={modal.mode === "create" ? "Create Subject" : "Edit Subject"} onClose={() => setModal({ mode: null })}>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Name *</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Code</label>
              <input type="text" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })}
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Level *</label>
              <select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50">
                <option value="O_LEVEL">O Level</option>
                <option value="A_LEVEL">A Level</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setModal({ mode: null })}>Cancel</Button>
              <Button onClick={handleSubmit}><Save className="mr-1 h-4 w-4" /> {modal.mode === "create" ? "Create" : "Save"}</Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

// ==================== USERS TAB ====================
function UsersTab({ page, setPage, search, setSearch, showToast }: any) {
  const { data, isLoading } = useAdminUsers(page, 20, search || undefined);
  const updateRole = useUpdateUserRole();
  const toggleActive = useToggleUserActive();

  const users = useMemo(() => {
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data)) return data;
    return [];
  }, [data]);

  const totalPages = data?.totalPages || 1;

  const handleRoleChange = async (userId: string, role: string) => {
    try { await updateRole.mutateAsync({ id: userId, role }); showToast("success", "Role updated"); }
    catch (err: any) { showToast("error", err.message); }
  };

  const handleToggleActive = async (userId: string) => {
    try { await toggleActive.mutateAsync(userId); showToast("success", "User status toggled"); }
    catch (err: any) { showToast("error", err.message); }
  };

  return (
    <>
      <div className="mb-4 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input type="text" placeholder="Search users by name or email..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-10 pr-4 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50" />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800">
                  <th className="px-4 pb-3 pt-4 text-left font-medium text-zinc-500">Name</th>
                  <th className="px-4 pb-3 pt-4 text-left font-medium text-zinc-500">Email</th>
                  <th className="px-4 pb-3 pt-4 text-left font-medium text-zinc-500">Role</th>
                  <th className="px-4 pb-3 pt-4 text-left font-medium text-zinc-500">Status</th>
                  <th className="px-4 pb-3 pt-4 text-left font-medium text-zinc-500">Saved</th>
                  <th className="px-4 pb-3 pt-4 text-left font-medium text-zinc-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? [1, 2, 3, 4, 5].map((i) => <TableRowSkeleton key={i} cols={6} />)
                : users.length === 0 ? <tr><td colSpan={6} className="py-12 text-center text-zinc-500">No users found</td></tr>
                : users.map((user: any) => (
                  <tr key={user.id} className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                    <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-50">{user.firstName} {user.lastName}</td>
                    <td className="px-4 py-3 text-zinc-500">{user.email}</td>
                    <td className="px-4 py-3">
                      <select value={user.role} onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="rounded border border-zinc-200 px-2 py-1 text-xs dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50">
                        {["VISITOR", "STUDENT", "ADMIN"].map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={user.isActive ? "success" : "secondary"}>{user.isActive ? "Active" : "Inactive"}</Badge>
                    </td>
                    <td className="px-4 py-3 text-zinc-500">{user._count?.savedProgrammes ?? 0}</td>
                    <td className="px-4 py-3">
                      <Button variant="ghost" size="icon" onClick={() => handleToggleActive(user.id)} title="Toggle active">
                        {user.isActive ? <ToggleRight className="h-4 w-4 text-green-500" /> : <ToggleLeft className="h-4 w-4 text-red-500" />}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-zinc-200 px-4 py-3 dark:border-zinc-800">
              <span className="text-sm text-zinc-500">Page {page} of {totalPages}</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
                <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}

// ==================== TUITION TAB ====================
function TuitionTab({ page, setPage, showToast }: any) {
  const { data, isLoading } = useAdminTuition(page, 50);
  const createMutation = useCreateTuition();
  const updateMutation = useUpdateTuition();
  const deleteMutation = useDeleteTuition();

  const [modal, setModal] = useState<{ mode: ModalMode; item?: any }>({ mode: null });
  const [form, setForm] = useState({ programmeCode: "", academicYear: new Date().getFullYear().toString(), amount: 0, currency: "XAF" });

  const items = useMemo(() => {
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data)) return data;
    return [];
  }, [data]);

  const openCreate = () => { setForm({ programmeCode: "", academicYear: new Date().getFullYear().toString(), amount: 0, currency: "XAF" }); setModal({ mode: "create" }); };
  const openEdit = (item: any) => { setForm({ programmeCode: item.programme?.code || "", academicYear: item.academicYear, amount: Number(item.amount), currency: item.currency }); setModal({ mode: "edit", item }); };

  const handleSubmit = async () => {
    try {
      if (modal.mode === "create") { await createMutation.mutateAsync(form as any); showToast("success", "Tuition record created"); }
      else if (modal.mode === "edit" && modal.item) { await updateMutation.mutateAsync({ id: modal.item.id, input: form }); showToast("success", "Tuition updated"); }
      setModal({ mode: null });
    } catch (err: any) { showToast("error", err.message); }
  };

  const handleDelete = async (item: any) => {
    if (!confirm("Delete this tuition record?")) return;
    try { await deleteMutation.mutateAsync(item.id); showToast("success", "Tuition record deleted"); }
    catch (err: any) { showToast("error", err.message); }
  };

  return (
    <>
      <div className="mb-4 flex items-center gap-3">
        <p className="text-sm text-zinc-500">Manage tuition fees per programme and academic year.</p>
        <Button onClick={openCreate} className="ml-auto gap-1"><Plus className="h-4 w-4" /> Add Tuition</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800">
                  <th className="px-4 pb-3 pt-4 text-left font-medium text-zinc-500">Programme</th>
                  <th className="px-4 pb-3 pt-4 text-left font-medium text-zinc-500">Code</th>
                  <th className="px-4 pb-3 pt-4 text-left font-medium text-zinc-500">Academic Year</th>
                  <th className="px-4 pb-3 pt-4 text-left font-medium text-zinc-500">Amount</th>
                  <th className="px-4 pb-3 pt-4 text-left font-medium text-zinc-500">Currency</th>
                  <th className="px-4 pb-3 pt-4 text-left font-medium text-zinc-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? [1, 2, 3].map((i) => <TableRowSkeleton key={i} cols={6} />)
                : items.length === 0 ? <tr><td colSpan={6} className="py-12 text-center text-zinc-500">No tuition records found</td></tr>
                : items.map((item: any) => (
                  <tr key={item.id} className="border-b border-zinc-100 dark:border-zinc-800">
                    <td className="px-4 py-3 text-zinc-900 dark:text-zinc-50">{item.programme?.name || "Unknown"}</td>
                    <td className="px-4 py-3 font-mono text-zinc-500">{item.programme?.code || "-"}</td>
                    <td className="px-4 py-3 text-zinc-600">{item.academicYear}</td>
                    <td className="px-4 py-3 font-medium">{Number(item.amount).toLocaleString()}</td>
                    <td className="px-4 py-3"><Badge variant="outline">{item.currency}</Badge></td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(item)}><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(item)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {modal.mode && (
        <Modal title={modal.mode === "create" ? "Add Tuition" : "Edit Tuition"} onClose={() => setModal({ mode: null })}>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Programme Code *</label>
              <input type="text" value={form.programmeCode} onChange={(e) => setForm({ ...form, programmeCode: e.target.value })}
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Academic Year</label>
                <input type="text" value={form.academicYear} onChange={(e) => setForm({ ...form, academicYear: e.target.value })}
                  className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Currency</label>
                <select value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}
                  className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50">
                  <option value="XAF">XAF</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Amount *</label>
              <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })}
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50" />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setModal({ mode: null })}>Cancel</Button>
              <Button onClick={handleSubmit}><Save className="mr-1 h-4 w-4" /> {modal.mode === "create" ? "Add" : "Save"}</Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

// ==================== CAREERS TAB ====================
function CareersTab({ page, setPage, search, setSearch, showToast }: any) {
  const { data, isLoading } = useAdminCareers(page, 50, search || undefined);
  const createMutation = useCreateCareer();
  const updateMutation = useUpdateCareer();
  const deleteMutation = useDeleteCareer();

  const [modal, setModal] = useState<{ mode: ModalMode; item?: any }>({ mode: null });
  const [form, setForm] = useState({ name: "", description: "" });

  const items = useMemo(() => {
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data)) return data;
    return [];
  }, [data]);

  const openCreate = () => { setForm({ name: "", description: "" }); setModal({ mode: "create" }); };
  const openEdit = (item: any) => { setForm({ name: item.name, description: item.description || "" }); setModal({ mode: "edit", item }); };

  const handleSubmit = async () => {
    try {
      if (modal.mode === "create") { await createMutation.mutateAsync(form); showToast("success", "Career created"); }
      else if (modal.mode === "edit" && modal.item) { await updateMutation.mutateAsync({ id: modal.item.id, input: form }); showToast("success", "Career updated"); }
      setModal({ mode: null });
    } catch (err: any) { showToast("error", err.message); }
  };

  const handleDelete = async (item: any) => {
    if (!confirm(`Delete career "${item.name}"?`)) return;
    try { await deleteMutation.mutateAsync(item.id); showToast("success", "Career deleted"); }
    catch (err: any) { showToast("error", err.message); }
  };

  return (
    <>
      <div className="mb-4 flex items-center gap-3">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input type="text" placeholder="Search careers..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-10 pr-4 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50" /></div>
        <Button onClick={openCreate} className="gap-1"><Plus className="h-4 w-4" /> Add Career</Button>
      </div>

      <Card><CardContent className="p-0">
        <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-zinc-200 dark:border-zinc-800">
          <th className="px-4 pb-3 pt-4 text-left font-medium text-zinc-500">Name</th>
          <th className="px-4 pb-3 pt-4 text-left font-medium text-zinc-500">Description</th>
          <th className="px-4 pb-3 pt-4 text-left font-medium text-zinc-500">Programmes</th>
          <th className="px-4 pb-3 pt-4 text-left font-medium text-zinc-500">Actions</th>
        </tr></thead><tbody>
          {isLoading ? [1,2,3].map(i => <TableRowSkeleton key={i} cols={4} />)
          : items.length === 0 ? <tr><td colSpan={4} className="py-12 text-center text-zinc-500">No careers found</td></tr>
          : items.map((item: any) => (
            <tr key={item.id} className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
              <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-50">{item.name}</td>
              <td className="px-4 py-3 text-zinc-500">{item.description || "-"}</td>
              <td className="px-4 py-3"><Badge variant="outline">{item._count?.programmes ?? 0}</Badge></td>
              <td className="px-4 py-3"><div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => openEdit(item)}><Edit className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(item)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
              </div></td>
            </tr>
          ))}
        </tbody></table></div>
      </CardContent></Card>

      {modal.mode && (
        <Modal title={modal.mode === "create" ? "Create Career" : "Edit Career"} onClose={() => setModal({ mode: null })}>
          <div className="space-y-4">
            <div><label className="mb-1 block text-sm font-medium">Name *</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50" /></div>
            <div><label className="mb-1 block text-sm font-medium">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50" /></div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setModal({ mode: null })}>Cancel</Button>
              <Button onClick={handleSubmit}><Save className="mr-1 h-4 w-4" /> {modal.mode === "create" ? "Create" : "Save"}</Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

// ==================== KEYWORDS TAB ====================
function KeywordsTab({ page, setPage, search, setSearch, showToast }: any) {
  const { data, isLoading } = useAdminKeywords(page, 50, search || undefined);
  const createMutation = useCreateKeyword();
  const updateMutation = useUpdateKeyword();
  const deleteMutation = useDeleteKeyword();

  const [modal, setModal] = useState<{ mode: ModalMode; item?: any }>({ mode: null });
  const [word, setWord] = useState("");

  const items = useMemo(() => {
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data)) return data;
    return [];
  }, [data]);

  const handleCreate = async () => {
    if (!word.trim()) return;
    try { await createMutation.mutateAsync({ word: word.trim() }); showToast("success", "Keyword created"); setWord(""); }
    catch (err: any) { showToast("error", err.message); }
  };

  const handleDelete = async (item: any) => {
    if (!confirm(`Delete keyword "${item.word}"?`)) return;
    try { await deleteMutation.mutateAsync(item.id); showToast("success", "Keyword deleted"); }
    catch (err: any) { showToast("error", err.message); }
  };

  return (
    <>
      <div className="mb-4 flex items-center gap-3">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input type="text" placeholder="Search keywords..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-10 pr-4 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50" /></div>
        <input type="text" placeholder="New keyword..." value={word} onChange={(e) => setWord(e.target.value)}
          className="rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50" />
        <Button onClick={handleCreate} className="gap-1"><Plus className="h-4 w-4" /> Add</Button>
      </div>

      <Card><CardContent className="p-0">
        <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-zinc-200 dark:border-zinc-800">
          <th className="px-4 pb-3 pt-4 text-left font-medium text-zinc-500">Word</th>
          <th className="px-4 pb-3 pt-4 text-left font-medium text-zinc-500">Programmes</th>
          <th className="px-4 pb-3 pt-4 text-left font-medium text-zinc-500">Actions</th>
        </tr></thead><tbody>
          {isLoading ? [1,2,3].map(i => <TableRowSkeleton key={i} cols={3} />)
          : items.length === 0 ? <tr><td colSpan={3} className="py-12 text-center text-zinc-500">No keywords found</td></tr>
          : items.map((item: any) => (
            <tr key={item.id} className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
              <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-50">{item.word}</td>
              <td className="px-4 py-3"><Badge variant="outline">{item._count?.programmes ?? 0}</Badge></td>
              <td className="px-4 py-3">
                <Button variant="ghost" size="icon" onClick={() => handleDelete(item)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
              </td>
            </tr>
          ))}
        </tbody></table></div>
      </CardContent></Card>
    </>
  );
}

// ==================== ADMISSION RULES TAB ====================
function AdmissionRulesTab({ page, setPage, showToast }: any) {
  const { data, isLoading } = useAdminAdmissionRules(page, 50);
  const createMutation = useCreateAdmissionRule();
  const updateMutation = useUpdateAdmissionRule();
  const deleteMutation = useDeleteAdmissionRule();

  const [modal, setModal] = useState<{ mode: ModalMode; item?: any }>({ mode: null });
  const [form, setForm] = useState({ title: "", description: "", isActive: true });

  const items = useMemo(() => {
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data)) return data;
    return [];
  }, [data]);

  const openCreate = () => { setForm({ title: "", description: "", isActive: true }); setModal({ mode: "create" }); };
  const openEdit = (item: any) => { setForm({ title: item.title, description: item.description, isActive: item.isActive }); setModal({ mode: "edit", item }); };

  const handleSubmit = async () => {
    try {
      if (modal.mode === "create") { await createMutation.mutateAsync(form); showToast("success", "Admission rule created"); }
      else if (modal.mode === "edit" && modal.item) { await updateMutation.mutateAsync({ id: modal.item.id, input: form }); showToast("success", "Admission rule updated"); }
      setModal({ mode: null });
    } catch (err: any) { showToast("error", err.message); }
  };

  const handleDelete = async (item: any) => {
    if (!confirm("Delete this admission rule?")) return;
    try { await deleteMutation.mutateAsync(item.id); showToast("success", "Admission rule deleted"); }
    catch (err: any) { showToast("error", err.message); }
  };

  return (
    <>
      <div className="mb-4 flex items-center gap-3">
        <p className="text-sm text-zinc-500">Manage general admission rules for the university.</p>
        <Button onClick={openCreate} className="ml-auto gap-1"><Plus className="h-4 w-4" /> Add Rule</Button>
      </div>

      <Card><CardContent className="p-0">
        <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-zinc-200 dark:border-zinc-800">
          <th className="px-4 pb-3 pt-4 text-left font-medium text-zinc-500">Title</th>
          <th className="px-4 pb-3 pt-4 text-left font-medium text-zinc-500">Description</th>
          <th className="px-4 pb-3 pt-4 text-left font-medium text-zinc-500">Status</th>
          <th className="px-4 pb-3 pt-4 text-left font-medium text-zinc-500">Actions</th>
        </tr></thead><tbody>
          {isLoading ? [1,2,3].map(i => <TableRowSkeleton key={i} cols={4} />)
          : items.length === 0 ? <tr><td colSpan={4} className="py-12 text-center text-zinc-500">No admission rules</td></tr>
          : items.map((item: any) => (
            <tr key={item.id} className="border-b border-zinc-100 dark:border-zinc-800">
              <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-50">{item.title}</td>
              <td className="max-w-md truncate px-4 py-3 text-zinc-500">{item.description}</td>
              <td className="px-4 py-3"><Badge variant={item.isActive ? "success" : "secondary"}>{item.isActive ? "Active" : "Inactive"}</Badge></td>
              <td className="px-4 py-3"><div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => openEdit(item)}><Edit className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(item)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
              </div></td>
            </tr>
          ))}
        </tbody></table></div>
      </CardContent></Card>

      {modal.mode && (
        <Modal title={modal.mode === "create" ? "Add Admission Rule" : "Edit Admission Rule"} onClose={() => setModal({ mode: null })}>
          <div className="space-y-4">
            <div><label className="mb-1 block text-sm font-medium">Title *</label>
              <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50" /></div>
            <div><label className="mb-1 block text-sm font-medium">Description *</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4}
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50" /></div>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} id="isActive" />
              <label htmlFor="isActive" className="text-sm">Active</label>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setModal({ mode: null })}>Cancel</Button>
              <Button onClick={handleSubmit}><Save className="mr-1 h-4 w-4" /> {modal.mode === "create" ? "Create" : "Save"}</Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

// ==================== ANNOUNCEMENTS TAB ====================
function AnnouncementsTab({ showToast }: any) {
  const [publishedFilter, setPublishedFilter] = useState<string>("");
  const { data, isLoading } = useAdminAnnouncements(publishedFilter === "true" ? true : publishedFilter === "false" ? false : undefined);
  const createMutation = useCreateAnnouncement();
  const toggleMutation = useToggleAnnouncement();
  const deleteMutation = useDeleteAnnouncement();

  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ title: "", content: "" });

  const items = useMemo(() => {
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data)) return data;
    return [];
  }, [data]);

  const handleCreate = async () => {
    try { await createMutation.mutateAsync(form); showToast("success", "Announcement created"); setModal(false); setForm({ title: "", content: "" }); }
    catch (err: any) { showToast("error", err.message); }
  };

  const handleToggle = async (id: string) => {
    try { await toggleMutation.mutateAsync(id); showToast("success", "Announcement toggled"); }
    catch (err: any) { showToast("error", err.message); }
  };

  const handleDelete = async (item: any) => {
    if (!confirm(`Delete announcement "${item.title}"?`)) return;
    try { await deleteMutation.mutateAsync(item.id); showToast("success", "Announcement deleted"); }
    catch (err: any) { showToast("error", err.message); }
  };

  return (
    <>
      <div className="mb-4 flex items-center gap-3">
        <select value={publishedFilter} onChange={(e) => setPublishedFilter(e.target.value)}
          className="rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50">
          <option value="">All</option>
          <option value="true">Published</option>
          <option value="false">Draft</option>
        </select>
        <Button onClick={() => setModal(true)} className="ml-auto gap-1"><Plus className="h-4 w-4" /> New Announcement</Button>
      </div>

      <div className="space-y-3">
        {isLoading ? [1,2,3].map(i => <Card key={i}><CardContent className="p-4"><StatsCardSkeleton /></CardContent></Card>)
: items.length === 0 ? <EmptyState icon="inbox" title="No announcements" description="Create your first announcement to get started" />
        : items.map((item: any) => (
          <Card key={item.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-zinc-900 dark:text-zinc-50">{item.title}</h3>
                    <Badge variant={item.published ? "success" : "secondary"}>{item.published ? "Published" : "Draft"}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-zinc-500">{item.content}</p>
                  <p className="mt-2 text-xs text-zinc-400">
                    By {item.author?.firstName} {item.author?.lastName} • {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => handleToggle(item.id)} title={item.published ? "Unpublish" : "Publish"}>
                    {item.published ? <ToggleRight className="h-4 w-4 text-green-500" /> : <ToggleLeft className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(item)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {modal && (
        <Modal title="Create Announcement" onClose={() => setModal(false)}>
          <div className="space-y-4">
            <div><label className="mb-1 block text-sm font-medium">Title *</label>
              <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50" /></div>
            <div><label className="mb-1 block text-sm font-medium">Content *</label>
              <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={5}
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50" /></div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setModal(false)}>Cancel</Button>
              <Button onClick={handleCreate}><Save className="mr-1 h-4 w-4" /> Publish</Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

// ==================== DUPLICATES TAB ====================
function DuplicatesTab() {
  const { data: facultyDupes, isLoading: floading } = useDuplicateFaculties();
  const { data: programmeDupes, isLoading: ploading } = useDuplicateProgrammes();
  const { data: subjectDupes, isLoading: sloading } = useDuplicateSubjects();

  const faculties = useMemo(() => { const d = facultyDupes?.data; return Array.isArray(d) ? d : []; }, [facultyDupes]);
  const programmes = useMemo(() => { const d = programmeDupes?.data; return Array.isArray(d) ? d : []; }, [programmeDupes]);
  const subjects = useMemo(() => { const d = subjectDupes?.data; return Array.isArray(d) ? d : []; }, [subjectDupes]);

  return (
    <div className="space-y-6">
      {/* Faculty Duplicates */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Building2 className="h-4 w-4" /> Faculty Duplicates</CardTitle></CardHeader>
        <CardContent>
          {floading ? <StatsCardSkeleton /> : faculties.length === 0 ? (
            <p className="text-sm text-green-600"><CheckCircle className="mr-1 inline h-4 w-4" /> No duplicate faculties found</p>
          ) : faculties.map((group: any) => (
            <div key={group.name} className="mb-3 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900 dark:bg-red-900/20">
              <p className="mb-2 text-sm font-medium text-red-700 dark:text-red-400">
                <AlertTriangle className="mr-1 inline h-4 w-4" /> "{group.name}" appears {group.count} times
              </p>
              {group.items?.map((item: any) => (
                <p key={item.id} className="ml-6 text-xs text-zinc-600 dark:text-zinc-400">• ID: {item.id} ({item.abbreviation})</p>
              ))}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Programme Duplicates */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><GraduationCap className="h-4 w-4" /> Programme Duplicates</CardTitle></CardHeader>
        <CardContent>
          {ploading ? <StatsCardSkeleton /> : programmes.length === 0 ? (
            <p className="text-sm text-green-600"><CheckCircle className="mr-1 inline h-4 w-4" /> No duplicate programmes found</p>
          ) : programmes.map((group: any, i: number) => (
            <div key={i} className="mb-3 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900 dark:bg-red-900/20">
              <p className="mb-2 text-sm font-medium text-red-700 dark:text-red-400">
                <AlertTriangle className="mr-1 inline h-4 w-4" /> Duplicate {group.field}: "{group.value}" ({group.count} times)
              </p>
              {group.items?.map((item: any) => (
                <p key={item.id} className="ml-6 text-xs text-zinc-600 dark:text-zinc-400">• {item.code} - {item.name}</p>
              ))}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Subject Duplicates */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><BookOpen className="h-4 w-4" /> Subject Duplicates</CardTitle></CardHeader>
        <CardContent>
          {sloading ? <StatsCardSkeleton /> : subjects.length === 0 ? (
            <p className="text-sm text-green-600"><CheckCircle className="mr-1 inline h-4 w-4" /> No duplicate subjects found</p>
          ) : subjects.map((group: any) => (
            <div key={group.name} className="mb-3 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900 dark:bg-red-900/20">
              <p className="mb-2 text-sm font-medium text-red-700 dark:text-red-400">
                <AlertTriangle className="mr-1 inline h-4 w-4" /> "{group.name}" appears {group.count} times
              </p>
              {group.items?.map((item: any) => (
                <p key={item.id} className="ml-6 text-xs text-zinc-600 dark:text-zinc-400">• ID: {item.id} ({item.level})</p>
              ))}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

// ==================== REQUIREMENTS TAB ====================
function RequirementsTab({ showToast }: any) {
  const [selectedProgrammeId, setSelectedProgrammeId] = useState("");
  const { data: programmesData } = useAdminProgrammes(1, 200);
  const { data: subjectsData } = useAdminSubjects(1, 200);
  const { data: reqsData, isLoading: reqsLoading } = useProgrammeRequirements(selectedProgrammeId || null);
  const createMutation = useCreateProgrammeRequirement();
  const updateMutation = useUpdateProgrammeRequirement();
  const deleteMutation = useDeleteProgrammeRequirement();

  const programmes = useMemo(() => {
    const d = programmesData?.data || programmesData;
    return Array.isArray(d) ? d : [];
  }, [programmesData]);

  const subjects = useMemo(() => {
    const d = subjectsData?.data || subjectsData;
    return Array.isArray(d) ? d : [];
  }, [subjectsData]);

  const requirements = useMemo(() => {
    const d = reqsData?.data?.requirements || reqsData?.requirements;
    return Array.isArray(d) ? d : [];
  }, [reqsData]);

  const [modal, setModal] = useState<{ mode: ModalMode; item?: any }>({ mode: null });
  const [form, setForm] = useState({ subjectId: "", requirementType: "REQUIRED", minimumGrade: "" });

  const openCreate = () => {
    if (!selectedProgrammeId) { showToast("error", "Select a programme first"); return; }
    setForm({ subjectId: "", requirementType: "REQUIRED", minimumGrade: "" });
    setModal({ mode: "create" });
  };

  const openEdit = (item: any) => {
    setForm({ subjectId: item.subjectId, requirementType: item.requirementType, minimumGrade: item.minimumGrade || "" });
    setModal({ mode: "edit", item });
  };

  const handleSubmit = async () => {
    try {
      if (modal.mode === "create") {
        await createMutation.mutateAsync({ programmeId: selectedProgrammeId, input: form });
        showToast("success", "Requirement added");
      } else if (modal.mode === "edit" && modal.item) {
        await updateMutation.mutateAsync({ id: modal.item.id, input: { requirementType: form.requirementType, minimumGrade: form.minimumGrade } });
        showToast("success", "Requirement updated");
      }
      setModal({ mode: null });
    } catch (err: any) {
      showToast("error", err.message);
    }
  };

  const handleDelete = async (item: any) => {
    if (!confirm("Remove this requirement?")) return;
    try {
      await deleteMutation.mutateAsync(item.id);
      showToast("success", "Requirement removed");
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
            onChange={(e) => setSelectedProgrammeId(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
          >
            <option value="">Select a programme...</option>
            {programmes.map((p: any) => (
              <option key={p.id} value={p.id}>{p.code} - {p.name}</option>
            ))}
          </select>
        </div>
        <Button onClick={openCreate} className="gap-1" disabled={!selectedProgrammeId}>
          <Plus className="h-4 w-4" /> Add Requirement
        </Button>
      </div>

      {selectedProgrammeId && (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800">
                    <th className="px-4 pb-3 pt-4 text-left font-medium text-zinc-500">Subject</th>
                    <th className="px-4 pb-3 pt-4 text-left font-medium text-zinc-500">Level</th>
                    <th className="px-4 pb-3 pt-4 text-left font-medium text-zinc-500">Type</th>
                    <th className="px-4 pb-3 pt-4 text-left font-medium text-zinc-500">Min Grade</th>
                    <th className="px-4 pb-3 pt-4 text-left font-medium text-zinc-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reqsLoading ? [1, 2, 3].map((i) => <TableRowSkeleton key={i} cols={5} />)
                  : requirements.length === 0 ? (
                    <tr><td colSpan={5} className="py-12 text-center text-zinc-500">No requirements for this programme</td></tr>
                  ) : requirements.map((req: any) => (
                    <tr key={req.id} className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                      <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-50">{req.subject?.name}</td>
                      <td className="px-4 py-3"><Badge variant="outline">{req.subject?.level?.replace("_", " ")}</Badge></td>
                      <td className="px-4 py-3"><Badge variant={req.requirementType === "REQUIRED" ? "default" : "secondary"}>{req.requirementType}</Badge></td>
                      <td className="px-4 py-3 text-zinc-600">{req.minimumGrade || "-"}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" onClick={() => openEdit(req)}><Edit className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(req)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
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
            <p className="text-zinc-500">Select a programme to manage its admission requirements</p>
          </CardContent>
        </Card>
      )}

      {modal.mode && (
        <Modal title={modal.mode === "create" ? "Add Requirement" : "Edit Requirement"} onClose={() => setModal({ mode: null })}>
          <div className="space-y-4">
            {modal.mode === "create" && (
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Subject *</label>
                <select value={form.subjectId} onChange={(e) => setForm({ ...form, subjectId: e.target.value })}
                  className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50">
                  <option value="">Select subject...</option>
                  {subjects.map((s: any) => (
                    <option key={s.id} value={s.id}>{s.name} ({s.level.replace("_", " ")})</option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Requirement Type</label>
              <select value={form.requirementType} onChange={(e) => setForm({ ...form, requirementType: e.target.value })}
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50">
                <option value="REQUIRED">Required</option>
                <option value="OPTIONAL">Optional</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Minimum Grade</label>
              <input type="text" value={form.minimumGrade} onChange={(e) => setForm({ ...form, minimumGrade: e.target.value })}
                placeholder="e.g. C6, D, etc."
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50" />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setModal({ mode: null })}>Cancel</Button>
              <Button onClick={handleSubmit}><Save className="mr-1 h-4 w-4" /> {modal.mode === "create" ? "Add" : "Save"}</Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

// ==================== IMPORT TAB ====================
function ImportTab({ showToast }: any) {
  const [importType, setImportType] = useState("faculties");
  const [jsonInput, setJsonInput] = useState("");
  const [step, setStep] = useState<"input" | "preview" | "result">("input");
  const [validationResult, setValidationResult] = useState<any>(null);
  const [importResult, setImportResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const validateMutation = useImportValidate();
  const previewMutation = useImportPreview();
  const confirmMutation = useImportConfirm();

  const importTypes = [
    { value: "faculties", label: "Faculties" },
    { value: "departments", label: "Departments" },
    { value: "programmes", label: "Programmes" },
    { value: "subjects", label: "Subjects" },
    { value: "requirements", label: "Requirements" },
    { value: "tuition", label: "Tuition" },
    { value: "careers", label: "Careers" },
  ];

  const parsedData = useMemo(() => {
    try {
      const p = JSON.parse(jsonInput);
      return Array.isArray(p) ? p : [];
    } catch {
      return [];
    }
  }, [jsonInput]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        setJsonInput(JSON.stringify(Array.isArray(parsed) ? parsed : [parsed], null, 2));
      } catch {
        showToast("error", "Invalid JSON file");
      }
    };
    reader.readAsText(file);
  };

  const handleValidate = async () => {
    if (!jsonInput.trim()) { showToast("error", "Please enter JSON data"); return; }
    if (parsedData.length === 0) { showToast("error", "No valid JSON array found"); return; }
    setLoading(true);
    try {
      const res = await validateMutation.mutateAsync({ type: importType, data: parsedData });
      setValidationResult(res.data || res);
      setStep("preview");
    } catch (err: any) {
      showToast("error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    setLoading(true);
    try {
      const res = await confirmMutation.mutateAsync({ type: importType, data: parsedData });
      setImportResult(res.data || res);
      setStep("result");
      showToast("success", "Import completed");
    } catch (err: any) {
      showToast("error", err.message);
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
        <select value={importType} onChange={(e) => { setImportType(e.target.value); setStep("input"); setValidationResult(null); setImportResult(null); }}
          className="rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50">
          {importTypes.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
        <label className="cursor-pointer rounded-lg border border-zinc-200 px-3 py-2 text-sm hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800">
          <Upload className="mr-1 inline h-4 w-4" /> Upload JSON
          <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
        </label>
        <Button onClick={handleValidate} disabled={loading || !jsonInput.trim()} className="ml-auto gap-1">
          {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
          Validate
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          {step === "input" && (
            <>
              <p className="mb-2 text-sm text-zinc-500">Paste JSON array data for {importTypes.find(t => t.value === importType)?.label}:</p>
              <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                rows={10}
                placeholder={`[\n  { "name": "Example", ... },\n  { "name": "Example 2", ... }\n]`}
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 font-mono text-xs dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
              />
              <p className="mt-1 text-xs text-zinc-400">{parsedData.length} rows parsed</p>
            </>
          )}

          {step === "preview" && validationResult && (
            <>
              <div className="mb-3 flex items-center gap-3">
                <Badge variant={validationResult.valid ? "success" : "secondary"}>
                  {validationResult.valid ? "Valid" : "Has Errors"}
                </Badge>
                <span className="text-sm text-zinc-500">
                  {validationResult.validRows}/{validationResult.totalRows} valid rows
                </span>
                {validationResult.errorRows > 0 && (
                  <span className="text-sm text-red-500">{validationResult.errorRows} error(s)</span>
                )}
              </div>

              {validationResult.errors?.length > 0 && (
                <div className="mb-3 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900 dark:bg-red-900/20">
                  <p className="mb-1 text-sm font-medium text-red-700 dark:text-red-400">Errors:</p>
                  {validationResult.errors.slice(0, 10).map((err: any, i: number) => (
                    <p key={i} className="text-xs text-red-600 dark:text-red-300">Row {err.row}: {err.field} - {err.message}</p>
                  ))}
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-200 dark:border-zinc-800">
                      {validationResult.preview?.[0] && Object.keys(validationResult.preview[0]).filter(k => !k.startsWith("_")).map((key: string) => (
                        <th key={key} className="px-3 pb-2 pt-1 text-left font-medium text-zinc-500">{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {validationResult.preview?.slice(0, 20).map((row: any, i: number) => (
                      <tr key={i} className={`border-b border-zinc-100 dark:border-zinc-800 ${!row._valid ? 'bg-red-50 dark:bg-red-900/10' : ''}`}>
                        {Object.entries(row).filter(([k]) => !k.startsWith("_")).map(([key, val]: any, j: number) => (
                          <td key={j} className="px-3 py-2 text-xs text-zinc-700 dark:text-zinc-300">
                            {typeof val === 'object' ? JSON.stringify(val) : String(val ?? '')}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {validationResult.preview?.length > 20 && (
                  <p className="py-2 text-center text-xs text-zinc-400">Showing 20 of {validationResult.preview.length} rows</p>
                )}
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <Button variant="outline" onClick={handleReset}>Cancel</Button>
                <Button onClick={handleImport} disabled={loading || !validationResult.valid}>
                  {loading ? <RefreshCw className="mr-1 h-4 w-4 animate-spin" /> : <Upload className="mr-1 h-4 w-4" />}
                  Confirm Import ({validationResult.validRows} rows)
                </Button>
              </div>
            </>
          )}

          {step === "result" && importResult && (
            <div className="py-4 text-center">
              <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
              <h3 className="mt-3 text-lg font-semibold text-zinc-900 dark:text-zinc-50">{importResult.message}</h3>
              <div className="mt-4 flex justify-center gap-6">
                <div>
                  <p className="text-2xl font-bold text-green-600">{importResult.created}</p>
                  <p className="text-sm text-zinc-500">Created</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-zinc-400">{importResult.skipped || 0}</p>
                  <p className="text-sm text-zinc-500">Skipped</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-500">{importResult.errors?.length || 0}</p>
                  <p className="text-sm text-zinc-500">Errors</p>
                </div>
              </div>
              {importResult.errors?.length > 0 && (
                <div className="mt-4 text-left">
                  <p className="mb-1 text-sm font-medium text-red-500">Errors:</p>
                  {importResult.errors.map((err: any, i: number) => (
                    <p key={i} className="text-xs text-red-400">{err.item}: {err.reason}</p>
                  ))}
                </div>
              )}
              <Button className="mt-4" onClick={handleReset}>Import More</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}

// ==================== ANALYTICS TAB ====================
function AnalyticsTab() {
  const { data: statsData } = useAdminStats();
  const { data: userStatsData } = useUserStats();
  const { data: facultiesData } = useProgrammesByFaculty();
  const { data: popularSearchesData } = usePopularSearches(10);
  const { data: recentSearchesData } = useRecentSearches(10);

  const stats = useMemo(() => {
    const s = statsData?.data || statsData;
    if (!s) return null;
    return [
      { label: "Programmes", value: s.totalProgrammes ?? 0, color: "bg-blue-500" },
      { label: "Faculties", value: s.totalFaculties ?? 0, color: "bg-purple-500" },
      { label: "Departments", value: s.totalDepartments ?? 0, color: "bg-indigo-500" },
      { label: "Subjects", value: s.totalSubjects ?? 0, color: "bg-teal-500" },
      { label: "Users", value: s.totalUsers ?? 0, color: "bg-green-500" },
      { label: "Searches", value: s.totalSearches ?? 0, color: "bg-orange-500" },
    ];
  }, [statsData]);

  const userRoles = useMemo(() => {
    const d = userStatsData?.data || userStatsData;
    return d?.byRole || [];
  }, [userStatsData]);

  const faculties = useMemo(() => {
    const d = facultiesData?.data || facultiesData;
    return Array.isArray(d) ? d : [];
  }, [facultiesData]);

  const popularSearches = useMemo(() => {
    const d = popularSearchesData?.data || popularSearchesData;
    return Array.isArray(d) ? d : [];
  }, [popularSearchesData]);

  const recentSearches = useMemo(() => {
    const d = recentSearchesData?.data || recentSearchesData;
    return Array.isArray(d) ? d : [];
  }, [recentSearchesData]);

  const maxStatValue = Math.max(...(stats?.map(s => s.value) || [1]), 1);

  const maxFacultyProgrammes = Math.max(...faculties.map((f: any) => f.programmeCount || 0), 1);
  const maxSearchCount = Math.max(...popularSearches.map((s: any) => s.count || 0), 1);

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <Card>
        <CardHeader><CardTitle className="text-base">System Overview</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stats?.map((stat) => (
              <div key={stat.label} className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
                <p className="text-sm text-zinc-500">{stat.label}</p>
                <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">{stat.value}</p>
                <div className="mt-2 h-2 w-full rounded-full bg-zinc-100 dark:bg-zinc-800">
                  <div className={`h-2 rounded-full ${stat.color}`} style={{ width: `${(stat.value / maxStatValue) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* User Roles Distribution */}
        <Card>
          <CardHeader><CardTitle className="text-base">Users by Role</CardTitle></CardHeader>
          <CardContent>
            {userRoles.length > 0 ? (
              <div className="space-y-3">
                {userRoles.map((r: any) => {
                  const total = userRoles.reduce((acc: number, u: any) => acc + u.count, 0);
                  const pct = total > 0 ? Math.round((r.count / total) * 100) : 0;
                  return (
                    <div key={r.role}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="font-medium text-zinc-700 dark:text-zinc-300">{r.role}</span>
                        <span className="text-zinc-500">{r.count} ({pct}%)</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-zinc-100 dark:bg-zinc-800">
                        <div className="h-2 rounded-full bg-blue-500" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="py-4 text-center text-sm text-zinc-400">No user data</p>
            )}
          </CardContent>
        </Card>

        {/* Programmes by Faculty Chart */}
        <Card>
          <CardHeader><CardTitle className="text-base">Programmes by Faculty</CardTitle></CardHeader>
          <CardContent>
            {faculties.length > 0 ? (
              <div className="space-y-2">
                {faculties.slice(0, 10).map((f: any) => (
                  <div key={f.id}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="text-zinc-700 dark:text-zinc-300">{f.abbreviation || f.name}</span>
                      <span className="text-zinc-500">{f.programmeCount}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-zinc-100 dark:bg-zinc-800">
                      <div className="h-2 rounded-full bg-indigo-500" style={{ width: `${(f.programmeCount / maxFacultyProgrammes) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-4 text-center text-sm text-zinc-400">No faculty data</p>
            )}
          </CardContent>
        </Card>

        {/* Popular Searches */}
        <Card>
          <CardHeader><CardTitle className="text-base">Popular Searches (Top 10)</CardTitle></CardHeader>
          <CardContent>
            {popularSearches.length > 0 ? (
              <div className="space-y-2">
                {popularSearches.map((s: any, i: number) => (
                  <div key={i}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="truncate text-zinc-700 dark:text-zinc-300">{s.query}</span>
                      <span className="text-zinc-500">{s.count}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-zinc-100 dark:bg-zinc-800">
                      <div className="h-2 rounded-full bg-orange-500" style={{ width: `${(s.count / maxSearchCount) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-4 text-center text-sm text-zinc-400">No search data</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Searches */}
        <Card>
          <CardHeader><CardTitle className="text-base">Recent Searches</CardTitle></CardHeader>
          <CardContent>
            {recentSearches.length > 0 ? (
              <div className="space-y-2">
                {recentSearches.map((s: any, i: number) => (
                  <div key={i} className="flex items-center justify-between border-b border-zinc-100 pb-2 dark:border-zinc-800">
                    <div>
                      <p className="text-sm text-zinc-700 dark:text-zinc-300">{s.query}</p>
                      <p className="text-xs text-zinc-400">
                        {s.user?.firstName} {s.user?.lastName}
                      </p>
                    </div>
                    <span className="text-xs text-zinc-400">{new Date(s.createdAt).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-4 text-center text-sm text-zinc-400">No recent searches</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

