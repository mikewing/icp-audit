# TPE ICP Clarity Audit — TODO

## Phase 1: Landing Page
- [x] Black background, Space Grotesk, Swiss Industrial design
- [x] TPE piston lockup logo top-left
- [x] Headline: "Know exactly / who you serve."
- [x] Sub-headline: "Answer 23 questions. Find out exactly why your messaging isn't converting — and what to say instead."
- [x] Three deliverable blocks (01 ICP Profile, 02 Anti-ICP Profile, 03 Messaging Mirror)
- [x] CTA button: "Get My ICP Profile — $197 →" (placeholder Stripe URL)
- [x] No nav, no footer, no distractions

## Phase 1: Audit Form (/audit)
- [x] Session gate: redirect to / if no ?session_id= in URL
- [x] 23 questions with exact copy and subtext
- [x] Progress bar (fixed top, fills as fields complete)
- [x] Q16 interstitial overlay
- [x] First name + email final fields
- [x] Validation with scroll-to-first-error
- [x] Submit saves payload to sessionStorage and navigates to /results

## Phase 2: AI Generation + Results Page (/results)
- [x] Upgrade to full-stack (tRPC + DB + server)
- [x] Server-side tRPC mutation: audit.generate
- [x] System prompt wired verbatim from spec
- [x] All 23 answers interpolated into user prompt
- [x] LLM call via built-in Forge proxy (server-side, no key exposure)
- [x] /results page: loading state (full-screen black, "Building your profile...")
- [x] /results page: three deliverable blocks with bold headers
- [x] /results page: first name in heading
- [x] /results page: upsell block with exact copy
- [x] /results page: "Book Your System Stress Test — $997 →" button (Stripe link)
- [x] /results page: secondary "Or book a free 15-minute Score Review first →" (Calendly link)
- [x] /results page: error state with support email
- [x] /results page: cached result in sessionStorage (prevents re-fire on refresh)
- [x] Vitest tests: audit.generate (success, invalid email, empty firstName)

## Phase 3: Email Delivery (not started)
- [ ] Trigger email with all three deliverables after successful AI generation
- [ ] Email to user's submitted address
- [ ] Email notification to TPE owner on new submission

## Pending
- [ ] Replace placeholder Stripe Payment Link URL in Home.tsx (line 9)
- [ ] Set Stripe success URL to: https://yourdomain.com/audit?session_id={CHECKOUT_SESSION_ID}

## Phase 3: Supabase Writes
- [x] Install @supabase/supabase-js
- [x] Store SUPABASE_URL and SUPABASE_ANON_KEY as server secrets
- [x] Create server/supabase.ts client helper
- [x] Write 1: upsert coach row (email, name, source="icp_audit", joined_at) → get coach UUID
- [x] Write 2: insert icp_audit_results row (coach_id, psychographic_profile, raw_responses, submitted_at)
- [x] Both writes happen server-side after AI generation succeeds
- [x] Vitest test for Supabase write logic

## Phase 4: Railway Migration
- [ ] Install @anthropic-ai/sdk, remove invokeLLM usage in server/routers.ts
- [ ] Add ANTHROPIC_API_KEY env var
- [ ] Remove Manus OAuth from server/_core (oauth, session cookie, protectedProcedure)
- [ ] Remove auth hooks/redirects from client pages (Audit.tsx, Results.tsx, App.tsx)
- [ ] Remove Drizzle/MySQL packages (drizzle-orm, drizzle-kit, mysql2)
- [ ] Delete drizzle/schema.ts, drizzle.config.ts, server/db.ts
- [ ] Remove DATABASE_URL from all env references
- [ ] Remove Manus-specific env vars from server/_core/env.ts and vite.config.ts
- [ ] Create .env.example with ANTHROPIC_API_KEY, SUPABASE_URL, SUPABASE_ANON_KEY
- [ ] Verify package.json build and start scripts work for Railway
- [ ] Run pnpm test — all tests pass
- [ ] TypeScript check passes (pnpm check)
- [ ] Push to GitHub
