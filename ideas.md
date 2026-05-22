# TPE ICP Clarity Audit — Landing Page Design Ideas

## Constraints
- Black background, white text only
- No nav, no footer, no distractions
- TPE logo, one headline, three deliverable bullets, one CTA
- Brand voice: Direct. Industrial. No coaching jargon.

---

<response>
<probability>0.07</probability>
<text>

## Idea A — Swiss Industrial Brutalism

**Design Movement:** Swiss International Typographic Style meets raw industrial brutalism

**Core Principles:**
1. Stark typographic hierarchy — size and weight do all the work
2. Hard edges, zero decoration, zero radius
3. Negative space used as a structural element, not filler
4. Single-axis vertical rhythm, left-aligned text block

**Color Philosophy:** Pure black (#000000) background. Pure white (#FFFFFF) text. One accent: a thin white rule (1px) used sparingly as a structural divider. No grays, no gradients.

**Layout Paradigm:** Off-center vertical stack — content block sits left of center on desktop, creating deliberate asymmetric tension. Logo top-left, headline large and left-aligned, deliverables as a tight numbered list, CTA as a full-width white button with black text.

**Signature Elements:**
- Oversized stencil-cut numerals (01, 02, 03) preceding each deliverable
- A single horizontal rule between the headline and the list
- CTA button: full-width, hard corners, white fill, black text

**Interaction Philosophy:** No hover animations on text. CTA button inverts (white bg → black bg, black text → white text) on hover with a 120ms snap.

**Animation:** Entrance only — staggered fade-up (opacity 0→1, translateY 12px→0) at 60ms intervals. No looping motion.

**Typography System:**
- Display: Space Grotesk 700, 72–96px, tracking -2px
- Body/bullets: Space Grotesk 400, 18px, tracking 0
- CTA: Space Grotesk 600, 16px, tracking 2px uppercase

</text>
</response>

<response>
<probability>0.06</probability>
<text>

## Idea B — Redacted Document / Intelligence Dossier

**Design Movement:** Classified document aesthetic — redaction bars, monospace type, stamp marks

**Core Principles:**
1. Every element looks like it was pulled from a classified file
2. Monospace type throughout — precision, not warmth
3. Structural elements (borders, rules, stamps) carry the visual weight
4. Tension between "restricted" and "accessible"

**Color Philosophy:** Black background, white type. Thin white borders on the deliverable items. A faint grain texture on the background.

**Layout Paradigm:** Centered document card on black field. The card itself has a thin white border and internal padding. Deliverables appear as line items in a table-like structure.

**Signature Elements:**
- A "CLASSIFIED" or "TPE INTERNAL" stamp mark near the logo
- Deliverable items styled as redacted file entries with a thin left border
- CTA styled as a stamped approval button

**Interaction Philosophy:** CTA has a subtle "stamp press" scale(0.97) on click. Hover reveals a faint white glow on the card border.

**Animation:** None on load. CTA only: scale press on active.

**Typography System:**
- All type: IBM Plex Mono 400/700
- Headline: 56px, weight 700
- Bullets: 16px, weight 400
- CTA: 14px, weight 700, uppercase, letter-spacing 3px

</text>
</response>

<response>
<probability>0.05</probability>
<text>

## Idea C — Stark Modernist Poster

**Design Movement:** 1960s modernist poster design — bold type as image, nothing else

**Core Principles:**
1. The headline IS the visual — no imagery needed
2. Extreme typographic scale contrast (massive headline, small body)
3. Every element earns its place or gets cut
4. Vertical rhythm is the only grid

**Color Philosophy:** Black field. White type. The logo is the only "mark." No texture, no grain, no gradients.

**Layout Paradigm:** Full-viewport centered column, max-width 680px. Headline at display scale dominates the top third. Deliverables are tight, small, and precise below. CTA anchors the bottom.

**Signature Elements:**
- Headline breaks across two lines with a deliberate size jump on the second line
- Deliverables use a thin white dash (—) as a list marker, not bullets
- CTA is a white-outlined ghost button that fills white on hover

**Interaction Philosophy:** Ghost button fill on hover (200ms ease-out). Nothing else moves.

**Animation:** Single fade-in on page load (300ms, no stagger). Clean.

**Typography System:**
- Display: Bebas Neue 400, 80–120px, tracking 1px
- Body: DM Mono 400, 16px
- CTA: DM Mono 500, 14px, uppercase, tracking 3px

</text>
</response>
