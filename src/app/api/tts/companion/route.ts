import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { synthesizeCompanion } from "@/lib/voice/client";
import type { ExpressionName } from "@/types/character";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { voiceId, text, expression } = await request.json() as {
      voiceId: string;
      text: string;
      expression?: ExpressionName;
    };

    if (!voiceId || !text) {
      return NextResponse.json({ error: "Missing voiceId or text" }, { status: 400 });
    }

    const audioBuffer = await synthesizeCompanion({ voiceId, text, expression });

    if (!audioBuffer) {
      return NextResponse.json(
        { error: "Companion TTS temporarily unavailable", unavailable: true },
        { status: 503 }
      );
    }

    return new NextResponse(new Uint8Array(audioBuffer), {
      headers: {
        "Content-Type": "audio/wav",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("Companion TTS error:", error);
    return NextResponse.json(
      { error: "Companion TTS temporarily unavailable", unavailable: true },
      { status: 503 }
    );
  }
}
