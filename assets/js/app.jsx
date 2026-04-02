/* ═══════════════════════════════════════════════════════
   TFMS — TechNexus Farmer Management System
   Production App · React 18 + Recharts · All Features
   © 2026 TechNexus MW
   ═══════════════════════════════════════════════════════ */
const { useState, useEffect, useRef, useCallback } = React;
const { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } = Recharts;

/* ── ICONS (inline SVG) ── */
const I = ({ n, s = 16 }) => {
  const p = {
    home:<><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>,
    users:<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
    'map-pin':<><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></>,
    leaf:<><path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 20 .5 20 .5s-4.8 10.1-6 15.5"/><path d="M10.2 12a13 13 0 0 1 7.8-7"/></>,
    truck:<><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></>,
    'file-text':<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></>,
    settings:<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>,
    search:<><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
    bell:<><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>,
    plus:<><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    'chevron-right':<><polyline points="9 18 15 12 9 6"/></>,
    'chevron-left':<><polyline points="15 18 9 12 15 6"/></>,
    'check-circle':<><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></>,
    'alert-triangle':<><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
    'x-circle':<><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></>,
    'arrow-up':<><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></>,
    'arrow-down':<><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></>,
    phone:<><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.58 2.81.7A2 2 0 0 1 22 16.92z"/></>,
    eye:<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
    edit:<><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    play:<><polygon points="5 3 19 12 5 21 5 3"/></>,
    pause:<><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></>,
    square:<><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/></>,
    navigation:<><polygon points="3 11 22 2 13 21 11 13 3 11"/></>,
    calendar:<><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
    'trending-up':<><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></>,
    package:<><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></>,
    'bar-chart':<><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></>,
    x:<><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    download:<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>,
    'refresh-cw':<><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></>,
    sun:<><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></>,
    cloud:<><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></>,
    droplets:<><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></>,
    thermometer:<><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></>,
    activity:<><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></>,
    award:<><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></>,
    globe:<><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></>,
    'log-out':<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
    'help-circle':<><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
    menu:<><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></>,
    trash:<><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></>,
    check:<><polyline points="20 6 9 17 4 12"/></>,
  };
  return <svg viewBox="0 0 24 24" style={{width:s,height:s,fill:'none',stroke:'currentColor',strokeWidth:2,strokeLinecap:'round',strokeLinejoin:'round'}}>{p[n]||null}</svg>;
};

/* ── IMAGES — curated agriculture/Africa stock photos ── */
const IMGS = {
  hero: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&h=400&fit=crop',
  field: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800&h=400&fit=crop',
  tobacco: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&h=400&fit=crop',
  harvest: 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c10?w=800&h=400&fit=crop',
  meeting: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&h=400&fit=crop',
  officer: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=face',
  portraits: [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face',
  ],
};
const ImgFallback = ({src, alt, className, style}) => {
  const [err, setErr] = useState(false);
  if (err) return null;
  return <img src={src} alt={alt||''} className={className} style={style} onError={() => setErr(true)} loading="lazy"/>;
};

/* ── DATA ── */
const REGIONS = ['Lilongwe','Blantyre','Mzuzu','Zomba','Mangochi','Salima','Kasungu','Nkhotakota','Dedza','Ntcheu'];
const CROPS = ['Burley Tobacco','Flue-Cured Tobacco','Maize','Groundnuts','Soybeans','Cotton','Pigeon Peas','Rice'];
const STATUSES_F = ['Active','Pending','Suspended'];

const initFarmers = [
  {id:'TNF-0001',name:'Chikondi Banda',gender:'M',age:42,region:'Lilongwe',district:'Dowa',village:'Mvera',phone:'+265 991 234 567',hectares:3.5,crop:'Burley Tobacco',status:'Active',registered:'2024-03-15',lastVisit:'2026-03-28',yield:2850,grade:'A',club:'Mvera Growers Club',img:0},
  {id:'TNF-0002',name:'Grace Mwale',gender:'F',age:35,region:'Kasungu',district:'Kasungu',village:'Chamama',phone:'+265 888 345 678',hectares:2.0,crop:'Burley Tobacco',status:'Active',registered:'2024-05-20',lastVisit:'2026-03-25',yield:1920,grade:'B+',club:'Chamama Cooperative',img:1},
  {id:'TNF-0003',name:'James Phiri',gender:'M',age:55,region:'Mzuzu',district:'Rumphi',village:'Bolero',phone:'+265 995 456 789',hectares:5.0,crop:'Flue-Cured Tobacco',status:'Active',registered:'2023-11-10',lastVisit:'2026-03-20',yield:4200,grade:'A+',club:'Bolero Estate Farmers',img:2},
  {id:'TNF-0004',name:'Esther Gondwe',gender:'F',age:28,region:'Blantyre',district:'Thyolo',village:'Luchenza',phone:'+265 882 567 890',hectares:1.5,crop:'Maize',status:'Active',registered:'2025-01-08',lastVisit:'2026-03-15',yield:980,grade:'B',club:'Luchenza Women Farmers',img:3},
  {id:'TNF-0005',name:'Patrick Kamanga',gender:'M',age:48,region:'Zomba',district:'Zomba',village:'Domasi',phone:'+265 999 678 901',hectares:4.0,crop:'Groundnuts',status:'Pending',registered:'2025-06-12',lastVisit:'2026-02-28',yield:3100,grade:'A',club:'Domasi Progressive',img:4},
  {id:'TNF-0006',name:'Mercy Nkhoma',gender:'F',age:31,region:'Salima',district:'Salima',village:'Chipoka',phone:'+265 884 789 012',hectares:2.5,crop:'Rice',status:'Active',registered:'2024-08-25',lastVisit:'2026-03-30',yield:2100,grade:'B+',club:'Chipoka Irrigation',img:5},
  {id:'TNF-0007',name:'Daniel Moyo',gender:'M',age:60,region:'Mangochi',district:'Mangochi',village:'Monkey Bay',phone:'+265 993 890 123',hectares:6.0,crop:'Cotton',status:'Active',registered:'2023-07-01',lastVisit:'2026-03-18',yield:5400,grade:'A+',club:'Mangochi Cotton Assoc.',img:0},
  {id:'TNF-0008',name:'Ruth Chirwa',gender:'F',age:38,region:'Dedza',district:'Dedza',village:'Lobi',phone:'+265 886 901 234',hectares:2.0,crop:'Soybeans',status:'Active',registered:'2024-12-03',lastVisit:'2026-03-22',yield:1650,grade:'B',club:'Lobi Soybean Growers',img:1},
  {id:'TNF-0009',name:'Moses Chilima',gender:'M',age:44,region:'Ntcheu',district:'Ntcheu',village:'Tsangano',phone:'+265 997 012 345',hectares:3.0,crop:'Pigeon Peas',status:'Suspended',registered:'2024-02-17',lastVisit:'2025-12-10',yield:0,grade:'—',club:'Tsangano Farmers Union',img:2},
  {id:'TNF-0010',name:'Tiyanjane Mkandawire',gender:'F',age:26,region:'Nkhotakota',district:'Nkhotakota',village:'Dwangwa',phone:'+265 880 123 456',hectares:1.8,crop:'Maize',status:'Active',registered:'2025-09-01',lastVisit:'2026-03-29',yield:1200,grade:'B+',club:'Dwangwa Youth Farmers',img:3},
  {id:'TNF-0011',name:'Kondwani Jere',gender:'M',age:50,region:'Kasungu',district:'Kasungu',village:'Santhe',phone:'+265 992 234 567',hectares:4.5,crop:'Burley Tobacco',status:'Active',registered:'2023-04-20',lastVisit:'2026-03-27',yield:3800,grade:'A',club:'Santhe Leaf Growers',img:4},
  {id:'TNF-0012',name:'Flora Maseko',gender:'F',age:33,region:'Lilongwe',district:'Lilongwe',village:'Mitundu',phone:'+265 885 345 678',hectares:2.2,crop:'Groundnuts',status:'Active',registered:'2024-10-15',lastVisit:'2026-03-26',yield:1750,grade:'B+',club:'Mitundu Cooperative',img:5},
];

