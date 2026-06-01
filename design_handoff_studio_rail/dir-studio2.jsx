// ─────────────────────────────────────────────────────────────────────────
// DIRECTION A2 — "STUDIO + COLLAPSIBLE RAIL"
// Same Studio visual language (Geist, cool neutrals, multi-hue skill palette,
// hairline structure, one shadow tier) — but the top nav becomes a left rail
// that holds Practice Areas permanently and collapses to a 68px icon strip.
// Default = expanded. Toggle the «» button to see the collapsed state.
// ─────────────────────────────────────────────────────────────────────────

const RAIL_W = 248;
const RAIL_W_MIN = 68;

function StRailItem({ icon, label, active, collapsed, badge }) {
  const Ic = Icons[icon];
  return (
    <a title={collapsed ? label : undefined} style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: collapsed ? "10px 0" : "9px 11px", justifyContent: collapsed ? "center" : "flex-start",
      borderRadius: 9, fontSize: 14, fontWeight: active ? 650 : 500,
      color: active ? ST.ink : ST.muted, background: active ? ST.sunken : "transparent",
      cursor: "pointer", position: "relative", whiteSpace: "nowrap", overflow: "hidden",
    }}>
      <span style={{ flex: "0 0 auto", display: "flex", position: "relative" }}>
        <Ic size={19} stroke={active ? ST.brand : ST.soft} />
        {badge && <span style={{ position: "absolute", top: -2, right: -3, width: 7, height: 7, borderRadius: 999, background: "#c8493b", border: "2px solid " + ST.surface }} />}
      </span>
      {!collapsed && <span style={{ flex: 1 }}>{label}</span>}
    </a>
  );
}

