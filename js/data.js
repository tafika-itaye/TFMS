// ═══════════════════════════════════════════════════
// TFMS — Seed Data & Constants
// TechNexus Farmer Management System · 2026
// ═══════════════════════════════════════════════════

// ── DEMO USERS ──
const DEMO_USERS = [
  { username:'admin',    password:'tfms2026', name:'T. Itaye',         initials:'TI', role:'Administrator', roleClass:'role-admin',      target:0 },
  { username:'officer',  password:'field123', name:'M. Banda',         initials:'MB', role:'Field Officer',  roleClass:'role-technician', target:12 },
  { username:'factory',  password:'clerk123', name:'K. Phiri',         initials:'KP', role:'Factory Clerk',  roleClass:'role-clerk',      target:0 },
  { username:'finance',  password:'fin2026',  name:'R. João',          initials:'RJ', role:'Finance Officer',roleClass:'role-supervisor',  target:0 },
  { username:'joao',     password:'pass123',  name:'João Mussa',       initials:'JM', role:'Supervisor',     roleClass:'role-supervisor', target:10 },
  { username:'maria',    password:'pass123',  name:'Maria Nhantumbo',  initials:'MN', role:'Technician',     roleClass:'role-technician', target:14 },
  { username:'carlos',   password:'pass123',  name:'Carlos Gondwe',    initials:'CG', role:'Manager',        roleClass:'role-manager',    target:0 },
  { username:'fatima',   password:'pass123',  name:'Fatima Nkosi',     initials:'FN', role:'Technician',     roleClass:'role-technician', target:12 },
  { username:'peter',    password:'pass123',  name:'Peter Kamwendo',   initials:'PK', role:'Supervisor',     roleClass:'role-supervisor', target:10 },
];

