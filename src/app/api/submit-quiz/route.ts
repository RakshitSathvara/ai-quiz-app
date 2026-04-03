import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/firebase-admin";
import type {
  QuizSubmission,
  ResultStatus,
  FirestoreQuizDocument,
  FirestoreAnswer,
} from "@/lib/types";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: QuizSubmission = await request.json();

    if (!body.user?.name || !body.user?.email || !body.results) {
      return NextResponse.json(
        { error: "Missing required fields: user.name, user.email, results" },
        { status: 400 }
      );
    }

    if (!body.user.email.endsWith("@tmspl.com")) {
      return NextResponse.json(
        { error: "Only @tmspl.com email addresses are accepted" },
        { status: 400 }
      );
    }

    const { percentage } = body.results;
    let result: ResultStatus;
    if (percentage >= 80) {
      result = "Pass";
    } else if (percentage >= 60) {
      result = "Needs Review";
    } else {
      result = "Fail";
    }

    const answers: FirestoreAnswer[] = body.results.details.map(
      (detail, idx) => ({
        questionNumber: idx + 1,
        questionId: detail.id,
        question: detail.question,
        category: detail.category,
        userAnswer:
          detail.userAnswer !== undefined
            ? detail.options[detail.userAnswer]
            : "Not answered",
        userAnswerIndex: detail.userAnswer,
        correctAnswer: detail.options[detail.correctAnswer],
        correctAnswerIndex: detail.correctAnswer,
        isCorrect: detail.isCorrect,
        requiresJustification: detail.requiresJustification,
        scenarioContext: detail.scenarioContext || null,
        userJustification: detail.userJustification || null,
        explanation: detail.explanation || null,
        hintUsed: detail.hintUsed || false,
      })
    );

    const document: FirestoreQuizDocument = {
      developerName: body.user.name,
      email: body.user.email,
      totalScore: body.results.totalScore,
      llmScore: body.results.llmScore,
      promptEngineeringScore: body.results.peScore,
      percentage: body.results.percentage,
      result,
      submittedAt: body.submittedAt,
      answers,
    };

    const docRef = await getDb().collection("quiz-results").add(document);

    return NextResponse.json({ success: true, documentId: docRef.id });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { error: "Failed to save quiz results", details: message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    let query = getDb()
      .collection("quiz-results")
      .orderBy("submittedAt", "desc")
      .limit(100);

    if (email) {
      query = getDb()
        .collection("quiz-results")
        .where("email", "==", email)
        .orderBy("submittedAt", "desc")
        .limit(100);
    }

    const snapshot = await query.get();
    const results = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ results });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { error: "Failed to fetch results", details: message },
      { status: 500 }
    );
  }
}
