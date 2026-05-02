# Quiz Funnel — Local Polish & Reference Fidelity (Design Spec)

**Status:** Approved (2026-05-02) — implementation plan in `docs/superpowers/plans/2026-05-02-quiz-funnel-local-polish.md`  
**Date:** 2026-05-02  
**Scope:** Local-first implementation quality (no deployment in this phase).  
**Primary reference:** [BetterMe-style quiz funnel](https://betterme-pilates.com/first-page-brand-palette?flow=2117) — used for rhythm, density, typography, spacing, and motion **fidelity**.

---

## 1. Goals and non-goals

### 1.1 Goals

- Deliver the **five-stage user journey** required by the challenge: collect (steps 1–3) → forced **3.5s** analysis → report → subscription paywall, with **smooth Framer Motion** transitions and **Zustand + persist** so refresh does not lose progress.
- **UI fidelity:** Match the reference funnel **as closely as practical (target: ~1:1)** for layout, step rhythm, information density, typography scale, control sizes, and motion feel — while keeping **implementation assets original** (no copying trademarked logos, proprietary illustrations, or third-party media). “1:1” here means **visual and interaction parity**, not literal asset theft.
- **Mobile-first:** All screens must be **fully usable and visually correct** on narrow viewports (primary QA width **375px**), including safe areas, tap targets, scroll behavior, charts, modals, and full-screen analyzing step.
- **Copy and language:** Primary path **English** for questionnaire, analyzing carousel, report, errors, and paywall (per agreed Block C). Remove developer-facing or “spec label” strings from the live UI (e.g. internal step numbers or “forced wait” copy).
- **Robustness:** Preserve existing guards: hydration unblock, `analysisStartedAt` anchor for step 8, remainder timing after refresh, step regression when data missing, `chartCurve` backfill for older persisted state.

### 1.2 Non-goals (this phase)

- **Deployment:** Vercel / Netlify, production URL, CI — explicitly deferred.
- **Deliverable docs for grading:** GitHub polish, “AI usage” write-up — deferred unless the user later expands scope.
- **Large state-machine refactor:** Keep **internal steps 1–9** mapped to **five user-visible phases** (agreed Block B); no mandatory `phase + subStep` rewrite unless a later plan proves necessary.

---

## 2. Locked decisions (user approval 2026-05-02)

| Block | Decision |
|-------|-----------|
| **A** | OK; **maximize ~1:1 UI parity** with the reference funnel; **mobile adaptation required**; local first, no deploy in this phase. |
| **B** | OK — keep internal 1–9, present five phases in nav/progress; document mapping in this spec (§3). |
| **C** | OK — English-first UI; remove immersion-breaking labels. |
| **D** | OK — keep persistence and step-8 timing / validation guards. |
| **E** | OK — manual QA checklist; automated tests optional in a later plan. |

---

## 3. Step mapping (product vs implementation)

| User-facing phase | User-facing index (e.g. progress) | `currentStep` (internal) | Screens |
|-------------------|-----------------------------------|---------------------------|---------|
| Basic info | 1 / 5 | 1, 2 | Gender → Goal |
| Body data | 2 / 5 | 3–6 | Age → Height → Weight → Target weight |
| Workout frequency | 3 / 5 | 7 | Frequency |
| Analyzing | 4 / 5 | 8 | Full-screen 3.5s, progress + rotating copy |
| Report + paywall | 5 / 5 | 9 | Report chart + CTA → `SubscriptionModal` |

---

## 4. Reference fidelity and mobile (expanded from Block A)

### 4.1 Reference audit workflow

- Re-walk the reference URL on **mobile viewport** (DevTools or device): note **header**, **option card** shape, **primary button** style, **spacing scale**, **question typography**, **analyzing screen** composition, **report** hierarchy, and **paywall card** structure.
- For each local screen, define **acceptance checks**: max width, padding, corner radius, shadow depth, animation duration/easing, and **minimum touch target** (recommend ≥44×44 CSS px for interactive controls).

### 4.2 Mobile-specific requirements

- **Viewport:** Layouts must not overflow horizontally at 375px; use `min-h-[100dvh]` / safe-area where already introduced; extend consistently.
- **Charts:** `StepReport` chart must remain readable (font sizes, margins, goal marker) at 375px; verify Recharts `ResponsiveContainer` min heights.
- **Modal:** Subscription modal scrollable if content exceeds viewport; focus trap optional; backdrop tap to close if reference implies it.
- **Analyzing:** Full-screen step must not show duplicate chrome; status bar / home indicator safe areas respected.

### 4.3 Asset boundary (legal / ethical)

- Recreate **look-and-feel** with original CSS, SVG, and copy. Do not hotlink or download BetterMe images as production assets. If a specific texture or illustration is required, use **generic substitutes** that preserve spacing and contrast.

---

## 5. UI / motion / copy (Block C implementation notes)

- **Typography:** Align scale and weights with reference (e.g. question title vs subtitle); keep a single coherent scale across steps.
- **Motion:** Step transitions keep `AnimatePresence` + enter/exit; tune durations/easing toward reference “snappiness” without jank on low-end mobile.
- **Analyzing:** English rotating messages; ring + linear progress **visually aligned** with reference density; no internal “Step 4” or “forced wait” strings in UI.
- **Report + paywall:** Heading, prediction line, chart container, disclaimers, and CTA order should follow reference **hierarchy**; pricing card content structure mirrors reference **layout** (numbers, period, bullets) with **placeholder** legal/pricing text if needed.

---

## 6. Data and calculations (unchanged intent)

- Continue storing canonical **metric** in Zustand (`heightCm`, `weightKg`, `targetWeightKg`) with UI toggling **metric/imperial** for display/input via existing `units` helpers.
- `buildReportData` remains source of truth for `targetDateLabel`, `weeksToGoal`, `chartCurve`, BMI — adjust only if parity review exposes incorrect edge cases.

---

## 7. Next.js 16 note

- Before implementation changes, consult **`node_modules/next/dist/docs/`** for any API or convention differences vs older Next.js (per `AGENTS.md`).

---

## 8. Open items

- None for this spec revision. Deployment and “AI usage” documentation remain **out of scope** until the user adds a phase.

---

## 9. Sign-off

- [x] User reviewed this file and approves proceeding to **implementation plan** (`writing-plans`).