function StRail({ active = "Home", collapsed, onToggle }) {
  const nav = [["Home", "Home"], ["Browse", "Grid"], ["My Learning", "Book"], ["Updates", "Bell", true]];
  return (
    <div style={{
      width: collapsed ? RAIL_W_MIN : RAIL_W, flex: `0 0 ${collapsed ? RAIL_W_MIN : RAIL_W}px`,
      background: ST.surface, borderRight: `1px solid ${ST.line}`,
      display: "flex", flexDirection: "column", minHeight: "100%",
      padding: collapsed ? "20px 12px" : "20px 16px",
      transition: "width .22s cubic-bezier(.4,0,.2,1), flex-basis .22s cubic-bezier(.4,0,.2,1), padding .22s",
      position: "sticky", top: 0, height: "100%",
    }}>
      {/* Brand */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "flex-start", gap: 9, padding: collapsed ? "2px 0 18px" : "2px 6px 18px", marginBottom: 4 }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: ST.ink, display: "flex", alignItems: "center", justifyContent: "center", flex: "0 0 auto" }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3v18" /><path d="M7 8h10" /><path d="M7 8 4 15a3 3 0 0 0 6 0z" /><path d="M17 8l-3 7a3 3 0 0 0 6 0z" />
          </svg>
        </div>
        {!collapsed && <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em", color: ST.ink }}>LACE</div>}
      </div>

      {/* Search */}
      {collapsed ? (
        <button title="Search · ⌘K" style={{ width: 44, height: 40, margin: "0 auto 16px", borderRadius: 9, border: `1px solid ${ST.line}`, background: ST.page, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <Icons.Search size={18} stroke={ST.soft} />
        </button>
      ) : (
        <div style={{ display: "flex", alignItems: "center", gap: 9, background: ST.page, border: `1px solid ${ST.line}`, borderRadius: 9, padding: "9px 12px", marginBottom: 16 }}>
          <Icons.Search size={16} stroke={ST.soft} />
          <span style={{ flex: 1, color: ST.soft, fontSize: 13.5 }}>Search…</span>
          <StChip mono bg={ST.sunken} color={ST.soft}>⌘K</StChip>
        </div>
      )}

      {/* Primary nav */}
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {nav.map(([label, icon, badge]) => (
          <StRailItem key={label} icon={icon} label={label} active={label === active} collapsed={collapsed} badge={badge} />
        ))}
      </div>

      {/* Practice areas — the reason the rail exists */}
      <div style={{ marginTop: 26 }}>
        {!collapsed && <div style={{ fontFamily: ST.mono, fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: ST.soft, padding: "0 11px", marginBottom: 12 }}>Practice areas</div>}
        {collapsed && <div style={{ height: 1, background: ST.lineSoft, margin: "4px 6px 14px" }} />}
        <div style={{ display: "flex", flexDirection: "column", gap: collapsed ? 6 : 2 }}>
          {AREAS.map((a, i) => {
            const h = stHue(i);
            return (
              <a key={a.id} title={collapsed ? `${a.name} · ${a.modules}` : undefined} style={{
                display: "flex", alignItems: "center", gap: 11,
                padding: collapsed ? "7px 0" : "7px 11px", justifyContent: collapsed ? "center" : "flex-start",
                borderRadius: 8, fontSize: 13.5, color: ST.muted, cursor: "pointer", whiteSpace: "nowrap", overflow: "hidden",
              }}>
                <span style={{ width: 9, height: 9, borderRadius: 3, background: h.solid, flex: "0 0 auto" }} />
                {!collapsed && <><span style={{ flex: 1 }}>{a.name}</span><span style={{ fontSize: 12, color: ST.soft }}>{a.modules}</span></>}
              </a>
            );
          })}
        </div>
      </div>

      {/* Footer: collapse toggle + user */}
      <div style={{ marginTop: "auto", paddingTop: 16, borderTop: `1px solid ${ST.lineSoft}` }}>
        <button onClick={onToggle} title={collapsed ? "Expand" : "Collapse"} style={{
          display: "flex", alignItems: "center", gap: 11, width: "100%",
          padding: collapsed ? "9px 0" : "9px 11px", justifyContent: collapsed ? "center" : "flex-start",
          borderRadius: 8, border: "none", background: "transparent", color: ST.soft,
          fontFamily: ST.font, fontSize: 13.5, fontWeight: 500, cursor: "pointer", marginBottom: 6,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ transform: collapsed ? "rotate(180deg)" : "none", transition: "transform .22s", flex: "0 0 auto" }}>
            <path d="M15 6l-6 6 6 6" />
          </svg>
          {!collapsed && <span>Collapse</span>}
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: collapsed ? "4px 0" : "4px 7px", justifyContent: collapsed ? "center" : "flex-start" }}>
          <div style={{ width: 32, height: 32, borderRadius: 999, background: ST.brand, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12.5, fontWeight: 650, flex: "0 0 auto" }}>{USER.initials}</div>
          {!collapsed && <div style={{ lineHeight: 1.3, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: ST.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{USER.name}</div>
            <div style={{ fontSize: 11.5, color: ST.soft, whiteSpace: "nowrap" }}>{USER.title}</div>
          </div>}
        </div>
      </div>
    </div>
  );
}

// Slim content-area header — keeps bell/avatar reachable without a full top nav
function StContentBar({ onToggle }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 40px", borderBottom: `1px solid ${ST.line}`, background: "rgba(255,255,255,.85)", backdropFilter: "blur(10px)", position: "sticky", top: 0, zIndex: 20 }}>
      <div style={{ fontFamily: ST.mono, fontSize: 11.5, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: ST.soft }}>Mass. legal aid · continuing education</div>
      <div style={{ flex: 1 }} />
      <button style={{ width: 38, height: 38, borderRadius: 9, border: `1px solid ${ST.line}`, background: ST.surface, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative" }}>
        <Icons.Bell size={18} stroke={ST.muted} />
        <span style={{ position: "absolute", top: 8, right: 9, width: 7, height: 7, borderRadius: 999, background: "#c8493b", border: "2px solid #fff" }} />
      </button>
    </div>
  );
}

// ── HOME · DESKTOP (collapsible rail) ──────────────────────────────────────
function StudioRailHome() {
  const [collapsed, setCollapsed] = React.useState(false);
  const cont = MODULES.find(m => m.progress > 0 && m.progress < 100);
  return (
    <div style={{ fontFamily: ST.font, background: ST.page, minHeight: "100%", color: ST.ink, display: "flex", alignItems: "stretch" }}>
      <style>{`.st-tile:hover{border-color:${ST.lineSoft};box-shadow:${ST.shadow};transform:translateY(-2px)}`}</style>
      <StRail active="Home" collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <StContentBar />
        {/* Hero */}
        <div style={{ padding: "44px 40px 36px", maxWidth: 1120, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 36, alignItems: "center" }}>
            <div>
              <h1 style={{ margin: "0 0 16px", fontSize: 44, lineHeight: 1.06, fontWeight: 720, letterSpacing: "-0.035em", color: ST.ink, textWrap: "balance" }}>Build the skill the case needs.</h1>
              <p style={{ margin: "0 0 24px", fontSize: 17, lineHeight: 1.55, color: ST.muted, maxWidth: 500 }}>Short, practical modules for Massachusetts advocates — searchable, current with the law, and built to finish between calls.</p>
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
        <div style={{ padding: "28px 40px", maxWidth: 1120, margin: "0 auto" }}>
          <StSectionHead kicker="Start with what you do" title="Browse by skill" action="All skills" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>{SKILLS.map((s, i) => <React.Fragment key={s.id}>{StSkillTile(s, i)}</React.Fragment>)}</div>
        </div>
        {/* Updates + paths */}
        <div style={{ padding: "28px 40px 56px", maxWidth: 1120, margin: "0 auto", display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 36 }}>
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
    </div>
  );
}

// A pre-collapsed instance so the canvas shows the icon-strip state side-by-side
function StudioRailHomeCollapsed() {
  const cont = MODULES.find(m => m.progress > 0 && m.progress < 100);
  const [collapsed, setCollapsed] = React.useState(true);
  return (
    <div style={{ fontFamily: ST.font, background: ST.page, minHeight: "100%", color: ST.ink, display: "flex", alignItems: "stretch" }}>
      <style>{`.st-tile:hover{border-color:${ST.lineSoft};box-shadow:${ST.shadow};transform:translateY(-2px)}`}</style>
      <StRail active="Home" collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <StContentBar />
        <div style={{ padding: "44px 48px 36px", maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 36, alignItems: "center" }}>
            <div>
              <h1 style={{ margin: "0 0 16px", fontSize: 44, lineHeight: 1.06, fontWeight: 720, letterSpacing: "-0.035em", color: ST.ink, textWrap: "balance" }}>Build the skill the case needs.</h1>
              <p style={{ margin: "0 0 24px", fontSize: 17, lineHeight: 1.55, color: ST.muted, maxWidth: 520 }}>Short, practical modules for Massachusetts advocates — searchable, current with the law, and built to finish between calls.</p>
              <StSearch big />
            </div>
            {cont && <StContinueCard {...cont} />}
          </div>
          <div style={{ marginTop: 44 }}>
            <StSectionHead kicker="Start with what you do" title="Browse by skill" action="All skills" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>{SKILLS.slice(0, 4).map((s, i) => <React.Fragment key={s.id}>{StSkillTile(s, i)}</React.Fragment>)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { StudioRailHome, StudioRailHomeCollapsed });
