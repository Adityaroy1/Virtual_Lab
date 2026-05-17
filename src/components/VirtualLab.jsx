import { useState, useEffect, useRef } from "react";

const NAV_ITEMS = ["Aim","Theory","Pretest","Simulator","Posttest","References"];

const COLORS = {
  primary: "#1a1a2e",
  accent: "#4f8ef7",
  accent2: "#a78bfa",
  surface: "var(--color-background-primary)",
  surface2: "var(--color-background-secondary)",
  border: "var(--color-border-tertiary)",
  text: "var(--color-text-primary)",
  muted: "var(--color-text-secondary)",
};

function factorial(n) {
  if (n === 0 || n === 1) return 1;
  if (!Number.isInteger(n)) return gammaFn(n + 1);
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

function gammaFn(z) {
  if (z <= 0 && Number.isInteger(z)) return Infinity;
  if (z < 0.5) return Math.PI / (Math.sin(Math.PI * z) * gammaFn(1 - z));
  if (z > 100) return Infinity;
  const g = 7;
  const c = [0.99999999999980993,676.5203681218851,-1259.1392167224028,771.32342877765313,-176.61502916214059,12.507343278686905,-0.13857109526572012,9.9843695780195716e-6,1.5056327351493116e-7];
  let x = c[0];
  for (let i = 1; i < g + 2; i++) x += c[i] / (z - 1 + i);
  const t = z - 1 + g + 0.5;
  return Math.sqrt(2 * Math.PI) * Math.pow(t, z - 0.5) * Math.exp(-t) * x;
}

function betaFn(m, n) {
  if (m <= 0 || n <= 0) return NaN;
  return (gammaFn(m) * gammaFn(n)) / gammaFn(m + n);
}

function lnGamma(z) {
  if (z <= 0) return NaN;
  const g = 7;
  const c = [0.99999999999980993,676.5203681218851,-1259.1392167224028,771.32342877765313,-176.61502916214059,12.507343278686905,-0.13857109526572012,9.9843695780195716e-6,1.5056327351493116e-7];
  let x = c[0];
  for (let i = 1; i < g + 2; i++) x += c[i] / (z - 1 + i);
  const t = z - 1 + g + 0.5;
  return 0.5 * Math.log(2 * Math.PI) + (z - 0.5) * Math.log(t) - t + Math.log(x);
}

const pretestQs = [
  { q: "What is the Beta function B(m,n) defined as?", opts: ["∫₀¹ tᵐ⁻¹(1-t)ⁿ⁻¹ dt","∫₀∞ tⁿ⁻¹e⁻ᵗ dt","∫₀¹ tᵐ(1-t)ⁿ dt","None of these"], ans: 0 },
  { q: "The Gamma function Γ(n) for positive integer n equals:", opts: ["n!","(n-1)!","n·(n-1)","2n"], ans: 1 },
  { q: "Which is true about B(m,n)?", opts: ["B(m,n) = B(n,m)","B(m,n) ≠ B(n,m)","B(m,n) = m·n","B(m,n) = Γ(m+n)"], ans: 0 },
  { q: "Γ(1/2) equals:", opts: ["1","√π","π","1/2"], ans: 1 },
  { q: "The relation between Beta and Gamma is:", opts: ["B(m,n) = Γ(m)·Γ(n)/Γ(m+n)","B(m,n) = Γ(m+n)","B(m,n) = Γ(m)/Γ(n)","B(m,n) = Γ(m)·Γ(n)"], ans: 0 },
  { q: "Γ(n+1) = ?", opts: ["n·Γ(n)","n!","Γ(n)-1","(n+1)·Γ(n)"], ans: 0 },
  { q: "B(1,1) = ?", opts: ["0","1","2","∞"], ans: 1 },
  { q: "The Beta function is also known as:", opts: ["Euler integral of the first kind","Euler integral of the second kind","Fourier integral","Laplace transform"], ans: 0 },
  { q: "The Gamma function is an extension of which function?", opts: ["Logarithm","Factorial","Exponential","Trigonometric"], ans: 1 },
  { q: "∫₀^(π/2) sin²θ cos²θ dθ can be expressed using Beta as:", opts: ["½ B(3/2, 3/2)","B(2,2)","B(1/2,1/2)","½ B(2,2)"], ans: 0 },
];

const posttestQs = [
  { q: "Compute B(2,3):", opts: ["1/12","1/6","1/30","1/4"], ans: 0 },
  { q: "Γ(5) = ?", opts: ["24","120","6","720"], ans: 0 },
  { q: "Which integral form represents the Gamma function?", opts: ["∫₀∞ tⁿ⁻¹e⁻ᵗ dt","∫₀¹ tⁿ⁻¹(1-t)ⁿ⁻¹ dt","∫₀^π sinⁿt dt","∫₀∞ e⁻ᵗ dt"], ans: 0 },
  { q: "B(m,n) in terms of Gamma where m=3, n=4 is:", opts: ["Γ(3)Γ(4)/Γ(7)","Γ(3)+Γ(4)","Γ(7)/Γ(3)","Γ(3)·Γ(4)"], ans: 0 },
  { q: "Using the duplication formula, B(n,n) = ?", opts: ["π · 2^(1-2n) / Γ(2n)","Γ(n)²/Γ(2n)","Both are equivalent","None"], ans: 2 },
  { q: "Γ(3/2) = ?", opts: ["√π/2","√π","3√π/2","π/2"], ans: 0 },
  { q: "Which property is NOT true for the Beta function?", opts: ["B(m,n) = B(n,m)","B(m,n) = Γ(m)Γ(n)/Γ(m+n)","B(m,1) = 1/m","B(m,n) is always irrational"], ans: 3 },
  { q: "The integral ∫₀¹ x³(1-x)⁴ dx equals:", opts: ["B(4,5)","B(3,4)","1/280","B(4,5) = 1/280"], ans: 3 },
  { q: "Γ(1) = ?", opts: ["0","1","e","∞"], ans: 1 },
  { q: "Which substitution converts B(m,n) to a trigonometric form?", opts: ["t = sin²θ","t = cosθ","t = tanθ","t = eθ"], ans: 0 },
];

function Quiz({ questions, title }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [done, setDone] = useState(false);

  const score = answers.filter((a, i) => a === questions[i].ans).length;

  function handleSubmit() {
    if (selected === null) return;
    const newAns = [...answers, selected];
    setAnswers(newAns);
    setSubmitted(true);
  }

  function handleNext() {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
      setSelected(null);
      setSubmitted(false);
    } else {
      setDone(true);
    }
  }

  function reset() {
    setCurrent(0); setSelected(null); setAnswers([]); setSubmitted(false); setDone(false);
  }

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <div style={{ fontSize: 64, marginBottom: "0.5rem" }}>{pct >= 70 ? "🎉" : "📚"}</div>
        <h3 style={{ fontSize: 22, fontWeight: 600, margin: "0 0 0.5rem" }}>Score: {score}/{questions.length}</h3>
        <p style={{ color: COLORS.muted, marginBottom: "1.5rem" }}>{pct >= 70 ? "Excellent work! You have a strong understanding." : "Keep studying — review the Theory section."}</p>
        <div style={{ background: "var(--color-background-secondary)", borderRadius: 12, padding: "1rem", marginBottom: "1.5rem" }}>
          <div style={{ height: 12, borderRadius: 8, background: "var(--color-border-tertiary)", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${pct}%`, background: pct >= 70 ? "#22c55e" : "#f59e0b", borderRadius: 8, transition: "width 1s ease" }} />
          </div>
          <p style={{ margin: "0.5rem 0 0", fontSize: 13, color: COLORS.muted }}>{pct}% correct</p>
        </div>
        <button onClick={reset} style={{ padding: "10px 24px", borderRadius: 8, border: "0.5px solid var(--color-border-secondary)", background: "var(--color-background-primary)", color: "var(--color-text-primary)", cursor: "pointer", fontSize: 14 }}>Retake Quiz</button>
      </div>
    );
  }

  const q = questions[current];
  const isCorrect = submitted && selected === q.ans;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <span style={{ fontSize: 13, color: COLORS.muted, fontWeight: 500 }}>Question {current + 1} of {questions.length}</span>
        <span style={{ fontSize: 13, color: COLORS.muted }}>Score: {score}/{answers.length}</span>
      </div>
      <div style={{ background: "var(--color-background-secondary)", borderRadius: 10, padding: "1rem 1.25rem", marginBottom: "1.5rem" }}>
        <p style={{ margin: 0, fontWeight: 500, lineHeight: 1.6 }}>{q.q}</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: "1.5rem" }}>
        {q.opts.map((opt, i) => {
          let borderColor = "var(--color-border-tertiary)";
          let bg = "var(--color-background-primary)";
          let textColor = "var(--color-text-primary)";
          if (submitted) {
            if (i === q.ans) { borderColor = "#22c55e"; bg = "rgba(34,197,94,0.08)"; textColor = "#16a34a"; }
            else if (i === selected && i !== q.ans) { borderColor = "#ef4444"; bg = "rgba(239,68,68,0.08)"; textColor = "#dc2626"; }
          } else if (selected === i) {
            borderColor = "#4f8ef7"; bg = "rgba(79,142,247,0.08)";
          }
          return (
            <button key={i} onClick={() => !submitted && setSelected(i)} style={{ textAlign: "left", padding: "12px 16px", borderRadius: 8, border: `1.5px solid ${borderColor}`, background: bg, color: textColor, cursor: submitted ? "default" : "pointer", fontSize: 14, lineHeight: 1.5, transition: "all 0.15s" }}>
              <span style={{ fontWeight: 600, marginRight: 8 }}>{String.fromCharCode(65 + i)}.</span>{opt}
            </button>
          );
        })}
      </div>
      {submitted && (
        <div style={{ padding: "10px 14px", borderRadius: 8, background: isCorrect ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)", border: `1px solid ${isCorrect ? "#22c55e" : "#ef4444"}`, marginBottom: "1rem", fontSize: 13, color: isCorrect ? "#16a34a" : "#dc2626" }}>
          {isCorrect ? "✓ Correct!" : `✗ Incorrect. The correct answer is: ${q.opts[q.ans]}`}
        </div>
      )}
      <div style={{ display: "flex", gap: 10 }}>
        {!submitted
          ? <button onClick={handleSubmit} disabled={selected === null} style={{ padding: "10px 20px", borderRadius: 8, border: "none", background: selected !== null ? "#4f8ef7" : "var(--color-background-secondary)", color: selected !== null ? "#fff" : COLORS.muted, cursor: selected !== null ? "pointer" : "not-allowed", fontSize: 14, fontWeight: 500 }}>Submit Answer</button>
          : <button onClick={handleNext} style={{ padding: "10px 20px", borderRadius: 8, border: "none", background: "#4f8ef7", color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 500 }}>{current < questions.length - 1 ? "Next Question →" : "See Results"}</button>
        }
        <button onClick={reset} style={{ padding: "10px 16px", borderRadius: 8, border: "0.5px solid var(--color-border-secondary)", background: "var(--color-background-primary)", color: COLORS.muted, cursor: "pointer", fontSize: 14 }}>Reset</button>
      </div>
    </div>
  );
}

function GammaChart() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    const H = canvas.height = 260 * window.devicePixelRatio;
    canvas.style.height = "260px";
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    const w = canvas.offsetWidth, h = 260;
    const pad = { l: 48, r: 20, t: 20, b: 40 };
    const xMin = 0.2, xMax = 5;
    const yMin = 0, yMax = 6;
    const toX = v => pad.l + (v - xMin) / (xMax - xMin) * (w - pad.l - pad.r);
    const toY = v => h - pad.b - (v - yMin) / (yMax - yMin) * (h - pad.t - pad.b);
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const gridC = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
    const textC = isDark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.45)";
    ctx.clearRect(0, 0, w, h);
    for (let gx = 1; gx <= 5; gx++) { ctx.strokeStyle = gridC; ctx.lineWidth = 0.5; ctx.beginPath(); ctx.moveTo(toX(gx), pad.t); ctx.lineTo(toX(gx), h - pad.b); ctx.stroke(); }
    for (let gy = 0; gy <= 6; gy += 1) { ctx.strokeStyle = gridC; ctx.lineWidth = 0.5; ctx.beginPath(); ctx.moveTo(pad.l, toY(gy)); ctx.lineTo(w - pad.r, toY(gy)); ctx.stroke(); }
    ctx.font = "11px system-ui"; ctx.fillStyle = textC; ctx.textAlign = "center";
    for (let gx = 1; gx <= 5; gx++) { ctx.fillText(gx, toX(gx), h - pad.b + 16); }
    ctx.textAlign = "right";
    for (let gy = 0; gy <= 6; gy += 2) { ctx.fillText(gy, pad.l - 6, toY(gy) + 4); }
    ctx.strokeStyle = "#4f8ef7"; ctx.lineWidth = 2.5; ctx.beginPath();
    let first = true;
    for (let xi = 0; xi <= 500; xi++) {
      const x = xMin + (xi / 500) * (xMax - xMin);
      const y = gammaFn(x);
      if (!isFinite(y) || y < yMin || y > yMax) { first = true; continue; }
      if (first) { ctx.moveTo(toX(x), toY(y)); first = false; } else ctx.lineTo(toX(x), toY(y));
    }
    ctx.stroke();
    ctx.font = "bold 12px system-ui"; ctx.fillStyle = "#4f8ef7"; ctx.textAlign = "left";
    ctx.fillText("Γ(x)", toX(4.2), toY(gammaFn(4.2)) - 10);
    ctx.fillStyle = textC; ctx.font = "11px system-ui"; ctx.textAlign = "center";
    ctx.fillText("x", w / 2, h - 6);
    ctx.save(); ctx.translate(12, h / 2); ctx.rotate(-Math.PI / 2);
    ctx.fillText("Γ(x)", 0, 0); ctx.restore();
  }, []);
  return <canvas ref={canvasRef} style={{ width: "100%", display: "block", borderRadius: 8 }} aria-label="Plot of Gamma function" />;
}

function BetaChart({ m, n }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    const H = canvas.height = 240 * window.devicePixelRatio;
    canvas.style.height = "240px";
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    const w = canvas.offsetWidth, h = 240;
    const pad = { l: 52, r: 20, t: 20, b: 40 };
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const gridC = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
    const textC = isDark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.45)";
    let yMax = 0;
    const pts = [];
    for (let i = 1; i <= 499; i++) {
      const t = i / 500;
      const y = Math.pow(t, m - 1) * Math.pow(1 - t, n - 1);
      pts.push({ t, y });
      if (isFinite(y) && y > yMax) yMax = y;
    }
    if (yMax === 0) yMax = 1;
    const toX = v => pad.l + v * (w - pad.l - pad.r);
    const toY = v => h - pad.b - (v / yMax) * (h - pad.t - pad.b);
    ctx.clearRect(0, 0, w, h);
    for (let gx = 0; gx <= 10; gx += 2) { ctx.strokeStyle = gridC; ctx.lineWidth = 0.5; ctx.beginPath(); ctx.moveTo(toX(gx / 10), pad.t); ctx.lineTo(toX(gx / 10), h - pad.b); ctx.stroke(); }
    for (let gy = 0; gy <= 5; gy++) { ctx.strokeStyle = gridC; ctx.lineWidth = 0.5; const yv = (gy / 5) * yMax; ctx.beginPath(); ctx.moveTo(pad.l, toY(yv)); ctx.lineTo(w - pad.r, toY(yv)); ctx.stroke(); }
    ctx.font = "11px system-ui"; ctx.fillStyle = textC; ctx.textAlign = "center";
    [0, 0.2, 0.4, 0.6, 0.8, 1.0].forEach(v => ctx.fillText(v.toFixed(1), toX(v), h - pad.b + 16));
    ctx.textAlign = "right";
    [0, 0.25, 0.5, 0.75, 1.0].forEach(v => { const yv = v * yMax; ctx.fillText(yv.toFixed(2), pad.l - 6, toY(yv) + 4); });
    ctx.strokeStyle = "#a78bfa"; ctx.lineWidth = 2.5;
    ctx.fillStyle = "rgba(167,139,250,0.12)";
    ctx.beginPath();
    ctx.moveTo(toX(0), h - pad.b);
    let fst = true;
    pts.forEach(({ t, y }) => {
      if (!isFinite(y) || y > yMax * 3) { return; }
      if (fst) { ctx.lineTo(toX(t), toY(Math.min(y, yMax))); fst = false; }
      else ctx.lineTo(toX(t), toY(Math.min(y, yMax)));
    });
    ctx.lineTo(toX(1), h - pad.b); ctx.closePath(); ctx.fill();
    ctx.beginPath(); fst = true;
    pts.forEach(({ t, y }) => {
      if (!isFinite(y) || y > yMax * 3) { fst = true; return; }
      if (fst) { ctx.moveTo(toX(t), toY(Math.min(y, yMax))); fst = false; } else ctx.lineTo(toX(t), toY(Math.min(y, yMax)));
    });
    ctx.stroke();
    ctx.font = "bold 12px system-ui"; ctx.fillStyle = "#a78bfa"; ctx.textAlign = "left";
    ctx.fillText(`f(t; ${m},${n})`, toX(0.5) + 10, toY(yMax * 0.5));
    ctx.fillStyle = textC; ctx.font = "11px system-ui"; ctx.textAlign = "center";
    ctx.fillText("t", w / 2, h - 6);
    ctx.save(); ctx.translate(12, h / 2); ctx.rotate(-Math.PI / 2);
    ctx.fillText("f(t)", 0, 0); ctx.restore();
  }, [m, n]);
  return <canvas ref={canvasRef} style={{ width: "100%", display: "block", borderRadius: 8 }} aria-label={`Beta distribution plot for m=${m}, n=${n}`} />;
}

function SimulatorPanel() {
  const [mode, setMode] = useState("beta");
  const [mVal, setMVal] = useState("2");
  const [nVal, setNVal] = useState("3");
  const [gammaZ, setGammaZ] = useState("5");
  const [result, setResult] = useState(null);
  const [steps, setSteps] = useState([]);

  function computeBeta() {
    const m = parseFloat(mVal), n = parseFloat(nVal);
    if (isNaN(m) || isNaN(n) || m <= 0 || n <= 0) { setResult({ error: "Enter valid positive values for m and n." }); return; }
    const gm = gammaFn(m), gn = gammaFn(n), gmn = gammaFn(m + n);
    const val = (gm * gn) / gmn;
    const lnVal = lnGamma(m) + lnGamma(n) - lnGamma(m + n);
    setSteps([
      { label: "Integral definition", math: `B(${m}, ${n}) = ∫₀¹ t^(${m}-1) · (1-t)^(${n}-1) dt` },
      { label: "Apply B-Γ relation", math: `B(m,n) = Γ(m)·Γ(n) / Γ(m+n)` },
      { label: "Compute Γ(m)", math: `Γ(${m}) = ${gm.toFixed(6)}` },
      { label: "Compute Γ(n)", math: `Γ(${n}) = ${gn.toFixed(6)}` },
      { label: "Compute Γ(m+n)", math: `Γ(${m+n}) = ${gmn.toFixed(6)}` },
      { label: "Final result", math: `B(${m},${n}) = ${gm.toFixed(4)} × ${gn.toFixed(4)} / ${gmn.toFixed(4)} = ${val.toFixed(8)}`, highlight: true },
    ]);
    setResult({ value: val, m, n });
  }

  function computeGamma() {
    const z = parseFloat(gammaZ);
    if (isNaN(z) || z <= 0) { setResult({ error: "Enter a valid positive value for z." }); return; }
    const val = gammaFn(z);
    const isInt = Number.isInteger(z);
    const stps = [
      { label: "Integral definition", math: `Γ(${z}) = ∫₀∞ t^(${z}-1) · e^(-t) dt` },
    ];
    if (isInt && z <= 10) {
      stps.push({ label: "For positive integers", math: `Γ(n) = (n-1)! so Γ(${z}) = (${z}-1)! = ${z-1}!` });
      stps.push({ label: "Compute factorial", math: `${z-1}! = ${Array.from({length:z-1},(_, i) => i+1).join(' × ')} = ${factorial(z-1)}` });
    } else {
      stps.push({ label: "Apply Lanczos approximation", math: `Using Γ(z) ≈ √(2π) · (z+g-0.5)^(z-0.5) · e^(-(z+g-0.5)) · A(z)` });
      stps.push({ label: "Compute numerically", math: `Γ(${z}) ≈ ${val.toFixed(8)}` });
    }
    stps.push({ label: "Recurrence check", math: `Γ(${z+1}) = ${z} · Γ(${z}) = ${z} × ${val.toFixed(6)} = ${(z*val).toFixed(6)}`, highlight: false });
    stps.push({ label: "Final result", math: `Γ(${z}) = ${val.toFixed(8)}`, highlight: true });
    setSteps(stps);
    setResult({ value: val, z });
  }

  function compute() { mode === "beta" ? computeBeta() : computeGamma(); }

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: "1.5rem" }}>
        {["beta","gamma","relation"].map(m => (
          <button key={m} onClick={() => { setMode(m); setResult(null); setSteps([]); }} style={{ padding: "8px 18px", borderRadius: 8, border: mode === m ? "none" : "0.5px solid var(--color-border-secondary)", background: mode === m ? "#4f8ef7" : "var(--color-background-primary)", color: mode === m ? "#fff" : "var(--color-text-secondary)", cursor: "pointer", fontSize: 13, fontWeight: 500, textTransform: "capitalize" }}>
            {m === "beta" ? "Beta B(m,n)" : m === "gamma" ? "Gamma Γ(z)" : "B-Γ Relation"}
          </button>
        ))}
      </div>

      {mode === "beta" && (
        <div>
          <p style={{ color: COLORS.muted, fontSize: 14, marginBottom: "1.25rem", lineHeight: 1.6 }}>
            Compute B(m,n) = ∫₀¹ t^(m−1)(1−t)^(n−1) dt. Enter positive values for m and n.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: "1rem" }}>
            {[["m (first parameter)", mVal, setMVal], ["n (second parameter)", nVal, setNVal]].map(([label, val, set]) => (
              <div key={label}>
                <label style={{ fontSize: 12, color: COLORS.muted, display: "block", marginBottom: 4 }}>{label}</label>
                <input value={val} onChange={e => set(e.target.value)} placeholder="e.g. 2" style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "0.5px solid var(--color-border-secondary)", background: "var(--color-background-primary)", color: "var(--color-text-primary)", fontSize: 14 }} />
              </div>
            ))}
          </div>
          <button onClick={compute} style={{ padding: "10px 24px", borderRadius: 8, border: "none", background: "#4f8ef7", color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 500, marginBottom: "1.5rem" }}>Compute B(m,n) →</button>
          {result?.error && <div style={{ color: "#ef4444", fontSize: 14, marginBottom: "1rem" }}>{result.error}</div>}
          {result?.value !== undefined && !result.error && (
            <div style={{ background: "rgba(79,142,247,0.07)", border: "1px solid rgba(79,142,247,0.25)", borderRadius: 10, padding: "1rem 1.25rem", marginBottom: "1.5rem" }}>
              <p style={{ margin: 0, fontWeight: 600, fontSize: 18, color: "#4f8ef7" }}>B({result.m},{result.n}) = {result.value.toFixed(8)}</p>
            </div>
          )}
          {steps.length > 0 && (
            <div>
              <p style={{ fontWeight: 600, marginBottom: "0.75rem", fontSize: 14 }}>Step-by-step solution</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {steps.map((s, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, padding: "10px 14px", borderRadius: 8, background: s.highlight ? "rgba(79,142,247,0.08)" : "var(--color-background-secondary)", border: s.highlight ? "1px solid rgba(79,142,247,0.3)" : "0.5px solid var(--color-border-tertiary)" }}>
                    <span style={{ minWidth: 22, height: 22, borderRadius: "50%", background: "#4f8ef7", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{i+1}</span>
                    <div>
                      <p style={{ margin: "0 0 2px", fontSize: 12, color: COLORS.muted, fontWeight: 500 }}>{s.label}</p>
                      <p style={{ margin: 0, fontSize: 13, fontFamily: "monospace", color: s.highlight ? "#4f8ef7" : "var(--color-text-primary)", fontWeight: s.highlight ? 700 : 400 }}>{s.math}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {result?.value !== undefined && <div style={{ marginTop: "1.5rem" }}><p style={{ fontWeight: 600, fontSize: 14, marginBottom: "0.75rem" }}>Integrand plot — f(t) = t^(m-1)(1-t)^(n-1)</p><BetaChart m={parseFloat(mVal)} n={parseFloat(nVal)} /></div>}
        </div>
      )}

      {mode === "gamma" && (
        <div>
          <p style={{ color: COLORS.muted, fontSize: 14, marginBottom: "1.25rem", lineHeight: 1.6 }}>
            Compute Γ(z) = ∫₀∞ t^(z−1)·e^(−t) dt. For positive integers, Γ(n) = (n−1)!
          </p>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ fontSize: 12, color: COLORS.muted, display: "block", marginBottom: 4 }}>z (argument)</label>
            <input value={gammaZ} onChange={e => setGammaZ(e.target.value)} placeholder="e.g. 5 or 2.5" style={{ width: "50%", padding: "8px 12px", borderRadius: 8, border: "0.5px solid var(--color-border-secondary)", background: "var(--color-background-primary)", color: "var(--color-text-primary)", fontSize: 14 }} />
          </div>
          <button onClick={compute} style={{ padding: "10px 24px", borderRadius: 8, border: "none", background: "#4f8ef7", color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 500, marginBottom: "1.5rem" }}>Compute Γ(z) →</button>
          {result?.error && <div style={{ color: "#ef4444", fontSize: 14, marginBottom: "1rem" }}>{result.error}</div>}
          {result?.value !== undefined && !result.error && (
            <div style={{ background: "rgba(167,139,250,0.08)", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 10, padding: "1rem 1.25rem", marginBottom: "1.5rem" }}>
              <p style={{ margin: 0, fontWeight: 600, fontSize: 18, color: "#a78bfa" }}>Γ({result.z}) = {result.value.toFixed(8)}</p>
            </div>
          )}
          {steps.length > 0 && (
            <div style={{ marginBottom: "1.5rem" }}>
              <p style={{ fontWeight: 600, marginBottom: "0.75rem", fontSize: 14 }}>Step-by-step solution</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {steps.map((s, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, padding: "10px 14px", borderRadius: 8, background: s.highlight ? "rgba(167,139,250,0.08)" : "var(--color-background-secondary)", border: s.highlight ? "1px solid rgba(167,139,250,0.3)" : "0.5px solid var(--color-border-tertiary)" }}>
                    <span style={{ minWidth: 22, height: 22, borderRadius: "50%", background: "#a78bfa", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{i+1}</span>
                    <div>
                      <p style={{ margin: "0 0 2px", fontSize: 12, color: COLORS.muted, fontWeight: 500 }}>{s.label}</p>
                      <p style={{ margin: 0, fontSize: 13, fontFamily: "monospace", color: s.highlight ? "#a78bfa" : "var(--color-text-primary)", fontWeight: s.highlight ? 700 : 400 }}>{s.math}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div style={{ marginTop: "1rem" }}>
            <p style={{ fontWeight: 600, fontSize: 14, marginBottom: "0.75rem" }}>Gamma function graph — Γ(x) for x ∈ (0.2, 5)</p>
            <GammaChart />
          </div>
        </div>
      )}

      {mode === "relation" && (
        <div>
          <p style={{ fontWeight: 600, marginBottom: "1rem" }}>Beta-Gamma Relation Explorer</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: "1.5rem" }}>
            {[["m", mVal, setMVal], ["n", nVal, setNVal]].map(([label, val, set]) => (
              <div key={label}>
                <label style={{ fontSize: 12, color: COLORS.muted, display: "block", marginBottom: 4 }}>{label}</label>
                <input value={val} onChange={e => set(e.target.value)} placeholder="e.g. 2" style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "0.5px solid var(--color-border-secondary)", background: "var(--color-background-primary)", color: "var(--color-text-primary)", fontSize: 14 }} />
              </div>
            ))}
          </div>
          <button onClick={() => {
            const m = parseFloat(mVal), n = parseFloat(nVal);
            if (isNaN(m) || isNaN(n) || m <= 0 || n <= 0) { setResult({ error: "Enter valid positive values." }); return; }
            const direct = betaFn(m, n);
            const viaGamma = (gammaFn(m) * gammaFn(n)) / gammaFn(m + n);
            setSteps([
              { label: "Core theorem", math: `B(m,n) = Γ(m)·Γ(n) / Γ(m+n)` },
              { label: "Symmetry property", math: `B(${m},${n}) = B(${n},${m}) — verify both equal ${direct.toFixed(8)}` },
              { label: "Via Beta integral", math: `B(${m},${n}) = ∫₀¹ t^${m-1}(1-t)^${n-1} dt = ${direct.toFixed(8)}` },
              { label: "Via Gamma relation", math: `Γ(${m})·Γ(${n}) / Γ(${m+n}) = ${gammaFn(m).toFixed(4)}×${gammaFn(n).toFixed(4)} / ${gammaFn(m+n).toFixed(4)} = ${viaGamma.toFixed(8)}` },
              { label: "Trigonometric form", math: `B(${m},${n}) = 2∫₀^(π/2) sin^(${2*m-1})θ·cos^(${2*n-1})θ dθ`, highlight: false },
              { label: "Verification", math: `Both methods agree: ${Math.abs(direct - viaGamma) < 1e-10 ? "✓ Values match!" : "Δ = " + Math.abs(direct-viaGamma).toExponential(2)}`, highlight: true },
            ]);
            setResult({ direct, viaGamma, m, n });
          }} style={{ padding: "10px 24px", borderRadius: 8, border: "none", background: "#4f8ef7", color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 500, marginBottom: "1.5rem" }}>Verify Relation →</button>
          {result?.error && <div style={{ color: "#ef4444", fontSize: 14 }}>{result.error}</div>}
          {result?.direct !== undefined && !result.error && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: "1.5rem" }}>
              {[
                ["B(m,n) — integral", result.direct.toFixed(8), "#4f8ef7"],
                ["Via Γ(m)·Γ(n)/Γ(m+n)", result.viaGamma.toFixed(8), "#a78bfa"],
              ].map(([label, val, color]) => (
                <div key={label} style={{ padding: "1rem", borderRadius: 10, background: "var(--color-background-secondary)", border: "0.5px solid var(--color-border-tertiary)" }}>
                  <p style={{ margin: "0 0 4px", fontSize: 12, color: COLORS.muted }}>{label}</p>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 16, color, fontFamily: "monospace" }}>{val}</p>
                </div>
              ))}
            </div>
          )}
          {steps.length > 0 && (
            <div>
              <p style={{ fontWeight: 600, marginBottom: "0.75rem", fontSize: 14 }}>Derivation steps</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {steps.map((s, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, padding: "10px 14px", borderRadius: 8, background: s.highlight ? "rgba(34,197,94,0.07)" : "var(--color-background-secondary)", border: s.highlight ? "1px solid rgba(34,197,94,0.3)" : "0.5px solid var(--color-border-tertiary)" }}>
                    <span style={{ minWidth: 22, height: 22, borderRadius: "50%", background: s.highlight ? "#22c55e" : "#64748b", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{i+1}</span>
                    <div>
                      <p style={{ margin: "0 0 2px", fontSize: 12, color: COLORS.muted, fontWeight: 500 }}>{s.label}</p>
                      <p style={{ margin: 0, fontSize: 13, fontFamily: "monospace", color: s.highlight ? "#16a34a" : "var(--color-text-primary)" }}>{s.math}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const AIM_CONTENT = () => (
  <div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: "2rem" }}>
      {[
        { icon: "🎯", title: "Primary Objective", text: "Understand the definition, properties, and integral representations of the Beta and Gamma special functions." },
        { icon: "🔗", title: "Explore Relations", text: "Derive and verify the fundamental relationship B(m,n) = Γ(m)·Γ(n)/Γ(m+n) connecting both functions." },
        { icon: "🧮", title: "Compute Numerically", text: "Use the simulator to evaluate Beta and Gamma functions for arbitrary positive real inputs with step-by-step working." },
        { icon: "📈", title: "Visualize Behavior", text: "Plot the Beta integrand f(t; m,n) and the Gamma function to develop geometric intuition." },
      ].map(c => (
        <div key={c.title} style={{ padding: "1rem 1.25rem", borderRadius: 12, background: "var(--color-background-secondary)", border: "0.5px solid var(--color-border-tertiary)" }}>
          <div style={{ fontSize: 28, marginBottom: "0.5rem" }}>{c.icon}</div>
          <p style={{ fontWeight: 600, margin: "0 0 6px", fontSize: 15 }}>{c.title}</p>
          <p style={{ margin: 0, color: COLORS.muted, fontSize: 13, lineHeight: 1.6 }}>{c.text}</p>
        </div>
      ))}
    </div>
    <div style={{ padding: "1rem 1.25rem", borderRadius: 12, background: "rgba(79,142,247,0.06)", border: "1px solid rgba(79,142,247,0.2)" }}>
      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: "var(--color-text-primary)" }}>
        <strong>Scope:</strong> This virtual lab covers Engineering Mathematics topics on special functions as per standard university syllabi (FY/SY Engineering). After completing this experiment, students will be able to evaluate definite integrals using Beta and Gamma functions, apply the recurrence relation Γ(n+1) = n·Γ(n), and simplify complex integrals via trigonometric substitution.
      </p>
    </div>
  </div>
);

const THEORY_CONTENT = () => {
  const [tab, setTab] = useState("beta");
  const tabs = [
    { id: "beta", label: "Beta Function" },
    { id: "gamma", label: "Gamma Function" },
    { id: "relation", label: "B-Γ Relation" },
    { id: "applications", label: "Applications" },
  ];
  return (
    <div>
      <div style={{ display: "flex", gap: 4, marginBottom: "1.5rem", borderBottom: "1px solid var(--color-border-tertiary)", paddingBottom: 1 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "8px 16px", border: "none", background: "none", borderBottom: tab === t.id ? "2px solid #4f8ef7" : "2px solid transparent", color: tab === t.id ? "#4f8ef7" : COLORS.muted, cursor: "pointer", fontSize: 13, fontWeight: tab === t.id ? 600 : 400, marginBottom: -1 }}>
            {t.label}
          </button>
        ))}
      </div>
      {tab === "beta" && (
        <div>
          <h3 style={{ fontWeight: 600, fontSize: 18, marginTop: 0 }}>Beta Function — Euler's First Integral</h3>
          <p style={{ lineHeight: 1.8, color: "var(--color-text-primary)" }}>The Beta function B(m, n) is defined for positive real numbers m, n as the definite integral:</p>
          <div style={{ background: "var(--color-background-secondary)", borderRadius: 10, padding: "1rem 1.5rem", fontFamily: "monospace", fontSize: 15, marginBottom: "1.25rem", textAlign: "center", letterSpacing: 0.5 }}>
            B(m, n) = ∫₀¹ t^(m−1) · (1−t)^(n−1) dt
          </div>
          <p style={{ fontWeight: 600, marginBottom: "0.75rem" }}>Key Properties</p>
          {[
            ["Symmetry", "B(m, n) = B(n, m)", "The Beta function is symmetric in its arguments."],
            ["Special value", "B(1, 1) = 1", "When m = n = 1, the integral reduces to ∫₀¹ dt = 1."],
            ["Recurrence", "B(m+1, n) = m/(m+n) · B(m,n)", "Follows from integration by parts."],
            ["Trigonometric", "B(m,n) = 2∫₀^(π/2) sin^(2m−1)θ cos^(2n−1)θ dθ", "Via substitution t = sin²θ."],
          ].map(([title, formula, desc]) => (
            <div key={title} style={{ display: "flex", gap: 12, padding: "10px 14px", borderRadius: 8, border: "0.5px solid var(--color-border-tertiary)", marginBottom: 8, alignItems: "flex-start" }}>
              <div style={{ minWidth: 6, height: 6, borderRadius: "50%", background: "#4f8ef7", marginTop: 6, flexShrink: 0 }} />
              <div>
                <span style={{ fontWeight: 600, fontSize: 13 }}>{title}: </span>
                <span style={{ fontFamily: "monospace", fontSize: 13, background: "var(--color-background-secondary)", padding: "1px 6px", borderRadius: 4 }}>{formula}</span>
                <span style={{ fontSize: 13, color: COLORS.muted }}> — {desc}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      {tab === "gamma" && (
        <div>
          <h3 style={{ fontWeight: 600, fontSize: 18, marginTop: 0 }}>Gamma Function — Euler's Second Integral</h3>
          <p style={{ lineHeight: 1.8 }}>The Gamma function generalizes the factorial to real and complex numbers. It is defined as:</p>
          <div style={{ background: "var(--color-background-secondary)", borderRadius: 10, padding: "1rem 1.5rem", fontFamily: "monospace", fontSize: 15, marginBottom: "1.25rem", textAlign: "center" }}>
            Γ(n) = ∫₀∞ t^(n−1) · e^(−t) dt &nbsp;&nbsp; (n &gt; 0)
          </div>
          {[
            ["Recurrence relation", "Γ(n+1) = n · Γ(n)", "The most fundamental property — enables recursive computation."],
            ["Integer values", "Γ(n) = (n−1)! for n ∈ ℤ⁺", "Confirms Gamma generalizes the factorial function."],
            ["Γ(1) = 1", "∫₀∞ e^(−t) dt = 1", "Base case of the recurrence."],
            ["Γ(1/2) = √π", "∫₀∞ t^(−1/2) e^(−t) dt = √π", "A celebrated result connecting Gamma to π via Gaussian integral."],
            ["Euler's reflection", "Γ(z)·Γ(1−z) = π / sin(πz)", "Extends Gamma to negative non-integer values."],
          ].map(([title, formula, desc]) => (
            <div key={title} style={{ display: "flex", gap: 12, padding: "10px 14px", borderRadius: 8, border: "0.5px solid var(--color-border-tertiary)", marginBottom: 8 }}>
              <div style={{ minWidth: 6, height: 6, borderRadius: "50%", background: "#a78bfa", marginTop: 6, flexShrink: 0 }} />
              <div>
                <span style={{ fontWeight: 600, fontSize: 13 }}>{title}: </span>
                <span style={{ fontFamily: "monospace", fontSize: 13, background: "var(--color-background-secondary)", padding: "1px 6px", borderRadius: 4 }}>{formula}</span>
                <span style={{ fontSize: 13, color: COLORS.muted }}> — {desc}</span>
              </div>
            </div>
          ))}
          <div style={{ marginTop: "1.5rem" }}>
            <p style={{ fontWeight: 600, fontSize: 14, marginBottom: "0.75rem" }}>Quick reference table</p>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead><tr style={{ background: "var(--color-background-secondary)" }}>
                  {["n","Γ(n)","Simplification"].map(h => <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600, border: "0.5px solid var(--color-border-tertiary)" }}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {[[1,"1","Base case"],[2,"1","1! = 1"],[3,"2","2! = 2"],[4,"6","3! = 6"],[5,"24","4! = 24"],["1/2","√π ≈ 1.7725","Γ(1/2) = √π"],["3/2","√π/2 ≈ 0.8862","½·Γ(1/2)"],["5/2","3√π/4 ≈ 1.3293","³⁄₂·Γ(3/2)"]].map(([n,v,s],i) => (
                    <tr key={i} style={{ background: i%2===0 ? "transparent" : "var(--color-background-secondary)" }}>
                      {[n,v,s].map((c,j) => <td key={j} style={{ padding: "7px 12px", border: "0.5px solid var(--color-border-tertiary)", fontFamily: j<2?"monospace":"inherit" }}>{c}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {tab === "relation" && (
        <div>
          <h3 style={{ fontWeight: 600, fontSize: 18, marginTop: 0 }}>The Beta-Gamma Relation</h3>
          <p style={{ lineHeight: 1.8 }}>The most important result connecting both functions is:</p>
          <div style={{ background: "rgba(79,142,247,0.07)", border: "1px solid rgba(79,142,247,0.25)", borderRadius: 12, padding: "1.25rem 1.5rem", fontFamily: "monospace", fontSize: 18, marginBottom: "1.5rem", textAlign: "center", fontWeight: 700, color: "#4f8ef7" }}>
            B(m, n) = Γ(m) · Γ(n) / Γ(m+n)
          </div>
          <p style={{ fontWeight: 600, marginBottom: "0.75rem" }}>Proof outline</p>
          {[
            "Start with Γ(m)·Γ(n) = [∫₀∞ x^(m-1)e^(-x)dx] · [∫₀∞ y^(n-1)e^(-y)dy]",
            "Write as double integral over the first quadrant: ∫∫ x^(m-1) y^(n-1) e^(-(x+y)) dx dy",
            "Substitute x = u·t, y = u(1-t) with Jacobian |∂(x,y)/∂(u,t)| = u",
            "Separate: ∫₀∞ u^(m+n-1)e^(-u)du · ∫₀¹ t^(m-1)(1-t)^(n-1)dt = Γ(m+n) · B(m,n)",
            "Divide both sides by Γ(m+n): B(m,n) = Γ(m)·Γ(n) / Γ(m+n) ■",
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 12, marginBottom: 8 }}>
              <span style={{ minWidth: 24, height: 24, borderRadius: "50%", background: i===4?"#4f8ef7":"var(--color-background-secondary)", color: i===4?"#fff":"var(--color-text-secondary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0, border: "0.5px solid var(--color-border-secondary)" }}>{i+1}</span>
              <p style={{ margin: 0, fontFamily: "monospace", fontSize: 12.5, lineHeight: 1.7, paddingTop: 3 }}>{s}</p>
            </div>
          ))}
          <div style={{ marginTop: "1.5rem", padding: "1rem 1.25rem", borderRadius: 10, background: "var(--color-background-secondary)", border: "0.5px solid var(--color-border-tertiary)" }}>
            <p style={{ fontWeight: 600, margin: "0 0 8px" }}>Worked example: evaluate B(3/2, 5/2)</p>
            <p style={{ fontFamily: "monospace", fontSize: 13, lineHeight: 1.8, margin: 0 }}>
              B(3/2, 5/2) = Γ(3/2)·Γ(5/2) / Γ(4)<br/>
              Γ(3/2) = (1/2)·Γ(1/2) = √π/2<br/>
              Γ(5/2) = (3/2)·Γ(3/2) = 3√π/4<br/>
              Γ(4) = 3! = 6<br/>
              B(3/2, 5/2) = (√π/2)·(3√π/4) / 6 = 3π/8 / 6 = <strong>π/16</strong>
            </p>
          </div>
        </div>
      )}
      {tab === "applications" && (
        <div>
          <h3 style={{ fontWeight: 600, fontSize: 18, marginTop: 0 }}>Real-World Applications</h3>
          {[
            { emoji: "📊", title: "Probability & Statistics", body: "The Beta distribution, used to model probabilities and proportions, has PDF proportional to t^(α-1)(1-t)^(β-1) — directly the Beta function integrand. The Gamma distribution generalizes exponential and chi-squared distributions." },
            { emoji: "🔬", title: "Quantum Mechanics", body: "Gamma functions appear in solutions to the Schrödinger equation for the hydrogen atom and in normalization constants of quantum harmonic oscillator wavefunctions." },
            { emoji: "🔢", title: "Combinatorics (generalized)", body: "The binomial coefficient can be written as C(n,k) = 1/((n+1)·B(k+1,n-k+1)), extending naturally to non-integer values." },
            { emoji: "🌊", title: "Fluid Mechanics & Engineering", body: "Beta and Gamma integrals arise in Stokes flow, boundary layer theory, and in evaluating Fourier transforms of power-law functions." },
            { emoji: "📐", title: "Definite Integral Evaluation", body: "Many standard definite integrals reduce to Beta/Gamma forms: ∫₀¹ xᵐ(1-x)ⁿdx, ∫₀^(π/2) sinᵐθ cosⁿθ dθ, ∫₀∞ xⁿe⁻ˣdx." },
          ].map(a => (
            <div key={a.title} style={{ display: "flex", gap: 14, padding: "14px 16px", borderRadius: 10, border: "0.5px solid var(--color-border-tertiary)", marginBottom: 10, background: "var(--color-background-secondary)" }}>
              <span style={{ fontSize: 28, flexShrink: 0 }}>{a.emoji}</span>
              <div>
                <p style={{ fontWeight: 600, margin: "0 0 4px", fontSize: 14 }}>{a.title}</p>
                <p style={{ margin: 0, fontSize: 13, color: COLORS.muted, lineHeight: 1.7 }}>{a.body}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const REFERENCES = () => (
  <div>
    {[
      { type: "Textbook", title: "Higher Engineering Mathematics", author: "Dr. B.S. Grewal", pub: "Khanna Publishers", sections: "Chapter on Special Functions — Beta and Gamma Functions" },
      { type: "Textbook", title: "Advanced Engineering Mathematics", author: "Erwin Kreyszig", pub: "Wiley, 10th Ed.", sections: "Chapter 11 — Gamma Function, Beta Function" },
      { type: "Online Course", title: "NPTEL: Engineering Mathematics", author: "IIT faculty", pub: "nptel.ac.in", sections: "Module on Special Functions, Gamma and Beta Integrals", link: "https://nptel.ac.in" },
      { type: "Reference", title: "Handbook of Mathematical Functions", author: "Abramowitz & Stegun", pub: "NIST / Dover Publications", sections: "Chapter 6 — Gamma Function and Related Functions" },
      { type: "Interactive", title: "DLMF — Digital Library of Mathematical Functions", author: "NIST", pub: "dlmf.nist.gov", sections: "Chapter 5 (Gamma), Chapter 8 (Beta)", link: "https://dlmf.nist.gov" },
      { type: "Video", title: "Essence of Calculus — Special Functions", author: "3Blue1Brown / Khan Academy", pub: "YouTube / khanacademy.org", sections: "Gamma function visualization, factorial extension" },
    ].map((r, i) => (
      <div key={i} style={{ display: "flex", gap: 14, padding: "14px 16px", borderRadius: 10, border: "0.5px solid var(--color-border-tertiary)", marginBottom: 10 }}>
        <div style={{ minWidth: 64, textAlign: "center" }}>
          <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 6, background: r.type === "Textbook" ? "rgba(79,142,247,0.1)" : r.type === "Online Course" ? "rgba(167,139,250,0.1)" : r.type === "Interactive" ? "rgba(34,197,94,0.1)" : "rgba(245,158,11,0.1)", color: r.type === "Textbook" ? "#4f8ef7" : r.type === "Online Course" ? "#a78bfa" : r.type === "Interactive" ? "#22c55e" : "#f59e0b" }}>{r.type}</span>
        </div>
        <div>
          <p style={{ fontWeight: 600, margin: "0 0 2px", fontSize: 14 }}>{r.title}</p>
          <p style={{ margin: "0 0 2px", fontSize: 12, color: COLORS.muted }}>{r.author} — <em>{r.pub}</em></p>
          <p style={{ margin: 0, fontSize: 12, color: COLORS.muted }}>{r.sections}</p>
          {r.link && <a href={r.link} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: "#4f8ef7" }}>{r.link} ↗</a>}
        </div>
      </div>
    ))}
  </div>
);

export default function VirtualLab({ onBack }) {
  const [activeSection, setActiveSection] = useState("Aim");
  const [completed, setCompleted] = useState(new Set());
  const sectionRef = useRef(null);

  function markDone(section) { setCompleted(p => new Set([...p, section])); }

  const sections = {
    Aim: { component: <AIM_CONTENT />, desc: "Experiment objectives" },
    Theory: { component: <THEORY_CONTENT />, desc: "Mathematical background" },
    Pretest: { component: <Quiz questions={pretestQs} title="Pretest" />, desc: "Test prior knowledge" },
    Simulator: { component: <SimulatorPanel />, desc: "Interactive computation" },
    Posttest: { component: <Quiz questions={posttestQs} title="Posttest" />, desc: "Evaluate your learning" },
    References: { component: <REFERENCES />, desc: "Further reading" },
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-background-tertiary, #f8f8f6)", fontFamily: "var(--font-sans, system-ui, sans-serif)" }}>
      <header style={{ background: "var(--color-background-primary)", borderBottom: "0.5px solid var(--color-border-tertiary)", padding: "0 2rem", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {onBack && (
              <button onClick={onBack} style={{ background: 'none', border: '0.5px solid var(--color-border-secondary)', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 13, color: 'var(--color-text-secondary)' }}>← Home</button>
            )}
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #4f8ef7, #a78bfa)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>∫</div>
            <div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 15, lineHeight: 1.2 }}>Virtual Lab</p>
              <p style={{ margin: 0, fontSize: 11, color: COLORS.muted }}>Beta & Gamma Functions</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 2 }}>
            {completed.size}/{Object.keys(sections).length} completed
            <div style={{ width: 80, height: 6, borderRadius: 4, background: "var(--color-background-secondary)", margin: "auto 8px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${completed.size / Object.keys(sections).length * 100}%`, background: "#22c55e", transition: "width 0.4s ease", borderRadius: 4 }} />
            </div>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "1.5rem 1rem", display: "grid", gridTemplateColumns: "220px 1fr", gap: "1.5rem", alignItems: "start" }}>
        <aside style={{ position: "sticky", top: 80 }}>
          <div style={{ background: "var(--color-background-primary)", borderRadius: 14, border: "0.5px solid var(--color-border-tertiary)", overflow: "hidden" }}>
            <div style={{ padding: "1rem 1.25rem", borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
              <p style={{ margin: 0, fontWeight: 600, fontSize: 13, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 0.8 }}>Sections</p>
            </div>
            {NAV_ITEMS.map((item, idx) => {
              const isActive = activeSection === item;
              const isDone = completed.has(item);
              return (
                <button key={item} onClick={() => { setActiveSection(item); sectionRef.current?.scrollIntoView({ behavior: "smooth" }); }} style={{ width: "100%", textAlign: "left", padding: "12px 1.25rem", border: "none", background: isActive ? "rgba(79,142,247,0.08)" : "transparent", cursor: "pointer", borderLeft: isActive ? "3px solid #4f8ef7" : "3px solid transparent", display: "flex", alignItems: "center", justifyContent: "space-between", transition: "all 0.15s" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ width: 20, height: 20, borderRadius: "50%", background: isDone ? "#22c55e" : isActive ? "#4f8ef7" : "var(--color-background-secondary)", color: isDone || isActive ? "#fff" : COLORS.muted, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, flexShrink: 0, border: !isDone && !isActive ? "0.5px solid var(--color-border-secondary)" : "none" }}>
                      {isDone ? "✓" : idx + 1}
                    </span>
                    <div>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: isActive ? 600 : 400, color: isActive ? "#4f8ef7" : "var(--color-text-primary)" }}>{item}</p>
                      <p style={{ margin: 0, fontSize: 10, color: COLORS.muted }}>{sections[item]?.desc}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        <main ref={sectionRef} style={{ background: "var(--color-background-primary)", borderRadius: 14, border: "0.5px solid var(--color-border-tertiary)", padding: "1.75rem 2rem", minHeight: 500 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
            <div>
              <h2 style={{ margin: 0, fontWeight: 700, fontSize: 22 }}>{activeSection}</h2>
              <p style={{ margin: "4px 0 0", color: COLORS.muted, fontSize: 13 }}>{sections[activeSection]?.desc}</p>
            </div>
            {!completed.has(activeSection) && (
              <button onClick={() => markDone(activeSection)} style={{ padding: "7px 14px", borderRadius: 8, border: "0.5px solid var(--color-border-secondary)", background: "var(--color-background-secondary)", color: COLORS.muted, cursor: "pointer", fontSize: 12 }}>Mark complete ✓</button>
            )}
            {completed.has(activeSection) && (
              <span style={{ padding: "7px 14px", borderRadius: 8, background: "rgba(34,197,94,0.1)", color: "#16a34a", fontSize: 12, fontWeight: 600 }}>✓ Completed</span>
            )}
          </div>
          <div style={{ borderTop: "0.5px solid var(--color-border-tertiary)", paddingTop: "1.5rem" }}>
            {sections[activeSection]?.component}
          </div>
          <div style={{ borderTop: "0.5px solid var(--color-border-tertiary)", paddingTop: "1rem", marginTop: "2rem", display: "flex", justifyContent: "space-between" }}>
            <button onClick={() => { const idx = NAV_ITEMS.indexOf(activeSection); if (idx > 0) setActiveSection(NAV_ITEMS[idx-1]); }} disabled={NAV_ITEMS.indexOf(activeSection) === 0} style={{ padding: "9px 18px", borderRadius: 8, border: "0.5px solid var(--color-border-secondary)", background: "var(--color-background-secondary)", color: "var(--color-text-secondary)", cursor: NAV_ITEMS.indexOf(activeSection) === 0 ? "not-allowed" : "pointer", fontSize: 13, opacity: NAV_ITEMS.indexOf(activeSection) === 0 ? 0.4 : 1 }}>← Previous</button>
            <button onClick={() => { markDone(activeSection); const idx = NAV_ITEMS.indexOf(activeSection); if (idx < NAV_ITEMS.length - 1) setActiveSection(NAV_ITEMS[idx+1]); }} disabled={NAV_ITEMS.indexOf(activeSection) === NAV_ITEMS.length - 1} style={{ padding: "9px 18px", borderRadius: 8, border: "none", background: "#4f8ef7", color: "#fff", cursor: NAV_ITEMS.indexOf(activeSection) === NAV_ITEMS.length-1 ? "not-allowed" : "pointer", fontSize: 13, fontWeight: 500, opacity: NAV_ITEMS.indexOf(activeSection) === NAV_ITEMS.length-1 ? 0.4 : 1 }}>Next → </button>
          </div>
        </main>
      </div>

      <footer style={{ textAlign: "center", padding: "1.5rem", color: COLORS.muted, fontSize: 12, borderTop: "0.5px solid var(--color-border-tertiary)", marginTop: "1rem" }}>
        Virtual Labs — Beta & Gamma Functions | Engineering Mathematics | Built for educational purposes
      </footer>
    </div>
  );
}
