"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  GraduationCap,
  Link2,
  Share2,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { api } from "@/app/lib/api";

type Announcement = {
  id: string;
  slug: string;
  title: string;
  summary?: string | null;
  content: string;
  featuredImage?: string | null;

  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;

  applicationCycle?: string | null;
  applicationStatus?: string | null;
  applicationDeadline?: string | null;
  applicationUrl?: string | null;

  officialSourceUrl?: string | null;
  source?: string | null;
  sourceDocument?: string | null;
  lastVerified?: string | null;

  author?: {
    id: string;
    firstName: string;
    lastName: string;
  } | null;

  category?: {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    icon?: string | null;
  } | null;

  programme?: {
    id: string;
    name: string;
    code?: string | null;
  } | null;
};

function formatDate(value?: string | null) {
  if (!value) return "";

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function formatDateTime(value?: string | null) {
  if (!value) return "";

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function getApplicationStatus(status?: string | null) {
  if (!status) return null;

  const normalized = status.toLowerCase();

  if (normalized === "open") {
    return {
      label: "Applications Open",
      className:
        "border-green-200 bg-green-50 text-green-700 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-400",
    };
  }

  if (normalized === "closing soon") {
    return {
      label: "Closing Soon",
      className:
        "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-400",
    };
  }

  if (normalized === "closed") {
    return {
      label: "Applications Closed",
      className:
        "border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400",
    };
  }

  return {
    label: status,
    className:
      "border-rule bg-paper-soft text-primary dark:bg-zinc-800 dark:text-zinc-200",
  };
}

function renderContent(content: string) {
  return content
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export default function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [announcement, setAnnouncement] =
    useState<Announcement | null>(null);

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);

  const contentParagraphs = useMemo(
    () =>
      announcement
        ? renderContent(announcement.content)
        : [],
    [announcement],
  );

  useEffect(() => {
    let active = true;

    async function loadAnnouncement() {
      try {
        setLoading(true);

        const { slug } = await params;
        const response = await api.getAnnouncementBySlug(slug);

        if (!active) return;

        if (response?.success && response.data) {
          setAnnouncement(response.data);
          setNotFound(false);
        } else {
          setNotFound(true);
        }
      } catch {
        if (active) {
          setNotFound(true);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadAnnouncement();

    return () => {
      active = false;
    };
  }, [params]);

  const handleShare = async () => {
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: announcement?.title || "USPA News",
          text: announcement?.summary || undefined,
          url,
        });

        return;
      }

      await navigator.clipboard.writeText(url);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      // User cancelled the share dialog or clipboard was unavailable.
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white dark:bg-zinc-950">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="animate-pulse">
            <div className="h-4 w-28 rounded bg-zinc-200 dark:bg-zinc-800" />

            <div className="mt-8 h-10 max-w-3xl rounded bg-zinc-200 dark:bg-zinc-800 sm:h-14" />

            <div className="mt-4 h-5 max-w-2xl rounded bg-zinc-200 dark:bg-zinc-800" />

            <div className="mt-8 aspect-[16/8] w-full rounded-2xl bg-zinc-200 dark:bg-zinc-800" />

            <div className="mx-auto mt-10 max-w-3xl space-y-4">
              <div className="h-4 rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-4 rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-4 w-11/12 rounded bg-zinc-200 dark:bg-zinc-800" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (notFound || !announcement) {
    return (
      <main className="min-h-screen bg-white dark:bg-zinc-950">
        <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-paper-soft dark:bg-zinc-900">
            <FileText className="h-6 w-6 text-zinc-500" />
          </div>

          <h1 className="mt-5 text-2xl font-bold tracking-tight text-primary dark:text-zinc-50 sm:text-3xl">
            News article not found
          </h1>

          <p className="mt-3 max-w-md text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            The news article you are looking for may have been removed,
            unpublished, or the link may be incorrect.
          </p>

          <Link href="/news" className="mt-7">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to news
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  const applicationStatus = getApplicationStatus(
    announcement.applicationStatus,
  );

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950">
      <article>
        <header className="border-b border-rule dark:border-zinc-800">
          <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
            <Link
              href="/news"
              className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition-colors hover:text-primary dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to news
            </Link>

            <div className="mt-8 max-w-4xl">
              <div className="flex flex-wrap items-center gap-2">
                {announcement.category?.name && (
                  <span className="rounded-full border border-rule bg-paper-soft px-3 py-1 text-xs font-semibold text-primary dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">
                    {announcement.category.name}
                  </span>
                )}

                {applicationStatus && (
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${applicationStatus.className}`}
                  >
                    {applicationStatus.label}
                  </span>
                )}
              </div>

              <h1 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-primary dark:text-zinc-50 sm:text-4xl lg:text-5xl">
                {announcement.title}
              </h1>

              {announcement.summary && (
                <p className="mt-5 max-w-3xl text-base leading-7 text-zinc-600 dark:text-zinc-300 sm:text-lg sm:leading-8">
                  {announcement.summary}
                </p>
              )}

              <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-zinc-500 dark:text-zinc-400">
                <div className="inline-flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  <span>
                    {formatDate(
                      announcement.publishedAt ||
                        announcement.createdAt,
                    )}
                  </span>
                </div>

                {announcement.author && (
                  <div className="inline-flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>
                      {announcement.author.firstName}{" "}
                      {announcement.author.lastName}
                    </span>
                  </div>
                )}

                {announcement.updatedAt &&
                  announcement.updatedAt !==
                    announcement.createdAt && (
                    <div className="inline-flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>
                        Updated {formatDate(announcement.updatedAt)}
                      </span>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          {announcement.featuredImage && (
            <div className="overflow-hidden rounded-2xl border border-rule bg-paper-soft shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <img
                src={announcement.featuredImage}
                alt={announcement.title}
                className="h-auto max-h-[560px] w-full object-cover"
              />
            </div>
          )}

          <div
            className={`mt-10 grid gap-10 ${
              announcement.applicationUrl ||
              announcement.programme ||
              announcement.applicationDeadline ||
              announcement.officialSourceUrl
                ? "lg:grid-cols-[minmax(0,1fr)_300px]"
                : "lg:grid-cols-[minmax(0,760px)]"
            }`}
          >
            <div className="min-w-0">
              <div className="prose prose-zinc max-w-none dark:prose-invert">
                {contentParagraphs.map((paragraph, index) => (
                  <p
                    key={`${announcement.id}-${index}`}
                    className="mb-6 text-[15px] leading-7 text-zinc-700 dark:text-zinc-300 sm:text-base sm:leading-8"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {(announcement.applicationUrl ||
              announcement.programme ||
              announcement.applicationDeadline ||
              announcement.applicationCycle ||
              announcement.officialSourceUrl ||
              announcement.source ||
              announcement.sourceDocument) && (
              <aside className="lg:sticky lg:top-6 lg:self-start">
                <div className="overflow-hidden rounded-2xl border border-rule bg-paper-soft dark:border-zinc-800 dark:bg-zinc-900">
                  <div className="border-b border-rule px-5 py-4 dark:border-zinc-800">
                    <h2 className="text-sm font-bold text-primary dark:text-zinc-50">
                      Important information
                    </h2>
                  </div>

                  <div className="space-y-5 p-5">
                    {announcement.applicationCycle && (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                          Application cycle
                        </p>
                        <p className="mt-1 text-sm font-medium text-zinc-800 dark:text-zinc-200">
                          {announcement.applicationCycle}
                        </p>
                      </div>
                    )}

                    {announcement.applicationDeadline && (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                          Application deadline
                        </p>
                        <p className="mt-1 text-sm font-medium text-zinc-800 dark:text-zinc-200">
                          {formatDate(
                            announcement.applicationDeadline,
                          )}
                        </p>
                      </div>
                    )}

                    {announcement.programme && (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                          Related programme
                        </p>

                        <div className="mt-2 flex items-start gap-2">
                          <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-accent" />

                          <div>
                            <p className="text-sm font-medium leading-5 text-zinc-800 dark:text-zinc-200">
                              {announcement.programme.name}
                            </p>

                            {announcement.programme.code && (
                              <p className="mt-1 text-xs text-zinc-500">
                                {announcement.programme.code}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      {announcement.applicationUrl && (
                        <a
                          href={announcement.applicationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block"
                        >
                          <Button className="min-h-11 w-full justify-center gap-2 rounded-control">
                            Apply now
                            <ArrowUpRight className="h-4 w-4" />
                          </Button>
                        </a>
                      )}

                      <Link
                        href="/admission-checker"
                        className="block"
                      >
                        <Button
                          variant="outline"
                          className="min-h-11 w-full justify-center rounded-control"
                        >
                          Check eligibility
                        </Button>
                      </Link>

                      {announcement.programme && (
                        <Link
                          href={`/programmes/${announcement.programme.id}`}
                          className="flex min-h-11 w-full items-center justify-center gap-2 rounded-control border border-rule-strong bg-white px-4 text-sm font-semibold text-primary transition hover:-translate-y-0.5 hover:border-accent dark:bg-zinc-950 dark:text-zinc-50"
                        >
                          View programme
                          <ArrowUpRight className="h-4 w-4" />
                        </Link>
                      )}
                    </div>

                    {(announcement.source ||
                      announcement.sourceDocument ||
                      announcement.officialSourceUrl) && (
                      <div className="border-t border-rule pt-5 dark:border-zinc-800">
                        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                          Source
                        </p>

                        {announcement.source && (
                          <p className="mt-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            {announcement.source}
                          </p>
                        )}

                        {announcement.sourceDocument && (
                          <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                            {announcement.sourceDocument}
                          </p>
                        )}

                        {announcement.officialSourceUrl && (
                          <a
                            href={announcement.officialSourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-accent-dark hover:underline dark:text-accent"
                          >
                            Visit official source
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}

                        {announcement.lastVerified && (
                          <p className="mt-2 text-xs text-zinc-400">
                            Last verified{" "}
                            {formatDate(
                              announcement.lastVerified,
                            )}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </aside>
            )}
          </div>

          <div className="mt-12 flex flex-col gap-4 border-t border-rule pt-6 dark:border-zinc-800 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/news"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent-dark dark:text-zinc-200 dark:hover:text-accent"
            >
              <ArrowLeft className="h-4 w-4" />
              More news
            </Link>

            <Button
              variant="outline"
              onClick={handleShare}
              className="min-h-11 gap-2 rounded-control"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Link copied
                </>
              ) : (
                <>
                  <Share2 className="h-4 w-4" />
                  Share
                </>
              )}
            </Button>
          </div>

          <div className="mt-8 flex items-center gap-2 text-xs text-zinc-400">
            <Link2 className="h-3.5 w-3.5" />
            <span>{formatDateTime(announcement.publishedAt)}</span>
          </div>
        </div>
      </article>
    </main>
  );
}