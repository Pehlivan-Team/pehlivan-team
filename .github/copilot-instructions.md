## Copilot / AI contributor notes — Pehlivan Team

Quick, focused guidance for AI agents working on this repository. Keep edits minimal, follow project conventions, and reference the files below when in doubt.

1) Project overview (big picture)
- Next.js 14 app-router TypeScript site (source under `src/app/`). UI is built with Tailwind + shadcn-style components in `src/components/`.
- Authentication: NextAuth is used; the app wraps pages with `NextAuthProvider` in `src/app/layout.tsx` and protects `/admin` using `src/middleware.ts` (see token.isAdmin logic).
- Data/storage: Firebase (client) is initialized in `src/lib/firebase.ts`; there is also server-side admin usage in `src/lib/firebase-admin.ts`.
- Edge store: `@edgestore/react` and `@edgestore/server` are used via `src/lib/edgestore-provider.tsx` and `src/lib/edgestore.tsx`.

2) How to run & quick workflows
- Local dev: use the package manager in `package.json` (project uses Yarn v1). Common scripts are in `package.json`: `dev` -> `next dev`, `build` -> `next build`, `start` -> `next start`, `lint` -> `next lint`.
- When adding environment variables, prefer a `.env.local` for secrets. Note: some Firebase config exists in `src/lib/firebase.ts` (used client-side).

3) Important files & conventions (use these as anchors)
- Layout/providers: `src/app/layout.tsx` — global providers live here (ThemeProvider, NextAuth, EdgeStore). When adding global context, wire it through this file.
- Middleware & admin protection: `src/middleware.ts` — protects `/admin/:path*`. Admin checks rely on `token.isAdmin` — if you modify auth flows, update token shape and middleware together.
- Firebase client: `src/lib/firebase.ts` — client initialization pattern uses `getApps()` guard to avoid re-initialization in dev.
- EdgeStore provider: `src/lib/edgestore-provider.tsx` and `src/lib/edgestore.tsx` — used for server/client edge data; prefer these utilities over ad-hoc implementations.
- Component conventions: UI components follow a shadcn-like pattern under `src/components/` (look for `ui/` and `main-page-components/` namespaces).
- TypeScript path alias: `@/*` maps to `./src/*` (see `tsconfig.json`).

4) Patterns and gotchas for edits
- App router: pages live in `src/app/` (not `pages/`); mutations to routing must use app-router conventions (layout.tsx, page.tsx, segment folders).
- Server vs client components: default is server; if a component uses browser APIs or hooks, mark it with `'use client'` at the top.
- Firebase secrets: client config is in repo for the demo site; do not add other secrets to source control — use `.env.local` for private keys and server-only credentials (firebase-admin credentials belong server-side only).
- Images: external image domains are whitelisted in `next.config.mjs` — add domains there when introducing new external images.

5) Testing, linting, and quality checks
- Lint: `yarn lint` (uses Next's ESLint config). There are no repository tests visible — prefer small manual checks after UI changes.

6) Integration points to watch
- Google Analytics: `@vercel/analytics` + a local `GoogleAnalytics` component under `src/components/analytics/GoogleAnalytics.tsx`.
- Google One Tap: script injection happens in `src/app/layout.tsx` (beforeInteractive strategy). Be cautious with auth flows when modifying this.
- Google Sheets / Sheets API usage: README describes a Sheets integration; search `googleapis` or `sheets` code paths when changing related features.

7) Examples (copy/paste snippets)
- Protect admin routes (middleware matcher): `src/middleware.ts` uses `matcher: ["/admin/:path*"]` and `withAuth` callbacks that expect `token.isAdmin === true`.
- Firebase init guard (client):
  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

8) When to ask the human owner
- If you need to rotate or add server secrets (Firebase admin credentials, OAuth client secrets, Sheets service account) — stop and ask for secure provisioning steps.
- If changing authentication tokens/claims structure (e.g., `isAdmin`), confirm the shape with maintainers before wide refactors.

9) Files worth reading first
- `src/app/layout.tsx` — providers & global scripts
- `src/middleware.ts` — admin protection pattern
- `src/lib/firebase.ts`, `src/lib/firebase-admin.ts` — client vs server Firebase usage
- `next.config.mjs` — image domains and experimental flags
- `package.json` & `tsconfig.json` — scripts and aliases

If anything above is unclear or you want the instructions tailored (more examples, more safety checks), tell me which areas to expand and I will iterate.
