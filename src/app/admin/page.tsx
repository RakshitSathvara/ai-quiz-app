"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (email === "admin@tmspl.com" && password === "Admin@tmspl@123") {
      sessionStorage.setItem("adminAuth", "true");
      router.push("/admin/dashboard");
    } else {
      setError("Invalid email or password");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-nb-white">
      <div className="w-full max-w-md animate-nb-slide-in">
        <form
          onSubmit={handleSubmit}
          className="bg-nb-white border-3 border-nb-black shadow-nb-lg p-8"
          style={{ border: "3px solid #000", boxShadow: "8px 8px 0 0 #000" }}
        >
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div
              className="w-16 h-16 bg-nb-yellow flex items-center justify-center"
              style={{ border: "3px solid #000", boxShadow: "4px 4px 0 0 #000" }}
            >
              <svg
                className="w-8 h-8 text-nb-black"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
              </svg>
            </div>
          </div>

          <h1
            className="text-center mb-1"
            style={{ fontFamily: "'Syne', 'Arial Black', sans-serif", fontWeight: 800, fontSize: "2.25rem", letterSpacing: "-0.02em", color: "#000" }}
          >
            Admin Login
          </h1>
          <p
            className="text-center mb-8"
            style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontSize: "0.875rem", color: "#000", opacity: 0.6 }}
          >
            Access the quiz results dashboard
          </p>

          <div className="space-y-5">
            <div>
              <label
                htmlFor="admin-email"
                className="block mb-2"
                style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 700, fontSize: "0.875rem", color: "#000" }}
              >
                Email
              </label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@tmspl.com"
                className="nb-input"
                required
              />
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="block mb-2"
                style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 700, fontSize: "0.875rem", color: "#000" }}
              >
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="nb-input"
                required
              />
            </div>

            {error && (
              <div
                className="flex items-center gap-2 p-3 animate-nb-shake"
                style={{ background: "#FF6B6B", border: "2px solid #000", fontFamily: "'Space Mono', monospace", fontSize: "0.875rem", fontWeight: 700 }}
              >
                <svg
                  className="w-5 h-5 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="nb-btn w-full"
            >
              {isLoading ? (
                <>
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
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>

        <p
          className="text-center mt-6"
          style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.75rem", color: "#000", opacity: 0.5 }}
        >
          TM Systems Pvt. Ltd. — AI Foundations Training Programme
        </p>
      </div>
    </div>
  );
}