const initVisits = [
  {id:'FV-2026-0089',farmerId:'TNF-0001',farmer:'Chikondi Banda',region:'Lilongwe',type:'Crop Inspection',status:'Scheduled',date:'2026-04-03',officer:'Stephen Sembereka',notes:'Mid-season leaf quality check',lat:-13.9626,lng:33.7741},
  {id:'FV-2026-0090',farmerId:'TNF-0003',farmer:'James Phiri',region:'Mzuzu',type:'Curing Assessment',status:'Scheduled',date:'2026-04-04',officer:'Tafika Itaye',notes:'Inspect curing barns and flue equipment',lat:-10.4955,lng:33.8625},
  {id:'FV-2026-0091',farmerId:'TNF-0006',farmer:'Mercy Nkhoma',region:'Salima',type:'Input Distribution',status:'In Progress',date:'2026-04-02',officer:'Netty Mkwamba',notes:'Delivering fertiliser — 2nd tranche',lat:-13.7803,lng:34.4587},
  {id:'FV-2026-0092',farmerId:'TNF-0007',farmer:'Daniel Moyo',region:'Mangochi',type:'Harvest Planning',status:'Completed',date:'2026-03-30',officer:'Stephen Sembereka',notes:'Confirmed 5.4T yield. Logistics arranged.',lat:-14.4783,lng:35.2644},
  {id:'FV-2026-0093',farmerId:'TNF-0011',farmer:'Kondwani Jere',region:'Kasungu',type:'Crop Inspection',status:'Scheduled',date:'2026-04-05',officer:'Tafika Itaye',notes:'Post-topping leaf assessment',lat:-12.9968,lng:33.4518},
  {id:'FV-2026-0094',farmerId:'TNF-0002',farmer:'Grace Mwale',region:'Kasungu',type:'Pest Management',status:'Completed',date:'2026-03-25',officer:'Stephen Sembereka',notes:'Aphid treatment applied.',lat:-13.0143,lng:33.4831},
  {id:'FV-2026-0095',farmerId:'TNF-0004',farmer:'Esther Gondwe',region:'Blantyre',type:'Training Session',status:'Scheduled',date:'2026-04-06',officer:'Netty Mkwamba',notes:'Conservation agriculture workshop',lat:-15.9230,lng:35.4989},
];

const initDeliveries = [
  {id:'DL-0045',farmer:'James Phiri',crop:'Flue-Cured Tobacco',weight:'1,250 kg',grade:'A+',depot:'Mzuzu Auction Floor',date:'2026-03-18',status:'Sold',value:'MK 4,875,000'},
  {id:'DL-0046',farmer:'Chikondi Banda',crop:'Burley Tobacco',weight:'890 kg',grade:'A',depot:'Lilongwe Auction Floor',date:'2026-03-20',status:'Graded',value:'MK 2,847,000'},
  {id:'DL-0047',farmer:'Kondwani Jere',crop:'Burley Tobacco',weight:'1,100 kg',grade:'A',depot:'Lilongwe Auction Floor',date:'2026-03-22',status:'In Transit',value:'—'},
  {id:'DL-0048',farmer:'Daniel Moyo',crop:'Cotton',weight:'2,300 kg',grade:'A+',depot:'Blantyre Ginning Factory',date:'2026-03-28',status:'Delivered',value:'MK 3,220,000'},
  {id:'DL-0049',farmer:'Grace Mwale',crop:'Burley Tobacco',weight:'640 kg',grade:'B+',depot:'Kasungu Depot',date:'2026-03-30',status:'Pending',value:'—'},
  {id:'DL-0050',farmer:'Mercy Nkhoma',crop:'Rice',weight:'1,800 kg',grade:'A',depot:'Salima Warehouse',date:'2026-03-31',status:'Delivered',value:'MK 1,440,000'},
];

const monthlyYield=[{month:'Oct',tobacco:0,maize:0,other:0},{month:'Nov',tobacco:120,maize:0,other:80},{month:'Dec',tobacco:450,maize:200,other:180},{month:'Jan',tobacco:1200,maize:600,other:350},{month:'Feb',tobacco:2800,maize:1400,other:620},{month:'Mar',tobacco:4500,maize:2100,other:890},{month:'Apr',tobacco:3200,maize:1800,other:750}];
const regionBk=[{name:'Lilongwe',farmers:284},{name:'Kasungu',farmers:312},{name:'Mzuzu',farmers:178},{name:'Blantyre',farmers:156},{name:'Zomba',farmers:98},{name:'Salima',farmers:72},{name:'Mangochi',farmers:65},{name:'Other',farmers:123}];
const cropDist=[{name:'Burley Tobacco',value:42,color:'#0078D4'},{name:'Flue-Cured',value:18,color:'#00B294'},{name:'Maize',value:15,color:'#FFB900'},{name:'Groundnuts',value:10,color:'#D13438'},{name:'Cotton',value:8,color:'#7160E8'},{name:'Other',value:7,color:'#69797E'}];
const sysAlerts=[{id:1,type:'warning',title:'Pest Alert — Kasungu',message:'Aphid outbreak in 12 farms. Immediate inspection required.',time:'2h ago'},{id:2,type:'info',title:'Auction Schedule Updated',message:'Lilongwe Session 14 moved to April 8.',time:'4h ago'},{id:3,type:'success',title:'Input Distribution Complete',message:'Salima — 100% fertiliser delivered.',time:'6h ago'},{id:4,type:'error',title:'Overdue Visit — TNF-0009',message:'Moses Chilima — last visit 112 days ago.',time:'1d ago'}];
const recentAct=[{action:'Field visit completed',detail:'FV-2026-0092 — Daniel Moyo',time:'30 min ago',icon:'check-circle'},{action:'New farmer registered',detail:'TNF-0013 — Agnes Tembo, Dedza',time:'1h ago',icon:'plus'},{action:'Delivery recorded',detail:'DL-0048 — 2,300 kg cotton',time:'2h ago',icon:'truck'},{action:'Grade assigned',detail:'DL-0046 — Grade A, Burley',time:'3h ago',icon:'award'},{action:'Visit scheduled',detail:'FV-2026-0095 — Esther Gondwe',time:'5h ago',icon:'calendar'}];

/* ── HELPERS ── */
const ini = n => n.split(' ').map(w=>w[0]).join('');
const badgeCls = s => 'badge b-'+s.toLowerCase().replace(/\s+/g,'-');
const Badge = ({s}) => <span className={badgeCls(s)}><span className="dot"></span>{s}</span>;
const nextId = (arr,prefix) => { const nums = arr.map(a=>parseInt(a.id.split('-').pop())); return prefix+String(Math.max(...nums)+1).padStart(4,'0'); };
const today = () => new Date().toISOString().split('T')[0];

