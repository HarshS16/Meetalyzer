# VoxTrace.AI

VoxTrace.AI is a full-stack web app for running AI-assisted video meetings, capturing transcripts and recordings, and generating post-call summaries and follow-up chat. It combines live Stream Video calls with automated agent participation and a dashboard for managing agents and meetings.

## Tech Stack

- Next.js 16 (App Router) + React 19
- TypeScript
- Tailwind CSS + custom UI components (Radix UI)
- Better Auth (email/password + OAuth)
- Drizzle ORM + PostgreSQL (Neon-compatible)
- tRPC + TanStack Query
- Stream Video + Stream Chat
- Inngest background jobs
- OpenAI + Google Gemini (summaries and chat follow-ups)
- GSAP + Three.js (hero animation)

## Core Functionality

- Authentication with email/password and optional OAuth (Google, GitHub)
- Agents CRUD: create, update, delete, list, and view AI meeting agents
- Meetings CRUD: create and manage meetings tied to agents
- Live call experience powered by Stream Video
- Auto-recording + auto-transcription during calls
- Post-call summary generation from transcript (background job)
- Meeting insights view with transcript and summary data
- AI follow-up chat on completed meetings via Stream Chat

## Project Structure (High Level)

- App routes in src/app (auth, dashboard, call, API)
- Feature modules in src/modules (agents, meetings, auth, dashboard, home)
- tRPC routers in src/trpc/routers
- Inngest functions in src/inngest
- Database schema in src/db/schema.ts

## Environment Variables

Create a .env file in the project root and set at least:

```
DATABASE_URL="postgresql://..."

NEXT_PUBLIC_STREAM_API_KEY="..."
STREAM_SECRET_KEY="..."
NEXT_PUBLIC_STREAM_VIDEO_API_KEY="..."
STREAM_VIDEO_SECRET_KEY="..."

OPENAI_API_KEY="..."
GEMINI_API_KEY="..."

GITHUB_CLIENT_ID="..."
GITHUB_CLIENT_SECRET="..."
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
```

OAuth keys are optional if you only use email/password auth.

## Local Development

Install dependencies:

```bash
npm install
```

Push database schema:

```bash
npm run db:push
```

Run the app:

```bash
npm run dev
```

The app runs at http://localhost:3000.

## Useful Scripts

- npm run dev - start the Next.js dev server
- npm run db:push - push Drizzle schema to the database
- npm run db:studio - open Drizzle Studio
- npm run dev:webhook - expose localhost with ngrok (Stream webhooks)
