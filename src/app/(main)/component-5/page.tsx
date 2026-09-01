import { createClient, getSessionUser } from "@/lib/supabase/server";
import dynamic from "next/dynamic";
import { loadSelectedCharacter } from "@/lib/character-loader";
import { buildPlayerMemory } from "@/lib/gemini/player-memory";
import { shuffle } from "@/lib/utils";
import { fetchQuestionSample } from "@/lib/question-bank";
import Link from "next/link";
import {
  getSupplementarySpeakingTopics,
  OFFICIAL_PSC_SPEAKING_TOPICS,
  OFFICIAL_PSC_SPEAKING_TOPICS_METADATA,
} from "@/lib/psc/official-speaking-topics";
import { Button } from "@/components/ui/button";

const SpeakingSession = dynamic(() => import("./speaking-session").then(m => m.SpeakingSession), {
  loading: () => (
    <div className="rounded-lg border p-6 space-y-4">
      <div className="h-24 w-24 mx-auto rounded-full animate-shimmer" />
      <div className="h-16 w-full rounded animate-shimmer" />
      <div className="h-10 w-32 mx-auto rounded animate-shimmer" />
    </div>
  ),
});

export default async function Component5Page({
  searchParams,
}: {
  searchParams: Promise<{ lpNode?: string; bank?: string }>;
}) {
  const { lpNode, bank } = await searchParams;
  const supabase = await createClient();
  const user = await getSessionUser();

  // Fetch selected character and a server-side random topic sample in
  // parallel (sample_question_bank RPC — a plain .limit() without ORDER BY
  // serves physical row order and starves newly inserted rows).
  const [character, dbTopics] = await Promise.all([
    loadSelectedCharacter(supabase, user!.id),
    fetchQuestionSample(supabase, 5, 150),
  ]);

  const playerMemory = await buildPlayerMemory(supabase, user!.id, character.id ?? "").catch(() => "");

  const supplementaryTopics = getSupplementarySpeakingTopics(
    dbTopics.map((question) => question.content)
  );
  const usesSupplementaryBank = bank === "supplementary" && supplementaryTopics.length > 0;
  const topics = shuffle(
    usesSupplementaryBank ? supplementaryTopics : [...OFFICIAL_PSC_SPEAKING_TOPICS]
  );
  const lpQuery = lpNode ? `&lpNode=${encodeURIComponent(lpNode)}` : "";

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-pixel text-base text-primary pixel-glow leading-relaxed">
          Component 5: Prompted Speaking
        </h1>
        <p className="text-muted-foreground">
          <span className="font-chinese">命题说话</span> — Speak on a given topic for 3 minutes with natural fluency and structure.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {usesSupplementaryBank
            ? "Supplementary practice bank · not used in the mock exam"
            : "Official PSC bank · 50 topics · two choices per session"}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          XiYouQuest automated feedback is for practice only. Official PSC Component 5 assessment is examiner-scored.
        </p>
        {!usesSupplementaryBank && (
          <p className="mt-1 text-xs text-muted-foreground">
            Source collection: {OFFICIAL_PSC_SPEAKING_TOPICS_METADATA.version} · effective {OFFICIAL_PSC_SPEAKING_TOPICS_METADATA.effectiveFrom}
          </p>
        )}
        <div className="mt-3 flex flex-wrap gap-2" aria-label="Speaking topic bank">
          <Button asChild size="sm" variant={usesSupplementaryBank ? "outline" : "default"}>
            <Link href={`/component-5?bank=official${lpQuery}`}>Official topics</Link>
          </Button>
          {supplementaryTopics.length > 0 && (
            <Button asChild size="sm" variant={usesSupplementaryBank ? "default" : "outline"}>
              <Link href={`/component-5?bank=supplementary${lpQuery}`}>Supplementary practice</Link>
            </Button>
          )}
        </div>
      </div>

      <SpeakingSession topics={topics} character={character} characterId={character.id} component={5} playerMemory={playerMemory} lpNodeId={lpNode} />
    </div>
  );
}
