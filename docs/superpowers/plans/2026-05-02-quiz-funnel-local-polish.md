# Quiz Funnel Local Polish & Reference Fidelity — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring the existing Next.js quiz funnel to **~1:1 visual/interaction parity** with the BetterMe reference funnel on **mobile-first (375px)**, **English-first live UI**, no deploy scope; preserve Zustand persistence and step-8 timing guards.

**Architecture:** Keep internal `currentStep` 1–9 and `src/app/page.tsx` orchestration unchanged except for **copy and non-breaking layout class tweaks**. Polish **presentational components** (`TopNav`, quiz steps, modal, chart) and **`globals.css` / `layout.tsx`** for typography and light-mode consistency. **Do not** remove `@ant-design/icons` (used in `TopNav`, `OptionCard`, `StepBasicInfo`, `StepWorkoutFrequency`).

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Framer Motion, Zustand persist, Recharts.

**Spec source:** `docs/superpowers/specs/2026-05-02-quiz-funnel-design.md` (user-approved).

**Testing note:** The repo has **no** Jest/Vitest/Playwright scripts in `package.json`. Verification = **`npm run lint`** + **`npm run build`** + **manual QA matrix** in Task 10. (Optional later: add Playwright — out of scope for this plan.)

---

## File map (create / modify)

| File | Responsibility |
|------|----------------|
| `docs/superpowers/specs/2026-05-02-quiz-funnel-design.md` | Update §9 sign-off checkbox to approved (optional hygiene). |
| `src/app/page.tsx` | English `stepTitleZh` equivalent strings; English error/restart copy; keep logic. |
| `src/app/layout.tsx` | Optional: force light `className` on `<html>` if dark `prefers-color-scheme` hurts parity. |
| `src/app/globals.css` | Optional: `color-scheme: light` on `html` for quiz; keep Gilroy comments. |
| `src/components/common/TopNav.tsx` | English `aria-label`s; spacing/grid tweaks vs reference. |
| `src/components/common/ProgressHeader.tsx` | Replace Chinese subtitle with English (or remove if unused). |
| `src/components/common/OptionCard.tsx` | Touch targets ≥44px, card radius/shadow/padding vs reference. |
| `src/components/common/PrimaryButton.tsx` | Height, radius, font to match reference CTA. |
| `src/components/quiz/StepBasicInfo.tsx` | Heading sizes responsive (e.g. `text-3xl sm:text-[40px]`); copy already EN. |
| `src/components/quiz/StepBodyData.tsx` | Translate goal-validation strings to English; optional responsive title. |
| `src/components/quiz/StepWorkoutFrequency.tsx` | Minor spacing if needed; copy already EN. |
| `src/components/quiz/StepAnalyzing.tsx` | English carousel + headline/subcopy; remove “Step 4 / 强制等待” UI; keep `DURATION_MS = 3500`. |
| `src/components/quiz/StepReport.tsx` | Typography, chart margins, mobile `min-h` for chart; English-only. |
| `src/components/quiz/SubscriptionModal.tsx` | English copy; USD-style pricing placeholders; `max-h` + `overflow-y-auto` on card for small viewports. |
| `src/lib/calculation.ts` | Change `getBmiCategory` return values to English (`Underweight`, `Normal`, `Overweight`, `Obese`) for consistency (not currently shown in UI but part of `ReportData`). |

---

### Task 1: Reference capture (no code)

**Files:** none (browser only)

- [ ] **Step 1:** Open `https://betterme-pilates.com/first-page-brand-palette?flow=2117` in Chrome DevTools **375×812** (or similar).
- [ ] **Step 2:** For each of: **header**, **option row**, **numeric step**, **analyzing**, **report**, **paywall bottom sheet** — note approximate **padding (px)**, **title font size**, **corner radius**, **button height**, **progress indicator style**.
- [ ] **Step 3:** Write 5–10 bullets in your working notes (or PR description) listing the **top deltas** vs current `quiz-funnel` UI.

Run: n/a  
Expected: A short written list to drive Tasks 2–9.

- [ ] **Step 4:** Commit only if you stored notes in-repo (optional). Otherwise skip commit.

---

### Task 2: Shell — light mode + font stack

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1:** In `layout.tsx`, on `<html>` add `className="light"` **or** `style={{ colorScheme: 'light' }}` if the reference is light-only and local OS uses dark preference (spec §4.2 readability).

Example (choose one approach and keep valid JSX):

```tsx
<html lang="en" className="light" suppressHydrationWarning>
```

- [ ] **Step 2:** In `globals.css`, add under `body` or `html`:

```css
html.light,
html.light body {
  color-scheme: light;
}
```

(Adjust selector to match your `layout` change.)

- [ ] **Step 3:** Run `npm run lint`  
  Expected: exit code 0.

- [ ] **Step 4:** Run `npm run build`  
  Expected: successful Next.js build.

- [ ] **Step 5:** Commit

