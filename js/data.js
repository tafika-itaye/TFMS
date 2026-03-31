// ═══════════════════════════════════════════════════════════
//  FVMA — Field Visit Monitoring App
//  Seed Data · github.com/tafika-itaye/TFMS
//  © 2026 TechNexus · Blantyre, Malawi
// ═══════════════════════════════════════════════════════════

'use strict';

// ─── Role Configuration ────────────────────────────────────
const ROLES = {
  manager: {
    label: 'Manager',
    dailyTarget: 10,
    color: '#c8a400',
    icon: '👔',
    topics: [
      'Farmer performance overview',
      'GAP compliance audit',
      'Input credit recovery review',
      'Season progress evaluation',
      'Problem escalation handling',
      'Team coordination meeting',
      'Cluster production assessment',
      'Quality grading spot-check',
    ]
  },
  supervisor: {
    label: 'Supervisor',
    dailyTarget: 20,
    color: '#4aad2a',
    icon: '🧑‍💼',
    topics: [
      'Crop stage verification',
      'GAP score assessment',
      'Field input usage check',
      'Pest & disease scouting',
      'Irrigation / water management',
      'Soil health observation',
      'Harvest readiness evaluation',
      'Technician support & coaching',
      'Visit record reconciliation',
    ]
  },
  technician: {
    label: 'Field Technician',
    dailyTarget: 25,
    color: '#3b9fd4',
    icon: '🌾',
    topics: [
      'Seedbed preparation guidance',
      'Transplanting technique',
      'Fertiliser application',
      'Pesticide / fungicide spray',
      'Topping & sucker removal',
      'Curing barn setup',
      'Bale preparation briefing',
      'Record book update',
      'Credit document collection',
      'New farmer registration support',
    ]
  },
  admin: {
    label: 'Monitor / Admin',
    dailyTarget: null,
    color: '#9b7de8',
    icon: '📊',
    topics: []
  }
};

// Flag threshold — below this % triggers a red flag
const FLAG_THRESHOLD = 70;

// ─── Demo Users ────────────────────────────────────────────
const DEMO_USERS = [
  { id:'U001', username:'joao',    password:'pass123', name:'João Mussa',      role:'supervisor', region:'Tete Border Zone',  avatar:'JM' },
  { id:'U002', username:'maria',   password:'pass123', name:'Maria Nhantumbo', role:'technician', region:'Nampula Zone',       avatar:'MN' },
  { id:'U003', username:'carlos',  password:'pass123', name:'Carlos Gondwe',   role:'manager',    region:'Kasungu West',       avatar:'CG' },
  { id:'U004', username:'fatima',  password:'pass123', name:'Fatima Nkosi',    role:'technician', region:'Mchinji South',      avatar:'FN' },
  { id:'U005', username:'peter',   password:'pass123', name:'Peter Kamwendo',  role:'supervisor', region:'Dowa Cluster',       avatar:'PK' },
  { id:'U006', username:'rosa',    password:'pass123', name:'Rosa Machava',    role:'manager',    region:'Nampula Zone',       avatar:'RM' },
  { id:'U007', username:'samuel',  password:'pass123', name:'Samuel Phiri',    role:'technician', region:'Lilongwe Central',   avatar:'SP' },
  { id:'U008', username:'admin',   password:'admin123',name:'T. Itaye',        role:'admin',      region:'All Regions',        avatar:'TI' },
];

