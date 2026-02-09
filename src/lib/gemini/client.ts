import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const MAX_RETRIES = 3;
const BASE_DELAY_MS = 1000;

async function withRetry<T>(fn: () => Promise<T>, retries = MAX_RETRIES): Promise<T> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error: unknown) {
      const isRetryable =
        error instanceof Error &&
        (error.message.includes("429") ||
          error.message.includes("503") ||
          error.message.includes("Resource exhausted"));

      if (!isRetryable || attempt === retries) throw error;

      const delay = BASE_DELAY_MS * Math.pow(2, attempt) + Math.random() * 500;
      console.warn(`[Gemini] Retrying in ${Math.round(delay)}ms (attempt ${attempt + 1}/${retries})...`);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw new Error("Unreachable");
}

export async function generateFeedback(params: {
  characterPrompt: string;
  component: number;
  questionText: string;
  userAnswer: string;
  pronunciationScore?: number;
  isCorrect: boolean;
}) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const systemPrompt = `${params.characterPrompt}

You are helping a student practice for the PSC (Putonghua Proficiency Test), Component ${params.component}.
Respond in a mix of Chinese and English as appropriate. Keep responses under 3 sentences.
Include the character's personality in your response.`;

  const userPrompt = params.pronunciationScore !== undefined
    ? `The student was asked to pronounce: "${params.questionText}"
Their pronunciation score was ${params.pronunciationScore}/100.
${params.isCorrect ? "They did well!" : "They need improvement."}
Give brief, specific feedback on their pronunciation.`
    : `The question was: "${params.questionText}"
The student answered: "${params.userAnswer}"
${params.isCorrect ? "They got it right!" : "They got it wrong."}
Give brief feedback.`;

  try {
    const result = await withRetry(() =>
      model.generateContent({
        contents: [{ role: "user", parts: [{ text: userPrompt }] }],
        systemInstruction: systemPrompt,
      })
    );
    return result.response.text();
  } catch (error) {
    console.error("[Gemini] Feedback generation failed after retries:", error);
    return params.isCorrect
      ? "做得好！继续加油！ Nice work, keep it up!"
      : "再试一次吧！Practice makes perfect!";
  }
}

export async function generateQuestions(params: {
  component: number;
  count: number;
  difficulty?: string;
}) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `Generate ${params.count} PSC (Putonghua Proficiency Test) practice questions for Component ${params.component}.
${params.difficulty ? `Difficulty: ${params.difficulty}` : ""}
Return as JSON array. Each item should have: content (the word/sentence), pinyin (if applicable).
Only return valid JSON, no markdown.`;

  const result = await withRetry(() => model.generateContent(prompt));
  return JSON.parse(result.response.text());
}
