// ═══════════════════════════════════════════════════════════
//  FVMA — Field Visit Monitoring App
//  Application Logic · github.com/tafika-itaye/TFMS
//  © 2026 TechNexus · Blantyre, Malawi
// ═══════════════════════════════════════════════════════════

'use strict';

// ─── State ─────────────────────────────────────────────────
const App = {
  user: null,
  view: 'dashboard',
  visits: [],
  farmers: [],
  users: [],
  activeTimer: null,
  timerSeconds: 0,
  timerInterval: null,
  pendingVisit: null,
  activeWeek: 0,   // 0 = this week
};

// ─── Init ──────────────────────────────────────────────────
function init() {
  const u = safeJSON(sessionStorage.getItem('fvma_user'));
  if (!u) { window.location.href = 'index.html'; return; }
  App.user = u;

  App.visits  = loadLS('fvma_visits',  SEED_VISITS);
  App.farmers = loadLS('fvma_farmers', SEED_FARMERS);
  App.users   = [...DEMO_USERS];

  // Populate UI user info
  qid('userName').textContent = App.user.name;
  qid('userRole').textContent = roleLabel(App.user.role);
  qid('userAvatar').textContent = App.user.avatar;

  const role = ROLES[App.user.role];
  if (role && role.dailyTarget) {
    qid('userTarget').textContent = `Daily target: ${role.dailyTarget} visits`;
    qid('userTarget').style.display = 'block';
  }

  wireNav();
  startClock();
  switchView('dashboard');
}

// ─── Navigation ────────────────────────────────────────────
function wireNav() {
  document.querySelectorAll('[data-view]').forEach(el => {
    el.addEventListener('click', () => switchView(el.dataset.view));
  });
}

function switchView(view) {
  App.view = view;
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('[data-view]').forEach(n => n.classList.toggle('active', n.dataset.view === view));
  const el = qid('view-' + view);
  if (el) el.classList.add('active');

  switch (view) {
    case 'dashboard': renderDashboard(); break;
    case 'my-visits': renderMyVisits();  break;
    case 'log-visit': renderLogVisit();  break;
    case 'team':      renderTeam();      break;
    case 'reports':   renderReports();   break;
  }

  // On mobile, close the sidebar after navigation
  const sidebar = qid('sidebar');
  if (sidebar && window.innerWidth < 900) {
    sidebar.classList.remove('open');
  }
}

// ─── Dashboard ─────────────────────────────────────────────
function renderDashboard() {
  const today = todayStr();
  const myVisits = App.visits.filter(v => v.userId === App.user.id && v.date === today);
  const role     = ROLES[App.user.role] || {};
  const target   = role.dailyTarget || 0;
  const done     = myVisits.length;
  const pct      = target > 0 ? Math.min(100, Math.round((done / target) * 100)) : 100;
  const flagged  = target > 0 && pct < FLAG_THRESHOLD;
  const remaining = Math.max(0, target - done);

  setHTML('dashDone',      done);
  setHTML('dashTarget',    target || '—');
  setHTML('dashRemaining', remaining);
  setHTML('dashPct',       (target > 0 ? pct + '%' : 'N/A'));

  // Ring progress
  const ring = qid('progressRing');
  if (ring) {
    const r = 54; const circ = 2 * Math.PI * r;
    const offset = circ - (pct / 100) * circ;
    ring.style.strokeDasharray  = circ;
    ring.style.strokeDashoffset = offset;
    ring.style.stroke = flagged ? 'var(--danger)' : pct >= 100 ? 'var(--ok)' : 'var(--gold)';
  }

  const card = qid('dashCard');
  if (card) {
    card.className = 'progress-card' + (flagged ? ' flagged' : pct >= 100 ? ' complete' : '');
  }

  setHTML('flagBanner', flagged
    ? `<div class="flag-banner">⚠️ Below target — only ${pct}% completion. ${remaining} visits remaining today.</div>` : '');

  // Today's visits list
  const listEl = qid('dashVisitList');
  if (listEl) {
    if (myVisits.length === 0) {
      listEl.innerHTML = '<div class="empty-state">No visits logged today yet.<br><a onclick="switchView(\'log-visit\')">Log your first visit →</a></div>';
    } else {
      listEl.innerHTML = myVisits.slice().reverse().map(v => {
        const farmer = App.farmers.find(f => f.id === v.farmerId) || {};
        return `<div class="visit-row" onclick="openVisitDetail('${v.id}')">
          <div class="vr-left">
            <div class="vr-name">${farmer.name || v.farmerId}</div>
            <div class="vr-meta">${v.startTime} · ${v.durationMin} min · ${v.topics.slice(0,1).join(', ')}</div>
          </div>
          <div class="vr-right">
            <span class="badge badge-ok">✔ Done</span>
            ${v.hasPhoto ? '<span class="photo-dot" title="Has photo">📷</span>' : ''}
          </div>
        </div>`;
      }).join('');
    }
  }

  // Team summary (admin/manager sees all; others see own region)
  renderTeamSummaryWidget();
}

