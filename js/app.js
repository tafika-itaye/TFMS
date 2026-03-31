// TFMS — TechNexus Farmer Management System
// Application Logic · github.com/tafika-itaye/TFMS
// © 2026 TechNexus · technexus_mw@proton.me

'use strict';

// ─── State ────────────────────────────────────────────────────────────────────
const App = {
  user: null,
  tab: 'dashboard',
  farmers: [],
  visits: [],
  inputs: [],
  factory: [],
  farmerPage: 1, farmerPageSize: 15,
  visitPage: 1,  visitPageSize: 12,
  inputPage: 1,  inputPageSize: 12,
  factoryPage: 1,factoryPageSize: 10,
  farmerFilter: { search:'', district:'', status:'', season:'' },
  visitFilter:  { search:'', cluster:'', status:'', date:'' },
  inputFilter:  { search:'', status:'' },
  menus: {},
};

// ─── Bootstrap ────────────────────────────────────────────────────────────────
function init() {
  try {
    const u = JSON.parse(sessionStorage.getItem('tfms_user') || 'null');
    if (!u) { window.location.href = 'index.html'; return; }
    App.user = u;
  } catch { window.location.href = 'index.html'; return; }

  // Load data from localStorage or seed
  App.farmers = loadStorage('tfms_farmers', SEED_FARMERS);
  App.visits  = loadStorage('tfms_visits',  SEED_VISITS);
  App.inputs  = loadStorage('tfms_inputs',  SEED_INPUTS);
  App.factory = loadStorage('tfms_factory', SEED_FACTORY);

  // Render user badge
  document.getElementById('userNameBadge').textContent = App.user.name;
  document.getElementById('userRoleBadge').textContent = App.user.role;
  document.getElementById('userInitials').textContent  = initials(App.user.name);
  document.getElementById('statusUser').textContent    = App.user.name + ' (' + App.user.role + ')';

  // Wire up search/filter inputs (debounced)
  wireFilters();
  wireMenus();
  wireInputCalc();

  switchTab('dashboard');
  startClock();
}

function loadStorage(key, seed) {
  try {
    const stored = JSON.parse(localStorage.getItem(key));
    return Array.isArray(stored) && stored.length ? stored : [...seed];
  } catch { return [...seed]; }
}

function saveStorage(key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
}

function initials(name) {
  return name.split(' ').slice(0,2).map(p=>p[0]).join('').toUpperCase();
}

// ─── Navigation ───────────────────────────────────────────────────────────────
function switchTab(tab) {
  closeAllMenus();
  App.tab = tab;

  document.querySelectorAll('.tab-view').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.nav-item[data-tab]').forEach(n => {
    n.classList.toggle('active', n.dataset.tab === tab);
  });

  const el = document.getElementById('tab-' + tab);
  if (el) el.classList.add('active');

  document.getElementById('topbarTitle').textContent  = TAB_TITLES[tab]?.title  || '';
  document.getElementById('topbarSub').textContent    = TAB_TITLES[tab]?.sub    || '';

  // Update toolbar buttons visibility
  document.querySelectorAll('[data-toolbar-tab]').forEach(b => {
    b.style.display = (b.dataset.toolbarTab === tab || b.dataset.toolbarTab === 'all') ? 'flex' : 'none';
  });

  switch (tab) {
    case 'dashboard':   renderDashboard();   break;
    case 'registry':    renderRegistry();    break;
    case 'fieldvisits': renderFieldVisits(); break;
    case 'inputs':      renderInputs();      break;
    case 'factory':     renderFactory();     break;
    case 'analytics':   renderAnalytics();   break;
  }
}

const TAB_TITLES = {
  dashboard:   { title:'Operational Dashboard',    sub:'2026 Buying Season · Malawi & Mozambique Operations' },
  registry:    { title:'Farmer Registry',          sub:'Registered growers · Biometric-enabled' },
  fieldvisits: { title:'Field Visits',             sub:'GAP compliance · Officer activity' },
  inputs:      { title:'Inputs & Credit Ledger',   sub:'Fertiliser · Seed · Pesticides · Credit recovery' },
  factory:     { title:'Factory & Weighbridge',    sub:'Delivery register · Grade analysis' },
  analytics:   { title:'Analytics & Reporting',    sub:'2026 Season · Production · Compliance' },
};

