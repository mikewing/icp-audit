/* =============================================================
   HOME PAGE — TPE ICP CLARITY AUDIT LANDING
   Design: Swiss Industrial Brutalism
   Rules: Black bg, white text, Space Grotesk, hard edges.
          No nav, no footer, no distractions.
          Stencil numerals on deliverables, hard-corner CTA.
   ============================================================= */

const STRIPE_URL = "https://buy.stripe.com/your-payment-link";
// After Stripe payment, Stripe redirects to /audit?session_id={CHECKOUT_SESSION_ID}
// The CTA below points to Stripe; Stripe's success URL should be set to your domain + /audit?session_id={CHECKOUT_SESSION_ID}

const deliverables = [
  {
    num: "01",
    title: "ICP Profile",
    desc: "A precise description of your best-fit client — their role, their problem, and why they pay.",
  },
  {
    num: "02",
    title: "Anti-ICP Profile",
    desc: "The clients who drain you, stall, and never convert. Named and defined so you stop chasing them.",
  },
  {
    num: "03",
    title: "Messaging Mirror",
    desc: "The exact language your ICP uses to describe their problem — ready to drop into your copy.",
  },
];

export default function Home() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#000",
        color: "#fff",
        fontFamily: "'Space Grotesk', sans-serif",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0",
      }}
    >
      <main
        style={{
          maxWidth: "760px",
          margin: "0 auto",
          padding: "clamp(3rem, 8vw, 6rem) clamp(1.5rem, 5vw, 3rem)",
          width: "100%",
        }}
      >
        {/* Logo */}
        <div
          className="animate-fade-up"
          style={{ animationDelay: "0ms", marginBottom: "clamp(2.5rem, 6vw, 4rem)" }}
        >
          <img
            src="/manus-storage/tpe-piston-lockup-white_c249a4ed.webp"
            alt="The Purpose Engine"
            style={{
              height: "clamp(28px, 4vw, 38px)",
              width: "auto",
              display: "block",
              opacity: 0.9,
            }}
          />
        </div>

        {/* Headline */}
        <div
          className="animate-fade-up"
          style={{ animationDelay: "60ms", marginBottom: "clamp(1rem, 3vw, 1.5rem)" }}
        >
          <h1
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(2.6rem, 7.5vw, 5.5rem)",
              lineHeight: 1.0,
              letterSpacing: "-0.03em",
              color: "#fff",
              margin: 0,
            }}
          >
            KNOW EXACTLY
            <br />
            WHO YOU SERVE.
          </h1>
        </div>

        {/* Sub-headline */}
        <div
          className="animate-fade-up"
          style={{ animationDelay: "120ms", marginBottom: "clamp(2.5rem, 6vw, 4rem)" }}
        >
          <p
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 400,
              fontSize: "clamp(1rem, 2.2vw, 1.2rem)",
              lineHeight: 1.55,
              color: "rgba(255,255,255,0.55)",
              margin: 0,
              maxWidth: "520px",
            }}
          >
            Answer 23 questions. Find out exactly why your messaging isn't converting — and what to say instead.
          </p>
        </div>

        {/* Horizontal rule */}
        <div
          className="animate-fade-up"
          style={{
            animationDelay: "160ms",
            borderTop: "1px solid rgba(255,255,255,0.15)",
            marginBottom: "clamp(2rem, 5vw, 3rem)",
          }}
        />

        {/* Deliverables */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "clamp(1.25rem, 3vw, 2rem)",
            marginBottom: "clamp(2.5rem, 6vw, 4rem)",
          }}
        >
          {deliverables.map((item, i) => (
            <div
              key={item.num}
              className="animate-fade-up"
              style={{
                animationDelay: `${200 + i * 70}ms`,
                display: "flex",
                alignItems: "flex-start",
                gap: "clamp(1rem, 3vw, 1.75rem)",
              }}
            >
              {/* Stencil numeral */}
              <span
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(0.65rem, 1.2vw, 0.75rem)",
                  letterSpacing: "0.12em",
                  color: "rgba(255,255,255,0.3)",
                  lineHeight: 1,
                  paddingTop: "0.35em",
                  flexShrink: 0,
                  minWidth: "2rem",
                }}
              >
                {item.num}
              </span>

              <div>
                <div
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 600,
                    fontSize: "clamp(1rem, 2.2vw, 1.15rem)",
                    letterSpacing: "-0.01em",
                    color: "#fff",
                    marginBottom: "0.3rem",
                    lineHeight: 1.2,
                  }}
                >
                  {item.title}
                </div>
                <div
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 400,
                    fontSize: "clamp(0.875rem, 1.8vw, 0.975rem)",
                    lineHeight: 1.6,
                    color: "rgba(255,255,255,0.5)",
                  }}
                >
                  {item.desc}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div
          className="animate-fade-up"
          style={{ animationDelay: "420ms" }}
        >
          <a
            href={STRIPE_URL}
            style={{
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
              transition: "background-color 120ms cubic-bezier(0.23, 1, 0.32, 1), color 120ms cubic-bezier(0.23, 1, 0.32, 1)",
              cursor: "pointer",
            }}
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
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.transform = "scale(0.97)";
            }}
            onMouseUp={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.transform = "scale(1)";
            }}
          >
            Get My ICP Profile &mdash; $197 &rarr;
          </a>
        </div>
      </main>
    </div>
  );
}
