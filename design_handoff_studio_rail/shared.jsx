// Shared data + atoms across all 3 polish directions for LACE Learning Hub
// Microlearning-focused: short modules, fast search, "law changed" urgency.

// ─────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────

const USER = {
  firstName: "Sarah",
  name: "Sarah Chen",
  initials: "SC",
  title: "Staff Attorney",
  unit: "Housing Unit · Boston",
  streak: 12,
  cleEarned: 8.5,
  cleRequired: 12,
};

// Modules — short, microlearning-focused
const MODULES = [
  {
    id: "m-eviction-defense",
    title: "Eviction defense: the first 48 hours",
    skill: "Case triage",
    area: "Housing",
    minutes: 12,
    units: 4,
    updated: "3 days ago",
    updatedTag: "Law changed",
    progress: 60,
    bookmarked: true,
    next: "Service of process checklist",
    blurb: "What to file the moment a notice to quit lands on a client's door.",
  },
  {
    id: "m-upl-screen",
    title: "UPL: when to escalate to an attorney",
    skill: "Ethical judgment",
    area: "Ethics",
    minutes: 8,
    units: 3,
    updated: "2 weeks ago",
    progress: 100,
    next: null,
    blurb: "Six fact patterns advocates see weekly — and the line for each.",
  },
  {
    id: "m-intake",
    title: "Client intake: trauma-informed screening",
    skill: "Client interviewing",
    area: "Practice skills",
    minutes: 15,
    units: 5,
    updated: "1 month ago",
    progress: 28,
    bookmarked: true,
    next: "Disclosure language",
    blurb: "Open the call without re-traumatizing. A short framework.",
  },
  {
    id: "m-snap",
    title: "SNAP overpayments: appeal in 90 days",
    skill: "Drafting & writing",
    area: "Benefits",
    minutes: 10,
    units: 4,
    updated: "Yesterday",
    updatedTag: "New",
    progress: 0,
    next: "The 90-day rule",
    blurb: "DTA changed its notice template. Here's what to look for.",
  },
  {
    id: "m-rai",
    title: "Reasonable accommodation requests",
    skill: "Drafting & writing",
    area: "Housing",
    minutes: 9,
    units: 3,
    updated: "1 week ago",
    progress: 100,
    next: null,
    blurb: "Drafting the letter housing authorities can't refuse to read.",
  },
  {
    id: "m-dv-safety",
    title: "DV safety planning on a 30-min consult",
    skill: "Client counseling",
    area: "Family law",
    minutes: 14,
    units: 4,
    updated: "5 days ago",
    progress: 45,
    next: "Court accompaniment options",
    blurb: "A safety plan you can build inside one phone call.",
  },
  {
    id: "m-ssi-cdr",
    title: "SSI continuing disability reviews",
    skill: "Legal research",
    area: "Benefits",
    minutes: 11,
    units: 4,
    updated: "1 day ago",
    updatedTag: "Updated",
    progress: 0,
    next: null,
    blurb: "The 2026 grid rules and how to read the SSA notice.",
  },
  {
    id: "m-language",
    title: "Working with court interpreters",
    skill: "Courtroom skills",
    area: "Practice skills",
    minutes: 7,
    units: 2,
    updated: "3 weeks ago",
    progress: 0,
    bookmarked: true,
    next: null,
    blurb: "The two requests that change every hearing.",
  },
];

// SKILLS — the primary lens. Legal skills first, substantive law second.
// These are the verbs of legal practice — what an advocate actually DOES.
const SKILLS = [
  { id: "interviewing", name: "Client interviewing", modules: 14, icon: "interview", blurb: "Open the call, build trust fast, gather facts that matter." },
  { id: "drafting", name: "Drafting & writing", modules: 18, icon: "draft", blurb: "Letters, motions, briefs — clear, persuasive, fast." },
  { id: "counseling", name: "Client counseling", modules: 11, icon: "counsel", blurb: "Explain options. Hold space. Plan for safety." },
  { id: "triage", name: "Case triage", modules: 9, icon: "triage", blurb: "Spot the issue, name the deadline, know what to file first." },
  { id: "negotiation", name: "Negotiation", modules: 7, icon: "negotiate", blurb: "Sit across the table — landlords, agencies, opposing counsel." },
  { id: "courtroom", name: "Courtroom skills", modules: 12, icon: "court", blurb: "Hearings, witnesses, interpreters, judicial demeanor." },
  { id: "ethics", name: "Ethical judgment", modules: 8, icon: "ethics", blurb: "UPL, conflicts, confidentiality — the daily calls." },
  { id: "research", name: "Legal research", modules: 10, icon: "research", blurb: "Find the statute, the regulation, the analogous case — quickly." },
];