```bash
git add src/app/layout.tsx src/app/globals.css
git commit -m "fix: force light color scheme for quiz funnel parity"
```

---

### Task 3: `page.tsx` — English chrome + fallbacks

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1:** Replace `stepTitleZh` block with English strings aligned to spec §3:

```tsx
const stepTitleEn =
  currentStep <= 2
    ? "Basic info"
    : currentStep <= 6
      ? "Body data"
      : currentStep === 7
        ? "Activity"
        : currentStep === 8
          ? "Analyzing"
          : "Your plan";
```

Pass `title={stepTitleEn}` to `TopNav` (rename variable usage from `stepTitleZh`).

- [ ] **Step 2:** Replace Chinese fallback UI (report incomplete, step anomaly) with English equivalents, e.g.:

```tsx
<p className="max-w-sm text-sm text-[rgba(23,23,23,0.72)]">
  Your report data is incomplete. Please start over to continue.
</p>
```

```tsx
<button type="button" ...>Start over</button>
```

```tsx
<p className="text-base text-[rgba(23,23,23,0.72)]">
  Something went wrong with your session. We moved you to a safe step.
</p>
```

```tsx
<button type="button" ...>Back to start</button>
```

- [ ] **Step 3:** `npm run lint` → 0 errors.

- [ ] **Step 4:** `npm run build` → success.

- [ ] **Step 5:** Commit

```bash
git add src/app/page.tsx
git commit -m "feat: English navigation titles and fallback copy on home"
```

---

### Task 4: `TopNav` + `ProgressHeader` — English a11y + reference spacing

**Files:**
- Modify: `src/components/common/TopNav.tsx`
- Modify: `src/components/common/ProgressHeader.tsx`

- [ ] **Step 1:** In `TopNav.tsx`, set `aria-label="Go back"` and `aria-label="Menu"` (English).

- [ ] **Step 2:** Tune `TopNav` grid/padding to match reference capture (e.g. reduce `mr-8` on back button if it breaks 375px layout; ensure **44×44** touch targets for icon buttons).

- [ ] **Step 3:** In `ProgressHeader.tsx`, change `健康测评` to e.g. `Health quiz` or remove the line if redundant with `TopNav`.

- [ ] **Step 4:** `npm run lint` && `npm run build`

- [ ] **Step 5:** Commit

```bash
git add src/components/common/TopNav.tsx src/components/common/ProgressHeader.tsx
git commit -m "feat: English a11y labels and nav spacing for mobile parity"
```

---

### Task 5: `StepAnalyzing` — English + remove spec/debug strings

**Files:**
- Modify: `src/components/quiz/StepAnalyzing.tsx`

- [ ] **Step 1:** Replace `messages` array with English strings, e.g.:

```tsx
const messages = [
  "Crunching your BMI...",
  "Estimating how fast you can reach your goal...",
  "Building your personalized path...",
  "Polishing your results...",
];
```

- [ ] **Step 2:** Replace visible Chinese headings/subtext with concise English (no “Step 4”, no “forced wait”), e.g. headline `Hang tight` / sub `We’re preparing your personalized report`.

- [ ] **Step 3:** Change `分析进度` label to `Progress` (or remove if redundant with ring).

- [ ] **Step 4:** `npm run lint` && `npm run build`

- [ ] **Step 5:** Commit

```bash
git add src/components/quiz/StepAnalyzing.tsx
git commit -m "feat: English analyzing screen and remove debug-style copy"
```

---

### Task 6: `StepBodyData` — English goal validation

**Files:**
- Modify: `src/components/quiz/StepBodyData.tsx`

- [ ] **Step 1:** Replace the three Chinese `return` strings in `currentError` (goal vs target weight) with English, e.g.:

```tsx
return "For weight loss, your target weight should be below your current weight.";
```

```tsx
return "For muscle gain, your target weight should be above your current weight.";
```

```tsx
return "For toning, set your target at least ~0.5 kg different from your current weight.";
```

- [ ] **Step 2:** Optional: add responsive heading classes to match reference on small screens (e.g. `text-3xl sm:text-[40px]` on titles if duplicated per mode).

- [ ] **Step 3:** `npm run lint` && `npm run build`

- [ ] **Step 4:** Commit

```bash
git add src/components/quiz/StepBodyData.tsx
git commit -m "feat: English validation copy for goal vs target weight"
```

---

### Task 7: `SubscriptionModal` — English + scroll + pricing layout

**Files:**
- Modify: `src/components/quiz/SubscriptionModal.tsx`

- [ ] **Step 1:** Translate all Chinese strings to English (headline, body, plan labels, buttons).

- [ ] **Step 2:** Use **USD-style placeholder** pricing to match Western funnel references, e.g. `$19.99/mo` and `$12.50/mo billed annually` (exact numbers per your reference notes).

- [ ] **Step 3:** On the inner card `motion.div`, add vertical scroll for short viewports:

```tsx
className="w-full max-h-[min(90dvh,720px)] overflow-y-auto max-w-md rounded-3xl bg-white p-6"
```

- [ ] **Step 4:** `npm run lint` && `npm run build`

- [ ] **Step 5:** Commit

```bash
git add src/components/quiz/SubscriptionModal.tsx
git commit -m "feat: English subscription sheet with scroll and USD placeholders"
```

---

### Task 8: `OptionCard` + `PrimaryButton` + `StepBasicInfo` — 1:1 spacing / touch

**Files:**
- Modify: `src/components/common/OptionCard.tsx`
- Modify: `src/components/common/PrimaryButton.tsx`
- Modify: `src/components/quiz/StepBasicInfo.tsx`

- [ ] **Step 1:** Ensure `OptionCard` minimum height ≥ **48px** (or 56px per reference), padding `px-4 py-4` or per capture; selected state border/shadow like reference.

- [ ] **Step 2:** Align `PrimaryButton` min-height to **52–56px**, full width on mobile where reference uses full-width CTA.

- [ ] **Step 3:** `StepBasicInfo` title: use responsive font sizes so 375px does not wrap awkwardly (e.g. `text-[1.625rem] leading-tight sm:text-[40px]`).

- [ ] **Step 4:** `npm run lint` && `npm run build`

- [ ] **Step 5:** Commit

```bash
git add src/components/common/OptionCard.tsx src/components/common/PrimaryButton.tsx src/components/quiz/StepBasicInfo.tsx
git commit -m "feat: option cards and CTAs tuned for mobile reference parity"
```

---

### Task 9: `StepReport` — mobile chart + hierarchy

**Files:**
- Modify: `src/components/quiz/StepReport.tsx`

- [ ] **Step 1:** At 375px, verify `ResponsiveContainer` `minHeight` (260–280) still shows axis labels; adjust `margin` on `AreaChart` if labels clip.

- [ ] **Step 2:** Tune heading/subheading `className` spacing to match reference hierarchy (padding `px-5`, section gaps).

- [ ] **Step 3:** `npm run lint` && `npm run build`

- [ ] **Step 4:** Commit

```bash
git add src/components/quiz/StepReport.tsx
git commit -m "feat: report page chart and typography for narrow viewports"
```

---

### Task 10: `calculation.ts` — English BMI categories

**Files:**
- Modify: `src/lib/calculation.ts`

- [ ] **Step 1:** Replace Chinese BMI labels with English:

```ts
function getBmiCategory(bmi: number): string {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 24) return "Normal";
  if (bmi < 28) return "Overweight";
  return "Obese";
}
```

- [ ] **Step 2:** `npm run lint` && `npm run build`

- [ ] **Step 3:** Commit

```bash
git add src/lib/calculation.ts
git commit -m "refactor: English BMI category strings for report data"
```

---

### Task 11: Manual QA (required)

**Files:** none

- [ ] **Step 1:** `npm run dev`, open `http://localhost:3000`.

- [ ] **Step 2:** Complete full funnel at **375px**: gender → goal → age → height (toggle **metric/imperial**) → weight → target → frequency → **wait full analyze** → report → open paywall → dismiss.

- [ ] **Step 3:** On step 8, **refresh mid-wait**; confirm timer completes and lands on report (spec §1.1 robustness).

- [ ] **Step 4:** On step 5, **refresh**; confirm body data persists.

- [ ] **Step 5:** Trigger goal/target mismatch errors on target-weight step; confirm **English** errors.

- [ ] **Step 6:** Document pass/fail in PR description or reply to user.

No commit required.

---

## Plan self-review (spec coverage)

| Spec section | Tasks covering it |
|--------------|-------------------|
| §1.1 five-stage journey + 3.5s + Framer + persist | Logic preserved in Tasks 3, 5; motion untouched unless Task 8–9 tweak classes only. |
| §1.1 ~1:1 UI + mobile 375px | Tasks 1, 2, 4, 8, 9, 11 |
| §1.1 English, no debug strings | Tasks 3, 5, 6, 7, 10 |
| §1.1 robustness | No removal of `analysisStartedAt` / guards in Task 3 — **only** copy edits in those branches. |
| §4.3 assets | Plan never adds hotlinked BetterMe assets. |
| §7 Next.js 16 | Task 2–10 each run `npm run build` to catch framework issues. |

**Placeholder scan:** None intentionally used.  
**Type consistency:** `stepTitleEn` is a string; `ReportData.bmiCategory` remains `string` with English values.

---

## Execution handoff

**Plan complete and saved to `docs/superpowers/plans/2026-05-02-quiz-funnel-local-polish.md`. Two execution options:**

**1. Subagent-Driven (recommended)** — Dispatch a fresh subagent per task, review between tasks, fast iteration.

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints.

**Which approach do you want?**

---

## Brainstorming checklist completion

After plan approval: mark brainstorming complete; implementation follows the chosen execution skill (not `brainstorming`).
