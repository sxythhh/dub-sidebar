interface Palette {
  base: string;
  dark: string;
  mid: string;
  hlLight: string;
  hlMid: string;
  hlSoft: string;
}

/*
 * Consistent lighting model across all badges:
 * - Light source: top-left
 * - Base layer: p.dark (full shape)
 * - Lit face(s): p.mid
 * - Top-left catch: white 0.3-0.5 opacity
 * - Right side: colored gradient (hlLight → hlMid)
 * - Bottom: black 0.2-0.4 opacity (shadow)
 * - Bounce light (bottom-left): white 0.1-0.15
 * - Roman numeral: white with 0.9 opacity (legible on all colors)
 */

/* ──────────────────────────────────────────────
   RANK 1 — RECRUIT — Diamond (Orange)
   4-sided gem, simplest shape
   ────────────────────────────────────────────── */
function DiamondBadge({ id, p }: { id: string; p: Palette }) {
  // Diamond: 4 vertices at compass points
  // Top: (10, 2), Right: (18, 10), Bottom: (10, 18), Left: (2, 10)
  return (
    <svg width="60" height="60" viewBox="0 0 20 20" fill="none">
      <defs>
        <linearGradient id={`${id}-rg`} x1="18" y1="2" x2="10" y2="18" gradientUnits="userSpaceOnUse">
          <stop stopColor={p.hlLight} />
          <stop offset="1" stopColor={p.hlMid} />
        </linearGradient>
      </defs>

      {/* 4 facets from center to edges — drawn as 4 triangles */}

      {/* Bottom-right facet — darkest (shadow side) */}
      <path d="M18 10 L10 18 L10 10 Z" fill={p.dark} />

      {/* Bottom-left facet — dark with bounce light */}
      <path d="M2 10 L10 18 L10 10 Z" fill={p.dark} />
      <path d="M2 10 L10 18 L10 10 Z" fill="white" fillOpacity="0.12" />

      {/* Top-right facet — colored gradient (lit side) */}
      <path d="M10 2 L18 10 L10 10 Z" fill={`url(#${id}-rg)`} />

      {/* Top-left facet — brightest (direct light catch) */}
      <path d="M10 2 L2 10 L10 10 Z" fill={p.mid} />
      <path d="M10 2 L2 10 L10 10 Z" fill="white" fillOpacity="0.35" />

      {/* Bottom shadow overlay */}
      <path d="M2 10 L10 18 L18 10 L10 10 Z" fill="black" fillOpacity="0.15" />

      {/* Top edge highlight line */}
      <path d="M10 2 L18 10" stroke="white" strokeOpacity="0.2" strokeWidth="0.4" />
      <path d="M10 2 L2 10" stroke="white" strokeOpacity="0.3" strokeWidth="0.4" />

      {/* Numeral */}
      <text x="10" y="11.8" textAnchor="middle" fontSize="5.5" fontWeight="800"
        fontFamily="var(--font-inter), Inter, system-ui" fill="white" fillOpacity="0.9">
        I
      </text>
    </svg>
  );
}

/* ──────────────────────────────────────────────
   RANK 2 — OPERATOR — Shield (Silver)
   Straight-line shield: flat top, angled sides, pointed bottom
   ────────────────────────────────────────────── */
