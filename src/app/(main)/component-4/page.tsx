import { createClient, getSessionUser } from "@/lib/supabase/server";
import dynamic from "next/dynamic";
import { loadSelectedCharacter } from "@/lib/character-loader";
import { buildPlayerMemory } from "@/lib/gemini/player-memory";
import { shuffle } from "@/lib/utils";
import { fetchQuestionSampleWithMetadata } from "@/lib/question-bank";
import { scopeOfficialReadingPassage } from "@/lib/psc/reading-scope";
import {
  getReadingPassageSource,
  XIYOUQUEST_ORIGINAL_READING_SOURCE,
  type ReadingPassageSource,
} from "@/lib/psc/reading-passage-source";

const ReadingSession = dynamic(() => import("./reading-session").then(m => m.ReadingSession), {
  loading: () => (
    <div className="rounded-lg border p-6 space-y-4">
      <div className="h-24 w-24 mx-auto rounded-full animate-shimmer" />
      <div className="h-16 w-full rounded animate-shimmer" />
      <div className="h-10 w-32 mx-auto rounded animate-shimmer" />
    </div>
  ),
});

interface Passage {
  id: string;
  title: string;
  content: string;
  passageNumber: number | null;
  syllableCount: number;
  source: ReadingPassageSource;
}

// Default passages for Component 4 if no DB data available
const FALLBACK_PASSAGES: Passage[] = [
  {
    id: "1",
    title: "一段不赶的路",
    content: "我以前总以为，做事越快越好。后来我才明白，真正难的不是速度，而是把每一步走稳。那年我第一次独自出门旅行，行李不多，却把自己弄得很狼狈：票没看清，站台跑错，到了车门口儿才发现身份证差点儿掉在口袋外面。那一刻我很慌，心跳得厉害，脑子里全是\u201C来不及\u201D三个字。后来我深呼吸，停下来，把事情一件一件理顺：先确认车次，再找工作人员，再把包里每样东西摸一遍。结果不但赶上了车，心里反而更踏实。现在我遇到麻烦，常提醒自己：别急，先把顺序摆正；不怕慢，就怕乱。",
    passageNumber: null,
    syllableCount: 0,
    source: XIYOUQUEST_ORIGINAL_READING_SOURCE,
  },
  {
    id: "2",
    title: "把话说清楚",
    content: "说话这件事，看似简单，其实很讲究。很多误会不是因为事情复杂，而是因为表达不清楚：该说的没说到点儿上，不该说的又说得太满。后来我学会了一个办法：先把结论说出来，再补充理由，最后给出建议。这样做的好处是，对方能马上抓住重点，不会在细枝末节里绕来绕去。尤其在工作里，时间宝贵，语言越清晰，效率越高。把话说清楚，是对别人负责，也是对自己负责。",
    passageNumber: null,
    syllableCount: 0,
    source: XIYOUQUEST_ORIGINAL_READING_SOURCE,
  },
];

export default async function Component4Page({
  searchParams,
}: {
  searchParams: Promise<{ lpNode?: string }>;
}) {
  const { lpNode } = await searchParams;
  const supabase = await createClient();
  const user = await getSessionUser();

  // Fetch selected character and passages in parallel
  const [character, dbPassages] = await Promise.all([
    loadSelectedCharacter(supabase, user!.id),
    // Sampled server-side: a plain .limit() without ORDER BY serves physical row
    // order, so anything past the cap is never shown once the bank grows.
    fetchQuestionSampleWithMetadata(supabase, 4, 50),
  ]);

  const playerMemory = await buildPlayerMemory(supabase, user!.id, character.id ?? "").catch(() => "");

  // Parse DB passages or use fallback
  let passages: Passage[];
  if (dbPassages && dbPassages.length > 0) {
    passages = shuffle(dbPassages.map((row) => {
      const meta = (row.metadata ?? {}) as { title?: string; passage_number?: number };
      const scope = scopeOfficialReadingPassage(row.content);
      return {
        id: row.id,
        title: meta.title ?? "Untitled",
        content: scope.text,
        passageNumber: meta.passage_number ?? null,
        syllableCount: scope.syllableCount,
        source: getReadingPassageSource(row.metadata),
      };
    }));
  } else {
    passages = FALLBACK_PASSAGES.map((passage) => {
      const scope = scopeOfficialReadingPassage(passage.content);
      return { ...passage, content: scope.text, syllableCount: scope.syllableCount };
    });
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-pixel text-base text-primary pixel-glow leading-relaxed drop-shadow-md [text-shadow:_0_1px_4px_rgb(255_255_255_/_80%)]">
          Component 4: Passage Reading
        </h1>
        <p className="text-foreground/90 font-medium [text-shadow:_0_1px_3px_rgb(255_255_255_/_70%)]">
          <span className="font-chinese">朗读短文</span> — Read a passage aloud with correct pronunciation, pacing, and fluency.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          XiYouQuest practice scope: the first 400 Han characters. Titles, punctuation, and parenthetical annotations are excluded. This is not an official PSC result.
        </p>
      </div>

      <ReadingSession passages={passages} character={character} characterId={character.id} component={4} playerMemory={playerMemory} lpNodeId={lpNode} />
    </div>
  );
}
