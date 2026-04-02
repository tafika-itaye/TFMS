/* ═══════════════════════════════════════════════════════
   TFMS — TechNexus Farmer Management System
   Main Application · React 18 + Recharts
   © 2026 TechNexus MW — All rights reserved
   ═══════════════════════════════════════════════════════ */

const { useState, useEffect, useRef, useCallback } = React;
const {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} = Recharts;

/* ──────────────────────────────────────────────────────
   SVG ICONS (inline, no external dependency)
   ────────────────────────────────────────────────────── */
const Icon = ({ name, size = 16, className = '' }) => {
  const s = { width: size, height: size, fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const paths = {
    home: <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>,
    users: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
    'map-pin': <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></>,
    leaf: <><path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 20 .5 20 .5s-4.8 10.1-6 15.5"/><path d="M10.2 12a13 13 0 0 1 7.8-7"/></>,
    truck: <><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></>,
    'file-text': <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>,
    search: <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
    bell: <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>,
    plus: <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    'chevron-right': <><polyline points="9 18 15 12 9 6"/></>,
    'check-circle': <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></>,
    'alert-triangle': <><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
    'x-circle': <><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></>,
    'arrow-up': <><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></>,
    'arrow-down': <><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></>,
    phone: <><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></>,
    eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
    edit: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    play: <><polygon points="5 3 19 12 5 21 5 3"/></>,
    pause: <><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></>,
    square: <><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/></>,
    navigation: <><polygon points="3 11 22 2 13 21 11 13 3 11"/></>,
    calendar: <><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
    'trending-up': <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></>,
    package: <><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></>,
    'bar-chart': <><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></>,
    x: <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>,
    'refresh-cw': <><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></>,
    sun: <><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></>,
    cloud: <><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></>,
    droplets: <><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></>,
    thermometer: <><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></>,
    activity: <><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></>,
    award: <><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></>,
    globe: <><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></>,
    user: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
    'log-out': <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
    'help-circle': <><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
    filter: <><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></>,
  };
  return <svg viewBox="0 0 24 24" style={s} className={className}>{paths[name] || null}</svg>;
};


/* ──────────────────────────────────────────────────────
   DUMMY DATA
   ────────────────────────────────────────────────────── */
const REGIONS = ['Lilongwe','Blantyre','Mzuzu','Zomba','Mangochi','Salima','Kasungu','Nkhotakota','Dedza','Ntcheu'];
const STATUSES = ['Active','Pending','Suspended'];

const farmers = [
  { id:'TNF-0001',name:'Chikondi Banda',gender:'M',age:42,region:'Lilongwe',district:'Dowa',village:'Mvera',phone:'+265 991 234 567',hectares:3.5,crop:'Burley Tobacco',status:'Active',registered:'2024-03-15',lastVisit:'2026-03-28',yield:2850,grade:'A',club:'Mvera Growers Club' },
  { id:'TNF-0002',name:'Grace Mwale',gender:'F',age:35,region:'Kasungu',district:'Kasungu',village:'Chamama',phone:'+265 888 345 678',hectares:2.0,crop:'Burley Tobacco',status:'Active',registered:'2024-05-20',lastVisit:'2026-03-25',yield:1920,grade:'B+',club:'Chamama Cooperative' },
  { id:'TNF-0003',name:'James Phiri',gender:'M',age:55,region:'Mzuzu',district:'Rumphi',village:'Bolero',phone:'+265 995 456 789',hectares:5.0,crop:'Flue-Cured Tobacco',status:'Active',registered:'2023-11-10',lastVisit:'2026-03-20',yield:4200,grade:'A+',club:'Bolero Estate Farmers' },
  { id:'TNF-0004',name:'Esther Gondwe',gender:'F',age:28,region:'Blantyre',district:'Thyolo',village:'Luchenza',phone:'+265 882 567 890',hectares:1.5,crop:'Maize',status:'Active',registered:'2025-01-08',lastVisit:'2026-03-15',yield:980,grade:'B',club:'Luchenza Women Farmers' },
  { id:'TNF-0005',name:'Patrick Kamanga',gender:'M',age:48,region:'Zomba',district:'Zomba',village:'Domasi',phone:'+265 999 678 901',hectares:4.0,crop:'Groundnuts',status:'Pending',registered:'2025-06-12',lastVisit:'2026-02-28',yield:3100,grade:'A',club:'Domasi Progressive' },
  { id:'TNF-0006',name:'Mercy Nkhoma',gender:'F',age:31,region:'Salima',district:'Salima',village:'Chipoka',phone:'+265 884 789 012',hectares:2.5,crop:'Rice',status:'Active',registered:'2024-08-25',lastVisit:'2026-03-30',yield:2100,grade:'B+',club:'Chipoka Irrigation' },
  { id:'TNF-0007',name:'Daniel Moyo',gender:'M',age:60,region:'Mangochi',district:'Mangochi',village:'Monkey Bay',phone:'+265 993 890 123',hectares:6.0,crop:'Cotton',status:'Active',registered:'2023-07-01',lastVisit:'2026-03-18',yield:5400,grade:'A+',club:'Mangochi Cotton Assoc.' },
  { id:'TNF-0008',name:'Ruth Chirwa',gender:'F',age:38,region:'Dedza',district:'Dedza',village:'Lobi',phone:'+265 886 901 234',hectares:2.0,crop:'Soybeans',status:'Active',registered:'2024-12-03',lastVisit:'2026-03-22',yield:1650,grade:'B',club:'Lobi Soybean Growers' },
  { id:'TNF-0009',name:'Moses Chilima',gender:'M',age:44,region:'Ntcheu',district:'Ntcheu',village:'Tsangano',phone:'+265 997 012 345',hectares:3.0,crop:'Pigeon Peas',status:'Suspended',registered:'2024-02-17',lastVisit:'2025-12-10',yield:0,grade:'—',club:'Tsangano Farmers Union' },
  { id:'TNF-0010',name:'Tiyanjane Mkandawire',gender:'F',age:26,region:'Nkhotakota',district:'Nkhotakota',village:'Dwangwa',phone:'+265 880 123 456',hectares:1.8,crop:'Maize',status:'Active',registered:'2025-09-01',lastVisit:'2026-03-29',yield:1200,grade:'B+',club:'Dwangwa Youth Farmers' },
  { id:'TNF-0011',name:'Kondwani Jere',gender:'M',age:50,region:'Kasungu',district:'Kasungu',village:'Santhe',phone:'+265 992 234 567',hectares:4.5,crop:'Burley Tobacco',status:'Active',registered:'2023-04-20',lastVisit:'2026-03-27',yield:3800,grade:'A',club:'Santhe Leaf Growers' },
  { id:'TNF-0012',name:'Flora Maseko',gender:'F',age:33,region:'Lilongwe',district:'Lilongwe',village:'Mitundu',phone:'+265 885 345 678',hectares:2.2,crop:'Groundnuts',status:'Active',registered:'2024-10-15',lastVisit:'2026-03-26',yield:1750,grade:'B+',club:'Mitundu Cooperative' },
];

const fieldVisits = [
  { id:'FV-2026-0089',farmerId:'TNF-0001',farmer:'Chikondi Banda',region:'Lilongwe',type:'Crop Inspection',status:'Scheduled',date:'2026-04-03',officer:'Stephen Sembereka',notes:'Mid-season leaf quality check',lat:-13.9626,lng:33.7741 },
  { id:'FV-2026-0090',farmerId:'TNF-0003',farmer:'James Phiri',region:'Mzuzu',type:'Curing Assessment',status:'Scheduled',date:'2026-04-04',officer:'Tafika Itaye',notes:'Inspect curing barns and flue equipment',lat:-10.4955,lng:33.8625 },
  { id:'FV-2026-0091',farmerId:'TNF-0006',farmer:'Mercy Nkhoma',region:'Salima',type:'Input Distribution',status:'In Progress',date:'2026-04-02',officer:'Netty Mkwamba',notes:'Delivering fertiliser allocation — 2nd tranche',lat:-13.7803,lng:34.4587 },
  { id:'FV-2026-0092',farmerId:'TNF-0007',farmer:'Daniel Moyo',region:'Mangochi',type:'Harvest Planning',status:'Completed',date:'2026-03-30',officer:'Stephen Sembereka',notes:'Confirmed 5.4T expected yield. Logistics arranged.',lat:-14.4783,lng:35.2644 },
  { id:'FV-2026-0093',farmerId:'TNF-0011',farmer:'Kondwani Jere',region:'Kasungu',type:'Crop Inspection',status:'Scheduled',date:'2026-04-05',officer:'Tafika Itaye',notes:'Post-topping leaf development assessment',lat:-12.9968,lng:33.4518 },
  { id:'FV-2026-0094',farmerId:'TNF-0002',farmer:'Grace Mwale',region:'Kasungu',type:'Pest Management',status:'Completed',date:'2026-03-25',officer:'Stephen Sembereka',notes:'Aphid treatment applied. Follow-up in 14 days.',lat:-13.0143,lng:33.4831 },
  { id:'FV-2026-0095',farmerId:'TNF-0004',farmer:'Esther Gondwe',region:'Blantyre',type:'Training Session',status:'Scheduled',date:'2026-04-06',officer:'Netty Mkwamba',notes:'Conservation agriculture techniques workshop',lat:-15.9230,lng:35.4989 },
];

const deliveries = [
  { id:'DL-0045',farmer:'James Phiri',crop:'Flue-Cured Tobacco',weight:'1,250 kg',grade:'A+',depot:'Mzuzu Auction Floor',date:'2026-03-18',status:'Sold',value:'MK 4,875,000' },
  { id:'DL-0046',farmer:'Chikondi Banda',crop:'Burley Tobacco',weight:'890 kg',grade:'A',depot:'Lilongwe Auction Floor',date:'2026-03-20',status:'Graded',value:'MK 2,847,000' },
  { id:'DL-0047',farmer:'Kondwani Jere',crop:'Burley Tobacco',weight:'1,100 kg',grade:'A',depot:'Lilongwe Auction Floor',date:'2026-03-22',status:'In Transit',value:'—' },
  { id:'DL-0048',farmer:'Daniel Moyo',crop:'Cotton',weight:'2,300 kg',grade:'A+',depot:'Blantyre Ginning Factory',date:'2026-03-28',status:'Delivered',value:'MK 3,220,000' },
  { id:'DL-0049',farmer:'Grace Mwale',crop:'Burley Tobacco',weight:'640 kg',grade:'B+',depot:'Kasungu Depot',date:'2026-03-30',status:'Pending',value:'—' },
  { id:'DL-0050',farmer:'Mercy Nkhoma',crop:'Rice',weight:'1,800 kg',grade:'A',depot:'Salima Warehouse',date:'2026-03-31',status:'Delivered',value:'MK 1,440,000' },
];

const monthlyYield = [
  { month:'Oct',tobacco:0,maize:0,other:0 },
  { month:'Nov',tobacco:120,maize:0,other:80 },
  { month:'Dec',tobacco:450,maize:200,other:180 },
  { month:'Jan',tobacco:1200,maize:600,other:350 },
  { month:'Feb',tobacco:2800,maize:1400,other:620 },
  { month:'Mar',tobacco:4500,maize:2100,other:890 },
  { month:'Apr',tobacco:3200,maize:1800,other:750 },
];

const regionBreakdown = [
  { name:'Lilongwe',farmers:284,hectares:820 },
  { name:'Kasungu',farmers:312,hectares:1050 },
  { name:'Mzuzu',farmers:178,hectares:640 },
  { name:'Blantyre',farmers:156,hectares:410 },
  { name:'Zomba',farmers:98,hectares:280 },
  { name:'Salima',farmers:72,hectares:195 },
  { name:'Mangochi',farmers:65,hectares:210 },
  { name:'Other',farmers:123,hectares:345 },
];

const cropDistribution = [
  { name:'Burley Tobacco',value:42,color:'#0078D4' },
  { name:'Flue-Cured',value:18,color:'#00B294' },
  { name:'Maize',value:15,color:'#FFB900' },
  { name:'Groundnuts',value:10,color:'#D13438' },
  { name:'Cotton',value:8,color:'#7160E8' },
  { name:'Other',value:7,color:'#69797E' },
];

const systemAlerts = [
  { id:1,type:'warning',title:'Pest Alert — Kasungu District',message:'Aphid outbreak reported in 12 farms. Immediate inspection required.',time:'2h ago' },
  { id:2,type:'info',title:'Auction Schedule Updated',message:'Lilongwe Auction Floor Session 14 moved to April 8.',time:'4h ago' },
  { id:3,type:'success',title:'Input Distribution Complete',message:'Salima region — 100% of fertiliser allocation delivered.',time:'6h ago' },
  { id:4,type:'error',title:'Overdue Visit — TNF-0009',message:'Moses Chilima (Ntcheu) — last visit 112 days ago. Account suspended.',time:'1d ago' },
];

const recentActivity = [
  { action:'Field visit completed',detail:'FV-2026-0092 — Daniel Moyo, Mangochi',time:'30 min ago',icon:'check-circle' },
  { action:'New farmer registered',detail:'TNF-0013 — Agnes Tembo, Dedza',time:'1h ago',icon:'plus' },
  { action:'Delivery recorded',detail:'DL-0048 — 2,300 kg cotton, Blantyre',time:'2h ago',icon:'truck' },
  { action:'Grade assigned',detail:'DL-0046 — Grade A, Burley Tobacco',time:'3h ago',icon:'award' },
  { action:'Visit scheduled',detail:'FV-2026-0095 — Esther Gondwe, April 6',time:'5h ago',icon:'calendar' },
];


/* ──────────────────────────────────────────────────────
   SHARED COMPONENTS
   ────────────────────────────────────────────────────── */
const StatusBadge = ({ status }) => {
  const cls = status.toLowerCase().replace(/\s+/g, '-');
  return <span className={`badge badge-${cls}`}><span className="dot"></span>{status}</span>;
};

const KpiCard = ({ icon, label, value, trend, trendDir, color }) => (
  <div className={`kpi-card ${color}`}>
    <div className={`kpi-icon ${color}`}><Icon name={icon} size={18} /></div>
    <div className="kpi-value">{value}</div>
    <div className="kpi-label">{label}</div>
    {trend && (
      <div className={`kpi-trend ${trendDir}`}>
        <Icon name={trendDir === 'up' ? 'arrow-up' : 'arrow-down'} size={12} />
        {trend}
      </div>
    )}
  </div>
);

const initials = (name) => name.split(' ').map(n => n[0]).join('');


/* ══════════════════════════════════════════════════════
   PAGE: DASHBOARD
   ══════════════════════════════════════════════════════ */
const Dashboard = () => (
  <div>
    <div className="page-title">Dashboard</div>
    <div className="page-subtitle">Season 2025/26 Overview — Updated April 2, 2026</div>

    <div className="kpi-grid">
      <KpiCard icon="users" label="Registered Farmers" value="1,288" trend="+84 this quarter" trendDir="up" color="blue" />
      <KpiCard icon="leaf" label="Total Hectares" value="3,950" trend="+12% vs last season" trendDir="up" color="green" />
      <KpiCard icon="truck" label="Deliveries (Season)" value="347" trend="+23 this week" trendDir="up" color="amber" />
      <KpiCard icon="map-pin" label="Field Visits (MTD)" value="156" trend="92% completion rate" trendDir="up" color="purple" />
    </div>

    {/* Yield Chart + Crop Pie */}
    <div className="grid-3-1 mb-18">
      <div className="card">
        <div className="card-header">
          <h3>Yield Performance (tonnes)</h3>
          <span className="meta">Oct 2025 — Apr 2026</span>
        </div>
        <div className="card-body">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={monthlyYield}>
              <defs>
                <linearGradient id="gT" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0078D4" stopOpacity={0.25}/><stop offset="100%" stopColor="#0078D4" stopOpacity={0}/></linearGradient>
                <linearGradient id="gM" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#00B294" stopOpacity={0.25}/><stop offset="100%" stopColor="#00B294" stopOpacity={0}/></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8E8E8"/>
              <XAxis dataKey="month" tick={{fontSize:11,fill:'#8A8A8A'}}/>
              <YAxis tick={{fontSize:11,fill:'#8A8A8A'}}/>
              <Tooltip contentStyle={{fontSize:12,borderRadius:8,border:'1px solid #E1E1E1'}}/>
              <Area type="monotone" dataKey="tobacco" name="Tobacco" stroke="#0078D4" fill="url(#gT)" strokeWidth={2.5}/>
              <Area type="monotone" dataKey="maize" name="Maize" stroke="#00B294" fill="url(#gM)" strokeWidth={2}/>
              <Area type="monotone" dataKey="other" name="Other Crops" stroke="#7160E8" fill="none" strokeWidth={1.5} strokeDasharray="5 5"/>
            </AreaChart>
          </ResponsiveContainer>
          <div className="chart-legend">
            <div className="chart-legend-item"><div className="chart-legend-dot" style={{background:'#0078D4'}}></div>Tobacco</div>
            <div className="chart-legend-item"><div className="chart-legend-dot" style={{background:'#00B294'}}></div>Maize</div>
            <div className="chart-legend-item"><div className="chart-legend-dot" style={{background:'#7160E8'}}></div>Other</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><h3>Crop Distribution</h3></div>
        <div className="card-body">
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={cropDistribution} cx="50%" cy="50%" innerRadius={48} outerRadius={75} paddingAngle={2} dataKey="value">
                {cropDistribution.map((e,i) => <Cell key={i} fill={e.color}/>)}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} contentStyle={{fontSize:12,borderRadius:8}}/>
            </PieChart>
          </ResponsiveContainer>
          <div className="chart-legend" style={{justifyContent:'center'}}>
            {cropDistribution.map((c,i) => (
              <div key={i} className="chart-legend-item"><div className="chart-legend-dot" style={{background:c.color}}></div>{c.name} ({c.value}%)</div>
            ))}
          </div>
        </div>
      </div>
    </div>

    {/* Alerts + Activity */}
    <div className="grid-2 mb-18">
      <div className="card">
        <div className="card-header">
          <h3>Alerts &amp; Notifications</h3>
          <span className="badge badge-pending" style={{padding:'2px 8px',fontSize:10}}>{systemAlerts.length}</span>
        </div>
        <div className="card-body">
          {systemAlerts.map(a => (
            <div className="alert-item" key={a.id}>
              <div className={`alert-dot ${a.type}`}>
                <Icon name={a.type==='warning'?'alert-triangle':a.type==='error'?'x-circle':a.type==='success'?'check-circle':'activity'} size={14}/>
              </div>
              <div style={{flex:1}}>
                <div className="alert-title">{a.title}</div>
                <div className="alert-msg">{a.message}</div>
                <div className="alert-time">{a.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-header"><h3>Recent Activity</h3></div>
        <div className="card-body">
          {recentActivity.map((a,i) => (
            <div className="activity-item" key={i}>
              <div className="activity-dot"><Icon name={a.icon} size={13}/></div>
              <div style={{flex:1}}>
                <div className="activity-action">{a.action}</div>
                <div className="activity-detail">{a.detail}</div>
                <div className="activity-time">{a.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Regional Breakdown + Weather */}
    <div className="grid-2">
      <div className="card">
        <div className="card-header"><h3>Regional Breakdown</h3></div>
        <div className="card-body">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={regionBreakdown} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#E8E8E8"/>
              <XAxis type="number" tick={{fontSize:11,fill:'#8A8A8A'}}/>
              <YAxis type="category" dataKey="name" tick={{fontSize:11,fill:'#5C5C5C'}} width={78}/>
              <Tooltip contentStyle={{fontSize:12,borderRadius:8}}/>
              <Bar dataKey="farmers" name="Farmers" fill="#0078D4" radius={[0,4,4,0]} barSize={16}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><h3>Weather — Lilongwe</h3></div>
        <div className="card-body" style={{padding:0}}>
          <div className="weather-card">
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div>
                <div className="weather-temp">24°C</div>
                <div className="weather-cond">Partly Cloudy</div>
                <div className="weather-date">April 2, 2026 · 14:32 CAT</div>
              </div>
              <Icon name="sun" size={52} style={{opacity:.5}}/>
            </div>
            <div className="weather-meta">
              <span style={{display:'flex',alignItems:'center',gap:6}}><Icon name="droplets" size={14}/> 68% humidity</span>
              <span style={{display:'flex',alignItems:'center',gap:6}}><Icon name="thermometer" size={14}/> 18°–28°C</span>
              <span style={{display:'flex',alignItems:'center',gap:6}}><Icon name="cloud" size={14}/> 30% rain</span>
            </div>
          </div>
          <div className="weather-forecast">
            {[['Thu',24,'☁️'],['Fri',26,'☀️'],['Sat',23,'🌧️'],['Sun',22,'☁️'],['Mon',25,'☀️']].map(([d,t,ic]) => (
              <div className="forecast-day" key={d}>
                <div className="day">{d}</div>
                <div className="temp">{t}°</div>
                <div className="icon">{ic}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);


/* ══════════════════════════════════════════════════════
   PAGE: FARMER REGISTRY
   ══════════════════════════════════════════════════════ */
const FarmersList = ({ onSelectFarmer }) => {
  const [search, setSearch] = useState('');
  const [filterRegion, setFilterRegion] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const filtered = farmers.filter(f => {
    if (search && !f.name.toLowerCase().includes(search.toLowerCase()) && !f.id.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterRegion && f.region !== filterRegion) return false;
    if (filterStatus && f.status !== filterStatus) return false;
    return true;
  });

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">Farmer Registry</div><div className="page-subtitle">1,288 farmers across 10 regions</div></div>
        <button className="btn btn-primary"><Icon name="plus" size={14}/> Register Farmer</button>
      </div>
      <div className="toolbar">
        <div className="search-box">
          <Icon name="search" size={14}/>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or ID..."/>
        </div>
        <select className="select-input" value={filterRegion} onChange={e => setFilterRegion(e.target.value)}>
          <option value="">All Regions</option>
          {REGIONS.map(r => <option key={r}>{r}</option>)}
        </select>
        <select className="select-input" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">All Status</option>
          {STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
        <div className="toolbar-right">
          <button className="btn btn-outline btn-sm"><Icon name="download" size={13}/> Export</button>
          <button className="btn btn-outline btn-sm"><Icon name="refresh-cw" size={13}/> Refresh</button>
        </div>
      </div>

      <div className="card">
        <table className="data-table">
          <thead><tr><th>ID</th><th>Name</th><th>Region</th><th>District</th><th>Crop</th><th>Hectares</th><th>Grade</th><th>Status</th><th>Last Visit</th><th></th></tr></thead>
          <tbody>
            {filtered.map(f => (
              <tr key={f.id} onClick={() => onSelectFarmer(f)}>
                <td className="table-id">{f.id}</td>
                <td>
                  <div style={{display:'flex',alignItems:'center',gap:10}}>
                    <div style={{width:32,height:32,borderRadius:'50%',background:f.gender==='F'?'#EDEBFC':'#DEECF9',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,color:f.gender==='F'?'#7160E8':'#0078D4',flexShrink:0}}>
                      {initials(f.name)}
                    </div>
                    <div><div className="table-name">{f.name}</div><div className="table-sub">{f.village} · {f.club}</div></div>
                  </div>
                </td>
                <td>{f.region}</td>
                <td>{f.district}</td>
                <td>{f.crop}</td>
                <td>{f.hectares}</td>
                <td><span className={f.grade.includes('A') ? 'grade-a' : 'grade-b'}>{f.grade}</span></td>
                <td><StatusBadge status={f.status}/></td>
                <td style={{fontSize:12,color:'var(--text-muted)'}}>{f.lastVisit}</td>
                <td><button className="btn-icon" onClick={e=>{e.stopPropagation();onSelectFarmer(f);}}><Icon name="eye" size={14}/></button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="table-footer">
          <span>Showing {filtered.length} of 1,288 farmers</span>
          <div className="pagination">
            {[1,2,3,'...',108].map((p,i) => <button key={i} className={`page-btn ${p===1?'active':''}`}>{p}</button>)}
          </div>
        </div>
      </div>
    </div>
  );
};


/* ══════════════════════════════════════════════════════
   FARMER DETAIL PANEL (Slide-out)
   ══════════════════════════════════════════════════════ */
const FarmerDetail = ({ farmer, onClose }) => {
  if (!farmer) return null;
  const yieldData = [
    { season:'22/23',yield:Math.round(farmer.yield*.7) },
    { season:'23/24',yield:Math.round(farmer.yield*.85) },
    { season:'24/25',yield:Math.round(farmer.yield*.95) },
    { season:'25/26',yield:farmer.yield },
  ];
  return (
    <React.Fragment>
      <div className="overlay" onClick={onClose}/>
      <div className="detail-panel open">
        <div className="dp-header">
          <h3>Farmer Profile</h3>
          <div style={{display:'flex',gap:6}}>
            <button className="btn-icon"><Icon name="edit" size={14}/></button>
            <button className="btn-icon" onClick={onClose}><Icon name="x" size={14}/></button>
          </div>
        </div>
        <div className="dp-body">
          <div className="dp-profile">
            <div className="dp-avatar">{initials(farmer.name)}</div>
            <div>
              <div className="dp-name">{farmer.name}</div>
              <div className="dp-id">{farmer.id} · {farmer.club}</div>
              <div style={{marginTop:6}}><StatusBadge status={farmer.status}/></div>
            </div>
          </div>
          <div className="dp-fields">
            {[
              ['Region',farmer.region],['District',farmer.district],['Village',farmer.village],
              ['Phone',farmer.phone],['Primary Crop',farmer.crop],['Farm Size',farmer.hectares+' ha'],
              ['Current Grade',farmer.grade],['Gender / Age',(farmer.gender==='M'?'Male':'Female')+' · '+farmer.age+' yrs'],
              ['Registered',farmer.registered],['Last Visit',farmer.lastVisit],
            ].map(([l,v],i) => (
              <div className="dp-field" key={i}>
                <label>{l}</label>
                <div className={`val ${l==='Current Grade'&&farmer.grade.includes('A')?'grade-a':''}`}>{v}</div>
              </div>
            ))}
          </div>
          <div className="dp-chart">
            <h4>Yield History (kg)</h4>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={yieldData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E8E8"/>
                <XAxis dataKey="season" tick={{fontSize:11,fill:'#8A8A8A'}}/>
                <YAxis tick={{fontSize:11,fill:'#8A8A8A'}}/>
                <Tooltip contentStyle={{fontSize:12,borderRadius:8}}/>
                <Bar dataKey="yield" fill="#0078D4" radius={[4,4,0,0]} barSize={30}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="dp-actions">
            <button className="btn btn-primary btn-sm"><Icon name="phone" size={12}/> Call</button>
            <button className="btn btn-green btn-sm"><Icon name="map-pin" size={12}/> Schedule Visit</button>
            <button className="btn btn-outline btn-sm"><Icon name="file-text" size={12}/> View History</button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};


/* ══════════════════════════════════════════════════════
   PAGE: FIELD VISITS (with timer + GPS)
   ══════════════════════════════════════════════════════ */
const FieldVisits = () => {
  const [tab, setTab] = useState('all');
  const [activeVisit, setActiveVisit] = useState(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [gpsCoords, setGpsCoords] = useState(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (timerRunning) { intervalRef.current = setInterval(() => setElapsed(e => e + 1), 1000); }
    else { clearInterval(intervalRef.current); }
    return () => clearInterval(intervalRef.current);
  }, [timerRunning]);

  const startVisit = (visit) => {
    setActiveVisit(visit); setElapsed(0); setTimerRunning(false); setGpsCoords(null); setGpsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => { setGpsCoords({ lat:pos.coords.latitude.toFixed(6), lng:pos.coords.longitude.toFixed(6), accuracy:pos.coords.accuracy.toFixed(0) }); setGpsLoading(false); },
        () => { setGpsCoords({ lat:visit.lat.toFixed(6), lng:visit.lng.toFixed(6), accuracy:'simulated' }); setGpsLoading(false); },
        { enableHighAccuracy:true, timeout:8000 }
      );
    } else {
      setGpsCoords({ lat:visit.lat.toFixed(6), lng:visit.lng.toFixed(6), accuracy:'simulated' }); setGpsLoading(false);
    }
  };

  const fmt = (s) => {
    const h = String(Math.floor(s/3600)).padStart(2,'0');
    const m = String(Math.floor((s%3600)/60)).padStart(2,'0');
    const sec = String(s%60).padStart(2,'0');
    return `${h}:${m}:${sec}`;
  };

  const fv = tab === 'all' ? fieldVisits : fieldVisits.filter(v => v.status.toLowerCase().replace(/\s+/g,'-') === tab);

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">Field Visits</div><div className="page-subtitle">{fieldVisits.length} visits this period · 4 scheduled, 1 in progress, 2 completed</div></div>
        <button className="btn btn-primary"><Icon name="plus" size={14}/> Schedule Visit</button>
      </div>

      {activeVisit && (
        <div className="grid-2 mb-22">
          <div className="visit-timer">
            <div className="timer-label">Active Field Visit</div>
            <div className="timer-farmer">{activeVisit.farmer} — {activeVisit.type}</div>
            <div className="timer-display">{fmt(elapsed)}</div>
            <div className="timer-label">{timerRunning ? 'Visit in progress...' : elapsed > 0 ? 'Visit paused' : 'Ready to start'}</div>
            <div className="timer-controls">
              {!timerRunning ? (
                <button className="timer-btn start" onClick={() => setTimerRunning(true)} title="Start Visit"><Icon name="play" size={20}/></button>
              ) : (
                <button className="timer-btn" onClick={() => setTimerRunning(false)} title="Pause"><Icon name="pause" size={20}/></button>
              )}
              <button className="timer-btn stop" onClick={() => { setTimerRunning(false); setElapsed(0); setActiveVisit(null); }} title="End Visit"><Icon name="square" size={18}/></button>
            </div>
          </div>
          <div>
            <div className="gps-box">
              <div className="gps-header">
                <Icon name="navigation" size={16}/>
                <span>GPS Location</span>
                {gpsLoading && <span style={{fontSize:11,color:'var(--text-muted)',marginLeft:8}}>Acquiring signal...</span>}
              </div>
              {gpsCoords ? (
                <React.Fragment>
                  <div><span className="gps-pulse"></span><span className="gps-coords">Lat: {gpsCoords.lat}° &nbsp;|&nbsp; Lng: {gpsCoords.lng}°</span></div>
                  <div className="gps-meta">Accuracy: {gpsCoords.accuracy === 'simulated' ? 'Simulated (demo mode)' : `±${gpsCoords.accuracy}m`} · Auto-detected by device</div>
                </React.Fragment>
              ) : (
                <div style={{fontSize:12,color:'var(--text-muted)'}}>Waiting for GPS signal...</div>
              )}
            </div>
            <div className="card visit-detail-card">
              <div className="card-body" style={{padding:16}}>
                {[['Visit ID',activeVisit.id],['Farmer',activeVisit.farmer+' ('+activeVisit.farmerId+')'],['Region',activeVisit.region],['Type',activeVisit.type],['Officer',activeVisit.officer],['Notes',activeVisit.notes]].map(([l,v],i) => (
                  <div className="dp-field" key={i}><label>{l}</label><div className="val">{v}</div></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="tabs">
        {[['all','All Visits'],['scheduled','Scheduled'],['in-progress','In Progress'],['completed','Completed']].map(([k,l]) => (
          <button key={k} className={`tab ${tab===k?'active':''}`} onClick={() => setTab(k)}>{l}</button>
        ))}
      </div>

      <div className="card">
        <table className="data-table">
          <thead><tr><th>Visit ID</th><th>Farmer</th><th>Region</th><th>Type</th><th>Date</th><th>Officer</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {fv.map(v => (
              <tr key={v.id}>
                <td className="table-id">{v.id}</td>
                <td><div className="table-name">{v.farmer}</div><div className="table-sub">{v.farmerId}</div></td>
                <td>{v.region}</td>
                <td>{v.type}</td>
                <td>{v.date}</td>
                <td>{v.officer}</td>
                <td><StatusBadge status={v.status}/></td>
                <td>
                  {(v.status==='Scheduled'||v.status==='In Progress') ? (
                    <button className="btn btn-green btn-sm" onClick={() => startVisit(v)}><Icon name="play" size={12}/> Start</button>
                  ) : (
                    <button className="btn btn-outline btn-sm"><Icon name="eye" size={12}/> View</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};


/* ══════════════════════════════════════════════════════
   PAGE: DELIVERIES & GRADING
   ══════════════════════════════════════════════════════ */
const Deliveries = () => (
  <div>
    <div className="page-header">
      <div><div className="page-title">Deliveries &amp; Grading</div><div className="page-subtitle">Season 2025/26 — 347 total deliveries</div></div>
      <button className="btn btn-primary"><Icon name="plus" size={14}/> Record Delivery</button>
    </div>
    <div className="kpi-grid">
      <KpiCard icon="truck" label="Total Deliveries" value="347" color="blue"/>
      <KpiCard icon="package" label="Total Weight" value="186.4 T" color="green"/>
      <KpiCard icon="award" label="Avg Grade" value="B+" color="amber"/>
      <KpiCard icon="trending-up" label="Revenue (est.)" value="MK 298M" color="purple"/>
    </div>
    <div className="card">
      <table className="data-table">
        <thead><tr><th>Delivery ID</th><th>Farmer</th><th>Crop</th><th>Weight</th><th>Grade</th><th>Depot</th><th>Date</th><th>Status</th><th>Value</th></tr></thead>
        <tbody>
          {deliveries.map(d => (
            <tr key={d.id}>
              <td className="table-id">{d.id}</td>
              <td className="table-name">{d.farmer}</td>
              <td>{d.crop}</td>
              <td>{d.weight}</td>
              <td><span className={d.grade.includes('A')?'grade-a':'grade-b'}>{d.grade}</span></td>
              <td style={{fontSize:12}}>{d.depot}</td>
              <td>{d.date}</td>
              <td><StatusBadge status={d.status}/></td>
              <td style={{fontWeight:600}}>{d.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);


/* ══════════════════════════════════════════════════════
   PAGE: CROP MONITORING
   ══════════════════════════════════════════════════════ */
const CropMonitoring = () => (
  <div>
    <div className="page-title">Crop Monitoring</div>
    <div className="page-subtitle">Real-time crop health and growth stage tracking</div>
    <div className="kpi-grid">
      <KpiCard icon="leaf" label="Crops on Track" value="82%" trend="+4% vs last month" trendDir="up" color="green"/>
      <KpiCard icon="alert-triangle" label="Pest Alerts" value="14" trend="3 critical" trendDir="down" color="amber"/>
      <KpiCard icon="droplets" label="Irrigation Coverage" value="34%" color="blue"/>
      <KpiCard icon="activity" label="Growth Stage Avg" value="Maturity" color="purple"/>
    </div>
    <div className="grid-2 mb-18">
      <div className="card">
        <div className="card-header"><h3>Growth Stages by Region</h3></div>
        <div className="card-body">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={[
              {region:'Lilongwe',seedling:5,vegetative:15,flowering:25,maturity:55},
              {region:'Kasungu',seedling:3,vegetative:10,flowering:20,maturity:67},
              {region:'Mzuzu',seedling:8,vegetative:22,flowering:35,maturity:35},
              {region:'Blantyre',seedling:2,vegetative:8,flowering:18,maturity:72},
              {region:'Zomba',seedling:12,vegetative:28,flowering:30,maturity:30},
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8E8E8"/>
              <XAxis dataKey="region" tick={{fontSize:11,fill:'#8A8A8A'}}/>
              <YAxis tick={{fontSize:11,fill:'#8A8A8A'}}/>
              <Tooltip contentStyle={{fontSize:12,borderRadius:8}}/>
              <Bar dataKey="maturity" stackId="a" fill="#0078D4" name="Maturity"/>
              <Bar dataKey="flowering" stackId="a" fill="#00B294" name="Flowering"/>
              <Bar dataKey="vegetative" stackId="a" fill="#FFB900" name="Vegetative"/>
              <Bar dataKey="seedling" stackId="a" fill="#7160E8" name="Seedling"/>
            </BarChart>
          </ResponsiveContainer>
          <div className="chart-legend">
            <div className="chart-legend-item"><div className="chart-legend-dot" style={{background:'#0078D4'}}></div>Maturity</div>
            <div className="chart-legend-item"><div className="chart-legend-dot" style={{background:'#00B294'}}></div>Flowering</div>
            <div className="chart-legend-item"><div className="chart-legend-dot" style={{background:'#FFB900'}}></div>Vegetative</div>
            <div className="chart-legend-item"><div className="chart-legend-dot" style={{background:'#7160E8'}}></div>Seedling</div>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-header"><h3>Pest &amp; Disease Report</h3></div>
        <div className="card-body">
          {[
            {pest:'Aphids (Myzus persicae)',region:'Kasungu',severity:'High',farms:12},
            {pest:'Budworm (Helicoverpa)',region:'Lilongwe',severity:'Medium',farms:8},
            {pest:'Frog Eye Leaf Spot',region:'Mzuzu',severity:'Low',farms:4},
            {pest:'Tobacco Mosaic Virus',region:'Zomba',severity:'Medium',farms:6},
            {pest:'Root Knot Nematode',region:'Blantyre',severity:'Low',farms:3},
          ].map((p,i) => (
            <div key={i} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'11px 0',borderBottom:i<4?'1px solid var(--border-light)':'none'}}>
              <div>
                <div style={{fontWeight:600,fontSize:13}}>{p.pest}</div>
                <div style={{fontSize:11,color:'var(--text-muted)'}}>{p.region} · {p.farms} farms affected</div>
              </div>
              <span className={`severity severity-${p.severity.toLowerCase()}`}>{p.severity}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);


/* ══════════════════════════════════════════════════════
   PAGE: REPORTS & ANALYTICS
   ══════════════════════════════════════════════════════ */
const Reports = () => (
  <div>
    <div className="page-title">Reports &amp; Analytics</div>
    <div className="page-subtitle">Generate and download operational reports</div>
    <div className="grid-3 mb-18">
      {[
        {title:'Season Summary',desc:'End-of-season yield, revenue, and farmer performance summary',icon:'bar-chart',ready:true},
        {title:'Field Visit Log',desc:'Complete log of all field visits with GPS data and outcomes',icon:'map-pin',ready:true},
        {title:'Farmer Census',desc:'Full farmer registry export with demographic and crop data',icon:'users',ready:true},
        {title:'Delivery Report',desc:'All deliveries, grades, weights, and auction results',icon:'truck',ready:true},
        {title:'Pest & Disease Tracker',desc:'Regional pest reports with severity analysis and treatment log',icon:'alert-triangle',ready:false},
        {title:'Financial Summary',desc:'Input costs, revenue by farmer, and margin analysis',icon:'trending-up',ready:false},
      ].map((r,i) => (
        <div className="card report-card" key={i}>
          <div className="card-body">
            <div className="report-icon"><Icon name={r.icon} size={22}/></div>
            <div style={{flex:1}}>
              <div className="report-title">{r.title}</div>
              <div className="report-desc">{r.desc}</div>
              <div style={{marginTop:12}}>
                {r.ready ? <button className="btn btn-primary btn-sm"><Icon name="download" size={12}/> Generate</button>
                  : <span style={{fontSize:11,color:'var(--text-muted)',fontStyle:'italic'}}>Coming soon</span>}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
    <div className="card">
      <div className="card-header"><h3>Season Performance vs Target</h3></div>
      <div className="card-body">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={[
            {metric:'Farmers Registered',actual:1288,target:1500},
            {metric:'Hectares Covered',actual:3950,target:4500},
            {metric:'Total Yield (T)',actual:186,target:220},
            {metric:'Field Visits',actual:892,target:1000},
            {metric:'Deliveries',actual:347,target:400},
          ]}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8E8E8"/>
            <XAxis dataKey="metric" tick={{fontSize:11,fill:'#8A8A8A'}}/>
            <YAxis tick={{fontSize:11,fill:'#8A8A8A'}}/>
            <Tooltip contentStyle={{fontSize:12,borderRadius:8}}/>
            <Bar dataKey="target" fill="#E8E8E8" name="Target" radius={[4,4,0,0]} barSize={26}/>
            <Bar dataKey="actual" fill="#0078D4" name="Actual" radius={[4,4,0,0]} barSize={26}/>
          </BarChart>
        </ResponsiveContainer>
        <div className="chart-legend" style={{justifyContent:'center',marginTop:6}}>
          <div className="chart-legend-item"><div className="chart-legend-dot" style={{background:'#E8E8E8'}}></div>Target</div>
          <div className="chart-legend-item"><div className="chart-legend-dot" style={{background:'#0078D4'}}></div>Actual</div>
        </div>
      </div>
    </div>
  </div>
);


/* ══════════════════════════════════════════════════════
   PAGE: SETTINGS
   ══════════════════════════════════════════════════════ */
const SettingsPage = () => (
  <div>
    <div className="page-title">Settings</div>
    <div className="page-subtitle">System configuration and preferences</div>
    <div className="card mb-18">
      <div className="card-header"><h3>Organisation</h3></div>
      <div className="card-body">
        <div className="dp-fields" style={{padding:0}}>
          {[['Organisation','TechNexus MW'],['System','TFMS v1.0.0'],['License','Enterprise — 5,000 Farmers'],['Season','2025/26'],['Regions','10 Active'],['Data Sync','Last sync: 2 min ago']].map(([k,v],i) => (
            <div className="dp-field" key={i}><label>{k}</label><div className="val">{v}</div></div>
          ))}
        </div>
      </div>
    </div>
    <div className="card mb-18">
      <div className="card-header"><h3>Users &amp; Access</h3></div>
      <div className="card-body" style={{padding:0}}>
        <table className="data-table">
          <thead><tr><th>User</th><th>Role</th><th>Region</th><th>Last Active</th><th>Status</th></tr></thead>
          <tbody>
            {[
              ['Tafika Itaye','Administrator','All Regions','Online now','Active'],
              ['Stephen Sembereka','Field Officer','Lilongwe, Mangochi','1h ago','Active'],
              ['Netty Mkwamba','Field Officer','Blantyre, Salima','30 min ago','Active'],
              ['Tiago Dresch','Developer','Remote','2h ago','Active'],
            ].map(([n,r,reg,act,st],i) => (
              <tr key={i}><td className="table-name">{n}</td><td>{r}</td><td>{reg}</td><td style={{fontSize:12,color:'var(--text-muted)'}}>{act}</td><td><StatusBadge status={st}/></td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    <div className="card">
      <div className="card-header"><h3>About</h3></div>
      <div className="card-body">
        <div className="dp-fields" style={{padding:0}}>
          {[['Application','TechNexus Farmer Management System (TFMS)'],['Version','1.0.0 (Build 2026.04.02)'],['Platform','Web Application · ASP.NET Core 8 + Blazor Server'],['Database','PostgreSQL 16'],['Developer','TechNexus MW — Software Division'],['Contact','technexus_mw@proton.me · +265 889 941 700']].map(([k,v],i) => (
            <div className="dp-field" key={i}><label>{k}</label><div className="val">{v}</div></div>
          ))}
        </div>
      </div>
    </div>
  </div>
);


/* ══════════════════════════════════════════════════════
   MAIN APP SHELL
   ══════════════════════════════════════════════════════ */
const App = () => {
  const [page, setPage] = useState('dashboard');
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [showNotif, setShowNotif] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  const nav = [
    { key:'dashboard',label:'Dashboard',icon:'home' },
    { key:'farmers',label:'Farmer Registry',icon:'users',badge:'1,288' },
    { key:'visits',label:'Field Visits',icon:'map-pin',badge:'4',badgeAlert:true },
    { key:'crops',label:'Crop Monitoring',icon:'leaf' },
    { key:'deliveries',label:'Deliveries',icon:'truck' },
    { key:'reports',label:'Reports',icon:'file-text' },
  ];

  const labels = { dashboard:'Dashboard',farmers:'Farmer Registry',visits:'Field Visits',crops:'Crop Monitoring',deliveries:'Deliveries',reports:'Reports',settings:'Settings' };

  const renderPage = () => {
    switch(page) {
      case 'dashboard': return <Dashboard/>;
      case 'farmers': return <FarmersList onSelectFarmer={f => setSelectedFarmer(f)}/>;
      case 'visits': return <FieldVisits/>;
      case 'crops': return <CropMonitoring/>;
      case 'deliveries': return <Deliveries/>;
      case 'reports': return <Reports/>;
      case 'settings': return <SettingsPage/>;
      default: return <Dashboard/>;
    }
  };

  return (
    <div>
      {/* ── SIDEBAR ── */}
      <aside className="sidebar">
        <div className="sb-brand">
          <div className="sb-brand-icon">TF</div>
          <div><h1>TFMS</h1><p>FARMER MANAGEMENT</p></div>
        </div>
        <nav className="sb-nav">
          <div className="sb-section">Main</div>
          {nav.map(n => (
            <button key={n.key} className={`sb-item ${page===n.key?'active':''}`} onClick={() => { setPage(n.key); setSelectedFarmer(null); setShowNotif(false); }}>
              <Icon name={n.icon} size={17}/>
              <span>{n.label}</span>
              {n.badge && page!==n.key && <span className={`sb-badge ${n.badgeAlert?'alert':''}`}>{n.badge}</span>}
            </button>
          ))}
          <div className="sb-section">System</div>
          <button className={`sb-item ${page==='settings'?'active':''}`} onClick={() => setPage('settings')}>
            <Icon name="settings" size={17}/><span>Settings</span>
          </button>
          <button className="sb-item">
            <Icon name="help-circle" size={17}/><span>Help &amp; Support</span>
          </button>
        </nav>
        <div className="sb-footer">
          <div className="sb-avatar">TI</div>
          <div className="sb-footer-info">
            <div className="name">Tafika Itaye</div>
            <div className="role">Administrator</div>
          </div>
          <button title="Sign out"><Icon name="log-out" size={15}/></button>
        </div>
      </aside>

      {/* ── HEADER ── */}
      <header className="header">
        <div className="hd-breadcrumb">
          <Icon name="globe" size={14}/>
          <span>TechNexus MW</span>
          <Icon name="chevron-right" size={12}/>
          <span className="current">{labels[page]}</span>
        </div>
        <div className="hd-search">
          <Icon name="search" size={15}/>
          <input placeholder="Search farmers, visits, deliveries..." value={searchVal} onChange={e => setSearchVal(e.target.value)}/>
        </div>
        <div className="hd-actions">
          <button className="hd-btn" onClick={() => setShowNotif(!showNotif)} style={{position:'relative'}}>
            <Icon name="bell" size={17}/>
            <span className="dot"></span>
            {showNotif && (
              <div className="notif-dropdown" onClick={e => e.stopPropagation()}>
                <div className="notif-header">Notifications</div>
                {systemAlerts.map(a => (
                  <div className="notif-item" key={a.id}>
                    <div className={`alert-dot ${a.type}`}><Icon name={a.type==='warning'?'alert-triangle':'activity'} size={12}/></div>
                    <div><div style={{fontWeight:600,fontSize:12}}>{a.title}</div><div style={{fontSize:11,color:'var(--text-muted)'}}>{a.time}</div></div>
                  </div>
                ))}
              </div>
            )}
          </button>
          <div className="hd-divider"></div>
          <button className="hd-btn"><Icon name="refresh-cw" size={17}/></button>
        </div>
      </header>

      {/* ── MAIN ── */}
      <main className="main">
        {renderPage()}
        <div className="footer-bar">TFMS v1.0.0 · TechNexus Farmer Management System · © 2026 TechNexus MW · All rights reserved</div>
      </main>

      {/* ── FARMER DETAIL ── */}
      {selectedFarmer && <FarmerDetail farmer={selectedFarmer} onClose={() => setSelectedFarmer(null)}/>}
    </div>
  );
};


/* ── MOUNT ── */
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);