// ─── Dashboard ────────────────────────────────────────────────────────────────
function renderDashboard() {
  const totalFarmers  = App.farmers.length;
  const activeFarmers = App.farmers.filter(f=>f.status==='active').length;
  const todayVisits   = App.visits.filter(v=>v.date===todayStr()).length;
  const completedV    = App.visits.filter(v=>v.date===todayStr()&&v.status==='completed').length;
  const pendingInputs = App.inputs.filter(i=>i.status==='pending').length;
  const totalInputMK  = App.inputs.reduce((s,i)=>s+i.totalMK,0);
  const todayFactory  = App.factory.filter(f=>f.date===todayStr()&&f.status!=='en-route').reduce((s,t)=>s+(t.grossKg-t.tareKg),0);

  setEl('kpi-farmers', fmt(totalFarmers));
  setEl('kpi-farmers-sub', `${activeFarmers} active · ${App.farmers.filter(f=>f.status==='pending').length} pending`);
  setEl('kpi-visits', fmt(todayVisits));
  setEl('kpi-visits-sub', `${completedV} completed today`);
  setEl('kpi-inputs', 'MK ' + fmtMK(totalInputMK));
  setEl('kpi-inputs-sub', `${pendingInputs} pending dispatch`);
  setEl('kpi-factory', fmtTonne(todayFactory) + ' T');
  setEl('kpi-factory-sub', 'Today · ' + (App.factory.filter(f=>f.status==='en-route').length) + ' en route');

  // Mini chart bars: re-scale from ANALYTICS.monthlyIntake
  const maxT = Math.max(...ANALYTICS.monthlyIntake.map(m=>m.T));
  const bars  = document.querySelectorAll('#dashChartBar .chart-bar');
  ANALYTICS.monthlyIntake.forEach((m,i) => {
    if (bars[i]) {
      const pct = Math.round((m.T/maxT)*100);
      bars[i].style.height = pct + '%';
      bars[i].title = m.month + ': ' + m.T + 'T';
    }
  });

  // Officer progress
  const progEl = document.getElementById('officerProgress');
  if (progEl) {
    progEl.innerHTML = ANALYTICS.officerProgress.map(o => {
      const pct = Math.round((o.done/o.target)*100);
      const cls  = pct===100?'':'pct<50?red:amber';
      const fill = pct===100?'':pct<50?'red':'amber';
      return `<div class="prog-item">
        <div class="prog-hdr"><span>${o.officer} <em>${o.cluster}</em></span><span class="mono">${o.done}/${o.target}</span></div>
        <div class="prog-track"><div class="prog-fill ${fill}" style="width:${pct}%"></div></div>
      </div>`;
    }).join('');
  }
}

// ─── Registry ─────────────────────────────────────────────────────────────────
function renderRegistry() {
  const f = App.farmerFilter;
  let rows = [...App.farmers];

  if (f.search)   rows = rows.filter(r => [r.id,r.name,r.village,r.district].join(' ').toLowerCase().includes(f.search.toLowerCase()));
  if (f.district) rows = rows.filter(r => r.district === f.district);
  if (f.status)   rows = rows.filter(r => r.status   === f.status);
  if (f.season)   rows = rows.filter(r => r.season   === f.season);

  const total = rows.length;
  const pages = Math.ceil(total / App.farmerPageSize);
  if (App.farmerPage > pages) App.farmerPage = Math.max(1, pages);
  const start = (App.farmerPage - 1) * App.farmerPageSize;
  const page  = rows.slice(start, start + App.farmerPageSize);

  setEl('regTotal', `${fmt(total)} farmers`);
  setEl('regActive', App.farmers.filter(f=>f.status==='active').length);
  setEl('regPending', App.farmers.filter(f=>f.status==='pending').length);
  setEl('regSuspended', App.farmers.filter(f=>f.status==='suspended').length);

  const tbody = document.getElementById('farmerTableBody');
  if (!tbody) return;

  tbody.innerHTML = page.map(r => `
    <tr class="clickable" onclick="openFarmerDetail('${r.id}')">
      <td class="mono">${r.id}</td>
      <td class="bold">${r.name}</td>
      <td>${r.district}</td>
      <td>${r.village}</td>
      <td class="mono">${r.ha}</td>
      <td>${r.crops.join(', ')}</td>
      <td><span class="badge badge-${r.biometric}">${ucFirst(r.biometric)}</span></td>
      <td><span class="badge badge-${r.status}">${ucFirst(r.status)}</span></td>
      <td onclick="event.stopPropagation()">
        <button class="btn-icon" title="Edit farmer" onclick="openEditFarmer('${r.id}')">✎</button>
        <button class="btn-icon ${r.status==='suspended'?'green':'red'}" title="${r.status==='suspended'?'Reinstate':'Suspend'}" onclick="toggleSuspend('${r.id}')">
          ${r.status==='suspended'?'↩':'⊘'}
        </button>
      </td>
    </tr>`).join('');

  renderPager('farmerPager', App.farmerPage, pages, start, start+page.length, total, n => { App.farmerPage=n; renderRegistry(); });
}

function toggleSuspend(id) {
  const farmer = App.farmers.find(f=>f.id===id);
  if (!farmer) return;
  const newStatus = farmer.status==='suspended' ? 'active' : 'suspended';
  if (!confirm(`${newStatus==='suspended'?'Suspend':'Reinstate'} farmer ${farmer.name}?`)) return;
  farmer.status = newStatus;
  saveStorage('tfms_farmers', App.farmers);
  renderRegistry();
  showToast(`Farmer ${farmer.name} ${newStatus==='suspended'?'suspended':'reinstated'}.`, newStatus==='suspended'?'warn':'ok');
}

