import type { SupabaseClient } from "@supabase/supabase-js";

/** Row shape C1/C2 consumers read (matches the previous `.select("content, pinyin")`). */
export interface QuestionSampleRow {
  content: string;
  pinyin: string | null;
}

/**
 * Uniform random sample of `count` question_banks rows for a component, drawn
 * server-side by the `sample_question_bank` RPC (ORDER BY random()).
 *
 * Replaces capped `.from("question_banks").limit(n)` reads: PostgREST without
 * an ORDER BY returns physical row order, so rows inserted after the original
 * seed sat past the cap and were never served. Errors resolve to an empty
 * array so callers keep their built-in fallback content.
 */
export async function fetchQuestionSample(
  supabase: SupabaseClient,
  component: number,
  count: number,
): Promise<QuestionSampleRow[]> {
  const { data, error } = await supabase
    .rpc("sample_question_bank", { p_component: component, p_n: count })
    .select("content, pinyin");

  if (error) {
    console.error(
      `[question-bank] sample_question_bank(component=${component}, n=${count}) failed:`,
      error,
    );
    return [];
  }

  // A few official words are stored as two rows with different readings
  // (dual-reading entries, e.g. 肚子 dǔzi/dùzi). Collapse them so one session
  // never shows the same visible word twice, merging the readings for display.
  const byContent = new Map<string, QuestionSampleRow>();
  for (const row of (data ?? []) as QuestionSampleRow[]) {
    const seen = byContent.get(row.content);
    if (!seen) {
      byContent.set(row.content, row);
    } else if (row.pinyin && seen.pinyin && !seen.pinyin.split("/").includes(row.pinyin)) {
      byContent.set(row.content, { ...seen, pinyin: `${seen.pinyin}/${row.pinyin}` });
    }
  }
  return [...byContent.values()];
}

/** Row shape consumers that build quiz items from `metadata` read. */
export interface QuestionSampleRowWithMetadata extends QuestionSampleRow {
  id: string;
  metadata: unknown;
}

/**
 * Same server-side uniform sample as {@link fetchQuestionSample}, but keeping
 * `id` and `metadata` for the components whose items are built from metadata
 * (C3/C6/C7). `sample_question_bank` returns SETOF question_banks, so the
 * extra columns come from the same call.
 *
 * Use this instead of `.from("question_banks").limit(n)` wherever a bank can
 * outgrow the cap: PostgREST without an ORDER BY serves physical row order, so
 * everything past the cap is silently never shown.
 */
export async function fetchQuestionSampleWithMetadata(
  supabase: SupabaseClient,
  component: number,
  count: number,
): Promise<QuestionSampleRowWithMetadata[]> {
  const { data, error } = await supabase
    .rpc("sample_question_bank", { p_component: component, p_n: count })
    .select("id, content, pinyin, metadata");

  if (error) {
    console.error(
      `[question-bank] sample_question_bank(component=${component}, n=${count}) failed:`,
      error,
    );
    return [];
  }

  return (data ?? []) as QuestionSampleRowWithMetadata[];
}

/**
 * Whether a question_banks row with exactly this content exists for the
 * component. Used to validate client-submitted values (e.g. C5 speaking
 * topics) against the whole bank instead of a capped list fetch, which
 * silently rejected rows past the cap. Errors fail closed (false).
 *
 * Content values are stored trimmed (and the C5 picker serves trimmed
 * strings), so the exact-equality match is safe.
 */
export async function questionBankHasContent(
  supabase: SupabaseClient,
  component: number,
  content: string,
): Promise<boolean> {
  const { data, error } = await supabase
    .from("question_banks")
    .select("id")
    .eq("component", component)
    .eq("content", content)
    .limit(1);

  if (error) {
    console.error(
      `[question-bank] content lookup (component=${component}) failed:`,
      error,
    );
    return false;
  }

  return (data ?? []).length > 0;
}

/**
 * Random sample of question IDs for a component via the same RPC, bounded so
 * large banks (C2 is 15k+ rows) never hit PostgREST's silent max-rows cap the
 * way an unranged `.select("id")` does. The RPC's ORDER BY random() also keeps
 * late-inserted rows evenly represented.
 */
export async function fetchQuestionIdSample(
  supabase: SupabaseClient,
  component: number,
  count: number,
): Promise<string[]> {
  const { data, error } = await supabase
    .rpc("sample_question_bank", { p_component: component, p_n: count })
    .select("id");

  if (error) {
    console.error(
      `[question-bank] id sample (component=${component}, n=${count}) failed:`,
      error,
    );
    return [];
  }

  return ((data ?? []) as { id: string }[]).map((row) => row.id);
}

/** Exact row count for a component (head request — no row transfer). */
export async function fetchQuestionCount(
  supabase: SupabaseClient,
  component: number,
): Promise<number> {
  const { count, error } = await supabase
    .from("question_banks")
    .select("id", { count: "exact", head: true })
    .eq("component", component);

  if (error) {
    console.error(`[question-bank] count (component=${component}) failed:`, error);
    return 0;
  }

  return count ?? 0;
}
