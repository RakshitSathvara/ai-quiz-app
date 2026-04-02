"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { FirestoreQuizDocument } from "@/lib/types";

type ResultWithId = FirestoreQuizDocument & { id: string };

/* ── Neobrutalism stat card accent colors ── */
const STAT_COLORS = ["#FFD23F", "#74B9FF", "#88D498", "#FF6B6B"] as const;

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
    { label: "0–39%", min: 0, max: 39, count: 0, color: "#FF6B6B" },
    { label: "40–59%", min: 40, max: 59, count: 0, color: "#FFA552" },
    { label: "60–79%", min: 60, max: 79, count: 0, color: "#74B9FF" },
    { label: "80–100%", min: 80, max: 100, count: 0, color: "#88D498" },
  ];
  results.forEach((r) => {
    const b = buckets.find((b) => r.percentage >= b.min && r.percentage <= b.max);
    if (b) b.count++;
  });
  const maxBucketCount = Math.max(...buckets.map((b) => b.count), 1);

  // --- Donut chart ---
  const donutSegments = [
    { label: "Pass", count: passCount, color: "#88D498" },
    { label: "Needs Review", count: needsReviewCount, color: "#FFA552" },
    { label: "Fail", count: failCount, color: "#FF6B6B" },
  ];
  const donutGradient = (() => {
    if (totalAttempts === 0) return "conic-gradient(#F5F0E8 0deg 360deg)";
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

  const resultBadgeClass = (result: string) => {
    switch (result) {
      case "Pass":
        return "nb-badge nb-badge-pass";
      case "Needs Review":
        return "nb-badge nb-badge-review";
      default:
        return "nb-badge nb-badge-fail";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-nb-white">
        <div className="flex items-center gap-3" style={{ fontFamily: "'Space Mono', monospace", color: "#000" }}>
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
    <div className="min-h-screen bg-nb-white p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto animate-nb-slide-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3 sm:gap-4">
          <div
            className="w-10 h-10 sm:w-12 sm:h-12 bg-nb-yellow flex items-center justify-center shrink-0"
            style={{ border: "3px solid #000", boxShadow: "3px 3px 0 0 #000" }}
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-nb-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
            </svg>
          </div>
          <h1
            style={{ fontFamily: "'Syne', 'Arial Black', sans-serif", fontWeight: 800, fontSize: "clamp(1.5rem, 5vw, 2.25rem)", letterSpacing: "-0.02em", color: "#000" }}
          >
            Admin Dashboard
          </h1>
        </div>
        <button onClick={handleLogout} className="nb-btn-danger self-start sm:self-auto" style={{ padding: "8px 16px", fontSize: "0.875rem" }}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
          </svg>
          Logout
        </button>
      </div>

      {error && (
        <div
          className="p-4 mb-6"
          style={{ background: "#FF6B6B", border: "3px solid #000", boxShadow: "5px 5px 0 0 #000", fontFamily: "'Space Mono', monospace", fontWeight: 700 }}
        >
          {error}
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-8">
        {[
          {
            label: "Total Attempts",
            value: totalAttempts,
            icon: (
              <path d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
            ),
          },
          {
            label: "Average Score",
            value: `${averageScore}%`,
            icon: (
              <path d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
            ),
          },
          {
            label: "Pass Rate",
            value: `${passRate}%`,
            icon: (
              <path d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            ),
          },
          {
            label: "Fail Count",
            value: failCount,
            icon: (
              <path d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            ),
          },
        ].map((stat, idx) => (
          <div
            key={stat.label}
            className="nb-stat-card animate-nb-count-up overflow-hidden"
            style={{ background: STAT_COLORS[idx], animationDelay: `${idx * 0.1}s`, padding: "16px", border: "3px solid #000", boxShadow: "4px 4px 0 0 #000" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-nb-black"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                {stat.icon}
              </svg>
            </div>
            <p
              style={{ fontFamily: "'Syne', 'Arial Black', sans-serif", fontWeight: 800, fontSize: "clamp(1.5rem, 8vw, 3rem)", lineHeight: 1, color: "#000" }}
            >
              {stat.value}
            </p>
            <p
              className="mt-1 sm:mt-2"
              style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 700, fontSize: "clamp(0.7rem, 2vw, 0.875rem)", color: "#000" }}
            >
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-8">
        {/* Score Distribution */}
        <div
          className="p-4 sm:p-6"
          style={{ background: "#FFFDF5", border: "3px solid #000", boxShadow: "4px 4px 0 0 #000" }}
        >
          <h3
            className="mb-4 sm:mb-5"
            style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 700, fontSize: "1.125rem", color: "#000" }}
          >
            Score Distribution
          </h3>
          <div className="space-y-4">
            {buckets.map((bucket) => (
              <div key={bucket.label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 700, color: "#000" }}>
                    {bucket.label}
                  </span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, color: "#000" }}>
                    {bucket.count}
                  </span>
                </div>
                <div className="nb-progress-track overflow-hidden">
                  <div
                    className="nb-progress-fill transition-all duration-700"
                    style={{
                      width:
                        bucket.count > 0
                          ? `${(bucket.count / maxBucketCount) * 100}%`
                          : "0%",
                      background: bucket.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Results Breakdown Donut */}
        <div
          className="p-4 sm:p-6"
          style={{ background: "#FFFDF5", border: "3px solid #000", boxShadow: "4px 4px 0 0 #000" }}
        >
          <h3
            className="mb-4 sm:mb-5"
            style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 700, fontSize: "1.125rem", color: "#000" }}
          >
            Results Breakdown
          </h3>
          <div className="flex flex-col items-center">
            <div className="relative w-36 h-36 sm:w-48 sm:h-48 mb-5">
              <div
                className="w-full h-full rounded-full"
                style={{ background: donutGradient, border: "3px solid #000" }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-nb-white flex flex-col items-center justify-center"
                  style={{ border: "3px solid #000" }}
                >
                  <span style={{ fontFamily: "'Syne', 'Arial Black', sans-serif", fontWeight: 800, fontSize: "clamp(1.25rem, 5vw, 2.25rem)", lineHeight: 1, color: "#000" }}>
                    {totalAttempts}
                  </span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", color: "#000", opacity: 0.6 }}>
                    Total
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
              {donutSegments.map((seg) => (
                <div key={seg.label} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 sm:w-4 sm:h-4"
                    style={{ backgroundColor: seg.color, border: "2px solid #000" }}
                  />
                  <span style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontSize: "0.8rem", color: "#000" }}>
                    {seg.label}{" "}
                    <span style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700 }}>
                      ({seg.count})
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section Performance */}
        <div
          className="p-4 sm:p-6 lg:col-span-2"
          style={{ background: "#FFFDF5", border: "3px solid #000", boxShadow: "4px 4px 0 0 #000" }}
        >
          <h3
            className="mb-4 sm:mb-5"
            style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 700, fontSize: "1.125rem", color: "#000" }}
          >
            Section Performance
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 700, fontSize: "0.875rem", color: "#000" }}>
                  LLM Architecture
                </span>
                <span style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: "0.875rem", color: "#000" }}>
                  {avgLLMScore} / 5
                </span>
              </div>
              <div className="nb-progress-track overflow-hidden">
                <div
                  className="nb-progress-fill"
                  style={{
                    width: `${(parseFloat(avgLLMScore) / 5) * 100}%`,
                    background: parseFloat(avgLLMScore) / 5 >= 0.6 ? "#88D498" : "#FF6B6B",
                  }}
                />
              </div>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.75rem", color: "#000", opacity: 0.5, marginTop: "4px" }}>
                {totalAttempts > 0
                  ? Math.round((parseFloat(avgLLMScore) / 5) * 100)
                  : 0}
                % average
              </p>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 700, fontSize: "0.875rem", color: "#000" }}>
                  Prompt Engineering
                </span>
                <span style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: "0.875rem", color: "#000" }}>
                  {avgPEScore} / 10
                </span>
              </div>
              <div className="nb-progress-track overflow-hidden">
                <div
                  className="nb-progress-fill"
                  style={{
                    width: `${(parseFloat(avgPEScore) / 10) * 100}%`,
                    background: parseFloat(avgPEScore) / 10 >= 0.6 ? "#88D498" : "#FF6B6B",
                  }}
                />
              </div>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.75rem", color: "#000", opacity: 0.5, marginTop: "4px" }}>
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
      <div
        className="overflow-hidden mb-8"
        style={{ border: "3px solid #000", boxShadow: "4px 4px 0 0 #000" }}
      >
        <div
          className="p-4 sm:p-5 flex items-center gap-3"
          style={{ background: "#FFD23F", borderBottom: "3px solid #000" }}
        >
          <h3
            style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 700, fontSize: "1.125rem", color: "#000" }}
          >
            Quiz Attendees
          </h3>
          <span className="nb-badge nb-badge-info">
            {totalAttempts}
          </span>
        </div>

        {results.length === 0 ? (
          <div className="p-8 sm:p-12 text-center bg-nb-white">
            <svg
              className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="#000"
              strokeWidth={1}
              style={{ opacity: 0.3 }}
            >
              <path d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
            </svg>
            <p style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 700, fontSize: "1rem", color: "#000" }}>
              No quiz results found
            </p>
            <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "0.875rem", color: "#000", opacity: 0.5, marginTop: "4px" }}>
              Results will appear here once developers complete the quiz.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full" style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "0.8rem", minWidth: "700px" }}>
              <thead>
                <tr style={{ background: "#FFD23F", borderBottom: "3px solid #000" }}>
                  <th className="text-left p-3" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 700, color: "#000", borderRight: "1px solid #000" }}>
                    #
                  </th>
                  <th className="text-left p-3" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 700, color: "#000", borderRight: "1px solid #000" }}>
                    Name
                  </th>
                  <th className="text-left p-3" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 700, color: "#000", borderRight: "1px solid #000" }}>
                    Email
                  </th>
                  <th className="text-center p-3" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 700, color: "#000", borderRight: "1px solid #000" }}>
                    LLM (5)
                  </th>
                  <th className="text-center p-3" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 700, color: "#000", borderRight: "1px solid #000" }}>
                    PE (10)
                  </th>
                  <th className="text-center p-3" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 700, color: "#000", borderRight: "1px solid #000" }}>
                    Total
                  </th>
                  <th className="text-center p-3" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 700, color: "#000", borderRight: "1px solid #000" }}>
                    %
                  </th>
                  <th className="text-center p-3" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 700, color: "#000", borderRight: "1px solid #000" }}>
                    Result
                  </th>
                  <th className="text-left p-3" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 700, color: "#000", borderRight: "1px solid #000" }}>
                    Date
                  </th>
                  <th className="text-center p-3" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 700, color: "#000" }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {results.map((r, idx) => (
                  <tr
                    key={idx}
                    className="transition-colors"
                    style={{
                      background: idx % 2 === 0 ? "#FFFDF5" : "#FFF3E0",
                      borderBottom: "1px solid #000",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#74B9FF40"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = idx % 2 === 0 ? "#FFFDF5" : "#FFF3E0"; }}
                  >
                    <td className="p-3" style={{ fontFamily: "'Space Mono', monospace", color: "#000", borderRight: "1px solid #000" }}>
                      {idx + 1}
                    </td>
                    <td className="p-3" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 700, color: "#000", borderRight: "1px solid #000" }}>
                      {r.developerName}
                    </td>
                    <td className="p-3" style={{ color: "#000", borderRight: "1px solid #000", fontSize: "0.75rem" }}>
                      {r.email}
                    </td>
                    <td className="p-3 text-center" style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, color: "#000", borderRight: "1px solid #000" }}>
                      {r.llmScore}
                    </td>
                    <td className="p-3 text-center" style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, color: "#000", borderRight: "1px solid #000" }}>
                      {r.promptEngineeringScore}
                    </td>
                    <td className="p-3 text-center" style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, color: "#000", borderRight: "1px solid #000" }}>
                      {r.totalScore}
                    </td>
                    <td className="p-3 text-center" style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, color: "#000", borderRight: "1px solid #000" }}>
                      {r.percentage}%
                    </td>
                    <td className="p-3 text-center" style={{ borderRight: "1px solid #000" }}>
                      <span className={resultBadgeClass(r.result)}>
                        {r.result}
                      </span>
                    </td>
                    <td className="p-3 whitespace-nowrap" style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.7rem", color: "#000", borderRight: "1px solid #000" }}>
                      {formatDate(r.submittedAt)}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() =>
                          router.push(`/admin/dashboard/user/${r.id}`)
                        }
                        className="nb-btn text-sm"
                        style={{ padding: "4px 12px", fontSize: "0.75rem", boxShadow: "2px 2px 0 0 #000" }}
                      >
                        View
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
      <p
        className="text-center mt-8 pb-6"
        style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.7rem", color: "#000", opacity: 0.4 }}
      >
        TM Systems Pvt. Ltd. — AI Foundations Training Programme — Admin Panel
      </p>
    </div>
  );
}
