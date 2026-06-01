// ─────────────────────────────────────────────────────────────────────────
// DIRECTION A — "STUDIO"
// Google-Skills-grade clean. Systematic neutrals, a disciplined multi-color
// skill palette, strict 8px grid, hairline structure, ONE shadow tier.
// The "obviously designed by a real product team" anchor. Font: Geist.
// ─────────────────────────────────────────────────────────────────────────

const ST = {
  font: "'Geist', system-ui, sans-serif",
  mono: "'IBM Plex Mono', monospace",
  page: "#f5f6f8",
  surface: "#ffffff",
  sunken: "#eef0f4",
  ink: "#14161b",
  muted: "#565c69",
  soft: "#8b909d",
  line: "#e4e7ed",
  lineSoft: "#edeff3",
  brand: "#1c3fb0",      // deep, confident — text/links
  brandFill: "#2a5bff",  // interactive fill
  brandTint: "#eaf0ff",
  shadow: "0 1px 2px rgba(20,22,27,.04), 0 6px 18px rgba(20,22,27,.06)",
};

// Disciplined 8-hue skill palette — identical S/L feel, so it reads systematic.
const ST_HUES = [
  { solid: "#2a5bff", tint: "#e9f0ff" }, // interviewing — blue
  { solid: "#7a4fe0", tint: "#efeafd" }, // drafting — violet
  { solid: "#d24d83", tint: "#fce9f1" }, // counseling — pink
  { solid: "#c8791b", tint: "#fbf0dc" }, // triage — amber
  { solid: "#179a72", tint: "#e2f4ed" }, // negotiation — green
  { solid: "#3a8ec9", tint: "#e7f3fb" }, // courtroom — sky
  { solid: "#5563d6", tint: "#ebedfc" }, // ethics — indigo
  { solid: "#bb573b", tint: "#fbe8e2" }, // research — rust
];
function stHue(i) { return ST_HUES[i % ST_HUES.length]; }

// ── Atoms ──────────────────────────────────────────────────────────────────
function StWordmark({ size = 20 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
      <div style={{
        width: 30, height: 30, borderRadius: 8, background: ST.ink,
        display: "flex", alignItems: "center", justifyContent: "center", flex: "0 0 auto",
      }}>
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3v18" /><path d="M7 8h10" /><path d="M7 8 4 15a3 3 0 0 0 6 0z" /><path d="M17 8l-3 7a3 3 0 0 0 6 0z" />
        </svg>
      </div>
      <div style={{ lineHeight: 1 }}>
        <div style={{ fontSize: size, fontWeight: 700, letterSpacing: "-0.02em", color: ST.ink }}>LACE</div>
      </div>
    </div>
  );
}

function StChip({ children, color = ST.muted, bg = ST.sunken, mono = true }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 9px",
      borderRadius: 7, fontFamily: mono ? ST.mono : ST.font,
      fontSize: 11, fontWeight: 600, letterSpacing: mono ? "0.03em" : 0,
      textTransform: mono ? "uppercase" : "none", color, background: bg, lineHeight: 1,
    }}>{children}</span>
  );
}

function StBtn({ children, primary, onClick, full }) {
  return (
    <button onClick={onClick} style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7,
      padding: "10px 16px", borderRadius: 9, border: primary ? "none" : `1px solid ${ST.line}`,
      background: primary ? ST.brandFill : ST.surface, color: primary ? "#fff" : ST.ink,
      fontFamily: ST.font, fontSize: 14, fontWeight: 600, cursor: "pointer",
      width: full ? "100%" : "auto", boxShadow: primary ? "0 1px 2px rgba(42,91,255,.25)" : "none",
    }}>{children}</button>
  );
}

