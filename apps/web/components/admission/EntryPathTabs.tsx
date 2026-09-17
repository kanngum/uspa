"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { BookOpen, FileText, UserCheck } from "lucide-react";
import type { ReactNode } from "react";
import type { StudentType } from "@/app/lib/types/eligibility";

interface EntryPathTabsProps {
  value: StudentType;
  onValueChange: (value: StudentType) => void;
  children: ReactNode;
}

const entryPaths: Array<{ value: StudentType; label: string; description: string; icon: typeof BookOpen }> = [
  { value: "FRESHMAN", label: "Freshman", description: "O/A Level subjects", icon: BookOpen },
  { value: "DIRECT_ENTRY", label: "Direct Entry", description: "Previous qualification", icon: FileText },
  { value: "TRANSFER", label: "Transfer", description: "Transfer record", icon: UserCheck },
];

export function EntryPathTabs({ value, onValueChange, children }: EntryPathTabsProps) {
  return (
    <Tabs.Root value={value} onValueChange={(nextValue) => onValueChange(nextValue as StudentType)}>
      <Tabs.List aria-label="Entry type" className="mx-auto grid max-w-2xl grid-cols-3 rounded-card border border-rule bg-white p-1.5 shadow-xs">
        {entryPaths.map((path) => {
          const Icon = path.icon;
          return (
            <Tabs.Trigger
              key={path.value}
              value={path.value}
              className="group flex min-h-14 items-center justify-center gap-2 rounded-control px-2 py-2 text-left text-sm text-muted-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="min-w-0">
                <span className="block font-semibold">{path.label}</span>
                <span className="hidden text-[11px] text-white/60 group-data-[state=inactive]:text-subtle-ink sm:block">{path.description}</span>
              </span>
            </Tabs.Trigger>
          );
        })}
      </Tabs.List>
      {children}
    </Tabs.Root>
  );
}