function renderTeamSummaryWidget() {
  const el = qid('dashTeamSummary');
  if (!el) return;

  const today = todayStr();
  const isAdmin = App.user.role === 'admin';
  const visibleUsers = isAdmin
    ? App.users.filter(u => u.role !== 'admin')
    : App.users.filter(u => u.role !== 'admin' && u.region === App.user.region);

  if (visibleUsers.length === 0) { el.innerHTML = ''; return; }

  el.innerHTML = `
    <div class="widget-title">Team Progress Today</div>
    <div class="summary-table-wrap">
      <table class="summary-table">
        <thead><tr><th>Name</th><th>Role</th><th>Target</th><th>Done</th><th>%</th><th></th></tr></thead>
        <tbody>
          ${visibleUsers.map(u => {
            const role = ROLES[u.role];
            const done = App.visits.filter(v => v.userId === u.id && v.date === today).length;
            const pct  = role.dailyTarget ? Math.round((done / role.dailyTarget) * 100) : 100;
            const flag = role.dailyTarget && pct < FLAG_THRESHOLD;
            const cls  = flag ? 'danger' : pct >= 100 ? 'ok' : 'warn';
            return `<tr class="${flag ? 'row-flag' : ''}">
              <td><span class="av-sm">${u.avatar}</span> ${u.name.split(' ')[0]}</td>
              <td><span class="role-tag role-${u.role}">${role.label}</span></td>
              <td class="mono">${role.dailyTarget || '—'}</td>
              <td class="mono bold">${done}</td>
              <td><span class="pct-tag pct-${cls}">${pct}%</span></td>
              <td>${flag ? '⚠️' : pct >= 100 ? '✅' : ''}</td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>`;
}

// ─── My Visits ─────────────────────────────────────────────
function renderMyVisits() {
  const today  = todayStr();
  const filter = qid('mvDateFilter')?.value || today;
  const visits = App.visits
    .filter(v => v.userId === App.user.id && v.date === filter)
    .sort((a, b) => b.startTime.localeCompare(a.startTime));

  const role   = ROLES[App.user.role] || {};
  const target = role.dailyTarget || 0;
  const done   = App.visits.filter(v => v.userId === App.user.id && v.date === filter).length;
  const pct    = target > 0 ? Math.round((done / target) * 100) : 100;

  setHTML('mvStats', `
    <div class="mv-stat-row">
      <div class="mv-stat"><span class="mv-stat-val bold">${done}</span><span class="mv-stat-lbl">Visits</span></div>
      <div class="mv-stat"><span class="mv-stat-val">${target||'—'}</span><span class="mv-stat-lbl">Target</span></div>
      <div class="mv-stat"><span class="mv-stat-val ${pct<FLAG_THRESHOLD?'danger':pct>=100?'ok':'warn'}">${target?pct+'%':'—'}</span><span class="mv-stat-lbl">% Done</span></div>
      <div class="mv-stat"><span class="mv-stat-val">${visits.reduce((s,v)=>s+v.durationMin,0)} min</span><span class="mv-stat-lbl">Total Time</span></div>
    </div>`);

  const tbody = qid('mvTableBody');
  if (!tbody) return;

  if (visits.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="empty-td">No visits on this date.</td></tr>';
    return;
  }

  tbody.innerHTML = visits.map(v => {
    const farmer = App.farmers.find(f => f.id === v.farmerId) || {};
    return `<tr onclick="openVisitDetail('${v.id}')">
      <td>${v.startTime}</td>
      <td><strong>${farmer.name || v.farmerId}</strong><br><span class="small muted">${farmer.village || ''}</span></td>
      <td>${v.durationMin} min</td>
      <td class="small">${v.topics.join(' · ')}</td>
      <td class="center">${v.hasPhoto ? '📷' : '—'}</td>
      <td class="center">${v.gps?.lat ? `<span class="gps-dot" title="${v.gps.lat.toFixed(4)}, ${v.gps.lng.toFixed(4)}">📍</span>` : '—'}</td>
    </tr>`;
  }).join('');
}

// ─── Log Visit Form ─────────────────────────────────────────
function renderLogVisit() {
  const role = ROLES[App.user.role];
  if (!role || !role.topics.length) {
    setHTML('logVisitContent', '<div class="empty-state">Visit logging is not available for your role.</div>');
    return;
  }

  // Populate farmer select
  const farmerOpts = App.farmers.map(f =>
    `<option value="${f.id}">${f.name} — ${f.village} (${f.district})</option>`
  ).join('');

  // Populate topic checkboxes
  const topicBoxes = role.topics.map((t, i) =>
    `<label class="topic-label"><input type="checkbox" name="topic" value="${t}" id="topic${i}"><span>${t}</span></label>`
  ).join('');

  setHTML('logVisitContent', `
    <div class="log-header">
      <h2>Log Field Visit</h2>
      <div class="log-sub">${role.icon} ${role.label} · Daily target: <strong>${role.dailyTarget}</strong></div>
    </div>

    <div class="visit-timer-card" id="timerCard">
      <div class="timer-label">Visit Timer</div>
      <div class="timer-display" id="timerDisplay">00:00:00</div>
      <div class="timer-btns">
        <button class="btn btn-ok" id="timerStartBtn" onclick="startVisitTimer()">▶ Start Visit</button>
        <button class="btn btn-danger" id="timerStopBtn" onclick="stopVisitTimer()" disabled>⏹ Stop</button>
      </div>
      <div class="timer-hint" id="timerHint">Start the timer when you arrive at the farmer's field.</div>
    </div>

    <form id="visitForm">
      <div class="form-section">
        <div class="form-section-title">Farmer</div>
        <div class="form-group">
          <label class="form-label">Select Farmer *</label>
          <select id="vfFarmer" class="form-input" required>
            <option value="">— Choose farmer —</option>
            ${farmerOpts}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Crop Stage</label>
          <select id="vfStage" class="form-input">
            ${CROP_STAGES.map(s => `<option>${s}</option>`).join('')}
          </select>
        </div>
      </div>

      <div class="form-section">
        <div class="form-section-title">Activities / Topics Covered *</div>
        <div class="topic-grid" id="topicGrid">
          ${topicBoxes}
        </div>
      </div>

      <div class="form-section">
        <div class="form-section-title">GPS Location</div>
        <div class="gps-row">
          <div class="form-group">
            <label class="form-label">Latitude</label>
            <input id="vfLat" class="form-input" type="number" step="0.0001" placeholder="Auto-capture or enter manually" readonly>
          </div>
          <div class="form-group">
            <label class="form-label">Longitude</label>
            <input id="vfLng" class="form-input" type="number" step="0.0001" placeholder="Auto-capture or enter manually" readonly>
          </div>
          <div class="gps-btn-wrap">
            <button type="button" class="btn btn-ghost" onclick="captureGPS()">📍 Capture GPS</button>
          </div>
        </div>
        <div id="gpsStatus" class="gps-status"></div>
      </div>

      <div class="form-section">
        <div class="form-section-title">Notes &amp; Photo</div>
        <div class="form-group">
          <label class="form-label">Field Notes</label>
          <textarea id="vfNotes" class="form-input" rows="3" placeholder="Observations, issues, advice given…"></textarea>
        </div>
        <div class="form-group">
          <label class="form-label">Photo / Attachment</label>
          <div class="photo-upload-area" id="photoArea" onclick="qid('vfPhoto').click()">
            <div class="photo-placeholder" id="photoPlaceholder">📷 Tap to attach photo</div>
            <img id="photoPreview" style="display:none;max-width:100%;border-radius:8px;max-height:200px" alt="preview">
          </div>
          <input id="vfPhoto" type="file" accept="image/*" style="display:none" onchange="previewPhoto(this)">
        </div>
      </div>

      <div class="form-actions-sticky">
        <button type="button" class="btn btn-primary btn-lg" onclick="submitVisit()">✔ Save Visit Record</button>
        <button type="button" class="btn btn-ghost" onclick="switchView('my-visits')">Cancel</button>
      </div>
    </form>`);

  // Try auto-GPS
  setTimeout(captureGPS, 600);
}

function startVisitTimer() {
  if (App.timerInterval) return;
  App.timerSeconds = 0;
  App.activeTimer = Date.now();
  const btn1 = qid('timerStartBtn'), btn2 = qid('timerStopBtn');
  if (btn1) btn1.disabled = true;
  if (btn2) btn2.disabled = false;
  const hint = qid('timerHint');
  if (hint) hint.textContent = 'Timer running… stop when you leave the farmer.';

  App.timerInterval = setInterval(() => {
    App.timerSeconds++;
    const h = String(Math.floor(App.timerSeconds/3600)).padStart(2,'0');
    const m = String(Math.floor((App.timerSeconds%3600)/60)).padStart(2,'0');
    const s = String(App.timerSeconds%60).padStart(2,'0');
    const el = qid('timerDisplay');
    if (el) el.textContent = `${h}:${m}:${s}`;
  }, 1000);
}

function stopVisitTimer() {
  if (!App.timerInterval) return;
  clearInterval(App.timerInterval);
  App.timerInterval = null;
  const mins = Math.max(1, Math.round(App.timerSeconds / 60));
  const btn1 = qid('timerStartBtn'), btn2 = qid('timerStopBtn');
  if (btn1) btn1.disabled = false;
  if (btn2) btn2.disabled = true;
  const hint = qid('timerHint');
  if (hint) hint.textContent = `Visit duration recorded: ${mins} minutes.`;
  App.timerSeconds = mins * 60;  // preserve
}

function captureGPS() {
  const status = qid('gpsStatus');
  if (!navigator.geolocation) {
    // Simulate GPS for demo environments
    simulateGPS(); return;
  }
  if (status) status.innerHTML = '<span class="gps-pending">📍 Acquiring location…</span>';
  navigator.geolocation.getCurrentPosition(
    pos => {
      setVal('vfLat', pos.coords.latitude.toFixed(6));
      setVal('vfLng', pos.coords.longitude.toFixed(6));
      if (status) status.innerHTML = `<span class="gps-ok">✔ Location captured: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}</span>`;
    },
    () => simulateGPS()
  );
}

function simulateGPS() {
  // Demo-mode: pick GPS near farmer's location if selected
  const farmerId = qid('vfFarmer')?.value;
  const farmer = App.farmers.find(f => f.id === farmerId);
  const baseLat = farmer ? farmer.lat : -13.005;
  const baseLng = farmer ? farmer.lng : 33.485;
  const lat = (baseLat + (Math.random()-0.5)*0.01).toFixed(6);
  const lng = (baseLng + (Math.random()-0.5)*0.01).toFixed(6);
  setVal('vfLat', lat);
  setVal('vfLng', lng);
  const status = qid('gpsStatus');
  if (status) status.innerHTML = `<span class="gps-ok">📍 Demo GPS: ${lat}, ${lng}</span>`;
}

function previewPhoto(input) {
  if (!input.files || !input.files[0]) return;
  const reader = new FileReader();
  reader.onload = e => {
    const prev = qid('photoPreview');
    const ph   = qid('photoPlaceholder');
    if (prev) { prev.src = e.target.result; prev.style.display = 'block'; }
    if (ph)   ph.style.display = 'none';
  };
  reader.readAsDataURL(input.files[0]);
}

function submitVisit() {
  const farmerId = qid('vfFarmer')?.value;
  if (!farmerId) { showToast('Please select a farmer.', 'warn'); return; }

  const selectedTopics = [...document.querySelectorAll('input[name="topic"]:checked')].map(cb => cb.value);
  if (selectedTopics.length === 0) { showToast('Select at least one activity topic.', 'warn'); return; }

  const lat = parseFloat(qid('vfLat')?.value) || 0;
  const lng = parseFloat(qid('vfLng')?.value) || 0;
  const notes = qid('vfNotes')?.value.trim() || '';
  const hasPhoto = !!(qid('photoPreview')?.style.display === 'block');
  const photoNote = hasPhoto ? 'Photo attached via FVMA tablet.' : '';
  const durationMin = App.timerSeconds > 0
    ? Math.max(1, Math.round(App.timerSeconds / 60))
    : 20; // default if timer not used

  const now  = new Date();
  const time = now.toTimeString().slice(0,5);
  const id   = `V-${todayStr()}-${App.user.id}-${String(App.visits.filter(v=>v.userId===App.user.id&&v.date===todayStr()).length+1).padStart(3,'0')}`;

  const visit = {
    id, userId: App.user.id, farmerId,
    date: todayStr(), startTime: time, durationMin,
    topics: selectedTopics, notes, gps: { lat, lng },
    trajectory: lat ? [{ lat, lng, t: time }] : [],
    hasPhoto, photoNote, status: 'completed', flagged: false
  };

  App.visits.push(visit);
  saveLS('fvma_visits', App.visits);

  // Reset timer
  if (App.timerInterval) { clearInterval(App.timerInterval); App.timerInterval = null; }
  App.timerSeconds = 0;

  const farmer = App.farmers.find(f => f.id === farmerId);
  showToast(`Visit to ${farmer?.name || farmerId} saved. ${countTodayDone()} of ${ROLES[App.user.role]?.dailyTarget || '?'} today.`, 'ok');
  switchView('my-visits');
}

function countTodayDone() {
  return App.visits.filter(v => v.userId === App.user.id && v.date === todayStr()).length;
}

// ─── Team / Admin View ──────────────────────────────────────
function renderTeam() {
  const today = todayStr();
  const isAdmin = App.user.role === 'admin';
  const allUsers = isAdmin
    ? App.users.filter(u => u.role !== 'admin')
    : App.users.filter(u => u.role !== 'admin' && (u.id === App.user.id || u.region === App.user.region));

  const html = allUsers.map(u => {
    const role = ROLES[u.role];
    const todayVisits = App.visits.filter(v => v.userId === u.id && v.date === today);
    const done = todayVisits.length;
    const target = role.dailyTarget || 0;
    const pct  = target > 0 ? Math.min(100, Math.round((done/target)*100)) : 100;
    const flag = target > 0 && pct < FLAG_THRESHOLD;
    const avgDur = done > 0 ? Math.round(todayVisits.reduce((s,v)=>s+v.durationMin,0)/done) : 0;

    return `<div class="team-card ${flag ? 'team-card-flag' : pct>=100?'team-card-ok':''}">
      <div class="tc-header">
        <div class="tc-avatar" style="background:${role.color}20;color:${role.color}">${u.avatar}</div>
        <div class="tc-info">
          <div class="tc-name">${u.name}</div>
          <div class="tc-role"><span class="role-tag role-${u.role}">${role.icon} ${role.label}</span></div>
          <div class="tc-region muted small">${u.region}</div>
        </div>
        <div class="tc-flag">${flag ? '⚠️' : pct>=100 ? '✅' : ''}</div>
      </div>
      <div class="tc-progress">
        <div class="tc-prog-header">
          <span>${done} / ${target} visits</span>
          <span class="${flag?'danger':pct>=100?'ok':'warn'} bold">${pct}%</span>
        </div>
        <div class="prog-track"><div class="prog-fill ${flag?'red':pct>=100?'':'amber'}" style="width:${pct}%"></div></div>
      </div>
      <div class="tc-stats">
        <div class="tc-stat"><span>${avgDur || '—'}</span><span>Avg min/visit</span></div>
        <div class="tc-stat"><span>${todayVisits.filter(v=>v.hasPhoto).length}</span><span>Photos</span></div>
        <div class="tc-stat"><span>${todayVisits.filter(v=>v.gps?.lat).length}</span><span>GPS logged</span></div>
      </div>
      <button class="btn btn-ghost btn-sm" onclick="openUserDetail('${u.id}')">View Visits ↗</button>
    </div>`;
  }).join('');

  setHTML('teamGrid', html || '<div class="empty-state">No team members visible.</div>');
}

function openUserDetail(userId) {
  const u = App.users.find(x => x.id === userId);
  if (!u) return;
  const role = ROLES[u.role];
  const today = todayStr();
  const todayV = App.visits.filter(v => v.userId === userId && v.date === today)
    .sort((a,b) => a.startTime.localeCompare(b.startTime));

  const visitRows = todayV.map(v => {
    const farmer = App.farmers.find(f => f.id === v.farmerId) || {};
    return `<div class="visit-row">
      <div class="vr-left">
        <div class="vr-name">${farmer.name || v.farmerId}</div>
        <div class="vr-meta">${v.startTime} · ${v.durationMin} min · ${v.topics.join(' · ')}</div>
        ${v.notes ? `<div class="vr-notes">"${v.notes}"</div>` : ''}
      </div>
      <div class="vr-right">
        ${v.hasPhoto ? '📷' : ''}
        ${v.gps?.lat ? `<span class="gps-dot" title="${v.gps.lat.toFixed(4)}, ${v.gps.lng.toFixed(4)}">📍</span>` : ''}
      </div>
    </div>`;
  }).join('') || '<div class="empty-state small">No visits today.</div>';

  setHTML('modalTitle', `${u.name} — Today's Visits`);
  setHTML('modalBody', `
    <div class="modal-user-header">
      <div class="tc-avatar" style="background:${role.color}20;color:${role.color};width:44px;height:44px;font-size:16px">${u.avatar}</div>
      <div>
        <div style="font-weight:700">${u.name}</div>
        <div class="small muted">${role.label} · ${u.region}</div>
      </div>
    </div>
    <div class="modal-stats-row">
      <div class="modal-stat"><div class="modal-stat-val">${todayV.length}</div><div>Done</div></div>
      <div class="modal-stat"><div class="modal-stat-val">${role.dailyTarget}</div><div>Target</div></div>
      <div class="modal-stat"><div class="modal-stat-val ${todayV.length/role.dailyTarget < 0.7 ? 'danger':'ok'}">${Math.round((todayV.length/role.dailyTarget)*100)}%</div><div>Completion</div></div>
    </div>
    <div class="modal-section-title">Visits today</div>
    ${visitRows}
    <div style="margin-top:12px">
      <button class="btn btn-ghost btn-sm" onclick="closeModal()">Close</button>
    </div>`);
  openModal();
}