// ── SEED FARMERS (30) ──
const SEED_FARMERS = [
  {id:'GRW-KS-10482',name:'Chitedze, James B.',     district:'Kasungu', zone:'Kasungu West',  crop:'Flue-cured Tobacco', ha:2.4, status:'active',    bio:true,  date:'2025-10-12',phone:'+265 991 234 567',nid:'NID-000001'},
  {id:'GRW-MC-09841',name:'Mwanza, Grace T.',        district:'Mchinji', zone:'Mchinji South', crop:'Burley Tobacco',    ha:1.8, status:'active',    bio:true,  date:'2025-10-08',phone:'+265 992 345 678',nid:'NID-000002'},
  {id:'GRW-DW-08764',name:'Phiri, Emmanuel K.',      district:'Dowa',    zone:'Dowa Cluster',  crop:'Flue-cured Tobacco', ha:3.1, status:'active',    bio:true,  date:'2025-10-15',phone:'+265 993 456 789',nid:'NID-000003'},
  {id:'GRW-LL-07391',name:'Nkhata, Lucia M.',        district:'Lilongwe',zone:'Lilongwe Rural',crop:'Maize / Groundnuts', ha:1.2, status:'pending',   bio:false, date:'2025-11-03',phone:'+265 994 567 890',nid:'NID-000004'},
  {id:'GRW-KS-10479',name:'Tembo, Patrick J.',       district:'Kasungu', zone:'Kasungu West',  crop:'Burley Tobacco',    ha:2.0, status:'suspended', bio:true,  date:'2025-10-10',phone:'+265 995 678 901',nid:'NID-000005'},
  {id:'GRW-MC-09712',name:'Banda, Florence M.',      district:'Mchinji', zone:'Mchinji South', crop:'Flue-cured Tobacco', ha:2.8, status:'active',    bio:true,  date:'2025-10-06',phone:'+265 996 789 012',nid:'NID-000006'},
  {id:'GRW-DW-08832',name:'Chilowa, Robert A.',      district:'Dowa',    zone:'Dowa Cluster',  crop:'Burley Tobacco',    ha:1.6, status:'active',    bio:true,  date:'2025-10-18',phone:'+265 997 890 123',nid:'NID-000007'},
  {id:'GRW-LL-07254',name:'Gondwe, Mary C.',         district:'Lilongwe',zone:'Lilongwe Rural',crop:'Flue-cured Tobacco', ha:2.2, status:'active',    bio:true,  date:'2025-10-22',phone:'+265 998 901 234',nid:'NID-000008'},
  {id:'GRW-KS-10391',name:'Mbewe, George T.',        district:'Kasungu', zone:'Kasungu East',  crop:'Burley Tobacco',    ha:3.4, status:'active',    bio:true,  date:'2025-09-28',phone:'+265 999 012 345',nid:'NID-000009'},
  {id:'GRW-MC-09654',name:'Kaunda, Alice B.',        district:'Mchinji', zone:'Mchinji South', crop:'Flue-cured Tobacco', ha:1.9, status:'active',    bio:false, date:'2025-10-14',phone:'+265 991 123 456',nid:'NID-000010'},
  {id:'GRW-DW-08714',name:'Zuze, Daniel K.',         district:'Dowa',    zone:'Dowa Cluster',  crop:'Maize / Tobacco',   ha:2.6, status:'active',    bio:true,  date:'2025-10-09',phone:'+265 992 234 567',nid:'NID-000011'},
  {id:'GRW-LL-07182',name:'Mhango, Violet J.',       district:'Lilongwe',zone:'Lilongwe Rural',crop:'Flue-cured Tobacco', ha:1.4, status:'pending',   bio:false, date:'2025-11-12',phone:'+265 993 345 678',nid:'NID-000012'},
  {id:'GRW-KS-10348',name:'Phoya, Samuel R.',        district:'Kasungu', zone:'Kasungu West',  crop:'Burley Tobacco',    ha:2.1, status:'active',    bio:true,  date:'2025-10-05',phone:'+265 994 456 789',nid:'NID-000013'},
  {id:'GRW-MC-09590',name:'Chirwa, Esther P.',       district:'Mchinji', zone:'Mchinji South', crop:'Flue-cured Tobacco', ha:3.0, status:'active',    bio:true,  date:'2025-10-11',phone:'+265 995 567 890',nid:'NID-000014'},
  {id:'GRW-DW-08671',name:'Msiska, Henry C.',        district:'Dowa',    zone:'Dowa Cluster',  crop:'Burley Tobacco',    ha:1.7, status:'active',    bio:true,  date:'2025-10-16',phone:'+265 996 678 901',nid:'NID-000015'},
  {id:'GRW-KS-10290',name:'Lungu, Beatrice A.',      district:'Kasungu', zone:'Kasungu East',  crop:'Flue-cured Tobacco', ha:2.3, status:'active',    bio:true,  date:'2025-10-20',phone:'+265 997 789 012',nid:'NID-000016'},
  {id:'GRW-MC-09501',name:'Kalonga, Peter M.',       district:'Mchinji', zone:'Mchinji North', crop:'Burley Tobacco',    ha:1.5, status:'active',    bio:true,  date:'2025-10-23',phone:'+265 998 890 123',nid:'NID-000017'},
  {id:'GRW-TE-06842',name:'Mussa, João C.',          district:'Tete',    zone:'Tete Border',   crop:'Flue-cured Tobacco', ha:4.2, status:'active',    bio:true,  date:'2025-10-03',phone:'+258 84 123 456',nid:'NID-000018'},
  {id:'GRW-TE-06799',name:'Nhantumbo, Maria F.',     district:'Tete',    zone:'Tete Border',   crop:'Burley Tobacco',    ha:2.7, status:'active',    bio:true,  date:'2025-10-07',phone:'+258 84 234 567',nid:'NID-000019'},
  {id:'GRW-LL-07094',name:'Nkosi, Fatima L.',        district:'Lilongwe',zone:'Lilongwe Rural',crop:'Flue-cured Tobacco', ha:1.8, status:'active',    bio:true,  date:'2025-10-25',phone:'+265 999 901 234',nid:'NID-000020'},
  {id:'GRW-KS-10208',name:'Kamwendo, Peter D.',      district:'Kasungu', zone:'Kasungu West',  crop:'Burley Tobacco',    ha:2.9, status:'active',    bio:true,  date:'2025-10-17',phone:'+265 991 012 345',nid:'NID-000021'},
  {id:'GRW-DW-08598',name:'Nyirenda, John B.',       district:'Dowa',    zone:'Dowa North',    crop:'Flue-cured Tobacco', ha:1.6, status:'pending',   bio:false, date:'2025-11-08',phone:'+265 992 123 456',nid:'NID-000022'},
  {id:'GRW-MC-09430',name:'Mkandawire, Clara T.',    district:'Mchinji', zone:'Mchinji South', crop:'Maize / Tobacco',   ha:2.0, status:'active',    bio:true,  date:'2025-10-19',phone:'+265 993 234 567',nid:'NID-000023'},
  {id:'GRW-KS-10147',name:'Zimba, Andrew K.',        district:'Kasungu', zone:'Kasungu East',  crop:'Flue-cured Tobacco', ha:3.3, status:'active',    bio:true,  date:'2025-10-02',phone:'+265 994 345 678',nid:'NID-000024'},
  {id:'GRW-LL-06980',name:'Phiri, Agnes M.',         district:'Lilongwe',zone:'Lilongwe Rural',crop:'Burley Tobacco',    ha:1.4, status:'active',    bio:true,  date:'2025-10-28',phone:'+265 995 456 789',nid:'NID-000025'},
  {id:'GRW-TE-06701',name:'Simango, Carlos R.',      district:'Tete',    zone:'Tete Border',   crop:'Flue-cured Tobacco', ha:3.8, status:'active',    bio:true,  date:'2025-09-30',phone:'+258 84 345 678',nid:'NID-000026'},
  {id:'GRW-DW-08521',name:'Phiri, Grace N.',         district:'Dowa',    zone:'Dowa Cluster',  crop:'Flue-cured Tobacco', ha:2.1, status:'active',    bio:true,  date:'2025-10-21',phone:'+265 996 567 890',nid:'NID-000027'},
  {id:'GRW-KS-10089',name:'Mwale, Richard J.',       district:'Kasungu', zone:'Kasungu West',  crop:'Burley Tobacco',    ha:1.8, status:'suspended', bio:true,  date:'2025-10-04',phone:'+265 997 678 901',nid:'NID-000028'},
  {id:'GRW-MC-09360',name:'Tembo, Sarah B.',         district:'Mchinji', zone:'Mchinji North', crop:'Flue-cured Tobacco', ha:2.4, status:'active',    bio:true,  date:'2025-10-26',phone:'+265 998 789 012',nid:'NID-000029'},
  {id:'GRW-LL-06892',name:'Banda, Daniel P.',        district:'Lilongwe',zone:'Lilongwe Rural',crop:'Maize / Groundnuts', ha:1.6, status:'active',    bio:false, date:'2025-11-01',phone:'+265 999 890 123',nid:'NID-000030'},
];

