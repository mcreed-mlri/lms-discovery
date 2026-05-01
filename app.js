(function () {
  'use strict';

  // ── Constants ────────────────────────────────────────────────
  var DATA         = window.LMS_DATA;
  var BAND_COLORS  = ['#154377','#259ace','#1a5490','#0e7490','#1d4ed8','#2d6a4f'];
  var LEVEL_COLORS = {
    Foundations:  { bg: '#dbeafe', text: '#1d4ed8' },
    Intermediate: { bg: '#fef3c7', text: '#92400e' },
    Advanced:     { bg: '#fee2e2', text: '#991b1b' },
  };
  var TYPE_LABELS = { path: 'Path', course: 'Course', module: 'Module' };
  var TYPE_COLORS = {
    path:   { bg: '#fef3c7', text: '#92400e' },
    course: { bg: '#dbeafe', text: '#1d4ed8' },
    module: { bg: '#f3e8ff', text: '#6b21a8' },
  };

  // ── State ────────────────────────────────────────────────────
  var state = {
    query:            '',
    typeFilter:       'all',
    areaFilter:       'All Areas',
    viewMode:         'grid',
    bannerDismissed:  false,
    heroFocused:      false,
  };

  // ── SVG Helpers ──────────────────────────────────────────────
  function svgIcon(type, size) {
    size = size || 14;
    var paths = {
      path:   '<circle cx="5" cy="12" r="2"/><circle cx="19" cy="5" r="2"/><circle cx="19" cy="19" r="2"/><path d="M7 12h4l4-5"/><path d="M11 12l4 5"/>',
      course: '<path d="M22 10v6M2 10l10-5 10 5-10 5z"/>',
      module: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
      clock:  '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
      course_crumb: '<path d="M22 10v6M2 10l10-5 10 5-10 5z"/>',
      extlink: '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>',
    };
    var p = paths[type] || '';
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' + p + '</svg>';
  }

  // ── Utility ──────────────────────────────────────────────────
  function esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function formatDate(str) {
    return new Date(str).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function getFiltered() {
    var items = DATA.items;
    if (state.typeFilter !== 'all') {
      items = items.filter(function (i) { return i.type === state.typeFilter; });
    }
    if (state.areaFilter !== 'All Areas') {
      items = items.filter(function (i) {
        return i.practiceArea === state.areaFilter || i.practiceArea === 'All Practice Areas';
      });
    }
    if (state.query.trim()) {
      var q = state.query.trim().toLowerCase();
      items = items.filter(function (i) {
        return (
          i.title.toLowerCase().includes(q) ||
          (i.description && i.description.toLowerCase().includes(q)) ||
          (i.tags && i.tags.some(function (t) { return t.toLowerCase().includes(q); })) ||
          (i.parentCourse && i.parentCourse.toLowerCase().includes(q)) ||
          (i.practiceArea && i.practiceArea.toLowerCase().includes(q))
        );
      });
    }
    return items;
  }

  function getSuggestions() {
    if (!state.query.trim() || state.query.length < 2) return [];
    var q = state.query.trim().toLowerCase();
    return DATA.items.filter(function (i) {
      return (
        i.title.toLowerCase().includes(q) ||
        (i.tags && i.tags.some(function (t) { return t.toLowerCase().startsWith(q); }))
      );
    }).slice(0, 6);
  }

  // ── Render: What's New Banner ────────────────────────────────
  function renderBanner() {
    var banner = document.getElementById('whats-new-banner');
    if (!banner) return;
    if (state.bannerDismissed) { banner.hidden = true; return; }

    var bannerItems = DATA.items
      .filter(function (i) { return i.updated || i.isNew; })
      .sort(function (a, b) { return new Date(b.updated || 0) - new Date(a.updated || 0); })
      .slice(0, 3);
    if (!bannerItems.length) { banner.hidden = true; return; }

    var rows = bannerItems.map(function (item) {
      var tc = TYPE_COLORS[item.type] || TYPE_COLORS.course;
      var badgeLabel = item.isNew ? 'NEW' : 'UPDATED';
      return (
        '<button class="wn-row" data-id="' + esc(item.id) + '">' +
          '<div class="wn-row-icon" style="background:' + tc.bg + ';color:' + tc.text + '">' + svgIcon(item.type, 15) + '</div>' +
          '<div class="wn-row-body">' +
            '<span class="wn-row-title">' + esc(item.title) + '</span>' +
            '<span class="wn-row-meta">' + esc(item.duration) + ' · ' + esc(item.practiceArea) + '</span>' +
          '</div>' +
          '<span class="wn-row-new-badge">' + badgeLabel + '</span>' +
          '<svg class="wn-row-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>' +
        '</button>'
      );
    }).join('');

    banner.innerHTML =
      '<div class="wn-inner">' +
        '<div class="wn-header">' +
          '<span class="wn-badge">What\'s New</span>' +
          '<span class="wn-subtitle">Recently updated</span>' +
          '<button class="wn-dismiss" id="wn-dismiss-btn" aria-label="Dismiss">' +
            '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
          '</button>' +
        '</div>' +
        '<div class="wn-rows">' + rows + '</div>' +
      '</div>';

    banner.hidden = false;
  }

  // ── Render: Filter Bar ───────────────────────────────────────
  function renderFilterBar(count) {
    var bar = document.getElementById('filter-bar');
    if (!bar) return;

    var typeMap = { All: 'all', Paths: 'path', Courses: 'course', Modules: 'module' };
    var typeBtns = ['All', 'Paths', 'Courses', 'Modules'].map(function (label) {
      var val = typeMap[label];
      var active = state.typeFilter === val;
      return '<button class="ftab' + (active ? ' ftab--active' : '') + '" data-type="' + val + '">' + label + '</button>';
    }).join('');

    var areaOpts = ['All Areas'].concat(DATA.practiceAreas).map(function (a) {
      return '<option value="' + esc(a) + '"' + (state.areaFilter === a ? ' selected' : '') + '>' + esc(a) + '</option>';
    }).join('');

    var gridActive = state.viewMode === 'grid';
    var listActive = state.viewMode === 'list';

    bar.innerHTML =
      '<div class="fb-inner">' +
        '<div class="fb-types">' + typeBtns + '</div>' +
        '<select id="area-select" class="fb-select">' + areaOpts + '</select>' +
        '<span class="fb-count"><strong>' + count + '</strong> items</span>' +
        '<div class="fb-viewtoggle">' +
          '<button class="vbtn' + (gridActive ? ' vbtn--active' : '') + '" data-view="grid" aria-label="Grid view">' +
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>' +
          '</button>' +
          '<button class="vbtn' + (listActive ? ' vbtn--active' : '') + '" data-view="list" aria-label="List view">' +
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>' +
          '</button>' +
        '</div>' +
      '</div>';
  }

  // ── Render: Single Card (grid) ───────────────────────────────
  function renderCard(item, index) {
    var band  = BAND_COLORS[index % BAND_COLORS.length];
    var level = item.level ? LEVEL_COLORS[item.level] : null;

    var levelBadge = level
      ? '<span class="level-badge" style="background:' + level.bg + ';color:' + level.text + '">' + esc(item.level) + '</span>'
      : '';

    var countBadge = item.modules
      ? '<span class="meta-count">' + item.modules + ' modules</span>'
      : item.courses
        ? '<span class="meta-count">' + item.courses + ' courses</span>'
        : '';

    var crumb = item.parentCourse
      ? '<div class="card-crumb">' + svgIcon('course_crumb', 10) + '<span>' + esc(item.parentCourse) + '</span></div>'
      : '';

    var updBadge = item.isNew
      ? '<span class="card-updated-badge">Updated</span>'
      : '';

    return (
      '<article class="card" data-id="' + esc(item.id) + '" style="animation-delay:' + (index * 30) + 'ms">' +
        '<div class="card-band" style="background:' + band + '">' +
          '<div class="card-band-texture"></div>' +
          '<span class="card-type-pill">' + svgIcon(item.type, 12) + TYPE_LABELS[item.type] + '</span>' +
          updBadge +
        '</div>' +
        '<div class="card-body">' +
          crumb +
          '<h3 class="card-title">' + esc(item.title) + '</h3>' +
          '<p class="card-desc">' + esc(item.description) + '</p>' +
          '<div class="card-meta">' +
            '<span class="meta-dur">' +
              '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>' +
              esc(item.duration) +
            '</span>' +
            levelBadge +
            countBadge +
          '</div>' +
        '</div>' +
        '<div class="card-foot">' +
          '<span class="card-area">' + esc(item.practiceArea) + '</span>' +
          '<button class="card-open-btn">Open →</button>' +
        '</div>' +
      '</article>'
    );
  }

  // ── Render: Single Row (list) ────────────────────────────────
  function renderRow(item, index) {
    var band      = BAND_COLORS[index % BAND_COLORS.length];
    var level     = item.level ? LEVEL_COLORS[item.level] : null;
    var typeColor = TYPE_COLORS[item.type] || TYPE_COLORS.course;

    var levelBadge = level
      ? '<span class="level-badge" style="background:' + level.bg + ';color:' + level.text + '">' + esc(item.level) + '</span>'
      : '';

    var crumb = item.parentCourse
      ? '<div class="row-crumb">↳ ' + esc(item.parentCourse) + '</div>'
      : '';

    var updBadge = item.isNew
      ? '<span class="row-updated-badge">Updated</span>'
      : '';

    return (
      '<article class="content-row" data-id="' + esc(item.id) + '" style="animation-delay:' + (index * 20) + 'ms">' +
        '<div class="row-bar" style="background:' + band + '"></div>' +
        '<div class="row-icon" style="background:' + band + '22;color:' + band + '">' + svgIcon(item.type, 15) + '</div>' +
        '<div class="row-body">' +
          crumb +
          '<h3 class="row-title">' + esc(item.title) + '</h3>' +
          '<p class="row-desc">' + esc(item.description) + '</p>' +
        '</div>' +
        '<div class="row-meta">' +
          '<span class="row-type-badge" style="background:' + typeColor.bg + ';color:' + typeColor.text + '">' + TYPE_LABELS[item.type] + '</span>' +
          levelBadge +
          '<span class="meta-dur">' +
            '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>' +
            esc(item.duration) +
          '</span>' +
          updBadge +
          '<button class="card-open-btn">Open →</button>' +
        '</div>' +
      '</article>'
    );
  }

  // ── Render: All Results ──────────────────────────────────────
  function renderResults() {
    var container = document.getElementById('results-container');
    if (!container) return;

    var filtered = getFiltered();
    renderFilterBar(filtered.length);
    updateHeroCount(filtered.length);

    var paths   = filtered.filter(function (i) { return i.type === 'path'; });
    var courses = filtered.filter(function (i) { return i.type === 'course'; });
    var modules = filtered.filter(function (i) { return i.type === 'module'; });

    var groups = [
      { label: 'Learning Paths', type: 'path',   items: paths,   color: '#92400e', bg: '#fef3c7' },
      { label: 'Courses',        type: 'course',  items: courses, color: '#1d4ed8', bg: '#dbeafe' },
      { label: 'Modules',        type: 'module',  items: modules, color: '#6b21a8', bg: '#f3e8ff' },
    ].filter(function (g) { return g.items.length > 0; });

    if (groups.length === 0) {
      container.innerHTML =
        '<div class="empty-state">' +
          '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>' +
          '<p class="empty-title">No results found</p>' +
          '<p class="empty-sub">Try different keywords or clear your filters</p>' +
        '</div>';
      return;
    }

    var globalIndex = 0;
    var html = '';

    groups.forEach(function (group) {
      var startIndex = globalIndex;
      var itemsHtml = group.items.map(function (item, i) {
        var idx = startIndex + i;
        globalIndex++;
        return state.viewMode === 'grid' ? renderCard(item, idx) : renderRow(item, idx);
      }).join('');

      var gridClass = state.viewMode === 'grid' ? 'items-grid' : 'items-list';

      html +=
        '<section class="content-group">' +
          '<div class="group-header">' +
            '<span class="group-icon" style="background:' + group.bg + ';color:' + group.color + '">' + svgIcon(group.type, 14) + '</span>' +
            '<h2 class="group-title">' + group.label + '</h2>' +
            '<span class="group-count">' + group.items.length + '</span>' +
            '<button class="group-see-all" data-type="' + group.type + '">See all →</button>' +
          '</div>' +
          '<div class="' + gridClass + '">' + itemsHtml + '</div>' +
        '</section>';
    });

    container.innerHTML = html;
  }

  // ── Hero Count ───────────────────────────────────────────────
  function updateHeroCount(count) {
    var el = document.getElementById('hero-count');
    if (!el) return;
    if (state.query.trim()) {
      el.innerHTML = '<strong>' + count + '</strong> results for "<em>' + esc(state.query) + '</em>"';
      el.style.opacity = '1';
    } else {
      el.textContent = '';
      el.style.opacity = '0';
    }
  }

  // ── Autocomplete ─────────────────────────────────────────────
  function renderAutocomplete() {
    var dropdown = document.getElementById('autocomplete-dropdown');
    if (!dropdown) return;

    if (!state.heroFocused) { dropdown.hidden = true; return; }

    var suggestions = getSuggestions();
    if (!suggestions.length) { dropdown.hidden = true; return; }

    dropdown.innerHTML = suggestions.map(function (s, i) {
      var tc = TYPE_COLORS[s.type] || TYPE_COLORS.course;
      var crumb = s.parentCourse ? '<span class="ac-crumb">in ' + esc(s.parentCourse) + '</span>' : '';
      var border = i < suggestions.length - 1 ? 'border-bottom:1px solid rgba(0,0,0,0.05)' : '';
      return (
        '<button class="ac-item" data-title="' + esc(s.title) + '" style="' + border + '">' +
          '<span class="ac-icon" style="background:' + tc.bg + ';color:' + tc.text + '">' + svgIcon(s.type, 13) + '</span>' +
          '<span class="ac-text"><span class="ac-title">' + esc(s.title) + '</span>' + crumb + '</span>' +
          '<span class="ac-type-badge" style="background:' + tc.bg + ';color:' + tc.text + '">' + TYPE_LABELS[s.type] + '</span>' +
        '</button>'
      );
    }).join('');

    dropdown.hidden = false;
  }

  // ── Modal ────────────────────────────────────────────────────
  function openModal(item) {
    var modal = document.getElementById('content-modal');
    var panel = document.getElementById('modal-panel');
    if (!modal || !panel) return;

    var band      = BAND_COLORS[0];
    var level     = item.level ? LEVEL_COLORS[item.level] : null;

    var levelChip = level
      ? '<span class="chip" style="background:' + level.bg + ';color:' + level.text + ';font-weight:700;text-transform:uppercase;font-size:11px;letter-spacing:.05em">' + esc(item.level) + '</span>'
      : '';

    var crumb = item.parentCourse
      ? '<div class="modal-crumb">' +
          svgIcon('course_crumb', 11) +
          ' Part of: <strong>' + esc(item.parentCourse) + '</strong>' +
        '</div>'
      : '';

    var countChip = item.modules
      ? '<span class="chip">' + item.modules + ' modules</span>'
      : item.courses
        ? '<span class="chip">' + item.courses + ' courses</span>'
        : '';

    var tags = (item.tags && item.tags.length)
      ? '<div class="modal-tags">' +
          '<div class="modal-tags-label">Topics</div>' +
          '<div class="modal-tags-row">' +
            item.tags.map(function (t) { return '<span class="tag">' + esc(t) + '</span>'; }).join('') +
          '</div>' +
        '</div>'
      : '';

    var updBadge = item.isNew
      ? '<span class="modal-updated-badge">Recently Updated</span>'
      : '';

    panel.innerHTML =
      '<div class="modal-band" style="background:' + band + '">' +
        '<div class="modal-band-texture"></div>' +
        '<span class="modal-type-pill">' + svgIcon(item.type, 13) + ' ' + TYPE_LABELS[item.type] + '</span>' +
        '<button class="modal-close" id="modal-close-btn" aria-label="Close">' +
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
        '</button>' +
      '</div>' +
      '<div class="modal-body">' +
        crumb +
        '<h2 class="modal-title">' + esc(item.title) + '</h2>' +
        '<p class="modal-desc">' + esc(item.description) + '</p>' +
        '<div class="modal-chips">' +
          '<span class="chip">' +
            '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>' +
            esc(item.duration) +
          '</span>' +
          levelChip +
          '<span class="chip">' + esc(item.practiceArea) + '</span>' +
          countChip +
        '</div>' +
        tags +
        '<div class="modal-updated">' +
          '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>' +
          'Last updated ' + formatDate(item.updated) +
          updBadge +
        '</div>' +
        '<div class="modal-actions">' +
          '<a href="' + esc(item.brightspaceUrl || '#') + '" class="modal-cta-btn">' +
            'Open in Brightspace ' +
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>' +
          '</a>' +
          '<button class="modal-close-btn" id="modal-close-text-btn">Close</button>' +
        '</div>' +
      '</div>';

    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    closeMobileSearch();
  }

  function closeModal() {
    var modal = document.getElementById('content-modal');
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = '';
  }

  // ── Search sync helper ───────────────────────────────────────
  function setQuery(val) {
    state.query = val;
    var heroInput    = document.getElementById('hero-search-input');
    var topbarInput  = document.getElementById('topbar-search-input');
    var mobileInput  = document.getElementById('topbar-mobile-input');
    var clearBtn     = document.getElementById('hero-clear-btn');
    if (heroInput)   heroInput.value   = val;
    if (topbarInput) topbarInput.value = val;
    if (mobileInput) mobileInput.value = val;
    if (clearBtn)    clearBtn.hidden   = !val;
    renderResults();
  }

  function openMobileSearch() {
    var overlay = document.getElementById('topbar-mobile-search');
    var input   = document.getElementById('topbar-mobile-input');
    if (!overlay) return;
    overlay.hidden = false;
    if (input) setTimeout(function () { input.focus(); }, 50);
  }

  function closeMobileSearch() {
    var overlay = document.getElementById('topbar-mobile-search');
    if (overlay) overlay.hidden = true;
  }

  // ── Init ─────────────────────────────────────────────────────
  function init() {
    renderBanner();
    renderResults();

    // Hero search input
    var heroInput = document.getElementById('hero-search-input');
    if (heroInput) {
      heroInput.addEventListener('input', function () {
        setQuery(heroInput.value);
        renderAutocomplete();
      });
      heroInput.addEventListener('focus', function () {
        state.heroFocused = true;
        renderAutocomplete();
      });
      heroInput.addEventListener('blur', function () {
        setTimeout(function () {
          state.heroFocused = false;
          renderAutocomplete();
        }, 200);
      });
    }

    // Mobile search toggle
    var searchToggle = document.getElementById('topbar-search-toggle');
    if (searchToggle) {
      searchToggle.addEventListener('click', openMobileSearch);
    }

    // Mobile search input + cancel
    var mobileSearchInput = document.getElementById('topbar-mobile-input');
    if (mobileSearchInput) {
      mobileSearchInput.addEventListener('input', function () {
        setQuery(mobileSearchInput.value);
      });
    }
    document.addEventListener('click', function (e) {
      if (e.target.closest('#topbar-mobile-cancel')) {
        closeMobileSearch();
      }
    });

    // Topbar search input
    var topbarInput = document.getElementById('topbar-search-input');
    if (topbarInput) {
      topbarInput.addEventListener('input', function () {
        setQuery(topbarInput.value);
      });
      topbarInput.addEventListener('focus', function () {
        var pill = document.getElementById('topbar-search-pill');
        if (pill) pill.style.boxShadow = '0 4px 24px rgba(21,67,119,0.18)';
      });
      topbarInput.addEventListener('blur', function () {
        var pill = document.getElementById('topbar-search-pill');
        if (pill) pill.style.boxShadow = '';
      });
    }

    // ── Click delegation ────────────────────────────────────────
    document.addEventListener('click', function (e) {
      // Banner dismiss
      if (e.target.closest('#wn-dismiss-btn')) {
        state.bannerDismissed = true;
        var banner = document.getElementById('whats-new-banner');
        if (banner) {
          banner.style.opacity    = '0';
          banner.style.transform  = 'translateY(-4px)';
          banner.style.transition = 'opacity 180ms, transform 180ms';
          setTimeout(function () { banner.hidden = true; }, 180);
        }
        return;
      }

      // What's New row → open modal
      var wnRow = e.target.closest('.wn-row');
      if (wnRow) {
        var id   = wnRow.dataset.id;
        var item = DATA.items.find(function (i) { return i.id === id; });
        if (item) openModal(item);
        return;
      }

      // Group "See all" → filter by type
      var seeAll = e.target.closest('.group-see-all');
      if (seeAll) {
        state.typeFilter = seeAll.dataset.type;
        renderResults();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      // Filter type tab
      var ftab = e.target.closest('.ftab');
      if (ftab) {
        state.typeFilter = ftab.dataset.type;
        renderResults();
        return;
      }

      // View toggle
      var vbtn = e.target.closest('.vbtn');
      if (vbtn) {
        state.viewMode = vbtn.dataset.view;
        renderResults();
        return;
      }

      // Card / row → open modal
      var card = e.target.closest('.card, .content-row');
      if (card) {
        var cid   = card.dataset.id;
        var citem = DATA.items.find(function (i) { return i.id === cid; });
        if (citem) openModal(citem);
        return;
      }

      // Mobile bottom nav tabs
      var mbnTab = e.target.closest('.mbn-tab');
      if (mbnTab) {
        var which = mbnTab.dataset.mbn;
        if (which === 'search') {
          openMobileSearch();
        } else if (which === 'home') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          document.querySelectorAll('.mbn-tab').forEach(function (t) { t.classList.remove('mbn-tab--active'); });
          mbnTab.classList.add('mbn-tab--active');
        } else {
          document.querySelectorAll('.mbn-tab').forEach(function (t) { t.classList.remove('mbn-tab--active'); });
          mbnTab.classList.add('mbn-tab--active');
        }
        return;
      }

      // Modal close button
      if (e.target.closest('#modal-close-btn') || e.target.closest('#modal-close-text-btn')) {
        closeModal();
        return;
      }

      // Modal overlay click-outside
      var modal = document.getElementById('content-modal');
      if (modal && e.target === modal) {
        closeModal();
        return;
      }
    });

    // Autocomplete selection (mousedown fires before blur)
    document.addEventListener('mousedown', function (e) {
      var acItem = e.target.closest('.ac-item');
      if (acItem) {
        e.preventDefault();
        setQuery(acItem.dataset.title);
        state.heroFocused = false;
        var dropdown = document.getElementById('autocomplete-dropdown');
        if (dropdown) dropdown.hidden = true;
      }
    });

    // Clear button
    document.addEventListener('click', function (e) {
      if (e.target.closest('#hero-clear-btn')) {
        setQuery('');
        var dropdown = document.getElementById('autocomplete-dropdown');
        if (dropdown) dropdown.hidden = true;
        var hi = document.getElementById('hero-search-input');
        if (hi) hi.focus();
      }
    });

    // Area select
    document.addEventListener('change', function (e) {
      if (e.target.id === 'area-select') {
        state.areaFilter = e.target.value;
        renderResults();
      }
    });

    // Keyboard: Escape + ⌘K
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        var modal = document.getElementById('content-modal');
        if (modal && !modal.hidden) { closeModal(); return; }
        var dropdown = document.getElementById('autocomplete-dropdown');
        if (dropdown && !dropdown.hidden) { dropdown.hidden = true; return; }
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        var hi = document.getElementById('hero-search-input');
        if (hi && hi.offsetParent !== null) {
          hi.focus();
          hi.select();
        } else if (window.innerWidth <= 600) {
          openMobileSearch();
        } else {
          var ti = document.getElementById('topbar-search-input');
          if (ti) { ti.focus(); ti.select(); }
        }
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

}());
