# AI Foundations Quiz — Build Specification

> **Purpose**: This file is an instruction spec for Claude Code. Follow it step-by-step to scaffold and build the complete quiz application.

---

## Project Overview

Build a quiz web app for the **AI Foundations Training Programme Phase 1** at TM Systems Pvt. Ltd. The quiz assesses 18 developers on LLM architecture and prompt engineering knowledge.

**Stack**: Next.js 14 (App Router) · TypeScript · Tailwind CSS · Firebase Firestore
**Directory convention**: Use `src/` directory structure

---

## Step 1 — Scaffold the Project

Run the following to create and configure the project:

```bash
npx create-next-app@latest ai-quiz-app --typescript --tailwind --eslint --app --src-dir --no-import-alias
cd ai-quiz-app
npm install firebase-admin
```

After scaffolding, ensure the directory structure is:

```
ai-quiz-app/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── submit-quiz/
│   │   │       └── route.ts          # POST: save to Firestore, GET: fetch results
│   │   ├── quiz/
│   │   │   └── page.tsx              # Quiz interface
│   │   ├── results/
│   │   │   └── page.tsx              # Results + answer review
│   │   ├── globals.css               # Tailwind + custom component classes
│   │   ├── layout.tsx                # Root layout with fonts and metadata
│   │   └── page.tsx                  # Home: registration form
│   └── lib/
│       ├── types.ts                  # All TypeScript interfaces
│       ├── questions.ts              # Question bank + randomiser
│       └── firebase-admin.ts         # Firebase Admin SDK singleton
├── .env.local                        # Firebase credentials (gitignored)
├── tailwind.config.ts                # Extended theme
└── tsconfig.json                     # Path alias: @/* → ./src/*
```

Create any missing directories:

```bash
mkdir -p src/app/api/submit-quiz src/app/quiz src/app/results src/lib
```

---

## Step 2 — Configure tsconfig.json

