import Link from "next/link";
import { GraduationCap, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                <GraduationCap className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-zinc-900 dark:text-zinc-50">USPA</span>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              UBa Smart Programme Advisor — helping prospective students discover academic programmes at the University of Bamenda.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-50">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { href: "/programmes", label: "Browse Programmes" },
                { href: "/faculties", label: "Faculties & Departments" },
                { href: "/admission-checker", label: "Check Eligibility" },
                { href: "/ai-advisor", label: "AI Advisor" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-50">Resources</h3>
            <ul className="space-y-2">
              {[
                { href: "#", label: "Admission Requirements" },
                { href: "#", label: "Academic Calendar" },
                { href: "#", label: "Tuition & Fees" },
                { href: "#", label: "FAQ" },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-50">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                <span>University of Bamenda, Bambili, Cameroon</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                <Mail className="h-4 w-4 shrink-0" />
                <span>admissions@uba.cm</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                <Phone className="h-4 w-4 shrink-0" />
                <span>+237 233 123 456</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-zinc-200 pt-6 dark:border-zinc-800">
          <p className="text-center text-xs text-zinc-400 dark:text-zinc-500">
            &copy; {new Date().getFullYear()} University of Bamenda. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