function openFarmerDetail(id) {
  const f = App.farmers.find(r=>r.id===id);
  if (!f) return;
  const visits   = App.visits.filter(v=>v.farmerId===id);
  const dispatch = App.inputs.filter(i=>i.farmerId===id);
  const gapColor = f.gapScore >= 80 ? 'green' : f.gapScore >= 60 ? 'amber' : 'red';

  setEl('fdName',    f.name);
  setEl('fdId',      f.id);
  setEl('fdDistrict',f.district + ' · ' + f.village);
  setEl('fdCluster', f.cluster);
  setEl('fdHa',      f.ha + ' ha');
  setEl('fdCrops',   f.crops.join(', '));
  setEl('fdPhone',   f.phone);
  setEl('fdGender',  f.gender === 'M' ? 'Male' : 'Female');
  setEl('fdBiometric',`<span class="badge badge-${f.biometric}">${ucFirst(f.biometric)}</span>`);
  setEl('fdStatus',   `<span class="badge badge-${f.status}">${ucFirst(f.status)}</span>`);
  setEl('fdGap',      f.gapScore > 0 ? `<span class="gap-pill gap-${gapColor}">${f.gapScore}/100</span>` : '<span class="gap-pill gap-none">Not scored</span>');
  setEl('fdCredit',   `<span class="mono">MK ${fmt(f.creditBalance)}</span> / MK ${fmt(f.creditLimit)}`);
  setEl('fdVisitCount',visits.length);
  setEl('fdLastVisit', visits.length ? visits[visits.length-1].date : '—');
  setEl('fdDispatchCount', dispatch.length);

  setEl('fdVisitHistory', visits.slice(-5).reverse().map(v=>
    `<div class="fd-visit-row">
      <span class="mono fd-visit-id">${v.id}</span>
      <span>${v.stage}</span>
      <span class="mono">${v.gapScore>0?v.gapScore+'/100':'—'}</span>
      <span class="badge badge-${v.status}">${ucFirst(v.status)}</span>
      <span class="muted">${v.date}</span>
    </div>`).join('') || '<p class="muted small">No visits recorded.</p>');

  openModal('modalFarmerDetail');
}

function openEditFarmer(id) {
  const f = App.farmers.find(r=>r.id===id);
  if (!f) return;
  setVal('efId',      f.id);
  setVal('efName',    f.name);
  setVal('efDistrict',f.district);
  setVal('efVillage', f.village);
  setVal('efCluster', f.cluster);
  setVal('efHa',      f.ha);
  setVal('efPhone',   f.phone);
  setVal('efStatus',  f.status);
  openModal('modalEditFarmer');
}

function saveEditFarmer() {
  const id = document.getElementById('efId').value;
  const f  = App.farmers.find(r=>r.id===id);
  if (!f) return;
  f.name     = document.getElementById('efName').value.trim();
  f.district = document.getElementById('efDistrict').value;
  f.village  = document.getElementById('efVillage').value.trim();
  f.cluster  = document.getElementById('efCluster').value;
  f.ha       = parseFloat(document.getElementById('efHa').value) || f.ha;
  f.phone    = document.getElementById('efPhone').value.trim();
  f.status   = document.getElementById('efStatus').value;
  saveStorage('tfms_farmers', App.farmers);
  closeModal('modalEditFarmer');
  renderRegistry();
  showToast(`Farmer ${f.name} updated.`, 'ok');
}

function submitNewFarmer() {
  const name     = document.getElementById('nfName').value.trim();
  const district = document.getElementById('nfDistrict').value;
  const village  = document.getElementById('nfVillage').value.trim();
  const cluster  = document.getElementById('nfCluster').value;
  const ha       = parseFloat(document.getElementById('nfHa').value) || 1.0;
  const phone    = document.getElementById('nfPhone').value.trim();
  const gender   = document.getElementById('nfGender').value;
  const cropsVal = document.getElementById('nfCrops').value;

  if (!name || !village) { showToast('Name and village are required.', 'warn'); return; }

  const existing = App.farmers.map(f=>parseInt(f.id.split('-')[1]));
  const newNum   = (Math.max(...existing, 0) + 1).toString().padStart(5,'0');
  const newId    = 'TF-' + newNum;

  const farmer = {
    id: newId, name, district, village, cluster,
    ha, biometric:'pending', status:'pending', season:'2026',
    gender, dob:'', phone, crops: cropsVal ? [cropsVal] : ['Tobacco'],
    gapScore:0, creditBalance:0, creditLimit:100000,
    lat:0, lng:0
  };

  App.farmers.unshift(farmer);
  saveStorage('tfms_farmers', App.farmers);
  closeModal('modalNewFarmer');
  resetForm('formNewFarmer');
  App.farmerPage = 1;
  renderRegistry();
  updateNavBadges();
  showToast(`Farmer ${name} (${newId}) registered.`, 'ok');
}

// ─── Field Visits ─────────────────────────────────────────────────────────────
function renderFieldVisits() {
  const f = App.visitFilter;
  let rows = [...App.visits];

  if (f.search)  rows = rows.filter(r => [r.id,r.farmerId,r.farmerName,r.officer].join(' ').toLowerCase().includes(f.search.toLowerCase()));
  if (f.cluster) rows = rows.filter(r => r.cluster === f.cluster);
  if (f.status)  rows = rows.filter(r => r.status  === f.status);
  if (f.date)    rows = rows.filter(r => r.date    === f.date);

  rows.sort((a,b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time));

  const total = rows.length;
  const pages = Math.ceil(total / App.visitPageSize);
  if (App.visitPage > pages) App.visitPage = Math.max(1, pages);
  const start = (App.visitPage - 1) * App.visitPageSize;
  const page  = rows.slice(start, start + App.visitPageSize);

  const todayV = App.visits.filter(v=>v.date===todayStr());
  setEl('fvTotalToday',   todayV.length);
  setEl('fvCompleted',    todayV.filter(v=>v.status==='completed').length);
  setEl('fvPending',      todayV.filter(v=>v.status==='pending').length);
  setEl('fvFlagged',      todayV.filter(v=>v.status==='flagged').length);
  setEl('fvSeasonTotal',  App.visits.length);

  const tbody = document.getElementById('visitTableBody');
  if (!tbody) return;

  tbody.innerHTML = page.map(r => {
    const gc = r.gapScore >= 80 ? 'green' : r.gapScore >= 60 ? 'amber' : r.gapScore > 0 ? 'red' : 'none';
    return `<tr class="clickable" onclick="openVisitDetail('${r.id}')">
      <td class="mono">${r.id}</td>
      <td>${r.farmerName} <em class="mono muted">${r.farmerId}</em></td>
      <td>${r.officer}</td>
      <td>${r.cluster}</td>
      <td>${r.stage}</td>
      <td>${r.gapScore > 0 ? `<span class="gap-pill gap-${gc}">${r.gapScore}</span>` : '—'}</td>
      <td>${r.date} <span class="muted">${r.time}</span></td>
      <td><span class="badge badge-${r.status}">${ucFirst(r.status)}</span></td>
    </tr>`;
  }).join('');

  renderPager('visitPager', App.visitPage, pages, start, start+page.length, total, n => { App.visitPage=n; renderFieldVisits(); });
}