function ShieldBadge({ id, p }: { id: string; p: Palette }) {
  // Shield outline: top-left (4,2), top-right (16,2),
  // shoulder-right (17,5), hip-right (15,12), point (10,18.5),
  // hip-left (5,12), shoulder-left (3,5)
  const outline = "M4 2 L16 2 L17 5 L15 12 L10 18.5 L5 12 L3 5 Z";
  return (
    <svg width="60" height="60" viewBox="0 0 20 20" fill="none">
      <defs>
        <linearGradient id={`${id}-rg`} x1="17" y1="2" x2="10" y2="18" gradientUnits="userSpaceOnUse">
          <stop stopColor={p.hlLight} />
          <stop offset="1" stopColor={p.hlMid} />
        </linearGradient>
        <linearGradient id={`${id}-top`} x1="10" y1="2" x2="10" y2="8" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" stopOpacity="0.4" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Full shield — dark base */}
      <path d={outline} fill={p.dark} />

      {/* Left half — mid tone */}
      <path d="M4 2 L10 2 L10 18.5 L5 12 L3 5 Z" fill={p.mid} />

      {/* Right half — colored gradient */}
      <path d="M10 2 L16 2 L17 5 L15 12 L10 18.5 Z" fill={`url(#${id}-rg)`} fillOpacity="0.5" />

      {/* Top band highlight */}
      <path d="M4 2 L16 2 L17 5 L3 5 Z" fill={`url(#${id}-top)`} />

      {/* Top-left catch light */}
      <path d="M4 2 L10 2 L3 5 Z" fill="white" fillOpacity="0.3" />

      {/* Bottom shadow */}
      <path d="M5 12 L10 18.5 L15 12 Z" fill="black" fillOpacity="0.25" />

      {/* Bottom-left bounce */}
      <path d="M3 5 L5 12 L10 18.5 L10 10 Z" fill="white" fillOpacity="0.08" />

      {/* Edge highlights */}
      <path d="M4 2 L16 2" stroke="white" strokeOpacity="0.25" strokeWidth="0.35" />
      <path d="M4 2 L3 5" stroke="white" strokeOpacity="0.2" strokeWidth="0.3" />

      {/* Belt divider */}
      <path d="M3.5 5 L16.5 5" stroke="white" strokeOpacity="0.1" strokeWidth="0.25" />

      {/* Numeral */}
      <text x="10" y="11" textAnchor="middle" fontSize="4.5" fontWeight="800"
        fontFamily="var(--font-inter), Inter, system-ui" fill="white" fillOpacity="0.9">
        II
      </text>
    </svg>
  );
}

/* ──────────────────────────────────────────────
   RANK 3 — CONTENDER — Hollow Star (Gold)
   User's exact 2nd reference SVG, recolored
   ────────────────────────────────────────────── */
function HollowStarBadge({ id, p }: { id: string; p: Palette }) {
  return (
    <svg width="60" height="60" viewBox="0 0 20 20" fill="none">
      {/* Hollow star body — exact paths from user's SVG */}
      <path
        fillRule="evenodd" clipRule="evenodd"
        d="M13.7248 6.27551L19.1673 7.99467L15.7298 12.578L16.3031 19.1663L10.0007 16.8747L3.69898 19.1663L4.27148 12.578L0.833984 7.99467L6.27648 6.27467L10.0007 0.833008L13.7248 6.27551ZM7.42232 7.70801L3.98482 9.14051L6.27648 12.2913V16.0155L10.0007 14.8697L13.7248 16.0155V12.2913L16.0165 9.14051L12.579 7.70801L10.0007 4.84384L7.42232 7.70801Z"
        fill={p.base}
      />

      {/* Top-right arm — white highlight */}
      <path d="M10 0.833008L13.7242 6.27551L19.1667 7.99467L16.0158 9.14051L12.5783 7.70801L10 4.84384V0.833008Z"
        fill="white" fillOpacity="0.3" />

      {/* Right arm */}
      <path d="M19.1671 7.99512L16.0163 9.14095L13.7246 12.2918V16.016L16.3021 19.1668L15.7296 12.5785L19.1671 7.99512Z"
        fill="white" fillOpacity="0.1" />

      {/* Bottom — shadow */}
      <path d="M13.7251 16.016L10.0009 14.8701L6.27672 16.016L3.69922 19.1668L10.0009 16.8751L16.3034 19.1668L13.7251 16.016Z"
        fill="black" fillOpacity="0.4" />

      {/* Left arm */}
      <path d="M0.833984 7.99512L3.98482 9.14095L6.27648 12.2918V16.016L3.69898 19.1668L4.27148 12.5785L0.833984 7.99512Z"
        fill="white" fillOpacity="0.1" />

      {/* Top-left arm — brightest */}
      <path d="M10.0007 0.833008L6.27648 6.27551L0.833984 7.99467L3.98482 9.14051L7.42232 7.70801L10.0007 4.84384V0.833008Z"
        fill="white" fillOpacity="0.5" />

      {/* Inner shine band across middle */}
      <path d="M4.18404 8.92078L10.1999 11.4991L16.2157 8.92078L19.3665 7.77495L13.924 6.05495L10.1999 0.613281L6.4757 6.05578L1.0332 7.77495L4.18404 8.92078Z"
        fill="white" fillOpacity="0.2" />

      {/* Numeral */}
      <text x="10" y="12" textAnchor="middle" fontSize="3.6" fontWeight="800"
        fontFamily="var(--font-inter), Inter, system-ui" fill="white" fillOpacity="0.9">
        III
      </text>
    </svg>
  );
}

