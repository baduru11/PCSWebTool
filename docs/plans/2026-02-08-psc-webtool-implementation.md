# PSC Web Tool — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a galgame-style AI-powered web tool for PSC exam preparation with anime character companions, speech recognition, and gamification.

**Architecture:** Next.js App Router with Supabase for auth/database, Azure Speech for pronunciation assessment, Gemini Flash for AI feedback, and Fish Audio/ElevenLabs for character voice cloning. Modular component-by-component build order.

**Tech Stack:** Next.js 14+ (App Router), TypeScript, Tailwind CSS, shadcn/ui, Supabase, Google Gemini Flash, Azure Speech Services, Fish Audio/ElevenLabs, Vercel

**Design doc:** `docs/plans/2026-02-08-psc-webtool-design.md`

---

## Phase 1: Project Scaffolding & Infrastructure

### Task 1: Initialize Git and Next.js Project

**Files:**
- Create: all Next.js boilerplate files
- Create: `.gitignore`
- Create: `.env.local.example`

**Step 1: Initialize git repo**

```bash
cd C:\Users\badur\baduru\02_Projects\PCSWebTool
git init
```

**Step 2: Create Next.js project in current directory**

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

When prompted, accept defaults. Since `docs/` and `doc/` already exist, the installer will work around them.

**Step 3: Verify the app runs**

```bash
npm run dev
```

Expected: App runs on http://localhost:3000 with the default Next.js page.

**Step 4: Install shadcn/ui**

```bash
npx shadcn@latest init
```

Select: New York style, Zinc base color, CSS variables = yes.

**Step 5: Install core shadcn components we'll need**

```bash
npx shadcn@latest add button card dialog progress avatar badge tabs input label toast separator scroll-area dropdown-menu
```

**Step 6: Create `.env.local.example`**

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Azure Speech
AZURE_SPEECH_KEY=your_azure_speech_key
AZURE_SPEECH_REGION=your_azure_region

# Gemini
GEMINI_API_KEY=your_gemini_api_key

# Voice Cloning (Fish Audio or ElevenLabs)
VOICE_API_KEY=your_voice_api_key
VOICE_API_BASE_URL=https://api.fish.audio
```

**Step 7: Create `.env.local` from example (user fills in real keys)**

Copy `.env.local.example` to `.env.local`. Ensure `.env.local` is in `.gitignore` (Next.js default includes it).

**Step 8: Commit**

```bash
git add -A
git commit -m "feat: initialize Next.js project with TypeScript, Tailwind, shadcn/ui"
```

---

### Task 2: Set Up Project Directory Structure

**Files:**
- Create: directory structure under `src/`
- Move: question bank markdown files to `src/data/`

**Step 1: Create the full directory structure**

```bash
# App routes
mkdir -p src/app/(auth)/login
mkdir -p src/app/(main)/dashboard
mkdir -p src/app/(main)/component-1
mkdir -p src/app/(main)/component-2
mkdir -p src/app/(main)/component-3
mkdir -p src/app/(main)/component-4
mkdir -p src/app/(main)/component-5
mkdir -p src/app/(main)/mock-exam
mkdir -p src/app/(main)/characters
mkdir -p src/app/api/speech
mkdir -p src/app/api/tts
mkdir -p src/app/api/ai/feedback
mkdir -p src/app/api/ai/generate
mkdir -p src/app/api/progress

# Components
mkdir -p src/components/shared
mkdir -p src/components/character
mkdir -p src/components/practice

# Libraries
mkdir -p src/lib/supabase
mkdir -p src/lib/azure-speech
mkdir -p src/lib/voice
mkdir -p src/lib/gemini
mkdir -p src/lib/question-bank
mkdir -p src/lib/gamification

# Types
mkdir -p src/types

# Data (question banks)
mkdir -p src/data
```

**Step 2: Copy question bank files to `src/data/`**

```bash
cp doc/monosyllabic.md src/data/
cp doc/multisyllabic.md src/data/
cp doc/egquestions.md src/data/
```

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: create project directory structure and copy question bank data"
```

---

### Task 3: Define TypeScript Types

**Files:**
- Create: `src/types/database.ts`
- Create: `src/types/character.ts`
- Create: `src/types/practice.ts`
- Create: `src/types/gamification.ts`

**Step 1: Create database types**

```typescript
// src/types/database.ts

export interface Profile {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  total_xp: number;
  current_level: number;
  created_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  component: 1 | 2 | 3 | 4 | 5;
  questions_attempted: number;
  questions_correct: number;
  best_streak: number;
  total_practice_time_seconds: number;
  last_practiced_at: string | null;
}

export interface Character {
  id: string;
  name: string;
  personality_description: string;
  personality_prompt: string;
  voice_id: string;
  image_url: string;
  unlock_cost_xp: number;
  is_default: boolean;
}

export interface CharacterExpression {
  id: string;
  character_id: string;
  expression_name: string;
  image_url: string;
}

export interface CharacterSkin {
  id: string;
  character_id: string;
  skin_name: string;
  image_url: string;
  required_affection_level: number;
}

export interface UserCharacter {
  user_id: string;
  character_id: string;
  unlocked_at: string;
  affection_xp: number;
  affection_level: number;
  active_skin_id: string | null;
  is_selected: boolean;
}

export interface PracticeSession {
  id: string;
  user_id: string;
  character_id: string;
  component: 1 | 2 | 3 | 4 | 5;
  score: number;
  xp_earned: number;
  duration_seconds: number;
  created_at: string;
}

export interface PracticeDetail {
  id: string;
  session_id: string;
  question_text: string;
  user_answer: string | null;
  is_correct: boolean;
  pronunciation_score: number | null;
  feedback: string | null;
}

export interface QuestionBank {
  id: string;
  component: 1 | 2 | 3 | 4 | 5;
  set_number: number;
  content: string;
  pinyin: string | null;
  metadata: Record<string, unknown>;
}
```

**Step 2: Create character types**

```typescript
// src/types/character.ts

export type ExpressionName =
  | "neutral"
  | "happy"
  | "proud"
  | "excited"
  | "thinking"
  | "encouraging"
  | "teasing"
  | "surprised"
  | "listening"
  | "disappointed";

export interface CharacterState {
  characterId: string;
  currentExpression: ExpressionName;
  dialogue: string;
  isAnimating: boolean;
}

export interface CharacterWithDetails {
  id: string;
  name: string;
  personality_description: string;
  personality_prompt: string;
  voice_id: string;
  image_url: string;
  unlock_cost_xp: number;
  is_default: boolean;
  expressions: Record<ExpressionName, string>; // expression_name -> image_url
  skins: Array<{
    id: string;
    skin_name: string;
    image_url: string;
    required_affection_level: number;
  }>;
}
```

**Step 3: Create practice types**

