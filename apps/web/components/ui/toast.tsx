"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/app/lib/utils";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType>({
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
});

export function useToast() {
  return useContext(ToastContext);
}

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const colors = {
  success: "border-green-500 bg-green-50 dark:bg-green-950 dark:border-green-800",
  error: "border-red-500 bg-red-50 dark:bg-red-950 dark:border-red-800",
  info: "border-blue-500 bg-blue-50 dark:bg-blue-950 dark:border-blue-800",
  warning: "border-yellow-500 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800",
};

const iconColors = {
  success: "text-green-600 dark:text-green-400",
  error: "text-red-600 dark:text-red-400",
  info: "text-blue-600 dark:text-blue-400",
  warning: "text-yellow-600 dark:text-yellow-400",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substring(2);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      {/* Toast Container */}
      {toasts.length > 0 && (
        <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
          {toasts.map((toast) => {
            const Icon = icons[toast.type];
            return (
              <div
                key={toast.id}
                className={cn(
                  "flex items-center gap-3 rounded-lg border px-4 py-3 shadow-lg animate-fade-in min-w-[300px]",
                  colors[toast.type]
                )}
              >
                <Icon className={cn("h-5 w-5 shrink-0", iconColors[toast.type])} />
                <p className="flex-1 text-sm font-medium text-zinc-900 dark:text-zinc-50">
                  {toast.message}
                </p>
                <button onClick={() => removeToast(toast.id)} className="shrink-0 text-zinc-400 hover:text-zinc-600">
                  <X className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </ToastContext.Provider>
  );
}

