import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ExamRunner } from "./exam-runner";
import type { ExpressionName } from "@/types/character";

export default async function MockExamPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch selected character with expressions
  const { data: userCharacter } = await supabase
    .from("user_characters")
    .select(`
      *,
      characters (
        *,
        character_expressions (*)
      )
    `)
    .eq("user_id", user.id)
    .eq("is_selected", true)
    .single();

  // Build character data
  const characterData = userCharacter?.characters;
  const expressions: Record<string, string> = {};

  if (characterData?.character_expressions) {
    for (const expr of characterData.character_expressions as Array<{
      expression_name: ExpressionName;
      image_url: string;
    }>) {
      expressions[expr.expression_name] = expr.image_url;
    }
  }

  const character = {
    id: characterData?.id ?? "",
    name: characterData?.name ?? "Study Buddy",
    personalityPrompt: characterData?.personality_prompt ?? "You are a friendly and encouraging study companion.",
    voiceId: characterData?.voice_id ?? "",
    expressions,
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Mock PSC Exam</h1>
        <p className="text-muted-foreground">
          模拟考试 - Complete all 5 components to get your estimated PSC grade.
        </p>
      </div>

      <ExamRunner character={character} />
    </div>
  );
}