// ─── Reports ────────────────────────────────────────────────
function renderReports() {
  const weekOffset = App.activeWeek;
  const { start, end } = getWeekRange(weekOffset);

  setHTML('reportWeekLabel', `${fmtDate(start)} – ${fmtDate(end)}`);

  const nonAdminUsers = App.users.filter(u => u.role !== 'admin');
  const rows = nonAdminUsers.map(u => {
    const role = ROLES[u.role];
    const weekVisits = App.visits.filter(v => v.userId === u.id && v.date >= start && v.date <= end);
    const workDays = 5;
    const weekTarget = (role.dailyTarget || 0) * workDays;
    const done = weekVisits.length;
    const pct  = weekTarget > 0 ? Math.min(100, Math.round((done/weekTarget)*100)) : 100;
    const flag = weekTarget > 0 && pct < FLAG_THRESHOLD;
    const avgDur = done > 0 ? Math.round(weekVisits.reduce((s,v)=>s+v.durationMin,0)/done) : 0;
    const photos = weekVisits.filter(v=>v.hasPhoto).length;

    return { u, role, weekTarget, done, pct, flag, avgDur, photos, weekVisits };
  });

  // Summary table
  const tableRows = rows.map(r => `
    <tr class="${r.flag ? 'row-flag' : ''}">
      <td><div class="name-cell"><span class="av-sm" style="background:${r.role.color}20;color:${r.role.color}">${r.u.avatar}</span>${r.u.name}</div></td>
      <td><span class="role-tag role-${r.u.role}">${r.role.label}</span></td>
      <td class="mono">${r.role.dailyTarget || '—'}/day</td>
      <td class="mono bold">${r.weekTarget}</td>
      <td class="mono bold ${r.flag ? 'danger' : r.pct>=100?'ok':'warn'}">${r.done}</td>
      <td>
        <div class="inline-bar">
          <div class="inline-fill ${r.flag?'red':r.pct>=100?'':'amber'}" style="width:${r.pct}%"></div>
        </div>
        <span class="pct-tag pct-${r.flag?'danger':r.pct>=100?'ok':'warn'}">${r.pct}%</span>
      </td>
      <td class="mono">${r.avgDur} min</td>
      <td class="mono">${r.photos}</td>
      <td>${r.flag ? '<span class="flag-chip">⚠️ Low</span>' : r.pct>=100 ? '<span class="ok-chip">✅</span>' : ''}</td>
    </tr>`).join('');

  setHTML('reportTableBody', tableRows);

  // Role breakdown
  const roleStats = ['manager','supervisor','technician'].map(roleKey => {
    const rConf = ROLES[roleKey];
    const users = rows.filter(r => r.u.role === roleKey);
    if (!users.length) return '';
    const totalDone   = users.reduce((s,r)=>s+r.done,0);
    const totalTarget = users.reduce((s,r)=>s+r.weekTarget,0);
    const pct = totalTarget > 0 ? Math.round((totalDone/totalTarget)*100) : 100;
    const flagCount = users.filter(r=>r.flag).length;
    return `<div class="role-stat-card">
      <div class="rsc-icon">${rConf.icon}</div>
      <div class="rsc-label">${rConf.label}s (${users.length})</div>
      <div class="rsc-pct ${pct<FLAG_THRESHOLD?'danger':pct>=100?'ok':'warn'}">${pct}%</div>
      <div class="rsc-sub">${totalDone} / ${totalTarget}</div>
      ${flagCount > 0 ? `<div class="rsc-flag">⚠️ ${flagCount} flagged</div>` : ''}
    </div>`;
  }).join('');

  setHTML('roleStatCards', roleStats);
}

