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

  const resultBadgeClass = (res: string) => {
    switch (res) {
      case "Pass":
        return "nb-badge nb-badge-pass";
      case "Needs Review":
        return "nb-badge nb-badge-review";
      default:
        return "nb-badge nb-badge-fail";
    }
  };

  const toggleQuestion = (idx: number) => {
    setExpandedQuestion(expandedQuestion === idx ? null : idx);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-nb-white">
        <div className="flex items-center gap-3" style={{ fontFamily: "'Space Mono', monospace", color: "#000" }}>
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
      <div className="min-h-screen flex items-center justify-center p-4 bg-nb-white">
        <div
          className="p-6 sm:p-8 max-w-md w-full text-center"
          style={{ background: "#FFFDF5", border: "3px solid #000", boxShadow: "6px 6px 0 0 #000" }}
        >
          <div
            className="w-14 h-14 mx-auto mb-4 flex items-center justify-center"
            style={{ background: "#FF6B6B", border: "3px solid #000", boxShadow: "3px 3px 0 0 #000" }}
          >
            <svg
              className="w-7 h-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="#000"
              strokeWidth={2}
            >
              <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
          </div>
          <h2
            className="mb-2"
            style={{ fontFamily: "'Syne', 'Arial Black', sans-serif", fontWeight: 800, fontSize: "1.25rem", color: "#000" }}
          >
            Result Not Found
          </h2>
          <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "0.875rem", color: "#000", opacity: 0.6, marginBottom: "20px" }}>
            {error || "The requested quiz result could not be loaded."}
          </p>
          <button
            onClick={() => router.push("/admin/dashboard")}
            className="nb-btn"
            style={{ fontSize: "0.875rem", padding: "10px 20px" }}
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
    <div className="min-h-screen bg-nb-white p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto animate-nb-slide-in">
      {/* Back navigation */}
      <button
        onClick={() => router.push("/admin/dashboard")}
        className="flex items-center gap-2 mb-5 group"
        style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 700, fontSize: "0.875rem", color: "#000", background: "none", border: "none", cursor: "pointer" }}
      >
        <svg
          className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        Back to Dashboard
      </button>

      {/* User Header Card */}
      <div
        className="p-4 sm:p-6 mb-6 sm:mb-8"
        style={{ background: "#FFD23F", border: "3px solid #000", boxShadow: "4px 4px 0 0 #000" }}
      >
        {/* Top row: avatar + name */}
        <div className="flex items-center gap-3 sm:gap-4 mb-3">
          <div
            className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center shrink-0"
            style={{ background: "#FFFDF5", border: "3px solid #000", boxShadow: "3px 3px 0 0 #000" }}
          >
            <span style={{ fontFamily: "'Syne', 'Arial Black', sans-serif", fontWeight: 800, fontSize: "clamp(1.25rem, 4vw, 2rem)", color: "#000" }}>
              {result.developerName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <h1
              className="truncate"
              style={{ fontFamily: "'Syne', 'Arial Black', sans-serif", fontWeight: 800, fontSize: "clamp(1.25rem, 5vw, 2.25rem)", letterSpacing: "-0.02em", color: "#000" }}
            >
              {result.developerName}
            </h1>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "clamp(0.7rem, 2.5vw, 0.875rem)", color: "#000", opacity: 0.7 }}>
              {result.email}
            </p>
          </div>
        </div>

        {/* Submitted date */}
        <div className="flex items-center gap-2 mb-4" style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.7rem", color: "#000", opacity: 0.6 }}>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          Submitted: {formatDate(result.submittedAt)}
        </div>

        {/* Stat Pills - always horizontal, wrapping */}
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <div
            className="px-3 sm:px-4 py-2 text-center"
            style={{ background: "#FFFDF5", border: "2px solid #000", boxShadow: "3px 3px 0 0 #000" }}
          >
            <p style={{ fontFamily: "'Syne', 'Arial Black', sans-serif", fontWeight: 800, fontSize: "clamp(1rem, 3vw, 1.5rem)", color: "#000", lineHeight: 1.2 }}>
              {result.totalScore}
              <span style={{ fontSize: "0.7em", opacity: 0.5 }}>/15</span>
            </p>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", color: "#000", opacity: 0.6, textTransform: "uppercase" }}>Score</p>
          </div>
          <div
            className="px-3 sm:px-4 py-2 text-center"
            style={{
              background: result.result === "Pass" ? "#88D498" : result.result === "Needs Review" ? "#FFA552" : "#FF6B6B",
              border: "2px solid #000",
              boxShadow: "3px 3px 0 0 #000",
            }}
          >
            <p style={{ fontFamily: "'Syne', 'Arial Black', sans-serif", fontWeight: 800, fontSize: "clamp(1rem, 3vw, 1.5rem)", color: "#000", lineHeight: 1.2 }}>
              {result.percentage}%
            </p>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", color: "#000", opacity: 0.6, textTransform: "uppercase" }}>Percentage</p>
          </div>
          <div className="flex items-center">
            <span className={resultBadgeClass(result.result)} style={{ fontSize: "0.65rem", padding: "3px 10px" }}>
              {result.result}
            </span>
          </div>
        </div>
      </div>

      {/* Score Breakdown */}
      <div
        className="p-4 sm:p-6 mb-6 sm:mb-8"
        style={{ background: "#FFFDF5", border: "3px solid #000", boxShadow: "4px 4px 0 0 #000" }}
      >
        <h2
          className="mb-4 sm:mb-5"
          style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 700, fontSize: "1.125rem", color: "#000" }}
        >
          Score Breakdown
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 700, fontSize: "0.8rem", color: "#000" }}>
                LLM Architecture
              </span>
              <span style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: "0.8rem", color: "#000" }}>
                {result.llmScore} / 5
              </span>
            </div>
            <div className="nb-progress-track overflow-hidden">
              <div
                className="nb-progress-fill"
                style={{
                  width: `${(result.llmScore / 5) * 100}%`,
                  background: result.llmScore / 5 >= 0.6 ? "#88D498" : "#FF6B6B",
                }}
              />
            </div>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.7rem", color: "#000", opacity: 0.5, marginTop: "4px" }}>
              {Math.round((result.llmScore / 5) * 100)}% correct
            </p>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <span style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 700, fontSize: "0.8rem", color: "#000" }}>
                Prompt Engineering
              </span>
              <span style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: "0.8rem", color: "#000" }}>
                {result.promptEngineeringScore} / 10
              </span>
            </div>
            <div className="nb-progress-track overflow-hidden">
              <div
                className="nb-progress-fill"
                style={{
                  width: `${(result.promptEngineeringScore / 10) * 100}%`,
                  background: result.promptEngineeringScore / 10 >= 0.6 ? "#88D498" : "#FF6B6B",
                }}
              />
            </div>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.7rem", color: "#000", opacity: 0.5, marginTop: "4px" }}>
              {Math.round((result.promptEngineeringScore / 10) * 100)}% correct
            </p>
          </div>
        </div>
      </div>

      {/* Questions Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h2
            style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 700, fontSize: "1.125rem", color: "#000" }}
          >
            Detailed Answers
            <span className="nb-badge nb-badge-info ml-2" style={{ fontSize: "0.6rem", padding: "2px 8px", verticalAlign: "middle" }}>
              {result.answers.length}
            </span>
          </h2>
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.7rem", marginTop: "4px" }}>
            <span style={{ color: "#88D498", fontWeight: 700 }}>{correctCount} correct</span>
            {" · "}
            <span style={{ color: "#FF6B6B", fontWeight: 700 }}>{incorrectCount} incorrect</span>
          </p>
        </div>
        <button
          onClick={() =>
            setExpandedQuestion(expandedQuestion === -1 ? null : -1)
          }
          className="nb-btn-secondary self-start sm:self-auto"
          style={{ padding: "6px 14px", fontSize: "0.75rem" }}
        >
          {expandedQuestion === -1 ? "Collapse All" : "Expand All"}
        </button>
      </div>

      {/* Question Cards */}
      <div className="space-y-3 sm:space-y-4 mb-10">
        {result.answers.map((answer, idx) => {
          const isExpanded =
            expandedQuestion === idx || expandedQuestion === -1;

          return (
            <div
              key={idx}
              className="overflow-hidden transition-all duration-150"
              style={{
                background: "#FFFDF5",
                border: "2px solid #000",
                boxShadow: isExpanded ? "4px 4px 0 0 #000" : "2px 2px 0 0 #000",
              }}
            >
              {/* Collapsed Header */}
              <button
                onClick={() => toggleQuestion(idx)}
                className="w-full flex items-center gap-3 p-3 sm:p-4 text-left"
                style={{ cursor: "pointer", background: "transparent", border: "none" }}
              >
                {/* Question Number */}
                <div
                  className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center shrink-0"
                  style={{
                    background: answer.isCorrect ? "#88D498" : "#FF6B6B",
                    border: "2px solid #000",
                    fontFamily: "'Space Mono', monospace",
                    fontWeight: 700,
                    fontSize: "0.75rem",
                    color: "#000",
                  }}
                >
                  {answer.questionNumber}
                </div>

                {/* Question text */}
                <div className="flex-1 min-w-0">
                  <p
                    className={!isExpanded ? "truncate" : ""}
                    style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 500, fontSize: "0.8rem", color: "#000" }}
                  >
                    {answer.question}
                  </p>
                  <div className="flex flex-wrap items-center gap-1 mt-1">
                    <span className="nb-badge nb-badge-neutral" style={{ fontSize: "0.55rem", padding: "1px 6px", boxShadow: "1px 1px 0 0 #000" }}>
                      {answer.category}
                    </span>
                    {answer.requiresJustification && (
                      <span className="nb-badge nb-badge-review" style={{ fontSize: "0.55rem", padding: "1px 6px", boxShadow: "1px 1px 0 0 #000" }}>
                        Justification
                      </span>
                    )}
                  </div>
                </div>

                {/* Status + Chevron */}
                <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
                  {answer.isCorrect ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#88D498" strokeWidth={3}>
                      <path d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#FF6B6B" strokeWidth={3}>
                      <path d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                  )}
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="#000"
                    strokeWidth={3}
                  >
                    <path d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>
              </button>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="px-3 sm:px-5 pb-4 sm:pb-5 animate-nb-slide-in">
                  <div className="pt-4 space-y-3" style={{ borderTop: "2px solid #000" }}>
                    {/* Scenario Context */}
                    {answer.scenarioContext && (
                      <div className="p-3 sm:p-4" style={{ background: "#FFA552", border: "2px solid #000" }}>
                        <div className="flex items-start gap-2">
                          <svg
                            className="w-4 h-4 shrink-0 mt-0.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="#000"
                            strokeWidth={2}
                          >
                            <path d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                          </svg>
                          <div>
                            <p style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "#000", marginBottom: "3px" }}>
                              Scenario
                            </p>
                            <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "0.8rem", color: "#000" }}>
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
                      <div className="p-3 sm:p-4" style={{ background: "#74B9FF", border: "2px solid #000" }}>
                        <div className="flex items-start gap-2">
                          <svg
                            className="w-4 h-4 shrink-0 mt-0.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="#000"
                            strokeWidth={2}
                          >
                            <path d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                          </svg>
                          <div>
                            <p style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "#000", marginBottom: "3px" }}>
                              Explanation
                            </p>
                            <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "0.8rem", color: "#000", lineHeight: 1.5 }}>
                              {answer.explanation}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Justification */}
                    {answer.requiresJustification && (
                      <div className="p-3 sm:p-4" style={{ background: "#B8A9FA", border: "2px solid #000" }}>
                        <div className="flex items-start gap-2">
                          <svg
                            className="w-4 h-4 shrink-0 mt-0.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="#000"
                            strokeWidth={2}
                          >
                            <path d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                          </svg>
                          <div className="flex-1">
                            <p style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "#000", marginBottom: "6px" }}>
                              Developer&apos;s Justification
                            </p>
                            {answer.userJustification ? (
                              <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "0.8rem", color: "#000", lineHeight: 1.5 }}>
                                {answer.userJustification}
                              </p>
                            ) : (
                              <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "0.8rem", color: "#000", opacity: 0.5, fontStyle: "italic" }}>
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
          className="nb-btn-secondary"
          style={{ padding: "8px 16px", fontSize: "0.8rem" }}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Back to Dashboard
        </button>
        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", color: "#000", opacity: 0.4 }}>
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
    let bgColor = "#FFFDF5";
    let leftBorder = "";
    let label = "";

    if (opt.isCorrect && opt.isUserPick) {
      bgColor = "#88D498";
      leftBorder = "4px solid #88D498";
      label = "Your Answer (Correct)";
    } else if (opt.isCorrect) {
      bgColor = "#88D49840";
      leftBorder = "4px solid #88D498";
      label = "Correct Answer";
    } else if (opt.isUserPick) {
      bgColor = "#FF6B6B40";
      leftBorder = "4px solid #FF6B6B";
      label = "Your Answer";
    }

    return (
      <div
        key={opt.index}
        className="p-3"
        style={{
          background: bgColor,
          border: "2px solid #000",
          borderLeft: leftBorder || "2px solid #000",
        }}
      >
        <div className="flex items-start gap-2">
          <span
            className="w-7 h-7 flex items-center justify-center shrink-0"
            style={{
              background: opt.isCorrect ? "#88D498" : opt.isUserPick ? "#FF6B6B" : "#F5F0E8",
              border: "2px solid #000",
              fontFamily: "'Space Mono', monospace",
              fontWeight: 700,
              fontSize: "0.7rem",
              color: "#000",
            }}
          >
            {letters[opt.index] || opt.index + 1}
          </span>
          <div className="flex-1 min-w-0">
            <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "0.8rem", color: "#000" }}>
              {opt.text}
            </p>
            {label && (
              <p style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "0.6rem",
                fontWeight: 700,
                marginTop: "3px",
                color: "#000",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}>
                {opt.isCorrect ? "\u2713" : "\u2717"} {label}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  });
}