// ── SEED FIELD VISITS (14) ──
const today = new Date().toISOString().slice(0,10);
const SEED_VISITS = [
  {id:'VIS-2026-1084',officer:'T. Itaye',    grower:'Chitedze, James B.',   farmerId:'GRW-KS-10482',zone:'Kasungu West',  form:'GAP',gap:94,duration:45,photo:true,gps:'-13.0124, 33.4821',date:today,   status:'synced',notes:'Curing barn ventilation needs improvement.'},
  {id:'VIS-2026-1083',officer:'M. Banda',    grower:'Mwanza, Grace T.',     farmerId:'GRW-MC-09841',zone:'Mchinji South', form:'GAP',gap:88,duration:38,photo:true,gps:'-13.8120, 32.9040',date:today,   status:'synced',notes:'All GAP criteria met.'},
  {id:'VIS-2026-1082',officer:'P. Mussa',    grower:'Phiri, Emmanuel K.',   farmerId:'GRW-DW-08764',zone:'Dowa Cluster',  form:'ALP',gap:0, duration:52,photo:true,gps:'-13.6540, 33.9200',date:today,   status:'pending',notes:'ALP assessment — labour rights discussed.'},
  {id:'VIS-2026-1081',officer:'R. João',     grower:'Banda, Florence M.',   farmerId:'GRW-MC-09712',zone:'Tete Border',   form:'GAP',gap:100,duration:40,photo:true,gps:'-15.1200, 32.4500',date:today,  status:'synced',notes:'Excellent compliance. Model farm.'},
  {id:'VIS-2026-1080',officer:'T. Itaye',    grower:'Tembo, Patrick J.',    farmerId:'GRW-KS-10479',zone:'Kasungu West',  form:'GAP',gap:72,duration:35,photo:false,gps:'-13.0450, 33.4990',date:today,  status:'synced',notes:'Chemical storage non-compliant. Follow-up required.'},
  {id:'VIS-2026-1079',officer:'C. Mkandawire',grower:'Chilowa, Robert A.', farmerId:'GRW-DW-08832',zone:'Kasungu East',  form:'GAP',gap:85,duration:42,photo:true,gps:'-13.1020, 33.5800',date:today,   status:'pending',notes:'Water source protection adequate.'},
  {id:'VIS-2026-1078',officer:'B. Nyirenda', grower:'Gondwe, Mary C.',      farmerId:'GRW-LL-07254',zone:'Lilongwe Rural',form:'ODK',gap:0, duration:30,photo:true,gps:'-13.9600, 33.7800',date:today,   status:'pending',notes:'ODK custom form submitted.'},
  {id:'VIS-2026-1077',officer:'T. Itaye',    grower:'Mbewe, George T.',     farmerId:'GRW-KS-10391',zone:'Kasungu East',  form:'GAP',gap:91,duration:48,photo:true,gps:'-13.0820, 33.5200',date:today,   status:'synced',notes:'Good crop condition.'},
  {id:'VIS-2026-1076',officer:'M. Banda',    grower:'Kaunda, Alice B.',     farmerId:'GRW-MC-09654',zone:'Mchinji South', form:'GAP',gap:79,duration:36,photo:false,gps:'-13.8400, 32.8800',date:today,  status:'synced',notes:'Fertiliser records incomplete.'},
  {id:'VIS-2026-1075',officer:'P. Mussa',    grower:'Zuze, Daniel K.',      farmerId:'GRW-DW-08714',zone:'Dowa Cluster',  form:'GAP',gap:83,duration:44,photo:true,gps:'-13.6900, 33.9500',date:today,   status:'pending',notes:'Mixed crop farm reviewed.'},
  {id:'VIS-2026-1074',officer:'R. João',     grower:'Mussa, João C.',       farmerId:'GRW-TE-06842',zone:'Tete Border',   form:'GAP',gap:96,duration:55,photo:true,gps:'-15.0800, 32.4200',date:today,   status:'synced',notes:'Top GAP score this week.'},
  {id:'VIS-2026-1073',officer:'T. Itaye',    grower:'Nhantumbo, Maria F.',  farmerId:'GRW-TE-06799',zone:'Kasungu West',  form:'ALP',gap:0, duration:50,photo:true,gps:'-13.0200, 33.5100',date:today,   status:'synced',notes:'ALP completed. No child labour observed.'},
  {id:'VIS-2026-1072',officer:'M. Banda',    grower:'Chirwa, Esther P.',    farmerId:'GRW-MC-09590',zone:'Mchinji South', form:'GAP',gap:90,duration:40,photo:true,gps:'-13.8100, 32.9100',date:today,   status:'synced',notes:''},
  {id:'VIS-2026-1071',officer:'C. Mkandawire',grower:'Phoya, Samuel R.',   farmerId:'GRW-KS-10348',zone:'Kasungu East',  form:'GAP',gap:87,duration:38,photo:true,gps:'-13.1100, 33.5600',date:today,   status:'synced',notes:'Crop condition good.'},
];

