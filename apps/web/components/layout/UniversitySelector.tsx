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
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <Card className="mx-4 w-full max-w-lg shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1B2A4A] to-[#0FA3B1]">
            <GraduationCap className="h-7 w-7 text-white" />
          </div>
          <CardTitle className="text-xl">Welcome to USPA</CardTitle>
          <CardDescription className="text-sm">
            Select your university to discover programmes, check eligibility, and get AI-powered guidance.
            <span className="block mt-1 text-xs text-zinc-400">Use ↑↓ to navigate, Enter to select, Esc to close</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
              <span className="ml-2 text-sm text-zinc-500">Loading universities...</span>
            </div>
          ) : universities.length === 0 ? (
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-center text-sm text-yellow-700 dark:border-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400">
              No universities found in the system.
            </div>
          ) : (
            universities.map((uni, index) => {
              const isSelected = selectedUniversity?.id === uni.id;
              const isFocused = focusedIndex === index;
              return (
                <button
                  key={uni.id}
                  ref={(el) => { buttonRefs.current[index] = el; }}
                  onClick={() => setSelectedUniversity(uni)}
                  onMouseEnter={() => setFocusedIndex(index)}
                  onFocus={() => setFocusedIndex(index)}
                  tabIndex={isFocused ? 0 : -1}
                  className={`flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left transition-all ${
                    isSelected
                      ? "border-[#0FA3B1] bg-[#0FA3B1]/5 dark:border-[#0FA3B1] dark:bg-[#0FA3B1]/10"
                      : isFocused
                        ? "border-[#0FA3B1]/50 bg-zinc-50 dark:border-[#0FA3B1]/30 dark:bg-zinc-800"
                        : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
                  }`}
                >
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                      isSelected
                        ? "bg-[#0FA3B1] text-white"
                        : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                    }`}
                  >
                    <Building2 className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-zinc-900 dark:text-zinc-50">{uni.name}</p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      {uni.abbreviation}
                      {uni.description ? ` — ${uni.description.substring(0, 80)}` : ""}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0FA3B1]">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                </button>
              );
            })
          )}
          {selectedUniversity && universities.length > 1 && (
            <div className="flex justify-center pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSelector(false)}
                className="text-xs text-zinc-500"
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

