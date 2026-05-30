/**
 * Wordmark.tsx — Console-tinted Jynaxx wordmark for meta.jynaxxapps.com
 *
 * Ported from /brand/round-7-wordmark.jsx (the single source of truth).
 * The wordmark glyph is LOCKED round 6 — DO NOT re-design it. Adjust only
 * `size` and `color`. Accent + echo are pinned to the Console mode pair.
 *
 * Meta Tracker is React + TypeScript + Vite, so this .tsx drops straight in
 * (likely src/components/brand/). No no-build caveat this time.
 *
 * Usage:
 *   <JynaxxWordmark size={22} color="#E8F0F5" />   // header on instrument dark
 *   <MetaLockup size={22} />                         // full Meta Tracker lockup
 *   <StackedMonogram size={64} />                    // favicon / corner mark
 *
 * ── Sizing (the BIP lesson) ────────────────────────────────────────────
 * BIP shipped its header wordmark ~20% too large and needed a reduction pass.
 * Recommended ranges (calibrate per surface, expect ±20%):
 *   • Header lockup:  size 20–26  (start at 22, the default below)
 *   • Footer mark:    size 16–20
 *   • Favicon mono:   size 56–64  (rasterize to 32 / 180)
 * Minimums (brand-foundations § 2.3): header 18px, footer 14px, mono 16px.
 * Meta's current "Meta Tracker" h1 is large display type — the wordmark
 * lockup sits ABOVE/replaces the eyebrow line, it does not match the h1 size.
 */

import React from 'react';

// Console mode accents — pinned. See brand/round-7-wordmark.jsx MODE_ACCENTS.
const CONSOLE_ACCENT = '#6CE0D4'; // signal cyan (front X)
const CONSOLE_ECHO   = '#E8C56B'; // amber sub  (echo X)

const GEIST = 'Geist, system-ui, sans-serif';
const SPACE_GROTESK = '"Space Grotesk", Geist, system-ui, sans-serif';

// Explicit lockup opacities (locked here, not rediscovered per-app).
const DIVIDER_OPACITY  = 0.28;
const SUBLABEL_OPACITY = 0.92;

// ---------- The xx glyph (echo + flourish) -----------------------------

interface EchoFlourishXXProps {
  height: number;
  accent?: string;
  echo?: string;
  extLen?: number;
  dx?: number;
  echoOpacity?: number;
  strokeRatio?: number;
  style?: React.CSSProperties;
}

export function EchoFlourishXX({
  height,
  accent = CONSOLE_ACCENT,
  echo = CONSOLE_ECHO,
  extLen = 0.5,
  dx = 0.55,
  echoOpacity = 0.32,
  strokeRatio = 0.16,
  style,
}: EchoFlourishXXProps) {
  const xW = height * 0.85;
  const sw = height * strokeRatio;
  const h = height;
  const echoOffset = xW * dx;

  const x1s = sw / 2;
  const y1s = sw / 2;
  const x2e = xW - sw / 2;
  const y2e = h - sw / 2;
  const dxDir = x2e - x1s;
  const dyDir = y2e - y1s;
  const tipX = x2e + dxDir * extLen;
  const tipY = y2e + dyDir * extLen;

  const totalW = Math.max(echoOffset + xW, tipX + sw / 2);
  const totalH = Math.max(h, tipY + sw / 2);

  return (
    <svg
      width={totalW}
      height={totalH}
      viewBox={`0 0 ${totalW} ${totalH}`}
      style={{ overflow: 'visible', display: 'inline-block', verticalAlign: 'baseline', ...style }}
    >
      {/* Echo X — faded, offset right. strokeLinecap="square" is REQUIRED. */}
      <g style={{ opacity: echoOpacity }}>
        <line x1={echoOffset + sw / 2}      y1={sw / 2}     x2={echoOffset + xW - sw / 2} y2={h - sw / 2}
              stroke={echo} strokeWidth={sw} strokeLinecap="square" />
        <line x1={echoOffset + xW - sw / 2} y1={sw / 2}     x2={echoOffset + sw / 2}      y2={h - sw / 2}
              stroke={echo} strokeWidth={sw} strokeLinecap="square" />
      </g>
      {/* Front X — / stroke normal */}
      <line x1={xW - sw / 2} y1={sw / 2} x2={sw / 2} y2={h - sw / 2}
            stroke={accent} strokeWidth={sw} strokeLinecap="square" />
      {/* Front X — \ stroke extended past the bottom-right corner (the flourish) */}
      <line x1={x1s} y1={y1s} x2={tipX} y2={tipY}
            stroke={accent} strokeWidth={sw} strokeLinecap="square" />
    </svg>
  );
}