/* ── TOAST SYSTEM ── */
const useToasts = () => {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((msg, type='success') => {
    const id = Date.now();
    setToasts(t => [...t, {id,msg,type}]);
    setTimeout(() => setToasts(t => t.filter(x=>x.id!==id)), 3500);
  }, []);
  const Toasts = () => <div className="toast-wrap">{toasts.map(t => <div key={t.id} className={`toast ${t.type}`}><I n={t.type==='success'?'check-circle':t.type==='error'?'x-circle':'activity'} s={16}/>{t.msg}</div>)}</div>;
  return {add, Toasts};
};

/* ── MODAL ── */
const Modal = ({open,onClose,title,children,footer}) => {
  if (!open) return null;
  return <div className="modal-wrap"><div className="modal-bg" onClick={onClose}/><div className="modal"><div className="modal-hd"><h3>{title}</h3><button className="btn-i" onClick={onClose}><I n="x" s={14}/></button></div><div className="modal-bd">{children}</div>{footer && <div className="modal-ft">{footer}</div>}</div></div>;
};

/* ── CSV EXPORT ── */
const exportCSV = (data, filename) => {
  if (!data.length) return;
  const keys = Object.keys(data[0]);
  const csv = [keys.join(','), ...data.map(r => keys.map(k => '"'+(r[k]||'')+'"').join(','))].join('\n');
  const blob = new Blob([csv], {type:'text/csv'});
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = filename; a.click();
};

/* ── KPI CARD ── */
const Kpi = ({icon,label,value,trend,dir,color}) => <div className={`kpi ${color}`}><div className={`kpi-icon ${color}`}><I n={icon} s={18}/></div><div className="kpi-val">{value}</div><div className="kpi-lbl">{label}</div>{trend&&<div className={`kpi-trend ${dir}`}><I n={dir==='up'?'arrow-up':'arrow-down'} s={12}/>{trend}</div>}</div>;

/* ══════════════════════════════════════════════════════
   DASHBOARD
   ══════════════════════════════════════════════════════ */
