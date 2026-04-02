"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import type { FirestoreQuizDocument, FirestoreAnswer } from "@/lib/types";

type ResultWithId = FirestoreQuizDocument & { id: string };

export default function UserDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [result, setResult] = useState<ResultWithId | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem("adminAuth") !== "true") {
      router.push("/admin");
      return;
    }

    fetch(`/api/submit-quiz/${params.id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setResult(data.result);
      })
      .catch((err) => {
        setError(err.message || "Failed to load result.");
      })
      .finally(() => setIsLoading(false));
  }, [router, params.id]);

  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso);
      return (
        d.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }) +
        ", " +
        d.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    } catch {
      return iso;
    }
  };

  const resultColor = (res: string) => {
    switch (res) {
      case "Pass":
        return "text-correct";
      case "Needs Review":
        return "text-warning";
      default:
        return "text-incorrect";
    }
  };

  const resultBadgeClass = (res: string) => {
    switch (res) {
      case "Pass":
        return "bg-correct/10 text-correct border border-correct/20";
      case "Needs Review":
        return "bg-warning/10 text-warning border border-warning/20";
      default:
        return "bg-incorrect/10 text-incorrect border border-incorrect/20";
    }
  };

  const toggleQuestion = (idx: number) => {
    setExpandedQuestion(expandedQuestion === idx ? null : idx);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-surface-400">
          <svg
            className="w-5 h-5 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          Loading user details...
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-card p-8 max-w-md text-center">
          <svg
            className="w-16 h-16 text-incorrect/60 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
          <h2 className="font-display text-xl font-bold text-white mb-2">
            Result Not Found
          </h2>
          <p className="text-surface-400 mb-6">
            {error || "The requested quiz result could not be loaded."}
          </p>
          <button
            onClick={() => router.push("/admin/dashboard")}
            className="btn-primary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const correctCount = result.answers.filter((a) => a.isCorrect).length;
  const incorrectCount = result.answers.length - correctCount;

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto animate-fade-in">
      {/* Back navigation */}
      <button
        onClick={() => router.push("/admin/dashboard")}
        className="flex items-center gap-2 text-surface-400 hover:text-brand-400 transition-colors mb-6 group"
      >
        <svg
          className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        <span className="text-sm font-medium">Back to Dashboard</span>
      </button>

      {/* User Header Card */}
      <div className="glass-header p-6 sm:p-8 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Avatar */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-brand-500/20 flex items-center justify-center shrink-0">
            <span className="font-display text-2xl sm:text-3xl font-bold text-brand-400">
              {result.developerName.charAt(0).toUpperCase()}
            </span>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white truncate">
              {result.developerName}
            </h1>
            <p className="text-surface-400 mt-1">{result.email}</p>
            <div className="flex items-center gap-2 text-surface-500 text-sm mt-2">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              Submitted: {formatDate(result.submittedAt)}
            </div>
          </div>

          {/* Stat Pills */}
          <div className="flex flex-wrap gap-3 sm:shrink-0">
            <div className="glass-card px-5 py-3 text-center">
              <p className="font-display text-xl font-bold text-white">
                {result.totalScore}
                <span className="text-sm text-surface-400">/15</span>
              </p>
              <p className="text-xs text-surface-500">Score</p>
            </div>
            <div className="glass-card px-5 py-3 text-center">
              <p
                className={`font-display text-xl font-bold ${resultColor(result.result)}`}
              >
                {result.percentage}%
              </p>
              <p className="text-xs text-surface-500">Percentage</p>
            </div>
            <div className="flex items-center">
              <span className={`tag ${resultBadgeClass(result.result)}`}>
                {result.result}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="glass-card p-6 mb-8">
        <h2 className="font-display text-lg font-semibold text-white mb-5">
          Score Breakdown
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-surface-300">
                LLM Architecture
              </span>
              <span className="text-sm font-mono text-white">
                {result.llmScore} / 5
              </span>
            </div>
            <div className="h-3 bg-surface-800/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-500 rounded-full animate-progress"
                style={{ width: `${(result.llmScore / 5) * 100}%` }}
              />
            </div>
            <p className="text-xs text-surface-500 mt-1">
              {Math.round((result.llmScore / 5) * 100)}% correct
            </p>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-surface-300">
                Prompt Engineering
              </span>
              <span className="text-sm font-mono text-white">
                {result.promptEngineeringScore} / 10
              </span>
            </div>
            <div className="h-3 bg-surface-800/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-400 rounded-full animate-progress"
                style={{
                  width: `${(result.promptEngineeringScore / 10) * 100}%`,
                }}
              />
            </div>
            <p className="text-xs text-surface-500 mt-1">
              {Math.round((result.promptEngineeringScore / 10) * 100)}% correct
            </p>
          </div>
        </div>
      </div>

      {/* Questions Section Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-display text-lg font-semibold text-white flex items-center gap-3">
            Detailed Answers
            <span className="tag bg-brand-500/10 text-brand-400 border border-brand-500/20">
              {result.answers.length} questions
            </span>
          </h2>
          <p className="text-sm text-surface-500 mt-1">
            <span className="text-correct">{correctCount} correct</span>
            {" · "}
            <span className="text-incorrect">{incorrectCount} incorrect</span>
          </p>
        </div>
        <button
          onClick={() =>
            setExpandedQuestion(expandedQuestion === -1 ? null : -1)
          }
          className="btn-secondary text-sm"
        >
          {expandedQuestion === -1 ? "Collapse All" : "Expand All"}
        </button>
      </div>

      {/* Question Cards */}
      <div className="space-y-4 mb-10">
        {result.answers.map((answer, idx) => {
          const isExpanded =
            expandedQuestion === idx || expandedQuestion === -1;

          return (
            <div
              key={idx}
              className="glass-card glass-card-hover overflow-hidden"
            >
              {/* Collapsed Header */}
              <button
                onClick={() => toggleQuestion(idx)}
                className="w-full flex items-center gap-4 p-5 text-left"
              >
                {/* Question Number */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-mono text-sm font-medium ${
                    answer.isCorrect
                      ? "bg-correct/10 text-correct"
                      : "bg-incorrect/10 text-incorrect"
                  }`}
                >
                  {answer.questionNumber}
                </div>

                {/* Question text */}
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm text-white font-medium ${!isExpanded ? "truncate" : ""}`}
                  >
                    {answer.question}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="tag bg-surface-800/60 text-surface-400 text-[10px]">
                      {answer.category}
                    </span>
                    {answer.requiresJustification && (
                      <span className="tag bg-warning/10 text-warning border border-warning/20 text-[10px]">
                        Justification
                      </span>
                    )}
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-3 shrink-0">
                  {answer.isCorrect ? (
                    <svg
                      className="w-5 h-5 text-correct"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5 text-incorrect"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                  )}
                  <svg
                    className={`w-4 h-4 text-surface-500 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>
              </button>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="px-5 pb-5 animate-fade-in">
                  <div className="border-t border-surface-700/30 pt-5 space-y-4">
                    {/* Scenario Context */}
                    {answer.scenarioContext && (
                      <div className="glass-justification p-4">
                        <div className="flex items-start gap-3">
                          <svg
                            className="w-5 h-5 text-warning shrink-0 mt-0.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                          >
                            <path d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                          </svg>
                          <div>
                            <p className="text-xs font-medium text-warning mb-1">
                              Scenario
                            </p>
                            <p className="text-sm text-surface-300">
                              {answer.scenarioContext}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Options */}
                    <div className="space-y-2">
                      {renderOptions(answer)}
                    </div>

                    {/* Explanation */}
                    {answer.explanation && (
                      <div className="rounded-2xl p-4 bg-info/10 border border-info/20" style={{ boxShadow: 'var(--shadow-clay-inset)' }}>
                        <div className="flex items-start gap-3">
                          <svg
                            className="w-5 h-5 text-info shrink-0 mt-0.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                          >
                            <path d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                          </svg>
                          <div>
                            <p className="text-xs font-display font-semibold text-info mb-1">
                              Explanation
                            </p>
                            <p className="text-sm text-surface-300 leading-relaxed">
                              {answer.explanation}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Justification */}
                    {answer.requiresJustification && (
                      <div className="glass-justification p-5">
                        <div className="flex items-start gap-3">
                          <svg
                            className="w-5 h-5 text-warning shrink-0 mt-0.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                          >
                            <path d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                          </svg>
                          <div className="flex-1">
                            <p className="text-xs font-medium text-warning mb-2">
                              Developer&apos;s Justification
                            </p>
                            {answer.userJustification ? (
                              <p className="text-sm text-surface-300 leading-relaxed">
                                {answer.userJustification}
                              </p>
                            ) : (
                              <p className="text-sm text-surface-500 italic">
                                No justification provided
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-8">
        <button
          onClick={() => router.push("/admin/dashboard")}
          className="btn-secondary"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Back to Dashboard
        </button>
        <p className="text-surface-500 text-xs">
          TM Systems Pvt. Ltd. — AI Foundations Training Programme
        </p>
      </div>
    </div>
  );
}

/* ─── Option rendering helper ─── */
function renderOptions(answer: FirestoreAnswer) {
  const letters = ["A", "B", "C", "D"];

  const userIdx = answer.userAnswerIndex;
  const correctIdx = answer.correctAnswerIndex;

  const options: { index: number; text: string; isCorrect: boolean; isUserPick: boolean }[] = [];

  if (correctIdx !== undefined) {
    options.push({
      index: correctIdx,
      text: answer.correctAnswer,
      isCorrect: true,
      isUserPick: userIdx === correctIdx,
    });
  }

  if (
    userIdx !== undefined &&
    userIdx !== correctIdx &&
    answer.userAnswer !== "Not answered"
  ) {
    options.push({
      index: userIdx,
      text: answer.userAnswer,
      isCorrect: false,
      isUserPick: true,
    });
  }

  options.sort((a, b) => a.index - b.index);

  return options.map((opt) => {
    let containerClass = "glass-neutral rounded-xl p-4";
    let label = "";

    if (opt.isCorrect && opt.isUserPick) {
      containerClass = "glass-correct rounded-xl p-4";
      label = "✓ Your Answer (Correct)";
    } else if (opt.isCorrect) {
      containerClass = "glass-correct rounded-xl p-4";
      label = "✓ Correct Answer";
    } else if (opt.isUserPick) {
      containerClass = "glass-incorrect rounded-xl p-4";
      label = "✗ Your Answer";
    }

    return (
      <div key={opt.index} className={containerClass}>
        <div className="flex items-start gap-3">
          <span
            className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-medium shrink-0 ${
              opt.isCorrect
                ? "bg-correct/20 text-correct"
                : opt.isUserPick
                  ? "bg-incorrect/20 text-incorrect"
                  : "bg-surface-700/60 text-surface-400"
            }`}
          >
            {letters[opt.index] || opt.index + 1}
          </span>
          <div className="flex-1 min-w-0">
            <p
              className={`text-sm ${
                opt.isCorrect
                  ? "text-correct"
                  : opt.isUserPick
                    ? "text-incorrect"
                    : "text-surface-400"
              }`}
            >
              {opt.text}
            </p>
            {label && (
              <p
                className={`text-xs mt-1 font-medium ${
                  opt.isCorrect ? "text-correct/70" : "text-incorrect/70"
                }`}
              >
                {label}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  });
}