// ── SEED INPUTS (15) ──
const SEED_INPUTS = [
  {id:'DN-2026-0847',grower:'Chitedze, James B.',farmerId:'GRW-KS-10482',district:'Kasungu', type:'Fertiliser (23:21:0)',qty:'2 × 50kg',   value:28400,status:'confirmed',date:'2026-03-18'},
  {id:'DN-2026-0846',grower:'Mwanza, Grace T.',  farmerId:'GRW-MC-09841',district:'Mchinji', type:'Seed (Flue-cured)',  qty:'3 × 100g pkt',value:9600, status:'pending',  date:'2026-03-18'},
  {id:'DN-2026-0845',grower:'Phiri, Emmanuel K.',farmerId:'GRW-DW-08764',district:'Dowa',    type:'Chemical (Ridomil)',qty:'4 × 1L',       value:44000,status:'confirmed',date:'2026-03-17'},
  {id:'DN-2026-0844',grower:'Nkhata, Lucia M.',  farmerId:'GRW-LL-07391',district:'Lilongwe',type:'Fertiliser (CAN)',  qty:'4 × 50kg',    value:56000,status:'confirmed',date:'2026-03-17'},
  {id:'DN-2026-0843',grower:'Tembo, Patrick J.', farmerId:'GRW-KS-10479',district:'Kasungu', type:'Seed (Burley)',     qty:'2 × 100g pkt',value:6400, status:'held',     date:'2026-03-16'},
  {id:'DN-2026-0842',grower:'Banda, Florence M.',farmerId:'GRW-MC-09712',district:'Mchinji', type:'Fertiliser (23:21:0)',qty:'3 × 50kg',  value:42600,status:'confirmed',date:'2026-03-16'},
  {id:'DN-2026-0841',grower:'Chilowa, Robert A.',farmerId:'GRW-DW-08832',district:'Dowa',    type:'Seed (Flue-cured)', qty:'2 × 100g pkt',value:6400, status:'confirmed',date:'2026-03-15'},
  {id:'DN-2026-0840',grower:'Gondwe, Mary C.',   farmerId:'GRW-LL-07254',district:'Lilongwe',type:'Chemical (Ridomil)',qty:'2 × 1L',      value:22000,status:'confirmed',date:'2026-03-15'},
  {id:'DN-2026-0839',grower:'Mbewe, George T.',  farmerId:'GRW-KS-10391',district:'Kasungu', type:'Fertiliser (CAN)', qty:'5 × 50kg',    value:70000,status:'confirmed',date:'2026-03-14'},
  {id:'DN-2026-0838',grower:'Kaunda, Alice B.',  farmerId:'GRW-MC-09654',district:'Mchinji', type:'Seed (Burley)',     qty:'3 × 100g pkt',value:9600, status:'pending',  date:'2026-03-14'},
  {id:'DN-2026-0837',grower:'Zuze, Daniel K.',   farmerId:'GRW-DW-08714',district:'Dowa',    type:'Fertiliser (23:21:0)',qty:'4 × 50kg', value:56800,status:'confirmed',date:'2026-03-13'},
  {id:'DN-2026-0836',grower:'Msiska, Henry C.',  farmerId:'GRW-DW-08671',district:'Dowa',    type:'Seed (Flue-cured)', qty:'2 × 100g pkt',value:6400, status:'confirmed',date:'2026-03-13'},
  {id:'DN-2026-0835',grower:'Lungu, Beatrice A.',farmerId:'GRW-KS-10290',district:'Kasungu', type:'Fertiliser (CAN)', qty:'3 × 50kg',    value:42000,status:'confirmed',date:'2026-03-12'},
  {id:'DN-2026-0834',grower:'Chirwa, Esther P.', farmerId:'GRW-MC-09590',district:'Mchinji', type:'Chemical (Ridomil)',qty:'3 × 1L',      value:33000,status:'confirmed',date:'2026-03-12'},
  {id:'DN-2026-0833',grower:'Phoya, Samuel R.',  farmerId:'GRW-KS-10348',district:'Kasungu', type:'Seed (Burley)',     qty:'2 × 100g pkt',value:6400, status:'confirmed',date:'2026-03-11'},
];