// Practice areas — substantive law, secondary lens
const AREAS = [
  { id: "housing", name: "Housing", modules: 18, color: "#b88a2d" },
  { id: "benefits", name: "Public Benefits", modules: 14, color: "#6f927b" },
  { id: "family", name: "Family Law", modules: 11, color: "#b76545" },
  { id: "ethics", name: "Ethics & UPL", modules: 7, color: "#7a6a8f" },
  { id: "skills", name: "Practice Skills", modules: 22, color: "#4a6e7a" },
  { id: "immigration", name: "Immigration", modules: 9, color: "#a87238" },
];

// Recent law changes / updates
const UPDATES = [
  {
    id: "u1",
    title: "MA eviction record-sealing expanded",
    area: "Housing",
    when: "3 days ago",
    severity: "high",
    body: "Chapter 167 amendments take effect immediately. Defaults from before 2024 are now sealable on motion.",
    moduleId: "m-eviction-defense",
  },
  {
    id: "u2",
    title: "SNAP overpayment notice template revised",
    area: "Benefits",
    when: "Yesterday",
    severity: "med",
    body: "DTA replaced the 90-day clock language. Old form references no longer match.",
    moduleId: "m-snap",
  },
  {
    id: "u3",
    title: "SSA grid rule update (2026)",
    area: "Benefits",
    when: "1 day ago",
    severity: "med",
    body: "Age categories shifted; new vocational rules apply to all CDRs filed after April 1.",
    moduleId: "m-ssi-cdr",
  },
];

// Paths (curated routes)
const PATHS = [
  { id: "p-housing-core", title: "Housing core competency", modules: 6, hours: 1.8, learners: 412, area: "Housing" },
  { id: "p-new-advocate", title: "New advocate onboarding", modules: 9, hours: 2.4, learners: 1240, area: "Practice skills" },
  { id: "p-benefits-fast", title: "Benefits triage in 90 minutes", modules: 7, hours: 1.5, learners: 308, area: "Benefits" },
];

// Activity for streak heatmap (12-week look back)
const ACTIVITY = (() => {
  const arr = [];
  const seed = [0,2,1,0,3,1,2,0,1,2,3,0,1,4,2,3,1,0,2,3,1,2,0,3,1,2,3,1,4,2,1,2,3,1,2,0,1,3,2,1,2,3,4,2,3,1,0,2,1,3,2,4,1,2,3,2,1,3,2,4,1,2,3,4,2,3,2,1,2,3,2,4,1,3,2,4,3,2,1,3,2,3,4,2];
  for (let i = 0; i < 84; i++) arr.push(seed[i % seed.length]);
  return arr;
})();

// Quick suggestions for search
const QUICK_SEARCHES = [
  "notice to quit",
  "UPL",
  "SNAP appeal",
  "709 motion",
  "RAFT application",
  "DV restraining order",
];

// Search index — keyword → matching modules + areas + updates
function searchAll(query) {
  if (!query || !query.trim()) {
    return { modules: [], updates: [], areas: [], paths: [], empty: true };
  }
  const q = query.toLowerCase().trim();
  const modules = MODULES.filter(m =>
    m.title.toLowerCase().includes(q) ||
    m.area.toLowerCase().includes(q) ||
    m.blurb.toLowerCase().includes(q)
  );
  const updates = UPDATES.filter(u =>
    u.title.toLowerCase().includes(q) ||
    u.body.toLowerCase().includes(q) ||
    u.area.toLowerCase().includes(q)
  );
  const areas = AREAS.filter(a => a.name.toLowerCase().includes(q));
  const paths = PATHS.filter(p => p.title.toLowerCase().includes(q));
  return { modules, updates, areas, paths, empty: false };
}

// ─────────────────────────────────────────────────────────────────────────
// ICONS — minimal hand-drawn line set, custom feel (no off-the-shelf vibe)
// ─────────────────────────────────────────────────────────────────────────

const sw = 1.6;
function I({ d, size = 18, fill = "none", stroke = "currentColor", className = "", children }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill={fill} stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {d ? <path d={d} /> : children}
    </svg>
  );
}

