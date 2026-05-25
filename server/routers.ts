import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { invokeLLM } from "./_core/llm";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { insertAuditResult, upsertCoach } from "./supabase";

// ---------------------------------------------------------------------------
// System prompt — verbatim from spec
// ---------------------------------------------------------------------------
const SYSTEM_PROMPT = `You are the output engine for The Purpose Engine ICP Clarity Audit.
Your job is to generate three sharp, specific deliverables from a coaching
professional's 23 audit answers.

BRAND VOICE:
Direct. Industrial. Zero coaching jargon. No words like: transformational,
aligned, clarity, journey, empower, impact. Write like a sharp operator
talking to a serious professional. Short sentences. No filler. No flattery.
Never use em dashes.`;

function buildUserPrompt(answers: Record<string, string>, firstName: string): string {
  return `THE COACH'S ANSWERS:
Q1 (Best client — role/industry): ${answers.q1 ?? ""}
Q2 (Best result — specific outcomes): ${answers.q2 ?? ""}
Q3 (How they showed up to the work): ${answers.q3 ?? ""}
Q4 (How they found you + what triggered the reach-out): ${answers.q4 ?? ""}
Q5 (If every client looked like them — what changes): ${answers.q5 ?? ""}
Q6 (Current roster — headcount and rates): ${answers.q6 ?? ""}
Q7 (Highest rate + undercharging belief): ${answers.q7 ?? ""}
Q8 (Lowest rate accepted + the story they told themselves): ${answers.q8 ?? ""}
Q9 (Who energizes them + why): ${answers.q9 ?? ""}
Q10 (Who drains them + shared patterns): ${answers.q10 ?? ""}
Q11 (Engagement that went sideways): ${answers.q11 ?? ""}
Q12 (Client they keep attracting but don't want): ${answers.q12 ?? ""}
Q13 (Client profile to remove permanently): ${answers.q13 ?? ""}
Q14 (Common objections from prospects who don't close): ${answers.q14 ?? ""}
Q15 (Real superpower + who needs it most acutely): ${answers.q15 ?? ""}
Q16 (Current one-sentence pitch — verbatim): ${answers.q16 ?? ""}
Q17 (What dream client thinks at 11pm — the actual thought): ${answers.q17 ?? ""}
Q18 (What dream client believes is blocking them — even if wrong): ${answers.q18 ?? ""}
Q19 (What they've already tried + what it cost them): ${answers.q19 ?? ""}
Q20 (What it would take for them to say yes without hesitating): ${answers.q20 ?? ""}
Q21 (Where dream client spends time — platforms, rooms, events): ${answers.q21 ?? ""}
Q22 (The referral trigger — what sends someone their way): ${answers.q22 ?? ""}
Q23 (What success looks like at 90 days — in client's words): ${answers.q23 ?? ""}

---

Generate exactly three deliverables. Use the headers and structure below.
Do not add preamble. Do not explain what you are about to do.
Start directly with Deliverable 1.

---

DELIVERABLE 1: YOUR DREAM CLIENT PROFILE

Write a tight, specific 150-200 word profile of this coach's ideal client.
Draw from Q1, Q2, Q3, Q4, Q5, Q9, Q15, Q23.
Include:
- Who they are (role, context, where they are in their career or business)
- What triggered them to start looking for help (from Q4)
- What they're struggling with right now
- What they want that they can't fully articulate yet
- Why they're easy to work with
- What result they're capable of achieving with the right coach (from Q23)

End with one sentence: their Positioning Target. Format:
"Your dream client is: [one crisp sentence that names the specific person with the specific problem]."

---

DELIVERABLE 2: YOUR ANTI-ICP PROFILE

Write a 120-150 word profile of exactly who this coach must stop saying
yes to. Draw from Q8, Q10, Q11, Q12, Q13.
Be specific and direct. This is not a judgment of those people --
it is a targeting tool.
Include:
- Who they are (the pattern, not a specific person)
- How they show up in the sales conversation
- What happens to the engagement once it starts
- The real cost of saying yes to them (time, energy, revenue, momentum)

End with one sentence: the Anti-ICP Line. Format:
"Stop saying yes to: [one direct sentence that names the profile to avoid]."

---

DELIVERABLE 3: YOUR MESSAGING MIRROR

This is the most important deliverable. It exists because most coaches
describe what they do in language that makes sense to them -- and misses
their dream client entirely. Your job is to surface that gap and name it.

Draw from Q15, Q16, Q17, Q18, Q19, Q20, Q22.

Structure this deliverable in four parts:

PART 1 -- THE GAP (2-3 sentences)
Quote back Q16 exactly as written. Then name, directly and without
softening, why that pitch is not landing with the dream client described
in Q17. One sentence diagnosis. Do not hedge.

PART 2 -- WHAT THEY'RE ACTUALLY HEARING (2-3 sentences)
Based on Q17 and Q18, describe what the dream client is thinking and
feeling before they ever find this coach. What belief are they holding?
What story are they telling themselves about why they're still stuck?
This is the emotional reality the current pitch is failing to address.

PART 3 -- THE DIFFERENTIATION HOOK (2-3 sentences)
Draw from Q19. What has the dream client already tried, and why did it
fail them? This failure is not a warning sign -- it is the opening.
Name the specific reason the coach's approach is different from what
failed, using the coach's own language from Q15.

PART 4 -- THE MESSAGE THAT MOVES THEM (2-3 sentences)
Draw from Q20 and Q22. What belief does the dream client need to hold
before they say yes? What specific outcome, proof, or trigger from Q20
closes the gap? Write it as a message direction, not copy.

End with one sentence in the dream client's voice. Format:
"Your message should start here: [one sentence that speaks directly to what they're actually thinking at 11pm -- written in their words, not yours]."

---

After all three deliverables, add this block exactly as written:

---

WHAT THIS MEANS FOR YOU, ${firstName}

Your ICP is sharper than most coaches ever get. The gap between where
you are and where you want to be isn't a targeting problem anymore.

It's a system problem.

The System Stress Test looks at your entire backend -- offer architecture,
revenue leak, sales process, and positioning -- and tells you exactly what
to fix first to start closing the clients you just described.

[Book Your System Stress Test -- $997 ->]

This is not a sales call. It is a 60-minute working session.
You leave with a plan, not a pitch.`;
}