// ── SEED BALES (10) ──
const SEED_BALES = [
  {id:'BL-0247',grower:'Chitedze, James B.',farmerId:'GRW-KS-10482',grade:'B2L',gross:184.4,tare:2.0,net:182.4,shift:'A',gate:'Gate 1',time:'13:42',credit:38304,status:'accepted'},
  {id:'BL-0246',grower:'Mwanza, Grace T.',  farmerId:'GRW-MC-09841',grade:'B3F',gross:178.8,tare:2.0,net:176.8,shift:'A',gate:'Gate 1',time:'13:28',credit:28288,status:'accepted'},
  {id:'BL-0245',grower:'Phiri, Emmanuel K.',farmerId:'GRW-DW-08764',grade:'B1L',gross:192.2,tare:2.0,net:190.2,shift:'A',gate:'Gate 2',time:'13:15',credit:53256,status:'accepted'},
  {id:'BL-0244',grower:'Banda, Florence M.',farmerId:'GRW-MC-09712',grade:'B2F',gross:170.0,tare:2.0,net:168.0,shift:'A',gate:'Gate 1',time:'12:58',credit:40320,status:'accepted'},
  {id:'BL-0243',grower:'Tembo, Patrick J.', farmerId:'GRW-KS-10479',grade:'B4L',gross:157.6,tare:2.0,net:155.6,shift:'A',gate:'Gate 2',time:'12:41',credit:0,    status:'qc-hold'},
  {id:'BL-0242',grower:'Mbewe, George T.',  farmerId:'GRW-KS-10391',grade:'B1L',gross:200.4,tare:2.0,net:198.4,shift:'A',gate:'Gate 1',time:'12:20',credit:55552,status:'accepted'},
  {id:'BL-0241',grower:'Chirwa, Esther P.', farmerId:'GRW-MC-09590',grade:'B2L',gross:174.8,tare:2.0,net:172.8,shift:'A',gate:'Gate 1',time:'11:55',credit:36288,status:'accepted'},
  {id:'BL-0240',grower:'Mussa, João C.',    farmerId:'GRW-TE-06842',grade:'B2F',gross:188.0,tare:2.0,net:186.0,shift:'A',gate:'Gate 3',time:'11:34',credit:44640,status:'accepted'},
  {id:'BL-0239',grower:'Phoya, Samuel R.',  farmerId:'GRW-KS-10348',grade:'B3F',gross:162.0,tare:2.0,net:160.0,shift:'A',gate:'Gate 1',time:'11:10',credit:25600,status:'accepted'},
  {id:'BL-0238',grower:'Gondwe, Mary C.',   farmerId:'GRW-LL-07254',grade:'B2L',gross:180.0,tare:2.0,net:178.0,shift:'A',gate:'Gate 1',time:'10:48',credit:37380,status:'accepted'},
];