// ─── Seed Farmers ──────────────────────────────────────────
const SEED_FARMERS = [
  { id:'F001', name:'Aleke Phiri',       village:'Chulu',       district:'Kasungu',      region:'Kasungu West',     lat:-13.0050, lng:33.4850 },
  { id:'F002', name:'Grace Tembo',       village:'Mkanda',      district:'Mchinji',      region:'Mchinji South',    lat:-13.8030, lng:32.8900 },
  { id:'F003', name:'Boniface Chirwa',   village:'Mponela',     district:'Dowa',         region:'Dowa Cluster',     lat:-13.5800, lng:33.8800 },
  { id:'F004', name:'Rosa Machava',      village:'Monapo',      district:'Nampula (MZ)', region:'Nampula Zone',     lat:-15.1200, lng:39.2800 },
  { id:'F005', name:'Joseph Kalua',      village:'Linthipe',    district:'Lilongwe',     region:'Lilongwe Central', lat:-14.1000, lng:33.7700 },
  { id:'F006', name:'Fatima Nkosi',      village:'Chamama',     district:'Kasungu',      region:'Kasungu West',     lat:-13.0100, lng:33.5100 },
  { id:'F007', name:'Peter Gondwe',      village:'Kapiri',      district:'Mchinji',      region:'Mchinji South',    lat:-13.7800, lng:32.8100 },
  { id:'F008', name:'Amelia Bila',       village:'Changara',    district:'Tete (MZ)',    region:'Tete Border Zone', lat:-16.8400, lng:33.1100 },
  { id:'F009', name:'Samuel Banda',      village:'Bowe',        district:'Dowa',         region:'Dowa Cluster',     lat:-13.5500, lng:33.9000 },
  { id:'F010', name:'Mary Zuze',         village:'Nkhamenya',   district:'Kasungu',      region:'Kasungu West',     lat:-12.8800, lng:33.5500 },
  { id:'F011', name:'Charles Mwale',     village:'Kasungu Town',district:'Kasungu',      region:'Kasungu West',     lat:-13.0350, lng:33.4700 },
  { id:'F012', name:'Lucia Jere',        village:'Chikwawa',    district:'Lilongwe',     region:'Lilongwe Central', lat:-14.0800, lng:33.7500 },
  { id:'F013', name:'Elias Dzimbiri',    village:'Zulu',        district:'Mchinji',      region:'Mchinji South',    lat:-13.8200, lng:32.7800 },
  { id:'F014', name:'Tendai Moyo',       village:'Nambuma',     district:'Dowa',         region:'Dowa Cluster',     lat:-13.6000, lng:33.8600 },
  { id:'F015', name:'Anita Kamwendo',    village:'Wimbe',       district:'Kasungu',      region:'Kasungu West',     lat:-13.0200, lng:33.5000 },
  { id:'F016', name:'Damião Cumbe',      village:'Moatize',     district:'Tete (MZ)',    region:'Tete Border Zone', lat:-16.1100, lng:33.7400 },
  { id:'F017', name:'Veronica Nhlane',   village:'Meconta',     district:'Nampula (MZ)', region:'Nampula Zone',     lat:-15.0500, lng:39.8400 },
  { id:'F018', name:'Arnold Zgambo',     village:'Chikangawa',  district:'Kasungu',      region:'Kasungu West',     lat:-12.9100, lng:33.6000 },
  { id:'F019', name:'Esther Phiri',      village:'Ngona',       district:'Lilongwe',     region:'Lilongwe Central', lat:-14.1500, lng:33.7000 },
  { id:'F020', name:'Richwell Kumwenda', village:'Nsaru',       district:'Mchinji',      region:'Mchinji South',    lat:-13.7500, lng:32.9200 },
  { id:'F021', name:'Felicidade Mário',  village:'Murrupula',   district:'Nampula (MZ)', region:'Nampula Zone',     lat:-15.4700, lng:36.9800 },
  { id:'F022', name:'George Lungu',      village:'Lisasadzi',   district:'Kasungu',      region:'Kasungu West',     lat:-13.0450, lng:33.4600 },
  { id:'F023', name:'Priscilla Tembo',   village:'Madisi',      district:'Dowa',         region:'Dowa Cluster',     lat:-13.5900, lng:33.8200 },
  { id:'F024', name:'Inocêncio Silva',   village:'Ulongue',     district:'Tete (MZ)',    region:'Tete Border Zone', lat:-14.7200, lng:34.3500 },
  { id:'F025', name:'Beatrice Msiska',   village:'Kabwafu',     district:'Kasungu',      region:'Kasungu West',     lat:-12.9500, lng:33.5800 },
  { id:'F026', name:'Kenneth Nyirenda',  village:'Mkhonjeni',   district:'Mchinji',      region:'Mchinji South',    lat:-13.7200, lng:32.8500 },
  { id:'F027', name:'Clementina Nhantumbo',village:'Ribaue',    district:'Nampula (MZ)', region:'Nampula Zone',     lat:-14.9800, lng:38.2700 },
  { id:'F028', name:'Wilfred Kapalamula',village:'Kachebere',   district:'Lilongwe',     region:'Lilongwe Central', lat:-14.0300, lng:33.7200 },
  { id:'F029', name:'Patricia Nakhumwa', village:'Kaluluma',    district:'Kasungu',      region:'Kasungu West',     lat:-13.0150, lng:33.5200 },
  { id:'F030', name:'Agnaldo Patel',     village:'Cahora Bassa',district:'Tete (MZ)',    region:'Tete Border Zone', lat:-15.5800, lng:32.4200 },
];