/* ──────────────────────────────────────────────
   RANK 4 — CHALLENGER — Filled Star Gem (Blue)
   User's exact 1st reference SVG, recolored
   All 14 gradients + 4 tip extensions preserved
   ────────────────────────────────────────────── */
function FilledStarBadge({ id, p }: { id: string; p: Palette }) {
  return (
    <svg width="60" height="60" viewBox="0 0 20 20" fill="none">
      <defs>
        {/* Tip gradient pairs — each tip has an A and B gradient overlay */}
        <linearGradient id={`${id}-t1a`} x1="18.8993" y1="15.6212" x2="7.66844" y2="16.5204" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" /><stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${id}-t1b`} x1="17.5493" y1="2.90789" x2="6.37094" y2="3.33206" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" stopOpacity="0" /><stop offset="1" stopColor="white" />
        </linearGradient>
        <linearGradient id={`${id}-t2a`} x1="1.10096" y1="15.6212" x2="12.3318" y2="16.5204" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" /><stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${id}-t2b`} x1="2.4513" y1="2.90789" x2="13.6296" y2="3.33206" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" stopOpacity="0" /><stop offset="1" stopColor="white" />
        </linearGradient>
        <linearGradient id={`${id}-t3a`} x1="8.51505" y1="19.1665" x2="17.7192" y2="10.8006" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" /><stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${id}-t3b`} x1="2.31516" y1="14.094" x2="6.16432" y2="2.62897" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" stopOpacity="0" /><stop offset="1" stopColor="white" />
        </linearGradient>
        <linearGradient id={`${id}-t4a`} x1="10.8716" y1="19.1665" x2="2.18823" y2="10.3331" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" /><stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${id}-t4b`} x1="17.5791" y1="13.8006" x2="13.6282" y2="2.6398" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" stopOpacity="0" /><stop offset="1" stopColor="white" />
        </linearGradient>

        {/* Body facet gradients */}
        <linearGradient id={`${id}-ftr`} x1="15.3527" y1="17.6763" x2="-2.83734" y2="16.7747" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" stopOpacity="0" /><stop offset="1" stopColor="white" />
        </linearGradient>
        <linearGradient id={`${id}-sr`} x1="9.99979" y1="0.833294" x2="9.99979" y2="19.1666" gradientUnits="userSpaceOnUse">
          <stop stopColor={p.hlLight} /><stop offset="1" stopColor={p.hlMid} />
        </linearGradient>
        <linearGradient id={`${id}-ftl`} x1="25.924" y1="-2.74949" x2="-2.28935" y2="17.4597" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" stopOpacity="0" /><stop offset="1" stopColor="white" />
        </linearGradient>
        <linearGradient id={`${id}-bot`} x1="10.0007" y1="0.833515" x2="-2.04018" y2="4.03185" gradientUnits="userSpaceOnUse">
          <stop stopColor={p.base} /><stop offset="1" stopColor={p.hlSoft} />
        </linearGradient>
      </defs>

      {/* Bottom-left tip */}
      <path d="M3.9851 10.8945L4.58177 14.2804L1.46094 13.0854L3.9851 10.8945Z" fill={p.base} />
      <path d="M1.46094 13.0854L3.9851 10.8945L4.28344 12.587L1.46094 13.0854Z" fill={`url(#${id}-t1a)`} />
      <path d="M1.46094 13.0862L4.58177 14.2812L4.28344 12.5879L1.46094 13.0862Z" fill={`url(#${id}-t1b)`} />

      {/* Bottom-right tip */}
      <path d="M16.0146 10.8945L15.418 14.2804L18.5388 13.0854L16.0146 10.8945Z" fill={p.base} />
      <path d="M18.5393 13.0854L16.0151 10.8945L15.7168 12.587L18.5393 13.0854Z" fill={`url(#${id}-t2a)`} />
      <path d="M18.5388 13.0862L15.418 14.2812L15.7163 12.5879L18.5388 13.0862Z" fill={`url(#${id}-t2b)`} />

      {/* Top-right tip */}
      <path d="M12.3867 5.1948L15.0584 7.35814L15.5251 4.0498L12.3867 5.1948Z" fill={p.base} />
      <path d="M15.5251 4.0498L12.3867 5.1948L13.7226 6.27647L15.5251 4.0498Z" fill={`url(#${id}-t3a)`} />
      <path d="M15.5252 4.0498L15.0585 7.35814L13.7227 6.27647L15.5252 4.0498Z" fill={`url(#${id}-t3b)`} />

      {/* Top-left tip */}
      <path d="M7.61573 5.1948L4.94406 7.35814L4.47656 4.0498L7.61573 5.1948Z" fill={p.base} />
      <path d="M4.47656 4.0498L7.61573 5.1948L6.2799 6.27647L4.47656 4.0498Z" fill={`url(#${id}-t4a)`} />
      <path d="M4.47656 4.0498L4.94406 7.35814L6.2799 6.27647L4.47656 4.0498Z" fill={`url(#${id}-t4b)`} />

      {/* Main star body — dark base */}
      <path d="M13.7248 6.27551L19.1665 7.99467L15.7298 12.578L16.3023 19.1663L10.0007 16.8747L3.69815 19.1663L4.27148 12.578L0.833984 7.99467L6.27648 6.27467L10.0007 0.833008L13.7248 6.27551Z" fill={p.dark} />

      {/* Upper facets — mid tone */}
      <path d="M4.27148 12.5522L6.27648 12.2663L10.0007 10.8372L13.7248 12.2663L15.7298 12.5522L19.1673 7.97884L13.7248 6.26384L10.0007 0.833008L6.27648 6.26384L0.833984 7.97884L4.27148 12.5522Z" fill={p.mid} />

      {/* Top-right facet highlight */}
      <path d="M10.0352 0.833008L13.7443 6.29717L19.166 8.02217L16.0277 9.17217L12.6027 7.73467L10.036 4.85967L10.0352 0.833008Z" fill={`url(#${id}-ftr)`} />

      {/* Right side — colored gradient */}
      <path d="M19.1665 8.02246L16.0031 9.16663L13.7031 12.31V16.0241L16.2898 19.1666L15.7148 12.595L19.1665 8.02246Z" fill={`url(#${id}-sr)`} />

      {/* Left side — white highlight */}
      <path d="M0.833984 8.02246L3.99732 9.16663L6.29732 12.31V16.0241L3.71065 19.1666L4.28565 12.595L0.833984 8.02246Z" fill="white" fillOpacity="0.4" />

      {/* Top-left facet */}
      <path d="M10.0365 0.833008L6.29815 6.29717L0.833984 8.02217L3.99732 9.17217L7.44815 7.73467L10.0365 4.85967V0.833008Z" fill={`url(#${id}-ftl)`} />

      {/* Bottom facet — colored gradient */}
      <path d="M13.7757 16.0035L10.0365 14.8535L6.29815 16.0035L3.70898 19.1668L10.0357 16.8668L16.3632 19.1668L13.7757 16.0035Z" fill={`url(#${id}-bot)`} />

      {/* Roman numeral "IV" — original vector paths */}
      <path d="M12.9661 14.2019H10.6378L8.38281 8.08775H10.482L11.802 12.2036L13.122 8.08691H15.2211L12.9661 14.2019Z" fill="white" fillOpacity="0.85" />
      <path d="M8.23839 14.2021H6.38672V8.08789H8.23839V14.2021Z" fill="white" fillOpacity="0.85" />
    </svg>
  );
}