function openVisitDetail(id) {
  const v = App.visits.find(r=>r.id===id);
  if (!v) return;
  const gc = v.gapScore >= 80 ? 'green' : v.gapScore >= 60 ? 'amber' : v.gapScore > 0 ? 'red' : 'none';
  setEl('vdId',        v.id);
  setEl('vdFarmer',    v.farmerName + ' (' + v.farmerId + ')');
  setEl('vdOfficer',   v.officer);
  setEl('vdCluster',   v.cluster);
  setEl('vdStage',     v.stage);
  setEl('vdDate',      v.date + ' · ' + v.time);
  setEl('vdGap',       v.gapScore > 0 ? `<span class="gap-pill gap-${gc}">${v.gapScore}/100</span>` : '<span class="muted">Not scored</span>');
  setEl('vdStatus',    `<span class="badge badge-${v.status}">${ucFirst(v.status)}</span>`);
  setEl('vdNotes',     v.notes || 'No notes recorded.');
  setEl('vdGps',       v.lat && v.lng ? `${v.lat.toFixed(4)}, ${v.lng.toFixed(4)}` : 'Not captured');
  openModal('modalVisitDetail');
}

function submitNewVisit() {
  const farmerId   = document.getElementById('nvFarmerId').value.trim().toUpperCase();
  const stage      = document.getElementById('nvStage').value;
  const cluster    = document.getElementById('nvCluster').value;
  const gapScore   = parseInt(document.getElementById('nvGap').value) || 0;
  const notes      = document.getElementById('nvNotes').value.trim();
  const lat        = parseFloat(document.getElementById('nvLat').value) || 0;
  const lng        = parseFloat(document.getElementById('nvLng').value) || 0;

  const farmer = App.farmers.find(f=>f.id===farmerId);
  if (!farmer) { showToast('Farmer ID not found: ' + farmerId, 'warn'); return; }

  const nums   = App.visits.map(v=>parseInt(v.id.split('-')[2])).filter(n=>!isNaN(n));
  const nextN  = (Math.max(...nums, 840) + 1).toString().padStart(4,'0');
  const id     = 'FV-2026-' + nextN;
  const now    = new Date();
  const time   = now.getHours().toString().padStart(2,'0') + ':' + now.getMinutes().toString().padStart(2,'0');

  const visit = {
    id, farmerId, farmerName: farmer.name.split(' ').slice(0,2).join(' '),
    officer: App.user.name, cluster, stage, gapScore,
    date: todayStr(), time, status: 'completed',
    notes: notes || 'Field visit recorded via TFMS web application.',
    lat, lng
  };

  // Update farmer GAP score
  if (gapScore > 0) { farmer.gapScore = gapScore; saveStorage('tfms_farmers', App.farmers); }

  App.visits.unshift(visit);
  saveStorage('tfms_visits', App.visits);
  closeModal('modalNewVisit');
  resetForm('formNewVisit');
  App.visitPage = 1;
  renderFieldVisits();
  updateNavBadges();
  showToast(`Visit ${id} recorded for ${farmer.name}.`, 'ok');
}

// ─── Inputs ───────────────────────────────────────────────────────────────────
function renderInputs() {
  const f = App.inputFilter;
  let rows = [...App.inputs];

  if (f.search) rows = rows.filter(r => [r.id,r.farmerId,r.farmerName].join(' ').toLowerCase().includes(f.search.toLowerCase()));
  if (f.status) rows = rows.filter(r => r.status === f.status);

  rows.sort((a,b)=>b.date.localeCompare(a.date));

  const total = rows.length;
  const pages = Math.ceil(total / App.inputPageSize);
  if (App.inputPage > pages) App.inputPage = Math.max(1, pages);
  const start = (App.inputPage - 1) * App.inputPageSize;
  const page  = rows.slice(start, start + App.inputPageSize);

  const totalMK = App.inputs.reduce((s,i)=>s+i.totalMK,0);
  const delivMK = App.inputs.filter(i=>i.status==='delivered').reduce((s,i)=>s+i.totalMK,0);
  setEl('inputTotalMK',   'MK ' + fmtMK(totalMK));
  setEl('inputDelivMK',   'MK ' + fmtMK(delivMK));
  setEl('inputPendingCt', App.inputs.filter(i=>i.status==='pending').length);
  setEl('inputFarmerCt',  [...new Set(App.inputs.map(i=>i.farmerId))].length);

  const tbody = document.getElementById('inputTableBody');
  if (!tbody) return;

  tbody.innerHTML = page.map(r => `
    <tr>
      <td class="mono">${r.id}</td>
      <td>${r.farmerName} <em class="mono muted">${r.farmerId}</em></td>
      <td>${r.cluster}</td>
      <td>${r.date}</td>
      <td class="mono">${r.compoundD}×Comp.D&nbsp; ${r.can}×CAN&nbsp; ${r.seedKg}kg seed</td>
      <td class="mono bold">MK ${fmt(r.totalMK)}</td>
      <td class="muted small">${r.method}</td>
      <td><span class="badge badge-${r.status}">${ucFirst(r.status)}</span></td>
      <td><button class="btn-icon" title="View" onclick="openInputDetail('${r.id}')">⊞</button></td>
    </tr>`).join('');

  renderPager('inputPager', App.inputPage, pages, start, start+page.length, total, n => { App.inputPage=n; renderInputs(); });
}