```typescript
// src/types/practice.ts

export type PracticeMode = "study" | "practice" | "mock-exam";

export type ComponentNumber = 1 | 2 | 3 | 4 | 5;

export interface PronunciationResult {
  text: string;
  accuracyScore: number;
  fluencyScore: number;
  completenessScore: number;
  pronunciationScore: number;
  words: WordResult[];
}

export interface WordResult {
  word: string;
  accuracyScore: number;
  errorType: "None" | "Omission" | "Insertion" | "Mispronunciation";
}

export interface QuizQuestion {
  id: string;
  type: "word-choice" | "measure-word" | "sentence-order";
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface PracticeState {
  mode: PracticeMode;
  component: ComponentNumber;
  currentQuestionIndex: number;
  totalQuestions: number;
  score: number;
  streak: number;
  results: QuestionResult[];
  isComplete: boolean;
  startedAt: number;
}

export interface QuestionResult {
  questionText: string;
  userAnswer: string | null;
  isCorrect: boolean;
  pronunciationScore: number | null;
  feedback: string;
  xpEarned: number;
}
```

**Step 4: Create gamification types**

```typescript
// src/types/gamification.ts

export interface XPEvent {
  type: "question_correct" | "question_good" | "question_attempted" | "daily_login" | "streak_bonus";
  baseXP: number;
  multiplier: number;
  totalXP: number;
}

export const XP_VALUES = {
  question_perfect: 10,
  question_good: 5,
  question_attempted: 2,
  daily_login: 25,
} as const;

export const STREAK_MULTIPLIERS: Record<number, number> = {
  5: 1.5,
  10: 2.0,
};

export const AFFECTION_LEVELS: Record<number, { name: string; xpRequired: number }> = {
  1: { name: "Acquaintance", xpRequired: 0 },
  2: { name: "Friend", xpRequired: 200 },
  3: { name: "Close Friend", xpRequired: 500 },
  4: { name: "Best Friend", xpRequired: 1000 },
  5: { name: "Soulmate", xpRequired: 2000 },
};

// User levels based on total XP
export const USER_LEVELS: Record<number, { name: string; xpRequired: number }> = {
  1: { name: "Beginner", xpRequired: 0 },
  2: { name: "Learner", xpRequired: 100 },
  3: { name: "Student", xpRequired: 300 },
  4: { name: "Practitioner", xpRequired: 600 },
  5: { name: "Scholar", xpRequired: 1000 },
  6: { name: "Expert", xpRequired: 1500 },
  7: { name: "Master", xpRequired: 2500 },
  8: { name: "Grandmaster", xpRequired: 4000 },
  9: { name: "Legend", xpRequired: 6000 },
  10: { name: "PSC God", xpRequired: 10000 },
};
```

**Step 5: Commit**

```bash
git add src/types/
git commit -m "feat: define TypeScript types for database, characters, practice, and gamification"
```

---

### Task 4: Set Up Supabase Client

**Files:**
- Create: `src/lib/supabase/client.ts`
- Create: `src/lib/supabase/server.ts`
- Create: `src/lib/supabase/middleware.ts`
- Create: `src/middleware.ts`

**Step 1: Install Supabase packages**

```bash
npm install @supabase/supabase-js @supabase/ssr
```

**Step 2: Create browser client**

