"use client";

import Link from "next/link";
import { ArrowLeft, Check, Pencil, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/lib/hooks/useAuth";
import { Button } from "@/components/ui/button";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatRole(role: string) {
  return role
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function ProfilePage() {
  const { profile, isAuthenticated, isLoading, updateProfile } = useAuth();

  const [editing, setEditing] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName || "");
      setLastName(profile.lastName || "");
    }
  }, [profile]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-paper">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="h-5 w-28 animate-pulse rounded bg-paper-soft" />
          <div className="mt-8 h-10 w-56 animate-pulse rounded bg-paper-soft" />
          <div className="mt-3 h-5 w-80 max-w-full animate-pulse rounded bg-paper-soft" />
          <div className="mt-8 h-96 animate-pulse rounded-card border border-rule bg-paper-soft" />
        </div>
      </main>
    );
  }

  if (!isAuthenticated || !profile) {
    return (
      <main className="min-h-screen bg-paper">
        <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
          <User className="mx-auto h-10 w-10 text-muted" />

          <h1 className="mt-5 text-2xl font-bold text-primary">
            Sign in to view your profile
          </h1>

          <p className="mt-2 text-sm leading-6 text-muted">
            Your profile is available after you sign in to your USPA account.
          </p>

          <Link href="/login" className="mt-6 inline-block">
            <Button variant="primary">Log in</Button>
          </Link>
        </div>
      </main>
    );
  }

  const isAdmin =
    profile.role === "ADMIN" || profile.role === "SUPER_ADMIN";

  const handleCancel = () => {
    setFirstName(profile.firstName || "");
    setLastName(profile.lastName || "");
    setEditing(false);
    updateProfile.reset();
  };

  const handleSave = () => {
    updateProfile.mutate(
      {
        firstName,
        lastName,
      },
      {
        onSuccess: () => {
          setEditing(false);
        },
      },
    );
  };

  return (
    <main className="min-h-screen bg-paper">
      <section className="border-b border-rule bg-paper-soft">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link
              href={isAdmin ? "/admin" : "/"}
              className="inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              {isAdmin ? "Back to Dashboard" : "Back to Home"}
            </Link>

            {isAdmin && (
              <Link
                href="/admin"
                className="text-sm font-semibold text-accent transition-colors hover:text-accent-dark"
              >
                Admin Dashboard
              </Link>
            )}
          </div>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#1B2A4A] text-white dark:bg-[#2A3F66]">
              <User className="h-7 w-7" />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                Account
              </p>

              <h1 className="mt-1 text-3xl font-bold tracking-tight text-primary">
                Your profile
              </h1>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-card border border-rule bg-paper">
            <div className="flex items-center justify-between border-b border-rule px-5 py-5 sm:px-7">
              <div>
                <h2 className="text-lg font-semibold text-primary">
                  Personal information
                </h2>
                <p className="mt-1 text-sm text-muted">
                  Keep your account information up to date.
                </p>
              </div>

              {!editing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    updateProfile.reset();
                    setEditing(true);
                 }}
                  className="gap-2"
                >
                  <Pencil className="h-4 w-4" />
                  Edit
                </Button>
              )}
            </div>

            <div className="grid gap-6 p-5 sm:grid-cols-2 sm:p-7">
              <div>
                <label
                  htmlFor="firstName"
                  className="mb-2 block text-sm font-medium text-primary"
                >
                  First name
                </label>

                {editing ? (
                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full rounded-lg border border-rule bg-paper px-3 py-2.5 text-sm text-primary outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20"
                  />
                ) : (
                  <p className="rounded-lg border border-rule bg-paper-soft px-3 py-2.5 text-sm text-primary">
                    {profile.firstName}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="mb-2 block text-sm font-medium text-primary"
                >
                  Last name
                </label>

                {editing ? (
                  <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full rounded-lg border border-rule bg-paper px-3 py-2.5 text-sm text-primary outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20"
                  />
                ) : (
                  <p className="rounded-lg border border-rule bg-paper-soft px-3 py-2.5 text-sm text-primary">
                    {profile.lastName}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-primary"
                >
                  Email address
                </label>

                <p
                  id="email"
                  className="rounded-lg border border-rule bg-paper-soft px-3 py-2.5 text-sm text-muted"
                >
                  {profile.email}
                </p>

                <p className="mt-1.5 text-xs text-muted">
                  Email address cannot be changed here.
                </p>
              </div>

              {editing && (
                <div className="sm:col-span-2">
                  {updateProfile.isError && (
                    <p className="mb-4 text-sm text-red-600 dark:text-red-400">
                      {updateProfile.error instanceof Error
                        ? updateProfile.error.message
                        : "Unable to update your profile."}
                    </p>
                  )}

                  <div className="flex flex-col gap-2 border-t border-rule pt-5 sm:flex-row">
                    <Button
                      variant="primary"
                      onClick={handleSave}
                      disabled={
                        updateProfile.isPending ||
                        !firstName.trim() ||
                        !lastName.trim()
                      }
                      className="gap-2"
                    >
                      <Check className="h-4 w-4" />
                      {updateProfile.isPending
                        ? "Saving..."
                        : "Save changes"}
                    </Button>

                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      disabled={updateProfile.isPending}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div className="rounded-card border border-rule bg-paper p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                Account type
              </p>
              <p className="mt-2 text-sm font-semibold text-primary">
                {formatRole(profile.role)}
              </p>
            </div>

            <div className="rounded-card border border-rule bg-paper p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                Account status
              </p>
              <p className="mt-2 text-sm font-semibold text-primary">
                {profile.isActive ? "Active" : "Inactive"}
              </p>
            </div>

            <div className="rounded-card border border-rule bg-paper p-5 sm:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                Member since
              </p>
              <p className="mt-2 text-sm font-semibold text-primary">
                {formatDate(profile.createdAt)}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}