function openInputDetail(id) {
  const d = App.inputs.find(i=>i.id===id);
  if (!d) return;
  setEl('idId',       d.id);
  setEl('idFarmer',   d.farmerName + ' (' + d.farmerId + ')');
  setEl('idCluster',  d.cluster);
  setEl('idDate',     d.date);
  setEl('idCompD',    d.compoundD + ' bags');
  setEl('idCan',      d.can + ' bags');
  setEl('idSeed',     d.seedKg + ' kg');
  setEl('idPest',     d.pesticideLt + ' litres');
  setEl('idTotal',    'MK ' + fmt(d.totalMK));
  setEl('idMethod',   d.method);
  setEl('idAuth',     d.authorised);
  setEl('idStatus',   `<span class="badge badge-${d.status}">${ucFirst(d.status)}</span>`);
  openModal('modalInputDetail');
}

function submitDispatch() {
  const farmerId   = document.getElementById('disFarmerId').value.trim().toUpperCase();
  const date       = document.getElementById('disDate').value;
  const compoundD  = parseInt(document.getElementById('disCompD').value)  || 0;
  const can        = parseInt(document.getElementById('disCan').value)    || 0;
  const seedKg     = parseFloat(document.getElementById('disSeed').value) || 0;
  const pesticideLt= parseFloat(document.getElementById('disPest').value) || 0;
  const method     = document.getElementById('disMethod').value;

  const farmer = App.farmers.find(f=>f.id===farmerId);
  if (!farmer) { showToast('Farmer ID not found: ' + farmerId, 'warn'); return; }

  const totalMK = compoundD*INPUT_PRICES.compoundDPerBag + can*INPUT_PRICES.canPerBag +
                  seedKg*INPUT_PRICES.seedPerKg + pesticideLt*INPUT_PRICES.pesticidePerLitre;

  if (totalMK <= 0) { showToast('At least one input item is required.', 'warn'); return; }

  const nums = App.inputs.map(i=>parseInt(i.id.split('-')[2])).filter(n=>!isNaN(n));
  const next = (Math.max(...nums, 0) + 1).toString().padStart(3,'0');
  const id   = 'DIS-2026-' + next;

  const dispatch = { id, farmerId, farmerName: farmer.name.split(' ').slice(0,2).join(' '),
    cluster: farmer.cluster, date, compoundD, can, seedKg, pesticideLt,
    totalMK, method, status:'pending', authorised: App.user.name };

  farmer.creditBalance = (farmer.creditBalance || 0) + totalMK;
  App.inputs.unshift(dispatch);
  saveStorage('tfms_inputs',  App.inputs);
  saveStorage('tfms_farmers', App.farmers);
  closeModal('modalNewDispatch');
  resetForm('formNewDispatch');
  App.inputPage = 1;
  renderInputs();
  showToast(`Dispatch ${id} approved — MK ${fmt(totalMK)} for ${farmer.name}.`, 'ok');
}

function wireInputCalc() {
  const ids = ['disCompD','disCan','disSeed','disPest'];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', updateDispatchTotal);
  });
}

function updateDispatchTotal() {
  const compoundD   = parseFloat(document.getElementById('disCompD').value)  || 0;
  const can         = parseFloat(document.getElementById('disCan').value)    || 0;
  const seedKg      = parseFloat(document.getElementById('disSeed').value)   || 0;
  const pesticideLt = parseFloat(document.getElementById('disPest').value)   || 0;
  const total = compoundD*INPUT_PRICES.compoundDPerBag + can*INPUT_PRICES.canPerBag +
                seedKg*INPUT_PRICES.seedPerKg + pesticideLt*INPUT_PRICES.pesticidePerLitre;
  setEl('disTotalCalc', total > 0 ? 'MK ' + fmt(total) : '—');
  const el = document.getElementById('disTotal');
  if (el) el.value = total > 0 ? fmt(total) : '';
}