```typescript
// src/lib/supabase/client.ts
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

**Step 3: Create server client**

```typescript
// src/lib/supabase/server.ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from Server Component — ignore
          }
        },
      },
    }
  );
}
```

**Step 4: Create middleware helper**

```typescript
// src/lib/supabase/middleware.ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect unauthenticated users to login (except for login page itself)
  if (
    !user &&
    !request.nextUrl.pathname.startsWith("/login") &&
    !request.nextUrl.pathname.startsWith("/api")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from login page
  if (user && request.nextUrl.pathname.startsWith("/login")) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
```

**Step 5: Create root middleware**

```typescript
// src/middleware.ts
import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

**Step 6: Commit**

```bash
git add src/lib/supabase/ src/middleware.ts
git commit -m "feat: set up Supabase client, server client, and auth middleware"
```

---

### Task 5: Supabase Database Schema (SQL Migration)

**Files:**
- Create: `supabase/migrations/001_initial_schema.sql`

**Step 1: Create migration file**

```sql
-- supabase/migrations/001_initial_schema.sql

-- ============================================
-- PROFILES (extends Supabase auth.users)
-- ============================================
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  total_xp INTEGER DEFAULT 0 NOT NULL,
  current_level INTEGER DEFAULT 1 NOT NULL,
  last_login_date DATE,
  login_streak INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- USER PROGRESS (per component)
-- ============================================
CREATE TABLE public.user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  component SMALLINT CHECK (component BETWEEN 1 AND 5) NOT NULL,
  questions_attempted INTEGER DEFAULT 0 NOT NULL,
  questions_correct INTEGER DEFAULT 0 NOT NULL,
  best_streak INTEGER DEFAULT 0 NOT NULL,
  total_practice_time_seconds INTEGER DEFAULT 0 NOT NULL,
  last_practiced_at TIMESTAMPTZ,
  UNIQUE(user_id, component)
);

ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own progress"
  ON public.user_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can upsert own progress"
  ON public.user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON public.user_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- CHARACTERS
-- ============================================
CREATE TABLE public.characters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  personality_description TEXT NOT NULL,
  personality_prompt TEXT NOT NULL,
  voice_id TEXT NOT NULL,
  image_url TEXT NOT NULL,
  unlock_cost_xp INTEGER DEFAULT 0 NOT NULL,
  is_default BOOLEAN DEFAULT false NOT NULL
);

ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Characters are publicly readable"
  ON public.characters FOR SELECT
  USING (true);

-- ============================================
-- CHARACTER EXPRESSIONS
-- ============================================
CREATE TABLE public.character_expressions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  character_id UUID REFERENCES public.characters(id) ON DELETE CASCADE NOT NULL,
  expression_name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  UNIQUE(character_id, expression_name)
);

ALTER TABLE public.character_expressions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Expressions are publicly readable"
  ON public.character_expressions FOR SELECT
  USING (true);

-- ============================================
-- CHARACTER SKINS
-- ============================================
CREATE TABLE public.character_skins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  character_id UUID REFERENCES public.characters(id) ON DELETE CASCADE NOT NULL,
  skin_name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  required_affection_level INTEGER DEFAULT 5 NOT NULL
);

ALTER TABLE public.character_skins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Skins are publicly readable"
  ON public.character_skins FOR SELECT
  USING (true);

-- ============================================
-- USER CHARACTERS (unlocks, affection, selection)
-- ============================================
CREATE TABLE public.user_characters (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  character_id UUID REFERENCES public.characters(id) ON DELETE CASCADE NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  affection_xp INTEGER DEFAULT 0 NOT NULL,
  affection_level INTEGER DEFAULT 1 NOT NULL,
  active_skin_id UUID REFERENCES public.character_skins(id) ON DELETE SET NULL,
  is_selected BOOLEAN DEFAULT false NOT NULL,
  PRIMARY KEY (user_id, character_id)
);

ALTER TABLE public.user_characters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own characters"
  ON public.user_characters FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own characters"
  ON public.user_characters FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own characters"
  ON public.user_characters FOR UPDATE
  USING (auth.uid() = user_id);

-- Auto-unlock default characters on profile creation
CREATE OR REPLACE FUNCTION public.handle_unlock_defaults()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_characters (user_id, character_id, is_selected)
  SELECT NEW.id, c.id, (ROW_NUMBER() OVER (ORDER BY c.name) = 1)
  FROM public.characters c
  WHERE c.is_default = true;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_unlock_defaults();

-- ============================================
-- PRACTICE SESSIONS
-- ============================================
CREATE TABLE public.practice_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  character_id UUID REFERENCES public.characters(id) NOT NULL,
  component SMALLINT CHECK (component BETWEEN 1 AND 5) NOT NULL,
  score REAL DEFAULT 0 NOT NULL,
  xp_earned INTEGER DEFAULT 0 NOT NULL,
  duration_seconds INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.practice_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sessions"
  ON public.practice_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions"
  ON public.practice_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- PRACTICE DETAILS
-- ============================================
CREATE TABLE public.practice_details (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES public.practice_sessions(id) ON DELETE CASCADE NOT NULL,
  question_text TEXT NOT NULL,
  user_answer TEXT,
  is_correct BOOLEAN DEFAULT false NOT NULL,
  pronunciation_score REAL,
  feedback TEXT
);

ALTER TABLE public.practice_details ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own details"
  ON public.practice_details FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.practice_sessions ps
      WHERE ps.id = session_id AND ps.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own details"
  ON public.practice_details FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.practice_sessions ps
      WHERE ps.id = session_id AND ps.user_id = auth.uid()
    )
  );

-- ============================================
-- QUESTION BANKS
-- ============================================
CREATE TABLE public.question_banks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  component SMALLINT CHECK (component BETWEEN 1 AND 5) NOT NULL,
  set_number INTEGER NOT NULL,
  content TEXT NOT NULL,
  pinyin TEXT,
  metadata JSONB DEFAULT '{}'::jsonb NOT NULL
);

ALTER TABLE public.question_banks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Question banks are publicly readable"
  ON public.question_banks FOR SELECT
  USING (true);
```

**Step 2: Run this migration in Supabase Dashboard**

Go to Supabase Dashboard → SQL Editor → paste and run the migration. Alternatively, if using Supabase CLI:

```bash
npx supabase db push
```

**Step 3: Seed default characters (run in SQL Editor)**

```sql
-- Two default characters
INSERT INTO public.characters (name, personality_description, personality_prompt, voice_id, image_url, unlock_cost_xp, is_default)
VALUES
  ('Mei Lin (美琳)', 'A warm and encouraging teacher who celebrates every small victory. Patient, gentle, always finds something positive to say.', 'You are Mei Lin (美琳), a warm and encouraging Putonghua teacher. You celebrate every small victory. You are patient and gentle. When the student makes mistakes, you gently correct them and always find something positive. You use encouraging phrases and sometimes add cute expressions. Speak naturally and warmly.', 'PLACEHOLDER_VOICE_ID_1', '/characters/meilin/neutral.png', 0, true),
  ('Hao Ran (浩然)', 'A sharp and competitive study rival who pushes you to do better. Direct, witty, teases you when you slip up but respects effort.', 'You are Hao Ran (浩然), a sharp and competitive study companion. You push the student to do better. You are direct and witty. When the student makes mistakes, you tease them lightly but always respect effort. You challenge them to beat their personal best. Your tone is playful rivalry.', 'PLACEHOLDER_VOICE_ID_2', '/characters/haoran/neutral.png', 0, true);

-- Placeholder expressions for both
INSERT INTO public.character_expressions (character_id, expression_name, image_url)
SELECT c.id, e.expression_name, '/characters/' || LOWER(SPLIT_PART(c.name, ' ', 1)) || '/' || e.expression_name || '.png'
FROM public.characters c
CROSS JOIN (
  VALUES ('neutral'), ('happy'), ('proud'), ('excited'), ('thinking'), ('encouraging'), ('teasing'), ('surprised'), ('listening'), ('disappointed')
) AS e(expression_name)
WHERE c.is_default = true;
```

**Step 4: Commit**

```bash
mkdir -p supabase/migrations
git add supabase/
git commit -m "feat: add Supabase database schema with RLS and seed data"
```

---

### Task 6: Set Up API Library Wrappers

**Files:**
- Create: `src/lib/gemini/client.ts`
- Create: `src/lib/azure-speech/client.ts`
- Create: `src/lib/voice/client.ts`
- Create: `src/lib/gamification/xp.ts`

**Step 1: Install Google Generative AI SDK**

```bash
npm install @google/generative-ai
```

**Step 2: Create Gemini wrapper**

```typescript
// src/lib/gemini/client.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

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

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: userPrompt }] }],
    systemInstruction: systemPrompt,
  });

  return result.response.text();
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

  const result = await model.generateContent(prompt);
  return JSON.parse(result.response.text());
}
```

**Step 3: Create Azure Speech wrapper**

```typescript
// src/lib/azure-speech/client.ts

const AZURE_SPEECH_KEY = process.env.AZURE_SPEECH_KEY!;
const AZURE_SPEECH_REGION = process.env.AZURE_SPEECH_REGION!;

export interface PronunciationAssessmentResult {
  accuracyScore: number;
  fluencyScore: number;
  completenessScore: number;
  pronunciationScore: number;
  words: Array<{
    word: string;
    accuracyScore: number;
    errorType: string;
  }>;
}

export async function assessPronunciation(
  audioBuffer: Buffer,
  referenceText: string,
  language: string = "zh-CN"
): Promise<PronunciationAssessmentResult> {
  const pronunciationAssessmentConfig = {
    referenceText,
    gradingSystem: "HundredMark",
    granularity: "Word",
    dimension: "Comprehensive",
  };

  const encodedConfig = Buffer.from(
    JSON.stringify(pronunciationAssessmentConfig)
  ).toString("base64");

  const response = await fetch(
    `https://${AZURE_SPEECH_REGION}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=${language}`,
    {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": AZURE_SPEECH_KEY,
        "Pronunciation-Assessment": encodedConfig,
        "Content-Type": "audio/wav",
        Accept: "application/json",
      },
      body: audioBuffer,
    }
  );

  if (!response.ok) {
    throw new Error(`Azure Speech API error: ${response.status}`);
  }

  const data = await response.json();
  const nbest = data.NBest?.[0];

  if (!nbest?.PronunciationAssessment) {
    throw new Error("No pronunciation assessment in response");
  }

  return {
    accuracyScore: nbest.PronunciationAssessment.AccuracyScore,
    fluencyScore: nbest.PronunciationAssessment.FluencyScore,
    completenessScore: nbest.PronunciationAssessment.CompletenessScore,
    pronunciationScore: nbest.PronunciationAssessment.PronScore,
    words: (nbest.Words || []).map((w: Record<string, unknown>) => ({
      word: w.Word,
      accuracyScore: (w.PronunciationAssessment as Record<string, number>)?.AccuracyScore ?? 0,
      errorType: (w.PronunciationAssessment as Record<string, string>)?.ErrorType ?? "None",
    })),
  };
}
```

**Step 4: Create Voice cloning wrapper**

```typescript
// src/lib/voice/client.ts

