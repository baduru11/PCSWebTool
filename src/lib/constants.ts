// --- Progress / XP ---
export const MAX_XP_PER_SESSION = 2000;
export const MAX_XP_NO_QUESTIONS = 50;

// --- Quiz sizes (Component 3 & 7) ---
// C3 mirrors the official 选择判断 section composition (词语判断 10 /
// 量词搭配 10 / 语序判断 5), matching the formal mock's C3 slice counts.
export const QUIZ_SIZES = {
  WORD_CHOICE: 10,
  MEASURE_WORD: 10,
  SENTENCE_ORDER: 5,
  POLYPHONIC: 15,
} as const;

// --- C6 session config ---
export const C6_GROUPS_PER_CATEGORY = 2;
export const C6_WORDS_PER_GROUP = 5;

// --- iFlytek ---
export const ISE_TIMEOUT_MS = 90_000;
export const ASR_TIMEOUT_MS = 120_000;

// --- TTS cache ---
export const TTS_CACHE_MAX_SIZE = 500;
