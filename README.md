# PSC Study Companion

An AI-powered interactive web application for mastering the **Putonghua Proficiency Test (PSC / 普通话水平测试)**. Practice all five exam components with real-time pronunciation scoring, personalized AI feedback, and anime character companions that motivate your learning through a gamified XP system.

## Features

### All 5 PSC Exam Components

| Component | Name | Type |
|-----------|------|------|
| 1 | **Monosyllabic Characters** (读单音节字词) | Read 100 single characters aloud |
| 2 | **Multisyllabic Words** (读多音节词语) | Read 50 multi-syllable words aloud |
| 3 | **Vocabulary & Grammar Judgment** (选择判断) | Multiple-choice: word choice, measure words, sentence order |
| 4 | **Passage Reading** (朗读短文) | Read a literary passage aloud |
| 5 | **Prompted Speaking** (命题说话) | Speak freely on a topic for 3 minutes |

### AI-Powered Speech Scoring

- **Azure Speech Services** provides word-level pronunciation assessment with accuracy, fluency, and completeness scores
- Detailed error detection: mispronunciation, omission, and insertion errors for each word
- Supports Components 1, 2, 4, and 5

### AI Feedback with Google Gemini

- **Gemini 2.0 Flash** generates contextual, personality-driven feedback
- Dynamic question generation for unlimited practice
- Feedback adapts to the character companion you've selected

### Anime Character Companions

- Unlock and collect study companions, each with a unique personality
- 10 facial expressions (neutral, happy, proud, excited, thinking, encouraging, teasing, surprised, listening, disappointed) react in real-time to your performance
- Build affection by practicing together -- unlock skins at higher affection levels
- Each character has a distinct voice via Fish Audio / ElevenLabs TTS

### Gamification System

- **XP Rewards**: Earn XP for every question (10 XP perfect, 5 XP good, 2 XP attempted) with streak multipliers (1.5x at 5-streak, 2x at 10-streak)
- **Daily Login Bonus**: 25 XP per day
- **10 Player Levels**: Beginner (0 XP) through PSC God (10,000 XP)
- **5 Affection Levels**: Acquaintance through Soulmate per character
- Character unlocks cost XP, rewarding consistent practice

### Mock Exam Mode

Full PSC simulation running all 5 components sequentially with time limits:

| Component | Time | Weight |
|-----------|------|--------|
| Monosyllabic | 3:30 | 10% |
| Multisyllabic | 2:30 | 20% |
| Judgment | 3:00 | 10% |
| Passage Reading | 4:00 | 30% |
| Prompted Speaking | 3:00 | 30% |

Results are mapped to official PSC grades:

| Score | Grade |
|-------|-------|
| 97+ | 一级甲等 (First Class, Grade A) |
| 92-96 | 一级乙等 (First Class, Grade B) |
| 87-91 | 二级甲等 (Second Class, Grade A) |
| 80-86 | 二级乙等 (Second Class, Grade B) |
| 70-79 | 三级甲等 (Third Class, Grade A) |
| 60-69 | 三级乙等 (Third Class, Grade B) |
| <60 | 不达标 (Below Standard) |

### Authentication

