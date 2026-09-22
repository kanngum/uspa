"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, CalendarDays } from "lucide-react";
import { useAnnouncements } from "@/app/lib/hooks/useAnnouncements";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function excerpt(content: string) {
  const text = content.replace(/<[^>]*>/g, "").trim();

  if (text.length <= 180) return text;

  return `${text.slice(0, 180).trim()}...`;
}

export default function NewsPage() {
  const { data, isLoading, isError } = useAnnouncements();

  const announcements = data?.data ?? [];

  return (
    <main className="min-h-screen bg-paper">
      <section className="border-b border-rule bg-paper-soft">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>

          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-accent">
            News
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            Latest news and announcements
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted sm:text-base">
            Stay updated with important admissions announcements,
            programme news, and other updates from USPA.
          </p>
        </div>
      </section>

      <section className="py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="h-64 animate-pulse rounded-card border border-rule bg-paper-soft"
                />
              ))}
            </div>
          ) : isError ? (
            <div className="rounded-card border border-rule bg-paper-soft p-8 text-center">
              <p className="text-sm text-muted">
                We could not load the news at the moment.
              </p>
            </div>
          ) : announcements.length === 0 ? (
            <div className="rounded-card border border-rule bg-paper-soft p-8 text-center">
              <p className="text-sm text-muted">
                No news announcements are available at the moment.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {announcements.map((announcement) => (
                <Link
                  key={announcement.id}
                  href={`/news/${announcement.slug}`}
                  className="group block"
                >
                  <article className="h-full overflow-hidden rounded-card border border-rule bg-paper transition-all hover:-translate-y-0.5 hover:border-accent hover:shadow-sm">
                    {announcement.featuredImage ? (
                      <div className="aspect-[16/9] overflow-hidden bg-paper-soft">
                        <img
                          src={announcement.featuredImage}
                          alt={announcement.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        />
                      </div>
                    ) : (
                      <div className="flex aspect-[16/9] items-center justify-center border-b border-rule bg-paper-soft">
                        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                          USPA News
                        </span>
                      </div>
                    )}

                    <div className="p-6">
                      <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-muted">
                        <CalendarDays className="h-4 w-4" />
                        <span>
                          {formatDate(
                            announcement.publishedAt ||
                              announcement.createdAt,
                          )}
                        </span>

                        {announcement.category && (
                          <>
                            <span aria-hidden="true">•</span>
                            <span>{announcement.category.name}</span>
                          </>
                        )}
                      </div>

                      {announcement.programme && (
                        <span className="mb-3 inline-flex rounded-full bg-paper-soft px-2.5 py-1 text-[11px] font-semibold text-primary">
                          {announcement.programme.code}
                        </span>
                      )}

                      <h2 className="line-clamp-2 text-lg font-semibold leading-7 text-primary">
                        {announcement.title}
                      </h2>

                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted">
                        {announcement.summary ||
                          excerpt(announcement.content)}
                      </p>

                      <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent transition-colors group-hover:text-accent-dark">
                        Read article
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}