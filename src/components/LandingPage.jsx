import { useState } from 'react'

const navigation = [
  { name: 'Aim', href: '#' },
  { name: 'Theory', href: '#' },
  { name: 'Simulator', href: '#' },
  { name: 'References', href: '#' },
]

// Small nav logo (header) — Georgia serif beta + gamma text, #c4b5c4 colour
function BetaGammaLogoSmall() {
  return (
    <svg viewBox="0 -10 60 60" style={{ height: '32px', width: '40px' }} aria-label="Beta Gamma logo">
      <text x="30" y="30" fontFamily="Georgia, serif" fontSize="45" fill="#c4b5c4">&#946;</text>
      <text x="43" y="33" fontFamily="Georgia, serif" fontSize="49" fontStyle="italic" fill="#c4b5c4" fillOpacity="0.9">&#947;</text>
    </svg>
  )
}

// Large hero logo — same treatment scaled up, with hover scale
function BetaGammaLogoLarge() {
  return (
    <svg
      viewBox="0 -10 90 90"
      style={{
        height: '112px',
        width: 'auto',
        filter: 'drop-shadow(0 20px 40px rgba(196,181,196,0.25))',
        transition: 'transform 0.5s ease',
        cursor: 'default',
      }}
      onMouseOver={e => { e.currentTarget.style.transform = 'scale(1.05)' }}
      onMouseOut={e => { e.currentTarget.style.transform = 'scale(1)' }}
      aria-label="Beta Gamma logo"
    >
      <text x="36" y="50" fontFamily="Georgia, serif" fontSize="65" fill="#c4b5c4">&#946;</text>
      <text x="54" y="53" fontFamily="Georgia, serif" fontSize="70" fontStyle="italic" fill="#c4b5c4" fillOpacity="0.9">&#947;</text>
    </svg>
  )
}

