"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, Send, User, Sparkles, GraduationCap, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { useAskAi } from "@/app/lib/hooks/useAi";

interface Message {
  role: "user" | "assistant";
  content: string;
  suggestions?: string[];
  programmes?: Array<{ name: string; code: string; faculty: string }>;
}

const suggestedQuestions = [
  "I have Biology, Chemistry and Geography. What can I study?",
  "Which programmes accept Computer Science and Mathematics?",
  "What are the requirements for Medicine?",
  "What programmes are offered in the Faculty of Science?",
  "Which careers can I pursue with a Law degree?",
];

export default function AiAdvisorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm the USPA AI Advisor. I can help you find programmes, check requirements, and explore career options. Tell me about your subjects, qualifications, or interests!",
      suggestions: suggestedQuestions.slice(0, 3),
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { addToast } = useToast();
  const askAi = useAskAi();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (message?: string) => {
    const text = message || input;
    if (!text.trim() || askAi.isPending) return;

    const userMessage: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    askAi.mutate(
      { query: text },
      {
        onSuccess: (data: any) => {
          const result = data?.data || data;
          const response: Message = {
            role: "assistant",
            content: result.content || result.message || "Here's what I found based on your query. Could you provide more details so I can give you a more specific answer?",
            suggestions: result.suggestions || suggestedQuestions.slice(0, 3),
            programmes: result.programmes || result.recommendations || undefined,
          };
          setMessages((prev) => [...prev, response]);
        },
        onError: (error: any) => {
          addToast(error?.message || "Failed to get AI response", "error");
          setMessages((prev) => [...prev, {
            role: "assistant",
            content: "I'm sorry, I couldn't process your request. Please try again or rephrase your question.",
            suggestions: suggestedQuestions.slice(0, 3),
          }]);
        },
      }
    );
  };

  const handleSuggestedClick = (question: string) => {
    handleSend(question);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#1B2A4A]">
          <Sparkles className="h-6 w-6 text-[#0FA3B1]" />
        </div>
        <h1 className="mt-4 text-3xl font-bold text-zinc-900 dark:text-zinc-50">AI Programme Advisor</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Ask questions about programmes, requirements, careers, or anything academic at UBa.
        </p>
      </div>

      <Card className="border-zinc-200 dark:border-zinc-800">
        <CardContent className="h-[600px] overflow-y-auto p-4">
          <div className="space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
                {msg.role === "assistant" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                    <Bot className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                )}
                <div className={`max-w-[80%] ${msg.role === "user" ? "order-1" : ""}`}>
                  <div className={`rounded-2xl px-4 py-3 ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
                  }`}>
                    <p className="whitespace-pre-line text-sm leading-relaxed">{msg.content}</p>
                  </div>

                  {/* Programme suggestions */}
                  {msg.programmes && msg.programmes.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {msg.programmes.map((prog, j) => (
                        <a key={prog.code || j} href={`/programmes/${prog.code}`}
                          className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white p-3 transition-all hover:border-purple-200 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-purple-700"
                        >
                          <div className="flex items-center gap-2">
                            <GraduationCap className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                            <div>
                              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{prog.name}</p>
                              <p className="text-xs text-zinc-500">{prog.faculty}</p>
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-zinc-400" />
                        </a>
                      ))}
                    </div>
                  )}

                  {/* Suggested follow-ups */}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {msg.suggestions.map((s, j) => (
                        <button
                          key={j}
                          onClick={() => handleSuggestedClick(s)}
                          className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {msg.role === "user" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                    <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                )}
              </div>
            ))}

            {askAi.isPending && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                  <Bot className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="rounded-2xl bg-zinc-100 px-4 py-3 dark:bg-zinc-800">
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-zinc-400" style={{ animationDelay: "0ms" }} />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-zinc-400" style={{ animationDelay: "150ms" }} />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-zinc-400" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </CardContent>

        <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
          <div className="flex gap-2">
            <input
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
