"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Code2,
  Terminal,
  FileText,
  MessageSquare,
  Send,
  Copy,
  Check,
  Zap,
  Globe,
  GitBranch,
  ShieldCheck,
  RefreshCw,
  Layers,
  Cpu,
  ArrowRight,
} from "lucide-react";

interface Mode {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  placeholder: string;
  samplePrompts: string[];
}

const MODES: Mode[] = [
  {
    id: "architect",
    name: "Code & System Architect",
    description: "Production-grade system design, DB schemas, and fullstack code",
    icon: Code2,
    color: "from-blue-500 to-indigo-600",
    placeholder: "e.g., Design a scalable PostgreSQL schema and API contract for a multi-tenant SaaS application...",
    samplePrompts: [
      "Design a multi-tenant PostgreSQL schema with Row-Level Security (RLS)",
      "Write a production-ready Next.js Server Action with Zod validation and error handling",
      "Architect a real-time notification service using WebSockets and Redis pub/sub",
    ],
  },
  {
    id: "prompter",
    name: "Prompt Engineer",
    description: "Craft high-performance system instructions and agent workflows",
    icon: Terminal,
    color: "from-purple-500 to-pink-600",
    placeholder: "e.g., Turn my raw idea into a strict JSON-outputting system prompt for a code reviewer agent...",
    samplePrompts: [
      "Convert a loose task description into a strict role-based system prompt",
      "Create a few-shot prompt for converting unstructured customer reviews into sentiment JSON",
      "Design an autonomous subagent prompt with tool constraints and fallback rules",
    ],
  },
  {
    id: "summarizer",
    name: "Executive Summarizer",
    description: "Instant key takeaways, action plans, and risk assessments",
    icon: FileText,
    color: "from-amber-500 to-orange-600",
    placeholder: "e.g., Paste a long technical document, PR diff, or meeting transcript to extract action items...",
    samplePrompts: [
      "Summarize the key architectural trade-offs between Supabase vs PlanetScale",
      "Extract 5 critical security best practices for handling API secrets in Next.js",
      "Create an executive checklist for deploying a production web app on Vercel",
    ],
  },
  {
    id: "chat",
    name: "Gemini Intelligence",
    description: "Fast general reasoning, problem solving, and conversational AI",
    icon: MessageSquare,
    color: "from-emerald-500 to-teal-600",
    placeholder: "Ask anything about software development, algorithms, or technology stacks...",
    samplePrompts: [
      "Explain the differences between React 19 Server Components and Client Components",
      "How do I set up GitHub Actions CI/CD to run automatic linting and Jest tests?",
      "What are the best practices for caching BigQuery queries in modern web apps?",
    ],
  },
];