// ─── Factory ──────────────────────────────────────────────────────────────────
function renderFactory() {
  const rows = [...App.factory].sort((a,b)=>b.date.localeCompare(a.date)||b.time.localeCompare(a.time));
  const total = rows.length;
  const pages = Math.ceil(total / App.factoryPageSize);
  if (App.factoryPage > pages) App.factoryPage = Math.max(1, pages);
  const start = (App.factoryPage - 1) * App.factoryPageSize;
  const page  = rows.slice(start, start + App.factoryPageSize);

  const todayTickets = App.factory.filter(f=>f.date===todayStr()&&f.status!=='en-route');
  const todayNet     = todayTickets.reduce((s,t)=>s+(t.grossKg-t.tareKg),0);
  const todayBales   = todayTickets.reduce((s,t)=>s+t.bales,0);
  const discrepancies= App.factory.filter(f=>f.status==='discrepancy').length;

  setEl('factTodayNet',    fmtTonne(todayNet) + ' T');
  setEl('factTodayBales',  todayBales);
  setEl('factTickets',     App.factory.filter(f=>f.status!=='en-route').length);
  setEl('factDiscrep',     discrepancies);

  // Grade distribution (today)
  if (todayTickets.length) {
    const gradeAgg = {};
    todayTickets.forEach(t => {
      Object.entries(t.grades||{}).forEach(([g,pct])=>{
        gradeAgg[g] = (gradeAgg[g]||0) + pct;
      });
    });
    const gradeTotal = Object.values(gradeAgg).reduce((s,v)=>s+v,0) || 1;
    const gradeEl = document.getElementById('gradeDistrib');
    if (gradeEl) {
      gradeEl.innerHTML = Object.entries(gradeAgg).map(([g,v])=>{
        const pct = Math.round((v/gradeTotal)*100);
        const cls = g.includes('A')?'':'g.includes("Rej")?red:amber';
        const fill = g==='Grade A'?'':g==='Rejected'?'red':'amber';
        return `<div class="bar-h-row">
          <label>${g}</label>
          <div class="bar-h-track"><div class="bar-h-fill ${fill}" style="width:${pct}%"></div></div>
          <span class="mono">${pct}%</span>
        </div>`;
      }).join('');
    }
  }

  const tbody = document.getElementById('factoryTableBody');
  if (!tbody) return;

  tbody.innerHTML = page.map(r => {
    const net = r.grossKg > 0 ? fmt(r.grossKg - r.tareKg) : '—';
    return `<tr class="clickable" onclick="openFactoryDetail('${r.id}')">
      <td class="mono">${r.id}</td>
      <td class="mono">${r.truck}</td>
      <td>${r.origin}</td>
      <td class="mono">${r.grossKg > 0 ? fmt(r.grossKg) : '—'}</td>
      <td class="mono">${r.tareKg > 0 ? fmt(r.tareKg) : '—'}</td>
      <td class="mono bold">${net}</td>
      <td class="mono">${r.bales > 0 ? r.bales : '—'}</td>
      <td>${r.gate}</td>
      <td>${r.date} <span class="muted">${r.time}</span></td>
      <td><span class="badge badge-${r.status}">${ucFirst(r.status)}</span></td>
    </tr>`;
  }).join('');

  renderPager('factoryPager', App.factoryPage, pages, start, start+page.length, total, n => { App.factoryPage=n; renderFactory(); });
}

function openFactoryDetail(id) {
  const t = App.factory.find(f=>f.id===id);
  if (!t) return;
  const net = t.grossKg > 0 ? fmt(t.grossKg - t.tareKg) : '—';
  setEl('wdId',       t.id);
  setEl('wdTruck',    t.truck);
  setEl('wdOrigin',   t.origin);
  setEl('wdGross',    t.grossKg > 0 ? fmt(t.grossKg) + ' kg' : '—');
  setEl('wdTare',     t.tareKg > 0 ? fmt(t.tareKg) + ' kg' : '—');
  setEl('wdNet',      net !== '—' ? net + ' kg' : '—');
  setEl('wdBales',    t.bales > 0 ? t.bales : '—');
  setEl('wdGate',     t.gate);
  setEl('wdOp',       t.operator);
  setEl('wdDate',     t.date + (t.time !== '—' ? ' · ' + t.time : ''));
  setEl('wdStatus',   `<span class="badge badge-${t.status}">${ucFirst(t.status)}</span>`);
  setEl('wdNotes',    t.notes || 'No notes.');
  const gradeEl = document.getElementById('wdGrades');
  if (gradeEl) {
    gradeEl.innerHTML = Object.keys(t.grades).length
      ? Object.entries(t.grades).map(([g,pct])=>`<span class="chip">${g}: ${pct}%</span>`).join('')
      : '<span class="muted">Not yet graded</span>';
  }
  openModal('modalWeightDetail');
}

function submitWeightTicket() {
  const truck   = document.getElementById('wtTruck').value.trim().toUpperCase();
  const origin  = document.getElementById('wtOrigin').value;
  const gate    = document.getElementById('wtGate').value;
  const grossKg = parseFloat(document.getElementById('wtGross').value) || 0;
  const tareKg  = parseFloat(document.getElementById('wtTare').value)  || 0;
  const bales   = parseInt(document.getElementById('wtBales').value)   || 0;
  const notes   = document.getElementById('wtNotes').value.trim();

  if (!truck) { showToast('Truck ID is required.', 'warn'); return; }
  if (grossKg <= 0) { showToast('Gross weight required.', 'warn'); return; }
  if (grossKg <= tareKg) { showToast('Gross weight must exceed tare weight.', 'warn'); return; }

  const nums = App.factory.map(f=>parseInt(f.id.split('-')[2])).filter(n=>!isNaN(n));
  const next = (Math.max(...nums, 0) + 1).toString().padStart(3,'0');
  const id   = 'WB-2026-' + next;
  const now  = new Date();
  const time = now.getHours().toString().padStart(2,'0') + ':' + now.getMinutes().toString().padStart(2,'0');

  const ticket = { id, truck, origin, grossKg, tareKg, bales, gate,
    operator: App.user.name, date: todayStr(), time, status:'cleared',
    grades: { 'Grade A':68, 'Grade B1':22, 'Grade B2':8, 'Rejected':2 }, notes };

  App.factory.unshift(ticket);
  saveStorage('tfms_factory', App.factory);
  closeModal('modalNewWeight');
  resetForm('formNewWeight');
  App.factoryPage = 1;
  renderFactory();
  showToast(`Weight ticket ${id} recorded · Net: ${fmt(grossKg-tareKg)} kg`, 'ok');
}

