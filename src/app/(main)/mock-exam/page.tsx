import { createClient } from "@/lib/supabase/server";
import dynamic from "next/dynamic";
import type { ExpressionName } from "@/types/character";
import { getCharacterImageFallback } from "@/lib/character-images";

const ExamRunner = dynamic(() => import("./exam-runner").then(m => m.ExamRunner), {
  loading: () => (
    <div className="rounded-lg border p-6 space-y-4 animate-pulse">
      <div className="h-24 w-24 mx-auto rounded-full bg-muted" />
      <div className="h-6 w-64 mx-auto rounded bg-muted" />
      <div className="h-10 w-40 mx-auto rounded bg-muted" />
    </div>
  ),
});

export default async function MockExamPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

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
    .eq("user_id", user!.id)
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

  const characterName = characterData?.name ?? "Study Buddy";
  const character = {
    id: characterData?.id ?? "",
    name: characterName,
    personalityPrompt: characterData?.personality_prompt ?? "You are a friendly and encouraging study companion.",
    voiceId: characterData?.voice_id ?? "",
    expressions: getCharacterImageFallback(characterName, expressions),
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
