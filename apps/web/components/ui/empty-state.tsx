import { Search, BookOpen, Heart, Inbox, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface EmptyStateProps {
  icon?: "search" | "book" | "heart" | "inbox" | "alert";
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
  };
}

const icons = {
  search: Search,
  book: BookOpen,
  heart: Heart,
  inbox: Inbox,
  alert: AlertCircle,
};

export function EmptyState({ icon = "inbox", title, description, action }: EmptyStateProps) {
  const Icon = icons[icon];

  return (
    <div className="flex flex-col items-center py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
        <Icon className="h-8 w-8 text-zinc-400 dark:text-zinc-500" />
      </div>
      <h2 className="mt-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">{title}</h2>
      <p className="mt-2 max-w-sm text-zinc-500 dark:text-zinc-400">{description}</p>
      {action && (
        <Link href={action.href}>
          <Button className="mt-6">{action.label}</Button>
        </Link>
      )}
    </div>
  );
}

