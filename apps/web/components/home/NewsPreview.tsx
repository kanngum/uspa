"use client";

import Link from "next/link";
import { CalendarDays, ArrowRight } from "lucide-react";

type Announcement = {
  id: string;
  slug: string;
  title: string;
  content: string;
  createdAt: string;
  programme?: {
    id: string;
    name: string;
    code: string;
  } | null;
};

type NewsPreviewProps = {
  announcements: Announcement[];
  isLoading?: boolean;
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function excerpt(content: string) {
  const text = content.replace(/<[^>]*>/g, "").trim();

  if (text.length <= 140) return text;

  return `${text.slice(0, 140).trim()}...`;
}

export function NewsPreview({
  announcements,
  isLoading = false,
}: NewsPreviewProps) {
  return (
    <section className="border-t border-rule bg-paper py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-accent">
              News
            </p>

            <h2 className="text-2xl font-bold tracking-tight text-primary sm:text-3xl">
              Latest from USPA
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
              Stay updated with important announcements and programme news.
            </p>
          </div>

          <Link
            href="/programmes"
            className="hidden shrink-0 items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-accent sm:flex"
          >
            View programmes
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-48 animate-pulse rounded-card border border-rule bg-paper-soft"
              />
            ))}
          </div>
        ) : announcements.length === 0 ? (
          <div className="rounded-card border border-rule bg-paper-soft p-8 text-center">
            <p className="text-sm text-muted">
              No news announcements are available at the moment.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {announcements.slice(0, 3).map((announcement) => (
              <Link
                key={announcement.id}
                href={`/news/${announcement.slug}`}
                className="group block"
              >
                <article className="h-full rounded-card border border-rule bg-paper p-6 transition-all hover:-translate-y-0.5 hover:border-accent hover:shadow-sm">
                  <div className="mb-4 flex items-center gap-2 text-xs text-muted">
                    <CalendarDays className="h-4 w-4" />
                    <span>{formatDate(announcement.createdAt)}</span>
                  </div>

                  {announcement.programme && (
                    <span className="mb-3 inline-flex rounded-full bg-paper-soft px-2.5 py-1 text-[11px] font-semibold text-primary">
                      {announcement.programme.code}
                    </span>
                  )}

                  <h3 className="line-clamp-2 text-base font-semibold leading-6 text-primary">
                    {announcement.title}
                  </h3>

                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted">
                    {excerpt(announcement.content)}
                  </p>
                </article>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-6 sm:hidden">
          <Link
            href="/programmes"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent"
          >
            View programmes
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}