# PSC Web Tool — Design Document

**Date**: 2026-02-08
**Project**: GenAI Hackathon — Putonghua Proficiency Test Web Tool (HKUST)
**Timeline**: 2-4 weeks

---

## 1. Overview

An AI-powered web tool to help HKUST students prepare for the Putonghua Proficiency Test (PSC). Covers all 5 exam components with speech recognition, AI feedback, and a galgame-style character companion system that gamifies the learning experience.

**Key differentiator:** Anime-style 2D characters with unique personalities and AI-cloned voices that act as study companions. Users earn XP, unlock new characters, build affection levels, and earn character skins — turning PSC practice into an engaging, rewarding experience without sacrificing learning quality.

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14+ (App Router) + TypeScript + Tailwind CSS + shadcn/ui |
| Database & Auth | Supabase (Postgres + RLS + built-in auth) |
| LLM | Google Gemini Flash |
| Speech Recognition | Azure Speech Services (Mandarin phoneme-level pronunciation assessment) |
| Character Voices | Fish Audio or ElevenLabs (AI voice cloning, unique voice per character) |
| Deployment | Vercel |

---

## 3. Architecture

### Data Flow

1. User logs in via Supabase Auth
2. Selects a character companion, picks a PSC component to practice
3. Character reads out words/sentences using their cloned voice (TTS API)
4. User listens, then speaks into mic — audio sent to Azure Speech for pronunciation assessment
5. Results sent to Gemini Flash for personalized feedback with character personality
6. XP awarded based on accuracy — progress/affection tracked in Supabase
7. Unlocks (new characters, skins) triggered when thresholds are met

### API Routes (Next.js)

- `/api/speech/assess` — proxy to Azure Speech pronunciation assessment
- `/api/tts/speak` — proxy to voice cloning API for character speech
- `/api/ai/feedback` — Gemini Flash feedback generation
- `/api/ai/generate` — AI-generated practice questions
- `/api/progress` — XP, affection, unlocks read/write

---

## 4. Database Schema (Supabase Postgres)

### Users & Progress

**`profiles`** — extends Supabase auth
- `id`, `username`, `display_name`, `avatar_url`, `total_xp`, `current_level`, `created_at`

**`user_progress`** — per-component tracking
- `user_id`, `component` (1-5), `questions_attempted`, `questions_correct`, `best_streak`, `total_practice_time_seconds`, `last_practiced_at`

### Character System

**`characters`** — the character roster
- `id`, `name`, `personality_description`, `voice_id` (reference to cloned voice), `image_url`, `unlock_cost_xp` (0 for defaults), `is_default`

**`character_expressions`** — multiple expression images per character
- `id`, `character_id`, `expression_name` (e.g. "happy", "thinking", "proud", "teasing", "encouraging"), `image_url`

**`character_skins`** — costumes per character
- `id`, `character_id`, `skin_name`, `image_url`, `required_affection_level`

**`user_characters`** — tracks unlocked characters per user
- `user_id`, `character_id`, `unlocked_at`, `affection_xp`, `affection_level`, `active_skin_id`, `is_selected`

### Practice History

**`practice_sessions`** — every practice attempt
- `id`, `user_id`, `character_id`, `component`, `score`, `xp_earned`, `duration_seconds`, `created_at`

**`practice_details`** — individual question results within a session
- `session_id`, `question_text`, `user_answer`, `is_correct`, `pronunciation_score` (nullable), `feedback`

### Content

**`question_banks`** — parsed from markdown files
- `id`, `component`, `set_number`, `content`, `pinyin`, `metadata` (JSON)

---

## 5. PSC Components — Feature Design

### Component 1 — Monosyllabic Characters (读单音节字词)

- Character reads a set of 100 single characters aloud using their cloned voice
- User listens, then reads each character into mic one by one
- Azure Speech scores each: initials, finals, tone accuracy
- Results shown per-character with color coding (green/yellow/red)
- Gemini generates targeted tips for recurring errors (e.g. "your zh/z distinction needs work")

### Component 2 — Multisyllabic Words (多音节词语)

- Same flow as Component 1 but with multi-character words
- Additional scoring on: 轻声 (neutral tone), 儿化 (erhua), 变调 (tone sandhi)
- Character highlights tricky words before the user attempts them (personality-driven)

### Component 3 — Vocabulary/Grammar Judgment (选择判断)

- Interactive quiz format — tap/click to select answers
- Three sub-types: word choice (方言 vs 普通话), measure word matching, sentence order judgment
- Character reacts to answers with expressions and personality-driven commentary
- Gemini explains why the correct answer is more standard when user gets it wrong

### Component 4 — Passage Reading (朗读短文)

