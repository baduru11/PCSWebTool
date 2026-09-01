import { createClient, getSessionUser } from "@/lib/supabase/server";
import dynamic from "next/dynamic";
import { loadSelectedCharacter } from "@/lib/character-loader";
import { buildPlayerMemory } from "@/lib/gemini/player-memory";
import { randomizeAnswerPositions, shuffle } from "@/lib/utils";
import { fetchQuestionSampleWithMetadata } from "@/lib/question-bank";
import { QUIZ_SIZES } from "@/lib/constants";
import type { QuizQuestion } from "@/types/practice";

const QuizSession = dynamic(() => import("../component-3/quiz-session").then(m => m.QuizSession), {
  loading: () => (
    <div className="rounded-lg border p-6 space-y-4 animate-pulse">
      <div className="h-24 w-24 mx-auto rounded-full bg-muted" />
      <div className="h-16 w-full rounded bg-muted" />
      <div className="h-10 w-32 mx-auto rounded bg-muted" />
    </div>
  ),
});

// Fallback polyphonic questions, used only when the bank read returns nothing.
// Every entry is drawn from the same verified source as the bank itself: the
// character's readings and both example words come from the official 2021
// 普通话水平测试用普通话词语表.
const FALLBACK_QUESTIONS: QuizQuestion[] = [
  { id: "1", type: "polyphonic", prompt: "**背**包", options: ["bēi", "bèi"], correctIndex: 0, explanation: "「背包」中的「背」读 bēi。该字的规范读音为 bēi／bèi（2021年版词语表）。" },
  { id: "2", type: "polyphonic", prompt: "手**背**", options: ["bēi", "bèi"], correctIndex: 1, explanation: "「手背」中的「背」读 bèi。该字的规范读音为 bēi／bèi（2021年版词语表）。" },
  { id: "3", type: "polyphonic", prompt: "不**便**", options: ["biàn", "pián"], correctIndex: 0, explanation: "「不便」中的「便」读 biàn。该字的规范读音为 biàn／pián（2021年版词语表）。" },
  { id: "4", type: "polyphonic", prompt: "**便**宜", options: ["biàn", "pián"], correctIndex: 1, explanation: "「便宜」中的「便」读 pián。该字的规范读音为 biàn／pián（2021年版词语表）。" },
  { id: "5", type: "polyphonic", prompt: "专**长**", options: ["cháng", "zhǎng"], correctIndex: 0, explanation: "「专长」中的「长」读 cháng。该字的规范读音为 cháng／zhǎng（2021年版词语表）。" },
  { id: "6", type: "polyphonic", prompt: "兄**长**", options: ["cháng", "zhǎng"], correctIndex: 1, explanation: "「兄长」中的「长」读 zhǎng。该字的规范读音为 cháng／zhǎng（2021年版词语表）。" },
  { id: "7", type: "polyphonic", prompt: "双**重**", options: ["chóng", "zhòng"], correctIndex: 0, explanation: "「双重」中的「重」读 chóng。该字的规范读音为 chóng／zhòng（2021年版词语表）。" },
  { id: "8", type: "polyphonic", prompt: "严**重**", options: ["chóng", "zhòng"], correctIndex: 1, explanation: "「严重」中的「重」读 zhòng。该字的规范读音为 chóng／zhòng（2021年版词语表）。" },
  { id: "9", type: "polyphonic", prompt: "**干**冰", options: ["gān", "gàn"], correctIndex: 0, explanation: "「干冰」中的「干」读 gān。该字的规范读音为 gān／gàn（2021年版词语表）。" },
  { id: "10", type: "polyphonic", prompt: "主**干**", options: ["gān", "gàn"], correctIndex: 1, explanation: "「主干」中的「干」读 gàn。该字的规范读音为 gān／gàn（2021年版词语表）。" },
  { id: "11", type: "polyphonic", prompt: "上**好**", options: ["hǎo", "hào"], correctIndex: 0, explanation: "「上好」中的「好」读 hǎo。该字的规范读音为 hǎo／hào（2021年版词语表）。" },
  { id: "12", type: "polyphonic", prompt: "喜**好**", options: ["hǎo", "hào"], correctIndex: 1, explanation: "「喜好」中的「好」读 hào。该字的规范读音为 hǎo／hào（2021年版词语表）。" },
  { id: "13", type: "polyphonic", prompt: "**教**书", options: ["jiāo", "jiào"], correctIndex: 0, explanation: "「教书」中的「教」读 jiāo。该字的规范读音为 jiāo／jiào（2021年版词语表）。" },
  { id: "14", type: "polyphonic", prompt: "主**教**", options: ["jiāo", "jiào"], correctIndex: 1, explanation: "「主教」中的「教」读 jiào。该字的规范读音为 jiāo／jiào（2021年版词语表）。" },
  { id: "15", type: "polyphonic", prompt: "上**空**", options: ["kōng", "kòng"], correctIndex: 0, explanation: "「上空」中的「空」读 kōng。该字的规范读音为 kōng／kòng（2021年版词语表）。" },
  { id: "16", type: "polyphonic", prompt: "填**空**", options: ["kōng", "kòng"], correctIndex: 1, explanation: "「填空」中的「空」读 kòng。该字的规范读音为 kōng／kòng（2021年版词语表）。" },
];