const VOICE_API_KEY = process.env.VOICE_API_KEY!;
const VOICE_API_BASE_URL = process.env.VOICE_API_BASE_URL || "https://api.fish.audio";

export async function synthesizeSpeech(params: {
  voiceId: string;
  text: string;
  language?: string;
}): Promise<Buffer> {
  const response = await fetch(`${VOICE_API_BASE_URL}/v1/tts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${VOICE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      reference_id: params.voiceId,
      text: params.text,
      format: "mp3",
      language: params.language || "zh",
    }),
  });

  if (!response.ok) {
    throw new Error(`Voice API error: ${response.status}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
```

**Step 5: Create XP calculation utility**

```typescript
// src/lib/gamification/xp.ts
import { XP_VALUES, STREAK_MULTIPLIERS, AFFECTION_LEVELS, USER_LEVELS } from "@/types/gamification";

export function calculateXP(params: {
  pronunciationScore?: number;
  isCorrect: boolean;
  currentStreak: number;
}): { baseXP: number; multiplier: number; totalXP: number } {
  let baseXP: number;

  if (params.pronunciationScore !== undefined) {
    if (params.pronunciationScore >= 90) baseXP = XP_VALUES.question_perfect;
    else if (params.pronunciationScore >= 60) baseXP = XP_VALUES.question_good;
    else baseXP = XP_VALUES.question_attempted;
  } else {
    baseXP = params.isCorrect ? XP_VALUES.question_perfect : XP_VALUES.question_attempted;
  }

  let multiplier = 1;
  for (const [streakThreshold, mult] of Object.entries(STREAK_MULTIPLIERS)) {
    if (params.currentStreak >= Number(streakThreshold)) {
      multiplier = mult;
    }
  }

  return {
    baseXP,
    multiplier,
    totalXP: Math.floor(baseXP * multiplier),
  };
}

export function getUserLevel(totalXP: number): { level: number; name: string; xpToNext: number | null } {
  let currentLevel = 1;
  let currentName = USER_LEVELS[1].name;

  for (const [level, config] of Object.entries(USER_LEVELS)) {
    if (totalXP >= config.xpRequired) {
      currentLevel = Number(level);
      currentName = config.name;
    }
  }

  const nextLevel = USER_LEVELS[currentLevel + 1];
  return {
    level: currentLevel,
    name: currentName,
    xpToNext: nextLevel ? nextLevel.xpRequired - totalXP : null,
  };
}

export function getAffectionLevel(affectionXP: number): { level: number; name: string; xpToNext: number | null } {
  let currentLevel = 1;
  let currentName = AFFECTION_LEVELS[1].name;

  for (const [level, config] of Object.entries(AFFECTION_LEVELS)) {
    if (affectionXP >= config.xpRequired) {
      currentLevel = Number(level);
      currentName = config.name;
    }
  }

  const nextLevel = AFFECTION_LEVELS[currentLevel + 1];
  return {
    level: currentLevel,
    name: currentName,
    xpToNext: nextLevel ? nextLevel.xpRequired - affectionXP : null,
  };
}
```

**Step 6: Commit**

```bash
git add src/lib/
git commit -m "feat: add API wrappers for Gemini, Azure Speech, voice cloning, and XP system"
```

---

### Task 7: Question Bank Parser

**Files:**
- Create: `src/lib/question-bank/parser.ts`

**Step 1: Create the markdown parser**

```typescript
// src/lib/question-bank/parser.ts
import fs from "fs";
import path from "path";

export interface ParsedQuestion {
  component: 1 | 2 | 3 | 4 | 5;
  setNumber: number;
  content: string;
  pinyin: string | null;
}

export function parseMonosyllabicFile(filePath: string): ParsedQuestion[] {
  const raw = fs.readFileSync(filePath, "utf-8");
  const lines = raw.split("\n").filter((l) => l.trim() && !l.startsWith("#") && !l.startsWith("---"));
  const questions: ParsedQuestion[] = [];

  let setNumber = 1;
  for (const line of lines) {
    const chars = line.trim().split(/\s+/);
    for (const char of chars) {
      if (char.length === 0) continue;
      questions.push({
        component: 1,
        setNumber,
        content: char,
        pinyin: null,
      });
    }
    // Each line of 10 characters = part of same set; every 100 chars = new set
    if (questions.filter((q) => q.setNumber === setNumber).length >= 100) {
      setNumber++;
    }
  }

  return questions;
}

export function parseMultisyllabicFile(filePath: string): ParsedQuestion[] {
  const raw = fs.readFileSync(filePath, "utf-8");
  const lines = raw.split("\n").filter((l) => l.trim() && !l.startsWith("#") && !l.startsWith("---"));
  const questions: ParsedQuestion[] = [];

  let setNumber = 1;
  let countInSet = 0;

  for (const line of lines) {
    const words = line.trim().split(/\s+/);
    for (const word of words) {
      if (word.length === 0) continue;
      questions.push({
        component: 2,
        setNumber,
        content: word,
        pinyin: null,
      });
      countInSet++;
      if (countInSet >= 50) {
        setNumber++;
        countInSet = 0;
      }
    }
  }

  return questions;
}

export function loadAllQuestions(dataDir: string): ParsedQuestion[] {
  const questions: ParsedQuestion[] = [];

  const monoPath = path.join(dataDir, "monosyllabic.md");
  if (fs.existsSync(monoPath)) {
    questions.push(...parseMonosyllabicFile(monoPath));
  }

  const multiPath = path.join(dataDir, "multisyllabic.md");
  if (fs.existsSync(multiPath)) {
    questions.push(...parseMultisyllabicFile(multiPath));
  }

  // Future: add parsers for component 3, 4, 5 files as they are created

  return questions;
}
```

**Step 2: Commit**

```bash
git add src/lib/question-bank/
git commit -m "feat: add question bank markdown parser for monosyllabic and multisyllabic files"
```

---

## Phase 2: Auth & Layout Shell

### Task 8: Login Page

**Files:**
- Create: `src/app/(auth)/login/page.tsx`
- Create: `src/app/(auth)/login/actions.ts`
- Create: `src/app/(auth)/login/login-form.tsx`

**Step 1: Create server actions for auth**

```typescript
// src/app/(auth)/login/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function loginWithGoogle() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  redirect(data.url);
}
```

**Step 2: Create login form component**

```tsx
// src/app/(auth)/login/login-form.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { login, signup } from "./actions";

export function LoginForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const action = isSignUp ? signup : login;
    const result = await action(formData);
    if (result?.error) {
      setError(result.error);
    }
    setLoading(false);
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">PSC Study Companion</CardTitle>
        <CardDescription>
          {isSignUp ? "Create an account to start learning" : "Welcome back! Sign in to continue"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required minLength={6} />
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm">
          <button
            type="button"
            onClick={() => { setIsSignUp(!isSignUp); setError(null); }}
            className="text-muted-foreground underline hover:text-foreground"
          >
            {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
```

**Step 3: Create login page**

```tsx
// src/app/(auth)/login/page.tsx
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <LoginForm />
    </div>
  );
}
```

**Step 4: Create OAuth callback route**

```typescript
// src/app/api/auth/callback/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(`${origin}/dashboard`);
}
```

**Step 5: Commit**

```bash
git add src/app/(auth)/ src/app/api/auth/
git commit -m "feat: add login/signup page with email and OAuth support"
```

---

### Task 9: Main Layout Shell with Navigation

**Files:**
- Create: `src/app/(main)/layout.tsx`
- Create: `src/components/shared/navbar.tsx`
- Create: `src/components/shared/xp-bar.tsx`

**Step 1: Create XP bar component**

```tsx
// src/components/shared/xp-bar.tsx
"use client";

