export interface QuizUser {
  name: string;
  email: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
  requiresJustification?: boolean;
  scenarioContext?: string;
  justificationHint?: string;
  explanation?: string;
}

export interface GeneratedQuiz {
  llmQuestions: QuizQuestion[];
  peQuestions: QuizQuestion[];
  totalQuestions: number;
  generatedAt: string;
}

export interface AnswerDetail {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  userAnswer: number | undefined;
  isCorrect: boolean;
  category: string;
  requiresJustification: boolean;
  scenarioContext: string | null;
  justificationHint: string | null;
  userJustification: string | null;
  explanation: string | null;
}

export interface QuizResults {
  llmScore: number;
  peScore: number;
  totalScore: number;
  percentage: number;
  details: AnswerDetail[];
}

export interface QuizSubmission {
  user: QuizUser;
  results: QuizResults;
  submittedAt: string;
}

export type ResultStatus = "Pass" | "Needs Review" | "Fail";

export interface FirestoreAnswer {
  questionNumber: number;
  questionId: string;
  question: string;
  category: string;
  userAnswer: string;
  userAnswerIndex: number | undefined;
  correctAnswer: string;
  correctAnswerIndex: number;
  isCorrect: boolean;
  requiresJustification: boolean;
  scenarioContext: string | null;
  userJustification: string | null;
  explanation: string | null;
}

export interface FirestoreQuizDocument {
  developerName: string;
  email: string;
  totalScore: number;
  llmScore: number;
  promptEngineeringScore: number;
  percentage: number;
  result: ResultStatus;
  submittedAt: string;
  answers: FirestoreAnswer[];
}