export default async function Component7Page({
  searchParams,
}: {
  searchParams: Promise<{ lpNode?: string }>;
}) {
  const { lpNode } = await searchParams;
  const supabase = await createClient();
  const user = await getSessionUser();

  const [character, dbQuestions] = await Promise.all([
    loadSelectedCharacter(supabase, user!.id),
    // Sampled server-side: the polyphone bank is larger than any per-session
    // cap, and a capped PostgREST read would serve only its first physical rows.
    fetchQuestionSampleWithMetadata(supabase, 7, 100),
  ]);

  const playerMemory = await buildPlayerMemory(supabase, user!.id, character.id ?? "").catch(() => "");

  // If launched from learning path, use the node's specific questions
  let lpQuizQuestions: QuizQuestion[] | null = null;
  if (lpNode) {
    const { data: nodeData } = await supabase
      .from("learning_nodes")
      .select("question_ids")
      .eq("id", lpNode)
      .single();

    if (nodeData?.question_ids?.length) {
      const { data: qData } = await supabase
        .from("question_banks")
        .select("id, content, metadata")
        .in("id", nodeData.question_ids);

      if (qData?.length) {
        const parsed = qData
          .filter((row: { metadata: unknown }) => row.metadata && typeof row.metadata === "object")
          .map((row: { id: string; content: string; metadata: { type: string; options: string[]; correctIndex: number; explanation: string } }) => ({
            id: row.id,
            type: row.metadata.type as QuizQuestion["type"],
            prompt: row.content,
            options: row.metadata.options,
            correctIndex: row.metadata.correctIndex,
            explanation: row.metadata.explanation,
          }));
        if (parsed.length) lpQuizQuestions = parsed;
      }
    }
  }

  let questions: QuizQuestion[];
  if (lpQuizQuestions) {
    questions = lpQuizQuestions;
  } else if (dbQuestions && dbQuestions.length > 0) {
    type PolyphonicMeta = {
      type: string;
      options: string[];
      correctIndex: number;
      explanation: string;
    };

    const allParsed = dbQuestions
      .filter((row) => row.metadata && typeof row.metadata === "object")
      .map((row) => {
        const meta = row.metadata as PolyphonicMeta;
        return {
          id: row.id,
          type: meta.type as QuizQuestion["type"],
          prompt: row.content,
          options: meta.options,
          correctIndex: meta.correctIndex,
          explanation: meta.explanation,
        };
      });

    questions = shuffle(allParsed).slice(0, QUIZ_SIZES.POLYPHONIC);
  } else {
    questions = FALLBACK_QUESTIONS;
  }

  // Randomize answer order on the server only. The client must never
  // re-shuffle: SSR and hydration would disagree and throw React error 418.
  questions = questions.map(randomizeAnswerPositions);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-pixel text-base text-primary pixel-glow leading-relaxed">
          Component 7: Polyphonic Characters
        </h1>
        <p className="text-muted-foreground">
          <span className="font-chinese">多音字练习</span> — Choose the correct pronunciation based on context.
        </p>
      </div>

      <QuizSession questions={questions} character={character} characterId={character.id} component={7} playerMemory={playerMemory} lpNodeId={lpNode} />
    </div>
  );
}