function StSearch({ big }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 11,
      background: ST.surface, border: `1px solid ${ST.line}`, borderRadius: 12,
      padding: big ? "15px 18px" : "11px 14px", boxShadow: ST.shadow,
    }}>
      <Icons.Search size={big ? 22 : 19} stroke={ST.soft} />
      <span style={{ flex: 1, color: ST.soft, fontSize: big ? 17 : 15, fontWeight: 450 }}>
        Search skills, statutes, “notice to quit”…
      </span>
      <StChip mono bg={ST.sunken} color={ST.soft}>⌘K</StChip>
    </div>
  );
}

function StSectionHead({ kicker, title, action }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 18 }}>
      <div>
        {kicker && <div style={{ fontFamily: ST.mono, fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: ST.soft, marginBottom: 8 }}>{kicker}</div>}
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em", color: ST.ink }}>{title}</h2>
      </div>
      {action && <a style={{ display: "inline-flex", alignItems: "center", gap: 5, color: ST.brand, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>{action}<Icons.Arrow size={15} /></a>}
    </div>
  );
}

// ── Cards ────────────────────────────────────────────────────────────────
function StContinueCard(m) {
  return (
    <div style={{ background: ST.surface, border: `1px solid ${ST.line}`, borderRadius: 14, padding: 22, boxShadow: ST.shadow }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <StChip mono bg={ST.brandTint} color={ST.brand}>Continue</StChip>
        <span style={{ fontFamily: ST.mono, fontSize: 12, color: ST.soft }}>{m.progress}%</span>
      </div>
      <h3 style={{ margin: "0 0 6px", fontSize: 19, fontWeight: 700, letterSpacing: "-0.01em", color: ST.ink, lineHeight: 1.25 }}>{m.title}</h3>
      <p style={{ margin: "0 0 16px", fontSize: 13.5, color: ST.muted, lineHeight: 1.55 }}>Up next · {m.next}</p>
      <ProgressLine value={m.progress} color={ST.brandFill} bg={ST.sunken} height={6} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16 }}>
        <span style={{ fontSize: 13, color: ST.soft }}>{m.minutes} min left</span>
        <StBtn primary><Icons.Play size={15} />Resume</StBtn>
      </div>
    </div>
  );
}

function StSkillTile(s, i) {
  const h = stHue(i);
  return (
    <div className="st-tile" style={{ background: ST.surface, border: `1px solid ${ST.line}`, borderRadius: 14, padding: 20, cursor: "pointer", transition: "border-color .15s, box-shadow .15s, transform .15s" }}>
      <div style={{ width: 46, height: 46, borderRadius: 12, background: h.tint, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
        <SkillGlyph kind={s.icon} color={h.solid} size={26} strokeWidth={1.6} />
      </div>
      <h3 style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 650, letterSpacing: "-0.01em", color: ST.ink }}>{s.name}</h3>
      <p style={{ margin: "0 0 14px", fontSize: 13, color: ST.muted, lineHeight: 1.5 }}>{s.blurb}</p>
      <div style={{ fontFamily: ST.mono, fontSize: 11, fontWeight: 600, color: ST.soft, letterSpacing: "0.03em" }}>{s.modules} MODULES</div>
    </div>
  );
}

function StUpdateRow(u, i) {
  const sevColor = u.severity === "high" ? "#c8493b" : "#c8791b";
  const sevBg = u.severity === "high" ? "#fbe9e6" : "#fbf0dc";
  return (
    <div style={{ display: "flex", gap: 16, alignItems: "flex-start", padding: "18px 0", borderTop: i === 0 ? "none" : `1px solid ${ST.lineSoft}` }}>
      <div style={{ width: 9, height: 9, borderRadius: 999, background: sevColor, marginTop: 6, flex: "0 0 auto" }} />
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 6 }}>
          <StChip mono color={sevColor} bg={sevBg}>{u.severity === "high" ? "Law changed" : "Updated"}</StChip>
          <span style={{ fontSize: 12.5, color: ST.soft }}>{u.area} · {u.when}</span>
        </div>
        <h3 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 650, color: ST.ink, letterSpacing: "-0.01em" }}>{u.title}</h3>
        <p style={{ margin: 0, fontSize: 13.5, color: ST.muted, lineHeight: 1.55 }}>{u.body}</p>
      </div>
      <a style={{ color: ST.brand, fontSize: 13.5, fontWeight: 600, whiteSpace: "nowrap", cursor: "pointer", marginTop: 2 }}>Review →</a>
    </div>
  );
}

