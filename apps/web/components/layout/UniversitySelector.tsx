
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { GraduationCap, Check, Building2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useUniversity } from "@/app/lib/context/UniversityContext";

export function UniversitySelector() {
  const { universities, isLoading, showSelector, setSelectedUniversity, selectedUniversity, setShowSelector } = useUniversity();
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Reset focused index when list changes
  useEffect(() => {
    setFocusedIndex(-1);
  }, [universities.length]);

  // Focus management
  useEffect(() => {
    if (focusedIndex >= 0 && buttonRefs.current[focusedIndex]) {
      buttonRefs.current[focusedIndex]?.focus();
    }
  }, [focusedIndex]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const listLength = universities.length;
    if (listLength === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setFocusedIndex((prev) => (prev < listLength - 1 ? prev + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : listLength - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < listLength) {
          setSelectedUniversity(universities[focusedIndex]);
        } else if (selectedUniversity) {
          setShowSelector(false);
        }
        break;
      case "Escape":
        e.preventDefault();
        if (selectedUniversity) {
          setShowSelector(false);
        }
        break;
    }
  }, [focusedIndex, universities, selectedUniversity, setSelectedUniversity, setShowSelector]);

  if (!showSelector) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/45 p-4 backdrop-blur-[2px]"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <Card className="mx-auto w-full max-w-lg overflow-hidden border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-950">
        <CardHeader className="border-b border-zinc-100 px-5 py-5 text-center dark:border-zinc-800">
          {/*<div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">
          <GraduationCap className="h-5 w-5" />
          </div>*/}

          <CardTitle className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Welcome to USPA
          </CardTitle>

          <CardDescription className="mx-auto mt-1.5 max-w-md text-[13px] leading-5 text-zinc-500 dark:text-zinc-400">
            {/*Select your university to discover programmes, check eligibility, and get AI-powered guidance.*/}
            <span className="mt-1.5 block text-[11px] text-zinc-400 dark:text-zinc-500">
              Use ↑↓ to navigate, Enter to select, Esc to close
            </span>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3 px-5 py-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-zinc-400" />
              <span className="ml-2 text-sm text-zinc-500">
                Loading universities...
              </span>
            </div>
          ) : universities.length === 0 ? (
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-center text-sm text-yellow-700 dark:border-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400">
              No universities found in the system.
            </div>
          ) : (
            <div className="max-h-64 space-y-1.5 overflow-y-auto pr-1">
              {universities.map((uni, index) => {
                const isSelected = selectedUniversity?.id === uni.id;
                const isFocused = focusedIndex === index;

                return (
                  <button
                    key={uni.id}
                    ref={(el) => {
                      buttonRefs.current[index] = el;
                    }}
                    onClick={() => setSelectedUniversity(uni)}
                    onMouseEnter={() => setFocusedIndex(index)}
                    onFocus={() => setFocusedIndex(index)}
                    tabIndex={isFocused ? 0 : -1}
                    className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors ${
                      isSelected
                        ? "border-zinc-900 bg-zinc-50 dark:border-zinc-200 dark:bg-zinc-900"
                        : isFocused
                          ? "border-zinc-300 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900"
                          : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700 dark:hover:bg-zinc-900"
                    }`}
                  >
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                        isSelected
                          ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                          : "bg-zinc-100 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400"
                      }`}
                    >
                      <Building2 className="h-4 w-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-semibold text-zinc-900 dark:text-zinc-50">
                        {uni.name}
                      </p>

                      <p className="truncate text-[11px] leading-4 text-zinc-500 dark:text-zinc-400">
                        {uni.abbreviation}
                        {uni.description ? ` — ${uni.description.substring(0, 80)}` : ""}
                      </p>
                    </div>

                    {isSelected && (
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-900 dark:bg-white">
                        <Check className="h-3.5 w-3.5 text-white dark:text-zinc-900" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {selectedUniversity && universities.length > 1 && (
            <div className="flex justify-center border-t border-zinc-100 pt-3 dark:border-zinc-800">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSelector(false)}
                className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                Continue with {selectedUniversity.name}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}