/* ──────────────────────────────────────────────
   RANK 5 — ELITE — Crowned Star (Purple)
   Filled star body + angular crown spikes on top +
   side accent wings (straight lines, no bezier)
   ────────────────────────────────────────────── */
function CrownedStarBadge({ id, p }: { id: string; p: Palette }) {
  return (
    <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id={`${id}-sr`} x1="12" y1="1" x2="12" y2="23" gradientUnits="userSpaceOnUse">
          <stop stopColor={p.hlLight} /><stop offset="1" stopColor={p.hlMid} />
        </linearGradient>
        <linearGradient id={`${id}-bot`} x1="12" y1="1" x2="-2" y2="5" gradientUnits="userSpaceOnUse">
          <stop stopColor={p.base} /><stop offset="1" stopColor={p.hlSoft} />
        </linearGradient>
        <linearGradient id={`${id}-wing`} x1="0" y1="8" x2="6" y2="16" gradientUnits="userSpaceOnUse">
          <stop stopColor={p.hlMid} /><stop offset="1" stopColor={p.dark} />
        </linearGradient>
        <linearGradient id={`${id}-wingr`} x1="24" y1="8" x2="18" y2="16" gradientUnits="userSpaceOnUse">
          <stop stopColor={p.hlLight} stopOpacity="0.5" /><stop offset="1" stopColor={p.dark} />
        </linearGradient>
      </defs>

      {/* Left wing accent — angular, 3 pointed feathers */}
      <path d="M5.5 7.5 L1 6 L2 9 L0.5 11 L2.5 11.5 L1.5 14 L4.5 13 L5 10 Z" fill={p.dark} />
      <path d="M5.5 7.5 L1 6 L2 9 L0.5 11 L2.5 11.5 L1.5 14 L4.5 13 L5 10 Z" fill={`url(#${id}-wing)`} fillOpacity="0.7" />
      {/* Wing feather separators */}
      <path d="M2 9 L5 9.5" stroke="white" strokeOpacity="0.15" strokeWidth="0.3" />
      <path d="M2.5 11.5 L5 11" stroke="white" strokeOpacity="0.1" strokeWidth="0.3" />

      {/* Right wing accent — mirror */}
      <path d="M18.5 7.5 L23 6 L22 9 L23.5 11 L21.5 11.5 L22.5 14 L19.5 13 L19 10 Z" fill={p.dark} />
      <path d="M18.5 7.5 L23 6 L22 9 L23.5 11 L21.5 11.5 L22.5 14 L19.5 13 L19 10 Z" fill={`url(#${id}-wingr)`} fillOpacity="0.7" />
      <path d="M22 9 L19 9.5" stroke="white" strokeOpacity="0.1" strokeWidth="0.3" />
      <path d="M21.5 11.5 L19 11" stroke="white" strokeOpacity="0.08" strokeWidth="0.3" />

      {/* Main star body — scaled to 24x24 viewBox, centered */}
      {/* Star points: top (12,1.5), upper-right (17.2,8), lower-right (19.5,15.5),
         bottom-right (15,22), bottom-left (9,22), lower-left (4.5,15.5),
         upper-left (6.8,8) — with inner vertices between each */}

      {/* Full star — dark base */}
      <path d="M16.5 7.8 L22.5 9.8 L19 14.8 L19.7 22 L12 19.5 L4.3 22 L5 14.8 L1.5 9.8 L7.5 7.8 L12 1.5 Z" fill={p.dark} />

      {/* Upper facets — mid */}
      <path d="M5 15 L7.5 14.7 L12 13 L16.5 14.7 L19 15 L22.5 9.8 L16.5 7.8 L12 1.5 L7.5 7.8 L1.5 9.8 Z" fill={p.mid} />

      {/* Top-right facet */}
      <path d="M12 1.5 L16.5 7.8 L22.5 9.8 L19.2 11 L15 9.4 L12 6 Z" fill="white" fillOpacity="0.15" />

      {/* Right side — colored gradient */}
      <path d="M22.5 9.8 L19.2 11 L16.5 14.8 V19.5 L19.7 22 L19 14.8 Z" fill={`url(#${id}-sr)`} />

      {/* Left side — white highlight */}
      <path d="M1.5 9.8 L4.8 11 L7.5 14.8 V19.5 L4.3 22 L5 14.8 Z" fill="white" fillOpacity="0.35" />

      {/* Top-left — catch light */}
      <path d="M12 1.5 L7.5 7.8 L1.5 9.8 L4.8 11 L9 9.4 L12 6 Z" fill="white" fillOpacity="0.3" />

      {/* Bottom */}
      <path d="M16.5 19.5 L12 18 L7.5 19.5 L4.3 22 L12 19.5 L19.7 22 Z" fill={`url(#${id}-bot)`} />

      {/* Numeral */}
      <text x="12" y="14" textAnchor="middle" fontSize="5.5" fontWeight="800"
        fontFamily="var(--font-inter), Inter, system-ui" fill="white" fillOpacity="0.9">
        V
      </text>
    </svg>
  );
}

