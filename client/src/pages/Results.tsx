/* =============================================================
   RESULTS PAGE — TPE ICP CLARITY AUDIT
   Design: Swiss Industrial Brutalism — matches landing + form.
   Black bg, white text, Space Grotesk, hard edges.
   ============================================================= */

import { trpc } from "@/lib/trpc";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";

const STRIPE_UPSELL = "https://buy.stripe.com/14A8wOcgP6wU4zmbXWfrW02";
const CALENDLY_LINK = "https://calendly.com/mikejwing/the-purpose-engine-audit";
const LOGO_URL = "/tpe-logo.webp";

// ---------------------------------------------------------------------------
// Inline style tokens
// ---------------------------------------------------------------------------
const S = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#000",
    color: "#fff",
    fontFamily: "'Space Grotesk', sans-serif",
  } as React.CSSProperties,

  inner: {
    maxWidth: "760px",
    margin: "0 auto",
    padding: "clamp(3rem, 8vw, 5rem) clamp(1.5rem, 5vw, 3rem)",
  } as React.CSSProperties,

  logoImg: {
    height: "clamp(28px, 4vw, 38px)",
    width: "auto",
    display: "block",
    opacity: 0.9,
    marginBottom: "clamp(2.5rem, 6vw, 4rem)",
  } as React.CSSProperties,

  heading: {
    fontWeight: 700,
    fontSize: "clamp(1.75rem, 4.5vw, 2.8rem)",
    lineHeight: 1.1,
    letterSpacing: "-0.025em",
    color: "#fff",
    margin: "0 0 clamp(2.5rem, 6vw, 4rem) 0",
  } as React.CSSProperties,

  rule: {
    borderTop: "1px solid rgba(255,255,255,0.12)",
    margin: "clamp(2.5rem, 6vw, 4rem) 0",
  } as React.CSSProperties,

  deliverableLabel: {
    fontWeight: 700,
    fontSize: "clamp(0.65rem, 1.2vw, 0.72rem)",
    letterSpacing: "0.14em",
    textTransform: "uppercase" as const,
    color: "rgba(255,255,255,0.35)",
    marginBottom: "0.5rem",
  } as React.CSSProperties,

  deliverableTitle: {
    fontWeight: 700,
    fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)",
    letterSpacing: "-0.015em",
    color: "#fff",
    marginBottom: "clamp(1rem, 2.5vw, 1.5rem)",
  } as React.CSSProperties,

  bodyText: {
    fontWeight: 400,
    fontSize: "clamp(0.9rem, 1.8vw, 1rem)",
    lineHeight: 1.75,
    color: "rgba(255,255,255,0.75)",
    whiteSpace: "pre-wrap" as const,
  } as React.CSSProperties,

  upsellBox: {
    border: "1px solid rgba(255,255,255,0.15)",
    padding: "clamp(1.75rem, 4vw, 2.5rem)",
    marginTop: "clamp(2.5rem, 6vw, 4rem)",
  } as React.CSSProperties,

  upsellHeading: {
    fontWeight: 700,
    fontSize: "clamp(1rem, 2.2vw, 1.2rem)",
    letterSpacing: "-0.01em",
    color: "#fff",
    marginBottom: "clamp(0.75rem, 2vw, 1rem)",
  } as React.CSSProperties,

  upsellBody: {
    fontWeight: 400,
    fontSize: "clamp(0.875rem, 1.8vw, 0.975rem)",
    lineHeight: 1.7,
    color: "rgba(255,255,255,0.6)",
    marginBottom: "clamp(1.25rem, 3vw, 1.75rem)",
  } as React.CSSProperties,

  ctaBtn: {
    display: "inline-block",
    backgroundColor: "#fff",
    color: "#000",
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 600,
    fontSize: "clamp(0.875rem, 1.8vw, 1rem)",
    letterSpacing: "0.04em",
    textDecoration: "none",
    padding: "clamp(0.9rem, 2.5vw, 1.1rem) clamp(1.75rem, 4vw, 2.5rem)",
    border: "1px solid #fff",
    borderRadius: 0,
    cursor: "pointer",
    transition: "background-color 120ms cubic-bezier(0.23, 1, 0.32, 1), color 120ms cubic-bezier(0.23, 1, 0.32, 1)",
  } as React.CSSProperties,

  secondaryLink: {
    display: "block",
    marginTop: "clamp(1rem, 2.5vw, 1.25rem)",
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 400,
    fontSize: "clamp(0.8rem, 1.6vw, 0.9rem)",
    color: "rgba(255,255,255,0.45)",
    textDecoration: "underline",
    textUnderlineOffset: "3px",
    cursor: "pointer",
  } as React.CSSProperties,

  // Loading overlay
  loadingOverlay: {
    position: "fixed" as const,
    inset: 0,
    backgroundColor: "#000",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    gap: "clamp(1.5rem, 4vw, 2.5rem)",
  } as React.CSSProperties,

  loadingText: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 400,
    fontSize: "clamp(0.875rem, 1.8vw, 1rem)",
    letterSpacing: "0.06em",
    color: "rgba(255,255,255,0.5)",
    textTransform: "uppercase" as const,
  } as React.CSSProperties,

  // Error state
  errorBox: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "clamp(3rem, 8vw, 5rem) clamp(1.5rem, 5vw, 3rem)",
    fontFamily: "'Space Grotesk', sans-serif",
  } as React.CSSProperties,

  errorText: {
    fontWeight: 400,
    fontSize: "clamp(0.9rem, 1.8vw, 1rem)",
    lineHeight: 1.75,
    color: "rgba(255,255,255,0.65)",
  } as React.CSSProperties,
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function parseDeliverables(raw: string): { d1: string; d2: string; d3: string; upsell: string } {
  // Split on the three deliverable headers
  const d1Match = raw.match(/DELIVERABLE 1[\s\S]*?(?=DELIVERABLE 2|$)/i);
  const d2Match = raw.match(/DELIVERABLE 2[\s\S]*?(?=DELIVERABLE 3|$)/i);
  const d3Match = raw.match(/DELIVERABLE 3[\s\S]*?(?=WHAT THIS MEANS|---\s*\nWHAT THIS MEANS|$)/i);
  const upsellMatch = raw.match(/WHAT THIS MEANS[\s\S]*/i);

  const clean = (s: string | undefined) =>
    (s ?? "")
      .replace(/^DELIVERABLE \d+[:\s]*/i, "")
      .replace(/^YOUR (DREAM CLIENT PROFILE|ANTI-ICP PROFILE|MESSAGING MIRROR)\s*/i, "")
      .replace(/^---\s*/gm, "")
      .trim();

  return {
    d1: clean(d1Match?.[0]),
    d2: clean(d2Match?.[0]),
    d3: clean(d3Match?.[0]),
    upsell: (upsellMatch?.[0] ?? "").replace(/^---\s*/gm, "").trim(),
  };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function Results() {
  const [, navigate] = useLocation();
  const [output, setOutput] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const hasFired = useRef(false);

  const generate = trpc.audit.generate.useMutation({
    onSuccess: (data) => {
      setOutput(data.output);
      setFirstName(data.firstName);
      // Persist result so a page refresh doesn't re-fire
      sessionStorage.setItem("icp_audit_result", JSON.stringify({ output: data.output, firstName: data.firstName }));
    },
    onError: () => {
      setErrorMsg(
        "Something went wrong. Your answers have been saved. Email us at hello@thepurposeengine.co and we'll process your results manually within 24 hours."
      );
    },
  });

  useEffect(() => {
    if (hasFired.current) return;

    // Check for cached result first (page refresh case)
    const cached = sessionStorage.getItem("icp_audit_result");
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as { output: string; firstName: string };
        setOutput(parsed.output);
        setFirstName(parsed.firstName);
        hasFired.current = true;
        return;
      } catch {
        // fall through to re-generate
      }
    }

    // Load payload from sessionStorage
    const raw = sessionStorage.getItem("icp_audit_payload");
    if (!raw) {
      navigate("/");
      return;
    }

    let payload: { answers: Record<string, string>; firstName: string; email: string };
    try {
      payload = JSON.parse(raw) as { answers: Record<string, string>; firstName: string; email: string };
    } catch {
      navigate("/");
      return;
    }

    hasFired.current = true;
    generate.mutate(payload);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ---- Loading state ----
  if (!output && !errorMsg) {
    return (
      <div style={S.loadingOverlay}>
        <img src={LOGO_URL} alt="The Purpose Engine" style={{ height: "clamp(28px, 4vw, 38px)", opacity: 0.9 }} />
        <p style={S.loadingText}>Building your profile...</p>
      </div>
    );
  }

  // ---- Error state ----
  if (errorMsg) {
    return (
      <div style={{ ...S.page, display: "flex", alignItems: "center" }}>
        <div style={S.errorBox}>
          <img src={LOGO_URL} alt="The Purpose Engine" style={{ ...S.logoImg }} />
          <p style={S.errorText}>{errorMsg}</p>
        </div>
      </div>
    );
  }

  // ---- Results ----
  const { d1, d2, d3 } = parseDeliverables(output!);

  return (
    <div style={S.page}>
      <div style={S.inner}>
        {/* Logo */}
        <img src={LOGO_URL} alt="The Purpose Engine" style={S.logoImg} />

        {/* Heading */}
        <h1 style={S.heading}>
          Here's what your answers tell us, {firstName}.
        </h1>

        {/* ---- Deliverable 1 ---- */}
        <div>
          <div style={S.deliverableLabel}>Deliverable 01</div>
          <div style={S.deliverableTitle}>Your Dream Client Profile</div>
          <p style={S.bodyText}>{d1}</p>
        </div>

        <div style={S.rule} />

        {/* ---- Deliverable 2 ---- */}
        <div>
          <div style={S.deliverableLabel}>Deliverable 02</div>
          <div style={S.deliverableTitle}>Your Anti-ICP Profile</div>
          <p style={S.bodyText}>{d2}</p>
        </div>

        <div style={S.rule} />

        {/* ---- Deliverable 3 ---- */}
        <div>
          <div style={S.deliverableLabel}>Deliverable 03</div>
          <div style={S.deliverableTitle}>Your Messaging Mirror</div>
          <p style={S.bodyText}>{d3}</p>
        </div>

        {/* ---- Upsell block ---- */}
        <div style={S.upsellBox}>
          <div style={S.upsellHeading}>What This Means For You, {firstName}</div>
          <p style={S.upsellBody}>
            Your ICP is sharper than most coaches ever get. The gap between where you are and where you want to be isn't a targeting problem anymore.
          </p>
          <p style={S.upsellBody}>
            It's a system problem.
          </p>
          <p style={S.upsellBody}>
            The System Stress Test looks at your entire backend — offer architecture, revenue leak, sales process, and positioning — and tells you exactly what to fix first to start closing the clients you just described.
          </p>
          <p style={{ ...S.upsellBody, marginBottom: "clamp(1.5rem, 3.5vw, 2rem)" }}>
            This is not a sales call. It is a 60-minute working session. You leave with a plan, not a pitch.
          </p>

          <a
            href={STRIPE_UPSELL}
            style={S.ctaBtn}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.backgroundColor = "#000";
              el.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.backgroundColor = "#fff";
              el.style.color = "#000";
            }}
            onMouseDown={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.transform = "scale(0.97)";
            }}
            onMouseUp={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1)";
            }}
          >
            Book Your System Stress Test &mdash; $997 &rarr;
          </a>

          <a href={CALENDLY_LINK} style={S.secondaryLink}>
            Or book a free 15-minute Score Review first &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}
