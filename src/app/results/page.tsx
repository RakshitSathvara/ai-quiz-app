"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { QuizSubmission } from "@/lib/types";

export default function ResultsPage() {
  const router = useRouter();
  const [submission, setSubmission] = useState<QuizSubmission | null>(null);
  const [showDetails, setShowDetails] = useState<boolean>(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("quizResults");
    if (!stored) {
      router.push("/");
      return;
    }
    setSubmission(JSON.parse(stored));
  }, [router]);

  if (!submission) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-surface-400">
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading results...
        </div>
      </div>
    );
  }

  const { results, user } = submission;
  const { percentage, llmScore, peScore, totalScore, details } = results;

  const getGrade = () => {
    if (percentage >= 80) return { label: "Pass", color: "correct", emoji: "🎯" };
    if (percentage >= 60) return { label: "Needs Review", color: "warning", emoji: "📝" };
    return { label: "Needs Improvement", color: "incorrect", emoji: "📖" };
  };

  const grade = getGrade();

  const gradeColorClasses: Record<string, string> = {
    correct: "bg-correct/10 text-correct border border-correct/20",
    warning: "bg-warning/10 text-warning border border-warning/20",
    incorrect: "bg-incorrect/10 text-incorrect border border-incorrect/20",
  };

  const handleReturnHome = () => {
    sessionStorage.removeItem("quizUser");
    sessionStorage.removeItem("quizResults");
    router.push("/");
  };

  const letters = ["A", "B", "C", "D"];

  return (
    <div className="min-h-screen p-4 sm:p-6 max-w-3xl mx-auto animate-fade-in">
      {/* Result Header */}
      <div className="text-center mb-8 pt-8">
        <div className="text-6xl mb-4">{grade.emoji}</div>
        <h1 className="font-display text-4xl font-bold text-white mb-2">
          Quiz Complete
        </h1>
        <p className="text-surface-400 text-lg">{user.name}</p>
      </div>

      {/* Score Card */}
      <div className="quiz-card glow-border p-8 mb-8">
        <div className="text-center mb-6">
          <div className="font-display text-7xl font-bold text-white">
            {percentage}
            <span className="text-3xl text-surface-400">%</span>
          </div>
          <span className={`tag mt-3 ${gradeColorClasses[grade.color]}`}>
            {grade.label}
          </span>
          <p className="text-surface-300 mt-3">
            {totalScore} out of 15 correct
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* LLM Score */}
          <div className="bg-surface-800/40 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-surface-300">LLM Architecture</span>
              <span className="text-sm font-mono text-white">
                {llmScore}/5
              </span>
            </div>
            <div className="h-2 bg-surface-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-500 rounded-full transition-all duration-700 ease-out animate-progress"
                style={{ width: `${(llmScore / 5) * 100}%` }}
              />
            </div>
          </div>

          {/* PE Score */}
          <div className="bg-surface-800/40 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-surface-300">
                Prompt Engineering
              </span>
              <span className="text-sm font-mono text-white">
                {peScore}/10
              </span>
            </div>
            <div className="h-2 bg-surface-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-400 rounded-full transition-all duration-700 ease-out animate-progress"
                style={{ width: `${(peScore / 10) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Toggle Button */}
      <div className="text-center mb-6">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="btn-secondary"
        >
          {showDetails ? "Hide Detailed Answers" : "Review Detailed Answers"}
          <svg
            className={`w-4 h-4 transition-transform duration-300 ${
              showDetails ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </button>
      </div>

      {/* Answer Details */}
      {showDetails && (
        <div className="space-y-4 animate-slide-up mb-8">
          {details.map((detail, idx) => (
            <div
              key={detail.id}
              className={`quiz-card p-6 border-l-4 ${
                detail.isCorrect ? "border-l-correct" : "border-l-incorrect"
              }`}
            >
              {/* Question Header */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-sm font-mono text-surface-400">
                  Q{idx + 1}
                </span>
                <span className="tag bg-surface-800 text-surface-400">
                  {detail.category}
                </span>
                <span
                  className={`tag ${
                    detail.isCorrect
                      ? "bg-correct/10 text-correct border border-correct/20"
                      : "bg-incorrect/10 text-incorrect border border-incorrect/20"
                  }`}
                >
                  {detail.isCorrect ? "Correct" : "Incorrect"}
                </span>
              </div>

              {/* Question Text */}
              <p className="text-white font-medium mb-4">{detail.question}</p>

              {/* Options */}
              <div className="space-y-2">
                {detail.options.map((option, optIdx) => {
                  const isCorrectOption = optIdx === detail.correctAnswer;
                  const isUserPick = optIdx === detail.userAnswer;
                  const isWrongPick = isUserPick && !detail.isCorrect;

                  let classes = "bg-surface-800/30 text-surface-500";
                  let label = "";

                  if (isCorrectOption) {
                    classes =
                      "bg-correct/10 border border-correct/30 text-correct";
                    label = "✓ Correct";
                  } else if (isWrongPick) {
                    classes =
                      "bg-incorrect/10 border border-incorrect/30 text-incorrect";
                    label = "Your answer";
                  }

                  return (
                    <div
                      key={optIdx}
                      className={`flex items-center gap-3 p-3 rounded-lg text-sm ${classes}`}
                    >
                      <span className="font-mono text-xs w-6 h-6 rounded flex items-center justify-center shrink-0 bg-white/5">
                        {letters[optIdx]}
                      </span>
                      <span className="flex-1">{option}</span>
                      {label && (
                        <span className="text-xs font-medium whitespace-nowrap">
                          {label}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Explanation */}
              {detail.explanation && (
                <div className="bg-info/10 border border-info/20 rounded-xl p-4 mt-4">
                  <div className="flex items-start gap-2.5">
                    <svg className="w-4 h-4 text-info shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                    </svg>
                    <div>
                      <p className="text-xs font-display font-semibold text-info mb-1">Explanation</p>
                      <p className="text-sm text-surface-300 leading-relaxed">{detail.explanation}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Justification Review */}
              {detail.requiresJustification && (
                <div className="bg-surface-800/40 rounded-xl p-4 mt-4">
                  <p className="text-xs font-medium text-surface-400 mb-2">
                    Your Justification
                  </p>
                  {detail.userJustification ? (
                    <p className="text-sm text-surface-300">
                      {detail.userJustification}
                    </p>
                  ) : (
                    <p className="text-sm text-surface-500 italic">
                      No justification provided
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="text-center mb-6">
        <button onClick={handleReturnHome} className="btn-primary">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
          Return to Home
        </button>
      </div>

      {/* Footer */}
      <p className="text-surface-500 text-xs text-center pb-8">
        Results have been recorded to Firebase.
      </p>
    </div>
  );
}
