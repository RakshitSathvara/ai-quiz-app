"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const validateEmail = (email: string): boolean => {
    return /^[a-zA-Z0-9._%+-]+@tmspl\.com$/.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { name?: string; email?: string } = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    } else if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email.trim())) {
      newErrors.email = "Only @tmspl.com email addresses are accepted";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);
    sessionStorage.setItem(
      "quizUser",
      JSON.stringify({ name: name.trim(), email: email.trim() })
    );
    router.push("/quiz");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-lg animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="tag bg-brand-500/10 text-brand-400 border border-brand-500/20 gap-1.5 mb-4 inline-flex">
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
            </svg>
            PHASE 1 ASSESSMENT
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mt-4">
            AI Foundations
            <br />
            <span className="text-brand-400">Knowledge Quiz</span>
          </h1>
          <p className="text-surface-300 text-lg mt-4 max-w-md mx-auto">
            15 questions covering LLM architecture, tokenisation, prompt
            engineering, and safe AI use.
          </p>
        </div>

        {/* Quiz Info Card */}
        <div className="quiz-card glow-border p-6 mb-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="font-display text-2xl font-bold text-white">
                15
              </div>
              <div className="text-surface-400 text-sm">Questions</div>
            </div>
            <div>
              <div className="font-display text-2xl font-bold text-white">
                5
              </div>
              <div className="text-surface-400 text-sm">LLM Core</div>
            </div>
            <div>
              <div className="font-display text-2xl font-bold text-white">
                10
              </div>
              <div className="text-surface-400 text-sm">Prompting</div>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="quiz-card p-8 space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-surface-300 mb-2"
            >
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rakshit Sharma"
              className="input-field"
            />
            {errors.name && (
              <p className="text-sm text-incorrect mt-2 flex items-center gap-1.5">
                <svg
                  className="w-4 h-4 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-surface-300 mb-2"
            >
              Office Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@tmspl.com"
              className="input-field"
            />
            <p className="text-xs text-surface-500 mt-1.5">
              Only @tmspl.com email addresses are accepted
            </p>
            {errors.email && (
              <p className="text-sm text-incorrect mt-2 flex items-center gap-1.5">
                <svg
                  className="w-4 h-4 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
                {errors.email}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full"
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
                Loading Quiz...
              </>
            ) : (
              <>
                Start Quiz
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-surface-500 text-xs mt-6 text-center">
          TM Systems Pvt. Ltd. — AI Foundations Training Programme
        </p>
      </div>
    </div>
  );
}