import { Progress } from "@/components/ui/progress";
import { getUserLevel } from "@/lib/gamification/xp";

export function XPBar({ totalXP }: { totalXP: number }) {
  const { level, name, xpToNext } = getUserLevel(totalXP);
  const currentLevelXP = totalXP;
  const nextLevelXP = xpToNext ? totalXP + xpToNext : totalXP;
  const progress = xpToNext ? ((currentLevelXP) / nextLevelXP) * 100 : 100;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5">
        <span className="text-sm font-bold">Lv.{level}</span>
        <span className="text-xs text-muted-foreground">{name}</span>
      </div>
      <Progress value={progress} className="h-2 w-24" />
      <span className="text-xs text-muted-foreground">{totalXP} XP</span>
    </div>
  );
}
```

**Step 2: Create navbar**

```tsx
// src/components/shared/navbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { XPBar } from "./xp-bar";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/component-1", label: "C1" },
  { href: "/component-2", label: "C2" },
  { href: "/component-3", label: "C3" },
  { href: "/component-4", label: "C4" },
  { href: "/component-5", label: "C5" },
  { href: "/characters", label: "Characters" },
];

export function Navbar({ totalXP }: { totalXP: number }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-lg font-bold">
            PSC Companion
          </Link>
          <div className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={pathname.startsWith(item.href) ? "secondary" : "ghost"}
                  size="sm"
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <XPBar totalXP={totalXP} />
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      </div>
    </nav>
  );
}
```

**Step 3: Create main layout**

```tsx
// src/app/(main)/layout.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/shared/navbar";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("total_xp")
    .eq("id", user.id)
    .single();

  return (
    <div className="min-h-screen bg-background">
      <Navbar totalXP={profile?.total_xp ?? 0} />
      <main className="mx-auto max-w-7xl p-4">
        {children}
      </main>
    </div>
  );
}
```

**Step 4: Commit**

```bash
git add src/app/(main)/layout.tsx src/components/shared/
git commit -m "feat: add main layout shell with navbar and XP bar"
```

---

### Task 10: Dashboard Page

**Files:**
- Create: `src/app/(main)/dashboard/page.tsx`

**Step 1: Create dashboard page**

```tsx
// src/app/(main)/dashboard/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const COMPONENTS = [
  { number: 1, name: "Monosyllabic Characters", chinese: "读单音节字词", path: "/component-1" },
  { number: 2, name: "Multisyllabic Words", chinese: "读多音节词语", path: "/component-2" },
  { number: 3, name: "Judgment", chinese: "选择判断", path: "/component-3" },
  { number: 4, name: "Passage Reading", chinese: "朗读短文", path: "/component-4" },
  { number: 5, name: "Prompted Speaking", chinese: "命题说话", path: "/component-5" },
];

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: progress } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", user.id);

  const { data: selectedCharacter } = await supabase
    .from("user_characters")
    .select("*, characters(*)")
    .eq("user_id", user.id)
    .eq("is_selected", true)
    .single();

  const progressMap = new Map(
    (progress || []).map((p) => [p.component, p])
  );

  return (
    <div className="space-y-6">
      {/* Greeting Section */}
      <div className="flex items-center gap-6">
        <div className="h-32 w-32 rounded-lg bg-muted flex items-center justify-center text-sm text-muted-foreground">
          {/* Character image placeholder */}
          {selectedCharacter?.characters?.name || "No character"}
        </div>
        <div>
          <h1 className="text-2xl font-bold">
            Welcome back, {profile?.display_name || "Student"}!
          </h1>
          <p className="text-muted-foreground">
            Ready to practice your Putonghua today?
          </p>
        </div>
      </div>

      {/* Component Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {COMPONENTS.map((comp) => {
          const p = progressMap.get(comp.number);
          const accuracy = p && p.questions_attempted > 0
            ? Math.round((p.questions_correct / p.questions_attempted) * 100)
            : 0;

          return (
            <Card key={comp.number}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">
                  Component {comp.number}: {comp.name}
                </CardTitle>
                <p className="text-sm text-muted-foreground">{comp.chinese}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>{p?.questions_attempted || 0} attempted</span>
                    <span>{accuracy}% accuracy</span>
                  </div>
                  <Progress value={accuracy} className="h-2" />
                  <Link href={comp.path}>
                    <Button className="w-full" size="sm">
                      Practice
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4">
        <Link href="/mock-exam">
          <Button variant="outline">Mock Exam</Button>
        </Link>
        <Link href="/characters">
          <Button variant="outline">Character Gallery</Button>
        </Link>
      </div>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/app/(main)/dashboard/
git commit -m "feat: add dashboard page with component cards and progress overview"
```

---

## Phase 3: Character System UI

### Task 11: Character Display Component

**Files:**
- Create: `src/components/character/character-display.tsx`
- Create: `src/components/character/dialogue-box.tsx`

**Step 1: Create character display**

```tsx
// src/components/character/character-display.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { ExpressionName } from "@/types/character";

interface CharacterDisplayProps {
  characterName: string;
  expressionImages: Record<string, string>;
  currentExpression: ExpressionName;
  className?: string;
}

export function CharacterDisplay({
  characterName,
  expressionImages,
  currentExpression,
  className = "",
}: CharacterDisplayProps) {
  const [loaded, setLoaded] = useState(false);
  const imageUrl = expressionImages[currentExpression] || expressionImages["neutral"] || "";

  return (
    <div className={`relative flex flex-col items-center ${className}`}>
      <div className="relative h-64 w-48 overflow-hidden rounded-lg bg-muted">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={`${characterName} - ${currentExpression}`}
            fill
            className={`object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
            onLoad={() => setLoaded(true)}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            {characterName}
            <br />
            ({currentExpression})
          </div>
        )}
      </div>
      <span className="mt-2 text-sm font-medium">{characterName}</span>
    </div>
  );
}
```

**Step 2: Create dialogue box**

```tsx
// src/components/character/dialogue-box.tsx
"use client";

import { useEffect, useState } from "react";

interface DialogueBoxProps {
  text: string;
  characterName: string;
  isTyping?: boolean;
  typingSpeed?: number;
}

export function DialogueBox({
  text,
  characterName,
  isTyping = true,
  typingSpeed = 30,
}: DialogueBoxProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!isTyping) {
      setDisplayedText(text);
      setIsComplete(true);
      return;
    }

    setDisplayedText("");
    setIsComplete(false);
    let i = 0;

    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.slice(0, i + 1));
        i++;
      } else {
        setIsComplete(true);
        clearInterval(interval);
      }
    }, typingSpeed);

    return () => clearInterval(interval);
  }, [text, isTyping, typingSpeed]);

  return (
    <div className="rounded-lg border bg-card p-3 shadow-sm">
      <p className="text-xs font-bold text-muted-foreground mb-1">{characterName}</p>
      <p className="text-sm leading-relaxed">
        {displayedText}
        {!isComplete && <span className="animate-pulse">|</span>}
      </p>
    </div>
  );
}
```

**Step 3: Commit**

```bash
git add src/components/character/
git commit -m "feat: add character display and typewriter dialogue box components"
```

---

### Task 12: Character Gallery Page

**Files:**
- Create: `src/app/(main)/characters/page.tsx`

**Step 1: Create character gallery page**

```tsx
// src/app/(main)/characters/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AFFECTION_LEVELS } from "@/types/gamification";

export default async function CharacterGalleryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("total_xp")
    .eq("id", user.id)
    .single();

  const { data: allCharacters } = await supabase
    .from("characters")
    .select("*, character_expressions(*), character_skins(*)")
    .order("unlock_cost_xp", { ascending: true });

  const { data: userCharacters } = await supabase
    .from("user_characters")
    .select("*")
    .eq("user_id", user.id);

  const unlockedMap = new Map(
    (userCharacters || []).map((uc) => [uc.character_id, uc])
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Character Gallery</h1>
        <p className="text-muted-foreground">Your study companions</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {(allCharacters || []).map((char) => {
          const userChar = unlockedMap.get(char.id);
          const isUnlocked = !!userChar;
          const canUnlock = (profile?.total_xp ?? 0) >= char.unlock_cost_xp;
          const affectionLevel = userChar?.affection_level ?? 0;
          const affectionXP = userChar?.affection_xp ?? 0;
          const nextAffection = AFFECTION_LEVELS[affectionLevel + 1];
          const affectionProgress = nextAffection
            ? (affectionXP / nextAffection.xpRequired) * 100
            : 100;

          return (
            <Card
              key={char.id}
              className={!isUnlocked ? "opacity-60" : userChar?.is_selected ? "ring-2 ring-primary" : ""}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{char.name}</CardTitle>
                  {userChar?.is_selected && <Badge>Active</Badge>}
                  {!isUnlocked && <Badge variant="secondary">{char.unlock_cost_xp} XP</Badge>}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Character image placeholder */}
                  <div className="h-40 w-full rounded bg-muted flex items-center justify-center text-sm text-muted-foreground">
                    {char.name}
                  </div>

                  <p className="text-sm text-muted-foreground">{char.personality_description}</p>

                  {isUnlocked && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Affection Lv.{affectionLevel}</span>
                        <span>{AFFECTION_LEVELS[affectionLevel]?.name}</span>
                      </div>
                      <Progress value={affectionProgress} className="h-1.5" />
                    </div>
                  )}

                  <div className="flex gap-2">
                    {isUnlocked && !userChar?.is_selected && (
                      <form action={`/api/progress/select-character`} method="POST">
                        <input type="hidden" name="characterId" value={char.id} />
                        <Button size="sm" className="w-full">Select</Button>
                      </form>
                    )}
                    {!isUnlocked && canUnlock && (
                      <form action={`/api/progress/unlock-character`} method="POST">
                        <input type="hidden" name="characterId" value={char.id} />
                        <Button size="sm" className="w-full">Unlock ({char.unlock_cost_xp} XP)</Button>
                      </form>
                    )}
                    {!isUnlocked && !canUnlock && (
                      <Button size="sm" variant="secondary" className="w-full" disabled>
                        Need {char.unlock_cost_xp} XP
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/app/(main)/characters/
git commit -m "feat: add character gallery page with unlock and affection display"
```

---

## Phase 4: Component 1 — Monosyllabic Characters (End-to-End)

### Task 13: Component 1 API Routes

**Files:**
- Create: `src/app/api/speech/assess/route.ts`
- Create: `src/app/api/tts/speak/route.ts`
- Create: `src/app/api/ai/feedback/route.ts`

**Step 1: Create speech assessment route**

```typescript
// src/app/api/speech/assess/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { assessPronunciation } from "@/lib/azure-speech/client";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const audio = formData.get("audio") as File;
  const referenceText = formData.get("referenceText") as string;

  if (!audio || !referenceText) {
    return NextResponse.json({ error: "Missing audio or referenceText" }, { status: 400 });
  }

  const buffer = Buffer.from(await audio.arrayBuffer());
  const result = await assessPronunciation(buffer, referenceText);

  return NextResponse.json(result);
}
```

**Step 2: Create TTS route**

```typescript
// src/app/api/tts/speak/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { synthesizeSpeech } from "@/lib/voice/client";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { voiceId, text } = await request.json();

  if (!voiceId || !text) {
    return NextResponse.json({ error: "Missing voiceId or text" }, { status: 400 });
  }

  const audioBuffer = await synthesizeSpeech({ voiceId, text });

  return new NextResponse(audioBuffer, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
```

**Step 3: Create AI feedback route**

```typescript
// src/app/api/ai/feedback/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateFeedback } from "@/lib/gemini/client";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const feedback = await generateFeedback(body);

  return NextResponse.json({ feedback });
}
```

**Step 4: Commit**

```bash
git add src/app/api/speech/ src/app/api/tts/ src/app/api/ai/feedback/
git commit -m "feat: add API routes for speech assessment, TTS, and AI feedback"
```

---

### Task 14: Audio Recorder Component

**Files:**
- Create: `src/components/practice/audio-recorder.tsx`

**Step 1: Create audio recorder**

```tsx
// src/components/practice/audio-recorder.tsx
"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";

interface AudioRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  disabled?: boolean;
}

