import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateFeedback } from "@/lib/gemini/client";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const feedback = await generateFeedback(body);

    return NextResponse.json({ feedback });
  } catch (error) {
    console.error("AI feedback error:", error);
    return NextResponse.json({ error: "Feedback generation failed" }, { status: 500 });
  }
}
