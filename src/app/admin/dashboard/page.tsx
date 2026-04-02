"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { FirestoreQuizDocument } from "@/lib/types";

type ResultWithId = FirestoreQuizDocument & { id: string };

export default function AdminDashboardPage() {
  const router = useRouter();
  const [results, setResults] = useState<ResultWithId[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (sessionStorage.getItem("adminAuth") !== "true") {
      router.push("/admin");
      return;
    }

    fetch("/api/submit-quiz")
      .then((res) => res.json())
      .then((data) => {
        setResults(data.results || []);
      })
      .catch(() => {
        setError("Failed to load results from Firebase.");
      })
      .finally(() => setIsLoading(false));
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem("adminAuth");
    router.push("/admin");
  };

  // --- Derived statistics ---
  const totalAttempts = results.length;
  const averageScore =
    totalAttempts > 0
      ? Math.round(
          results.reduce((sum, r) => sum + r.percentage, 0) / totalAttempts
        )
      : 0;
  const passCount = results.filter((r) => r.result === "Pass").length;
  const needsReviewCount = results.filter(
    (r) => r.result === "Needs Review"
  ).length;
  const failCount = results.filter((r) => r.result === "Fail").length;
  const passRate =
    totalAttempts > 0 ? Math.round((passCount / totalAttempts) * 100) : 0;
  const avgLLMScore =
    totalAttempts > 0
      ? (results.reduce((sum, r) => sum + r.llmScore, 0) / totalAttempts).toFixed(1)
      : "0";
  const avgPEScore =
    totalAttempts > 0
      ? (
          results.reduce((sum, r) => sum + r.promptEngineeringScore, 0) /
          totalAttempts
        ).toFixed(1)
      : "0";

  // --- Score distribution buckets ---
  const buckets = [
    { label: "0–39%", min: 0, max: 39, count: 0 },
    { label: "40–59%", min: 40, max: 59, count: 0 },
    { label: "60–79%", min: 60, max: 79, count: 0 },
    { label: "80–100%", min: 80, max: 100, count: 0 },
  ];
  results.forEach((r) => {
    const b = buckets.find((b) => r.percentage >= b.min && r.percentage <= b.max);
    if (b) b.count++;
  });
  const maxBucketCount = Math.max(...buckets.map((b) => b.count), 1);

  // --- Donut chart ---
  const donutSegments = [
    { label: "Pass", count: passCount, color: "var(--color-correct)" },
    { label: "Needs Review", count: needsReviewCount, color: "var(--color-warning)" },
    { label: "Fail", count: failCount, color: "var(--color-incorrect)" },
  ];
  const donutGradient = (() => {
    if (totalAttempts === 0) return "conic-gradient(var(--color-surface-700) 0deg 360deg)";
    const segments: string[] = [];
    let cumulative = 0;
    donutSegments.forEach((seg) => {
      const angle = (seg.count / totalAttempts) * 360;
      segments.push(`${seg.color} ${cumulative}deg ${cumulative + angle}deg`);
      cumulative += angle;
    });
    return `conic-gradient(${segments.join(", ")})`;
  })();

  // --- Format date ---
  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }) + ", " + d.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return iso;
    }
  };

  const resultBadge = (result: string) => {
    switch (result) {
      case "Pass":
        return "bg-correct/10 text-correct";
      case "Needs Review":
        return "bg-warning/10 text-warning";
      default:
        return "bg-incorrect/10 text-incorrect";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-surface-400">
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
            </svg>
          </div>
          <h1 className="font-display text-2xl font-bold text-white">
            Admin Dashboard
          </h1>
        </div>
        <button onClick={handleLogout} className="btn-secondary">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
          </svg>
          Logout
        </button>
      </div>

      {error && (
        <div className="quiz-card p-4 mb-6 border border-incorrect/30 bg-incorrect/5">
          <p className="text-sm text-incorrect">{error}</p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Total Attempts",
            value: totalAttempts,
            color: "text-brand-400",
            bgColor: "bg-brand-400/10",
            icon: (
              <path d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
            ),
          },
          {
            label: "Average Score",
            value: `${averageScore}%`,
            color: "text-brand-300",
            bgColor: "bg-brand-300/10",
            icon: (
              <path d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
            ),
          },
          {
            label: "Pass Rate",
            value: `${passRate}%`,
            color: "text-correct",
            bgColor: "bg-correct/10",
            icon: (
              <path d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            ),
          },
          {
            label: "Fail Count",
            value: failCount,
            color: "text-incorrect",
            bgColor: "bg-incorrect/10",
            icon: (
              <path d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            ),
          },
        ].map((stat) => (
          <div key={stat.label} className="quiz-card p-6">
            <div className="flex items-center gap-3 mb-3">
              <div
                className={`w-10 h-10 rounded-xl ${stat.bgColor} flex items-center justify-center`}
              >
                <svg
                  className={`w-5 h-5 ${stat.color}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  {stat.icon}
                </svg>
              </div>
            </div>
            <p className="font-display text-2xl font-bold text-white">
              {stat.value}
            </p>
            <p className="text-surface-400 text-sm mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Score Distribution */}
        <div className="quiz-card p-6">
          <h3 className="font-display text-lg font-semibold text-white mb-5">
            Score Distribution
          </h3>
          <div className="space-y-4">
            {buckets.map((bucket) => (
              <div key={bucket.label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-surface-300">{bucket.label}</span>
                  <span className="font-mono text-surface-400">
                    {bucket.count}
                  </span>
                </div>
                <div className="h-3 bg-surface-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-500 rounded-full transition-all duration-700"
                    style={{
                      width:
                        bucket.count > 0
                          ? `${(bucket.count / maxBucketCount) * 100}%`
                          : "0%",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Results Breakdown Donut */}
        <div className="quiz-card p-6">
          <h3 className="font-display text-lg font-semibold text-white mb-5">
            Results Breakdown
          </h3>
          <div className="flex flex-col items-center">
            <div className="relative w-48 h-48 mb-6">
              <div
                className="w-full h-full rounded-full"
                style={{ background: donutGradient }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-surface-900 flex flex-col items-center justify-center">
                  <span className="font-display text-3xl font-bold text-white">
                    {totalAttempts}
                  </span>
                  <span className="text-xs text-surface-400">Total</span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              {donutSegments.map((seg) => (
                <div key={seg.label} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: seg.color }}
                  />
                  <span className="text-sm text-surface-300">
                    {seg.label}{" "}
                    <span className="font-mono text-surface-400">
                      ({seg.count})
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section Performance */}
        <div className="quiz-card p-6 lg:col-span-2">
          <h3 className="font-display text-lg font-semibold text-white mb-5">
            Section Performance
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-surface-300">
                  LLM Architecture
                </span>
                <span className="text-sm font-mono text-white">
                  {avgLLMScore} / 5
                </span>
              </div>
              <div className="h-4 bg-surface-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-500 rounded-full transition-all duration-700"
                  style={{
                    width: `${(parseFloat(avgLLMScore) / 5) * 100}%`,
                  }}
                />
              </div>
              <p className="text-xs text-surface-500 mt-1">
                {totalAttempts > 0
                  ? Math.round((parseFloat(avgLLMScore) / 5) * 100)
                  : 0}
                % average
              </p>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-surface-300">
                  Prompt Engineering
                </span>
                <span className="text-sm font-mono text-white">
                  {avgPEScore} / 10
                </span>
              </div>
              <div className="h-4 bg-surface-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-400 rounded-full transition-all duration-700"
                  style={{
                    width: `${(parseFloat(avgPEScore) / 10) * 100}%`,
                  }}
                />
              </div>
              <p className="text-xs text-surface-500 mt-1">
                {totalAttempts > 0
                  ? Math.round((parseFloat(avgPEScore) / 10) * 100)
                  : 0}
                % average
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Attendees Table */}
      <div className="quiz-card overflow-hidden mb-8">
        <div className="p-6 border-b border-surface-800/50">
          <div className="flex items-center gap-3">
            <h3 className="font-display text-lg font-semibold text-white">
              Quiz Attendees
            </h3>
            <span className="tag bg-brand-500/10 text-brand-400 border border-brand-500/20">
              {totalAttempts}
            </span>
          </div>
        </div>

        {results.length === 0 ? (
          <div className="p-12 text-center">
            <svg
              className="w-16 h-16 text-surface-700 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
            >
              <path d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
            </svg>
            <p className="text-surface-400 text-lg font-medium">
              No quiz results found
            </p>
            <p className="text-surface-500 text-sm mt-1">
              Results will appear here once developers complete the quiz.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-800/50">
                  <th className="text-left p-4 text-surface-400 font-medium">
                    #
                  </th>
                  <th className="text-left p-4 text-surface-400 font-medium">
                    Name
                  </th>
                  <th className="text-left p-4 text-surface-400 font-medium">
                    Email
                  </th>
                  <th className="text-center p-4 text-surface-400 font-medium">
                    LLM (5)
                  </th>
                  <th className="text-center p-4 text-surface-400 font-medium">
                    PE (10)
                  </th>
                  <th className="text-center p-4 text-surface-400 font-medium">
                    Total (15)
                  </th>
                  <th className="text-center p-4 text-surface-400 font-medium">
                    %
                  </th>
                  <th className="text-center p-4 text-surface-400 font-medium">
                    Result
                  </th>
                  <th className="text-left p-4 text-surface-400 font-medium">
                    Date
                  </th>
                  <th className="text-right p-4 text-surface-400 font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {results.map((r, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-surface-800/50 hover:bg-surface-800/30 transition-colors"
                  >
                    <td className="p-4 text-surface-500 font-mono">
                      {idx + 1}
                    </td>
                    <td className="p-4 text-white font-medium">
                      {r.developerName}
                    </td>
                    <td className="p-4 text-surface-300">{r.email}</td>
                    <td className="p-4 text-center font-mono text-surface-300">
                      {r.llmScore}
                    </td>
                    <td className="p-4 text-center font-mono text-surface-300">
                      {r.promptEngineeringScore}
                    </td>
                    <td className="p-4 text-center font-mono text-white font-medium">
                      {r.totalScore}
                    </td>
                    <td className="p-4 text-center font-mono text-white font-medium">
                      {r.percentage}%
                    </td>
                    <td className="p-4 text-center">
                      <span className={`tag ${resultBadge(r.result)}`}>
                        {r.result}
                      </span>
                    </td>
                    <td className="p-4 text-surface-400 whitespace-nowrap">
                      {formatDate(r.submittedAt)}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() =>
                          router.push(`/admin/dashboard/user/${r.id}`)
                        }
                        className="inline-flex items-center gap-1.5 text-brand-400 hover:text-brand-300 text-sm font-medium transition-colors"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                          <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer */}
      <p className="text-surface-500 text-xs text-center mt-8 pb-6">
        TM Systems Pvt. Ltd. — AI Foundations Training Programme — Admin Panel
      </p>
    </div>
  );
}