// ── FIELD TEAM ──
const FIELD_TEAM = [
  {name:'T. Itaye',     initials:'TI', role:'Supervisor',   color:'#c8962a', target:16, done:14, zone:'Kasungu West',   tags:['GAP','ALP'], online:true},
  {name:'M. Banda',     initials:'MB', role:'Technician',   color:'#4a7c4a', target:12, done:11, zone:'Mchinji South',  tags:['GAP'],       online:true},
  {name:'P. Mussa',     initials:'PM', role:'Technician',   color:'#4caf7d', target:12, done:7,  zone:'Dowa Cluster',   tags:['ALP'],       online:false},
  {name:'R. João',      initials:'RJ', role:'Supervisor',   color:'#e0b84a', target:9,  done:9,  zone:'Tete Border',    tags:['GAP','ALP'], online:true},
  {name:'C. Mkandawire',initials:'CM', role:'Technician',   color:'#8b6340', target:14, done:10, zone:'Kasungu East',   tags:['GAP'],       online:false},
  {name:'B. Nyirenda',  initials:'BN', role:'Technician',   color:'#4a7c4a', target:10, done:5,  zone:'Lilongwe Rural', tags:['ODK'],       online:false},
];

// ── GRADE PRICES ──
const GRADE_PRICES = {B1L:2800,B2F:2400,B2L:2100,B3F:1600,B4L:900};
const GRADE_DESC   = {B1L:'Best Leaf — Bright',B2F:'Second Leaf — Fine',B2L:'Second Leaf — Standard',B3F:'Third Leaf — Fine',B4L:'Lower Grade Leaf'};

// ── GAP CHECKLIST ITEMS ──
const GAP_ITEMS = [
  'Grower present and verified by ID',
  'Crop condition assessed',
  'Fertiliser application records reviewed',
  'Chemical storage compliant',
  'Curing barn ventilation checked',
  'Water source adequately protected',
  'PPE usage observed',
  'Child labour — not observed',
  'Land title / lease verified',
  'Soil management practices reviewed',
];
const ALP_ITEMS = [
  'Labour rights briefing conducted',
  'Working conditions observed',
  'Wage records reviewed',
  'Housing standards met',
  'Community engagement confirmed',
  'Grievance mechanism communicated',
];

// ── STORAGE HELPERS ──
function storeGet(key)    { try { const v=localStorage.getItem('tfms_'+key); return v?JSON.parse(v):null; } catch(e){ return null; } }
function storeSet(key,val){ try { localStorage.setItem('tfms_'+key, JSON.stringify(val)); } catch(e){} }

function loadData() {
  if (!storeGet('farmers'))  storeSet('farmers',  SEED_FARMERS);
  if (!storeGet('visits'))   storeSet('visits',   SEED_VISITS);
  if (!storeGet('inputs'))   storeSet('inputs',   SEED_INPUTS);
  if (!storeGet('bales'))    storeSet('bales',    SEED_BALES);
}

function getData(key)        { return storeGet(key) || []; }
function addRecord(key, rec) { const arr=getData(key); arr.unshift(rec); storeSet(key,arr); }
function updateRecord(key, id, field, val) {
  const arr=getData(key);
  const item=arr.find(r=>r.id===id);
  if(item){ item[field]=val; storeSet(key,arr); }
}

// initialise
loadData();