const Dashboard = () => (
  <div>
    <div className="hero">
      <ImgFallback src={IMGS.hero} alt="Agricultural landscape"/>
      <div className="hero-c">
        <h2>Season 2025/26 Dashboard</h2>
        <p>TechNexus Farmer Management System — Updated April 2, 2026</p>
      </div>
    </div>
    <div className="kpi-grid">
      <Kpi icon="users" label="Registered Farmers" value="1,288" trend="+84 this quarter" dir="up" color="blue"/>
      <Kpi icon="leaf" label="Total Hectares" value="3,950" trend="+12% vs last season" dir="up" color="green"/>
      <Kpi icon="truck" label="Deliveries (Season)" value="347" trend="+23 this week" dir="up" color="amber"/>
      <Kpi icon="map-pin" label="Field Visits (MTD)" value="156" trend="92% completion" dir="up" color="purple"/>
    </div>
    <div className="g31 mb18">
      <div className="card"><div className="card-hd"><h3>Yield Performance (tonnes)</h3><span className="meta">Oct 2025 — Apr 2026</span></div><div className="card-bd">
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={monthlyYield}>
            <defs><linearGradient id="gT" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0078D4" stopOpacity={.25}/><stop offset="100%" stopColor="#0078D4" stopOpacity={0}/></linearGradient><linearGradient id="gM" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#00B294" stopOpacity={.25}/><stop offset="100%" stopColor="#00B294" stopOpacity={0}/></linearGradient></defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8E8E8"/><XAxis dataKey="month" tick={{fontSize:11,fill:'#8A8A8A'}}/><YAxis tick={{fontSize:11,fill:'#8A8A8A'}}/><Tooltip contentStyle={{fontSize:12,borderRadius:8,border:'1px solid #E1E1E1'}}/>
            <Area type="monotone" dataKey="tobacco" name="Tobacco" stroke="#0078D4" fill="url(#gT)" strokeWidth={2.5}/>
            <Area type="monotone" dataKey="maize" name="Maize" stroke="#00B294" fill="url(#gM)" strokeWidth={2}/>
            <Area type="monotone" dataKey="other" name="Other" stroke="#7160E8" fill="none" strokeWidth={1.5} strokeDasharray="5 5"/>
          </AreaChart>
        </ResponsiveContainer>
        <div className="cleg"><div className="cleg-i"><div className="cleg-d" style={{background:'#0078D4'}}></div>Tobacco</div><div className="cleg-i"><div className="cleg-d" style={{background:'#00B294'}}></div>Maize</div><div className="cleg-i"><div className="cleg-d" style={{background:'#7160E8'}}></div>Other</div></div>
      </div></div>
      <div className="card"><div className="card-hd"><h3>Crop Distribution</h3></div><div className="card-bd">
        <ResponsiveContainer width="100%" height={180}><PieChart><Pie data={cropDist} cx="50%" cy="50%" innerRadius={48} outerRadius={75} paddingAngle={2} dataKey="value">{cropDist.map((e,i)=><Cell key={i} fill={e.color}/>)}</Pie><Tooltip formatter={v=>`${v}%`} contentStyle={{fontSize:12,borderRadius:8}}/></PieChart></ResponsiveContainer>
        <div className="cleg" style={{justifyContent:'center'}}>{cropDist.map((c,i)=><div key={i} className="cleg-i"><div className="cleg-d" style={{background:c.color}}></div>{c.name} ({c.value}%)</div>)}</div>
      </div></div>
    </div>
    <div className="g2 mb18">
      <div className="card"><div className="card-hd"><h3>Alerts</h3><span className="badge b-pending" style={{padding:'2px 8px',fontSize:10}}>{sysAlerts.length}</span></div><div className="card-bd">
        {sysAlerts.map(a=><div className="al-item" key={a.id}><div className={`al-dot ${a.type}`}><I n={a.type==='warning'?'alert-triangle':a.type==='error'?'x-circle':a.type==='success'?'check-circle':'activity'} s={14}/></div><div style={{flex:1}}><div className="al-t">{a.title}</div><div className="al-m">{a.message}</div><div className="al-tm">{a.time}</div></div></div>)}
      </div></div>
      <div className="card"><div className="card-hd"><h3>Recent Activity</h3></div><div className="card-bd">
        {recentAct.map((a,i)=><div className="act-item" key={i}><div className="act-dot"><I n={a.icon} s={13}/></div><div style={{flex:1}}><div style={{fontWeight:500,fontSize:13}}>{a.action}</div><div style={{fontSize:12,color:'var(--txt2)'}}>{a.detail}</div><div style={{fontSize:11,color:'var(--txt3)',marginTop:2}}>{a.time}</div></div></div>)}
      </div></div>
    </div>
    <div className="g2">
      <div className="card"><div className="card-hd"><h3>Regional Breakdown</h3></div><div className="card-bd">
        <ResponsiveContainer width="100%" height={240}><BarChart data={regionBk} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke="#E8E8E8"/><XAxis type="number" tick={{fontSize:11,fill:'#8A8A8A'}}/><YAxis type="category" dataKey="name" tick={{fontSize:11,fill:'#5C5C5C'}} width={78}/><Tooltip contentStyle={{fontSize:12,borderRadius:8}}/><Bar dataKey="farmers" name="Farmers" fill="#0078D4" radius={[0,4,4,0]} barSize={16}/></BarChart></ResponsiveContainer>
      </div></div>
      <div className="card"><div className="card-hd"><h3>Weather — Lilongwe</h3></div><div className="card-bd" style={{padding:0}}>
        <div className="weather"><div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><div><div className="wtemp">24°C</div><div style={{opacity:.85,fontSize:13}}>Partly Cloudy</div><div style={{opacity:.5,fontSize:11,marginTop:3}}>April 2, 2026 · 14:32 CAT</div></div><I n="sun" s={52} style={{opacity:.5}}/></div><div style={{display:'flex',gap:20,marginTop:16,fontSize:12,opacity:.75}}><span style={{display:'flex',alignItems:'center',gap:6}}><I n="droplets" s={14}/>68%</span><span style={{display:'flex',alignItems:'center',gap:6}}><I n="thermometer" s={14}/>18°–28°C</span><span style={{display:'flex',alignItems:'center',gap:6}}><I n="cloud" s={14}/>30% rain</span></div></div>
        <div className="wfc">{[['Thu',24,'\u2601\uFE0F'],['Fri',26,'\u2600\uFE0F'],['Sat',23,'\uD83C\uDF27\uFE0F'],['Sun',22,'\u2601\uFE0F'],['Mon',25,'\u2600\uFE0F']].map(([d,t,ic])=><div className="fday" key={d}><div className="d">{d}</div><div className="t">{t}°</div><div className="ic">{ic}</div></div>)}</div>
      </div></div>
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════
   FARMER REGISTRY
   ══════════════════════════════════════════════════════ */
const FarmersList = ({farmers, onSelect, onAdd, onDelete, toast}) => {
  const [search,setSearch]=useState('');const[fR,setFR]=useState('');const[fS,setFS]=useState('');const[pg,setPg]=useState(1);
  const PER=10;
  const filtered=farmers.filter(f=>{
    if(search&&!f.name.toLowerCase().includes(search.toLowerCase())&&!f.id.toLowerCase().includes(search.toLowerCase()))return false;
    if(fR&&f.region!==fR)return false;if(fS&&f.status!==fS)return false;return true;
  });
  const pages=Math.ceil(filtered.length/PER)||1;const paged=filtered.slice((pg-1)*PER,pg*PER);
  useEffect(()=>setPg(1),[search,fR,fS]);
  return <div>
    <div className="phd"><div><div className="pt">Farmer Registry</div><div className="ps">{farmers.length} farmers across {REGIONS.length} regions</div></div><button className="btn btn-p" onClick={onAdd}><I n="plus" s={14}/> Register Farmer</button></div>
    <div className="toolbar">
      <div className="sbox"><I n="search" s={14}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name or ID..."/></div>
      <select className="sel" value={fR} onChange={e=>setFR(e.target.value)}><option value="">All Regions</option>{REGIONS.map(r=><option key={r}>{r}</option>)}</select>
      <select className="sel" value={fS} onChange={e=>setFS(e.target.value)}><option value="">All Status</option>{STATUSES_F.map(s=><option key={s}>{s}</option>)}</select>
      <div className="toolbar-r">
        <button className="btn btn-o btn-sm" onClick={()=>{exportCSV(farmers.map(({img,...r})=>r),'tfms-farmers.csv');toast('Exported '+farmers.length+' farmers to CSV');}}><I n="download" s={13}/> Export</button>
      </div>
    </div>
    <div className="card"><div className="table-wrap"><table className="dt"><thead><tr><th>ID</th><th>Name</th><th>Region</th><th>Crop</th><th>Ha</th><th>Grade</th><th>Status</th><th>Last Visit</th><th></th></tr></thead><tbody>
      {paged.map(f=><tr key={f.id} onClick={()=>onSelect(f)}>
        <td className="tid">{f.id}</td>
        <td><div style={{display:'flex',alignItems:'center',gap:10}}><div className="f-av" style={{background:f.gender==='F'?'#EDEBFC':'#DEECF9',color:f.gender==='F'?'#7160E8':'#0078D4'}}><ImgFallback src={IMGS.portraits[f.img%IMGS.portraits.length]}/>{ini(f.name)}</div><div><div className="tname">{f.name}</div><div className="tsub">{f.village} · {f.club}</div></div></div></td>
        <td>{f.region}</td><td>{f.crop}</td><td>{f.hectares}</td>
        <td><span className={f.grade.includes('A')?'ga':'gb'}>{f.grade}</span></td>
        <td><Badge s={f.status}/></td>
        <td style={{fontSize:12,color:'var(--txt3)'}}>{f.lastVisit}</td>
        <td><div style={{display:'flex',gap:4}}><button className="btn-i" onClick={e=>{e.stopPropagation();onSelect(f);}} title="View"><I n="eye" s={14}/></button><button className="btn-i" onClick={e=>{e.stopPropagation();onDelete(f);}} title="Delete" style={{color:'var(--red)'}}><I n="trash" s={14}/></button></div></td>
      </tr>)}
    </tbody></table></div>
    <div className="tfoot"><span>Showing {(pg-1)*PER+1}–{Math.min(pg*PER,filtered.length)} of {filtered.length}</span>
      <div className="pag"><button className="pg" disabled={pg<=1} onClick={()=>setPg(pg-1)}><I n="chevron-left" s={12}/></button>{Array.from({length:Math.min(pages,5)},(_,i)=>i+1).map(p=><button key={p} className={`pg ${p===pg?'act':''}`} onClick={()=>setPg(p)}>{p}</button>)}{pages>5&&<button className="pg" disabled>...</button>}<button className="pg" disabled={pg>=pages} onClick={()=>setPg(pg+1)}><I n="chevron-right" s={12}/></button></div>
    </div></div>
  </div>;
};

/* ── FARMER DETAIL ── */
const FarmerDetail = ({farmer:f,onClose}) => {
  if(!f)return null;
  const yd=[{s:'22/23',y:Math.round(f.yield*.7)},{s:'23/24',y:Math.round(f.yield*.85)},{s:'24/25',y:Math.round(f.yield*.95)},{s:'25/26',y:f.yield}];
  return <React.Fragment><div className="overlay" onClick={onClose}/><div className="dp open"><div className="dp-hd"><h3>Farmer Profile</h3><div style={{display:'flex',gap:6}}><button className="btn-i"><I n="edit" s={14}/></button><button className="btn-i" onClick={onClose}><I n="x" s={14}/></button></div></div><div className="dp-bd">
    <div className="dp-profile"><div className="dp-av"><ImgFallback src={IMGS.portraits[f.img%IMGS.portraits.length]}/>{ini(f.name)}</div><div><div className="dp-nm">{f.name}</div><div className="dp-id">{f.id} · {f.club}</div><div style={{marginTop:6}}><Badge s={f.status}/></div></div></div>
    <div className="dp-fields">{[['Region',f.region],['District',f.district],['Village',f.village],['Phone',f.phone],['Primary Crop',f.crop],['Farm Size',f.hectares+' ha'],['Grade',f.grade],['Gender / Age',(f.gender==='M'?'Male':'Female')+' · '+f.age+' yrs'],['Registered',f.registered],['Last Visit',f.lastVisit]].map(([l,v],i)=><div className="dp-f" key={i}><label>{l}</label><div className={`v ${l==='Grade'&&f.grade.includes('A')?'ga':''}`}>{v}</div></div>)}</div>
    <div className="dp-chart"><h4>Yield History (kg)</h4><ResponsiveContainer width="100%" height={140}><BarChart data={yd}><CartesianGrid strokeDasharray="3 3" stroke="#E8E8E8"/><XAxis dataKey="s" tick={{fontSize:11,fill:'#8A8A8A'}}/><YAxis tick={{fontSize:11,fill:'#8A8A8A'}}/><Tooltip contentStyle={{fontSize:12,borderRadius:8}}/><Bar dataKey="y" name="Yield" fill="#0078D4" radius={[4,4,0,0]} barSize={30}/></BarChart></ResponsiveContainer></div>
    <div className="dp-acts"><button className="btn btn-p btn-sm"><I n="phone" s={12}/> Call</button><button className="btn btn-g btn-sm"><I n="map-pin" s={12}/> Schedule Visit</button><button className="btn btn-o btn-sm"><I n="file-text" s={12}/> Full History</button></div>
  </div></div></React.Fragment>;
};

/* ══════════════════════════════════════════════════════
   FIELD VISITS
   ══════════════════════════════════════════════════════ */
const FieldVisits = ({visits,farmers,onAddVisit,toast}) => {
  const[tab,setTab]=useState('all');const[av,setAv]=useState(null);const[run,setRun]=useState(false);const[el,setEl]=useState(0);const[gps,setGps]=useState(null);const[gpsL,setGpsL]=useState(false);const ir=useRef(null);
  useEffect(()=>{if(run){ir.current=setInterval(()=>setEl(e=>e+1),1000);}else clearInterval(ir.current);return()=>clearInterval(ir.current);},[run]);
  const startV=v=>{setAv(v);setEl(0);setRun(false);setGps(null);setGpsL(true);
    if(navigator.geolocation){navigator.geolocation.getCurrentPosition(p=>{setGps({lat:p.coords.latitude.toFixed(6),lng:p.coords.longitude.toFixed(6),acc:p.coords.accuracy.toFixed(0)});setGpsL(false);},()=>{setGps({lat:v.lat.toFixed(6),lng:v.lng.toFixed(6),acc:'simulated'});setGpsL(false);},{enableHighAccuracy:true,timeout:8000});}
    else{setGps({lat:v.lat.toFixed(6),lng:v.lng.toFixed(6),acc:'simulated'});setGpsL(false);}
  };
  const endV=()=>{const mins=Math.floor(el/60);toast(`Visit completed — ${mins} min recorded`,'success');setRun(false);setEl(0);setAv(null);};
  const fmt=s=>{const h=String(Math.floor(s/3600)).padStart(2,'0');const m=String(Math.floor((s%3600)/60)).padStart(2,'0');const sc=String(s%60).padStart(2,'0');return`${h}:${m}:${sc}`;};
  const fv=tab==='all'?visits:visits.filter(v=>v.status.toLowerCase().replace(/\s+/g,'-')===tab);
  return <div>
    <div className="phd"><div><div className="pt">Field Visits</div><div className="ps">{visits.length} visits this period</div></div><button className="btn btn-p" onClick={onAddVisit}><I n="plus" s={14}/> Schedule Visit</button></div>
    {av&&<div className="g2 mb22">
      <div className="vtimer"><div className="vtimer-l">Active Field Visit</div><div className="vtimer-f">{av.farmer} — {av.type}</div><div className="vtimer-d">{fmt(el)}</div><div className="vtimer-l">{run?'Visit in progress...':el>0?'Paused':'Ready to start'}</div>
        <div className="vtimer-c">{!run?<button className="tbtn start" onClick={()=>setRun(true)}><I n="play" s={20}/></button>:<button className="tbtn" onClick={()=>setRun(false)}><I n="pause" s={20}/></button>}<button className="tbtn stop" onClick={endV}><I n="square" s={18}/></button></div>
      </div>
      <div><div className="gps-box"><div className="gps-h"><I n="navigation" s={16}/><span>GPS Location</span>{gpsL&&<span style={{fontSize:11,color:'var(--txt3)',marginLeft:8}}>Acquiring...</span>}</div>
        {gps?<React.Fragment><div><span className="gps-pulse"></span><span className="gps-c">Lat: {gps.lat}° | Lng: {gps.lng}°</span></div><div className="gps-m">Accuracy: {gps.acc==='simulated'?'Simulated (demo)':'±'+gps.acc+'m'} · Auto-detected</div></React.Fragment>:<div style={{fontSize:12,color:'var(--txt3)'}}>Waiting for GPS...</div>}
      </div>
      <div className="card" style={{marginTop:12}}><div className="card-bd" style={{padding:14}}>{[['Visit ID',av.id],['Farmer',av.farmer+' ('+av.farmerId+')'],['Region',av.region],['Type',av.type],['Officer',av.officer],['Notes',av.notes]].map(([l,v],i)=><div className="dp-f" key={i} style={{marginBottom:10}}><label>{l}</label><div className="v">{v}</div></div>)}</div></div></div>
    </div>}
    <div className="tabs">{[['all','All Visits'],['scheduled','Scheduled'],['in-progress','In Progress'],['completed','Completed']].map(([k,l])=><button key={k} className={`tab ${tab===k?'act':''}`} onClick={()=>setTab(k)}>{l}</button>)}</div>
    <div className="card"><div className="table-wrap"><table className="dt"><thead><tr><th>Visit ID</th><th>Farmer</th><th>Region</th><th>Type</th><th>Date</th><th>Officer</th><th>Status</th><th></th></tr></thead><tbody>
      {fv.map(v=><tr key={v.id}><td className="tid">{v.id}</td><td><div className="tname">{v.farmer}</div><div className="tsub">{v.farmerId}</div></td><td>{v.region}</td><td>{v.type}</td><td>{v.date}</td><td>{v.officer}</td><td><Badge s={v.status}/></td>
        <td>{(v.status==='Scheduled'||v.status==='In Progress')?<button className="btn btn-g btn-sm" onClick={()=>startV(v)}><I n="play" s={12}/> Start</button>:<button className="btn btn-o btn-sm"><I n="eye" s={12}/> View</button>}</td>
      </tr>)}
    </tbody></table></div></div>
  </div>;
};

/* ══════════════════════════════════════════════════════
   DELIVERIES
   ══════════════════════════════════════════════════════ */
const DeliveriesPage = ({deliveries,onAdd,toast}) => <div>
  <div className="phd"><div><div className="pt">Deliveries &amp; Grading</div><div className="ps">Season 2025/26 — {deliveries.length} deliveries</div></div><button className="btn btn-p" onClick={onAdd}><I n="plus" s={14}/> Record Delivery</button></div>
  <div className="kpi-grid"><Kpi icon="truck" label="Total Deliveries" value={String(deliveries.length)} color="blue"/><Kpi icon="package" label="Total Weight" value="186.4 T" color="green"/><Kpi icon="award" label="Avg Grade" value="B+" color="amber"/><Kpi icon="trending-up" label="Revenue (est.)" value="MK 298M" color="purple"/></div>
  <div className="card"><div className="table-wrap"><table className="dt"><thead><tr><th>ID</th><th>Farmer</th><th>Crop</th><th>Weight</th><th>Grade</th><th>Depot</th><th>Date</th><th>Status</th><th>Value</th></tr></thead><tbody>
    {deliveries.map(d=><tr key={d.id}><td className="tid">{d.id}</td><td className="tname">{d.farmer}</td><td>{d.crop}</td><td>{d.weight}</td><td><span className={d.grade.includes('A')?'ga':'gb'}>{d.grade}</span></td><td style={{fontSize:12}}>{d.depot}</td><td>{d.date}</td><td><Badge s={d.status}/></td><td style={{fontWeight:600}}>{d.value}</td></tr>)}
  </tbody></table></div>
  <div className="tfoot"><span>{deliveries.length} records</span><button className="btn btn-o btn-sm" onClick={()=>{exportCSV(deliveries,'tfms-deliveries.csv');toast('Exported deliveries to CSV');}}><I n="download" s={13}/> Export CSV</button></div></div>
</div>;

/* ══════════════════════════════════════════════════════
   CROP MONITORING
   ══════════════════════════════════════════════════════ */
const CropMon = () => <div>
  <div className="hero" style={{height:120}}><ImgFallback src={IMGS.tobacco} alt="Crop field"/><div className="hero-c"><h2>Crop Monitoring</h2><p>Real-time crop health and growth stage tracking</p></div></div>
  <div className="kpi-grid"><Kpi icon="leaf" label="Crops on Track" value="82%" trend="+4%" dir="up" color="green"/><Kpi icon="alert-triangle" label="Pest Alerts" value="14" trend="3 critical" dir="down" color="amber"/><Kpi icon="droplets" label="Irrigation" value="34%" color="blue"/><Kpi icon="activity" label="Avg Stage" value="Maturity" color="purple"/></div>
  <div className="g2 mb18">
    <div className="card"><div className="card-hd"><h3>Growth Stages by Region</h3></div><div className="card-bd"><ResponsiveContainer width="100%" height={260}><BarChart data={[{r:'Lilongwe',s:5,v:15,f:25,m:55},{r:'Kasungu',s:3,v:10,f:20,m:67},{r:'Mzuzu',s:8,v:22,f:35,m:35},{r:'Blantyre',s:2,v:8,f:18,m:72},{r:'Zomba',s:12,v:28,f:30,m:30}]}><CartesianGrid strokeDasharray="3 3" stroke="#E8E8E8"/><XAxis dataKey="r" tick={{fontSize:11,fill:'#8A8A8A'}}/><YAxis tick={{fontSize:11,fill:'#8A8A8A'}}/><Tooltip contentStyle={{fontSize:12,borderRadius:8}}/><Bar dataKey="m" stackId="a" fill="#0078D4" name="Maturity"/><Bar dataKey="f" stackId="a" fill="#00B294" name="Flowering"/><Bar dataKey="v" stackId="a" fill="#FFB900" name="Vegetative"/><Bar dataKey="s" stackId="a" fill="#7160E8" name="Seedling"/></BarChart></ResponsiveContainer></div></div>
    <div className="card"><div className="card-hd"><h3>Pest &amp; Disease Report</h3></div><div className="card-bd">{[{p:'Aphids (Myzus persicae)',r:'Kasungu',sev:'High',n:12},{p:'Budworm (Helicoverpa)',r:'Lilongwe',sev:'Medium',n:8},{p:'Frog Eye Leaf Spot',r:'Mzuzu',sev:'Low',n:4},{p:'Tobacco Mosaic Virus',r:'Zomba',sev:'Medium',n:6},{p:'Root Knot Nematode',r:'Blantyre',sev:'Low',n:3}].map((x,i)=><div key={i} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'11px 0',borderBottom:i<4?'1px solid var(--border-l)':'none'}}><div><div style={{fontWeight:600,fontSize:13}}>{x.p}</div><div style={{fontSize:11,color:'var(--txt3)'}}>{x.r} · {x.n} farms</div></div><span className={`sev sev-${x.sev.toLowerCase().substring(0,3)}`}>{x.sev}</span></div>)}</div></div>
  </div>
