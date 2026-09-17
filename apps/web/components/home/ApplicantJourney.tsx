import Link from "next/link";
import { ArrowRight, ArrowUpRight, Search, ShieldCheck, FileCheck, Compass } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Search the catalogue",
    description:
      "Use a programme name, subject, career, or code to find records in your selected university.",
    href: "/programmes",
    icon: Search,
  },
  {
    number: "02",
    title: "Check eligibility",
    description:
      "Enter the required O/A Level results or previous degree information for your path.",
    href: "/admission-checker",
    icon: ShieldCheck,
  },
  {
    number: "03",
    title: "Review the evidence",
    description:
      "See which listed requirements are met, missing, or need confirmation — without a made-up score.",
    icon: FileCheck,
  },
  {
    number: "04",
    title: "Choose a next step",
    description:
      "Open the programme record, compare options, or verify final details with admissions.",
    href: "/programmes",
    icon: Compass,
  },
];

export function ApplicantJourney() {
  return (
    <section id="eligibility" className="border-b border-rule bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">

        {/* Section heading */}
        <div className="text-center">
          <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-semibold leading-tight tracking-[-0.045em] text-primary sm:text-4xl">
             How it works
          </h2>
        </div>

        {/* Journey map */}
        <div className="relative mt-14">

          {/* Connecting line */}
          <div
            className="absolute left-[12.5%] right-[12.5%] top-8 hidden h-px bg-rule-strong lg:block"
            aria-hidden="true"
          />

          <div className="grid gap-8 lg:grid-cols-4 lg:gap-6">
            {steps.map((step, index) => {
              const Icon = step.icon;

              const content = (
                <div className="relative text-center">

                  {/* Journey node */}
                  <div className="relative z-10 mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-rule-strong bg-white shadow-sm transition-all group-hover:border-accent group-hover:shadow-md">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-paper-soft">
                      <Icon
                        className="h-5 w-5 text-accent"
                        aria-hidden="true"
                      />
                    </div>
                  </div>

                  {/* Step number */}
                  <p className="mt-5 font-mono text-[11px] font-semibold tracking-[0.12em] text-accent">
                    STEP {step.number}
                  </p>

                  {/* Title */}
                  <h3 className="mt-2 text-base font-semibold text-primary">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="mx-auto mt-2 max-w-[260px] text-[13px] leading-6 text-muted-ink">
                    {step.description}
                  </p>

                  {/* Action */}
                  {step.href && (
                    <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-accent-dark transition-colors group-hover:text-primary">
                      Open next step
                      <ArrowUpRight
                        className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        aria-hidden="true"
                      />
                    </span>
                  )}

                  {/* Mobile connector */}
                  {index < steps.length - 1 && (
                    <div
                      className="mx-auto mt-8 h-8 w-px bg-rule-strong lg:hidden"
                      aria-hidden="true"
                    />
                  )}
                </div>
              );

              return step.href ? (
                <Link
                  key={step.number}
                  href={step.href}
                  className="group block rounded-control focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                >
                  {content}
                </Link>
              ) : (
                <div key={step.number} className="group">
                  {content}
                </div>
              );
            })}
          </div>
        </div>

        {/* End point */}
        <div className="mt-10 hidden items-center justify-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-subtle-ink lg:flex">
          <span className="h-px w-8 bg-rule-strong" />
          Your next step
          <ArrowRight className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
          <span className="h-px w-8 bg-rule-strong" />
        </div>
      </div>
    </section>
  );
}