- Email / password sign-up and login
- Google OAuth sign-in
- Session management via Supabase Auth with SSR cookie handling

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 16](https://nextjs.org) (App Router) + React 19 |
| Language | TypeScript |
| Database | [Supabase](https://supabase.com) (PostgreSQL) with Row Level Security |
| Auth | Supabase Auth (Email + Google OAuth) |
| AI Feedback | [Google Gemini 2.0 Flash](https://ai.google.dev) |
| Speech Assessment | [Azure Cognitive Services - Speech](https://azure.microsoft.com/en-us/products/ai-services/speech-services) |
| Text-to-Speech | [Fish Audio](https://fish.audio) / [ElevenLabs](https://elevenlabs.io) |
| UI Components | [shadcn/ui](https://ui.shadcn.com) + [Radix UI](https://www.radix-ui.com) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com) |
| Icons | [Lucide React](https://lucide.dev) |
| Notifications | [Sonner](https://sonner.emilkowal.dev) |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) 18+
- A [Supabase](https://supabase.com) project
- API keys for: Azure Speech Services, Google Gemini, Fish Audio or ElevenLabs

### 1. Clone the repository

```bash
git clone https://github.com/baduru11/PCSWebTool.git
cd PCSWebTool
npm install
```

### 2. Configure environment variables

Copy the example file and fill in your credentials:

```bash
cp .env.local.example .env.local
```

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Azure Speech (pronunciation assessment)
AZURE_SPEECH_KEY=your_azure_speech_key
AZURE_SPEECH_REGION=eastasia

# Google Gemini (AI feedback & question generation)
GEMINI_API_KEY=your_gemini_api_key

# Voice Cloning / TTS
VOICE_API_KEY=your_voice_api_key
VOICE_API_BASE_URL=https://api.fish.audio

# Site URL (for OAuth callbacks)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Set up the database

The database schema can be applied via the Supabase dashboard SQL editor or the Supabase MCP. The migration creates these tables (all with RLS enabled):

| Table | Purpose |
|-------|---------|
| `profiles` | User profiles with XP, level, and login streaks |
| `characters` | AI companion definitions |
| `character_expressions` | Facial expression images per character |
| `character_skins` | Unlockable cosmetic skins |
| `user_characters` | Per-user unlocked characters with affection tracking |
| `user_progress` | Per-component practice statistics |
| `practice_sessions` | Practice session history |
| `practice_details` | Per-question results within sessions |
| `question_bank` | Pre-loaded questions for all 5 components |

A database trigger automatically creates a `profiles` row when a new user signs up, populating `display_name` and `avatar_url` from OAuth metadata (e.g. Google account name and picture).

### 4. Enable Google OAuth (optional)

1. Go to [Google Cloud Console > Credentials](https://console.cloud.google.com/apis/credentials)
2. Create an **OAuth 2.0 Client ID** (Web application)
3. Add `https://your-project.supabase.co/auth/v1/callback` as an **Authorized redirect URI**
4. Go to your [Supabase Dashboard > Auth > Providers](https://supabase.com/dashboard/project/_/auth/providers)
5. Enable **Google** and paste your Client ID and Client Secret

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── page.tsx                            # Public landing page
│   ├── layout.tsx                          # Root layout with fonts & theme
│   ├── globals.css                         # Tailwind styles
│   ├── (auth)/
│   │   └── login/
│   │       ├── page.tsx                    # Login page
│   │       ├── login-form.tsx              # Email + Google sign-in form
│   │       └── actions.ts                  # Auth server actions
│   ├── (main)/                             # Protected routes (requires auth)
│   │   ├── layout.tsx                      # Auth guard + navbar
│   │   ├── dashboard/page.tsx              # Main hub with progress overview
│   │   ├── characters/page.tsx             # Character gallery & unlock shop
│   │   ├── component-1/                    # Monosyllabic characters practice
│   │   ├── component-2/                    # Multisyllabic words practice
│   │   ├── component-3/                    # Vocabulary & grammar quiz
│   │   ├── component-4/                    # Passage reading practice
│   │   ├── component-5/                    # Prompted speaking practice
│   │   └── mock-exam/                      # Full mock exam with PSC grading
│   └── api/
│       ├── auth/callback/route.ts          # OAuth callback handler
│       ├── speech/assess/route.ts          # Azure pronunciation assessment
│       ├── tts/speak/route.ts              # Text-to-speech synthesis
│       ├── ai/feedback/route.ts            # Gemini AI feedback generation
│       ├── ai/generate/route.ts            # Gemini question generation
│       └── progress/
│           ├── update/route.ts             # Record session & update XP/level
│           ├── select-character/route.ts   # Switch active companion
│           └── unlock-character/route.ts   # Spend XP to unlock a character
├── lib/
│   ├── supabase/
│   │   ├── client.ts                       # Browser Supabase client
│   │   ├── server.ts                       # Server Supabase client (SSR)
│   │   └── middleware.ts                   # Session refresh middleware
│   ├── gamification/xp.ts                  # XP calc, levels, streak multipliers
│   ├── azure-speech/client.ts              # Speech assessment wrapper
│   ├── gemini/client.ts                    # Gemini API wrapper
│   └── voice/client.ts                     # TTS synthesis wrapper
├── components/
│   ├── ui/                                 # shadcn/ui primitives
│   ├── shared/
│   │   ├── navbar.tsx                      # Top nav with XP display
│   │   └── xp-bar.tsx                      # XP progress indicator
│   ├── character/
│   │   ├── character-display.tsx           # Character with expression
│   │   └── dialogue-box.tsx                # Character speech bubble
│   └── practice/
│       └── audio-recorder.tsx              # WebRTC audio recording
├── types/
│   ├── database.ts                         # Supabase table types
│   ├── character.ts                        # Character & expression types
│   ├── practice.ts                         # Practice session types
│   └── gamification.ts                     # XP constants & level definitions
└── middleware.ts                            # Next.js route protection
```

## API Routes

### Speech & Audio

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/speech/assess` | Assess pronunciation via Azure Speech. Accepts FormData with audio blob and reference text. Returns per-word accuracy, fluency, completeness, and pronunciation scores. |
| POST | `/api/tts/speak` | Synthesize speech via Fish Audio / ElevenLabs. Accepts `{ voiceId, text }`. Returns MP3 audio. |

### AI

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/feedback` | Generate personalized feedback using Gemini, shaped by the active character's personality. |
| POST | `/api/ai/generate` | Generate practice questions dynamically. Accepts `{ component, count, difficulty }`. |

### Progress & Gamification

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/progress/update` | Record a practice session and update XP, level, streaks, and character affection. |
| POST | `/api/progress/select-character` | Switch the active character companion. |
| POST | `/api/progress/unlock-character` | Spend XP to unlock a new character. |

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/auth/callback` | Handles OAuth code exchange and redirects to dashboard. |

## Scripts

```bash
npm run dev       # Start development server (http://localhost:3000)
npm run build     # Create production build
npm run start     # Run production server
npm run lint      # Run ESLint
```

## Deployment

### Vercel (Recommended)

1. Push your repo to GitHub
2. Import the project on [Vercel](https://vercel.com)
3. Add all environment variables from `.env.local` to the Vercel project settings
4. Update `NEXT_PUBLIC_SITE_URL` to your production URL
5. Add your production URL to the Google OAuth authorized redirect URIs
6. Deploy

### Other Platforms

Any platform that supports Next.js 16 (Node.js runtime) will work. Make sure to:
- Set all environment variables
- Update the Supabase auth redirect URL to match your domain
- Update Google OAuth redirect URIs

## External Service Setup

### Azure Speech Services

1. Create a [Speech resource](https://portal.azure.com/#create/Microsoft.CognitiveServicesSpeechServices) in Azure Portal
2. Copy the **Key** and **Region** to your `.env.local`
3. The app uses the pronunciation assessment API for Mandarin Chinese (zh-CN)

### Google Gemini

1. Get an API key from [Google AI Studio](https://aistudio.google.com/apikey)
2. The app uses the `gemini-2.0-flash` model for feedback and question generation

### Fish Audio (TTS)

1. Create an account at [Fish Audio](https://fish.audio)
2. Create or clone voice models for your characters
3. Copy the API key and voice model IDs

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'feat: add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## License

This project is for educational purposes. All PSC exam content follows the national Putonghua Proficiency Test standards published by the Ministry of Education of China.