// ---------------------------------------------------------------------------
// Router
// ---------------------------------------------------------------------------
export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  audit: router({
    generate: publicProcedure
      .input(
        z.object({
          answers: z.record(z.string(), z.string()),
          firstName: z.string().min(1),
          email: z.string().email(),
        })
      )
      .mutation(async ({ input }) => {
        const { answers, firstName, email } = input;

        const result = await invokeLLM({
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: buildUserPrompt(answers, firstName) },
          ],
          max_tokens: 4096,
        });

        const content = result.choices[0]?.message?.content;
        const text = typeof content === "string" ? content : "";

        // Write 1: upsert coach row, get UUID
        let coachId: string | null = null;
        try {
          coachId = await upsertCoach({ email, name: firstName });
        } catch (err) {
          console.error("[Supabase] upsertCoach failed:", err);
          // Non-fatal: continue and return results even if DB write fails
        }

        // Write 2: insert audit result (rawResponses includes all form fields)
        if (coachId) {
          try {
            await insertAuditResult({
              coachId,
              psychographicProfile: text,
              rawResponses: { ...answers, _firstName: firstName, _email: email },
            });
          } catch (err) {
            console.error("[Supabase] insertAuditResult failed:", err);
            // Non-fatal: results still returned to user
          }
        }

        return { output: text, firstName, email };
      }),
  }),
});

export type AppRouter = typeof appRouter;