const Icons = {
  Search: (p) => (
    <I {...p}><circle cx="11" cy="11" r="6.4" /><path d="m20 20-3.7-3.7" /></I>
  ),
  Arrow: (p) => <I {...p}><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></I>,
  ArrowUp: (p) => <I {...p}><path d="M12 19V5" /><path d="m6 11 6-6 6 6" /></I>,
  Play: (p) => <I {...p}><path d="m8 5 11 7-11 7z" /></I>,
  Bookmark: (p) => <I {...p}><path d="M6 4h12v17l-6-4-6 4z" /></I>,
  BookmarkFilled: (p) => <I fill="currentColor" stroke="currentColor" {...p}><path d="M6 4h12v17l-6-4-6 4z" /></I>,
  Bell: (p) => <I {...p}><path d="M6 9a6 6 0 1 1 12 0c0 6 3 7 3 7H3s3-1 3-7" /><path d="M10 20a2 2 0 0 0 4 0" /></I>,
  Spark: (p) => <I {...p}><path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" /></I>,
  Clock: (p) => <I {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></I>,
  Flame: (p) => <I {...p}><path d="M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4-.5 2 .5 3 2 3 1-3-1-5 1-9" /></I>,
  Check: (p) => <I {...p}><path d="m5 12 4 4L19 6" /></I>,
  Cmd: (p) => <I {...p}><path d="M9 6a2 2 0 1 0-2 2h2zm0 0v10m0 0a2 2 0 1 0 2-2H9zm0 0h6m0 0V6m0 0a2 2 0 1 1 2 2h-2zm0 10a2 2 0 1 1-2-2h2z" /></I>,
  Filter: (p) => <I {...p}><path d="M4 6h16" /><path d="M7 12h10" /><path d="M10 18h4" /></I>,
  Path: (p) => <I {...p}><circle cx="5" cy="18" r="1.6" /><circle cx="12" cy="6" r="1.6" /><circle cx="19" cy="18" r="1.6" /><path d="m6.6 16.4 4-8.6" /><path d="m13.4 7.8 4 8.6" /></I>,
  Grid: (p) => <I {...p}><rect x="3" y="3" width="7" height="7" rx="1.2" /><rect x="14" y="3" width="7" height="7" rx="1.2" /><rect x="3" y="14" width="7" height="7" rx="1.2" /><rect x="14" y="14" width="7" height="7" rx="1.2" /></I>,
  Home: (p) => <I {...p}><path d="m3 11 9-8 9 8" /><path d="M5 10v10h14V10" /></I>,
  Book: (p) => <I {...p}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5z" /></I>,
  TrendUp: (p) => <I {...p}><path d="M3 17 9 11l4 4 8-9" /><path d="M14 6h7v7" /></I>,
  Alert: (p) => <I {...p}><path d="m12 3 10 18H2z" /><path d="M12 10v4" /><path d="M12 18h.01" /></I>,
  Dot: (p) => <I fill="currentColor" stroke="none" {...p}><circle cx="12" cy="12" r="4" /></I>,
  Plus: (p) => <I {...p}><path d="M12 5v14" /><path d="M5 12h14" /></I>,
  Cert: (p) => <I {...p}><path d="M6 4h12v12H6z" /><path d="m8 17 4 3 4-3" /><circle cx="12" cy="10" r="2.5" /></I>,
  Pause: (p) => <I {...p}><path d="M9 5v14" /><path d="M15 5v14" /></I>,
  Train: (p) => <I {...p}><rect x="5" y="3" width="14" height="14" rx="3" /><path d="M5 11h14" /><circle cx="9" cy="14" r="1" /><circle cx="15" cy="14" r="1" /><path d="m8 20-2 2" /><path d="m16 20 2 2" /></I>,
  Menu: (p) => <I {...p}><path d="M4 7h16M4 12h16M4 17h10" /></I>,
};

// Skill glyphs — distinct, hand-drawn-feel line icons per skill.
// kind = SKILLS[i].icon
function SkillGlyph({ kind, color = "currentColor", size = 28, strokeWidth = 1.4 }) {
  const props = {
    width: size, height: size, viewBox: "0 0 32 32", fill: "none",
    stroke: color, strokeWidth, strokeLinecap: "round", strokeLinejoin: "round",
  };
  switch (kind) {
    case "interview": // two speech bubbles overlapping
      return (
        <svg {...props}>
          <path d="M5 7h12v9H11l-3 3v-3H5z" />
          <path d="M15 13h12v9h-3l3 3v-3H15z" />
        </svg>
      );
    case "draft": // pen drawing a line
      return (
        <svg {...props}>
          <path d="M4 26h24" />
          <path d="m6 22 13-13 3 3-13 13z" />
          <path d="m17 11 3 3" />
          <path d="m4 26 4-1" />
        </svg>
      );
    case "counsel": // hands clasped / heart in hand
      return (
        <svg {...props}>
          <path d="M5 19c0-4 3-7 7-7s7 3 7 7" />
          <path d="M19 15c4-1 7 1 7 5" />
          <path d="M12 12c0-2 1-3 3-3s3 1 3 3-2 4-3 4-3-2-3-4z" />
          <path d="M3 23h26" />
        </svg>
      );
    case "triage": // branching arrow
      return (
        <svg {...props}>
          <path d="M16 4v8" />
          <path d="M16 12c-2 0-4 2-4 4v8" />
          <path d="M16 12c2 0 4 2 4 4v8" />
          <circle cx="16" cy="4" r="2" />
          <circle cx="12" cy="26" r="2" />
          <circle cx="20" cy="26" r="2" />
        </svg>
      );
    case "negotiate": // two arrows facing
      return (
        <svg {...props}>
          <path d="M5 12h12" /><path d="m13 8 4 4-4 4" />
          <path d="M27 20H15" /><path d="m19 24-4-4 4-4" />
        </svg>
      );
    case "court": // columns / building
      return (
        <svg {...props}>
          <path d="M4 12h24" />
          <path d="m16 4 12 8H4z" />
          <path d="M8 14v10M14 14v10M18 14v10M24 14v10" />
          <path d="M3 26h26" />
        </svg>
      );
    case "ethics": // scales
      return (
        <svg {...props}>
          <path d="M16 4v22" />
          <path d="M9 26h14" />
          <path d="M6 10h20" />
          <path d="M6 10 3 18a3 3 0 0 0 6 0z" />
          <path d="M26 10 23 18a3 3 0 0 0 6 0z" />
        </svg>
      );
    case "research": // magnifier on document
      return (
        <svg {...props}>
          <path d="M6 4h14v22H6z" />
          <path d="M10 9h7M10 14h7M10 19h4" />
          <circle cx="22" cy="22" r="4" />
          <path d="m25 25 3 3" />
        </svg>
      );
    default:
      return <svg {...props}><circle cx="16" cy="16" r="6" /></svg>;
  }
}
function Pill({ children, color = "#1f1d19", bg = "rgba(31,29,25,0.06)", border, mono = true, size = 11, weight = 600 }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "3px 8px", borderRadius: 999,
      fontFamily: mono ? "'IBM Plex Mono', monospace" : "inherit",
      fontSize: size, fontWeight: weight, letterSpacing: mono ? "0.04em" : 0,
      textTransform: mono ? "uppercase" : "none",
      color, background: bg,
      border: border || "none",
      lineHeight: 1,
      whiteSpace: "nowrap",
    }}>{children}</span>
  );
}

