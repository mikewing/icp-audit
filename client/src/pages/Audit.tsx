/* =============================================================
   AUDIT PAGE — TPE ICP CLARITY AUDIT FORM
   Design: Swiss Industrial Brutalism — matches landing page exactly.
   Rules: Black bg, white text, Space Grotesk, hard edges.
          No visible section headers or question numbers.
          Progress bar at top. Interstitial after Q16.
          Session_id gate on load — redirect to / if absent.
   ============================================================= */

import { useEffect, useRef, useState, useCallback } from "react";
import { useLocation } from "wouter";

// ─── Question definitions ────────────────────────────────────────────────────

type FieldType = "long" | "short" | "email";

interface Question {
  id: string;
  text: string;
  subtext: string;
  type: FieldType;
  required: boolean;
}

const QUESTIONS: Question[] = [
  {
    id: "q1",
    text: "Think about the best client you've ever worked with. What type of business or role were they in?",
    subtext: "Industry, company size, their title — whatever made them stand out.",
    type: "long",
    required: true,
  },
  {
    id: "q2",
    text: "What specific result did you get them? Numbers, outcomes, before and after.",
    subtext: '"Helped them grow" doesn\'t count. What actually changed — in revenue, time, team, or trajectory?',
    type: "long",
    required: true,
  },
  {
    id: "q3",
    text: "How did they show up to the work? Describe their attitude, responsiveness, and commitment.",
    subtext: "The behaviors that made them easy to coach. What did they do that most clients don't?",
    type: "long",
    required: true,
  },
  {
    id: "q4",
    text: "How did they originally find you — and what was happening in their life or business that week that made them reach out?",
    subtext: "Channel matters. The trigger matters more. What broke, shifted, or got loud right before they contacted you?",
    type: "long",
    required: true,
  },
  {
    id: "q5",
    text: "If every client in your roster looked like them — what changes about your day, your revenue, and your energy?",
    subtext: "Be specific. This is a gap analysis, not a vision exercise. What would stop being a problem?",
    type: "long",
    required: true,
  },
  {
    id: "q6",
    text: "How many active clients do you have right now, and what's your average monthly rate per client?",
    subtext: "Approximate numbers are fine.",
    type: "short",
    required: true,
  },
  {
    id: "q7",
    text: "What's the highest rate you're currently charging — and do you believe you're undercharging for what you deliver?",
    subtext: "Yes or no is fine to start. But if yes — what's the story you've been telling yourself about why you haven't raised it?",
    type: "long",
    required: true,
  },
  {
    id: "q8",
    text: "What's the lowest rate you've accepted in the last 12 months — and what story did you tell yourself to justify saying yes?",
    subtext: "No judgment. The reason matters more than the number. This is pricing psychology, not accounting.",
    type: "long",
    required: true,
  },
  {
    id: "q9",
    text: "Which of your current clients energize you most? What do they have in common?",
    subtext: "Look for patterns in mindset, behavior, industry, or how they use your coaching — not just who you like.",
    type: "long",
    required: true,
  },
  {
    id: "q10",
    text: "Which drain you — and what do they share? Mindset, expectations, communication style, how they treat the work.",
    subtext: "Be honest. This is the Anti-ICP in its first rough form.",
    type: "long",
    required: true,
  },
  {
    id: "q11",
    text: "Describe a client engagement that went sideways. What type of person were they?",
    subtext: "Role, mindset, how they communicated, what broke down. The more detail, the sharper your Anti-ICP profile.",
    type: "long",
    required: true,
  },
  {
    id: "q12",
    text: "What type of client do you keep attracting that you wish you weren't?",
    subtext: "Be direct. This feeds the most important part of your output.",
    type: "long",
    required: true,
  },
  {
    id: "q13",
    text: "If you could permanently remove one client profile from your pipeline, describe them in detail. What do they look like, sound like, and expect?",
    subtext: "Not a specific person — a profile. Patterns in how they show up before, during, and after the sale.",
    type: "long",
    required: true,
  },
  {
    id: "q14",
    text: "What objections do you hear most often from prospects who don't close?",
    subtext: "Price, timing, trust, skepticism — what comes up over and over? And which of those do you believe is actually true?",
    type: "long",
    required: true,
  },
  {
    id: "q15",
    text: "What is the one problem you solve better than anyone — and who feels that problem most acutely right now?",
    subtext: "Your real superpower, not your polished elevator pitch. The thing clients would pay more for if they understood it.",
    type: "long",
    required: true,
  },
  {
    id: "q16",
    text: "Write your current one-sentence pitch — exactly how you'd say it to a stranger at a networking event.",
    subtext: "Write it exactly as you say it today. Don't give us the version you wish you had.",
    type: "long",
    required: true,
  },
  // Q17–Q23 revealed after interstitial
  {
    id: "q17",
    text: "What is your dream client saying to themselves at 11pm when they can't sleep — not what they'd Google, but the actual thought running through their head?",
    subtext: "The emotion behind the problem. The sentence they'd never say out loud on a sales call but is driving every buying decision they make.",
    type: "long",
    required: true,
  },
  {
    id: "q18",
    text: "What does your dream client believe is the reason they haven't solved this problem yet — even if that belief is wrong?",
    subtext: "This is the hidden objection. The story they're telling themselves about why they're still stuck.",
    type: "long",
    required: true,
  },
  {
    id: "q19",
    text: "What have they already tried before finding you — and why did it fail them?",
    subtext: "Other coaches, courses, masterminds, hiring, DIY. What didn't work — and what did that failure cost them in money, time, or momentum?",
    type: "long",
    required: true,
  },
  {
    id: "q20",
    text: "What would it actually take — outcome, proof, guarantee, or urgency — for your dream client to say yes without hesitating?",
    subtext: "Not what you think they need to hear. What they believe they need to feel safe saying yes. There's a difference.",
    type: "long",
    required: true,
  },
  {
    id: "q21",
    text: "Where does your dream client spend time — LinkedIn groups, podcasts, events, communities, mastermind rooms?",
    subtext: "Where are they before they find you? What's the room they're in the week before they start looking for a coach?",
    type: "long",
    required: true,
  },
  {
    id: "q22",
    text: "What would make a colleague or peer say \"you need to talk to [your name]\"?",
    subtext: "The referral trigger. What specific situation, pain, or breaking point sends someone your way?",
    type: "long",
    required: true,
  },
  {
    id: "q23",
    text: "What does success look like to your dream client 90 days after starting with you — in their words?",
    subtext: "The specific outcome they'd brag about. Not your transformation language — their language.",
    type: "long",
    required: true,
  },
];