export default function VirtualLabLanding({ onEnter }) {
  const [, setMobileMenuOpen] = useState(false)

  return (
    <div
      style={{
        background: '#0f0a1e',
        minHeight: '100vh',
        fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background soft radial glows */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -52%)',
          width: '900px', height: '700px',
          background: 'radial-gradient(ellipse at center, rgba(88,60,210,0.55) 0%, rgba(60,30,160,0.2) 45%, transparent 72%)',
          borderRadius: '50%', filter: 'blur(40px)',
        }} />
        <div style={{
          position: 'absolute', top: '-120px', left: '-80px',
          width: '500px', height: '420px',
          background: 'radial-gradient(ellipse at center, rgba(255,100,160,0.18) 0%, transparent 65%)',
          borderRadius: '50%', filter: 'blur(60px)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-100px', right: '-60px',
          width: '480px', height: '380px',
          background: 'radial-gradient(ellipse at center, rgba(200,100,255,0.14) 0%, transparent 65%)',
          borderRadius: '50%', filter: 'blur(60px)',
        }} />
      </div>

      {/* Nav */}
      <header style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        zIndex: 50, padding: '1.5rem 2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* Header logo block */}
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', cursor: 'pointer' }}>
          <BetaGammaLogoSmall />
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', lineHeight: 1 }}>
            <span style={{ color: 'white', fontWeight: 600, fontSize: '15px', letterSpacing: '-0.02em' }}>Virtual Lab</span>
            <span style={{ color: 'rgba(156,163,175,1)', fontSize: '13px', letterSpacing: '-0.01em', marginTop: '2px' }}>Interactive Study</span>
          </div>
        </a>

        <nav style={{ display: 'flex', gap: '3rem' }}>
          {navigation.map(item => (
            <a key={item.name} href={item.href} style={{
              color: 'white', textDecoration: 'none', fontSize: '14px',
              fontWeight: 600, opacity: 0.9, transition: 'opacity 0.15s',
            }}
              onMouseOver={e => { e.target.style.opacity = 1 }}
              onMouseOut={e => { e.target.style.opacity = 0.9 }}
            >
              {item.name}
            </a>
          ))}
        </nav>

        <a href="#" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', fontWeight: 600, opacity: 0.85 }}>
          Log in &#8594;
        </a>
      </header>

      {/* Hero */}
      <div style={{
        position: 'relative', zIndex: 10,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', minHeight: '100vh',
        padding: '8rem 1.5rem 4rem', textAlign: 'center',
      }}>

        {/* Large centre logo — SVG beside stacked wordmark */}
        <div style={{
          display: 'flex', flexDirection: 'row',
          alignItems: 'center', justifyContent: 'center',
          gap: '24px', marginBottom: '4rem',
        }}>
          <BetaGammaLogoLarge />
          <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', lineHeight: 1.1 }}>
            <h1 style={{
              margin: 0, color: 'white',
              fontSize: 'clamp(2.25rem, 5vw, 3rem)',
              fontWeight: 600, letterSpacing: '-0.025em',
            }}>
              Virtual Lab
            </h1>
            <h2 style={{
              margin: '4px 0 0', color: 'rgba(209,213,219,1)',
              fontSize: 'clamp(1.75rem, 4vw, 2.25rem)',
              letterSpacing: '-0.015em', fontWeight: 300,
            }}>
            Interactive Simulation
            </h2>
          </div>
        </div>

        {/* Announcement badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '6px 16px', borderRadius: '999px',
          border: '1px solid rgba(255,255,255,0.15)',
          color: 'rgba(156,163,175,1)', fontSize: '13px',
          marginBottom: '2.5rem', backdropFilter: 'blur(4px)',
        }}>
          Announcing our next round of funding.{' '}
          <a href="#" style={{ color: '#818cf8', fontWeight: 600, textDecoration: 'none' }}>
            Read more &#8594;
          </a>
        </div>

        {/* Main headline */}
        <h2 style={{
          margin: '0 0 1.25rem',
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          fontWeight: 700, color: 'white',
          letterSpacing: '-0.025em', lineHeight: 1.1, maxWidth: '680px',
        }}>
          Explore Beta &amp; Gamma Functions Interactively
        </h2>

        {/* Subheading */}
        <p style={{
          color: 'rgba(156,163,175,1)', fontSize: '1.1rem',
          lineHeight: 1.75, maxWidth: '520px', margin: '0 0 2.5rem',
        }}>
          A virtual laboratory for engineering mathematics students to compute, visualize, and
          understand Beta and Gamma special functions with step-by-step solutions.
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button onClick={onEnter} style={{
            background: '#6366f1', color: 'white',
            padding: '12px 28px', borderRadius: '8px',
            fontWeight: 600, fontSize: '15px',
            border: 'none', cursor: 'pointer', transition: 'background 0.15s',
          }}
            onMouseOver={e => { e.currentTarget.style.background = '#818cf8' }}
            onMouseOut={e => { e.currentTarget.style.background = '#6366f1' }}
          >
            Start Experiment
          </button>
          <a href="#" style={{ color: 'white', fontSize: '15px', fontWeight: 600, textDecoration: 'none', opacity: 0.85 }}>
            Learn more &#8594;
          </a>
        </div>

        {/* Decorative formula strip */}
        <div style={{ marginTop: '4rem', display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center', opacity: 0.3 }}>
          {[
            'B(m,n) = \u222B\u2080\u00B9 t\u1D50\u207B\u00B9(1-t)\u207F\u207B\u00B9 dt',
            '\u0393(n) = \u222B\u2080\u221E t\u207F\u207B\u00B9e\u207B\u1D57 dt',
            'B(m,n) = \u0393(m)\u0393(n)/\u0393(m+n)',
            '\u0393(n+1) = n\u00B7\u0393(n)',
          ].map(f => (
            <span key={f} style={{ color: 'white', fontSize: '12px', fontFamily: 'monospace', letterSpacing: '0.03em' }}>
              {f}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