- Full passage displayed on screen with pinyin toggle (show/hide)
- Character reads the entire passage first as a model — user can replay segments by tapping sentences
- User reads the full passage while being recorded
- Azure Speech provides sentence-by-sentence scoring: fluency, prosody, pronunciation
- Problem areas highlighted inline on the passage text
- Gemini analyzes overall performance: pacing, unnatural pauses, tone patterns

### Component 5 — Prompted Speaking (命题说话)

- User selects or gets assigned a random topic from the 200+ topic bank
- 3-minute timer starts, user speaks freely
- Azure Speech transcribes in real-time (displayed live)
- After completion, Gemini analyzes: vocabulary range, grammar, filler word usage, structure/coherence
- Character gives coaching feedback with the "万能结构" template as guidance
- AI suggests improved phrasing for weak sections

### Practice Modes

- **Study Mode** — No timer, character explains everything, focus on learning
- **Practice Mode** — Timed like real exam, scoring enabled, XP awarded
- **Mock Exam** — Full 5-component simulated test, final score mapped to PSC grade levels

---

## 6. Character & Gamification System

### Starting State

- 2 default characters unlocked for every new user
- Additional characters locked behind XP thresholds (configurable per character)

### XP Economy

- XP per question: perfect = 10, good = 5, attempted = 2
- Streak bonuses: 5 correct = 1.5x, 10 correct = 2x
- Daily login bonus for consistency
- XP feeds into: global user level (unlocking characters) and per-character affection (unlocking skins)

### Affection System

- Affection XP accumulates only for the currently selected companion
- Affection levels 1-5, each unlocks new dialogue lines and expressions
- Max affection grants a special costume/skin

### Character Personality

- Each character has a personality prompt template fed to Gemini
- Feedback, encouragement, and reactions generated in-character
- Expression images swap to match the tone of the response

---

## 7. UI Layout

### Main Practice Screen

- **Left (30%):** Character display — 2D anime character with current expression, dialogue box underneath
- **Right (70%):** Practice content — questions, recording controls, feedback
- **Top bar:** XP bar, streak, character name, component indicator
- **Bottom bar:** Navigation between components, settings

### Dashboard

- Character greeting based on time of day and personality
- 5 component cards with progress bars and last score
- XP/level display, daily streak tracker
- Character Gallery button, quick-start buttons per component

### Character Gallery

- Grid of all characters — unlocked in full color, locked grayed with XP cost
- Character detail: personality, voice preview, affection level, skins
- Equip skin, set as active companion

---

## 8. Content Strategy

- **Core question banks**: Parsed from markdown files in `data/` directory (monosyllabic.md, multisyllabic.md, and upcoming files for Components 3-5)
- **AI-generated supplements**: Gemini generates additional practice questions on the fly for variety and personalization
- **Data layer designed to pick up new/updated markdown files** as question banks expand

---

## 9. Error Handling & Security

### Speech Recording

- Mic permission denied: clear prompt with instructions
- No speech detected: character reacts, auto-retry without penalty
- Poor network: queue audio locally, retry once, fallback gracefully

### API Cost Control

- All API calls proxied through Next.js routes — keys never exposed to client
- Per-user rate limits (e.g. 200 speech assessments/day, 50 TTS calls/day)
- Gemini requests batched where possible
- Frequently used TTS audio cached in Supabase Storage

### Auth & Data

- Supabase RLS on all tables — users access only their own data
- API routes validate Supabase JWT on every request
- No sensitive data stored client-side beyond auth token

### Offline/Degraded

- Component 3 works offline (UI logic + local data)
- Components 1, 2, 4, 5 require mic + network — clear offline state shown
- Question bank data cached on first load

---

## 10. Project Structure

```
src/
├── app/
│   ├── (auth)/login/
│   ├── (main)/
│   │   ├── dashboard/
│   │   ├── component-1/
│   │   ├── component-2/
│   │   ├── component-3/
│   │   ├── component-4/
│   │   ├── component-5/
│   │   ├── mock-exam/
│   │   └── characters/
│   └── api/
│       ├── speech/
│       ├── tts/
│       ├── ai/
│       └── progress/
├── components/
│   ├── shared/
│   ├── character/
│   └── practice/
├── lib/
│   ├── supabase/
│   ├── azure-speech/
│   ├── voice/
│   ├── gemini/
│   └── question-bank/
├── types/
└── data/
```

### Build Order

Component 1 → 2 → 3 → 4 → 5 (each builds on patterns from the previous)

---

## 11. Implementation Next Steps

1. Initialize Next.js project with TypeScript, Tailwind, shadcn/ui
2. Set up Supabase project, create database schema, configure auth
3. Build shared infrastructure: character display component, audio recorder, API wrappers
4. Implement Component 1 end-to-end (establishes the full pattern)
5. Implement Components 2-5 sequentially
6. Build dashboard, character gallery, gamification UI
7. Mock exam mode
8. Polish, test, deploy to Vercel