const TOTAL_FIELDS = QUESTIONS.length + 2; // +2 for first name and email

// ─── Styles ──────────────────────────────────────────────────────────────────

const S = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#000",
    color: "#fff",
    fontFamily: "'Space Grotesk', sans-serif",
  } as React.CSSProperties,

  progressTrack: {
    position: "fixed" as const,
    top: 0,
    left: 0,
    right: 0,
    height: "3px",
    backgroundColor: "#222",
    zIndex: 100,
  },

  progressBar: (pct: number) => ({
    height: "100%",
    width: `${pct}%`,
    backgroundColor: "#fff",
    transition: "width 0.3s cubic-bezier(0.23, 1, 0.32, 1)",
  }),

  inner: {
    maxWidth: "680px",
    margin: "0 auto",
    padding: "clamp(4rem, 10vw, 6rem) clamp(1.5rem, 5vw, 3rem) clamp(4rem, 10vw, 6rem)",
  } as React.CSSProperties,

  header: {
    marginBottom: "clamp(2.5rem, 6vw, 4rem)",
  } as React.CSSProperties,

  logoImg: {
    height: "clamp(26px, 3.5vw, 34px)",
    width: "auto",
    display: "block",
    opacity: 0.9,
    marginBottom: "clamp(2rem, 5vw, 3rem)",
  } as React.CSSProperties,

  pageTitle: {
    fontWeight: 700,
    fontSize: "clamp(1.5rem, 4vw, 2.2rem)",
    letterSpacing: "-0.025em",
    lineHeight: 1.1,
    color: "#fff",
    margin: 0,
  } as React.CSSProperties,

  questionBlock: {
    marginBottom: "clamp(2.5rem, 6vw, 3.5rem)",
  } as React.CSSProperties,

  questionText: {
    fontWeight: 600,
    fontSize: "clamp(1rem, 2.2vw, 1.1rem)",
    lineHeight: 1.45,
    color: "#fff",
    marginBottom: "0.4rem",
  } as React.CSSProperties,

  subtext: {
    fontStyle: "italic",
    fontWeight: 400,
    fontSize: "clamp(0.8rem, 1.6vw, 0.875rem)",
    lineHeight: 1.55,
    color: "rgba(255,255,255,0.4)",
    marginBottom: "0.85rem",
  } as React.CSSProperties,

  textarea: (hasError: boolean) => ({
    width: "100%",
    backgroundColor: "transparent",
    border: `1px solid ${hasError ? "rgba(255,80,80,0.8)" : "rgba(255,255,255,0.2)"}`,
    borderRadius: 0,
    color: "#fff",
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 400,
    fontSize: "clamp(0.9rem, 1.8vw, 1rem)",
    lineHeight: 1.6,
    padding: "0.75rem 1rem",
    resize: "vertical" as const,
    minHeight: "120px",
    outline: "none",
    transition: "border-color 150ms ease",
    boxSizing: "border-box" as const,
  }),

  input: (hasError: boolean) => ({
    width: "100%",
    backgroundColor: "transparent",
    border: `1px solid ${hasError ? "rgba(255,80,80,0.8)" : "rgba(255,255,255,0.2)"}`,
    borderRadius: 0,
    color: "#fff",
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 400,
    fontSize: "clamp(0.9rem, 1.8vw, 1rem)",
    lineHeight: 1.6,
    padding: "0.75rem 1rem",
    outline: "none",
    transition: "border-color 150ms ease",
    boxSizing: "border-box" as const,
  }),

  errorMsg: {
    color: "rgba(255,100,100,0.9)",
    fontSize: "0.8rem",
    marginTop: "0.35rem",
    fontWeight: 400,
  } as React.CSSProperties,

  rule: {
    borderTop: "1px solid rgba(255,255,255,0.12)",
    margin: "clamp(2rem, 5vw, 3rem) 0",
  } as React.CSSProperties,

  finalLabel: {
    fontWeight: 600,
    fontSize: "clamp(1rem, 2.2vw, 1.1rem)",
    color: "#fff",
    marginBottom: "0.4rem",
    display: "block",
  } as React.CSSProperties,

  submitBtn: (loading: boolean) => ({
    display: "inline-block",
    backgroundColor: loading ? "transparent" : "#fff",
    color: loading ? "#fff" : "#000",
    border: "1px solid #fff",
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 600,
    fontSize: "clamp(0.875rem, 1.8vw, 1rem)",
    letterSpacing: "0.04em",
    padding: "clamp(0.9rem, 2.5vw, 1.1rem) clamp(1.75rem, 4vw, 2.5rem)",
    borderRadius: 0,
    cursor: loading ? "default" : "pointer",
    transition: "background-color 120ms ease, color 120ms ease, transform 160ms ease",
    marginTop: "clamp(1.5rem, 4vw, 2.5rem)",
  }),

  // Interstitial overlay
  overlay: {
    position: "fixed" as const,
    inset: 0,
    backgroundColor: "#000",
    zIndex: 200,
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    padding: "clamp(2rem, 8vw, 4rem)",
  },

  overlayText: {
    fontWeight: 700,
    fontSize: "clamp(1.4rem, 4vw, 2.2rem)",
    lineHeight: 1.5,
    color: "#fff",
    textAlign: "center" as const,
    maxWidth: "520px",
    marginBottom: "clamp(2rem, 5vw, 3rem)",
    whiteSpace: "pre-line" as const,
  },

  overlayBtn: {
    backgroundColor: "#fff",
    color: "#000",
    border: "1px solid #fff",
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 600,
    fontSize: "1rem",
    letterSpacing: "0.04em",
    padding: "0.9rem 2.5rem",
    borderRadius: 0,
    cursor: "pointer",
  } as React.CSSProperties,
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function Audit() {
  const [, navigate] = useLocation();

  // Session gate
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (!params.get("session_id")) {
      navigate("/");
    }
  }, [navigate]);

  // Answers keyed by question id
  const [answers, setAnswers] = useState<Record<string, string>>(() =>
    Object.fromEntries(QUESTIONS.map((q) => [q.id, ""]))
  );
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");

  // Errors
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  // Interstitial state
  const [showInterstitial, setShowInterstitial] = useState(false);
  const [q17Unlocked, setQ17Unlocked] = useState(false);

  // Submit state
  const [submitting, setSubmitting] = useState(false);
  const [submitHover, setSubmitHover] = useState(false);

  // Refs for scrolling to errors
  const fieldRefs = useRef<Record<string, HTMLElement | null>>({});

  // Progress calculation
  const filledCount = QUESTIONS.filter((q) => answers[q.id]?.trim()).length
    + (firstName.trim() ? 1 : 0)
    + (email.trim() ? 1 : 0);
  const progress = Math.round((filledCount / TOTAL_FIELDS) * 100);

  // Detect when Q16 is filled and user leaves the field
  const handleQ16Blur = useCallback(() => {
    if (answers["q16"]?.trim() && !q17Unlocked) {
      setShowInterstitial(true);
    }
  }, [answers, q17Unlocked]);

  const handleContinueInterstitial = () => {
    setShowInterstitial(false);
    setQ17Unlocked(true);
    // Scroll to Q17
    setTimeout(() => {
      fieldRefs.current["q17"]?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const setAnswer = (id: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) setErrors((prev) => ({ ...prev, [id]: false }));
  };

  const handleSubmit = () => {
    if (submitting) return;

    const newErrors: Record<string, boolean> = {};
    let firstErrorKey: string | null = null;

    QUESTIONS.forEach((q) => {
      if (!answers[q.id]?.trim()) {
        newErrors[q.id] = true;
        if (!firstErrorKey) firstErrorKey = q.id;
      }
    });

    if (!firstName.trim()) {
      newErrors["firstName"] = true;
      if (!firstErrorKey) firstErrorKey = "firstName";
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors["email"] = true;
      if (!firstErrorKey) firstErrorKey = "email";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      if (firstErrorKey && fieldRefs.current[firstErrorKey]) {
        fieldRefs.current[firstErrorKey]?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setSubmitting(true);
    // Phase 2: AI call + results page will be wired here.
    // For now, store data and show loading state.
    const payload = { answers, firstName, email };
    sessionStorage.setItem("icp_audit_payload", JSON.stringify(payload));
    // Simulate async — Phase 2 will replace this with actual AI call.
  };

  // Visible questions: Q1–Q16 always, Q17–Q23 only after interstitial dismissed
  const visibleQuestions = QUESTIONS.filter(
    (q) => !["q17","q18","q19","q20","q21","q22","q23"].includes(q.id) || q17Unlocked
  );

  return (
    <div style={S.page}>
      {/* Progress bar */}
      <div style={S.progressTrack}>
        <div style={S.progressBar(progress)} />
      </div>

      {/* Interstitial overlay */}
      {showInterstitial && (
        <div style={S.overlay}>
          <p style={S.overlayText}>
            {"Read your answer above out loud.\nThen continue.\nDon't go back and change it."}
          </p>
          <button
            style={S.overlayBtn}
            onClick={handleContinueInterstitial}
          >
            Continue &rarr;
          </button>
        </div>
      )}

      <div style={S.inner}>
        {/* Header */}
        <div style={S.header}>
          <a href="/" style={{ display: "inline-block" }}>
            <img
              src="/manus-storage/tpe-piston-lockup-white_c249a4ed.webp"
              alt="The Purpose Engine"
              style={S.logoImg}
            />
          </a>
          <h1 style={S.pageTitle}>ICP Clarity Audit</h1>
        </div>

        {/* Questions */}
        {visibleQuestions.map((q) => {
          const hasError = !!errors[q.id];
          const isQ16 = q.id === "q16";

          return (
            <div
              key={q.id}
              style={S.questionBlock}
              ref={(el) => { fieldRefs.current[q.id] = el; }}
            >
              <div style={S.questionText}>{q.text}</div>
              <div style={S.subtext}>{q.subtext}</div>

              {q.type === "short" ? (
                <input
                  type="text"
                  value={answers[q.id]}
                  onChange={(e) => setAnswer(q.id, e.target.value)}
                  style={S.input(hasError)}
                  onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "rgba(255,255,255,0.6)"; }}
                  onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = hasError ? "rgba(255,80,80,0.8)" : "rgba(255,255,255,0.2)"; }}
                />
              ) : (
                <textarea
                  value={answers[q.id]}
                  onChange={(e) => setAnswer(q.id, e.target.value)}
                  onBlur={isQ16 ? handleQ16Blur : undefined}
                  rows={4}
                  style={S.textarea(hasError)}
                  onFocus={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = "rgba(255,255,255,0.6)"; }}
                />
              )}

              {hasError && (
                <div style={S.errorMsg}>This field is required.</div>
              )}
            </div>
          );
        })}

        {/* Final fields — only show after Q17+ unlocked */}
        {q17Unlocked && (
          <>
            <div style={S.rule} />

            {/* First name */}
            <div
              style={{ ...S.questionBlock, marginBottom: "clamp(1.5rem, 4vw, 2.5rem)" }}
              ref={(el) => { fieldRefs.current["firstName"] = el; }}
            >
              <label style={S.finalLabel}>Your first name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  if (errors["firstName"]) setErrors((p) => ({ ...p, firstName: false }));
                }}
                style={S.input(!!errors["firstName"])}
                onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "rgba(255,255,255,0.6)"; }}
                onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = errors["firstName"] ? "rgba(255,80,80,0.8)" : "rgba(255,255,255,0.2)"; }}
              />
              {errors["firstName"] && <div style={S.errorMsg}>Required.</div>}
            </div>

            {/* Email */}
            <div
              style={S.questionBlock}
              ref={(el) => { fieldRefs.current["email"] = el; }}
            >
              <label style={S.finalLabel}>Your email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors["email"]) setErrors((p) => ({ ...p, email: false }));
                }}
                style={S.input(!!errors["email"])}
                onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "rgba(255,255,255,0.6)"; }}
                onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = errors["email"] ? "rgba(255,80,80,0.8)" : "rgba(255,255,255,0.2)"; }}
              />
              {errors["email"] && <div style={S.errorMsg}>A valid email address is required.</div>}
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={submitting}
              style={S.submitBtn(submitting)}
              onMouseEnter={() => { if (!submitting) setSubmitHover(true); }}
              onMouseLeave={() => setSubmitHover(false)}
              onMouseDown={(e) => { if (!submitting) (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.97)"; }}
              onMouseUp={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
            >
              {submitting ? "Building your profile..." : "Generate My ICP Profile \u2192"}
            </button>
          </>
        )}
      </div>

      <style>{`
        textarea::placeholder, input::placeholder { color: rgba(255,255,255,0.2); }
        textarea:focus, input:focus { outline: none; }
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0px 1000px #000 inset;
          -webkit-text-fill-color: #fff;
          caret-color: #fff;
        }
      `}</style>
    </div>
  );
}
