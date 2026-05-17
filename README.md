# MathBeta Academics — Virtual Lab
### Beta & Gamma Functions | Engineering Mathematics

A production-grade interactive virtual laboratory for engineering mathematics students to explore, compute, and visualise the **Beta** and **Gamma** special functions — with step-by-step solutions, quizzes, and live graphs.

---

## Quick Start (Local Development)

### Prerequisites
| Tool | Version | Check |
|------|---------|-------|
| Node.js | ≥ 18.x | `node --version` |
| npm | ≥ 9.x | `npm --version` |
| Git | any | `git --version` |

### 1 — Clone & Install

```bash
# Clone the repository
git clone <your-repo-url> virtual-math-lab
cd virtual-math-lab

# Install dependencies
npm install
```

### 2 — Environment Setup

```bash
# Copy the example env file
cp .env.example .env.local

# Open .env.local and fill in any values if needed
# (defaults work fine for local development)
```

### 3 — Run Dev Server

```bash
npm run dev
```

The app will open automatically at **http://localhost:3000**

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start local dev server with hot reload |
| `npm run build` | Production build → `dist/` folder |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint on all source files |

---

## Project Structure

```
virtual-math-lab/
├── public/
│   └── favicon.svg              # βγ SVG favicon
├── src/
│   ├── components/
│   │   ├── LandingPage.jsx      # Hero landing page (dark purple, βγ logo)
│   │   └── VirtualLab.jsx       # Full 6-section virtual lab application
│   ├── App.jsx                  # Root component — handles page routing
│   ├── main.jsx                 # React DOM entry point
│   └── index.css                # Global CSS reset + base styles
├── .env.example                 # Template for environment variables
├── .env.local                   # Your local env values (git-ignored)
├── .gitignore                   # Files excluded from version control
├── .gitattributes               # Line ending normalisation rules
├── index.html                   # Vite HTML entry point
├── vite.config.js               # Vite bundler configuration
├── package.json                 # Dependencies and scripts
└── README.md                    # This file
```

---

## Application Sections

The virtual lab follows the standard IIT Virtual Labs structure:

| # | Section | Description |
|---|---------|-------------|
| 1 | **Aim** | Experiment objectives and scope |
| 2 | **Theory** | Tabbed content — Beta, Gamma, B-Γ Relation, Applications |
| 3 | **Pretest** | 10 MCQs to assess prior knowledge |
| 4 | **Simulator** | Interactive computation with 3 modes (see below) |
| 5 | **Posttest** | 10 harder MCQs for post-learning evaluation |
| 6 | **References** | Curated textbooks and online resources |

### Simulator Modes

- **Beta B(m,n)** — enter any positive real m, n → computes step-by-step → plots integrand f(t) = t^(m-1)(1-t)^(n-1)
- **Gamma Γ(z)** — enter any positive real z → Lanczos approximation → factorial path for integers → plots Γ(x) graph
- **B-Γ Relation** — enter m, n → verifies numerically that both integral and Gamma methods agree

---

## Key Technical Decisions

### No external math libraries
All Beta and Gamma computations use a custom 7-term **Lanczos approximation** implemented in pure JS — no mathjs or external dependencies needed. This gives double-precision accuracy for z > 0.

### Canvas-based graphs
Charts are rendered on raw `<canvas>` elements using the browser 2D API — no Chart.js or D3 required. Graphs auto-redraw when simulator inputs change.

### Single-page routing
Navigation between the Landing page and the Lab uses simple React state (`useState`) instead of React Router — keeps the bundle lean and removes the need for a server for hash routing.

### Environment variables
All runtime config is prefixed with `VITE_` (Vite convention). They are embedded at build time — do not store secrets here.

---

## Deploying to Production

### Vercel (recommended)
```bash
npm install -g vercel
vercel
# Follow prompts — Vite is auto-detected
```

### Netlify
```bash
npm run build
# Drag the dist/ folder to netlify.com/drop
# Or: netlify deploy --prod --dir=dist
```

### GitHub Pages
```bash
# In vite.config.js add: base: '/<repo-name>/'
npm run build
npx gh-pages -d dist
```

### Self-hosted / Apache / Nginx
```bash
npm run build
# Copy dist/ contents to your web root
# Ensure all routes redirect to index.html for SPA support
```

---

## Git Workflow

```bash
# Initialise (if starting fresh)
git init
git add .
git commit -m "feat: initial virtual lab — Beta & Gamma functions"

# Add remote
git remote add origin https://github.com/<username>/virtual-math-lab.git
git push -u origin main

# Feature branch workflow
git checkout -b feat/add-section
git add .
git commit -m "feat: describe your change"
git push origin feat/add-section
# Open a Pull Request on GitHub
```

### Commit message convention
```
feat:     new feature
fix:      bug fix
style:    visual/CSS changes only
refactor: code restructure, no behavior change
docs:     documentation only
chore:    tooling, config, dependencies
```

---

## Environment Variables Reference

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_APP_TITLE` | `MathBeta Academics...` | Browser tab title |
| `VITE_APP_VERSION` | `1.0.0` | App version string |
| `VITE_BASE_URL` | `http://localhost:3000` | Canonical URL for meta tags |
| `VITE_ENABLE_PRETEST` | `true` | Show/hide Pretest section |
| `VITE_ENABLE_POSTTEST` | `true` | Show/hide Posttest section |
| `VITE_GA_MEASUREMENT_ID` | _(blank)_ | Google Analytics 4 ID (optional) |

---

## Browser Support

| Browser | Minimum Version |
|---------|----------------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |

---

## Academic References

1. **Higher Engineering Mathematics** — Dr. B.S. Grewal, Khanna Publishers
2. **Advanced Engineering Mathematics** — Erwin Kreyszig, Wiley (10th Ed.)
3. **NPTEL Engineering Mathematics** — IIT faculty, nptel.ac.in
4. **NIST DLMF** — dlmf.nist.gov (Chapter 5 Gamma, Chapter 8 Beta)

---

## Contributors

| Role | Name |
|------|------|
| Lead Developer | _(your name)_ |
| Project Guide | _(faculty name)_ |
| Institution | _(college name)_ |

---

## License

This project is built for **educational purposes**. All mathematical content follows standard engineering mathematics curricula.

---

*Virtual Labs — Beta & Gamma Functions | Engineering Mathematics*
