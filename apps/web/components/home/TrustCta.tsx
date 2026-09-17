import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TrustCta() {
  return (
    <section id="advisor" className="bg-primary text-white">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-16">
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto] lg:gap-16">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-muted">Before you apply</p>
            <h2 className="mt-3 max-w-[650px] text-3xl font-semibold leading-tight tracking-[-0.045em] sm:text-4xl">Use the guidance. Verify the decision.</h2>
            <p className="mt-4 max-w-[630px] text-[15px] leading-7 text-white/70">USPA helps you search, compare, and review listed requirements. It does not replace the institution&apos;s final admissions decision.</p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Link href="/admission-checker">
              <Button variant="accent" className="min-h-11 gap-2 rounded-control">Check eligibility <ArrowRight className="h-4 w-4" aria-hidden="true" /></Button>
            </Link>
            <Link href="/programmes">
              <Button variant="outline" className="min-h-11 rounded-control border-white/30 bg-transparent text-white hover:border-accent-muted hover:bg-white/5">Browse programmes</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
