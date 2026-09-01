import { createClient, getSessionUser } from "@/lib/supabase/server";
import dynamic from "next/dynamic";
import { loadSelectedCharacter } from "@/lib/character-loader";
import { buildPlayerMemory } from "@/lib/gemini/player-memory";
import { shuffle } from "@/lib/utils";
import { fetchQuestionSampleWithMetadata } from "@/lib/question-bank";
import { C6_GROUPS_PER_CATEGORY, C6_WORDS_PER_GROUP } from "@/lib/constants";

const PracticeSession = dynamic(() => import("./practice-session").then(m => m.PracticeSession), {
  loading: () => (
    <div className="rounded-lg border p-6 space-y-4 animate-pulse">
      <div className="h-24 w-24 mx-auto rounded-full bg-muted" />
      <div className="h-16 w-full rounded bg-muted" />
      <div className="h-10 w-32 mx-auto rounded bg-muted" />
    </div>
  ),
});

// Fallback words per category, used only when the bank read returns nothing.
// Drawn from the same verified source as the bank: each word is an entry of the
// official 2021 普通话水平测试用普通话词语表 that carries the target contrast.
const FALLBACK_WORDS: Record<string, string[]> = {
  zhcs: ["财产", "财政", "菜蔬", "参数", "参照", "侧重", "场所", "沉思", "称赞", "充足"],
  nng: ["安定", "安静", "安装", "暗中", "板凳", "半径", "傍晚", "奔腾", "本领", "本能"],
  ln: ["老年", "哪里", "那里", "奶酪", "能力", "能量", "年龄", "奴隶", "努力", "来年"],
};

const CATEGORY_LABELS: Record<string, string> = {
  zhcs: "平翘舌音 — z/c/s vs zh/ch/sh",
  nng: "前后鼻音 — n vs ng",
  ln: "边鼻音 — l vs n",
};

const CATEGORY_ORDER = ["zhcs", "nng", "ln"] as const;

export default async function Component6Page({
  searchParams,
}: {
  searchParams: Promise<{ lpNode?: string }>;
}) {
  const { lpNode } = await searchParams;
  const supabase = await createClient();
  const user = await getSessionUser();

  const wordsPerCategory = C6_GROUPS_PER_CATEGORY * C6_WORDS_PER_GROUP;

  const [character, dbQuestions] = await Promise.all([
    loadSelectedCharacter(supabase, user!.id),
    // Sampled server-side: the drill bank is larger than any per-session cap,
    // and a capped PostgREST read would serve only its first physical rows.
    fetchQuestionSampleWithMetadata(supabase, 6, 200),
  ]);

  const playerMemory = await buildPlayerMemory(supabase, user!.id, character.id ?? "").catch(() => "");

  // If launched from learning path, use the node's specific questions
  let lpQuestions: string[] | null = null;
  let lpPinyin: Array<{ content: string; pinyin: string | null }> = [];
  if (lpNode) {
    const { data: nodeData } = await supabase
      .from("learning_nodes")
      .select("question_ids")
      .eq("id", lpNode)
      .single();

    if (nodeData?.question_ids?.length) {
      const { data: qData } = await supabase
        .from("question_banks")
        .select("content, pinyin")
        .in("id", nodeData.question_ids);

      if (qData?.length) {
        lpQuestions = qData.map((q: { content: string }) => q.content);
        lpPinyin = qData as Array<{ content: string; pinyin: string | null }>;
      }
    }
  }

  // Word → DB pinyin (tone-number form) for the on-screen pinyin hint. The drill
  // words are official word-table entries, most of which are absent from the
  // static bundled map, so the DB reading is the primary source here.
  const pinyinByWord = Object.fromEntries(
    [...dbQuestions, ...lpPinyin]
      .filter((q) => q.pinyin)
      .map((q) => [q.content, q.pinyin as string]),
  );

  // Group by category, shuffle, and take subset
  const categoryWords: Record<string, string[]> = { zhcs: [], nng: [], ln: [] };

  if (dbQuestions && dbQuestions.length > 0) {
    for (const q of dbQuestions) {
      const cat = (q.metadata as { category?: string })?.category;
      if (cat && cat in categoryWords) {
        categoryWords[cat].push(q.content);
      }
    }
  }

  // Build sequential word list: zhcs words, then nng words, then ln words
  // Each category shuffled independently, take wordsPerCategory from each
  const questions: string[] = [];
  const categoryBoundaries: Array<{ label: string; startIndex: number }> = [];

  if (lpQuestions) {
    // Learning path mode: use the node's specific questions directly (no category splitting)
    questions.push(...lpQuestions);
  } else {
    for (const cat of CATEGORY_ORDER) {
      const pool = categoryWords[cat].length > 0 ? categoryWords[cat] : FALLBACK_WORDS[cat];
      const selected = shuffle([...pool]).slice(0, wordsPerCategory);
      categoryBoundaries.push({
        label: CATEGORY_LABELS[cat],
        startIndex: questions.length,
      });
      questions.push(...selected);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-pixel text-base text-primary pixel-glow leading-relaxed">
          Component 6: Cantonese Mistakes
        </h1>
        <p className="text-muted-foreground">
          <span className="font-chinese">易错字词练习</span> — Practice high-frequency trouble sounds for Cantonese speakers.
        </p>
      </div>

      <PracticeSession
        questions={questions}
        pinyinByWord={pinyinByWord}
        character={character}
        characterId={character.id}
        component={6}
        categoryBoundaries={lpQuestions ? [] : categoryBoundaries}
        playerMemory={playerMemory}
        lpNodeId={lpNode}
      />
    </div>
  );
}