function prevWeek() { App.activeWeek--; renderReports(); }
function nextWeek() { if (App.activeWeek < 0) { App.activeWeek++; renderReports(); } }

function getWeekRange(offset) {
  const now = new Date();
  const day = now.getDay(); // 0=Sun
  const mon = new Date(now);
  mon.setDate(now.getDate() - (day === 0 ? 6 : day-1) + (offset * 7));
  const sun = new Date(mon); sun.setDate(mon.getDate() + 6);
  return { start: mon.toISOString().slice(0,10), end: sun.toISOString().slice(0,10) };
}

function fmtDate(str) {
  return new Date(str + 'T00:00:00').toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' });
}

// ─── Visit Detail Modal ─────────────────────────────────────
function openVisitDetail(visitId) {
  const v = App.visits.find(x => x.id === visitId);
  if (!v) return;
  const farmer = App.farmers.find(f => f.id === v.farmerId) || {};
  const u = App.users.find(x => x.id === v.userId) || { name: v.userId };
  const role = ROLES[u.role] || {};

  setHTML('modalTitle', `Visit — ${farmer.name || v.farmerId}`);
  setHTML('modalBody', `
    <div class="vd-grid">
      <div class="vd-field"><div class="vd-label">Farmer</div><div class="vd-val bold">${farmer.name}</div></div>
      <div class="vd-field"><div class="vd-label">Village</div><div class="vd-val">${farmer.village || '—'} · ${farmer.district || ''}</div></div>
      <div class="vd-field"><div class="vd-label">Officer</div><div class="vd-val">${u.name}</div></div>
      <div class="vd-field"><div class="vd-label">Role</div><div class="vd-val"><span class="role-tag role-${u.role}">${role.label || u.role}</span></div></div>
      <div class="vd-field"><div class="vd-label">Date</div><div class="vd-val mono">${v.date}</div></div>
      <div class="vd-field"><div class="vd-label">Start Time</div><div class="vd-val mono">${v.startTime}</div></div>
      <div class="vd-field"><div class="vd-label">Duration</div><div class="vd-val mono">${v.durationMin} minutes</div></div>
      <div class="vd-field"><div class="vd-label">GPS</div><div class="vd-val mono">${v.gps?.lat ? `${v.gps.lat.toFixed(5)}, ${v.gps.lng.toFixed(5)}` : 'Not captured'}</div></div>
    </div>
    <div class="vd-label" style="margin-top:14px;margin-bottom:6px">Topics Covered</div>
    <div class="topic-tags">${v.topics.map(t => `<span class="topic-chip">${t}</span>`).join('')}</div>
    ${v.notes ? `<div class="vd-label" style="margin-top:14px;margin-bottom:6px">Notes</div><div class="vd-notes">"${v.notes}"</div>` : ''}
    ${v.hasPhoto ? `<div class="vd-label" style="margin-top:14px">Photo</div><div class="vd-photo">📷 ${v.photoNote || 'Photo attached'}</div>` : ''}
    <div style="margin-top:16px"><button class="btn btn-ghost btn-sm" onclick="closeModal()">Close</button></div>`);
  openModal();
}

