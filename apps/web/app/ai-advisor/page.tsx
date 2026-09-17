"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { Bot, Send, User, Sparkles, GraduationCap, ChevronRight, Clock, Building2, Check, X, AlertTriangle, Info, HelpCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { useAskAi } from "@/app/lib/hooks/useAi";
import { useUniversity } from "@/app/lib/context/UniversityContext";

interface ProgrammeResult {
  id?: string;
  name: string;
  code: string;
  degree?: string;
  faculty: string | null;
  relevance?: string;
  duration?: number;
  tuition?: number;
  level?: string;
}

interface EligibilityCategory {
  eligible: (ProgrammeResult & { reasons: string[] })[];
  conditional: (ProgrammeResult & { missing: string[] })[];
  notEligible: (ProgrammeResult & { missing: string[] })[];
  generalRules: string[];
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  suggestions?: string[];
  programmes?: ProgrammeResult[];
  eligibilityCategories?: EligibilityCategory;
  timestamp: Date;
  isTyping?: boolean;
}

const welcomeSuggestions = [
  "I have Biology, Chemistry and Geography. What can I study?",
  "Which programmes accept Computer Science and Mathematics?",
  "What are the requirements for Medicine (MBBS)?",
  "Show me programmes offered in the Faculty of Science",
  "I want to become a software engineer",
  "What careers can I pursue with a Law degree?",
];

