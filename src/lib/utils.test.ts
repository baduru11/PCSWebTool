import { describe, expect, test } from "vitest";

import { sampleByTone, toneFromPinyin } from "./utils";

interface ToneItem {
  content: string;
  pinyin: string | null;
}

function makeItems(perTone: Record<1 | 2 | 3 | 4, number>, neutral = 0): ToneItem[] {
  const items: ToneItem[] = [];
  for (const tone of [1, 2, 3, 4] as const) {
    for (let i = 0; i < perTone[tone]; i++) {
      items.push({ content: `t${tone}-${i}`, pinyin: `ma${tone}` });
    }
  }
  for (let i = 0; i < neutral; i++) {
    items.push({ content: `t0-${i}`, pinyin: "ma" });
  }
  return items;
}

describe("toneFromPinyin", () => {
  test("reads the first tone digit", () => {
    expect(toneFromPinyin("zhe2")).toBe(2);
    expect(toneFromPinyin("fu2 dian3")).toBe(2);
  });

  test("treats missing digits and missing pinyin as neutral", () => {
    expect(toneFromPinyin("ma")).toBe(0);
    expect(toneFromPinyin(null)).toBe(0);
    expect(toneFromPinyin(undefined)).toBe(0);
  });
});

describe("sampleByTone", () => {
  test("draws an even spread across tones 1-4 from an arbitrary slice", () => {
    const items = makeItems({ 1: 10, 2: 10, 3: 10, 4: 10 });

    const picked = sampleByTone(items, 20);

    expect(picked).toHaveLength(20);
    for (const tone of [1, 2, 3, 4] as const) {
      expect(picked.filter((it) => toneFromPinyin(it.pinyin) === tone)).toHaveLength(5);
    }
  });

  test("opens on a first-tone item when one exists", () => {
    const items = makeItems({ 1: 10, 2: 10, 3: 10, 4: 10 });

    const picked = sampleByTone(items, 20);

    expect(toneFromPinyin(picked[0]!.pinyin)).toBe(1);
  });

  test("returns every item when the slice is not larger than the request", () => {
    const items = makeItems({ 1: 2, 2: 2, 3: 2, 4: 2 });

    const picked = sampleByTone(items, 20);

    expect(picked).toHaveLength(items.length);
    expect(new Set(picked.map((it) => it.content)).size).toBe(items.length);
  });

  test("fills from leftovers (neutral included) when a tone group runs short", () => {
    const items = makeItems({ 1: 1, 2: 10, 3: 10, 4: 10 }, 5);

    const picked = sampleByTone(items, 24);

    expect(picked).toHaveLength(24);
    expect(new Set(picked.map((it) => it.content)).size).toBe(24);
  });

  test("never returns duplicate rows", () => {
    const items = makeItems({ 1: 30, 2: 30, 3: 30, 4: 30 }, 10);

    const picked = sampleByTone(items, 100);

    expect(new Set(picked.map((it) => it.content)).size).toBe(100);
  });
});