/* ──────────────────────────────────────────────
   RANK 6 — LEGEND — Hexagonal Crest (Teal)
   Outer hex frame + inner hex + upward chevron
   All coordinates mathematically precise
   ────────────────────────────────────────────── */
function HexCrestBadge({ id, p }: { id: string; p: Palette }) {
  // Outer hex: flat-top, r=9, center (10,10)
  // cos30*9=7.79, sin30*9=4.5
  // Points: TL(5.5,2.2) TR(14.5,2.2) R(19,10) BR(14.5,17.8) BL(5.5,17.8) L(1,10)
  const outer = "M5.5 2.2 L14.5 2.2 L19 10 L14.5 17.8 L5.5 17.8 L1 10 Z";
  // Inner hex: r=6.5, center (10,10)
  // cos30*6.5=5.63, sin30*6.5=3.25
  // Points: TL(6.75,4.37) TR(13.25,4.37) R(16.5,10) BR(13.25,15.63) BL(6.75,15.63) L(3.5,10)
  const inner = "M6.75 4.37 L13.25 4.37 L16.5 10 L13.25 15.63 L6.75 15.63 L3.5 10 Z";

  return (
    <svg width="60" height="60" viewBox="0 0 20 20" fill="none">
      <defs>
        <linearGradient id={`${id}-rg`} x1="19" y1="2" x2="5" y2="18" gradientUnits="userSpaceOnUse">
          <stop stopColor={p.hlLight} /><stop offset="1" stopColor={p.hlMid} />
        </linearGradient>
        <linearGradient id={`${id}-ig`} x1="10" y1="4.37" x2="10" y2="15.63" gradientUnits="userSpaceOnUse">
          <stop stopColor={p.mid} /><stop offset="1" stopColor={p.dark} />
        </linearGradient>
        <linearGradient id={`${id}-chev`} x1="10" y1="5" x2="10" y2="14" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" stopOpacity="0.3" /><stop offset="1" stopColor="white" stopOpacity="0.05" />
        </linearGradient>
      </defs>

      {/* Outer hex — dark base */}
      <path d={outer} fill={p.dark} />

      {/* Outer hex facets (6 triangles from center) */}
      {/* Top face — mid */}
      <path d="M5.5 2.2 L14.5 2.2 L10 10 Z" fill={p.mid} />

      {/* Top-right face — highlight gradient */}
      <path d="M14.5 2.2 L19 10 L10 10 Z" fill={p.mid} />
      <path d="M14.5 2.2 L19 10 L10 10 Z" fill="white" fillOpacity="0.15" />

      {/* Right face — colored gradient */}
      <path d="M19 10 L14.5 17.8 L10 10 Z" fill={`url(#${id}-rg)`} fillOpacity="0.4" />

      {/* Top-left face — catch light */}
      <path d="M1 10 L5.5 2.2 L10 10 Z" fill="white" fillOpacity="0.25" />

      {/* Bottom-left face — subtle bounce */}
      <path d="M5.5 17.8 L1 10 L10 10 Z" fill="white" fillOpacity="0.08" />

      {/* Bottom face — shadow */}
      <path d="M14.5 17.8 L5.5 17.8 L10 10 Z" fill="black" fillOpacity="0.2" />

      {/* Bottom-right — transition */}
      <path d="M19 10 L14.5 17.8 L10 10 Z" fill="black" fillOpacity="0.05" />

      {/* Inner hex — gradient fill */}
      <path d={inner} fill={`url(#${id}-ig)`} />

      {/* Inner hex top highlight */}
      <path d="M6.75 4.37 L13.25 4.37 L10 8 Z" fill="white" fillOpacity="0.2" />

      {/* Upward chevron/arrow inside inner hex */}
      <path d="M7 13 L10 7 L13 13 L12.2 13 L10 8.5 L7.8 13 Z" fill={`url(#${id}-chev)`} />

      {/* Outer top edge highlight */}
      <path d="M5.5 2.2 L14.5 2.2" stroke="white" strokeOpacity="0.2" strokeWidth="0.35" />
      <path d="M1 10 L5.5 2.2" stroke="white" strokeOpacity="0.15" strokeWidth="0.3" />
      <path d="M14.5 2.2 L19 10" stroke="white" strokeOpacity="0.1" strokeWidth="0.3" />

      {/* Inner top edge */}
      <path d="M6.75 4.37 L13.25 4.37" stroke="white" strokeOpacity="0.12" strokeWidth="0.25" />

      {/* Numeral */}
      <text x="10" y="13.5" textAnchor="middle" fontSize="4" fontWeight="800"
        fontFamily="var(--font-inter), Inter, system-ui" fill="white" fillOpacity="0.9">
        VI
      </text>
    </svg>
  );
}