</div>;

/* ══════════════════════════════════════════════════════
   REPORTS
   ══════════════════════════════════════════════════════ */
const Reports = ({toast}) => <div>
  <div className="pt">Reports &amp; Analytics</div><div className="ps">Generate and download operational reports</div>
  <div className="g3 mb18">{[{t:'Season Summary',d:'Yield, revenue, farmer performance',i:'bar-chart',ok:1},{t:'Field Visit Log',d:'All visits with GPS and outcomes',i:'map-pin',ok:1},{t:'Farmer Census',d:'Full registry with demographics',i:'users',ok:1},{t:'Delivery Report',d:'Grades, weights, auction results',i:'truck',ok:1},{t:'Pest Tracker',d:'Regional severity and treatment log',i:'alert-triangle',ok:0},{t:'Financial Summary',d:'Input costs, margins, revenue',i:'trending-up',ok:0}].map((r,i)=><div className="card rpt-card" key={i}><div className="card-bd"><div className="rpt-icon"><I n={r.i} s={22}/></div><div style={{flex:1}}><div style={{fontWeight:600,fontSize:14}}>{r.t}</div><div style={{fontSize:12,color:'var(--txt2)',marginTop:3}}>{r.d}</div><div style={{marginTop:12}}>{r.ok?<button className="btn btn-p btn-sm" onClick={()=>toast('Report generated: '+r.t)}><I n="download" s={12}/> Generate</button>:<span style={{fontSize:11,color:'var(--txt3)',fontStyle:'italic'}}>Coming soon</span>}</div></div></div></div>)}</div>
  <div className="card"><div className="card-hd"><h3>Season Performance vs Target</h3></div><div className="card-bd"><ResponsiveContainer width="100%" height={280}><BarChart data={[{m:'Farmers',a:1288,t:1500},{m:'Hectares',a:3950,t:4500},{m:'Yield (T)',a:186,t:220},{m:'Visits',a:892,t:1000},{m:'Deliveries',a:347,t:400}]}><CartesianGrid strokeDasharray="3 3" stroke="#E8E8E8"/><XAxis dataKey="m" tick={{fontSize:11,fill:'#8A8A8A'}}/><YAxis tick={{fontSize:11,fill:'#8A8A8A'}}/><Tooltip contentStyle={{fontSize:12,borderRadius:8}}/><Bar dataKey="t" fill="#E8E8E8" name="Target" radius={[4,4,0,0]} barSize={26}/><Bar dataKey="a" fill="#0078D4" name="Actual" radius={[4,4,0,0]} barSize={26}/></BarChart></ResponsiveContainer></div></div>