export default function Home() {
  const [selectedMode, setSelectedMode] = useState<string>("architect");
  const [prompt, setPrompt] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [modelUsed, setModelUsed] = useState<string>("");
  const [durationMs, setDurationMs] = useState<number | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const activeModeObj = MODES.find((m) => m.id === selectedMode) || MODES[0];

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setResponse("");
    setDurationMs(null);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          mode: selectedMode,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate response.");
      }

      setResponse(data.text);
      setModelUsed(data.model);
      setDurationMs(data.durationMs);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An error occurred.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleCopy = () => {
    if (!response) return;
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#080B10] text-slate-100 selection:bg-indigo-600 selection:text-white">
      {/* Background Decorative Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-indigo-600/15 blur-3xl" />
        <div className="absolute top-1/3 -right-20 h-96 w-96 rounded-full bg-purple-600/15 blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 h-96 w-96 rounded-full bg-teal-600/10 blur-3xl" />
      </div>

      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/25">
              <Sparkles className="h-5 w-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white">
                  Nexus AI Studio
                </span>
                <span className="rounded-full bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 text-[11px] font-semibold text-indigo-400">
                  v1.0
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Powered by Google Gemini & Antigravity
              </p>
            </div>
          </div>

          {/* Cloud & Platform Status Badges */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
              <GitBranch className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">GitHub:</span> atalays-playground
            </div>

            <div className="flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
              <Globe className="h-3.5 w-3.5" />
              <span>Vercel Pro Ready</span>
            </div>

            <div className="flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-300">
              <Cpu className="h-3.5 w-3.5" />
              <span>Gemini Flash</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8">
        {/* Mode Selection Cards */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Layers className="h-4 w-4 text-indigo-400" />
              Select Workspace Mode
            </h2>
            <span className="text-xs text-slate-500">
              4 AI-assisted modes available
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {MODES.map((mode) => {
              const Icon = mode.icon;
              const isSelected = selectedMode === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => setSelectedMode(mode.id)}
                  className={`group relative flex flex-col items-start rounded-2xl border p-4 text-left transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "border-indigo-500 bg-indigo-950/30 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500"
                      : "border-slate-800/80 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/80"
                  }`}
                >
                  <div className="flex w-full items-center justify-between mb-3">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr ${mode.color} text-white shadow-md`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    {isSelected && (
                      <span className="flex h-2 w-2 rounded-full bg-indigo-400" />
                    )}
                  </div>
                  <h3 className="font-semibold text-sm text-white group-hover:text-indigo-300 transition-colors">
                    {mode.name}
                  </h3>
                  <p className="mt-1 text-xs text-slate-400 line-clamp-2">
                    {mode.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Workspace Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 flex-1">
          {/* Left Column: Prompt Input & Quick Starters */}
          <div className="flex flex-col lg:col-span-6 space-y-4">
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md p-5 shadow-xl flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <label
                  htmlFor="prompt"
                  className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2"
                >
                  <Zap className="h-3.5 w-3.5 text-amber-400" />
                  Your Request / Context
                </label>
                <span className="text-[11px] text-slate-500">
                  Ctrl + Enter to execute
                </span>
              </div>

              <textarea
                id="prompt"
                ref={textareaRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={activeModeObj.placeholder}
                rows={7}
                className="w-full resize-none rounded-xl border border-slate-800 bg-slate-950/80 p-4 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-mono leading-relaxed"
              />

              {/* Action Buttons & Status */}
              <div className="mt-4 flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setPrompt("")}
                  disabled={!prompt || isLoading}
                  className="rounded-lg px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 disabled:opacity-30 transition-colors"
                >
                  Clear
                </button>

                <button
                  type="button"
                  onClick={() => handleSubmit()}
                  disabled={!prompt.trim() || isLoading}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>Generating with Gemini...</span>
                    </>
                  ) : (
                    <>
                      <span>Execute</span>
                      <Send className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </div>

              {/* Suggested Quick Prompts */}
              <div className="mt-6 border-t border-slate-800/60 pt-4">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  Sample {activeModeObj.name} Prompts:
                </span>
                <div className="flex flex-col gap-1.5">
                  {activeModeObj.samplePrompts.map((sample, idx) => (
                    <button
                      key={idx}
                      onClick={() => setPrompt(sample)}
                      className="group flex items-center justify-between rounded-lg border border-slate-800/60 bg-slate-950/40 px-3 py-2 text-left text-xs text-slate-300 hover:border-indigo-500/40 hover:bg-indigo-950/20 hover:text-indigo-200 transition-all"
                    >
                      <span className="truncate pr-2">{sample}</span>
                      <ArrowRight className="h-3 w-3 text-slate-500 group-hover:text-indigo-400 flex-shrink-0 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: AI Output & Code Viewer */}
          <div className="flex flex-col lg:col-span-6">
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md p-5 shadow-xl flex-1 flex flex-col min-h-[420px]">
              {/* Output Header */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400">
                    <Sparkles className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                    AI Output
                  </span>
                  {modelUsed && (
                    <span className="rounded-md bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 text-[10px] font-mono text-indigo-400">
                      {modelUsed}
                    </span>
                  )}
                  {durationMs && (
                    <span className="text-[10px] text-slate-400 font-mono">
                      ({(durationMs / 1000).toFixed(2)}s)
                    </span>
                  )}
                </div>

                {response && (
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-slate-200 hover:bg-slate-700 hover:text-white transition-all cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-medium">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Output Content Area */}
              <div className="flex-1 overflow-y-auto max-h-[600px] pr-1">
                {error && (
                  <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300">
                    <p className="font-semibold mb-1">Execution Error:</p>
                    <p className="font-mono">{error}</p>
                  </div>
                )}

                {isLoading && (
                  <div className="flex h-64 flex-col items-center justify-center gap-3 text-slate-400">
                    <div className="relative flex h-12 w-12 items-center justify-center">
                      <div className="absolute h-full w-full rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
                      <Sparkles className="h-5 w-5 text-indigo-400 animate-pulse" />
                    </div>
                    <span className="text-xs text-slate-400 font-mono">
                      Generating structured response...
                    </span>
                  </div>
                )}

                {!isLoading && !error && !response && (
                  <div className="flex h-64 flex-col items-center justify-center text-center text-slate-500 px-4">
                    <Cpu className="h-10 w-10 text-slate-700 mb-2" />
                    <p className="text-sm font-medium text-slate-400">
                      Studio Ready
                    </p>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm">
                      Choose an AI mode, enter your prompt or pick a sample starter on the left to see the result.
                    </p>
                  </div>
                )}

                {!isLoading && response && (
                  <div className="rounded-xl bg-slate-950/70 p-4 border border-slate-800/60 font-sans text-sm leading-relaxed text-slate-200 whitespace-pre-wrap selection:bg-indigo-500 selection:text-white">
                    {response}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="border-t border-slate-800/60 bg-slate-950/40 py-4 text-center text-xs text-slate-500">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Encrypted Environment Keys · Git Ready</span>
          </div>
          <p className="mt-2 sm:mt-0">
            Workspace: <code className="text-slate-400 font-mono">ai-nexus-hub</code> · GitHub: <code className="text-indigo-400 font-mono">atalays-playground</code>
          </p>
        </div>
      </footer>
    </div>
  );
}
