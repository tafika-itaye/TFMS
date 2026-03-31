// ═══════════════════════════════════════════════════
// TFMS — Application Logic
// TechNexus Farmer Management System · 2026
// ═══════════════════════════════════════════════════

// ── GLOBALS ──
let currentUser = null;
let checkState = {};

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
  const raw = sessionStorage.getItem('tfms_user');
  if (!raw) { window.location.href = 'index.html'; return; }
  currentUser = JSON.parse(raw);
  initUI();
  startClock();
  // handle hash nav from site links
  const hash = window.location.hash.replace('#','');
  if (hash && document.getElementById('nav-'+hash)) {
    switchTab(hash, document.getElementById('nav-'+hash));
  } else {
    switchTab('dashboard', document.getElementById('nav-dashboard'));
  }
  document.querySelectorAll('.modal-overlay').forEach(o => {
    o.addEventListener('click', e => { if (e.target===o) o.classList.remove('open'); });
  });
  document.addEventListener('keydown', e => {
    if (e.key==='Escape') document.querySelectorAll('.modal-overlay.open').forEach(o=>o.classList.remove('open'));
  });
  document.getElementById('sidebarToggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
  });
  renderChecklist('GAP');
});

function initUI() {
  document.getElementById('userAv').textContent     = currentUser.initials;
  document.getElementById('userName').textContent   = currentUser.name;
  document.getElementById('userRoleLabel').textContent = currentUser.role;
}