function StPathCard(p, i) {
  const h = stHue(i + 2);
  return (
    <div style={{ background: ST.surface, border: `1px solid ${ST.line}`, borderRadius: 14, overflow: "hidden", cursor: "pointer" }}>
      <div style={{ height: 6, background: h.solid }} />
      <div style={{ padding: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}>
          <Icons.Path size={16} stroke={h.solid} />
          <span style={{ fontFamily: ST.mono, fontSize: 11, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", color: ST.soft }}>Guided path</span>
        </div>
        <h3 style={{ margin: "0 0 14px", fontSize: 17, fontWeight: 700, letterSpacing: "-0.01em", color: ST.ink, lineHeight: 1.3 }}>{p.title}</h3>
        <div style={{ display: "flex", gap: 16, fontSize: 13, color: ST.muted }}>
          <span>{p.modules} modules</span><span>{p.hours}h</span><span>{p.learners.toLocaleString()} learners</span>
        </div>
      </div>
    </div>
  );
}

// ── Top nav ──────────────────────────────────────────────────────────────
function StNav({ active = "Home" }) {
  const items = ["Home", "Browse", "My Learning", "Updates"];
  return (
    <div style={{ background: "rgba(255,255,255,.85)", backdropFilter: "blur(10px)", borderBottom: `1px solid ${ST.line}`, padding: "14px 40px", display: "flex", alignItems: "center", gap: 28, position: "sticky", top: 0, zIndex: 30 }}>
      <StWordmark />
      <nav style={{ display: "flex", gap: 4, marginLeft: 8 }}>
        {items.map(it => (
          <a key={it} style={{ padding: "7px 13px", borderRadius: 8, fontSize: 14, fontWeight: it === active ? 650 : 500, color: it === active ? ST.ink : ST.muted, background: it === active ? ST.sunken : "transparent", cursor: "pointer" }}>{it}</a>
        ))}
      </nav>
      <div style={{ flex: 1 }} />
      <div style={{ width: 240, display: "flex", alignItems: "center", gap: 9, background: ST.page, border: `1px solid ${ST.line}`, borderRadius: 9, padding: "8px 12px" }}>
        <Icons.Search size={16} stroke={ST.soft} /><span style={{ color: ST.soft, fontSize: 13.5 }}>Search</span>
      </div>
      <button style={{ width: 38, height: 38, borderRadius: 9, border: `1px solid ${ST.line}`, background: ST.surface, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative" }}>
        <Icons.Bell size={18} stroke={ST.muted} />
        <span style={{ position: "absolute", top: 8, right: 9, width: 7, height: 7, borderRadius: 999, background: "#c8493b", border: "2px solid #fff" }} />
      </button>
      <div style={{ width: 38, height: 38, borderRadius: 999, background: ST.brand, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 650, letterSpacing: "0.02em" }}>{USER.initials}</div>
    </div>
  );
}

// ── HOME · DESKTOP ─────────────────────────────────────────────────────────
function StudioHomeDesktop() {
  const cont = MODULES.find(m => m.progress > 0 && m.progress < 100);
  return (
    <div style={{ fontFamily: ST.font, background: ST.page, minHeight: "100%", color: ST.ink }}>
      <style>{`.st-tile:hover{border-color:${ST.lineSoft};box-shadow:${ST.shadow};transform:translateY(-2px)}`}</style>
      <StNav active="Home" />
      {/* Hero */}
      <div style={{ padding: "52px 40px 40px", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.35fr 1fr", gap: 40, alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: ST.mono, fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: ST.brand, marginBottom: 18 }}>Mass. legal aid · continuing education</div>
            <h1 style={{ margin: "0 0 18px", fontSize: 48, lineHeight: 1.05, fontWeight: 720, letterSpacing: "-0.035em", color: ST.ink, textWrap: "balance" }}>Build the skill the case needs.</h1>
            <p style={{ margin: "0 0 26px", fontSize: 17.5, lineHeight: 1.55, color: ST.muted, maxWidth: 520 }}>Short, practical modules for Massachusetts advocates — searchable, current with the law, and built to finish between calls.</p>
            <StSearch big />
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
              {QUICK_SEARCHES.map(q => (
                <span key={q} style={{ padding: "7px 13px", borderRadius: 999, border: `1px solid ${ST.line}`, background: ST.surface, fontSize: 13, color: ST.muted, cursor: "pointer" }}>{q}</span>
              ))}
            </div>
          </div>
          {cont && <StContinueCard {...cont} />}
        </div>
      </div>
      {/* Browse by skill */}
      <div style={{ padding: "32px 40px", maxWidth: 1280, margin: "0 auto" }}>
        <StSectionHead kicker="Start with what you do" title="Browse by skill" action="All skills" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>{SKILLS.map((s, i) => <React.Fragment key={s.id}>{StSkillTile(s, i)}</React.Fragment>)}</div>
      </div>
      {/* Two-col: updates + paths */}
      <div style={{ padding: "32px 40px 64px", maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 40 }}>
        <div>
          <StSectionHead kicker="The law is alive" title="Changed this week" action="All updates" />
          <div style={{ background: ST.surface, border: `1px solid ${ST.line}`, borderRadius: 14, padding: "4px 22px 12px", boxShadow: ST.shadow }}>
            {UPDATES.map((u, i) => <React.Fragment key={u.id}>{StUpdateRow(u, i)}</React.Fragment>)}
          </div>
        </div>
        <div>
          <StSectionHead kicker="Go deeper" title="Guided paths" />
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {PATHS.map((p, i) => <React.Fragment key={p.id}>{StPathCard(p, i)}</React.Fragment>)}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── MY LEARNING · DESKTOP ─────────────────────────────────────────────────
function StStatTile({ label, value, sub, children }) {
  return (
    <div style={{ background: ST.surface, border: `1px solid ${ST.line}`, borderRadius: 14, padding: 20, boxShadow: ST.shadow }}>
      <div style={{ fontFamily: ST.mono, fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: ST.soft, marginBottom: 14 }}>{label}</div>
      {children || (<><div style={{ fontSize: 30, fontWeight: 720, letterSpacing: "-0.02em", color: ST.ink, lineHeight: 1 }}>{value}</div><div style={{ fontSize: 13, color: ST.muted, marginTop: 8 }}>{sub}</div></>)}
    </div>
  );
}

function StModuleProgressRow(m, i) {
  const h = stHue(i);
  const done = m.progress === 100;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "16px 0", borderTop: i === 0 ? "none" : `1px solid ${ST.lineSoft}` }}>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: h.tint, display: "flex", alignItems: "center", justifyContent: "center", flex: "0 0 auto" }}>
        {done ? <Icons.Check size={20} stroke={"#179a72"} /> : <SkillGlyph kind={SKILLS.find(s => s.name === m.skill)?.icon || "research"} color={h.solid} size={22} />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h3 style={{ margin: "0 0 7px", fontSize: 15.5, fontWeight: 650, color: ST.ink, letterSpacing: "-0.01em" }}>{m.title}</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1, maxWidth: 280 }}><ProgressLine value={m.progress} color={done ? "#179a72" : h.solid} bg={ST.sunken} height={5} /></div>
          <span style={{ fontFamily: ST.mono, fontSize: 11.5, color: ST.soft }}>{m.progress}%</span>
        </div>
      </div>
      <div style={{ textAlign: "right", flex: "0 0 auto" }}>
        <div style={{ fontSize: 13, color: ST.muted }}>{m.skill}</div>
        <div style={{ fontSize: 12, color: ST.soft, marginTop: 3 }}>{m.minutes} min</div>
      </div>
      <StBtn>{done ? "Review" : "Resume"}</StBtn>
    </div>
  );
}

function StudioDashboardDesktop() {
  const inProgress = MODULES.filter(m => m.progress > 0 && m.progress < 100);
  const completed = MODULES.filter(m => m.progress === 100);
  const clePct = Math.round((USER.cleEarned / USER.cleRequired) * 100);
  return (
    <div style={{ fontFamily: ST.font, background: ST.page, minHeight: "100%", color: ST.ink }}>
      <StNav active="My Learning" />
      <div style={{ padding: "40px 40px 64px", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontFamily: ST.mono, fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: ST.soft, marginBottom: 8 }}>{USER.title} · {USER.unit}</div>
          <h1 style={{ margin: 0, fontSize: 34, fontWeight: 720, letterSpacing: "-0.03em", color: ST.ink }}>Welcome back, {USER.firstName}.</h1>
        </div>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 40 }}>
          <StStatTile label="CLE this year">
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <ProgressRing value={clePct} size={62} stroke={6} color={ST.brandFill} track={ST.sunken}>
                <span style={{ fontSize: 14, fontWeight: 700, color: ST.ink }}>{clePct}%</span>
              </ProgressRing>
              <div><div style={{ fontSize: 22, fontWeight: 720, color: ST.ink, letterSpacing: "-0.02em" }}>{USER.cleEarned}<span style={{ fontSize: 14, color: ST.soft, fontWeight: 500 }}> / {USER.cleRequired} hrs</span></div><div style={{ fontSize: 12.5, color: ST.muted, marginTop: 4 }}>3.5 hrs to requirement</div></div>
            </div>
          </StStatTile>
          <StStatTile label="Current streak">
            <div style={{ fontSize: 30, fontWeight: 720, letterSpacing: "-0.02em", color: ST.ink, lineHeight: 1 }}>{USER.streak} days</div>
            <div style={{ marginTop: 14 }}><StreakHeatmap cell={8} gap={2.5} color={ST.brandFill} track={ST.sunken} /></div>
          </StStatTile>
          <StStatTile label="Completed" value={completed.length} sub="modules this quarter" />
          <StStatTile label="In progress" value={inProgress.length} sub={`${inProgress.reduce((a, m) => a + m.minutes, 0)} min remaining`} />
        </div>
        {/* In progress */}
        <div style={{ marginBottom: 40 }}>
          <StSectionHead kicker="Pick up where you left off" title="In progress" action="View all" />
          <div style={{ background: ST.surface, border: `1px solid ${ST.line}`, borderRadius: 14, padding: "4px 22px 12px", boxShadow: ST.shadow }}>
            {inProgress.map((m, i) => <React.Fragment key={m.id}>{StModuleProgressRow(m, i)}</React.Fragment>)}
          </div>
        </div>
        {/* Bookmarked + completed */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
          <div>
            <StSectionHead kicker="Saved for later" title="Bookmarked" />
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {MODULES.filter(m => m.bookmarked).slice(0, 3).map((m, i) => {
                const h = stHue(i + 1);
                return (
                  <div key={m.id} style={{ background: ST.surface, border: `1px solid ${ST.line}`, borderRadius: 12, padding: 16, display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 8, height: 40, borderRadius: 999, background: h.solid, flex: "0 0 auto" }} />
                    <div style={{ flex: 1 }}><h3 style={{ margin: "0 0 4px", fontSize: 14.5, fontWeight: 650, color: ST.ink }}>{m.title}</h3><div style={{ fontSize: 12.5, color: ST.soft }}>{m.area} · {m.minutes} min</div></div>
                    <Icons.BookmarkFilled size={18} stroke={h.solid} />
                  </div>
                );
              })}
            </div>
          </div>
          <div>
            <StSectionHead kicker="Done" title="Completed" />
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {completed.map((m) => (
                <div key={m.id} style={{ background: ST.surface, border: `1px solid ${ST.line}`, borderRadius: 12, padding: 16, display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 999, background: "#e2f4ed", display: "flex", alignItems: "center", justifyContent: "center", flex: "0 0 auto" }}><Icons.Check size={18} stroke="#179a72" /></div>
                  <div style={{ flex: 1 }}><h3 style={{ margin: "0 0 4px", fontSize: 14.5, fontWeight: 650, color: ST.ink }}>{m.title}</h3><div style={{ fontSize: 12.5, color: ST.soft }}>{m.area} · completed</div></div>
                  <a style={{ fontSize: 13, fontWeight: 600, color: ST.brand, cursor: "pointer" }}>Certificate</a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── HOME · MOBILE ──────────────────────────────────────────────────────────
function StudioHomeMobile() {
  const cont = MODULES.find(m => m.progress > 0 && m.progress < 100);
  return (
    <div style={{ fontFamily: ST.font, background: ST.page, minHeight: "100%", color: ST.ink }}>
      <div style={{ background: "rgba(255,255,255,.9)", backdropFilter: "blur(10px)", borderBottom: `1px solid ${ST.line}`, padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 30 }}>
        <StWordmark size={18} />
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Icons.Bell size={20} stroke={ST.muted} />
          <div style={{ width: 32, height: 32, borderRadius: 999, background: ST.brand, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 650 }}>{USER.initials}</div>
        </div>
      </div>
      <div style={{ padding: "26px 18px 16px" }}>
        <div style={{ fontFamily: ST.mono, fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: ST.brand, marginBottom: 12 }}>Mass. legal aid · CE</div>
        <h1 style={{ margin: "0 0 16px", fontSize: 30, lineHeight: 1.08, fontWeight: 720, letterSpacing: "-0.03em" }}>Build the skill the case needs.</h1>
        <StSearch />
        <div style={{ display: "flex", gap: 8, marginTop: 12, overflowX: "auto" }}>
          {QUICK_SEARCHES.slice(0, 4).map(q => <span key={q} style={{ padding: "7px 12px", borderRadius: 999, border: `1px solid ${ST.line}`, background: ST.surface, fontSize: 12.5, color: ST.muted, whiteSpace: "nowrap" }}>{q}</span>)}
        </div>
      </div>
      {cont && <div style={{ padding: "8px 18px 16px" }}><StContinueCard {...cont} /></div>}
      <div style={{ padding: "12px 18px 24px" }}>
        <h2 style={{ margin: "0 0 14px", fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em" }}>Browse by skill</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {SKILLS.slice(0, 6).map((s, i) => {
            const h = stHue(i);
            return (
              <div key={s.id} style={{ background: ST.surface, border: `1px solid ${ST.line}`, borderRadius: 12, padding: 14 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: h.tint, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}><SkillGlyph kind={s.icon} color={h.solid} size={22} /></div>
                <h3 style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 650, color: ST.ink, lineHeight: 1.2 }}>{s.name}</h3>
                <div style={{ fontFamily: ST.mono, fontSize: 10.5, color: ST.soft, fontWeight: 600 }}>{s.modules} MODULES</div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ padding: "0 18px 32px" }}>
        <h2 style={{ margin: "0 0 14px", fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em" }}>Changed this week</h2>
        <div style={{ background: ST.surface, border: `1px solid ${ST.line}`, borderRadius: 14, padding: "2px 16px 8px" }}>
          {UPDATES.slice(0, 2).map((u, i) => <React.Fragment key={u.id}>{StUpdateRow(u, i)}</React.Fragment>)}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  StudioHomeDesktop, StudioDashboardDesktop, StudioHomeMobile,
  // atoms reused by the collapsible-rail variant (Studio v2)
  ST, stHue, StChip, StBtn, StSearch, StSectionHead, StWordmark,
  StContinueCard, StSkillTile, StUpdateRow, StPathCard,
});
