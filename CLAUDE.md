# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PSC Study Companion — an AI-powered web app for practicing the Putonghua Proficiency Test (PSC / 普通话水平测试). Users practice all 5 PSC components with real-time pronunciation scoring, AI feedback from anime character companions, and a gamification system.

## Commands

```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Production build (Turbopack)
npm run start    # Start production server
npm run lint     # ESLint
```

No test framework is configured.

## Architecture

**Stack:** Next.js 16 (App Router, Turbopack) · React 19 · TypeScript (strict) · Supabase · Tailwind CSS 4 · shadcn/ui

### Route Structure

```
src/app/
├── page.tsx                    # Landing page (public)
├── (auth)/login/               # Email/password + Google OAuth
├── (main)/                     # Protected layout — enforces auth, renders Navbar
│   ├── dashboard/              # Progress overview, component cards
│   ├── component-{1-5}/       # Practice pages (each has its own client session component)
│   ├── characters/             # Gallery, unlock shop, affection display
│   └── mock-exam/              # Full 5-component exam simulation
└── api/
    ├── speech/assess           # Azure pronunciation scoring (POST FormData)
    ├── tts/speak               # Fish Audio TTS (POST JSON → audio/mpeg)
    ├── ai/feedback             # Gemini character-personalized feedback
    ├── ai/generate             # Gemini dynamic question generation
    ├── progress/update         # XP, level, affection, streaks, daily bonus
    ├── progress/unlock-character
    └── progress/select-character
```

### Auth Flow

Three-layer auth: **middleware** refreshes session → **(main)/layout.tsx** calls `getUser()` and redirects if unauthenticated → **pages** can safely use `user!.id` without re-checking. API routes independently verify auth.

### External Services (all in `src/lib/`)

| Service | Client | Env Vars | Purpose |
|---------|--------|----------|---------|
| Supabase | `supabase/client.ts` (browser), `supabase/server.ts` (SSR) | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | DB, auth, RLS |
| Azure Speech | `azure-speech/client.ts` | `AZURE_SPEECH_KEY`, `AZURE_SPEECH_REGION` | Pronunciation scoring (zh-CN) |
| Google Gemini | `gemini/client.ts` | `GEMINI_API_KEY` | AI feedback & question gen (gemini-2.0-flash) |
| Fish Audio | `voice/client.ts` | `VOICE_API_KEY`, `VOICE_API_BASE_URL` | TTS for character voice |

### Practice Session Pattern

Each component page (server component) fetches character data + questions from Supabase, then renders a heavy client component via `next/dynamic`:
- Components 1-2: `PracticeSession` — pronunciation drill (record → Azure assess → Gemini feedback)
- Component 3: `QuizSession` — multiple-choice quiz (word-choice, measure-word, sentence-order)
- Component 4: `ReadingSession` — passage reading with speech scoring
- Component 5: `SpeakingSession` — timed prompted speaking (3 min)
- Mock Exam: `ExamRunner` — all 5 components sequentially with PSC grade mapping

### Gamification System (`src/types/gamification.ts`, `src/lib/gamification/xp.ts`)

- **XP**: perfect=10, good=5, attempted=2, daily login=25
- **Streak multipliers**: 5+=1.5x, 10+=2.0x
- **User levels**: 10 tiers (Beginner → PSC God, 0–10000 XP)
- **Character affection**: 5 levels per character (Acquaintance → Soulmate, 0–2000 XP)
- Progress update route handles all XP/streak/level/affection calculations server-side

### Character Image System

`src/lib/character-images.ts` maps character names to local image paths (`/img/character/{name}/`). `getCharacterImageFallback()` provides local images as the `neutral` expression when Supabase has no expression images. The `CharacterDisplay` component renders expression-based images with transitions.

### Database (Supabase PostgreSQL with RLS)

9 tables defined in `src/types/database.ts`: profiles, user_progress, characters, character_expressions, character_skins, user_characters, practice_sessions, practice_details, question_banks. Migrations applied via Supabase MCP (`apply_migration`).

## Key Conventions

- Path alias: `@/*` → `./src/*`
- UI components: shadcn/ui in `src/components/ui/`, custom in `src/components/shared/` and `src/components/character/`
- Static assets: `public/img/background/` (site background), `public/img/character/{Name}/` (character images)
- Background image applied globally via `globals.css` body; content areas use `bg-background/80 backdrop-blur-sm` for readability
- All page-level Supabase queries use `Promise.all` for parallel fetching
- Loading skeletons (`loading.tsx`) exist for every route under `(main)/`
