import { afterEach, describe, expect, test, vi } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";

import {
  fetchQuestionSample,
  fetchQuestionSampleWithMetadata,
  questionBankHasContent,
} from "./question-bank";

function makeSupabase(result: { data: unknown; error: unknown }) {
  const select = vi.fn().mockResolvedValue(result);
  const rpc = vi.fn(() => ({ select }));
  return { supabase: { rpc } as unknown as SupabaseClient, rpc, select };
}

function makeTableSupabase(result: { data: unknown; error: unknown }) {
  const limit = vi.fn().mockResolvedValue(result);
  const eqContent = vi.fn(() => ({ limit }));
  const eqComponent = vi.fn(() => ({ eq: eqContent }));
  const select = vi.fn(() => ({ eq: eqComponent }));
  const from = vi.fn(() => ({ select }));
  return {
    supabase: { from } as unknown as SupabaseClient,
    from,
    select,
    eqComponent,
    eqContent,
    limit,
  };
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("fetchQuestionSample", () => {
  test("requests a server-side random sample via the sample_question_bank RPC", async () => {
    const rows = [
      { content: "八", pinyin: "ba1" },
      { content: "把", pinyin: "ba3" },
    ];
    const { supabase, rpc, select } = makeSupabase({ data: rows, error: null });

    const result = await fetchQuestionSample(supabase, 1, 600);

    expect(rpc).toHaveBeenCalledWith("sample_question_bank", {
      p_component: 1,
      p_n: 600,
    });
    expect(select).toHaveBeenCalledWith("content, pinyin");
    expect(result).toEqual(rows);
  });

  test("returns an empty array when the RPC errors, so callers use their fallback content", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const { supabase } = makeSupabase({
      data: null,
      error: { message: "function does not exist" },
    });

    const result = await fetchQuestionSample(supabase, 2, 600);

    expect(result).toEqual([]);
    expect(errorSpy).toHaveBeenCalled();
  });

  test("returns an empty array when the RPC yields no rows", async () => {
    const { supabase } = makeSupabase({ data: null, error: null });

    const result = await fetchQuestionSample(supabase, 1, 50);

    expect(result).toEqual([]);
  });
});

describe("fetchQuestionSample dedup", () => {
  test("collapses dual-reading duplicate-content rows, merging their readings", async () => {
    const rows = [
      { content: "肚子", pinyin: "du3 zi5" },
      { content: "包子", pinyin: "bao1 zi5" },
      { content: "肚子", pinyin: "du4 zi5" },
    ];
    const { supabase } = makeSupabase({ data: rows, error: null });

    const result = await fetchQuestionSample(supabase, 2, 600);

    expect(result).toHaveLength(2);
    const duzi = result.find((row) => row.content === "肚子");
    expect(duzi?.pinyin).toBe("du3 zi5/du4 zi5");
  });

});

describe("questionBankHasContent", () => {
  test("looks up the exact content row and reports a match", async () => {
    const { supabase, from, eqComponent, eqContent, limit } = makeTableSupabase({
      data: [{ id: "row-1" }],
      error: null,
    });

    const result = await questionBankHasContent(supabase, 5, "我的假期");

    expect(from).toHaveBeenCalledWith("question_banks");
    expect(eqComponent).toHaveBeenCalledWith("component", 5);
    expect(eqContent).toHaveBeenCalledWith("content", "我的假期");
    expect(limit).toHaveBeenCalledWith(1);
    expect(result).toBe(true);
  });

  test("reports no match when no row has that content", async () => {
    const { supabase } = makeTableSupabase({ data: [], error: null });

    const result = await questionBankHasContent(supabase, 5, "不存在的话题");

    expect(result).toBe(false);
  });

  test("reports no match on query error, so validation fails closed", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const { supabase } = makeTableSupabase({
      data: null,
      error: { message: "boom" },
    });

    const result = await questionBankHasContent(supabase, 5, "我的假期");

    expect(result).toBe(false);
    expect(errorSpy).toHaveBeenCalled();
  });
});

describe("fetchQuestionSampleWithMetadata", () => {
  test("samples server-side and keeps id and metadata for metadata-built items", async () => {
    const rows = [
      { id: "a", content: "**背**包", pinyin: null, metadata: { type: "polyphonic" } },
    ];
    const { supabase, rpc, select } = makeSupabase({ data: rows, error: null });

    const result = await fetchQuestionSampleWithMetadata(supabase, 7, 100);

    expect(rpc).toHaveBeenCalledWith("sample_question_bank", {
      p_component: 7,
      p_n: 100,
    });
    expect(select).toHaveBeenCalledWith("id, content, pinyin, metadata");
    expect(result).toEqual(rows);
  });

  test("resolves to an empty array on error so callers fall back", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const { supabase } = makeSupabase({ data: null, error: { message: "boom" } });

    const result = await fetchQuestionSampleWithMetadata(supabase, 6, 200);

    expect(result).toEqual([]);
    expect(errorSpy).toHaveBeenCalled();
  });
});