function startClock() {
  const el = document.getElementById('clock');
  function tick() { if(el) el.textContent = new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',second:'2-digit'}); }
  tick(); setInterval(tick, 1000);
}

// ── TAB SWITCHING ──
const TAB_TITLES = {
  dashboard:'Operational Dashboard', registry:'Farmer Registry',
  field:'Field Visits', inputs:'Inputs & Credit',
  factory:'Factory & Inventory', analytics:'Analytics'
};
const TAB_SUBS = {
  dashboard:'2026 Buying Season · Malawi & Mozambique Operations',
  registry:'Digital grower registration with biometrics',
  field:'GPS visit management · Offline-capable',
  inputs:'Seed, fertiliser and chemical dispatch',
  factory:'Weight capture · Bale traceability · Shift reporting',
  analytics:'Seasonal dashboards · Power BI / Excel export'
};

function switchTab(id, el) {
  document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const pane = document.getElementById('tab-'+id);
  if (pane) pane.classList.add('active');
  if (el) el.classList.add('active');
  document.getElementById('pageTitle').textContent  = TAB_TITLES[id] || id;
  document.getElementById('pageSubtitle').innerHTML = TAB_SUBS[id] || '';
  // lazy-render per tab
  if (id==='dashboard') renderDashboard();
  if (id==='registry')  renderRegistry();
  if (id==='field')     renderFieldOverview();
  if (id==='inputs')    renderInputs();
  if (id==='factory')   renderFactory();
  if (id==='analytics') renderAnalytics();
  document.getElementById('sidebar').classList.remove('open');
}

// ── SUB TAB SWITCHING ──
function switchSubTab(btn, targetId) {
  const bar = btn.closest('.sub-tab-bar');
  bar.querySelectorAll('.sub-tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const container = btn.closest('.tab-pane');
  container.querySelectorAll('.sub-pane').forEach(p => p.classList.remove('active'));
  const target = document.getElementById(targetId);
  if (target) target.classList.add('active');
  // sub-renders
  if (targetId==='fv-log')      renderVisitLog();
  if (targetId==='fv-checklist') renderChecklist('GAP');
  if (targetId==='fv-sync')     renderSyncQueue();
  if (targetId==='reg-biometric') {} // static
  if (targetId==='fac-trace')   renderBaleTrace();
  if (targetId==='an-regional') renderRegional();
  if (targetId==='inp-credit')  renderCreditLedger();
}

// ── TOAST ──
function showToast(msg, type='ok') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = type;
  t.classList.add('show');
  setTimeout(() => { t.classList.remove('show'); }, 2400);
}

// ── MODALS ──
function openModal(id)  { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
function submitForm(id, msg, type='ok') { closeModal(id); showToast(msg, type); }

// ── LOGOUT ──
function logout() {
  sessionStorage.removeItem('tfms_user');
  window.location.href = 'index.html';
}

// ══════════════════════════════════
// DASHBOARD
// ══════════════════════════════════
function renderDashboard() {
  const farmers = getData('farmers');
  const visits  = getData('visits');
  const bales   = getData('bales');
  const inputs  = getData('inputs');
  const todayV  = visits.filter(v=>v.date===new Date().toISOString().slice(0,10));
  document.getElementById('dash-stat-farmers').textContent = farmers.length.toLocaleString();
  document.getElementById('dash-stat-visits').textContent  = todayV.length;
  document.getElementById('dash-stat-inputs').textContent  = 'MK '+Math.round(inputs.reduce((s,i)=>s+i.value,0)/1000)+'K';
  document.getElementById('dash-stat-intake').textContent  = bales.filter(b=>b.status==='accepted').reduce((s,b)=>s+b.net,0).toFixed(1)+'T';
  renderChartBars();
  renderOfficerProgress();
}

function renderChartBars() {
  const el = document.getElementById('chartBars');
  if (!el) return;
  const data = [42,58,73,65,88,94,110];
  el.innerHTML = data.map((v,i) => `<div class="chart-bar-wrap"><div class="chart-bar${i===6?' current':''}" style="height:0" data-h="${(v/120*100)}px"></div></div>`).join('');
  setTimeout(() => {
    el.querySelectorAll('.chart-bar').forEach(b => { b.style.height = b.dataset.h; });
  }, 100);
}

function renderOfficerProgress() {
  const el = document.getElementById('officerProgress');
  if (!el) return;
  el.innerHTML = FIELD_TEAM.map(t => {
    const pct = Math.round(t.done/t.target*100);
    return `<div class="officer-item">
      <div class="officer-meta"><span class="officer-name">${t.name}</span><span class="officer-count">${t.done}/${t.target}</span></div>
      <div class="officer-bar"><div class="officer-fill" style="width:${pct}%"></div></div>
      <div class="officer-zone">${t.zone}${t.done===t.target?' ✓':''}</div>
    </div>`;
  }).join('');
}

// ══════════════════════════════════
// FARMER REGISTRY
// ══════════════════════════════════
let regFilter = { q:'', district:'', status:'' };

function renderRegistry() {
  applyFarmerFilter();
}

function filterTable(q)        { regFilter.q = q.toLowerCase(); applyFarmerFilter(); }
function filterDistrict(d)     { regFilter.district = d; applyFarmerFilter(); }
function filterStatus(s)       { regFilter.status = s.toLowerCase(); applyFarmerFilter(); }

function applyFarmerFilter() {
  const all = getData('farmers');
  const list = all.filter(f => {
    const matchQ = !regFilter.q || f.name.toLowerCase().includes(regFilter.q) || f.id.toLowerCase().includes(regFilter.q) || f.district.toLowerCase().includes(regFilter.q);
    const matchD = !regFilter.district || f.district === regFilter.district;
    const matchS = !regFilter.status || f.status === regFilter.status;
    return matchQ && matchD && matchS;
  });
  const tbody = document.getElementById('farmerTbody');
  if (!tbody) return;
  tbody.innerHTML = list.slice(0,15).map(f => `
    <tr onclick="openFarmerDetail('${f.id}')">
      <td class="td-id">${f.id}</td>
      <td class="td-name">${f.name}</td>
      <td class="td-dim">${f.district}</td>
      <td class="td-dim">${f.crop}</td>
      <td style="font-family:var(--font-cond);font-weight:700;color:var(--white)">${f.ha} ha</td>
      <td><span class="status-badge status-${f.status==='active'?'active':f.status==='pending'?'pending':'suspended'}">${f.status==='active'?'Active':f.status==='pending'?'Pending':'Suspended'}</span></td>
      <td>${f.bio?'<span class="biometric-chip">✓ Enrolled</span>':'<span style="font-size:11px;color:var(--text-off)">Not enrolled</span>'}</td>
      <td class="td-dim">${f.date}</td>
    </tr>`).join('');
  const countEl = document.getElementById('farmerCount');
  if (countEl) countEl.textContent = `Showing ${Math.min(15,list.length)} of ${list.length.toLocaleString()} farmers`;
}

function openFarmerDetail(id) {
  const f = getData('farmers').find(x=>x.id===id);
  if (!f) return;
  document.getElementById('modalFarmerDetailTitle').textContent = f.name;
  document.getElementById('modalFarmerDetailBody').innerHTML = `
    <div class="form-grid">
      <div class="form-group"><label class="form-label">Grower ID</label><div style="padding:9px 12px;background:var(--surface2);border-radius:4px;font-family:var(--font-cond);font-size:13px;color:var(--gold)">${f.id}</div></div>
      <div class="form-group"><label class="form-label">Status</label><div style="padding:9px 12px;"><span class="status-badge status-${f.status==='active'?'active':f.status==='pending'?'pending':'suspended'}">${f.status}</span></div></div>
      <div class="form-group"><label class="form-label">Full Name</label><div style="padding:9px 12px;background:var(--surface2);border-radius:4px;font-size:13px;color:var(--white)">${f.name}</div></div>
      <div class="form-group"><label class="form-label">District</label><div style="padding:9px 12px;background:var(--surface2);border-radius:4px;font-size:13px;color:var(--text-dim)">${f.district}</div></div>
      <div class="form-group"><label class="form-label">Zone</label><div style="padding:9px 12px;background:var(--surface2);border-radius:4px;font-size:13px;color:var(--text-dim)">${f.zone}</div></div>
      <div class="form-group"><label class="form-label">Crop</label><div style="padding:9px 12px;background:var(--surface2);border-radius:4px;font-size:13px;color:var(--text-dim)">${f.crop}</div></div>
      <div class="form-group"><label class="form-label">Farm Size</label><div style="padding:9px 12px;background:var(--surface2);border-radius:4px;font-size:13px;color:var(--white);font-weight:600">${f.ha} ha</div></div>
      <div class="form-group"><label class="form-label">Biometric</label><div style="padding:9px 12px;">${f.bio?'<span class="biometric-chip">✓ Enrolled</span>':'<span style="color:var(--text-off)">Not enrolled</span>'}</div></div>
      <div class="form-group"><label class="form-label">Phone</label><div style="padding:9px 12px;background:var(--surface2);border-radius:4px;font-size:13px;color:var(--text-dim)">${f.phone}</div></div>
      <div class="form-group"><label class="form-label">National ID</label><div style="padding:9px 12px;background:var(--surface2);border-radius:4px;font-size:13px;color:var(--text-dim)">${f.nid}</div></div>
      <div class="form-group"><label class="form-label">Registered</label><div style="padding:9px 12px;background:var(--surface2);border-radius:4px;font-size:13px;color:var(--text-off)">${f.date}</div></div>
    </div>
    <div style="display:flex;gap:8px;padding-top:12px;border-top:1px solid var(--border);">
      ${f.status!=='suspended'?`<button class="btn-danger" onclick="toggleFarmerStatus('${f.id}','suspended')">Suspend Farmer</button>`:`<button class="btn-secondary" onclick="toggleFarmerStatus('${f.id}','active')">Reinstate Farmer</button>`}
      <button class="btn-secondary" onclick="closeModal('modalFarmerDetail')">Close</button>
    </div>`;
  openModal('modalFarmerDetail');
}

function toggleFarmerStatus(id, status) {
  updateRecord('farmers', id, 'status', status);
  closeModal('modalFarmerDetail');
  applyFarmerFilter();
  showToast(`Farmer status updated to ${status}`, status==='suspended'?'warn':'ok');
}

function submitNewFarmer() {
  const name = document.getElementById('nf-name').value.trim();
  const surname = document.getElementById('nf-surname').value.trim();
  if (!name || !surname) { showToast('Name is required', 'error'); return; }
  const dist = document.getElementById('nf-district').value;
  const crop = document.getElementById('nf-crop').value;
  const ha   = parseFloat(document.getElementById('nf-ha').value||1.0);
  const distCode = {Kasungu:'KS',Mchinji:'MC',Dowa:'DW',Lilongwe:'LL',Tete:'TE'}[dist]||'XX';
  const id = `GRW-${distCode}-${10000+Math.floor(Math.random()*9999)}`;
  const rec = { id, name:`${surname}, ${name}`, district:dist, zone:`${dist} Central`, crop, ha, status:'pending', bio:false, date:new Date().toISOString().slice(0,10), phone:'—', nid:'—' };
  addRecord('farmers', rec);
  closeModal('modalFarmer');
  applyFarmerFilter();
  showToast(`Farmer registered: ${rec.name}`, 'ok');
}

// ══════════════════════════════════
// FIELD VISITS
// ══════════════════════════════════
function renderFieldOverview() {
  const visits = getData('visits');
  const today  = new Date().toISOString().slice(0,10);
  const todayV = visits.filter(v=>v.date===today);
  document.getElementById('fv-stat-today').textContent  = todayV.length;
  document.getElementById('fv-stat-officers').textContent = FIELD_TEAM.length;
  const gapV = todayV.filter(v=>v.form==='GAP' && v.gap>0);
  const avgGap = gapV.length ? Math.round(gapV.reduce((s,v)=>s+v.gap,0)/gapV.length) : 0;
  document.getElementById('fv-stat-gap').textContent  = avgGap+'%';
  const pending = visits.filter(v=>v.status==='pending').length;
  document.getElementById('fv-stat-sync').textContent = pending;
  renderVisitCards();
}

function renderVisitCards() {
  const grid = document.getElementById('visitsGrid');
  if (!grid) return;
  grid.innerHTML = FIELD_TEAM.map((t,i) => {
    const pct = Math.round(t.done/t.target*100);
    return `<div class="visit-card" onclick="showVisitDetail(${i})">
      <div class="visit-card-top">
        <div><div class="visit-officer">${t.name}</div><div class="visit-zone">${t.zone}</div></div>
        <div><div class="visit-progress-val">${t.done}/${t.target}</div><div class="visit-progress-lbl">${pct}%</div></div>
      </div>
      <div class="visit-bar"><div class="visit-fill" style="width:${pct}%"></div></div>
      <div class="visit-meta">
        <span>${t.online?'📍 GPS Active':'📍 Offline'}</span>
        <span>📋 Forms synced</span>
      </div>
      <div style="margin-top:8px">${t.tags.map(tg=>`<span class="visit-tag">${tg}</span>`).join('')}</div>
    </div>`;
  }).join('');
}

function showVisitDetail(idx) {
  const t = FIELD_TEAM[idx];
  const el = document.getElementById('visitDetail');
  const pct = Math.round(t.done/t.target*100);
  el.innerHTML = `<div class="visit-detail-overlay">
    <div class="visit-detail-header">
      <div>
        <div style="font-family:var(--font-cond);font-size:13px;font-weight:700;color:var(--gold);text-transform:uppercase;letter-spacing:.08em">${t.name} — ${t.zone}</div>
        <div style="font-size:11px;color:var(--text-dim);margin-top:2px">Today · ${t.done}/${t.target} completed (${pct}%)</div>
      </div>
      <button class="close-detail" onclick="document.getElementById('visitDetail').innerHTML=''">Close ✕</button>
    </div>
    <div class="visit-detail-body">
      <div>
        <div class="vd-section-title">Summary</div>
        <div class="vd-row"><span class="vd-key">Officer</span><span class="vd-val">${t.name}</span></div>
        <div class="vd-row"><span class="vd-key">Role</span><span class="vd-val">${t.role}</span></div>
        <div class="vd-row"><span class="vd-key">Zone</span><span class="vd-val">${t.zone}</span></div>
        <div class="vd-row"><span class="vd-key">Progress</span><span class="vd-val">${t.done}/${t.target}</span></div>
        <div class="vd-row"><span class="vd-key">Forms</span><span class="vd-val">${t.tags.join(', ')}</span></div>
        <div class="vd-row"><span class="vd-key">GPS Status</span><span class="vd-val" style="color:${t.online?'var(--success)':'var(--warn)'}">${t.online?'Active':'Offline'}</span></div>
      </div>
      <div>
        <div class="vd-section-title">Last Visit Checklist</div>
        <div class="check-item"><span class="chk chk-pass">✓</span> Grower present and identified</div>
        <div class="check-item"><span class="chk chk-pass">✓</span> Crop condition assessed</div>
        <div class="check-item"><span class="chk chk-pass">✓</span> Fertiliser records reviewed</div>
        <div class="check-item"><span class="chk chk-pass">✓</span> Chemical storage compliant</div>
        <div class="check-item"><span class="chk chk-fail">✗</span> Curing barn ventilation — noted</div>
        <div class="check-item"><span class="chk chk-pass">✓</span> Water source protected</div>
        <div class="check-item"><span class="chk chk-na">—</span> Child labour — not applicable</div>
      </div>
    </div>
  </div>`;
  el.scrollIntoView({behavior:'smooth',block:'nearest'});
}

function renderVisitLog() {
  const visits = getData('visits');
  const tbody = document.getElementById('visitLogBody');
  if (!tbody) return;
  tbody.innerHTML = visits.map(v => `<tr onclick="showToast('Visit ${v.id}')">
    <td class="td-id">${v.id}</td>
    <td class="td-name" style="font-size:12px">${v.officer}</td>
    <td class="td-dim">${v.grower}</td>
    <td class="td-dim">${v.zone}</td>
    <td><span class="status-badge status-info">${v.form}</span></td>
    <td style="font-family:var(--font-cond);font-weight:700;color:${v.gap?'var(--success)':'var(--text-off)'}">${v.gap?v.gap+'%':'—'}</td>
    <td style="color:var(--success)">✓</td>
    <td class="td-dim">${v.date}</td>
    <td><span class="status-badge ${v.status==='synced'?'status-active':'status-pending'}">${v.status}</span></td>
  </tr>`).join('');
}

function renderSyncQueue() {
  const pending = getData('visits').filter(v=>v.status==='pending').length;
  document.getElementById('fv-sync-pending').textContent = pending;
}

// ── CHECKLIST ──
function renderChecklist(type) {
  const items = type==='GAP' ? GAP_ITEMS : ALP_ITEMS;
  items.forEach(it => { if(!checkState[it]) checkState[it]='na'; });
  const el = document.getElementById('checklistItems');
  if (!el) return;
  el.innerHTML = items.map(it => `<div class="chk-row">
    <span class="chk-row-lbl">${it}</span>
    <div class="chk-btns">
      <button class="btn-pass${checkState[it]==='pass'?' sel':''}" onclick="setCheck('${it.replace(/'/g,'\\'')}','pass',this)">Pass</button>
      <button class="btn-fail${checkState[it]==='fail'?' sel':''}" onclick="setCheck('${it.replace(/'/g,'\\'')}','fail',this)">Fail</button>
      <button class="btn-na${checkState[it]==='na'?' sel':''}"   onclick="setCheck('${it.replace(/'/g,'\\'')}','na',this)">N/A</button>
    </div>
  </div>`).join('');
}
function setCheck(item,val,btn){
  checkState[item]=val;
  btn.closest('.chk-btns').querySelectorAll('button').forEach(b=>b.classList.remove('sel'));
  btn.classList.add('sel');
}
function submitChecklist(){
  const pass=Object.values(checkState).filter(v=>v==='pass').length;
  const fail=Object.values(checkState).filter(v=>v==='fail').length;
  const score=Math.round(pass/(pass+fail+Object.values(checkState).filter(v=>v==='na').length)*100)||0;
  const today=new Date().toISOString().slice(0,10);
  const rec={id:`VIS-${Date.now()}`,officer:currentUser.name,grower:'—',farmerId:'—',zone:'—',form:'GAP',gap:score,duration:0,photo:false,gps:'—',date:today,status:'synced',notes:''};
  addRecord('visits',rec);
  checkState={};
  renderChecklist('GAP');
  showToast(`Checklist submitted · GAP Score: ${score}%`,'ok');
}

function submitNewVisit(){
  const grower=document.getElementById('nv-grower').value.trim()||'—';
  const zone=document.getElementById('nv-zone').value;
  const form=document.getElementById('nv-form').value;
  const rec={id:`VIS-${Date.now()}`,officer:currentUser.name,grower,farmerId:'—',zone,form,gap:0,duration:0,photo:false,gps:'—',date:new Date().toISOString().slice(0,10),status:'pending',notes:''};
  addRecord('visits',rec);
  closeModal('modalVisit');
  renderVisitLog();
  showToast('Visit logged','ok');
}

// ══════════════════════════════════
// INPUTS & CREDIT
// ══════════════════════════════════
function renderInputs(){
  const inputs=getData('inputs');
  const total=inputs.reduce((s,i)=>s+i.value,0);
  const pending=inputs.filter(i=>i.status==='pending').length;
  document.getElementById('inp-stat-total').textContent='MK '+Math.round(total/1000)+'K';
  document.getElementById('inp-stat-pending').textContent=pending;
  renderDispatchTable(inputs);
}

function renderDispatchTable(inputs){
  const tbody=document.getElementById('dispatchTbody');
  if(!tbody) return;
  tbody.innerHTML=inputs.map(i=>`<tr onclick="showToast('Dispatch: ${i.id}')">
    <td class="td-id">${i.id}</td>
    <td class="td-name">${i.grower}</td>
    <td class="td-dim">${i.district}</td>
    <td class="td-dim">${i.type}</td>
    <td>${i.qty}</td>
    <td style="font-family:var(--font-cond);font-weight:700;color:var(--white)">MK ${i.value.toLocaleString()}</td>
    <td><span class="status-badge ${i.status==='confirmed'?'status-active':i.status==='held'?'status-suspended':'status-pending'}">${i.status}</span></td>
    <td class="td-dim">${i.date}</td>
  </tr>`).join('');
}

function renderCreditLedger(){
  const inputs=getData('inputs');
  const bales=getData('bales');
  const tbody=document.getElementById('creditTbody');
  if(!tbody) return;
  const farmers=getData('farmers').slice(0,8);
  tbody.innerHTML=farmers.map(f=>{
    const issued=inputs.filter(i=>i.farmerId===f.id).reduce((s,i)=>s+i.value,0);
    const deducted=bales.filter(b=>b.farmerId===f.id).reduce((s,b)=>s+b.credit,0);
    const balance=issued-deducted;
    return `<tr onclick="showToast('Credit: ${f.name}')">
      <td class="td-id">${f.id}</td>
      <td class="td-name">${f.name}</td>
      <td>MK ${issued.toLocaleString()}</td>
      <td style="color:var(--success)">MK ${deducted.toLocaleString()}</td>
      <td style="color:${balance>0?'var(--warn)':'var(--success)'}; font-weight:600">MK ${balance.toLocaleString()}</td>
      <td>${balance>30000?'<span class="status-badge status-suspended">Risk Flag</span>':balance>0?'<span class="status-badge status-pending">Pending</span>':'<span class="status-badge status-active">Cleared</span>'}</td>
    </tr>`;
  }).join('');
}

function submitNewDispatch(){
  const grower=document.getElementById('nd-grower').value.trim()||'—';
  const dist=document.getElementById('nd-district').value;
  const type=document.getElementById('nd-type').value;
  const qty=document.getElementById('nd-qty').value.trim()||'1 unit';
  const val=parseInt(document.getElementById('nd-value').value)||0;
  const rec={id:`DN-${Date.now()}`,grower,farmerId:'—',district:dist,type,qty,value:val,status:'pending',date:new Date().toISOString().slice(0,10)};
  addRecord('inputs',rec);
  closeModal('modalDispatch');
  renderInputs();
  showToast('Dispatch note created','ok');
}

// ══════════════════════════════════
// FACTORY
// ══════════════════════════════════
function renderFactory(){
  const bales=getData('bales');
  const accepted=bales.filter(b=>b.status==='accepted');
  const totalNet=accepted.reduce((s,b)=>s+b.net,0);
  document.getElementById('fac-stat-intake').textContent=totalNet.toFixed(1)+'T';
  document.getElementById('fac-stat-bales').textContent=bales.length;
  document.getElementById('fac-stat-credit').textContent='MK '+Math.round(accepted.reduce((s,b)=>s+b.credit,0)/1000)+'K';
  renderBaleTable(bales.slice(0,8));
  renderGradeSummary(bales);
}

function renderBaleTable(bales){
  const tbody=document.getElementById('baleBody');
  if(!tbody) return;
  tbody.innerHTML=bales.map(b=>`<tr onclick="showToast('Bale ${b.id}')">
    <td class="td-id">${b.id}</td>
    <td style="font-size:12px">${b.grower}</td>
    <td class="bale-grade">${b.grade}</td>
    <td style="font-weight:600">${b.net}</td>
    <td class="td-dim">${b.time}</td>
    <td><span class="status-badge ${b.status==='accepted'?'status-active':'status-pending'}">${b.status}</span></td>
  </tr>`).join('');
}

function renderGradeSummary(bales){
  const el=document.getElementById('gradeSummary');
  if(!el) return;
  const grades=['B1L','B2F','B2L','B3F','B4L'];
  el.innerHTML=grades.map(g=>{
    const gb=bales.filter(b=>b.grade===g);
    const total=gb.reduce((s,b)=>s+b.net,0);
    return `<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid rgba(200,150,42,.06);font-size:12px">
      <span class="bale-grade">${g}</span>
      <span class="td-dim">${gb.length} bales</span>
      <span style="color:var(--white);font-weight:600">${total.toFixed(1)} kg</span>
    </div>`;
  }).join('');
}

function renderBaleTrace(){
  const bales=getData('bales');
  const tbody=document.getElementById('baleTraceBody');
  if(!tbody) return;
  tbody.innerHTML=bales.map(b=>`<tr onclick="showToast('Bale ${b.id}')">
    <td class="td-id">${b.id}</td>
    <td class="td-name" style="font-size:12px">${b.grower}</td>
    <td class="bale-grade">${b.grade}</td>
    <td style="font-weight:600">${b.net} kg</td>
    <td class="td-dim">${b.shift}</td>
    <td style="color:var(--gold);font-family:var(--font-cond)">MK ${b.credit.toLocaleString()}</td>
    <td><span class="status-badge ${b.status==='accepted'?'status-active':'status-pending'}">${b.status}</span></td>
  </tr>`).join('');
}

function submitNewBale(){
  const farmerId=document.getElementById('nb-farmer').value.trim()||'—';
  const grade=document.getElementById('nb-grade').value;
  const gross=parseFloat(document.getElementById('nb-gross').value||0);
  const tare=parseFloat(document.getElementById('nb-tare').value||2);
  const net=parseFloat((gross-tare).toFixed(1));
  const credit=Math.round(net*(GRADE_PRICES[grade]||0));
  const rec={id:`BL-${String(getData('bales').length+1).padStart(4,'0')}`,grower:'—',farmerId,grade,gross,tare,net,shift:'A',gate:'Gate 1',time:new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'}),credit,status:'accepted'};
  addRecord('bales',rec);
  closeModal('modalWeight');
  renderFactory();
  showToast(`Bale ${rec.id} recorded · Net: ${net}kg · MK ${credit.toLocaleString()}`,'ok');
}

// ══════════════════════════════════
// ANALYTICS
// ══════════════════════════════════
function renderAnalytics(){
  const farmers=getData('farmers');
  const visits=getData('visits');
  const bales=getData('bales').filter(b=>b.status==='accepted');
  const inputs=getData('inputs');
  document.getElementById('an-reg-val').textContent=farmers.length.toLocaleString();
  document.getElementById('an-reg-sub').textContent=`▲ ${Math.round(farmers.length/100*124.8)}% of 10,000 target`;
  const gapV=visits.filter(v=>v.form==='GAP'&&v.gap>0);
  const avgGap=gapV.length?Math.round(gapV.reduce((s,v)=>s+v.gap,0)/gapV.length):0;
  document.getElementById('an-gap-val').textContent=avgGap+'%';
  const totalIntake=bales.reduce((s,b)=>s+b.net,0);
  document.getElementById('an-intake-val').textContent=(totalIntake/1000).toFixed(1)+'T';
}

function renderRegional(){
  const tbody=document.getElementById('regionalTbody');
  if(!tbody) return;
  const districts=['Kasungu','Mchinji','Lilongwe','Dowa'];
  const farmers=getData('farmers');
  const visits=getData('visits');
  tbody.innerHTML=districts.map(d=>{
    const df=farmers.filter(f=>f.district===d).length;
    const dv=visits.filter(v=>v.zone&&v.zone.includes(d)||v.grower&&farmers.find(f=>f.district===d&&f.name===v.grower)).length;
    const scores=[91,88,74,79];
    const sc=scores[districts.indexOf(d)];
    return `<tr><td class="td-name">${d}</td><td>${df.toLocaleString()}</td><td>${dv}</td>
      <td><span class="status-badge ${sc>=85?'status-active':'status-pending'}">${sc}%</span></td>
      <td class="td-dim">MK ${[28.4,20.1,18.2,17.5][districts.indexOf(d)]}M</td>
      <td class="td-dim">${[14.2,10.4,8.8,5.2][districts.indexOf(d)]}T</td>
      <td>${[82,79,71,76][districts.indexOf(d)]}%</td>
    </tr>`;
  }).join('');
}

function exportCSV(type){
  let rows=[],filename='';
  if(type==='farmers'){
    const farmers=getData('farmers');
    rows=[['ID','Name','District','Zone','Crop','Ha','Status','Biometric','Date'],...farmers.map(f=>[f.id,f.name,f.district,f.zone,f.crop,f.ha,f.status,f.bio?'Yes':'No',f.date])];
    filename='TFMS_Farmers.csv';
  } else if(type==='visits'){
    const visits=getData('visits');
    rows=[['ID','Officer','Grower','Zone','Form','GAP%','Date','Status'],...visits.map(v=>[v.id,v.officer,v.grower,v.zone,v.form,v.gap,v.date,v.status])];
    filename='TFMS_Visits.csv';
  } else if(type==='inputs'){
    const inputs=getData('inputs');
    rows=[['ID','Grower','District','Type','Qty','Value MWK','Status','Date'],...inputs.map(i=>[i.id,i.grower,i.district,i.type,i.qty,i.value,i.status,i.date])];
    filename='TFMS_Inputs.csv';
  }
  const csv=rows.map(r=>r.map(c=>'"'+(String(c)).replace(/"/g,'""')+'"').join(',')).join('\n');
  const a=document.createElement('a');
  a.href='data:text/csv;charset=utf-8,'+encodeURIComponent(csv);
  a.download=filename; a.click();
  showToast(`Exported ${filename}`,'ok');
}
