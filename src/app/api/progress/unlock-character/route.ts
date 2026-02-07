import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { characterId } = (await request.json()) as { characterId: string };

    if (!characterId) {
      return NextResponse.json({ error: "Missing characterId" }, { status: 400 });
    }

    // Check if character is already unlocked
    const { data: existingUnlock } = await supabase
      .from("user_characters")
      .select("character_id")
      .eq("user_id", user.id)
      .eq("character_id", characterId)
      .single();

    if (existingUnlock) {
      return NextResponse.json({ error: "Character already unlocked" }, { status: 400 });
    }

    // Get character's unlock_cost_xp
    const { data: character } = await supabase
      .from("characters")
      .select("unlock_cost_xp")
      .eq("id", characterId)
      .single();

    if (!character) {
      return NextResponse.json({ error: "Character not found" }, { status: 404 });
    }

    // Get user's total_xp
    const { data: profile } = await supabase
      .from("profiles")
      .select("total_xp")
      .eq("id", user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Check if user has enough XP
    if (profile.total_xp < character.unlock_cost_xp) {
      return NextResponse.json(
        {
          error: "Not enough XP",
          required: character.unlock_cost_xp,
          current: profile.total_xp,
        },
        { status: 400 }
      );
    }

    // Deduct unlock_cost_xp from profile.total_xp
    const remainingXP = profile.total_xp - character.unlock_cost_xp;
    const { error: deductError } = await supabase
      .from("profiles")
      .update({ total_xp: remainingXP })
      .eq("id", user.id);

    if (deductError) {
      console.error("XP deduction error:", deductError);
      return NextResponse.json({ error: "Failed to deduct XP" }, { status: 500 });
    }

    // Insert into user_characters
    const { error: unlockError } = await supabase
      .from("user_characters")
      .insert({
        user_id: user.id,
        character_id: characterId,
        is_selected: false,
        affection_xp: 0,
        affection_level: 1,
      });

    if (unlockError) {
      console.error("Unlock error:", unlockError);
      // Try to refund the XP
      await supabase
        .from("profiles")
        .update({ total_xp: profile.total_xp })
        .eq("id", user.id);
      return NextResponse.json({ error: "Failed to unlock character" }, { status: 500 });
    }

    return NextResponse.json({ success: true, remainingXP });
  } catch (error) {
    console.error("Unlock character error:", error);
    return NextResponse.json({ error: "Unlock failed" }, { status: 500 });
  }
}