// ---------- Full wordmark: "jyna" + xx glyph ---------------------------

interface JynaxxWordmarkProps {
  size?: number;
  color?: string;
  accent?: string;
  echo?: string;
  echoOpacity?: number;
}

export function JynaxxWordmark({
  size = 22,
  color = '#E8F0F5',
  accent = CONSOLE_ACCENT,
  echo = CONSOLE_ECHO,
  echoOpacity = 0.32,
}: JynaxxWordmarkProps) {
  const xxH = size * 0.88;
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'flex-end',
      gap: size * 0.04,
      lineHeight: 0.85,
      verticalAlign: 'baseline',
    }}>
      <span style={{
        fontFamily: GEIST,
        fontWeight: 800,
        fontSize: size,
        color,
        letterSpacing: '-0.025em',
        lineHeight: 0.85,
      }}>jyna</span>
      <div style={{ position: 'relative', bottom: -size * 0.015 }}>
        <EchoFlourishXX
          height={xxH}
          accent={accent}
          echo={echo}
          extLen={0.5}
          echoOpacity={echoOpacity}
        />
      </div>
    </div>
  );
}

// ---------- Stacked monogram — favicon / corner mark -------------------

interface MonogramProps {
  size?: number;
  accent?: string;
  echo?: string;
}

export function StackedMonogram({
  size = 64,
  accent = CONSOLE_ACCENT,
  echo = CONSOLE_ECHO,
}: MonogramProps) {
  return (
    <div style={{
      display: 'inline-flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: size * 0.04,
    }}>
      <EchoFlourishXX height={size} accent={accent} echo={echo} extLen={0} echoOpacity={0.32} />
      <EchoFlourishXX height={size} accent={accent} echo={echo} extLen={0} echoOpacity={0.32} />
    </div>
  );
}

// ---------- Meta Tracker sub-brand lockup ------------------------------
// "Jynaxx · Meta Tracker" for the dashboard header. Mirrors BIP's <BipLockup>
// and IBG's <IbgLockup>. The sub-label is Space Grotesk (Console's display
// sans) — it reads as instrument signage and pairs with the app's headings.
//
// This sits where the current "DESIGNED BY MICHAEL…" eyebrow + plain
// "Meta Tracker" title are. Keep ONE of them: lockup top-left; the big
// display "Meta Tracker" h1 can stay as the page H1 below it, OR the lockup
// replaces it — see design-spec.md § 3.1. Don't render both the wordmark
// AND a same-size text "Meta Tracker" twice.
//
// The whole lockup links to jynaxxapps.com (the parent hub).

interface MetaLockupProps {
  size?: number;
  color?: string;
}

export function MetaLockup({ size = 22, color = '#E8F0F5' }: MetaLockupProps) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: size * 0.6 }}>
      <JynaxxWordmark size={size} color={color} />
      <span style={{
        width: 1,
        height: size * 0.9,
        background: 'currentColor',
        opacity: DIVIDER_OPACITY,
      }} />
      <span style={{
        fontFamily: SPACE_GROTESK,
        fontWeight: 600,
        fontSize: size * 0.64,
        letterSpacing: '0.01em',
        color,
        opacity: SUBLABEL_OPACITY,
      }}>Meta Tracker</span>
    </div>
  );
}
