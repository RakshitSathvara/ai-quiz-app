"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { QuizUser, GeneratedQuiz, QuizQuestion, QuizResults, AnswerDetail, QuizSubmission } from "@/lib/types";
import { generateQuiz } from "@/lib/questions";

export default function QuizPage() {
  const router = useRouter();
  const [user, setUser] = useState<QuizUser | null>(null);
  const [quiz, setQuiz] = useState<GeneratedQuiz | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [justifications, setJustifications] = useState<Record<string, string>>({});
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [justificationWarnings, setJustificationWarnings] = useState<Record<string, boolean>>({});
  const [showHints, setShowHints] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const stored = sessionStorage.getItem("quizUser");
    if (!stored) {
      router.push("/");
      return;
    }
    setUser(JSON.parse(stored));
    setQuiz(generateQuiz());
  }, [router]);

  const allQuestions: QuizQuestion[] = quiz
    ? [...quiz.llmQuestions, ...quiz.peQuestions]
    : [];
  const current = allQuestions[currentIndex];
  const isLLMSection = currentIndex < 5;
  const answeredCount = Object.keys(answers).length;

  const isFullyAnswered = (q: QuizQuestion): boolean => {
    if (answers[q.id] === undefined) return false;
    if (q.requiresJustification && (!justifications[q.id] || justifications[q.id].trim().length < 10)) return false;
    return true;
  };

  const needsJustification = (q: QuizQuestion): boolean => {
    return !!(q.requiresJustification && answers[q.id] !== undefined && (!justifications[q.id] || justifications[q.id].trim().length < 10));
  };

  const allAnswered = allQuestions.length === 15 && allQuestions.every(isFullyAnswered);

  const handleSelect = (optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [current.id]: optionIndex }));
    if (justificationWarnings[current.id]) {
      setJustificationWarnings((prev) => ({ ...prev, [current.id]: false }));
    }
  };

  const handleNavigate = (newIndex: number) => {
    if (current.requiresJustification && answers[current.id] !== undefined && (!justifications[current.id] || justifications[current.id].trim().length < 10)) {
      setJustificationWarnings((prev) => ({ ...prev, [current.id]: true }));
    }
    setCurrentIndex(newIndex);
  };

  const calculateResults = (): QuizResults => {
    let llmCorrect = 0;
    let peCorrect = 0;
    const details: AnswerDetail[] = [];

    allQuestions.forEach((q, idx) => {
      const userAnswer = answers[q.id];
      const isCorrect = userAnswer === q.correctAnswer;
      if (idx < 5 && isCorrect) llmCorrect++;
      if (idx >= 5 && isCorrect) peCorrect++;

      details.push({
        id: q.id,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        userAnswer,
        isCorrect,
        category: q.category,
        requiresJustification: q.requiresJustification || false,
        scenarioContext: q.scenarioContext || null,
        justificationHint: q.justificationHint || null,
        userJustification: justifications[q.id] || null,
        explanation: q.explanation || null,
        hintUsed: !!showHints[q.id],
      });
    });

    const total = llmCorrect + peCorrect;
    return {
      llmScore: llmCorrect,
      peScore: peCorrect,
      totalScore: total,
      percentage: Math.round((total / 15) * 100),
      details,
    };
  };

  const handleSubmit = async () => {
    if (!user) return;
    setIsSubmitting(true);

    const results = calculateResults();
    const submission: QuizSubmission = {
      user,
      results,
      submittedAt: new Date().toISOString(),
    };

    try {
      await fetch("/api/submit-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submission),
      });
    } catch {
      // Still show results even if Firebase fails
    }

    sessionStorage.setItem("quizResults", JSON.stringify(submission));
    router.push("/results");
  };

  if (!quiz || !current || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-surface-400">
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading quiz...
        </div>
      </div>
    );
  }

  const letters = ["A", "B", "C", "D"];

  return (
    <div className="min-h-screen p-4 sm:p-6 max-w-3xl mx-auto animate-fade-in">
      {/* Header Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center font-display font-bold text-sm">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium text-white">{user.name}</p>
            <p className="text-xs text-surface-400">{user.email}</p>
          </div>
        </div>
        <span
          className={`tag border ${
            isLLMSection
              ? "bg-brand-500/10 text-brand-400 border-brand-500/20"
              : "bg-brand-400/10 text-brand-300 border-brand-400/20"
          }`}
        >
          {isLLMSection ? "LLM Core" : "Prompt Engineering"}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-surface-300">
            Question {currentIndex + 1} of 15
          </span>
          <span className="text-surface-400">
            {answeredCount}/15 answered
          </span>
        </div>
        <div className="h-2 bg-surface-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${((currentIndex + 1) / 15) * 100}%`,
              background: "linear-gradient(90deg, #5b8def, #7ba8ff)",
            }}
          />
        </div>
        <div className="flex mt-2 text-xs text-surface-500">
          <div style={{ width: "33.3%" }}>LLM (1–5)</div>
          <div>Prompt Engineering (6–15)</div>
        </div>
      </div>

      {/* Question Card */}
      <div key={current.id} className="quiz-card p-6 sm:p-8 mb-6 animate-fade-in">
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="tag bg-surface-800 text-surface-400">
            {current.category}
          </span>
          {current.requiresJustification && (
            <span className="tag bg-warning/10 text-warning border border-warning/20">
              <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
              </svg>
              Justification Required
            </span>
          )}
        </div>

        <h2 className="font-display text-xl font-semibold text-white mb-4">
          {current.question}
        </h2>

        {/* Hint Toggle */}
        {current.hint && (
          <div className="mb-6">
            <button
              onClick={() =>
                setShowHints((prev) => ({
                  ...prev,
                  [current.id]: !prev[current.id],
                }))
              }
              className="inline-flex items-center gap-1.5 text-sm text-amber-400 hover:text-amber-300 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
              </svg>
              {showHints[current.id] ? "Hide Hint" : "Show Hint"}
            </button>
            {showHints[current.id] && (
              <div className="mt-2 bg-amber-500/10 rounded-xl border border-amber-500/20 p-3">
                <p className="text-sm text-amber-200/90">{current.hint}</p>
              </div>
            )}
          </div>
        )}

        {/* Scenario Context */}
        {current.requiresJustification && current.scenarioContext && (
          <div className="bg-surface-800/60 rounded-xl border border-surface-700/50 p-4 mb-6">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
              </svg>
              <div>
                <p className="text-xs font-medium text-brand-400 mb-1">Scenario</p>
                <p className="text-sm text-surface-300">{current.scenarioContext}</p>
              </div>
            </div>
          </div>
        )}

        {/* Options */}
        <div className="space-y-3">
          {current.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              className={`option-btn ${
                answers[current.id] === idx ? "selected" : ""
              }`}
            >
              <span
                className={`w-7 h-7 rounded-lg font-mono text-xs flex items-center justify-center shrink-0 ${
                  answers[current.id] === idx
                    ? "bg-brand-500 text-white"
                    : "bg-surface-800 text-surface-400"
                }`}
              >
                {letters[idx]}
              </span>
              <span className="text-sm">{option}</span>
            </button>
          ))}
        </div>

        {/* Justification Textarea */}
        {current.requiresJustification && (
          <div className="mt-6">
            {current.justificationHint && (
              <p className="text-sm text-surface-400 italic mb-2">
                {current.justificationHint}
              </p>
            )}
            <textarea
              value={justifications[current.id] || ""}
              onChange={(e) => {
                setJustifications((prev) => ({
                  ...prev,
                  [current.id]: e.target.value,
                }));
                if (justificationWarnings[current.id] && e.target.value.trim().length >= 10) {
                  setJustificationWarnings((prev) => ({ ...prev, [current.id]: false }));
                }
              }}
              placeholder="Explain your reasoning (minimum 10 characters)..."
              className={`input-field min-h-[120px] resize-y ${justificationWarnings[current.id] ? "border-warning focus:border-warning focus:shadow-[0_0_0_3px_rgba(245,158,11,0.15)]" : ""}`}
            />
            {justificationWarnings[current.id] && (
              <p className="text-sm text-warning mt-2 flex items-center gap-1.5">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
                Please provide a justification (minimum 10 characters) for this question.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mb-6">
        <button
          onClick={() => handleNavigate(currentIndex - 1)}
          disabled={currentIndex === 0}
          className="btn-secondary"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Previous
        </button>

        {currentIndex < 14 ? (
          <button
            onClick={() => handleNavigate(currentIndex + 1)}
            className="btn-primary"
          >
            Next
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </button>
        ) : (
          <button
            onClick={() => {
              const warnings: Record<string, boolean> = {};
              allQuestions.forEach((q) => {
                if (needsJustification(q)) warnings[q.id] = true;
              });
              if (Object.keys(warnings).length > 0) {
                setJustificationWarnings((prev) => ({ ...prev, ...warnings }));
              }
              if (allAnswered) setShowConfirm(true);
            }}
            disabled={!allAnswered}
            className="btn-primary"
          >
            Submit Quiz
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </button>
        )}
      </div>

      {/* Question Navigator Dots */}
      <div className="text-center">
        <div className="flex flex-wrap justify-center gap-2 mb-3">
          {allQuestions.map((q, idx) => {
            const isActive = idx === currentIndex;
            const hasAnswer = answers[q.id] !== undefined;
            const incomplete = needsJustification(q);

            let dotClass: string;
            if (isActive) {
              dotClass = "bg-brand-500 text-white border-brand-500 scale-110";
            } else if (incomplete) {
              dotClass = "bg-warning/20 text-warning border-warning/30";
            } else if (hasAnswer) {
              dotClass = "bg-brand-500/20 text-brand-400 border-brand-500/30";
            } else {
              dotClass = "bg-surface-800 text-surface-500 border-surface-700/50";
            }

            return (
              <button
                key={idx}
                onClick={() => handleNavigate(idx)}
                className={`w-8 h-8 rounded-lg text-xs font-mono flex items-center justify-center border transition-all ${dotClass}`}
                title={incomplete ? "Justification missing" : undefined}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
        {(() => {
          const fullyAnsweredCount = allQuestions.filter(isFullyAnswered).length;
          const remaining = 15 - fullyAnsweredCount;
          const incompleteCount = allQuestions.filter(needsJustification).length;
          return (
            <div className="text-xs space-y-1">
              <p className="text-surface-500">
                {remaining} question{remaining !== 1 ? "s" : ""} remaining
              </p>
              {incompleteCount > 0 && (
                <p className="text-warning">
                  {incompleteCount} question{incompleteCount !== 1 ? "s" : ""} missing justification
                </p>
              )}
            </div>
          );
        })()}
      </div>

      {/* Submit Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="quiz-card p-8 max-w-md w-full animate-slide-up">
            <h3 className="font-display text-2xl font-bold text-white mb-3">
              Submit your quiz?
            </h3>
            <p className="text-surface-300 mb-6">
              Once submitted, your answers cannot be changed. Make sure
              you&apos;ve reviewed all 15 questions before confirming.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="btn-secondary flex-1"
              >
                Review Answers
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="btn-primary flex-1"
              >
                {isSubmitting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Submitting...
                  </>
                ) : (
                  "Confirm & Submit"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