export function AudioRecorder({ onRecordingComplete, disabled }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        onRecordingComplete(blob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setPermissionDenied(false);
    } catch {
      setPermissionDenied(true);
    }
  }, [onRecordingComplete]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  if (permissionDenied) {
    return (
      <div className="text-center space-y-2">
        <p className="text-sm text-red-500">
          Microphone access is required for pronunciation practice.
        </p>
        <p className="text-xs text-muted-foreground">
          Please allow microphone access in your browser settings.
        </p>
        <Button size="sm" onClick={() => setPermissionDenied(false)}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={isRecording ? stopRecording : startRecording}
      disabled={disabled}
      variant={isRecording ? "destructive" : "default"}
      size="lg"
      className="min-w-[140px]"
    >
      {isRecording ? "Stop Recording" : "Start Recording"}
    </Button>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/practice/
git commit -m "feat: add audio recorder component with mic permission handling"
```

---

### Task 15: Component 1 Practice Page

**Files:**
- Create: `src/app/(main)/component-1/page.tsx`
- Create: `src/app/(main)/component-1/practice-session.tsx`

**Step 1: Create the practice session client component**

```tsx
// src/app/(main)/component-1/practice-session.tsx
"use client";

import { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CharacterDisplay } from "@/components/character/character-display";
import { DialogueBox } from "@/components/character/dialogue-box";
import { AudioRecorder } from "@/components/practice/audio-recorder";
import type { ExpressionName } from "@/types/character";
import type { QuestionResult } from "@/types/practice";

interface PracticeSessionProps {
  questions: string[];
  character: {
    name: string;
    personalityPrompt: string;
    voiceId: string;
    expressions: Record<string, string>;
  };
}

export function PracticeSession({ questions, character }: PracticeSessionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [expression, setExpression] = useState<ExpressionName>("neutral");
  const [dialogue, setDialogue] = useState("Let's practice! I'll read the character first, then you try.");
  const [isProcessing, setIsProcessing] = useState(false);
  const [streak, setStreak] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const currentQuestion = questions[currentIndex];

  const playCharacterVoice = useCallback(async (text: string) => {
    try {
      const response = await fetch("/api/tts/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voiceId: character.voiceId, text }),
      });
      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        await audio.play();
      }
    } catch {
      // TTS failed silently — user can still practice
    }
  }, [character.voiceId]);

  const handleRecordingComplete = useCallback(async (audioBlob: Blob) => {
    setIsProcessing(true);
    setExpression("listening");
    setDialogue("Let me listen...");

    try {
      // Send audio for pronunciation assessment
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");
      formData.append("referenceText", currentQuestion);

      const assessResponse = await fetch("/api/speech/assess", {
        method: "POST",
        body: formData,
      });

      const assessment = await assessResponse.json();
      const score = assessment.pronunciationScore ?? 0;
      const isGood = score >= 60;
      const isPerfect = score >= 90;

      // Get AI feedback
      const feedbackResponse = await fetch("/api/ai/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          characterPrompt: character.personalityPrompt,
          component: 1,
          questionText: currentQuestion,
          userAnswer: currentQuestion,
          pronunciationScore: score,
          isCorrect: isGood,
        }),
      });

      const { feedback } = await feedbackResponse.json();

      // Update state
      const newStreak = isGood ? streak + 1 : 0;
      setStreak(newStreak);

      if (isPerfect) setExpression("proud");
      else if (isGood) setExpression("happy");
      else setExpression("encouraging");

      setDialogue(feedback);

      const result: QuestionResult = {
        questionText: currentQuestion,
        userAnswer: null,
        isCorrect: isGood,
        pronunciationScore: score,
        feedback,
        xpEarned: isPerfect ? 10 : isGood ? 5 : 2,
      };

      setResults((prev) => [...prev, result]);
    } catch {
      setExpression("thinking");
      setDialogue("Something went wrong with the assessment. Let's try again!");
    }

    setIsProcessing(false);
  }, [currentQuestion, character.personalityPrompt, streak]);

  const handleNext = () => {
    if (currentIndex + 1 >= questions.length) {
      setIsComplete(true);
      setExpression("excited");
      setDialogue("Great work! You've finished this set!");
    } else {
      setCurrentIndex((prev) => prev + 1);
      setExpression("neutral");
      setDialogue("Next one! Listen carefully...");
    }
  };

  if (isComplete) {
    const totalScore = results.reduce((sum, r) => sum + (r.pronunciationScore ?? 0), 0);
    const avgScore = Math.round(totalScore / results.length);
    const totalXP = results.reduce((sum, r) => sum + r.xpEarned, 0);

    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="pt-6 text-center space-y-4">
            <h2 className="text-xl font-bold">Session Complete!</h2>
            <div className="flex justify-center gap-8">
              <div>
                <p className="text-3xl font-bold">{avgScore}</p>
                <p className="text-sm text-muted-foreground">Avg Score</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-green-500">+{totalXP}</p>
                <p className="text-sm text-muted-foreground">XP Earned</p>
              </div>
              <div>
                <p className="text-3xl font-bold">{results.filter((r) => r.isCorrect).length}/{results.length}</p>
                <p className="text-sm text-muted-foreground">Correct</p>
              </div>
            </div>
            <Button onClick={() => window.location.reload()}>Practice Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
      {/* Character Panel */}
      <div className="space-y-3">
        <CharacterDisplay
          characterName={character.name}
          expressionImages={character.expressions}
          currentExpression={expression}
        />
        <DialogueBox text={dialogue} characterName={character.name} />
      </div>

      {/* Practice Panel */}
      <div className="space-y-4">
        {/* Progress */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {currentIndex + 1} / {questions.length}
          </span>
          {streak > 0 && <Badge variant="secondary">Streak: {streak}</Badge>}
        </div>
        <Progress value={((currentIndex + 1) / questions.length) * 100} className="h-2" />

        {/* Current Character */}
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 space-y-6">
            <p className="text-6xl font-bold">{currentQuestion}</p>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => playCharacterVoice(currentQuestion)}
                disabled={isProcessing}
              >
                Listen
              </Button>
              <AudioRecorder
                onRecordingComplete={handleRecordingComplete}
                disabled={isProcessing}
              />
            </div>

            {results.length > currentIndex && (
              <div className="text-center space-y-2">
                <p className="text-lg">
                  Score: <span className={
                    (results[currentIndex].pronunciationScore ?? 0) >= 90 ? "text-green-500 font-bold" :
                    (results[currentIndex].pronunciationScore ?? 0) >= 60 ? "text-yellow-500 font-bold" :
                    "text-red-500 font-bold"
                  }>
                    {results[currentIndex].pronunciationScore}
                  </span>
                </p>
                <Button onClick={handleNext}>
                  {currentIndex + 1 >= questions.length ? "Finish" : "Next"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Results */}
        {results.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {results.map((r, i) => (
              <Badge
                key={i}
                variant={r.isCorrect ? "default" : "destructive"}
                className="text-xs"
              >
                {questions[i]}: {r.pronunciationScore}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

**Step 2: Create the server page**

```tsx
// src/app/(main)/component-1/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PracticeSession } from "./practice-session";

export default async function Component1Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Get selected character
  const { data: userChar } = await supabase
    .from("user_characters")
    .select("*, characters(*, character_expressions(*))")
    .eq("user_id", user.id)
    .eq("is_selected", true)
    .single();

  const character = userChar?.characters;

  // Get questions from question bank
  const { data: questions } = await supabase
    .from("question_banks")
    .select("content")
    .eq("component", 1)
    .limit(100);

  // Fallback: if no questions in DB, use a small default set
  const questionList = questions?.map((q) => q.content) ?? [
    "哲", "洽", "许", "滕", "缓", "昂", "翻", "容", "选", "闻",
  ];

  const expressionMap: Record<string, string> = {};
  if (character?.character_expressions) {
    for (const expr of character.character_expressions) {
      expressionMap[expr.expression_name] = expr.image_url;
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Component 1: Monosyllabic Characters</h1>
        <p className="text-muted-foreground">读单音节字词 — Read single-character words</p>
      </div>

      <PracticeSession
        questions={questionList}
        character={{
          name: character?.name ?? "Default",
          personalityPrompt: character?.personality_prompt ?? "You are a helpful Putonghua teacher.",
          voiceId: character?.voice_id ?? "",
          expressions: expressionMap,
        }}
      />
    </div>
  );
}
```

**Step 3: Commit**

```bash
git add src/app/(main)/component-1/
git commit -m "feat: implement Component 1 monosyllabic practice with speech assessment and character interaction"
```

---

## Phase 5: Components 2-5

### Task 16: Component 2 — Multisyllabic Words

Same pattern as Component 1 but with multi-character words. Reuses `PracticeSession` pattern.

**Files:**
- Create: `src/app/(main)/component-2/page.tsx`
- Create: `src/app/(main)/component-2/practice-session.tsx` (copy from Component 1, adjust for multi-character display)

Key differences from Component 1:
- Display words instead of single characters
- Show pinyin hints on hover in Study Mode
- Score highlights 轻声, 儿化, 变调 issues specifically

**Commit:** `feat: implement Component 2 multisyllabic word practice`

---

### Task 17: Component 3 — Vocabulary/Grammar Judgment

**Files:**
- Create: `src/app/(main)/component-3/page.tsx`
- Create: `src/app/(main)/component-3/quiz-session.tsx`

Key differences: No audio recording needed. Interactive quiz with tap-to-select. Three sub-types:
1. Word choice (select standard Putonghua expression)
2. Measure word matching (fill correct measure word)
3. Sentence order judgment (pick correct sentence)

Character reacts with expressions. Gemini explains wrong answers.

**Commit:** `feat: implement Component 3 vocabulary and grammar judgment quiz`

---

### Task 18: Component 4 — Passage Reading

**Files:**
- Create: `src/app/(main)/component-4/page.tsx`
- Create: `src/app/(main)/component-4/reading-session.tsx`

Key differences: Full passage display with pinyin toggle. Character reads passage first as model. Sentence-by-sentence scoring. Inline highlighting of problem areas.

**Commit:** `feat: implement Component 4 passage reading with inline scoring`

---

### Task 19: Component 5 — Prompted Speaking

**Files:**
- Create: `src/app/(main)/component-5/page.tsx`
- Create: `src/app/(main)/component-5/speaking-session.tsx`

Key differences: Topic selection/random assignment. 3-minute timer. Real-time transcription display. Post-session analysis: vocabulary, grammar, filler words, structure.

**Commit:** `feat: implement Component 5 prompted speaking with real-time transcription`

---

## Phase 6: Progress & Gamification API

### Task 20: Progress API Routes

**Files:**
- Create: `src/app/api/progress/update/route.ts`
- Create: `src/app/api/progress/select-character/route.ts`
- Create: `src/app/api/progress/unlock-character/route.ts`

These routes handle:
- Saving practice session results + awarding XP
- Updating user_progress per component
- Updating affection XP for selected character
- Selecting a different character
- Unlocking a new character (deducting XP)

**Commit:** `feat: add progress API routes for XP, affection, and character management`

---

## Phase 7: Mock Exam

### Task 21: Mock Exam Mode

**Files:**
- Create: `src/app/(main)/mock-exam/page.tsx`
- Create: `src/app/(main)/mock-exam/exam-runner.tsx`

Combines all 5 components sequentially with proper timing. Final score mapped to PSC grade levels:
- 一级甲等: 97+
- 一级乙等: 92-96.9
- 二级甲等: 87-91.9
- 二级乙等: 80-86.9
- 三级甲等: 70-79.9
- 三级乙等: 60-69.9

**Commit:** `feat: implement mock exam mode with PSC grade mapping`

---

## Phase 8: Polish & Deploy

### Task 22: Update Root Page

**Files:**
- Modify: `src/app/page.tsx` — redirect to `/dashboard` or show landing page

**Commit:** `feat: add root page redirect to dashboard`

---

### Task 23: Environment Setup & Deploy

**Step 1:** Set up all environment variables in Vercel dashboard
**Step 2:** Connect GitHub repo to Vercel
**Step 3:** Deploy and verify all features work in production
**Step 4:** Test with real Azure Speech, Gemini, and voice API keys

**Commit:** `chore: configure production environment and deploy`

---

## Implementation Notes

- **Image placeholders:** All character images use placeholder divs until real images are provided. The `CharacterDisplay` component handles missing images gracefully.
- **Voice ID placeholders:** Characters have `PLACEHOLDER_VOICE_ID` — replace with real Fish Audio/ElevenLabs voice IDs once created.
- **Question bank expansion:** As new markdown files are added to `src/data/` for Components 3-5, add corresponding parsers in `src/lib/question-bank/parser.ts`.
- **TTS caching:** In production, cache frequently requested TTS audio in Supabase Storage to reduce API costs.
