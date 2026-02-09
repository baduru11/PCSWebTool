import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { synthesizeAcademic } from "@/lib/voice/client";

// In-memory cache for consistent pronunciation
// Key: `${voiceId}:${text}`, Value: Buffer
const audioCache = new Map<string, Buffer>();

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { voiceId, text } = await request.json();

    if (!voiceId || !text) {
      return NextResponse.json({ error: "Missing voiceId or text" }, { status: 400 });
    }

    // Create cache key from voiceId and text
    const cacheKey = `${voiceId}:${text}`;

    // Check cache first
    let audioBuffer = audioCache.get(cacheKey);

    if (!audioBuffer) {
      // Generate and cache if not found
      audioBuffer = await synthesizeAcademic({ voiceId, text });
      audioCache.set(cacheKey, audioBuffer);

      // Limit cache size to 500 entries (prevent memory issues)
      if (audioCache.size > 500) {
        const firstKey = audioCache.keys().next().value;
        if (firstKey !== undefined) {
          audioCache.delete(firstKey);
        }
      }
    }

    return new NextResponse(new Uint8Array(audioBuffer), {
      headers: {
        "Content-Type": "audio/wav",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("TTS error:", error);
    return NextResponse.json({ error: "TTS failed" }, { status: 500 });
  }
}
