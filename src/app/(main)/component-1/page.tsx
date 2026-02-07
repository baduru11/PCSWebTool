import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PracticeSession } from "./practice-session";
import type { ExpressionName } from "@/types/character";

// Default monosyllabic characters for Component 1 if no DB questions available
const DEFAULT_CHARACTERS = [
  "八", "把", "百", "办", "半", "包", "北", "本", "比", "边",
  "表", "别", "不", "才", "菜", "草", "茶", "长", "常", "场",
  "车", "城", "吃", "出", "穿", "船", "春", "词", "次", "从",
  "村", "大", "带", "到", "的", "等", "地", "点", "电", "东",
  "动", "都", "读", "短", "对", "多", "二", "发", "法", "饭",
];

export default async function Component1Page() {
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

  // Build character data for the practice session
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
    name: characterData?.name ?? "Study Buddy",
    personalityPrompt: characterData?.personality_prompt ?? "You are a friendly and encouraging study companion.",
    voiceId: characterData?.voice_id ?? "",
    expressions,
  };

  // Fetch questions from question_banks table
  const { data: dbQuestions } = await supabase
    .from("question_banks")
    .select("content")
    .eq("component", 1)
    .limit(100);

  const questions: string[] =
    dbQuestions && dbQuestions.length > 0
      ? dbQuestions.map((q: { content: string }) => q.content)
      : DEFAULT_CHARACTERS;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">
          Component 1: Monosyllabic Characters
        </h1>
        <p className="text-muted-foreground">
          读单音节字词 - Read monosyllabic characters with correct pronunciation and tones.
        </p>
      </div>

      <PracticeSession questions={questions} character={character} />
    </div>
  );
}