</div>;

/* ══════════════════════════════════════════════════════
   SETTINGS
   ══════════════════════════════════════════════════════ */
const Settings = () => <div>
  <div className="pt">Settings</div><div className="ps">System configuration and preferences</div>
  <div className="card mb18"><div className="card-hd"><h3>Organisation</h3></div><div className="card-bd"><div className="dp-fields" style={{padding:0}}>{[['Organisation','TechNexus MW'],['System','TFMS v1.0.0'],['License','Enterprise — 5,000 Farmers'],['Season','2025/26'],['Regions','10 Active'],['Data Sync','Last sync: 2 min ago']].map(([k,v],i)=><div className="dp-f" key={i}><label>{k}</label><div className="v">{v}</div></div>)}</div></div></div>
  <div className="card mb18"><div className="card-hd"><h3>Users &amp; Access</h3></div><div className="card-bd" style={{padding:0}}><div className="table-wrap"><table className="dt"><thead><tr><th>User</th><th>Role</th><th>Region</th><th>Last Active</th><th>Status</th></tr></thead><tbody>
    {[['Tafika Itaye','Administrator','All Regions','Online now','Active'],['Stephen Sembereka','Field Officer','Lilongwe, Mangochi','1h ago','Active'],['Netty Mkwamba','Field Officer','Blantyre, Salima','30 min ago','Active'],['Tiago Dresch','Developer','Remote','2h ago','Active']].map(([n,r,rg,a,s],i)=><tr key={i}><td className="tname">{n}</td><td>{r}</td><td>{rg}</td><td style={{fontSize:12,color:'var(--txt3)'}}>{a}</td><td><Badge s={s}/></td></tr>)}
  </tbody></table></div></div></div>
  <div className="card"><div className="card-hd"><h3>About</h3></div><div className="card-bd"><div className="dp-fields" style={{padding:0}}>{[['Application','TechNexus Farmer Management System'],['Version','1.0.0 (Build 2026.04.02)'],['Platform','ASP.NET Core 8 + Blazor Server'],['Database','PostgreSQL 16'],['Developer','TechNexus MW — Software Division'],['Contact','technexus_mw@proton.me']].map(([k,v],i)=><div className="dp-f" key={i}><label>{k}</label><div className="v">{v}</div></div>)}</div></div></div>