function ProgressLine({ value, color = "#b88a2d", height = 4, bg = "#e6dccb", radius = 999 }) {
  return (
    <div style={{ height, background: bg, borderRadius: radius, overflow: "hidden" }}>
      <div style={{ width: `${Math.max(0, Math.min(100, value))}%`, height: "100%", background: color, borderRadius: radius }} />
    </div>
  );
}

function ProgressRing({ value, size = 56, stroke = 5, color = "#b88a2d", track = "#e6dccb", children }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const v = Math.max(0, Math.min(100, value));
  return (
    <div style={{ position: "relative", width: size, height: size, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} stroke={track} strokeWidth={stroke} fill="none" />
        <circle cx={size/2} cy={size/2} r={r} stroke={color} strokeWidth={stroke} fill="none" strokeDasharray={c} strokeDashoffset={c - (v/100)*c} strokeLinecap="round" />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>{children}</div>
    </div>
  );
}

// Streak heatmap (12 weeks × 7 days)
function StreakHeatmap({ data = ACTIVITY, cell = 11, gap = 3, color = "#b88a2d", track = "#ece3d2" }) {
  const weeks = 12;
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${weeks}, ${cell}px)`, gridAutoFlow: "column", gridTemplateRows: `repeat(7, ${cell}px)`, gap }}>
      {data.slice(0, weeks*7).map((v, i) => {
        const op = v === 0 ? 0 : v === 1 ? 0.35 : v === 2 ? 0.6 : v === 3 ? 0.85 : 1;
        return (
          <div key={i} style={{
            width: cell, height: cell, borderRadius: 2,
            background: v === 0 ? track : color, opacity: v === 0 ? 1 : op
          }} />
        );
      })}
    </div>
  );
}

// Mock decorative chart line for "this week"
function Sparkline({ values = [2,4,3,6,4,7,5,8], color = "#b88a2d", w = 120, h = 32 }) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = h - ((v - min) / Math.max(1, max - min)) * h;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

Object.assign(window, {
  USER, MODULES, SKILLS, AREAS, UPDATES, PATHS, ACTIVITY, QUICK_SEARCHES,
  searchAll, Icons, SkillGlyph, Pill, ProgressLine, ProgressRing, StreakHeatmap, Sparkline,
});
