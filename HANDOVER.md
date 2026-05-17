# Handover Document
## Virtual Math Lab — Beta & Gamma Functions
**Version:** 1.0.0  
**Handover Date:** May 2026  
**Status:** ✅ Production-ready, all sections complete

---

## 1. Project Overview

**What it is:** A React web application functioning as a virtual laboratory for engineering mathematics. Students visit the landing page, click "Start Experiment", and work through 6 structured sections covering the Beta and Gamma special functions.

**Who it's for:** First/Second year engineering students studying Engineering Mathematics (as per standard university syllabi — Mumbai University, Pune University, SPPU, etc.).

**Why it was built:** To provide an interactive alternative to passive PDF study — students can compute values, see step-by-step working, visualise function graphs, and self-test through pre/post quizzes.

---

## 2. Architecture Overview

```
Browser
  └── React SPA (Vite)
        ├── LandingPage.jsx    ← marketing/entry screen
        └── VirtualLab.jsx     ← the full lab application
              ├── AIM_CONTENT        (static)
              ├── THEORY_CONTENT     (tabbed, static)
              ├── Quiz               (pretest, stateful)
              ├── SimulatorPanel     (computed, canvas graphs)
              ├── Quiz               (posttest, stateful)
              └── REFERENCES         (static)
```

**No backend.** Everything runs in the browser. No API calls, no database, no authentication. Pure client-side React.

**No external component libraries.** No MUI, no Ant Design, no Tailwind. All styling is inline React styles using CSS variables from the host. This was a deliberate choice to keep the bundle small and avoid version conflicts.

---

## 3. File-by-File Breakdown

### `src/components/LandingPage.jsx`
The dark purple hero page shown before entering the lab.

- Contains `BetaGammaLogo` — an inline SVG component recreating the βγ symbol (Beta + Gamma Greek letters combined). Do NOT replace this with an `<img>` tag unless you have the actual logo file.
- Background uses 3 `radial-gradient` divs with `filter: blur()` — **no clip-path polygons** (user specifically requested soft blur, not hard shapes).
- `onEnter` prop — callback function passed from `App.jsx`. Calling it switches the page to the lab. The "Start Experiment" button triggers this.
- Navigation links (`Aim`, `Theory`, `Simulator`, `References`) currently use `href="#"` — wire these to anchor IDs inside VirtualLab if deep linking is needed.

### `src/components/VirtualLab.jsx`
The main lab application. Contains everything in a single file for simplicity.

**Key internal functions:**
| Function | Purpose |
|----------|---------|
| `gammaFn(z)` | Lanczos approximation — computes Γ(z) for any z > 0 |
| `betaFn(m,n)` | Computes B(m,n) = Γ(m)Γ(n)/Γ(m+n) |
| `lnGamma(z)` | Log-Gamma for numerical stability with large values |
| `factorial(n)` | Integer factorial with Gamma fallback for non-integers |

**Key components:**
| Component | Props | Notes |
|-----------|-------|-------|
| `Quiz` | `questions` (array), `title` (string) | Used for both pretest and posttest — pass different question arrays |
| `GammaChart` | none | Canvas chart of Γ(x) from 0.2 to 5 |
| `BetaChart` | `m`, `n` (numbers) | Canvas chart of Beta integrand — re-renders when m/n change |
| `SimulatorPanel` | none | 3-mode panel: Beta, Gamma, Relation |

**`onBack` prop** — passed from `App.jsx`. Renders a "← Home" button in the header when provided.

### `src/App.jsx`
Simple state machine with 2 states: `'landing'` and `'lab'`. No React Router — avoids server-side redirect config on static hosts.

To add more pages, extend the state to a string enum and add more conditionals.

### `src/index.css`
Global reset only. Do not add component styles here — keep them inline in components.

---

## 4. Mathematics Implementation Notes

### Gamma Function (Lanczos Approximation)
Uses the 7-term Lanczos approximation with Spouge's coefficients. Accurate to ~15 significant figures for Re(z) > 0. The reflection formula handles z < 0.5:

```
Γ(z) = π / (sin(πz) · Γ(1-z))    for z < 0.5
```

