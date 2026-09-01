import { createClient, getSessionUser } from "@/lib/supabase/server";
import dynamic from "next/dynamic";
import { loadSelectedCharacter } from "@/lib/character-loader";
import { shuffle, sampleByTone } from "@/lib/utils";
import { fetchQuestionSample, fetchQuestionSampleWithMetadata } from "@/lib/question-bank";
import type { QuizQuestion } from "@/types/practice";
import { OFFICIAL_PSC_SPEAKING_TOPICS } from "@/lib/psc/official-speaking-topics";
import { scopeOfficialReadingPassage } from "@/lib/psc/reading-scope";
import { getReadingPassageSource } from "@/lib/psc/reading-passage-source";
import { withConfiguredAcceptedAnswers } from "@/lib/quiz-answers";

const ExamRunner = dynamic(() => import("./exam-runner").then(m => m.ExamRunner), {
  loading: () => (
    <div className="rounded-lg border p-6 space-y-4 animate-pulse">
      <div className="h-24 w-24 mx-auto rounded-full bg-muted" />
      <div className="h-6 w-64 mx-auto rounded bg-muted" />
      <div className="h-10 w-40 mx-auto rounded bg-muted" />
    </div>
  ),
});

// Fallbacks if DB has no questions (100 monosyllabic characters for C1)
const FALLBACK_CHARACTERS = [
  "八", "把", "百", "办", "半", "包", "北", "本", "比", "边",
  "表", "别", "不", "才", "菜", "草", "茶", "长", "常", "场",
  "车", "城", "吃", "出", "穿", "船", "春", "词", "次", "从",
  "村", "大", "带", "到", "的", "等", "地", "点", "电", "东",
  "动", "都", "读", "短", "对", "多", "二", "发", "法", "饭",
  "方", "房", "放", "飞", "分", "风", "服", "父", "该", "高",
  "告", "哥", "歌", "给", "跟", "更", "工", "公", "共", "狗",
  "古", "故", "刮", "关", "光", "广", "国", "果", "过", "还",
  "孩", "海", "寒", "好", "喝", "和", "河", "黑", "很", "红",
  "后", "花", "话", "画", "坏", "欢", "换", "黄", "回", "会",
];
// Fallbacks if DB has no questions (50 multisyllabic words for C2)
const FALLBACK_WORDS = [
  "国王", "今日", "虐待", "难怪", "产品", "掉头", "遭受", "人群", "压力", "材料",
  "窘迫", "亏损", "翱翔", "永远", "佛典", "沙尘", "存在", "请求", "累赘", "发愣",
  "外面", "怎么", "赔偿", "勘察", "妨碍", "安排", "保护", "标准", "表演", "参加",
  "成功", "诚实", "传统", "打算", "代表", "道理", "发展", "丰富", "改变", "感觉",
  "工程", "贡献", "管理", "规律", "合作", "学习", "朋友", "因为", "需要", "国家",
];

function countHanSyllables(value: string): number {
  return [...value].filter((character) => /\p{Script=Han}/u.test(character)).length;
}

export default async function MockExamPage() {
  const supabase = await createClient();
  const user = await getSessionUser();

  const userId = user!.id;

  // Fetch character and all component questions in parallel. C1/C2 use the
  // sample_question_bank RPC (server-side random sample — a plain .limit()
  // without ORDER BY serves physical row order and starves newly inserted
  // rows); C3/C4 still need their full metadata sets.
  const [character, c1Questions, c2Questions, c3Questions, c4Passages] = await Promise.all([
    loadSelectedCharacter(supabase, userId),
    fetchQuestionSample(supabase, 1, 1100),
    fetchQuestionSample(supabase, 2, 600),
    fetchQuestionSampleWithMetadata(supabase, 3, 500),
    fetchQuestionSampleWithMetadata(supabase, 4, 50),
  ]);

  // Tone-stratified selection so the exam isn't skewed toward one tone (e.g. 3rd tone)
  const eligibleC1Questions = c1Questions.filter((question) => countHanSyllables(question.content) === 1);
  const eligibleC2Questions = c2Questions.filter((question) => countHanSyllables(question.content) === 2);
  const examCharacters: string[] = eligibleC1Questions.length >= 100
    ? sampleByTone(eligibleC1Questions, 100).map((q) => q.content)
    : shuffle(FALLBACK_CHARACTERS);
  const examWords: string[] = eligibleC2Questions.length >= 50
    ? sampleByTone(eligibleC2Questions, 50).map((q) => q.content)
    : shuffle(FALLBACK_WORDS);

  // C3: Parse quiz questions — pick 10 word-choice + 10 measure-word + 5 sentence-order
  let examQuizQuestions: QuizQuestion[] | undefined;
  if (c3Questions && c3Questions.length > 0) {
    const allParsed = c3Questions
      .filter((row) => row.metadata && typeof row.metadata === "object")
      .map((row) => {
        const meta = row.metadata as {
          type: string;
          options: string[];
          correctIndex: number;
          explanation: string;
          acceptedAnswers?: string[];
        };
        return {
          id: row.id,
          type: meta.type as QuizQuestion["type"],
          prompt: row.content,
          options: meta.options,
          correctIndex: meta.correctIndex,
          explanation: meta.explanation,
          acceptedAnswers: meta.acceptedAnswers,
        };
      })
      .map(withConfiguredAcceptedAnswers);
    const wc = shuffle(allParsed.filter(q => q.type === "word-choice")).slice(0, 10);
    const mw = shuffle(allParsed.filter(q => q.type === "measure-word")).slice(0, 10);
    const so = shuffle(allParsed.filter(q => q.type === "sentence-order")).slice(0, 5);
    if (wc.length === 10 && mw.length === 10 && so.length === 5) {
      examQuizQuestions = [...wc, ...mw, ...so];
    }
  }

  let examPassage: { id: string; title: string; content: string } | undefined;
  if (c4Passages && c4Passages.length > 0) {
    const schoolProvidedPassages = c4Passages.filter((passage) =>
      getReadingPassageSource(passage.metadata).isSchoolProvided
    );
    const picked = shuffle(schoolProvidedPassages)[0] as
      | { id: string; content: string; metadata: { title?: string } | null }
      | undefined;
    if (picked) {
      const scope = scopeOfficialReadingPassage(picked.content);
      examPassage = { id: picked.id, title: picked.metadata?.title ?? "Untitled", content: scope.text };
    }
  }

  const examTopics = shuffle([...OFFICIAL_PSC_SPEAKING_TOPICS]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-pixel text-base text-primary pixel-glow leading-relaxed">Mock PSC Exam</h1>
        <p className="text-muted-foreground">
          <span className="font-chinese">模拟考试</span> — Complete the formal five-component PSC-format practice simulation. This is XiYouQuest formative feedback, not an official PSC result.
        </p>
      </div>

      <ExamRunner
        character={{ ...character, id: character.id ?? "" }}
        characters={examCharacters}
        words={examWords}
        quizQuestions={examQuizQuestions}
        passage={examPassage}
        topics={examTopics}
      />
    </div>
  );
}