// ─── Modal ──────────────────────────────────────────────────
function openModal() {
  const el = qid('modal');
  if (el) el.classList.add('open');
}
function closeModal() {
  const el = qid('modal');
  if (el) el.classList.remove('open');
}

// ─── Utilities ──────────────────────────────────────────────
function qid(id)     { return document.getElementById(id); }
function setHTML(id,h){ const e=qid(id); if(e) e.innerHTML=h; }
function setVal(id,v) { const e=qid(id); if(e) e.value=v; }
function todayStr()  { return new Date().toISOString().slice(0,10); }
function roleLabel(r){ return ROLES[r]?.label || r; }
function safeJSON(s) { try{return JSON.parse(s)}catch{return null}; }
function loadLS(k,seed){ try{const s=JSON.parse(localStorage.getItem(k));return Array.isArray(s)&&s.length?s:[...seed];}catch{return[...seed];} }
function saveLS(k,v)  { try{localStorage.setItem(k,JSON.stringify(v));}catch{} }

function showToast(msg, type='ok') {
  const t = qid('toast');
  if (!t) return;
  const icons = { ok:'✔', warn:'⚠', error:'✕' };
  t.className = `toast toast-${type} show`;
  t.innerHTML = `<span>${icons[type]||'✔'}</span> ${msg}`;
  clearTimeout(t._t);
  t._t = setTimeout(() => t.classList.remove('show'), 3500);
}

function startClock() {
  function tick(){
    const now = new Date();
    const el = qid('clock');
    if(el) el.textContent = now.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'}) + ' · ' + now.toLocaleDateString('en-GB',{weekday:'short',day:'2-digit',month:'short'});
  }
  tick(); setInterval(tick, 1000);
}

function logout() {
  sessionStorage.removeItem('fvma_user');
  window.location.href = 'index.html';
}

function toggleSidebar() {
  const sb = qid('sidebar');
  if (sb) sb.classList.toggle('open');
}

// ─── Keyboard ───────────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

document.addEventListener('DOMContentLoaded', () => {
  qid('modal')?.addEventListener('click', e => {
    if (e.target === qid('modal')) closeModal();
  });
  init();
});