Ensure the path alias maps `@/*` to `./src/*`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    },
    "strict": true
  }
}
```

---

## Step 3 — Configure Tailwind

In `tailwind.config.ts`, extend the default theme with these customisations:

### Fonts (load via Google Fonts in `globals.css`)

| Key | Font | Usage |
|-----|------|-------|
| `sans` | DM Sans | Body text |
| `display` | Outfit | Headings, buttons |
| `mono` | JetBrains Mono | Code, identifiers |

### Custom Colour Palette

```
brand-50 to brand-950   → Blue ramp (#eef7ff to #112759). Primary: brand-500 (#2d8dff), brand-600 (#166dfa)
surface-50 to surface-950 → Slate ramp (#f8fafc to #020617). Used for dark theme backgrounds and cards
correct    → #10b981 (green)
incorrect  → #ef4444 (red)
warning    → #f59e0b (amber)
```

### Custom Animations

```
fade-in   → fadeIn 0.5s ease-out (opacity 0→1)
slide-up  → slideUp 0.5s ease-out (translateY 20px→0 + opacity)
progress  → progress 0.4s ease-out (width 0%→target)
```

### Content Paths

```ts
content: [
  "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
]
```

---

## Step 4 — Global CSS (`src/app/globals.css`)

Import Google Fonts at the top:

```css
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Outfit:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
```

Define these `@layer components` classes:

| Class | Purpose | Key Styles |
|-------|---------|------------|
| `.quiz-card` | Card container | `bg-surface-900/60 backdrop-blur-sm border border-surface-700/50 rounded-2xl` |
| `.option-btn` | Answer option button | Full-width, left-aligned, `p-4 rounded-xl border-2`, flex with gap-3. States: `.selected` (brand-500 border+bg), `.correct` (green), `.incorrect` (red) |
| `.input-field` | Form inputs | `bg-surface-800/60 border-surface-600/50 rounded-xl`, focus ring with brand-500 |
| `.btn-primary` | CTA button | `bg-brand-600 hover:bg-brand-500 text-white font-display font-semibold rounded-xl shadow-lg`, disabled state at 40% opacity |
| `.btn-secondary` | Secondary button | `bg-surface-700/60 hover:bg-surface-600/60 text-surface-200 border-surface-600/50 rounded-xl` |
| `.tag` | Small pill label | `inline-flex px-3 py-1 rounded-full text-xs font-medium` |
| `.glow-border` | Decorative card border | Uses `::before` pseudo-element with gradient mask for a subtle blue glow |

Base layer: `body` gets `bg-surface-950 text-surface-100 antialiased`.

Add custom dark scrollbar styling and a `.noise-bg::after` fixed overlay with SVG noise texture at 3% opacity.

---

## Step 5 — TypeScript Types (`src/lib/types.ts`)

Define and export these interfaces:

```ts
QuizUser           { name: string; email: string }

QuizQuestion       {
  id: string                          // e.g. "llm-01", "pe-04"
  question: string                    // The question text
  options: string[]                   // Exactly 4 options
  correctAnswer: number               // Zero-indexed correct option
  category: string                    // e.g. "LLM Architecture", "Chain-of-Thought"
  requiresJustification?: boolean     // PE questions only
  scenarioContext?: string            // Real-world scenario for justification
  justificationHint?: string          // Guidance for what to explain
}

GeneratedQuiz      {
  llmQuestions: QuizQuestion[]        // 5 selected
  peQuestions: QuizQuestion[]         // 10 selected
  totalQuestions: number              // Always 15
  generatedAt: string                 // ISO timestamp
}

AnswerDetail       {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  userAnswer: number | undefined
  isCorrect: boolean
  category: string
  requiresJustification: boolean
  scenarioContext: string | null
  justificationHint: string | null
  userJustification: string | null
}

QuizResults        {
  llmScore: number                    // Out of 5
  peScore: number                     // Out of 10
  totalScore: number                  // Out of 15
  percentage: number                  // Rounded integer
  details: AnswerDetail[]             // 15 items
}

QuizSubmission     { user: QuizUser; results: QuizResults; submittedAt: string }

ResultStatus       = "Pass" | "Needs Review" | "Fail"

FirestoreAnswer    {
  questionNumber: number
  questionId: string
  question: string
  category: string
  userAnswer: string
  userAnswerIndex: number | undefined
  correctAnswer: string
  correctAnswerIndex: number
  isCorrect: boolean
  requiresJustification: boolean
  scenarioContext: string | null
  userJustification: string | null
}

FirestoreQuizDocument {
  developerName: string
  email: string
  totalScore: number
  llmScore: number
  promptEngineeringScore: number
  percentage: number
  result: ResultStatus
  submittedAt: string
  answers: FirestoreAnswer[]
}
```

---

## Step 6 — Question Bank (`src/lib/questions.ts`)

Create two typed arrays and one generator function.

### Array 1: `llmQuestions: QuizQuestion[]` — 18 questions

Write questions covering these topics from the AI Foundations Training Programme Sessions 1 & 2:

**LLM Pipeline (4–5 questions)**:
- The 4 stages: Tokenisation → Embedding → Transformer Layers → Output Probability
- Autoregressive generation (one token at a time)
- The model generates statistically plausible next tokens, NOT searching a database

**Transformer Architecture (3–4 questions)**:
- Self-attention: how tokens determine relevance to each other
- Multi-head attention: parallel attention heads learning different relationship types (syntax, coreference, semantic similarity)
- Feed-forward networks: transform attention output into richer representations
- Layer stacking: early=syntax, middle=semantics, deep=abstract reasoning

**Training Pipeline (2–3 questions)**:
- Pre-training: next-token prediction on trillions of tokens
- Supervised Fine-Tuning (SFT): instruction→response pairs
- RLHF/RLAIF: aligning with human preferences for helpfulness, harmlessness, honesty

**Tokenisation (3–4 questions)**:
- BPE algorithm: merging frequent adjacent pairs into subword tokens
- camelCase splitting: `getUserProfile` → `[get, User, Profile]`
- The ¾ rule (1 token ≈ ¾ word in English) and when it breaks (code, non-English, URLs, base64)
- Code tokenisation pitfalls: indentation, JSON keys, special characters

**Context Windows (2–3 questions)**:
- System prompt + history + input + output share ONE budget
- Output tokens also count against the window
- "Lost in the Middle" phenomenon: model attends more to start and end
- Overflow: API hard-fails, but performance degrades before the limit

**Cost Awareness (2 questions)**:
- Token cost calculation for API usage
- Model tier selection (Opus vs Sonnet vs Haiku) based on task complexity

### Array 2: `promptEngineeringQuestions: QuizQuestion[]` — 28 questions

At least 10 of these MUST have `requiresJustification: true` with `scenarioContext` and `justificationHint`.

**Prompting Techniques (6–8 questions)**:
- Zero-shot vs Few-shot: few-shot is the single most effective improvement (use real codebase examples)
- System prompts: anatomy = Role + Task + Constraints + Output Format + Edge Cases
- Chain-of-thought: 3 levels — Implicit ("think step by step"), Structured (specify format), Extended Thinking (built-in thinking block)
- Structured output: JSON schema specification, XML for nested structures, "Respond ONLY" pattern
- Iterative refinement: Generate → Review → Refine → Constrain → Finalise at 90%+
- Prompt composition: combining multiple techniques in one interaction
- The prompting mindset: you are a technical communicator; AI is the assistant

**Failure Modes (8–10 questions)**:
- Hallucination: plausible but non-existent API methods, mitigation = compilation/lint checks + tests
- Sycophancy: model agrees with wrong user assumptions, mitigation = neutral phrasing
- Prompt injection: malicious user input overrides system prompt
- Data leakage: sending proprietary code/PII to external APIs
- Training cutoff: outdated knowledge about fast-moving ecosystems
- Context overflow: send relevant code surgically, use RAG, break into focused interactions

**Governance (1–2 questions)**:
- AODF: AI-Origin Detection Framework with four-tier classification system

### Generator function: `generateQuiz(): GeneratedQuiz`

1. Fisher-Yates shuffle both arrays
2. Select 5 from LLM pool, 10 from PE pool
3. Guarantee at least 3 PE questions have `requiresJustification: true`
   - If fewer than 3 justification questions were randomly selected, re-shuffle: take 4 justification + 6 non-justification questions
4. Return the `GeneratedQuiz` object

---

## Step 7 — Firebase Admin Singleton (`src/lib/firebase-admin.ts`)

```ts
import { initializeApp, getApps, cert, type ServiceAccount } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

function getFirebaseAdmin(): Firestore {
  if (getApps().length > 0) {
    return getFirestore();
  }

  const serviceAccount: ServiceAccount = JSON.parse(
    process.env.FIREBASE_SERVICE_ACCOUNT_KEY || "{}"
  );

  initializeApp({
    credential: cert(serviceAccount),
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  });

  return getFirestore();
}

export const db: Firestore = getFirebaseAdmin();
```

Use `getApps().length` check to prevent duplicate initialisation during Next.js hot reload.

---

## Step 8 — Environment Variables (`.env.local`)

```env
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
FIREBASE_SERVICE_ACCOUNT_KEY=paste-your-service-account-json-here
```

Ensure `.env.local` is in `.gitignore`.

---

## Step 9 — Root Layout (`src/app/layout.tsx`)

- Export `metadata` with title: `"AI Foundations Quiz — Phase 1 | TM Systems"` and a description
- Apply `noise-bg min-h-screen` to `<body>`
- Add two fixed ambient gradient circles (decorative, z-index behind content):
  - Top-left: `bg-brand-600/8 w-96 h-96 rounded-full blur-3xl`
  - Bottom-right: `bg-brand-400/5 w-80 h-80 rounded-full blur-3xl`
- Wrap `{children}` in `<main className="relative z-10">`

---

## Step 10 — Page 1: Registration (`src/app/page.tsx`)

**Route**: `/`
**Directive**: `"use client"`

### State

```ts
const [name, setName] = useState<string>("")
const [email, setEmail] = useState<string>("")
const [errors, setErrors] = useState<{ name?: string; email?: string }>({})
const [isLoading, setIsLoading] = useState<boolean>(false)
```

### Email Validation

Only `@tmspl.com` emails accepted. Validate with regex on form submission (not on keystroke):

```ts
const validateEmail = (email: string): boolean => {
  return /^[a-zA-Z0-9._%+-]+@tmspl\.com$/.test(email);
};
```

### UI Layout

1. **Header section** (centered):
   - Tag badge: `"PHASE 1 ASSESSMENT"` with mortarboard SVG icon, styled as `tag bg-brand-500/10 text-brand-400 border border-brand-500/20`
   - Title: `font-display text-4xl sm:text-5xl font-bold` → "AI Foundations" on line 1, "Knowledge Quiz" in `text-brand-400` on line 2
   - Subtitle: `text-surface-300 text-lg` → "15 questions covering LLM architecture, tokenisation, prompt engineering, and safe AI use."

2. **Quiz info card** (`quiz-card glow-border p-6`):
   - 3-column grid showing: `15` Questions, `5` LLM Core, `10` Prompting
   - Numbers in `font-display text-2xl font-bold text-white`, labels in `text-surface-400 text-sm`

3. **Registration form** (`quiz-card p-8 space-y-6`):
   - Full Name: `<input>` with `input-field` class, placeholder "e.g. Your Name"
   - Office Email: `<input type="email">` with `input-field` class, placeholder "you@tmspl.com"
   - Helper text below email: `"Only @tmspl.com email addresses are accepted"` in `text-xs text-surface-500`
   - Error messages: `text-sm text-incorrect` with warning SVG icon
   - Submit button: `btn-primary w-full` → "Start Quiz" with arrow icon, loading state shows spinner + "Loading Quiz..."

4. **Footer**: `text-surface-500 text-xs mt-6` → "TM Systems Pvt. Ltd. — AI Foundations Training Programme"

### Submission Logic

```
Validate name (min 2 chars) and email (@tmspl.com)
→ If errors, set error state and show inline messages
→ If valid:
    sessionStorage.setItem("quizUser", JSON.stringify({ name, email }))
    router.push("/quiz")
```

---

## Step 11 — Page 2: Quiz Interface (`src/app/quiz/page.tsx`)

**Route**: `/quiz`
**Directive**: `"use client"`

### State

```ts
const [user, setUser] = useState<QuizUser | null>(null)
const [quiz, setQuiz] = useState<GeneratedQuiz | null>(null)
const [currentIndex, setCurrentIndex] = useState<number>(0)
const [answers, setAnswers] = useState<Record<string, number>>({})         // { questionId: selectedIndex }
const [justifications, setJustifications] = useState<Record<string, string>>({}) // { questionId: text }
const [showConfirm, setShowConfirm] = useState<boolean>(false)
const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
```

### Initialisation (useEffect on mount)

1. Read `sessionStorage.getItem("quizUser")` → if missing, `router.push("/")`
2. Call `generateQuiz()` to create randomised questions
3. Merge into single array: `[...quiz.llmQuestions, ...quiz.peQuestions]`

### Derived Values

```ts
const allQuestions = quiz ? [...quiz.llmQuestions, ...quiz.peQuestions] : []
const current = allQuestions[currentIndex]
const isLLMSection = currentIndex < 5
const answeredCount = Object.keys(answers).length
const allAnswered = answeredCount === 15
```

### UI Layout

1. **Header bar** (flex between):
   - Left: User avatar circle (first letter of name, `bg-brand-500/20 text-brand-400`) + name + email
   - Right: Section tag → `"LLM Core"` or `"Prompt Engineering"` based on `isLLMSection`

2. **Progress bar**:
   - Text: "Question X of 15" (left), "X/15 answered" (right)
   - Bar: `h-2 bg-surface-800 rounded-full`, inner fill with `linear-gradient(90deg, #166dfa, #2d8dff)`, width = `((currentIndex + 1) / 15) * 100%`
   - Section labels below: "LLM (1–5)" at 33.3% width, "Prompt Engineering (6–15)"

3. **Question card** (`quiz-card p-8`, keyed by `current.id` for animation):
   - Category tag: `tag bg-surface-800 text-surface-400`
   - Justification tag (conditional): `tag bg-warning/10 text-warning border border-warning/20` → "Justification Required"
   - Question text: `font-display text-xl font-semibold text-white`
   - Scenario context (conditional, for justification questions): `bg-surface-800/60 rounded-xl border border-surface-700/50 p-4` with question-mark SVG icon and "Scenario" label
   - **4 option buttons**: each is a `<button>` with `option-btn` class + `selected` class when chosen. Contains: letter badge (A/B/C/D) in `w-7 h-7 rounded-lg font-mono` + option text
   - **Justification textarea** (conditional): `input-field min-h-[120px] resize-y`, with `justificationHint` shown as italic helper text above
   - **Mandatory justification**: When a question has `requiresJustification === true`, the user MUST write a justification (minimum 10 characters) before the question counts as fully answered. Show an inline validation message (`text-sm text-warning`) below the textarea if the user tries to navigate away or submit without providing a justification. The question navigator dot should show a distinct "incomplete" state (e.g. `bg-warning/20 text-warning border-warning/30`) when the answer is selected but justification is missing.

4. **Navigation** (flex between):
   - Previous button: `btn-secondary`, disabled on first question
   - Next button: `btn-primary`, on last question changes to "Submit Quiz" (disabled until `allAnswered` — which now also requires all mandatory justifications to be filled)

5. **Question navigator dots** (flex wrap, centered):
   - 15 numbered buttons, `w-8 h-8 rounded-lg text-xs font-mono`
   - 3 states: current = `bg-brand-500 text-white scale-110`, answered = `bg-brand-500/20 text-brand-400 border-brand-500/30`, unanswered = `bg-surface-800 text-surface-500 border-surface-700/50`
   - Click any dot → `setCurrentIndex(idx)`
   - Below: "X questions remaining" in `text-surface-500 text-xs`

6. **Submit confirmation modal** (fixed overlay):
   - Backdrop: `bg-black/60 backdrop-blur-sm`
   - Card: `quiz-card p-8 max-w-md animate-slide-up`
   - Title: "Submit your quiz?"
   - Text: explains answers cannot be changed after submission
   - Two buttons: "Review Answers" (btn-secondary, closes modal) + "Confirm & Submit" (btn-primary, calls handleSubmit)

### Score Calculation (`calculateResults`)

```ts
function calculateResults(): QuizResults {
  let llmCorrect = 0, peCorrect = 0;
  const details: AnswerDetail[] = [];

  allQuestions.forEach((q, idx) => {
    const userAnswer = answers[q.id];
    const isCorrect = userAnswer === q.correctAnswer;
    if (idx < 5 && isCorrect) llmCorrect++;
    if (idx >= 5 && isCorrect) peCorrect++;
    details.push({ /* all fields from AnswerDetail */ });
  });

  return {
    llmScore: llmCorrect,
    peScore: peCorrect,
    totalScore: llmCorrect + peCorrect,
    percentage: Math.round(((llmCorrect + peCorrect) / 15) * 100),
    details,
  };
}
```

### Submission Flow

```
1. Calculate results
2. Build QuizSubmission object
3. POST to /api/submit-quiz (catch errors gracefully — still show results if Firebase fails)
4. sessionStorage.setItem("quizResults", JSON.stringify(submission))
5. router.push("/results")
```

---

## Step 12 — Page 3: Results (`src/app/results/page.tsx`)

**Route**: `/results`
**Directive**: `"use client"`

### State

```ts
const [submission, setSubmission] = useState<QuizSubmission | null>(null)
const [showDetails, setShowDetails] = useState<boolean>(false)
```

On mount: read `sessionStorage.getItem("quizResults")` → if missing, redirect to `/`.

### Grading Logic

```ts
if (percentage >= 80) → { label: "Pass", color: "correct", emoji: "🎯" }
if (percentage >= 60) → { label: "Needs Review", color: "warning", emoji: "📝" }
else                  → { label: "Needs Improvement", color: "incorrect", emoji: "📖" }
```

### UI Layout

1. **Result header** (centered): grade emoji (6xl), "Quiz Complete" (4xl bold), developer name

2. **Score card** (`quiz-card glow-border p-8`):
   - Percentage: `font-display text-7xl font-bold` with `%` in `text-3xl text-surface-400`
   - Grade badge: colour-coded tag
   - "X out of 15 correct" text
   - Two-column grid:
     - LLM Architecture: X/5, progress bar fill = `(llmScore / 5) * 100%`, colour `bg-brand-500`
     - Prompt Engineering: X/10, progress bar fill = `(peScore / 10) * 100%`, colour `bg-brand-400`

3. **Toggle button**: "Review Detailed Answers" / "Hide Detailed Answers" with chevron icon that rotates 180° when open

4. **Answer details** (conditional, animated):
   - Each answer as a `quiz-card p-6` with left border:
     - Correct: `border-l-4 border-l-correct`
     - Incorrect: `border-l-4 border-l-incorrect`
   - Header: Q number + category tag + correct/incorrect badge
   - Question text
   - All 4 options displayed with visual coding:
     - Correct answer: `bg-correct/10 border border-correct/30 text-correct` + "✓ Correct" label
     - User's wrong pick: `bg-incorrect/10 border border-incorrect/30 text-incorrect` + "Your answer" label
     - Other options: `bg-surface-800/30 text-surface-500`
   - Justification review (conditional): `bg-surface-800/40 rounded-xl p-4` showing user's written justification or "No justification provided" in italic

5. **Actions**: "Return to Home" button → clears both sessionStorage keys + navigates to `/`

6. **Footer**: "Results have been recorded to Firebase."

---

## Step 13 — API Route (`src/app/api/submit-quiz/route.ts`)

### POST handler

```ts
export async function POST(request: NextRequest): Promise<NextResponse>
```

1. Parse body as `QuizSubmission`
2. Validate: `user.name`, `user.email`, `results` all present
3. Validate: email ends with `@tmspl.com`
4. Determine `ResultStatus`: ≥80% = "Pass", 60–79% = "Needs Review", <60% = "Fail"
5. Build `FirestoreQuizDocument` with all scores + full answers array (including justifications)
6. Write to Firestore collection `"quiz-results"` using `db.collection("quiz-results").add(document)`
7. Return `{ success: true, documentId: docRef.id }`
8. On error: return 500 with `{ error, details }`

### GET handler

```ts
export async function GET(request: NextRequest): Promise<NextResponse>
```

1. Parse `?email=` query parameter (optional)
2. Query `quiz-results` collection, ordered by `submittedAt` desc
3. If email provided, filter with `.where("email", "==", email)`
4. Limit to 100 documents
5. Return `{ results: [...] }`

---

## Step 14 — Admin Login Page (`src/app/admin/page.tsx`)

**Route**: `/admin`
**Directive**: `"use client"`

### Purpose

Admin login gate. Only authenticated admins can view the dashboard.

### Credentials

```
Email:    admin@tmspl.com
Password: Admin@tmspl@123
```

Credentials are validated client-side against these hardcoded values (no Firebase Auth required).

### State

```ts
const [email, setEmail] = useState<string>("")
const [password, setPassword] = useState<string>("")
const [error, setError] = useState<string>("")
const [isLoading, setIsLoading] = useState<boolean>(false)
```

### UI Layout

1. **Centered card** (`quiz-card glow-border p-8 max-w-md`):
   - Shield/lock SVG icon at top: `w-12 h-12 text-brand-400`
   - Title: `font-display text-2xl font-bold text-white` → "Admin Login"
   - Subtitle: `text-surface-400 text-sm` → "Access the quiz results dashboard"
   - Email input: `input-field`, placeholder "admin@tmspl.com"
   - Password input: `input-field type="password"`, placeholder "Enter password"
   - Error message: `text-sm text-incorrect` with warning icon (shown on failed login)
   - Submit button: `btn-primary w-full` → "Sign In" with arrow icon, loading state shows spinner

### Login Logic

```
Validate email === "admin@tmspl.com" && password === "Admin@tmspl@123"
→ If invalid: show error "Invalid email or password"
→ If valid:
    sessionStorage.setItem("adminAuth", "true")
    router.push("/admin/dashboard")
```

---

## Step 15 — Admin Dashboard (`src/app/admin/dashboard/page.tsx`)

**Route**: `/admin/dashboard`
**Directive**: `"use client"`

### Auth Guard

On mount: check `sessionStorage.getItem("adminAuth") === "true"` → if not, redirect to `/admin`.

### State

```ts
const [results, setResults] = useState<FirestoreQuizDocument[]>([])
const [isLoading, setIsLoading] = useState<boolean>(true)
const [error, setError] = useState<string>("")
```

### Data Fetching

On mount: `GET /api/submit-quiz` → parse response → set results. Handle errors gracefully with error state.

### Derived Statistics (computed from results)

```ts
totalAttempts       = results.length
averageScore        = mean of all percentage values (rounded)
passCount           = results where result === "Pass"
needsReviewCount    = results where result === "Needs Review"
failCount           = results where result === "Fail"
passRate            = (passCount / totalAttempts) * 100
avgLLMScore         = mean of all llmScore values
avgPEScore          = mean of all promptEngineeringScore values
```

### UI Layout

1. **Header bar** (flex between):
   - Left: Shield icon + "Admin Dashboard" (`font-display text-2xl font-bold text-white`)
   - Right: "Logout" button (`btn-secondary`) → clears `sessionStorage.removeItem("adminAuth")` + navigates to `/admin`

2. **Stats cards row** (4-column grid, responsive → 2-col on mobile):
   - Total Attempts: `totalAttempts`, icon: users, colour: `text-brand-400`
   - Average Score: `averageScore%`, icon: chart-bar, colour: `text-brand-300`
   - Pass Rate: `passRate%`, icon: check-circle, colour: `text-correct`
   - Fail Count: `failCount`, icon: x-circle, colour: `text-incorrect`
   - Each card: `quiz-card p-6`, icon in `w-10 h-10 rounded-xl bg-{colour}/10` container

3. **Charts section** (2-column grid, responsive → stack on mobile):

   **Chart 1 — Score Distribution (Bar chart)**:
   - `quiz-card p-6` with title "Score Distribution"
   - Group results into percentage buckets: 0–39%, 40–59%, 60–79%, 80–100%
   - Horizontal bars with labels, bar fill uses `bg-brand-500`, width proportional to max count
   - Show count label at end of each bar

   **Chart 2 — Results Breakdown (Donut/Ring chart)**:
   - `quiz-card p-6` with title "Results Breakdown"
   - CSS-only donut chart using `conic-gradient` on a `w-48 h-48 rounded-full` div
   - Three segments: Pass (`--color-correct`), Needs Review (`--color-warning`), Fail (`--color-incorrect`)
   - Center overlay: `w-32 h-32 rounded-full bg-surface-900` with total count
   - Legend below with coloured dots + labels + counts

   **Chart 3 — Section Performance (Comparison bars)**:
   - `quiz-card p-6` with title "Section Performance"
   - Two bars comparing average LLM score (out of 5) vs average PE score (out of 10)
   - Each bar: label, score fraction, percentage bar with `bg-brand-500` / `bg-brand-400`

4. **Attendees table** (`quiz-card` wrapping a responsive table):
   - Title: "Quiz Attendees" with count badge
   - Table columns: `#`, `Name`, `Email`, `LLM (5)`, `PE (10)`, `Total (15)`, `%`, `Result`, `Date`
   - Rows styled with `border-b border-surface-800/50`, hover `bg-surface-800/30`
   - Result column: colour-coded badge using same `tag` classes:
     - Pass: `bg-correct/10 text-correct`
     - Needs Review: `bg-warning/10 text-warning`
     - Fail: `bg-incorrect/10 text-incorrect`
   - Date column: formatted as `DD MMM YYYY, HH:MM` from ISO string
   - Empty state: "No quiz results found" message with illustration
   - Mobile: table wraps in `overflow-x-auto`

5. **Footer**: `text-surface-500 text-xs mt-8` → "TM Systems Pvt. Ltd. — AI Foundations Training Programme — Admin Panel"

---

## Step 16 — Admin API Auth Route (`src/app/api/admin/login/route.ts`)

### POST handler

```ts
export async function POST(request: NextRequest): Promise<NextResponse>
```

1. Parse body: `{ email: string, password: string }`
2. Validate against hardcoded credentials: `admin@tmspl.com` / `Admin@tmspl@123`
3. If match: return `{ success: true }`
4. If no match: return 401 `{ error: "Invalid credentials" }`

> Note: This is a simple server-side validation for the admin login. The client also validates locally for immediate feedback, but the API route provides a secondary check.

---

## Step 17 — Updated Directory Structure

After adding admin pages, the structure should include:

```
src/
├── app/
│   ├── admin/
│   │   ├── page.tsx              # Admin login
│   │   └── dashboard/
│   │       └── page.tsx          # Admin dashboard
│   ├── api/
│   │   ├── admin/
│   │   │   └── login/
│   │   │       └── route.ts      # Admin auth endpoint
│   │   └── submit-quiz/
│   │       └── route.ts          # Quiz submission endpoint
│   ...
```

Create any missing directories:

```bash
mkdir -p src/app/admin/dashboard src/app/api/admin/login
```

---

## Step 18 — User Quiz Detail Page (`src/app/admin/dashboard/user/[id]/page.tsx`)

**Route**: `/admin/dashboard/user/[id]`
**Directive**: `"use client"`

### Purpose

Detailed view of a single user's quiz submission showing all questions, their answers, correct answers, and justifications. Uses modern **Glassmorphism** design with frosted glass panels, layered transparency, and subtle glow effects.

### API Route — Single Result (`src/app/api/submit-quiz/[id]/route.ts`)

#### GET handler

```ts
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse>
```

1. Extract `id` from route params
2. Fetch single document from `quiz-results` collection by document ID: `db.collection("quiz-results").doc(id).get()`
3. If document doesn't exist → return 404 `{ error: "Result not found" }`
4. Return `{ result: { id: doc.id, ...doc.data() } }`
5. On error: return 500 with `{ error, details }`

### Auth Guard

On mount: check `sessionStorage.getItem("adminAuth") === "true"` → if not, redirect to `/admin`.

### State

```ts
const [result, setResult] = useState<(FirestoreQuizDocument & { id: string }) | null>(null)
const [isLoading, setIsLoading] = useState<boolean>(true)
const [error, setError] = useState<string>("")
const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null)
```

### Data Fetching

On mount: `GET /api/submit-quiz/{id}` → parse response → set result. Handle errors gracefully with error state.

### Glassmorphism CSS Classes (add to `globals.css`)

```css
.glass-card {
  background: linear-gradient(135deg, rgb(15 23 42 / 0.7), rgb(15 23 42 / 0.4));
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgb(148 163 184 / 0.1);
  border-radius: 1.25rem;
  box-shadow: 0 8px 32px rgb(0 0 0 / 0.3), inset 0 1px 0 rgb(255 255 255 / 0.05);
}

.glass-card-hover:hover {
  background: linear-gradient(135deg, rgb(15 23 42 / 0.8), rgb(15 23 42 / 0.5));
  border-color: rgb(148 163 184 / 0.2);
  box-shadow: 0 8px 32px rgb(0 0 0 / 0.4), inset 0 1px 0 rgb(255 255 255 / 0.08);
}

.glass-header {
  background: linear-gradient(135deg, rgb(22 109 250 / 0.15), rgb(45 141 255 / 0.05));
  backdrop-filter: blur(20px);
  border: 1px solid rgb(45 141 255 / 0.2);
  border-radius: 1.25rem;
}

.glass-correct {
  background: linear-gradient(135deg, rgb(16 185 129 / 0.12), rgb(16 185 129 / 0.04));
  border: 1px solid rgb(16 185 129 / 0.2);
}

.glass-incorrect {
  background: linear-gradient(135deg, rgb(239 68 68 / 0.12), rgb(239 68 68 / 0.04));
  border: 1px solid rgb(239 68 68 / 0.2);
}

.glass-neutral {
  background: linear-gradient(135deg, rgb(30 41 59 / 0.6), rgb(30 41 59 / 0.3));
  border: 1px solid rgb(51 65 85 / 0.3);
}

.glass-justification {
  background: linear-gradient(135deg, rgb(245 158 11 / 0.08), rgb(245 158 11 / 0.02));
  border: 1px solid rgb(245 158 11 / 0.15);
  border-radius: 1rem;
}
```

### UI Layout

1. **Back navigation** (top-left):
   - "← Back to Dashboard" link styled as `text-surface-400 hover:text-brand-400` with arrow icon
   - Navigates to `/admin/dashboard`

2. **User header card** (`glass-header p-8`):
   - Large avatar circle: first letter of name, `w-20 h-20 rounded-2xl bg-brand-500/20 text-brand-400 font-display text-3xl`
   - Developer name: `font-display text-3xl font-bold text-white`
   - Email: `text-surface-400`
   - Submission date: formatted with clock icon
   - Three floating stat pills (flex row, gap-4):
     - Score: `{totalScore}/15` in `glass-card px-5 py-3`
     - Percentage: `{percentage}%` with colour-coded text based on result
     - Result badge: colour-coded `tag` (Pass=green, Needs Review=amber, Fail=red)

3. **Score breakdown** (2-column grid inside `glass-card p-6`):
   - LLM Architecture: score out of 5 with animated progress bar (`bg-brand-500`)
   - Prompt Engineering: score out of 10 with animated progress bar (`bg-brand-400`)
   - Each bar shows: label, fraction, percentage fill, and numeric percentage text

4. **Questions section header**:
   - Title: "Detailed Answers" with count badge `{answers.length} questions`
   - Summary line: `{correct} correct · {incorrect} incorrect`

5. **Question cards** (each answer as an expandable `glass-card` with transition):
   - **Collapsed state**: Shows question number, category tag, correct/incorrect icon badge, and question text (truncated to 1 line). Click to expand.
   - **Expanded state** (animated with slide-up):
     - Full question text: `text-white font-medium`
     - Category tag: `tag bg-surface-800/60 text-surface-300`
     - Justification required tag (conditional): `tag bg-warning/10 text-warning`
     - Scenario context (conditional): shown in `glass-justification p-4` with lightbulb icon
     - **All 4 options** displayed as glass panels:
       - Correct answer: `glass-correct rounded-xl p-4` with `✓ Correct Answer` label
       - User's wrong pick: `glass-incorrect rounded-xl p-4` with `✗ Your Answer` label
       - User's correct pick: `glass-correct rounded-xl p-4` with `✓ Your Answer` label
       - Other options: `glass-neutral rounded-xl p-4` with muted text
     - **Justification review** (conditional, for `requiresJustification` questions):
       - Container: `glass-justification p-5` with pen/edit icon
       - Label: "Developer's Justification" in `text-warning font-medium`
       - User's justification text or "No justification provided" in italic muted text

6. **Footer**: "← Back to Dashboard" button + "TM Systems Pvt. Ltd." text

### Updated Directory Structure

After adding user detail page:

```
src/
├── app/
│   ├── admin/
│   │   ├── page.tsx                    # Admin login
│   │   └── dashboard/
│   │       ├── page.tsx                # Admin dashboard
│   │       └── user/
│   │           └── [id]/
│   │               └── page.tsx        # User quiz detail (Glassmorphism)
│   ├── api/
│   │   ├── admin/
│   │   │   └── login/
│   │   │       └── route.ts            # Admin auth endpoint
│   │   └── submit-quiz/
│   │       ├── route.ts                # Quiz submission endpoint
│   │       └── [id]/
│   │           └── route.ts            # Single quiz result endpoint
│   ...
```

### Dashboard Table Update

Add an "Actions" column to the Quiz Attendees table:
- Column header: `Actions` (right-aligned)
- Each row: "View Details" button with eye icon, styled as `text-brand-400 hover:text-brand-300 text-sm font-medium`
- On click: `router.push(\`/admin/dashboard/user/${result.id}\`)`

---

## Step 19 — Validation Checklist

After building, verify:

### Admin Login
- `/admin` shows login form
- Wrong credentials → error message "Invalid email or password"
- Correct credentials (`admin@tmspl.com` / `Admin@tmspl@123`) → navigates to `/admin/dashboard`
- Direct visit to `/admin/dashboard` without login → redirects to `/admin`
- Logout button clears session and returns to `/admin`

### User Quiz Detail
- `/admin/dashboard/user/[id]` loads quiz result from Firebase by document ID
- Direct visit without admin auth → redirects to `/admin`
- Invalid/missing document ID → shows error state
- Header shows developer name, email, score, percentage, result badge, and submission date
- Score breakdown shows LLM and PE scores with progress bars
- All 15 question cards render with correct/incorrect visual coding
- Correct answer highlighted in green glass panel, wrong user pick in red
- Justification questions show scenario context and user's justification text
- Question cards are expandable/collapsible with smooth animation
- "Back to Dashboard" navigation works correctly
- Glassmorphism design: frosted glass cards, layered transparency, subtle glow effects
- Responsive layout: cards stack on mobile, text remains readable

### Admin Dashboard
- Stats cards show correct totals computed from Firebase data
- Score Distribution bar chart groups results into 4 buckets correctly
- Results Breakdown donut chart segments match Pass/Needs Review/Fail counts
- Section Performance bars reflect average LLM and PE scores
- Attendees table lists all quiz results with name, email, scores, result badge, and formatted date
- Result badges are colour-coded (green/amber/red)
- Empty state shown when no results exist
- Dashboard is responsive (cards stack, table scrolls horizontally on mobile)
- Attendees table has "View Details" button for each row
- Clicking "View Details" navigates to `/admin/dashboard/user/[id]` with correct document ID

### Registration
- Empty name → error message shown
- Name < 2 chars → error message shown
- Non-@tmspl.com email → error message shown
- Valid submission → navigates to `/quiz`
- Direct visit to `/quiz` without registration → redirects to `/`

### Quiz
- Exactly 15 questions generated (5 LLM + 10 PE)
- Questions randomise on each reload
- At least 3 PE questions show "Justification Required" tag
- Answer selection persists across navigation
- Dots update states correctly
- Submit button disabled until all 15 answered AND all mandatory justifications provided (min 10 chars each)
- Justification textarea only appears when `requiresJustification === true`
- Questions with `requiresJustification` that are answered but missing justification show a warning "incomplete" dot state
- Attempting to navigate away from a justification question without filling it shows an inline warning message

### Results
- Percentage calculated correctly
- Grade badge matches threshold
- Score bars proportional
- Answer review shows correct/incorrect colour coding
- Justification text displayed for applicable questions

### Firebase
- POST creates document in `quiz-results` collection
- All fields present including answers array with justifications
- GET returns ordered results
- App handles Firebase errors gracefully (still shows results)

---

## Firestore Collection Schema

**Collection**: `quiz-results`

```
{
  developerName: string,
  email: string,
  totalScore: number,         // 0–15
  llmScore: number,           // 0–5
  promptEngineeringScore: number,  // 0–10
  percentage: number,         // 0–100
  result: "Pass" | "Needs Review" | "Fail",
  submittedAt: string,        // ISO 8601
  answers: [                  // 15 items
    {
      questionNumber: number,
      questionId: string,
      question: string,
      category: string,
      userAnswer: string,
      userAnswerIndex: number | undefined,
      correctAnswer: string,
      correctAnswerIndex: number,
      isCorrect: boolean,
      requiresJustification: boolean,
      scenarioContext: string | null,
      userJustification: string | null
    }
  ]
}
```

---

## Design Constraints

- **Dark theme only** — body background is `surface-950`, cards are `surface-900/60`
- **No light mode toggle needed**
- All interactive elements need visible focus states and hover transitions
- Use `animate-fade-in` on page entry and `animate-slide-up` for modals
- Question card should re-animate when `currentIndex` changes (use `key={current.id}`)
- Mobile responsive: options stack vertically, dots wrap, score cards stack at narrow widths
