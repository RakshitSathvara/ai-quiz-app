import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  ctx: RouteContext<"/api/submit-quiz/[id]">
): Promise<NextResponse> {
  try {
    const { id } = await ctx.params;

    const doc = await getDb().collection("quiz-results").doc(id).get();

    if (!doc.exists) {
      return NextResponse.json(
        { error: "Result not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      result: { id: doc.id, ...doc.data() },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { error: "Failed to fetch result", details: message },
      { status: 500 }
    );
  }
}