// ─── Analytics ────────────────────────────────────────────────────────────────
function renderAnalytics() {
  const totalProd  = ANALYTICS.districtProduction.reduce((s,d)=>s+d.T,0);
  const avgGap     = App.farmers.filter(f=>f.gapScore>0).reduce((s,f,_,a)=>s+f.gapScore/a.length,0);
  const totalCreditMK = App.inputs.reduce((s,i)=>s+i.totalMK,0);

  setEl('anlProd',    totalProd.toFixed(1) + 'T');
  setEl('anlGap',     avgGap.toFixed(1));
  setEl('anlCredit',  'MK ' + fmtMK(totalCreditMK));
  setEl('anlFarmers', fmt(App.farmers.filter(f=>f.status==='active').length));

  // Monthly intake chart
  const maxT = Math.max(...ANALYTICS.monthlyIntake.map(m=>m.T));
  const anlBars = document.querySelectorAll('#anlMonthlyChart .chart-bar');
  ANALYTICS.monthlyIntake.forEach((m,i) => {
    if (anlBars[i]) {
      anlBars[i].style.height = Math.round((m.T/maxT)*100) + '%';
      anlBars[i].title = m.month + ': ' + m.T + 'T';
    }
  });

  // District bars
  const maxD = ANALYTICS.districtProduction[0].T;
  const distEl = document.getElementById('anlDistrictBars');
  if (distEl) {
    distEl.innerHTML = ANALYTICS.districtProduction.map(d => {
      const pct = Math.round((d.T/maxD)*100);
      const fill = d.district.includes('MZ') ? 'amber' : '';
      return `<div class="bar-h-row">
        <label>${d.district}</label>
        <div class="bar-h-track"><div class="bar-h-fill ${fill}" style="width:${pct}%"></div></div>
        <span class="mono">${d.T}T</span>
      </div>`;
    }).join('');
  }

  // GAP distribution
  const gapEl = document.getElementById('anlGapBars');
  if (gapEl) {
    const maxC = Math.max(...ANALYTICS.gapScoreDistrib.map(g=>g.count));
    gapEl.innerHTML = ANALYTICS.gapScoreDistrib.map(g => {
      const pct = Math.round((g.count/maxC)*100);
      const fill = g.band.includes('90')?'':g.band.includes('80')?'':g.band.includes('Below')?'red':'amber';
      return `<div class="bar-h-row">
        <label>${g.band}</label>
        <div class="bar-h-track"><div class="bar-h-fill ${fill}" style="width:${pct}%"></div></div>
        <span class="mono">${g.pct}%</span>
      </div>`;
    }).join('');
  }
}

// ─── Modals ───────────────────────────────────────────────────────────────────
function openModal(id) {
  const el = document.getElementById(id);
  if (el) { el.classList.add('open'); el.querySelector('.modal-body')?.scrollTo(0,0); }
}
function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('open');
}

// ─── Menus ────────────────────────────────────────────────────────────────────
function wireMenus() {
  document.querySelectorAll('.menu-item').forEach(mi => {
    mi.addEventListener('click', e => {
      e.stopPropagation();
      const id = mi.dataset.menu;
      const open = mi.classList.contains('open');
      closeAllMenus();
      if (!open) { mi.classList.add('open'); }
    });
  });
  document.addEventListener('click', closeAllMenus);
}

function closeAllMenus() {
  document.querySelectorAll('.menu-item.open').forEach(m => m.classList.remove('open'));
}

// ─── Filters ──────────────────────────────────────────────────────────────────
function wireFilters() {
  // Registry
  const rSearch = document.getElementById('rfSearch');
  if (rSearch) rSearch.addEventListener('input', debounce(e => { App.farmerFilter.search = e.target.value; App.farmerPage=1; renderRegistry(); }, 250));

  const rDistrict = document.getElementById('rfDistrict');
  if (rDistrict) rDistrict.addEventListener('change', e => { App.farmerFilter.district = e.target.value; App.farmerPage=1; renderRegistry(); });

  const rStatus = document.getElementById('rfStatus');
  if (rStatus) rStatus.addEventListener('change', e => { App.farmerFilter.status = e.target.value; App.farmerPage=1; renderRegistry(); });

  const rSeason = document.getElementById('rfSeason');
  if (rSeason) rSeason.addEventListener('change', e => { App.farmerFilter.season = e.target.value; App.farmerPage=1; renderRegistry(); });

  // Visits
  const vSearch = document.getElementById('vfSearch');
  if (vSearch) vSearch.addEventListener('input', debounce(e => { App.visitFilter.search = e.target.value; App.visitPage=1; renderFieldVisits(); }, 250));

  const vCluster = document.getElementById('vfCluster');
  if (vCluster) vCluster.addEventListener('change', e => { App.visitFilter.cluster = e.target.value; App.visitPage=1; renderFieldVisits(); });

  const vStatus = document.getElementById('vfStatus');
  if (vStatus) vStatus.addEventListener('change', e => { App.visitFilter.status = e.target.value; App.visitPage=1; renderFieldVisits(); });

  const vDate = document.getElementById('vfDate');
  if (vDate) vDate.addEventListener('change', e => { App.visitFilter.date = e.target.value; App.visitPage=1; renderFieldVisits(); });

  // Inputs
  const iSearch = document.getElementById('ifSearch');
  if (iSearch) iSearch.addEventListener('input', debounce(e => { App.inputFilter.search = e.target.value; App.inputPage=1; renderInputs(); }, 250));

  const iStatus = document.getElementById('ifStatus');
  if (iStatus) iStatus.addEventListener('change', e => { App.inputFilter.status = e.target.value; App.inputPage=1; renderInputs(); });
}