// ─── Seed Visits (past 7 days) ─────────────────────────────
function daysAgo(n) {
  const d = new Date(); d.setDate(d.getDate() - n);
  return d.toISOString().slice(0,10);
}
function randTime(h1,h2) {
  const h = h1 + Math.floor(Math.random()*(h2-h1));
  const m = Math.floor(Math.random()*60);
  return h.toString().padStart(2,'0')+':'+m.toString().padStart(2,'0');
}
function randDuration(min,max) {
  return min + Math.floor(Math.random()*(max-min));
}

const SEED_VISITS = [
  // João (supervisor) - today: 18/20
  ...['F008','F016','F024','F030','F004','F017','F021','F027','F002','F007','F013','F020','F026','F003','F009','F014','F023','F005'].map((fid,i) => ({
    id:`V-${daysAgo(0)}-U001-${String(i+1).padStart(3,'0')}`, userId:'U001', farmerId:fid,
    date:daysAgo(0), startTime:randTime(6,15), durationMin:randDuration(18,45),
    topics:['Crop stage verification','GAP score assessment','Pest & disease scouting'].slice(0,2+Math.floor(Math.random()*2)),
    notes:'Visit completed. GAP checklist reviewed with farmer.',
    gps:{ lat:-16.84+Math.random()*0.05, lng:33.11+Math.random()*0.05 },
    trajectory:[
      { lat:-16.840, lng:33.110, t:'06:15' },
      { lat:-16.843, lng:33.114, t:'06:30' },
      { lat:-16.845, lng:33.118, t:'06:45' },
    ],
    hasPhoto: i%3===0, photoNote: i%3===0 ? 'Crop condition photographed — good leaf development.' : '',
    status:'completed', flagged:false
  })),
  // Maria (technician) - today: 25/25
  ...['F004','F017','F021','F027','F001','F006','F010','F011','F015','F018','F022','F025','F029','F002','F007','F013','F020','F026','F003','F009','F014','F023','F005','F012','F019'].map((fid,i) => ({
    id:`V-${daysAgo(0)}-U002-${String(i+1).padStart(3,'0')}`, userId:'U002', farmerId:fid,
    date:daysAgo(0), startTime:randTime(6,16), durationMin:randDuration(15,35),
    topics:['Fertiliser application','Topping & sucker removal','Record book update'].slice(0,1+Math.floor(Math.random()*3)),
    notes:'Farmer advised on correct topping height.',
    gps:{ lat:-15.12+Math.random()*0.05, lng:39.28+Math.random()*0.05 },
    trajectory:[
      { lat:-15.120, lng:39.280, t:'06:00' },
      { lat:-15.124, lng:39.284, t:'06:20' },
    ],
    hasPhoto: i%4===0, photoNote:'',
    status:'completed', flagged:false
  })),
  // Carlos (manager) - today: 6/10
  ...['F001','F006','F010','F015','F022','F025'].map((fid,i) => ({
    id:`V-${daysAgo(0)}-U003-${String(i+1).padStart(3,'0')}`, userId:'U003', farmerId:fid,
    date:daysAgo(0), startTime:randTime(7,13), durationMin:randDuration(30,60),
    topics:['GAP compliance audit','Farmer performance overview','Season progress evaluation'].slice(0,1+Math.floor(Math.random()*2)),
    notes:'Performance review conducted. Cluster on track.',
    gps:{ lat:-13.005+Math.random()*0.05, lng:33.485+Math.random()*0.05 },
    trajectory:[
      { lat:-13.005, lng:33.485, t:'07:15' },
      { lat:-13.010, lng:33.490, t:'07:45' },
    ],
    hasPhoto: i%2===0, photoNote:'Field conditions documented.',
    status:'completed', flagged:false
  })),
  // Yesterday data
  ...['F008','F016','F024','F030','F004','F017','F021','F027','F002','F007','F013','F020','F026','F003','F009','F014','F023'].map((fid,i) => ({
    id:`V-${daysAgo(1)}-U001-${String(i+1).padStart(3,'0')}`, userId:'U001', farmerId:fid,
    date:daysAgo(1), startTime:randTime(6,15), durationMin:randDuration(18,45),
    topics:['Visit record reconciliation','Field assistance topics & visit time'],
    notes:'', gps:{ lat:-16.84+Math.random()*0.04, lng:33.11+Math.random()*0.04 },
    trajectory:[], hasPhoto:false, photoNote:'', status:'completed', flagged:false
  })),
  ...Array.from({length:24},(_,i) => ({
    id:`V-${daysAgo(1)}-U002-${String(i+1).padStart(3,'0')}`, userId:'U002', farmerId:SEED_FARMERS[i%30].id,
    date:daysAgo(1), startTime:randTime(6,16), durationMin:randDuration(15,35),
    topics:['Direct farmer assistance'],
    notes:'', gps:{ lat:-15.12+Math.random()*0.05, lng:39.28+Math.random()*0.05 },
    trajectory:[], hasPhoto:false, photoNote:'', status:'completed', flagged:false
  })),
  ...Array.from({length:9},(_,i) => ({
    id:`V-${daysAgo(1)}-U003-${String(i+1).padStart(3,'0')}`, userId:'U003', farmerId:SEED_FARMERS[i%30].id,
    date:daysAgo(1), startTime:randTime(7,14), durationMin:randDuration(30,60),
    topics:['Oversight visit'],
    notes:'', gps:{ lat:-13.005+Math.random()*0.05, lng:33.485+Math.random()*0.05 },
    trajectory:[], hasPhoto:false, photoNote:'', status:'completed', flagged:false
  })),
  // Fatima (technician) - yesterday 22/25
  ...Array.from({length:22},(_,i) => ({
    id:`V-${daysAgo(1)}-U004-${String(i+1).padStart(3,'0')}`, userId:'U004', farmerId:SEED_FARMERS[i%30].id,
    date:daysAgo(1), startTime:randTime(6,16), durationMin:randDuration(15,35),
    topics:['Pesticide / fungicide spray','Seedbed preparation guidance'],
    notes:'', gps:{ lat:-13.78+Math.random()*0.04, lng:32.81+Math.random()*0.04 },
    trajectory:[], hasPhoto:false, photoNote:'', status:'completed', flagged:false
  })),
  // Peter (supervisor) - 2 days ago 14/20
  ...Array.from({length:14},(_,i) => ({
    id:`V-${daysAgo(2)}-U005-${String(i+1).padStart(3,'0')}`, userId:'U005', farmerId:SEED_FARMERS[i%30].id,
    date:daysAgo(2), startTime:randTime(6,15), durationMin:randDuration(18,45),
    topics:['Crop stage verification'],
    notes:'', gps:{ lat:-13.58+Math.random()*0.04, lng:33.88+Math.random()*0.04 },
    trajectory:[], hasPhoto:false, photoNote:'', status:'completed', flagged:true
  })),
];

// Weekly summary computed from seed (used for reports)
// ─── Constants ─────────────────────────────────────────────
const CROP_STAGES = ['Seedbed','Transplanted','Topping','Flowering','Ripening','Harvesting','Curing'];
