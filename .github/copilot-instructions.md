## Copilot / AI agent instructions — pehlivan-team

Purpose: give an AI agent the immediate, practical knowledge needed to be productive in this repo.

Keep this short and actionable. When in doubt, open the cited files.

1) Big picture (what this repo is):
	- A Next.js 14 TypeScript web app using the App Router under `src/app/` (server-first, with client components where needed).
	- Styling: Tailwind + shadcn/ui. Animations via Framer Motion.
	- Auth: `next-auth` (config in `src/lib/auth.ts`) backed by Firestore (admin operations use `src/lib/firebase-admin.ts`).
	- Data stores: Firebase (client SDK in `src/lib/firebase.ts`), server-admin Firebase (`src/lib/firebase-admin.ts`), and EdgeStore integration (`src/lib/edgestore.tsx` + API at `src/app/api/edgestore/[...edgestore]/route`).
	- Other notable integrations: Google Sheets / Google Analytics, and many Radix UI components.

2) Quick dev & CI commands (see `package.json`):
	- dev: `yarn dev` (runs `next dev`)
	- build: `yarn build` (runs `next build`)
	- start: `yarn start` (runs `next start`)
	- lint: `yarn lint` / `yarn lint:fix`
	- format: `yarn format` (Prettier)
	- tests: `yarn test`, watch: `yarn test:watch`, coverage: `yarn test:coverage` (Vitest)

3) Environment & runtime notes
	- Uses Yarn v1 (see `packageManager`). Use `yarn` for installs and scripts.
	- Important env vars referenced in code: `NEXTAUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `LINKEDIN_CLIENT_ID`, `LINKEDIN_CLIENT_SECRET`. Put them in `.env.local` for local dev.
	- Firebase client config is in `src/lib/firebase.ts`. Admin usage is in `src/lib/firebase-admin.ts` and used by server routes and `next-auth` callbacks.
	- Cookie domain behavior is present but commented-out in `src/lib/auth.ts` — be careful when modifying cookie settings for cross-subdomain auth.

4) Project conventions & patterns (concrete examples)
	- App Router conventions: pages and APIs live under `src/app/`. Example: top-level layout is `src/app/layout.tsx` where providers are wired (EdgeStore, NextAuth, ThemeProvider). See `src/app/layout.tsx` for how providers are nested and how `GoogleOneTap` and analytics scripts are injected.
	- Client code: files with `"use client"` (e.g. `src/lib/edgestore.tsx`) run in the browser; prefer putting UI interactions and hooks there.
	- Server code / API routes: use `src/app/api/*/route.ts` (or `route.tsx`) patterns. The repo contains many API subfolders (`src/app/api/*`) — follow the existing structure when adding new endpoints.
	- Auth/session shape: `next-auth` callbacks set `session.user.isAdmin`, `session.user.permissions`, and `session.user.username`. When changing auth, update `src/lib/auth.ts` and consider Firestore reads in the `jwt` callback.
	- EdgeStore: the project uses `@edgestore/react` for client usage and `@edgestore/server` for server. The provider is created in `src/lib/edgestore.tsx` and the server router is defined at `src/app/api/edgestore/[...edgestore]/route`.
	- Images: host/domains allowed are configured in `next.config.mjs` — add domains here when adding external images (see `images.domains`).

5) Tests & linting
	- Use `yarn test` (Vitest) for unit tests in `src/` and `lib/`.
	- Linting follows `next lint` + ESLint config. Format with Prettier via `yarn format`.

6) When making changes, follow these small rules
	- Keep server-only secrets and admin SDK usage in server code (API routes or `src/lib/*-admin.ts`) — do not import admin SDK into client components.
	- If you add a provider or app-level change, update `src/app/layout.tsx` so it wraps `children` consistently (see existing provider ordering: NextAuth -> EdgeStoreProviderClient -> ThemeProvider).
	- For auth changes, prefer to update `src/lib/auth.ts` and also review `src/lib/firebase-admin.ts` for Firestore admin calls used in callbacks.
	- When adding new API route folders under `src/app/api/`, export a default `route.ts` handler compatible with Next.js App Router server handlers.

7) Files to open first (best starting points)
	- `src/app/layout.tsx` — shows global providers and scripts.
	- `src/lib/firebase.ts` & `src/lib/firebase-admin.ts` — client vs admin Firebase usage.
	- `src/lib/auth.ts` — NextAuth configuration & callbacks.
	- `src/lib/edgestore.tsx` and `src/app/api/edgestore/[...edgestore]/route` — EdgeStore integration.
	- `next.config.mjs` — image domains and small Next.js experiment flags.

8) Common pitfalls seen in the repo
	- Firebase client config is hard-coded in `src/lib/firebase.ts`. Be cautious when changing it or moving it to env vars.
	- Cookie domain lines in `src/lib/auth.ts` are commented; cross-subdomain auth was attempted and may be brittle.
	- Many components expect `session.user` to contain `isAdmin`, `permissions`, and `username` — changing session shape can break UI unless both the server callback and client usage are updated.

9) When adding PR comments or code suggestions
	- Provide exact file paths and small, focused diffs/patches.
	- Suggest `yarn` commands to run locally (e.g., `yarn dev`) and include expected quick checks (open localhost:3000, sign in with Google test account, run `yarn test`).

If anything here is unclear or you want more detail (example: typical API route shape, a test example, or the list of env vars used by each API), tell me which area to expand and I'll update this file.