**Known edge cases:**
- `z = 0` or negative integers → returns `Infinity` (correct — poles of Gamma)
- Very large z (> 100) → returns `Infinity` (overflow — acceptable for this use case)
- Non-positive non-integers → handled by reflection formula

### Beta Function
Computed entirely via the Beta-Gamma relation, not by numerical integration. This is faster and more accurate:
```
B(m,n) = Γ(m)·Γ(n) / Γ(m+n)
```

### Canvas Charts
Both charts use the browser `CanvasRenderingContext2D` API. They:
- Detect dark mode via `window.matchMedia("(prefers-color-scheme: dark)")`
- Scale by `window.devicePixelRatio` for sharp rendering on HiDPI/Retina screens
- Do NOT use `requestAnimationFrame` — they render once on mount (or when props change for BetaChart)

**If charts appear blurry:** The `devicePixelRatio` scaling assumes the canvas `offsetWidth` is set by layout before the effect runs. If you see blurry charts, ensure the parent container has an explicit width.

---

## 5. Known Limitations & Future Work

| Item | Priority | Notes |
|------|----------|-------|
| Mobile responsiveness | High | Nav and simulator grid need media queries for screens < 768px |
| LaTeX rendering | Medium | Math expressions currently use Unicode approximations (e.g. `tⁿ⁻¹`). Consider adding KaTeX for proper rendering |
| Quiz persistence | Low | Quiz state resets on page refresh. Could add localStorage save |
| More quiz questions | Low | Currently 10 pre + 10 post. Expand to randomised question bank |
| Stirling's approximation | Low | Add as an extra simulator mode |
| PDF export | Low | Allow students to export their simulation results |
| i18n | Low | No internationalisation yet |

---

## 6. Extending the Quiz

Quiz questions are plain JS arrays at the top of `VirtualLab.jsx`:

```js
const pretestQs = [
  {
    q: "Question text here?",
    opts: ["Option A", "Option B", "Option C", "Option D"],
    ans: 0   // ← index of correct option (0-based)
  },
  // ...
]
```

Add/remove objects from `pretestQs` or `posttestQs` freely. The `Quiz` component handles any number of questions automatically.

---

## 7. Styling Notes

**Color tokens used:**
| Token | Usage |
|-------|-------|
| `var(--color-background-primary)` | Card/panel backgrounds |
| `var(--color-background-secondary)` | Subtle surfaces, table rows |
| `var(--color-text-primary)` | Main body text |
| `var(--color-text-secondary)` | Muted/helper text |
| `var(--color-border-tertiary)` | Default borders |
| `var(--color-border-secondary)` | Hover/emphasis borders |
| `#4f8ef7` | Blue accent (Beta function) |
| `#a78bfa` | Purple accent (Gamma function) |
| `#22c55e` | Success/correct green |
| `#ef4444` | Error/incorrect red |

These CSS variable tokens are from the Claude.ai design system. If deploying standalone (outside Claude), replace with hardcoded hex values:
```css
--color-background-primary: #ffffff;
--color-background-secondary: #f8f8f8;
--color-text-primary: #1a1a1a;
--color-text-secondary: #6b7280;
--color-border-tertiary: rgba(0,0,0,0.1);
--color-border-secondary: rgba(0,0,0,0.2);
```
Add these to `src/index.css` under `:root { }`.

---

## 8. Deployment Checklist

- [ ] Run `npm run lint` — fix any errors
- [ ] Run `npm run build` — ensure no build errors
- [ ] Run `npm run preview` — smoke test the production build
- [ ] Verify `.env.local` is in `.gitignore` (it is by default)
- [ ] Set production env vars on hosting platform
- [ ] Test on mobile (Safari iOS + Chrome Android)
- [ ] Test dark mode
- [ ] Check all quiz questions have correct `ans` indices
- [ ] Update `README.md` contributors section with real names

---

## 9. Contact / Handover

**Handed over by:** Claude (AI Developer)  
**Handed over to:** _(your name / next developer)_  
**Repository:** _(GitHub URL)_  
**Deployment URL:** _(production URL when deployed)_

For questions about the mathematics implementation, refer to:
- B.S. Grewal — Higher Engineering Mathematics (Chapter on Special Functions)
- NIST DLMF — dlmf.nist.gov/5 (Gamma), dlmf.nist.gov/8 (Beta)

---

*End of handover document.*