</div>;

/* ══════════════════════════════════════════════════════
   APP SHELL
   ══════════════════════════════════════════════════════ */
const App = () => {
  const[page,setPage]=useState('dashboard');const[selF,setSelF]=useState(null);const[showN,setShowN]=useState(false);const[sideOpen,setSideOpen]=useState(false);
  const[farmers,setFarmers]=useState(initFarmers);const[visits,setVisits]=useState(initVisits);const[deliveries,setDeliveries]=useState(initDeliveries);
  const[modal,setModal]=useState(null);const[confirm,setConfirm]=useState(null);
  const{add:toast,Toasts}=useToasts();

  // Form states
  const[ff,setFF]=useState({name:'',gender:'M',age:'',region:'Lilongwe',district:'',village:'',phone:'',hectares:'',crop:'Burley Tobacco',club:''});
  const[vf,setVF]=useState({farmerId:'',type:'Crop Inspection',date:'',officer:'Stephen Sembereka',notes:''});
  const[df,setDF]=useState({farmer:'',crop:'Burley Tobacco',weight:'',grade:'B',depot:'',date:''});

  const nav=[{key:'dashboard',label:'Dashboard',icon:'home'},{key:'farmers',label:'Farmer Registry',icon:'users',badge:String(farmers.length)},{key:'visits',label:'Field Visits',icon:'map-pin',badge:String(visits.filter(v=>v.status==='Scheduled').length),ba:1},{key:'crops',label:'Crop Monitoring',icon:'leaf'},{key:'deliveries',label:'Deliveries',icon:'truck'},{key:'reports',label:'Reports',icon:'file-text'}];
  const labels={dashboard:'Dashboard',farmers:'Farmer Registry',visits:'Field Visits',crops:'Crop Monitoring',deliveries:'Deliveries',reports:'Reports',settings:'Settings'};

  const goPage = p => {setPage(p);setSelF(null);setShowN(false);setSideOpen(false);};

  // Add farmer
  const submitFarmer = () => {
    if(!ff.name||!ff.district||!ff.village){toast('Please fill all required fields','error');return;}
    const nf={...ff,id:nextId(farmers,'TNF-'),age:parseInt(ff.age)||30,hectares:parseFloat(ff.hectares)||1,status:'Active',registered:today(),lastVisit:'—',yield:0,grade:'—',img:Math.floor(Math.random()*6)};
    setFarmers([nf,...farmers]);setModal(null);setFF({name:'',gender:'M',age:'',region:'Lilongwe',district:'',village:'',phone:'',hectares:'',crop:'Burley Tobacco',club:''});toast('Farmer '+nf.name+' registered ('+nf.id+')');
  };
  // Add visit
  const submitVisit = () => {
    if(!vf.farmerId||!vf.date){toast('Select a farmer and date','error');return;}
    const fm=farmers.find(f=>f.id===vf.farmerId);
    const nv={id:nextId(visits,'FV-2026-'),farmerId:vf.farmerId,farmer:fm?fm.name:'Unknown',region:fm?fm.region:'',type:vf.type,status:'Scheduled',date:vf.date,officer:vf.officer,notes:vf.notes,lat:-13.9+Math.random(),lng:33.7+Math.random()};
    setVisits([nv,...visits]);setModal(null);setVF({farmerId:'',type:'Crop Inspection',date:'',officer:'Stephen Sembereka',notes:''});toast('Visit scheduled for '+nv.farmer);
  };
  // Add delivery
  const submitDelivery = () => {
    if(!df.farmer||!df.weight||!df.depot||!df.date){toast('Fill all required fields','error');return;}
    const nd={id:nextId(deliveries,'DL-'),farmer:df.farmer,crop:df.crop,weight:df.weight+' kg',grade:df.grade,depot:df.depot,date:df.date,status:'Pending',value:'—'};
    setDeliveries([nd,...deliveries]);setModal(null);setDF({farmer:'',crop:'Burley Tobacco',weight:'',grade:'B',depot:'',date:''});toast('Delivery '+nd.id+' recorded');
  };
  // Delete farmer
  const deleteFarmer = f => {setConfirm({title:'Delete Farmer',msg:`Remove ${f.name} (${f.id}) from the registry?`,action:()=>{setFarmers(farmers.filter(x=>x.id!==f.id));setConfirm(null);toast(f.name+' removed from registry');}});};

  const renderPage = () => {
    switch(page){
      case'dashboard':return<Dashboard/>;
      case'farmers':return<FarmersList farmers={farmers} onSelect={setSelF} onAdd={()=>setModal('farmer')} onDelete={deleteFarmer} toast={toast}/>;
      case'visits':return<FieldVisits visits={visits} farmers={farmers} onAddVisit={()=>setModal('visit')} toast={toast}/>;
      case'crops':return<CropMon/>;
      case'deliveries':return<DeliveriesPage deliveries={deliveries} onAdd={()=>setModal('delivery')} toast={toast}/>;
      case'reports':return<Reports toast={toast}/>;
      case'settings':return<Settings/>;
      default:return<Dashboard/>;
    }
  };

  return <div>
    <Toasts/>

    {/* SIDEBAR OVERLAY (mobile) */}
    <div className={`sb-overlay ${sideOpen?'show':''}`} onClick={()=>setSideOpen(false)}/>

    {/* SIDEBAR */}
    <aside className={`sidebar ${sideOpen?'open':''}`}>
      <button className="sb-close" onClick={()=>setSideOpen(false)}><I n="x" s={18}/></button>
      <div className="sb-brand"><div className="sb-brand-icon">TF</div><div><h1>TFMS</h1><p>FARMER MANAGEMENT</p></div></div>
      <nav className="sb-nav">
        <div className="sb-section">Main</div>
        {nav.map(n=><button key={n.key} className={`sb-item ${page===n.key?'active':''}`} onClick={()=>goPage(n.key)}><I n={n.icon} s={17}/><span>{n.label}</span>{n.badge&&page!==n.key&&<span className={`sb-badge ${n.ba?'alert':''}`}>{n.badge}</span>}</button>)}
        <div className="sb-section">System</div>
        <button className={`sb-item ${page==='settings'?'active':''}`} onClick={()=>goPage('settings')}><I n="settings" s={17}/><span>Settings</span></button>
        <button className="sb-item"><I n="help-circle" s={17}/><span>Help &amp; Support</span></button>
      </nav>
      <div className="sb-footer"><div className="sb-avatar"><ImgFallback src={IMGS.officer}/>TI</div><div className="sb-footer-info"><div className="name">Tafika Itaye</div><div className="role">Administrator</div></div><button title="Sign out"><I n="log-out" s={15}/></button></div>
    </aside>

    {/* HEADER */}
    <header className="header">
      <button className="hd-burger" onClick={()=>setSideOpen(true)}><I n="menu" s={20}/></button>
      <div className="hd-crumb"><I n="globe" s={14}/><span>TechNexus MW</span><I n="chevron-right" s={12}/><span className="cur">{labels[page]}</span></div>
      <div className="hd-search"><I n="search" s={15}/><input placeholder="Search farmers, visits, deliveries..."/></div>
      <div className="hd-actions">
        <button className="hd-btn" onClick={()=>setShowN(!showN)} style={{position:'relative'}}><I n="bell" s={17}/><span className="dot"></span>
          {showN&&<div className="notif-dd" onClick={e=>e.stopPropagation()}><div className="notif-hd"><span>Notifications</span><button className="btn btn-o btn-sm" onClick={()=>{setShowN(false);toast('All notifications marked as read');}}>Mark all read</button></div>{sysAlerts.map(a=><div className="notif-i" key={a.id}><div className={`al-dot ${a.type}`}><I n={a.type==='warning'?'alert-triangle':'activity'} s={12}/></div><div><div style={{fontWeight:600,fontSize:12}}>{a.title}</div><div style={{fontSize:11,color:'var(--txt3)'}}>{a.time}</div></div></div>)}</div>}
        </button>
      </div>
    </header>

    {/* MAIN */}
    <main className="main">{renderPage()}<div className="foot">TFMS v1.0.0 · TechNexus Farmer Management System · © 2026 TechNexus MW</div></main>

    {/* FARMER DETAIL */}
    {selF&&<FarmerDetail farmer={selF} onClose={()=>setSelF(null)}/>}

    {/* MODALS */}
    <Modal open={modal==='farmer'} onClose={()=>setModal(null)} title="Register New Farmer" footer={<React.Fragment><button className="btn btn-o" onClick={()=>setModal(null)}>Cancel</button><button className="btn btn-p" onClick={submitFarmer}><I n="check" s={14}/> Register</button></React.Fragment>}>
      <div className="fg-row"><div className="fg"><label>Full Name *</label><input value={ff.name} onChange={e=>setFF({...ff,name:e.target.value})} placeholder="e.g. Chikondi Banda"/></div><div className="fg"><label>Gender</label><select value={ff.gender} onChange={e=>setFF({...ff,gender:e.target.value})}><option value="M">Male</option><option value="F">Female</option></select></div></div>
      <div className="fg-row"><div className="fg"><label>Age</label><input type="number" value={ff.age} onChange={e=>setFF({...ff,age:e.target.value})} placeholder="e.g. 35"/></div><div className="fg"><label>Phone</label><input value={ff.phone} onChange={e=>setFF({...ff,phone:e.target.value})} placeholder="+265..."/></div></div>
      <div className="fg-row"><div className="fg"><label>Region *</label><select value={ff.region} onChange={e=>setFF({...ff,region:e.target.value})}>{REGIONS.map(r=><option key={r}>{r}</option>)}</select></div><div className="fg"><label>District *</label><input value={ff.district} onChange={e=>setFF({...ff,district:e.target.value})} placeholder="e.g. Dowa"/></div></div>
      <div className="fg-row"><div className="fg"><label>Village *</label><input value={ff.village} onChange={e=>setFF({...ff,village:e.target.value})} placeholder="e.g. Mvera"/></div><div className="fg"><label>Club / Cooperative</label><input value={ff.club} onChange={e=>setFF({...ff,club:e.target.value})} placeholder="e.g. Mvera Growers"/></div></div>
      <div className="fg-row"><div className="fg"><label>Primary Crop</label><select value={ff.crop} onChange={e=>setFF({...ff,crop:e.target.value})}>{CROPS.map(c=><option key={c}>{c}</option>)}</select></div><div className="fg"><label>Farm Size (ha)</label><input type="number" step="0.1" value={ff.hectares} onChange={e=>setFF({...ff,hectares:e.target.value})} placeholder="e.g. 2.5"/></div></div>
    </Modal>

    <Modal open={modal==='visit'} onClose={()=>setModal(null)} title="Schedule Field Visit" footer={<React.Fragment><button className="btn btn-o" onClick={()=>setModal(null)}>Cancel</button><button className="btn btn-g" onClick={submitVisit}><I n="calendar" s={14}/> Schedule</button></React.Fragment>}>
      <div className="fg"><label>Farmer *</label><select value={vf.farmerId} onChange={e=>setVF({...vf,farmerId:e.target.value})}><option value="">— Select farmer —</option>{farmers.filter(f=>f.status!=='Suspended').map(f=><option key={f.id} value={f.id}>{f.name} ({f.id})</option>)}</select></div>
      <div className="fg-row"><div className="fg"><label>Visit Type</label><select value={vf.type} onChange={e=>setVF({...vf,type:e.target.value})}>{['Crop Inspection','Curing Assessment','Input Distribution','Harvest Planning','Pest Management','Training Session','Follow-up'].map(t=><option key={t}>{t}</option>)}</select></div><div className="fg"><label>Date *</label><input type="date" value={vf.date} onChange={e=>setVF({...vf,date:e.target.value})}/></div></div>
      <div className="fg"><label>Assigned Officer</label><select value={vf.officer} onChange={e=>setVF({...vf,officer:e.target.value})}>{['Stephen Sembereka','Tafika Itaye','Netty Mkwamba'].map(o=><option key={o}>{o}</option>)}</select></div>
      <div className="fg"><label>Notes</label><textarea value={vf.notes} onChange={e=>setVF({...vf,notes:e.target.value})} placeholder="Visit objectives, special instructions..."/></div>
    </Modal>

    <Modal open={modal==='delivery'} onClose={()=>setModal(null)} title="Record Delivery" footer={<React.Fragment><button className="btn btn-o" onClick={()=>setModal(null)}>Cancel</button><button className="btn btn-p" onClick={submitDelivery}><I n="truck" s={14}/> Record</button></React.Fragment>}>
      <div className="fg-row"><div className="fg"><label>Farmer Name *</label><input value={df.farmer} onChange={e=>setDF({...df,farmer:e.target.value})} placeholder="e.g. James Phiri"/></div><div className="fg"><label>Crop</label><select value={df.crop} onChange={e=>setDF({...df,crop:e.target.value})}>{CROPS.map(c=><option key={c}>{c}</option>)}</select></div></div>
      <div className="fg-row"><div className="fg"><label>Weight (kg) *</label><input type="number" value={df.weight} onChange={e=>setDF({...df,weight:e.target.value})} placeholder="e.g. 1250"/></div><div className="fg"><label>Grade</label><select value={df.grade} onChange={e=>setDF({...df,grade:e.target.value})}>{['A+','A','B+','B','C+','C'].map(g=><option key={g}>{g}</option>)}</select></div></div>
      <div className="fg-row"><div className="fg"><label>Depot / Auction Floor *</label><input value={df.depot} onChange={e=>setDF({...df,depot:e.target.value})} placeholder="e.g. Lilongwe Auction Floor"/></div><div className="fg"><label>Date *</label><input type="date" value={df.date} onChange={e=>setDF({...df,date:e.target.value})}/></div></div>
    </Modal>

    {/* CONFIRM DIALOG */}
    <Modal open={!!confirm} onClose={()=>setConfirm(null)} title={confirm?.title||'Confirm'}>
      <div className="confirm-inner"><I n="alert-triangle" s={40} style={{color:'var(--amber)'}}/><p>{confirm?.msg}</p><div className="confirm-btns"><button className="btn btn-o" onClick={()=>setConfirm(null)}>Cancel</button><button className="btn btn-d" onClick={confirm?.action}><I n="trash" s={14}/> Delete</button></div></div>
    </Modal>
  </div>;
};

/* ── MOUNT ── */
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);