function generateId() {
  return `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export default function AiAdvisorPage() {
  const { selectedUniversity } = useUniversity();
  const uniName = selectedUniversity?.name || "your university";
  const [messages, setMessages] = useState<Message[]>([
    {
      id: generateId(),
      role: "assistant",
      content: "👋 **Hello! I'm the USPA AI Advisor.**\n\nI can help you discover programmes, check if your subjects match, explore career paths, and learn about faculties at " + uniName + ".\n\n**Try asking me:**\n• *\"What can I study with Biology and Chemistry?\"*\n• *\"I want to become an engineer\"*\n• *\"Show me programmes in FEMS\"*\n• *\"What are the requirements for Computer Science?\"*",
      suggestions: welcomeSuggestions.slice(0, 4),
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [conversationContext, setConversationContext] = useState<{
    lastTopic?: string;
    lastSubjects?: string[];
    lastCareer?: string;
    lastFaculty?: string;
  }>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();
  const askAi = useAskAi();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when not loading
  useEffect(() => {
    if (!askAi.isPending) {
      inputRef.current?.focus();
    }
  }, [askAi.isPending]);

  const addMessage = useCallback((msg: Message) => {
    setMessages((prev) => [...prev, msg]);
  }, []);

  const handleSend = async (message?: string) => {
    const text = (message || input).trim();
    if (!text || askAi.isPending) return;

    setInput("");

    // Add user message
    const userMsg: Message = {
      id: generateId(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };
    addMessage(userMsg);

    // Add a typing indicator
    const typingId = generateId();
    const typingMsg: Message = {
      id: typingId,
      role: "assistant",
      content: "",
      timestamp: new Date(),
      isTyping: true,
    };
    addMessage(typingMsg);

    askAi.mutate(
      {
        query: text,
        subjects: conversationContext.lastSubjects,
      },
      {
        onSuccess: (data: any) => {
          const result = data?.data || data;
          const aiMessage = result.message || result.content || "Here's what I found. Could you provide more details so I can help you better?";
          const programmes = result.programmes || [];
          const eligibilityCategories = result.eligibilityCategories;
          const suggestions = (result.suggestions || welcomeSuggestions.slice(0, 3)).slice(0, 4);

// Update conversation context
          const newContext = { ...conversationContext };
          if (programmes.length > 0) newContext.lastTopic = "programmes";
          if (text.toLowerCase().includes("career") || text.toLowerCase().includes("become") || text.toLowerCase().includes("job")) {
            newContext.lastCareer = text;
          }
          if (programmes.length > 0 && programmes[0].faculty) {
            newContext.lastFaculty = programmes[0].faculty;
          }
          setConversationContext(newContext);

          // Replace typing indicator with real response
          setMessages((prev) =>
            prev.map((m) =>
              m.id === typingId
                ? {
                    id: m.id,
                    role: "assistant",
                    content: aiMessage,
                    suggestions,
                    programmes: programmes.length > 0 ? programmes : undefined,
                    eligibilityCategories: eligibilityCategories,
                    timestamp: new Date(),
                  }
                : m
            )
          );
        },
        onError: (error: any) => {
          addToast(error?.message || "Failed to get AI response", "error");
          // Replace typing with error
          setMessages((prev) =>
            prev.map((m) =>
              m.id === typingId
                ? {
                    id: m.id,
                    role: "assistant",
                    content: "I'm sorry, I couldn't process your request right now. Please try again or rephrase your question.",
                    suggestions: welcomeSuggestions.slice(0, 3),
                    timestamp: new Date(),
                  }
                : m
            )
          );
        },
      }
    );
  };

  const handleSuggestedClick = (question: string) => {
    handleSend(question);
  };

  const handleReset = () => {
    const uniName = selectedUniversity?.name || "your university";
    setMessages([
      {
        id: generateId(),
        role: "assistant",
        content: "👋 **Hello again!** The conversation has been reset. How can I help you explore programmes at " + uniName + "?",
        suggestions: welcomeSuggestions.slice(0, 4),
        timestamp: new Date(),
      },
    ]);
    setConversationContext({});
    inputRef.current?.focus();
  };

  const handleWhyNotClick = (programmeName: string) => {
    handleSend(`Why can't I study ${programmeName}?`);
  };

  const formatMessage = (content: string) => {
    // Convert markdown-like formatting to HTML
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>');
  };

  // Render programme card with optional status color
  const renderProgrammeCard = (prog: any, index: number, statusColor?: string, statusBadge?: string) => (
    <div key={prog.code || index} className="flex items-start gap-3">
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
          statusColor === "green"
            ? "bg-green-100 dark:bg-green-900/40"
            : statusColor === "red"
            ? "bg-red-100 dark:bg-red-900/40"
            : statusColor === "yellow"
            ? "bg-yellow-100 dark:bg-yellow-900/40"
            : "bg-purple-100 dark:bg-purple-900/40"
        }`}
      >
        <GraduationCap
          className={`h-4 w-4 ${
            statusColor === "green"
              ? "text-green-600 dark:text-green-400"
              : statusColor === "red"
              ? "text-red-600 dark:text-red-400"
              : statusColor === "yellow"
              ? "text-yellow-600 dark:text-yellow-400"
              : "text-purple-600 dark:text-purple-400"
          }`}
        />
      </div>
      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{prog.name}</p>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
              {prog.code && <span className="font-mono">{prog.code}</span>}
              {prog.faculty && (
                <span className="flex items-center gap-0.5">
                  <Building2 className="h-3 w-3" /> {prog.faculty}
                </span>
              )}
              {prog.duration && (
                <span className="flex items-center gap-0.5">
                  <Clock className="h-3 w-3" /> {prog.duration} yrs
                </span>
              )}
              {statusBadge && (
                <Badge
                  variant={
                    statusColor === "green"
                      ? "success"
                      : statusColor === "yellow"
                      ? "warning"
                      : "destructive"
                  }
                  className="text-[10px]"
                >
                  {statusBadge}
                </Badge>
              )}
            </div>
          </div>
        </div>
        {/* Reasons / missing subjects */}
        {prog.reasons && prog.reasons.length > 0 && (
          <div className="mt-2 space-y-0.5">
            {prog.reasons.slice(0, 3).map((r: string, i: number) => (
              <p key={i} className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                <Check className="h-3 w-3" /> {r.replace(" ✓", "")}
              </p>
            ))}
          </div>
        )}
        {prog.missing && prog.missing.length > 0 && (
          <div className="mt-2 space-y-0.5">
            {prog.missing.slice(0, 3).map((m: string, i: number) => (
              <p key={i} className="flex items-center gap-1 text-xs text-red-500 dark:text-red-400">
                <X className="h-3 w-3" /> Missing: {m}
              </p>
            ))}
          </div>
        )}
        {/* Why not button for ineligible programmes */}
        {prog.missing && prog.missing.length > 0 && (
          <button
            onClick={() => handleWhyNotClick(prog.name)}
            className="mt-1 flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
          >
            <HelpCircle className="h-3 w-3" /> Why can't I study this?
          </button>
        )}
      </div>
      {prog.code && (
        <Link href={`/programmes/${prog.code}`}>
          <ChevronRight className="h-4 w-4 shrink-0 text-zinc-400 hover:text-zinc-600" />
        </Link>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-blue-500 shadow-lg">
          <Sparkles className="h-7 w-7 text-white" />
        </div>
        <h1 className="mt-4 text-3xl font-bold text-zinc-900 dark:text-zinc-50">AI Programme Advisor</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Your intelligent assistant for discovering programmes, checking requirements, and planning your academic journey.
        </p>
      </div>

      <Card className="overflow-hidden border-zinc-200 dark:border-zinc-800">
        {/* Chat Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 bg-gradient-to-r from-purple-50 to-blue-50 px-4 py-3 dark:border-zinc-800 dark:from-purple-950/30 dark:to-blue-950/30">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/40">
              <Bot className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">USPA Advisor</p>
              <p className="text-xs text-green-600 dark:text-green-400">● Online</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span className="mr-1 hidden text-xs text-zinc-500 sm:inline">Context-aware</span>
            <Button variant="ghost" size="sm" onClick={handleReset} className="gap-1 text-xs" title="Reset conversation">
              <RefreshCw className="h-3.5 w-3.5" /> Reset
            </Button>
          </div>
        </div>

        {/* Messages */}
        <CardContent className="h-[520px] overflow-y-auto p-4">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
                {msg.role === "assistant" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                    <Bot className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                )}
                <div className={`max-w-[85%] ${msg.role === "user" ? "order-1" : ""}`}>
                  {/* Typing indicator */}
                  {msg.isTyping ? (
                    <div className="rounded-2xl bg-zinc-100 px-4 py-3 dark:bg-zinc-800">
                      <div className="flex items-center gap-1.5">
                        <div className="h-2 w-2 animate-bounce rounded-full bg-zinc-400" style={{ animationDelay: "0ms" }} />
                        <div className="h-2 w-2 animate-bounce rounded-full bg-zinc-400" style={{ animationDelay: "150ms" }} />
                        <div className="h-2 w-2 animate-bounce rounded-full bg-zinc-400" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Message bubble */}
                      {msg.content && (
                        <div
                          className={`rounded-2xl px-4 py-3 ${
                            msg.role === "user"
                              ? "bg-blue-600 text-white"
                              : "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
                          }`}
                        >
                          <p
                            className="whitespace-pre-line text-sm leading-relaxed"
                            dangerouslySetInnerHTML={
                              msg.role === "assistant" ? { __html: formatMessage(msg.content) } : undefined
                            }
                          >
                            {msg.role === "user" ? msg.content : undefined}
                          </p>
                        </div>
                      )}

                      {/* Eligibility Categories - Grouped by Status */}
                      {msg.eligibilityCategories && (
                        <div className="mt-3 space-y-3">
                          {/* General Admission Rules */}
                          {msg.eligibilityCategories.generalRules && msg.eligibilityCategories.generalRules.length > 0 && (
                            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950/30">
                              <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-blue-700 dark:text-blue-300">
                                <Info className="h-3.5 w-3.5" /> General Admission Rules
                              </p>
                              {msg.eligibilityCategories.generalRules.map((rule: string, i: number) => (
                                <p key={i} className="text-xs text-blue-600 dark:text-blue-400">
                                  • {rule.substring(0, 100)}
                                </p>
                              ))}
                            </div>
                          )}

                          {/* Eligible Programmes */}
                          {msg.eligibilityCategories.eligible && msg.eligibilityCategories.eligible.length > 0 && (
                            <div className="rounded-lg border border-green-200 bg-green-50/50 p-3 dark:border-green-800 dark:bg-green-950/20">
                              <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-green-700 dark:text-green-300">
                                <Check className="h-4 w-4" /> You Qualify For
                              </p>
                              <div className="space-y-3">
                                {msg.eligibilityCategories.eligible.slice(0, 5).map((prog: any, j: number) =>
                                  renderProgrammeCard(prog, j, "green", "✅ Eligible")
                                )}
                              </div>
                            </div>
                          )}

                          {/* Conditional Programmes */}
                          {msg.eligibilityCategories.conditional && msg.eligibilityCategories.conditional.length > 0 && (
                            <div className="rounded-lg border border-yellow-200 bg-yellow-50/50 p-3 dark:border-yellow-800 dark:bg-yellow-950/20">
                              <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-yellow-700 dark:text-yellow-300">
                                <AlertTriangle className="h-4 w-4" /> You Partially Qualify For
                              </p>
                              <p className="mb-2 text-xs text-yellow-600 dark:text-yellow-400">(May need additional requirements)</p>
                              <div className="space-y-3">
                                {msg.eligibilityCategories.conditional.slice(0, 3).map((prog: any, j: number) =>
                                  renderProgrammeCard(prog, j, "yellow", "⚠️ Partial")
                                )}
                              </div>
                            </div>
                          )}

                          {/* Not Eligible Programmes */}
                          {msg.eligibilityCategories.notEligible && msg.eligibilityCategories.notEligible.length > 0 && (
                            <div className="rounded-lg border border-red-200 bg-red-50/50 p-3 dark:border-red-800 dark:bg-red-950/20">
                              <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-red-700 dark:text-red-300">
                                <X className="h-4 w-4" /> You Do NOT Qualify For
                              </p>
                              <div className="space-y-3">
                                {msg.eligibilityCategories.notEligible.slice(0, 5).map((prog: any, j: number) =>
                                  renderProgrammeCard(prog, j, "red", "❌ Not Eligible")
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Regular Programme cards (when no eligibility categories) */}
                      {!msg.eligibilityCategories && msg.programmes && msg.programmes.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {msg.programmes.map((prog: any, j: number) => (
                            <Link
                              key={prog.code || j}
                              href={`/programmes/${prog.code}`}
                              className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white p-3 transition-all hover:border-purple-300 hover:shadow-sm dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-purple-700"
                            >
                              <div className="flex items-start gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/40">
                                  <GraduationCap className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{prog.name}</p>
                                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                                    {prog.code && <span className="font-mono">{prog.code}</span>}
                                    {prog.faculty && (
                                      <span className="flex items-center gap-0.5">
                                        <Building2 className="h-3 w-3" /> {prog.faculty}
                                      </span>
                                    )}
                                    {prog.duration && (
                                      <span className="flex items-center gap-0.5">
                                        <Clock className="h-3 w-3" /> {prog.duration} yrs
                                      </span>
                                    )}
                                    {prog.relevance && (
                                      <Badge variant="secondary" className="text-[10px]">
                                        {prog.relevance}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <ChevronRight className="h-4 w-4 shrink-0 text-zinc-400" />
                            </Link>
                          ))}
                          <div className="flex gap-2">
                            <Link href={`/admission-checker?programme=${msg.programmes[0].code}`}>
                              <Button variant="outline" size="sm" className="gap-1 text-xs">
                                <Check className="h-3.5 w-3.5" /> Check Eligibility
                              </Button>
                            </Link>
                            <Link
                              href={`/compare?programmes=${msg.programmes
                                .slice(0, 3)
                                .map((p: any) => p.code)
                                .join(",")}`}
                            >
                              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                                Compare Programmes
                              </Button>
                            </Link>
                          </div>
                        </div>
                      )}

                      {/* Suggested follow-ups */}
                      {msg.suggestions && msg.suggestions.length > 0 && msg.role === "assistant" && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {msg.suggestions.map((s: string, j: number) => (
                            <button
                              key={j}
                              onClick={() => handleSuggestedClick(s)}
                              className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-600 transition-colors hover:bg-zinc-50 hover:border-purple-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:border-purple-700"
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
                {msg.role === "user" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                    <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>

        {/* Input */}
        <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask about programmes, requirements, or careers..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
            />
            <Button onClick={() => handleSend()} disabled={askAi.isPending || !input.trim()} variant="primary">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