// ─── Utilities ────────────────────────────────────────────────────────────────
function renderPager(containerId, page, pages, start, end, total, cb) {
  const el = document.getElementById(containerId);
  if (!el) return;
  if (pages <= 1) { el.innerHTML = `<span class="pager-info">Showing ${fmt(total)} records</span>`; return; }
  let html = `<span class="pager-info">Showing ${start+1}–${end} of ${fmt(total)}</span><div class="pager-btns">`;
  html += `<button class="pager-btn" ${page<=1?'disabled':''} onclick="(${cb.toString()})(${page-1})">‹ Prev</button>`;
  const lo = Math.max(1, page-2), hi = Math.min(pages, page+2);
  for (let p=lo;p<=hi;p++) html += `<button class="pager-btn${p===page?' active':''}" onclick="(${cb.toString()})(${p})">${p}</button>`;
  html += `<button class="pager-btn" ${page>=pages?'disabled':''} onclick="(${cb.toString()})(${page+1})">Next ›</button>`;
  html += '</div>';
  el.innerHTML = html;
}

function setEl(id, html) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = html;
}
function setVal(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val;
}
function fmt(n) {
  return Number(n).toLocaleString('en-US');
}
function fmtMK(n) {
  if (n >= 1e6) return (n/1e6).toFixed(1) + 'M';
  if (n >= 1e3) return (n/1e3).toFixed(0) + 'K';
  return fmt(n);
}
function fmtTonne(kg) {
  return (kg/1000).toFixed(1);
}
function todayStr() {
  return new Date().toISOString().slice(0,10);
}
function ucFirst(s) {
  if (!s) return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function debounce(fn, ms) {
  let t; return (...a) => { clearTimeout(t); t = setTimeout(()=>fn(...a), ms); };
}
function resetForm(id) {
  const f = document.getElementById(id);
  if (f) f.reset();
  setEl('disTotalCalc','—');
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function showToast(msg, type='ok') {
  const t = document.getElementById('toast');
  if (!t) return;
  const icons = { ok:'✔', warn:'⚠', error:'✕' };
  t.className = 'toast toast-' + type + ' show';
  t.innerHTML = `<span class="toast-icon">${icons[type]||'✔'}</span> ${msg}`;
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 3500);
}

// ─── Nav Badges ───────────────────────────────────────────────────────────────
function updateNavBadges() {
  const el = document.getElementById('badgeFarmers');
  if (el) el.textContent = fmt(App.farmers.length);
  const el2 = document.getElementById('badgeVisits');
  if (el2) el2.textContent = App.visits.filter(v=>v.date===todayStr()).length;
}

// ─── Export ───────────────────────────────────────────────────────────────────
function exportCSV(type) {
  let rows, headers, filename;
  switch (type) {
    case 'farmers':
      headers = ['ID','Name','District','Village','Cluster','Hectares','Crops','Biometric','Status','GAP Score','Phone'];
      rows = App.farmers.map(f=>[f.id,f.name,f.district,f.village,f.cluster,f.ha,f.crops.join('/'),f.biometric,f.status,f.gapScore,f.phone]);
      filename = 'TFMS_Farmers_' + todayStr() + '.csv'; break;
    case 'visits':
      headers = ['Visit ID','Farmer ID','Farmer Name','Officer','Cluster','Stage','GAP Score','Date','Time','Status'];
      rows = App.visits.map(v=>[v.id,v.farmerId,v.farmerName,v.officer,v.cluster,v.stage,v.gapScore,v.date,v.time,v.status]);
      filename = 'TFMS_Visits_' + todayStr() + '.csv'; break;
    case 'inputs':
      headers = ['ID','Farmer ID','Farmer','Cluster','Date','Comp.D Bags','CAN Bags','Seed kg','Pesticide L','Total MK','Method','Status'];
      rows = App.inputs.map(i=>[i.id,i.farmerId,i.farmerName,i.cluster,i.date,i.compoundD,i.can,i.seedKg,i.pesticideLt,i.totalMK,i.method,i.status]);
      filename = 'TFMS_Inputs_' + todayStr() + '.csv'; break;
    default: return;
  }
  const csv = [headers, ...rows].map(r=>r.map(c=>`"${c}"`).join(',')).join('\n');
  const a = document.createElement('a');
  a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
  a.download = filename;
  a.click();
  showToast(`Exported ${filename}`, 'ok');
}

// ─── Clock ────────────────────────────────────────────────────────────────────
function startClock() {
  function tick() {
    const now = new Date();
    const s = now.toLocaleTimeString('en-GB', {hour:'2-digit',minute:'2-digit',second:'2-digit'});
    const d = now.toLocaleDateString('en-GB', {weekday:'short',day:'2-digit',month:'short',year:'numeric'});
    setEl('statusClock', d + ' · ' + s);
  }
  tick(); setInterval(tick, 1000);
}

// ─── Logout ───────────────────────────────────────────────────────────────────
function logout() {
  sessionStorage.removeItem('tfms_user');
  window.location.href = 'index.html';
}

// ─── About ────────────────────────────────────────────────────────────────────
function openAbout() { openModal('modalAbout'); }

// ─── Keyboard shortcuts ───────────────────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
    closeAllMenus();
  }
});

// Overlay close on background click
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) overlay.classList.remove('open');
    });
  });
  init();
});