/* ──────────────────────────────────────────────
   RANK DATA + PAGE
   ────────────────────────────────────────────── */

const ranks = [
  {
    rank: 1, name: "Recruit", range: "0 - 14 influence", fee: "8%", perk: "Standard access",
    nameColor: "#E87A3A",
    palette: { base: "#E87A3A", dark: "#C4612A", mid: "#D46E32", hlLight: "#FDF0E8", hlMid: "#E8A87A", hlSoft: "#F5D4BB" },
  },
  {
    rank: 2, name: "Operator", range: "15 - 29 influence", fee: "7%", perk: "Early campaign access",
    nameColor: "#94A3B8",
    palette: { base: "#94A3B8", dark: "#7B8A9E", mid: "#8899AB", hlLight: "#F1F3F6", hlMid: "#B8C4D1", hlSoft: "#D5DCE5" },
  },
  {
    rank: 3, name: "Contender", range: "30 - 49 influence", fee: "6%", perk: "Priority review queue",
    nameColor: "#22C55E",
    palette: { base: "#F59E0B", dark: "#D08509", mid: "#E2920A", hlLight: "#FEF6E4", hlMid: "#F5C85C", hlSoft: "#FAE2A0" },
  },
  {
    rank: 4, name: "Challenger", range: "50 - 69 influence", fee: "5%", perk: "Featured in brand search",
    nameColor: "#3B82F6",
    palette: { base: "#3B82F6", dark: "#2563D0", mid: "#3073E3", hlLight: "#EBF2FE", hlMid: "#7AACF9", hlSoft: "#BAD4FC" },
  },
  {
    rank: 5, name: "Elite", range: "70 - 84 influence", fee: "4%", perk: "VIP campaigns + faster payouts",
    nameColor: "#A855F7",
    palette: { base: "#A855F7", dark: "#8E3DD2", mid: "#9B49E5", hlLight: "#F5EAFE", hlMid: "#C98EFA", hlSoft: "#DFB8FC" },
  },
  {
    rank: 6, name: "Legend", range: "85+ influence", fee: "3%", perk: "All perks + exclusive drops",
    nameColor: "#2DD4BF",
    palette: { base: "#1CC1CA", dark: "#18A4AC", mid: "#2FADB4", hlLight: "#E4F8F9", hlMid: "#76D9DF", hlSoft: "#CFF2F4" },
  },
];

const BadgeComponents = [
  DiamondBadge,
  ShieldBadge,
  HollowStarBadge,
  FilledStarBadge,
  CrownedStarBadge,
  HexCrestBadge,
];

export default function RanksPage() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 p-8">
      {ranks.map((r, i) => {
        const Badge = BadgeComponents[i];
        const id = `rank-${r.rank}`;
        return (
          <div
            key={r.rank}
            className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.03] px-6 py-5"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center">
                <Badge id={id} p={r.palette} />
              </div>
              <div>
                <div className="text-[15px] font-bold" style={{ color: r.nameColor }}>
                  {r.name}
                </div>
                <div className="text-sm text-white/40">{r.range}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-right">
              <span className="text-[15px] font-bold text-green-400">{r.fee} fee</span>
              <span className="text-sm text-white/50">{r.perk}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
