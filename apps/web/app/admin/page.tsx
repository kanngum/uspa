"use client";

import { useState, useMemo } from "react";
import { Shield, Users, BookOpen, Building2, TrendingUp, BarChart3, Plus, Search, Edit, Trash2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatsCardSkeleton, TableRowSkeleton } from "@/components/ui/loading";
import { EmptyState } from "@/components/ui/empty-state";
import { useAdminStats, useAdminProgrammes } from "@/app/lib/hooks/useAdmin";

const iconColors: Record<string, string> = {
  blue: "text-blue-600 dark:text-blue-400",
  green: "text-green-600 dark:text-green-400",
  purple: "text-purple-600 dark:text-purple-400",
  orange: "text-orange-600 dark:text-orange-400",
};

const iconBgs: Record<string, string> = {
  blue: "bg-blue-100 dark:bg-blue-900/30",
  green: "bg-green-100 dark:bg-green-900/30",
  purple: "bg-purple-100 dark:bg-purple-900/30",
  orange: "bg-orange-100 dark:bg-orange-900/30",
};

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [page, setPage] = useState(1);
  const { data: statsData, isLoading: statsLoading, isError: statsError } = useAdminStats();
  const { data: programmesData, isLoading: programmesLoading, isError: programmesError } = useAdminProgrammes(page);

  const stats = useMemo(() => {
    const s = statsData?.data || statsData;
    if (!s) return null;
    return [
      { title: "Total Programmes", value: s.totalProgrammes || s.programmeCount || "86", change: "+4 this month", icon: BookOpen, color: "blue" as const },
      { title: "Registered Users", value: s.totalUsers || s.userCount || "1,234", change: "+12% this month", icon: Users, color: "green" as const },
      { title: "Faculties", value: s.totalFaculties || s.facultyCount || "9", change: "Active", icon: Building2, color: "purple" as const },
      { title: "Search Queries", value: s.totalSearches || s.searchCount || "45.2K", change: "+18% vs last month", icon: TrendingUp, color: "orange" as const },
    ];
  }, [statsData]);

  const programmes = useMemo(() => {
    if (Array.isArray(programmesData?.data)) return programmesData.data;
    if (Array.isArray(programmesData)) return programmesData;
    return [];
  }, [programmesData]);

  const tabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "programmes", label: "Programmes" },
    { id: "users", label: "Users" },
    { id: "announcements", label: "Announcements" },
    { id: "analytics", label: "Analytics" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
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
      <div className="mb-6 border-b border-zinc-200 dark:border-zinc-800">
        <nav className="flex gap-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap pb-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "border-b-2 border-zinc-900 text-zinc-900 dark:border-zinc-50 dark:text-zinc-50"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === "dashboard" && (
        <>
          {/* Stats Cards */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statsLoading ? (
              <>
                <StatsCardSkeleton />
                <StatsCardSkeleton />
                <StatsCardSkeleton />
                <StatsCardSkeleton />
              </>
            ) : statsError ? (
              <div className="col-span-4">
                <EmptyState icon="alert" title="Failed to load stats" description="" />
              </div>
            ) : stats ? (
              stats.map((stat) => (
                <Card key={stat.title}>
                  <CardContent className="p-5">
                    <div className={`rounded-lg ${iconBgs[stat.color]} p-2 inline-flex`}>
                      <stat.icon className={`h-5 w-5 ${iconColors[stat.color]}`} />
                    </div>
                    <p className="mt-3 text-2xl font-bold text-zinc-900 dark:text-zinc-50">{stat.value}</p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">{stat.title}</p>
                    <p className="mt-1 text-xs text-green-600 dark:text-green-400">{stat.change}</p>
                  </CardContent>
                </Card>
              ))
            ) : null}
          </div>

          {/* Recent Programmes Table */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Programmes</CardTitle>
              <Button size="sm" className="gap-1">
                <Plus className="h-4 w-4" /> Add Programme
              </Button>
            </CardHeader>
            <CardContent>
              {programmesLoading ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-zinc-200 dark:border-zinc-800">
                        {["Code", "Name", "Faculty", "Status", "Actions"].map((h) => (
                          <th key={h} className="pb-3 text-left font-medium text-zinc-500">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <TableRowSkeleton key={i} cols={5} />
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : programmesError ? (
                <EmptyState icon="alert" title="Failed to load programmes" description="" />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-zinc-200 dark:border-zinc-800">
                        <th className="pb-3 text-left font-medium text-zinc-500">Code</th>
                        <th className="pb-3 text-left font-medium text-zinc-500">Name</th>
                        <th className="pb-3 text-left font-medium text-zinc-500">Faculty</th>
                        <th className="pb-3 text-left font-medium text-zinc-500">Status</th>
                        <th className="pb-3 text-left font-medium text-zinc-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {programmes.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-zinc-500">No programmes found</td>
                        </tr>
                      ) : (
                        programmes.slice(0, 10).map((prog: any) => (
                          <tr key={prog.id || prog.code} className="border-b border-zinc-100 dark:border-zinc-800">
                            <td className="py-3 text-zinc-600 dark:text-zinc-400">{prog.code}</td>
                            <td className="py-3 font-medium text-zinc-900 dark:text-zinc-50">{prog.name}</td>
                            <td className="py-3 text-zinc-600 dark:text-zinc-400">
                              {prog.department?.academicUnit?.abbreviation || prog.faculty || "N/A"}
                            </td>
                            <td className="py-3">
                              <Badge variant={(prog.isActive ?? true) ? "success" : "secondary"}>
                                {(prog.isActive ?? true) ? "active" : "inactive"}
                              </Badge>
                            </td>
                            <td className="py-3">
                              <div className="flex gap-1">
                                <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-red-500" /></Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {activeTab === "programmes" && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search programmes..."
                className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-10 pr-4 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
              />
            </div>
            <Button className="gap-1"><Plus className="h-4 w-4" /> Add Programme</Button>
          </div>
          <Card>
            <CardContent className="p-8 text-center text-zinc-500">
              <BookOpen className="mx-auto h-8 w-8 text-zinc-300" />
              <p className="mt-2">Full programme management interface with inline editing and bulk actions</p>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "users" && (
        <Card>
          <CardContent className="p-8 text-center text-zinc-500">
            <Users className="mx-auto h-8 w-8 text-zinc-300" />
            <p className="mt-2">User management with role assignment, activity logs, and access control</p>
          </CardContent>
        </Card>
      )}

      {activeTab === "announcements" && (
        <Card>
          <CardContent className="p-8 text-center text-zinc-500">
            <Building2 className="mx-auto h-8 w-8 text-zinc-300" />
            <p className="mt-2">Create and manage university announcements and admission notices</p>
          </CardContent>
        </Card>
      )}

      {activeTab === "analytics" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Search Trends</CardTitle>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center text-zinc-500">
              <BarChart3 className="h-8 w-8 text-zinc-300" />
              <p className="ml-2">Search analytics chart placeholder</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Programme Popularity</CardTitle>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center text-zinc-500">
              <TrendingUp className="h-8 w-8 text-zinc-300" />
              <p className="ml-2">Popularity metrics chart placeholder</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
