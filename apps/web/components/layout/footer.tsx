import Link from "next/link";
import { GraduationCap, Mail, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-[#1B2A4A] dark:border-zinc-800 dark:bg-[#0A0F1A]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0FA3B1]">
                <GraduationCap className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-white">USPA</span>
            </div>
            <p className="text-sm text-zinc-400 dark:text-zinc-500">
              Smart Programme Advisor — helping prospective students discover academic programmes.
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-500">
              Platform by Bamenda Tech Research Center (BTRC).
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2">
          {[
                { href: "/programmes", label: "Browse Programmes" },
                { href: "/faculties", label: "Faculties & Departments" },
                { href: "/admission-checker", label: "Check Eligibility" },
                { href: "/ai-advisor", label: "AI Advisor" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-zinc-400 transition-colors hover:text-[#0FA3B1] dark:text-zinc-500 dark:hover:text-[#1DC4D4]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-white">Resources</h3>
            <ul className="space-y-2">
              {[
                { href: "/admission-checker", label: "Admission Requirements" },
                { href: "/programmes", label: "Academic Catalogue" },
                { href: "/programmes", label: "Tuition & Fees" },
                { href: "/ai-advisor", label: "Questions & Guidance" },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-zinc-400 transition-colors hover:text-[#0FA3B1] dark:text-zinc-500 dark:hover:text-[#1DC4D4]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-white">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-zinc-400 dark:text-zinc-500">
                <Mail className="h-4 w-4 shrink-0 text-[#0FA3B1]" />
                <span>btrcbambili@gmail.com</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-zinc-400 dark:text-zinc-500">
                <Phone className="h-4 w-4 shrink-0 text-[#0FA3B1]" />
                <span>+237683004478</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-zinc-700 pt-6 dark:border-zinc-800">
          <p className="text-center text-xs text-zinc-500 dark:text-zinc-600">
            &copy; {new Date().getFullYear()} USPA. Platform by Bamenda Tech Research Center (BTRC). All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

