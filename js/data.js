// TFMS — TechNexus Farmer Management System
// Seed Data · github.com/tafika-itaye/TFMS

const CLUSTERS = ['Kasungu West','Kasungu North','Mchinji South','Dowa Cluster','Lilongwe Central','Tete Border Zone','Nampula Zone'];
const DISTRICTS = ['Kasungu','Mchinji','Dowa','Lilongwe','Nampula (MZ)','Tete (MZ)'];
const CROPS = ['Tobacco','Maize','Soya','Cotton','Tea','Coffee','Sugar Cane'];
const GRADES = ['Grade A','Grade B1','Grade B2','Grade C','Rejected'];
const STAGES = ['Seedbed','Transplanted','Topping','Flowering','Ripening','Harvesting','Curing'];

const SEED_FARMERS = [
  { id:'TF-00001', name:'Aleke James Phiri',    district:'Kasungu',      village:'Chulu',       cluster:'Kasungu West',      ha:2.4, biometric:'enrolled', status:'active',   season:'2026', gender:'M', dob:'1980-04-15', phone:'+265 999 101 001', crops:['Tobacco','Maize'], gapScore:88, creditBalance:145000, creditLimit:300000, lat:-13.0050, lng:33.4850 },
  { id:'TF-00002', name:'Grace Tembo',           district:'Mchinji',      village:'Mkanda',      cluster:'Mchinji South',     ha:1.8, biometric:'enrolled', status:'active',   season:'2026', gender:'F', dob:'1985-07-22', phone:'+265 999 101 002', crops:['Tobacco'],         gapScore:92, creditBalance:98000,  creditLimit:200000, lat:-13.8030, lng:32.8900 },
  { id:'TF-00003', name:'Boniface Chirwa',       district:'Dowa',         village:'Mponela',     cluster:'Dowa Cluster',      ha:3.1, biometric:'pending',  status:'pending',  season:'2026', gender:'M', dob:'1972-12-01', phone:'+265 999 101 003', crops:['Tobacco','Soya'],  gapScore:0,  creditBalance:0,      creditLimit:0,      lat:-13.5800, lng:33.8800 },
  { id:'TF-00004', name:'Rosa Machava',          district:'Nampula (MZ)', village:'Monapo',      cluster:'Nampula Zone',      ha:1.2, biometric:'enrolled', status:'active',   season:'2026', gender:'F', dob:'1990-03-18', phone:'+258 84 201 0004', crops:['Tobacco','Cotton'],gapScore:95, creditBalance:55000,  creditLimit:150000, lat:-15.1200, lng:39.2800 },
  { id:'TF-00005', name:'Joseph Kalua',          district:'Lilongwe',     village:'Linthipe',    cluster:'Lilongwe Central',  ha:4.0, biometric:'enrolled', status:'suspended',season:'2026', gender:'M', dob:'1975-09-05', phone:'+265 999 101 005', crops:['Tobacco'],         gapScore:0,  creditBalance:320000, creditLimit:400000, lat:-14.1000, lng:33.7700 },
  { id:'TF-00006', name:'Fatima Nkosi',          district:'Kasungu',      village:'Chamama',     cluster:'Kasungu West',      ha:2.9, biometric:'enrolled', status:'active',   season:'2026', gender:'F', dob:'1983-11-30', phone:'+265 999 101 006', crops:['Tobacco','Maize'], gapScore:79, creditBalance:210000, creditLimit:350000, lat:-13.0100, lng:33.5100 },
  { id:'TF-00007', name:'Peter Gondwe',          district:'Mchinji',      village:'Kapiri',      cluster:'Mchinji South',     ha:1.5, biometric:'pending',  status:'active',   season:'2026', gender:'M', dob:'1992-06-14', phone:'+265 999 101 007', crops:['Tobacco'],         gapScore:74, creditBalance:75000,  creditLimit:175000, lat:-13.7800, lng:32.8100 },
  { id:'TF-00008', name:'Amelia Bila',           district:'Tete (MZ)',    village:'Changara',    cluster:'Tete Border Zone',  ha:2.2, biometric:'enrolled', status:'active',   season:'2026', gender:'F', dob:'1988-02-27', phone:'+258 84 201 0008', crops:['Tobacco','Cotton'],gapScore:90, creditBalance:130000, creditLimit:250000, lat:-16.8400, lng:33.1100 },
  { id:'TF-00009', name:'Samuel Banda',          district:'Dowa',         village:'Bowe',        cluster:'Dowa Cluster',      ha:0.9, biometric:'enrolled', status:'active',   season:'2026', gender:'M', dob:'1968-08-19', phone:'+265 999 101 009', crops:['Maize','Soya'],    gapScore:81, creditBalance:42000,  creditLimit:100000, lat:-13.5500, lng:33.9000 },
  { id:'TF-00010', name:'Mary Zuze',             district:'Kasungu',      village:'Nkhamenya',   cluster:'Kasungu North',     ha:3.6, biometric:'enrolled', status:'active',   season:'2026', gender:'F', dob:'1979-05-11', phone:'+265 999 101 010', crops:['Tobacco'],         gapScore:84, creditBalance:280000, creditLimit:400000, lat:-12.8800, lng:33.5500 },
  { id:'TF-00011', name:'Charles Mwale',         district:'Kasungu',      village:'Kasungu Town',cluster:'Kasungu North',     ha:2.0, biometric:'enrolled', status:'active',   season:'2026', gender:'M', dob:'1981-01-09', phone:'+265 999 101 011', crops:['Tobacco','Maize'], gapScore:77, creditBalance:155000, creditLimit:280000, lat:-13.0350, lng:33.4700 },
  { id:'TF-00012', name:'Lucia Jere',            district:'Lilongwe',     village:'Chikwawa',    cluster:'Lilongwe Central',  ha:1.1, biometric:'pending',  status:'pending',  season:'2026', gender:'F', dob:'1995-04-22', phone:'+265 999 101 012', crops:['Tobacco'],         gapScore:0,  creditBalance:0,      creditLimit:0,      lat:-14.0800, lng:33.7500 },
  { id:'TF-00013', name:'Elias Dzimbiri',        district:'Mchinji',      village:'Zulu',        cluster:'Mchinji South',     ha:3.3, biometric:'enrolled', status:'active',   season:'2026', gender:'M', dob:'1970-10-31', phone:'+265 999 101 013', crops:['Tobacco','Cotton'],gapScore:91, creditBalance:240000, creditLimit:380000, lat:-13.8200, lng:32.7800 },
  { id:'TF-00014', name:'Tendai Moyo',           district:'Dowa',         village:'Nambuma',     cluster:'Dowa Cluster',      ha:1.6, biometric:'enrolled', status:'active',   season:'2026', gender:'M', dob:'1987-07-07', phone:'+265 999 101 014', crops:['Tobacco'],         gapScore:85, creditBalance:105000, creditLimit:200000, lat:-13.6000, lng:33.8600 },
  { id:'TF-00015', name:'Anita Kamwendo',        district:'Kasungu',      village:'Wimbe',       cluster:'Kasungu West',      ha:2.7, biometric:'enrolled', status:'active',   season:'2026', gender:'F', dob:'1983-12-15', phone:'+265 999 101 015', crops:['Tobacco','Soya'],  gapScore:87, creditBalance:195000, creditLimit:330000, lat:-13.0200, lng:33.5000 },
  { id:'TF-00016', name:'Damião Cumbe',          district:'Tete (MZ)',    village:'Moatize',     cluster:'Tete Border Zone',  ha:1.9, biometric:'enrolled', status:'active',   season:'2026', gender:'M', dob:'1984-03-20', phone:'+258 84 201 0016', crops:['Tobacco'],         gapScore:82, creditBalance:118000, creditLimit:220000, lat:-16.1100, lng:33.7400 },
  { id:'TF-00017', name:'Veronica Nhlane',       district:'Nampula (MZ)', village:'Meconta',     cluster:'Nampula Zone',      ha:1.4, biometric:'pending',  status:'active',   season:'2026', gender:'F', dob:'1991-09-04', phone:'+258 84 201 0017', crops:['Cotton','Maize'],  gapScore:73, creditBalance:68000,  creditLimit:160000, lat:-15.0500, lng:39.8400 },
  { id:'TF-00018', name:'Arnold Zgambo',         district:'Kasungu',      village:'Chikangawa',  cluster:'Kasungu North',     ha:4.2, biometric:'enrolled', status:'active',   season:'2026', gender:'M', dob:'1965-06-25', phone:'+265 999 101 018', crops:['Tobacco'],         gapScore:93, creditBalance:320000, creditLimit:500000, lat:-12.9100, lng:33.6000 },
  { id:'TF-00019', name:'Esther Phiri',          district:'Lilongwe',     village:'Ngona',       cluster:'Lilongwe Central',  ha:0.8, biometric:'enrolled', status:'active',   season:'2026', gender:'F', dob:'1993-11-17', phone:'+265 999 101 019', crops:['Maize','Soya'],    gapScore:70, creditBalance:35000,  creditLimit:90000,  lat:-14.1500, lng:33.7000 },
  { id:'TF-00020', name:'Richwell Kumwenda',     district:'Mchinji',      village:'Nsaru',       cluster:'Mchinji South',     ha:2.1, biometric:'enrolled', status:'active',   season:'2026', gender:'M', dob:'1978-02-08', phone:'+265 999 101 020', crops:['Tobacco','Maize'], gapScore:78, creditBalance:148000, creditLimit:270000, lat:-13.7500, lng:32.9200 },
  { id:'TF-00021', name:'Felicidade Mário',      district:'Nampula (MZ)', village:'Murrupula',   cluster:'Nampula Zone',      ha:2.6, biometric:'enrolled', status:'active',   season:'2026', gender:'F', dob:'1982-05-13', phone:'+258 84 201 0021', crops:['Tobacco','Cotton'],gapScore:89, creditBalance:175000, creditLimit:300000, lat:-15.4700, lng:36.9800 },
  { id:'TF-00022', name:'George Lungu',          district:'Kasungu',      village:'Lisasadzi',   cluster:'Kasungu West',      ha:1.7, biometric:'enrolled', status:'suspended',season:'2026', gender:'M', dob:'1976-08-29', phone:'+265 999 101 022', crops:['Tobacco'],         gapScore:0,  creditBalance:145000, creditLimit:200000, lat:-13.0450, lng:33.4600 },
  { id:'TF-00023', name:'Priscilla Tembo',       district:'Dowa',         village:'Madisi',      cluster:'Dowa Cluster',      ha:1.3, biometric:'pending',  status:'pending',  season:'2026', gender:'F', dob:'1996-01-06', phone:'+265 999 101 023', crops:['Maize','Soya'],    gapScore:0,  creditBalance:0,      creditLimit:0,      lat:-13.5900, lng:33.8200 },
  { id:'TF-00024', name:'Inocêncio da Silva',    district:'Tete (MZ)',    village:'Ulongue',     cluster:'Tete Border Zone',  ha:3.8, biometric:'enrolled', status:'active',   season:'2026', gender:'M', dob:'1971-07-18', phone:'+258 84 201 0024', crops:['Tobacco','Cotton'],gapScore:96, creditBalance:275000, creditLimit:450000, lat:-14.7200, lng:34.3500 },
  { id:'TF-00025', name:'Beatrice Msiska',       district:'Kasungu',      village:'Kabwafu',     cluster:'Kasungu North',     ha:2.2, biometric:'enrolled', status:'active',   season:'2026', gender:'F', dob:'1985-10-03', phone:'+265 999 101 025', crops:['Tobacco'],         gapScore:83, creditBalance:162000, creditLimit:290000, lat:-12.9500, lng:33.5800 },
  { id:'TF-00026', name:'Kenneth Nyirenda',      district:'Mchinji',      village:'Mkhonjeni',   cluster:'Mchinji South',     ha:1.9, biometric:'enrolled', status:'active',   season:'2026', gender:'M', dob:'1980-04-21', phone:'+265 999 101 026', crops:['Tobacco','Soya'],  gapScore:80, creditBalance:135000, creditLimit:240000, lat:-13.7200, lng:32.8500 },
  { id:'TF-00027', name:'Clementina Nhantumbo', district:'Nampula (MZ)', village:'Ribaue',      cluster:'Nampula Zone',      ha:1.0, biometric:'enrolled', status:'active',   season:'2026', gender:'F', dob:'1990-06-12', phone:'+258 84 201 0027', crops:['Cotton'],          gapScore:75, creditBalance:45000,  creditLimit:130000, lat:-14.9800, lng:38.2700 },
  { id:'TF-00028', name:'Wilfred Kapalamula',   district:'Lilongwe',     village:'Kachebere',   cluster:'Lilongwe Central',  ha:2.5, biometric:'enrolled', status:'active',   season:'2026', gender:'M', dob:'1977-03-15', phone:'+265 999 101 028', crops:['Tobacco','Maize'], gapScore:86, creditBalance:188000, creditLimit:310000, lat:-14.0300, lng:33.7200 },
  { id:'TF-00029', name:'Patricia Nakhumwa',     district:'Kasungu',      village:'Kaluluma',    cluster:'Kasungu West',      ha:1.6, biometric:'enrolled', status:'active',   season:'2026', gender:'F', dob:'1989-09-28', phone:'+265 999 101 029', crops:['Tobacco'],         gapScore:87, creditBalance:112000, creditLimit:210000, lat:-13.0150, lng:33.5200 },
  { id:'TF-00030', name:'Agnaldo Patel',         district:'Tete (MZ)',    village:'Cahora Bassa',cluster:'Tete Border Zone',  ha:3.0, biometric:'enrolled', status:'active',   season:'2026', gender:'M', dob:'1974-11-09', phone:'+258 84 201 0030', crops:['Tobacco','Cotton'],gapScore:94, creditBalance:225000, creditLimit:400000, lat:-15.5800, lng:32.4200 },
];

const SEED_VISITS = [
  { id:'FV-2026-0841', farmerId:'TF-00001', farmerName:'Aleke Phiri',    officer:'T. Itaye',   cluster:'Kasungu West',     stage:'Topping',      gapScore:88, date:'2026-03-29', time:'08:14', status:'completed', notes:'Good canopy development. Recommend topping at 18 leaves.',      lat:-13.0050, lng:33.4850 },
  { id:'FV-2026-0842', farmerId:'TF-00006', farmerName:'Fatima Nkosi',   officer:'T. Itaye',   cluster:'Kasungu West',     stage:'Topping',      gapScore:92, date:'2026-03-29', time:'09:45', status:'completed', notes:'Excellent crop condition. No pest pressure observed.',           lat:-13.0100, lng:33.5100 },
  { id:'FV-2026-0843', farmerId:'TF-00002', farmerName:'Grace Tembo',    officer:'M. Banda',   cluster:'Mchinji South',    stage:'Flowering',    gapScore:76, date:'2026-03-29', time:'10:02', status:'completed', notes:'Minor aphid presence on lower leaves. Applied recommended spray.',lat:-13.8030, lng:32.8900 },
  { id:'FV-2026-0844', farmerId:'TF-00003', farmerName:'Boniface Chirwa',officer:'P. Mussa',   cluster:'Dowa Cluster',     stage:'Transplanted', gapScore:0,  date:'2026-03-29', time:'11:30', status:'flagged',   notes:'Stand density below target. Re-transplanting required in two rows.',lat:-13.5800, lng:33.8800 },
  { id:'FV-2026-0845', farmerId:'TF-00004', farmerName:'Rosa Machava',   officer:'R. João',    cluster:'Tete Border Zone', stage:'Topping',      gapScore:95, date:'2026-03-29', time:'12:15', status:'completed', notes:'Model farm. Used as training reference.',                        lat:-16.8400, lng:33.1100 },
  { id:'FV-2026-0846', farmerId:'TF-00009', farmerName:'Samuel Banda',   officer:'P. Mussa',   cluster:'Dowa Cluster',     stage:'Transplanted', gapScore:0,  date:'2026-03-29', time:'13:00', status:'pending',   notes:'Offline — pending sync.',                                        lat:-13.5500, lng:33.9000 },
  { id:'FV-2026-0847', farmerId:'TF-00010', farmerName:'Mary Zuze',      officer:'T. Itaye',   cluster:'Kasungu North',    stage:'Topping',      gapScore:84, date:'2026-03-29', time:'14:20', status:'completed', notes:'Irrigation scheduling discussed. Soil moisture adequate.',        lat:-12.8800, lng:33.5500 },
  { id:'FV-2026-0848', farmerId:'TF-00008', farmerName:'Amelia Bila',    officer:'R. João',    cluster:'Tete Border Zone', stage:'Ripening',     gapScore:90, date:'2026-03-29', time:'14:55', status:'completed', notes:'Colour developing well. Harvest in approximately 10 days.',       lat:-16.8400, lng:33.1100 },
  { id:'FV-2026-0833', farmerId:'TF-00015', farmerName:'Anita Kamwendo', officer:'T. Itaye',   cluster:'Kasungu West',     stage:'Topping',      gapScore:87, date:'2026-03-28', time:'09:10', status:'completed', notes:'Good compliance. Discussed green tobacco sickness prevention.',   lat:-13.0200, lng:33.5000 },
  { id:'FV-2026-0834', farmerId:'TF-00013', farmerName:'Elias Dzimbiri', officer:'M. Banda',   cluster:'Mchinji South',    stage:'Flowering',    gapScore:91, date:'2026-03-28', time:'10:30', status:'completed', notes:'Excellent GAP compliance. Nominated for district best-farmer.',  lat:-13.8200, lng:32.7800 },
  { id:'FV-2026-0835', farmerId:'TF-00024', farmerName:'Inocêncio Silva',officer:'R. João',    cluster:'Tete Border Zone', stage:'Harvesting',   gapScore:96, date:'2026-03-28', time:'11:00', status:'completed', notes:'First priming commenced. Quality leaf grade A expected.',         lat:-14.7200, lng:34.3500 },
  { id:'FV-2026-0836', farmerId:'TF-00020', farmerName:'Richwell Kumwenda',officer:'M. Banda', cluster:'Mchinji South',    stage:'Topping',      gapScore:78, date:'2026-03-28', time:'13:45', status:'completed', notes:'Some suckers emerging post-topping. Advised on removal.',        lat:-13.7500, lng:32.9200 },
  { id:'FV-2026-0810', farmerId:'TF-00018', farmerName:'Arnold Zgambo',  officer:'T. Itaye',   cluster:'Kasungu North',    stage:'Ripening',     gapScore:93, date:'2026-03-25', time:'08:00', status:'completed', notes:'Premium leaf formation. Minimal field defects.',                 lat:-12.9100, lng:33.6000 },
  { id:'FV-2026-0811', farmerId:'TF-00021', farmerName:'Felicidade Mário',officer:'A. Machava',cluster:'Nampula Zone',     stage:'Topping',      gapScore:89, date:'2026-03-25', time:'10:15', status:'completed', notes:'Cross-border protocol followed correctly.',                      lat:-15.4700, lng:36.9800 },
];

const SEED_INPUTS = [
  { id:'DIS-2026-001', farmerId:'TF-00001', farmerName:'Aleke Phiri',    cluster:'Kasungu West',     date:'2026-02-10', compoundD:3, can:2, seedKg:0.5, pesticideLt:1, totalMK:145000, method:'Deduct from crop proceeds', status:'delivered', authorised:'T. Itaye' },
  { id:'DIS-2026-002', farmerId:'TF-00006', farmerName:'Fatima Nkosi',   cluster:'Kasungu West',     date:'2026-02-10', compoundD:4, can:3, seedKg:0.5, pesticideLt:2, totalMK:210000, method:'Deduct from crop proceeds', status:'delivered', authorised:'T. Itaye' },
  { id:'DIS-2026-003', farmerId:'TF-00002', farmerName:'Grace Tembo',    cluster:'Mchinji South',    date:'2026-02-12', compoundD:2, can:2, seedKg:0.5, pesticideLt:1, totalMK:98000,  method:'Deduct from crop proceeds', status:'delivered', authorised:'M. Banda' },
  { id:'DIS-2026-004', farmerId:'TF-00008', farmerName:'Amelia Bila',    cluster:'Tete Border Zone', date:'2026-02-14', compoundD:3, can:2, seedKg:0.5, pesticideLt:1, totalMK:130000, method:'Deduct from crop proceeds', status:'delivered', authorised:'R. João'  },
  { id:'DIS-2026-005', farmerId:'TF-00013', farmerName:'Elias Dzimbiri', cluster:'Mchinji South',    date:'2026-02-15', compoundD:5, can:3, seedKg:1.0, pesticideLt:2, totalMK:240000, method:'Deduct from crop proceeds', status:'delivered', authorised:'M. Banda' },
  { id:'DIS-2026-006', farmerId:'TF-00015', farmerName:'Anita Kamwendo', cluster:'Kasungu West',     date:'2026-02-15', compoundD:4, can:2, seedKg:0.5, pesticideLt:1, totalMK:195000, method:'Deduct from crop proceeds', status:'delivered', authorised:'T. Itaye' },
  { id:'DIS-2026-007', farmerId:'TF-00018', farmerName:'Arnold Zgambo',  cluster:'Kasungu North',    date:'2026-02-16', compoundD:6, can:4, seedKg:1.0, pesticideLt:3, totalMK:320000, method:'Deduct from crop proceeds', status:'delivered', authorised:'T. Itaye' },
  { id:'DIS-2026-008', farmerId:'TF-00024', farmerName:'Inocêncio Silva',cluster:'Tete Border Zone', date:'2026-02-18', compoundD:5, can:3, seedKg:1.0, pesticideLt:2, totalMK:275000, method:'Cash payment',              status:'delivered', authorised:'R. João'  },
  { id:'DIS-2026-009', farmerId:'TF-00004', farmerName:'Rosa Machava',   cluster:'Nampula Zone',     date:'2026-02-20', compoundD:2, can:1, seedKg:0.5, pesticideLt:1, totalMK:55000,  method:'Deduct from crop proceeds', status:'delivered', authorised:'A. Machava'},
  { id:'DIS-2026-010', farmerId:'TF-00020', farmerName:'Richwell Kumwenda',cluster:'Mchinji South',  date:'2026-02-22', compoundD:3, can:2, seedKg:0.5, pesticideLt:1, totalMK:148000, method:'Deduct from crop proceeds', status:'delivered', authorised:'M. Banda' },
  { id:'DIS-2026-011', farmerId:'TF-00010', farmerName:'Mary Zuze',      cluster:'Kasungu North',    date:'2026-02-22', compoundD:5, can:3, seedKg:1.0, pesticideLt:2, totalMK:280000, method:'Deduct from crop proceeds', status:'delivered', authorised:'T. Itaye' },
  { id:'DIS-2026-012', farmerId:'TF-00014', farmerName:'Tendai Moyo',    cluster:'Dowa Cluster',     date:'2026-02-25', compoundD:2, can:2, seedKg:0.5, pesticideLt:1, totalMK:105000, method:'Deduct from crop proceeds', status:'delivered', authorised:'P. Mussa'  },
  { id:'DIS-2026-013', farmerId:'TF-00028', farmerName:'Wilfred Kapalamula',cluster:'Lilongwe Central',date:'2026-03-01',compoundD:3, can:2, seedKg:0.5, pesticideLt:1, totalMK:188000, method:'Deduct from crop proceeds', status:'delivered', authorised:'C. Phiri'  },
  { id:'DIS-2026-014', farmerId:'TF-00026', farmerName:'Kenneth Nyirenda',cluster:'Mchinji South',   date:'2026-03-01', compoundD:3, can:2, seedKg:0.5, pesticideLt:1, totalMK:135000, method:'Deduct from crop proceeds', status:'pending',   authorised:'M. Banda' },
  { id:'DIS-2026-015', farmerId:'TF-00021', farmerName:'Felicidade Mário',cluster:'Nampula Zone',    date:'2026-03-05', compoundD:4, can:2, seedKg:0.5, pesticideLt:2, totalMK:175000, method:'Bank transfer',             status:'delivered', authorised:'A. Machava'},
];

const SEED_FACTORY = [
  { id:'WB-2026-001', truck:'TRK-4421', origin:'Kasungu West',     grossKg:8420,  tareKg:4220, bales:34, gate:'Gate 1', operator:'W. Nkhoma', date:'2026-03-29', time:'08:30', status:'cleared',     grades:{'Grade A':62,'Grade B1':28,'Grade B2':8,'Rejected':2}, notes:'' },
  { id:'WB-2026-002', truck:'TRK-4428', origin:'Mchinji South',    grossKg:11040, tareKg:4240, bales:55, gate:'Gate 1', operator:'F. Tembo',  date:'2026-03-29', time:'10:00', status:'cleared',     grades:{'Grade A':71,'Grade B1':18,'Grade B2':9,'Rejected':2}, notes:'' },
  { id:'WB-2026-003', truck:'TRK-4435', origin:'Dowa Cluster',     grossKg:9860,  tareKg:4260, bales:45, gate:'Gate 3', operator:'J. Mbewe',  date:'2026-03-29', time:'11:30', status:'discrepancy', grades:{'Grade A':55,'Grade B1':30,'Grade B2':12,'Rejected':3}, notes:'Bale BA-004 weight mismatch vs delivery note. Flagged for investigation.' },
  { id:'WB-2026-004', truck:'TRK-4441', origin:'Lilongwe Central', grossKg:10220, tareKg:4220, bales:48, gate:'Gate 3', operator:'W. Nkhoma', date:'2026-03-29', time:'13:00', status:'cleared',     grades:{'Grade A':68,'Grade B1':22,'Grade B2':8,'Rejected':2}, notes:'' },
  { id:'WB-2026-005', truck:'TRK-4449', origin:'Kasungu West',     grossKg:0,     tareKg:0,    bales:0,  gate:'Gate 1', operator:'—',         date:'2026-03-29', time:'—',     status:'en-route',    grades:{}, notes:'ETA 15:30' },
  { id:'WB-2026-006', truck:'TRK-4412', origin:'Tete Border Zone', grossKg:12400, tareKg:4350, bales:64, gate:'Gate 2', operator:'F. Tembo',  date:'2026-03-28', time:'09:15', status:'cleared',     grades:{'Grade A':75,'Grade B1':16,'Grade B2':7,'Rejected':2}, notes:'' },
  { id:'WB-2026-007', truck:'TRK-4415', origin:'Nampula Zone',     grossKg:9100,  tareKg:4150, bales:40, gate:'Gate 2', operator:'J. Mbewe',  date:'2026-03-28', time:'11:00', status:'cleared',     grades:{'Grade A':69,'Grade B1':21,'Grade B2':8,'Rejected':2}, notes:'' },
  { id:'WB-2026-008', truck:'TRK-4418', origin:'Mchinji South',    grossKg:10800, tareKg:4200, bales:52, gate:'Gate 1', operator:'W. Nkhoma', date:'2026-03-28', time:'13:45', status:'cleared',     grades:{'Grade A':65,'Grade B1':25,'Grade B2':8,'Rejected':2}, notes:'' },
  { id:'WB-2026-009', truck:'TRK-4401', origin:'Kasungu North',    grossKg:13200, tareKg:4400, bales:70, gate:'Gate 3', operator:'F. Tembo',  date:'2026-03-27', time:'08:00', status:'cleared',     grades:{'Grade A':72,'Grade B1':18,'Grade B2':8,'Rejected':2}, notes:'' },
  { id:'WB-2026-010', truck:'TRK-4404', origin:'Lilongwe Central', grossKg:8800,  tareKg:4000, bales:38, gate:'Gate 1', operator:'J. Mbewe',  date:'2026-03-27', time:'10:30', status:'cleared',     grades:{'Grade A':60,'Grade B1':28,'Grade B2':10,'Rejected':2}, notes:'' },
];

// Prices per input unit (MWK)
const INPUT_PRICES = {
  compoundDPerBag: 28000,
  canPerBag: 22000,
  seedPerKg: 15000,
  pesticidePerLitre: 18000
};

// Analytics data (seasonal)
const ANALYTICS = {
  monthlyIntake: [
    { month:'Sep', T:42 }, { month:'Oct', T:74 }, { month:'Nov', T:116 },
    { month:'Dec', T:165 }, { month:'Jan', T:190 }, { month:'Feb', T:211 },
    { month:'Mar', T:44.6 }
  ],
  districtProduction: [
    { district:'Kasungu',       T:284 }, { district:'Mchinji',  T:210 },
    { district:'Dowa',          T:153 }, { district:'Lilongwe', T:119 },
    { district:'Nampula (MZ)',  T:51  }, { district:'Tete (MZ)',T:25  }
  ],
  gapScoreDistrib: [
    { band:'90–100', count:2840, pct:22.8 }, { band:'80–89', count:4488, pct:36.0 },
    { band:'70–79',  count:3120, pct:25.0 }, { band:'60–69', count:1248, pct:10.0 },
    { band:'Below 60',count:784, pct:6.2 }
  ],
  officerProgress: [
    { officer:'T. Itaye',     cluster:'Kasungu West',     done:14, target:16 },
    { officer:'M. Banda',     cluster:'Mchinji South',    done:11, target:12 },
    { officer:'P. Mussa',     cluster:'Dowa Cluster',     done:7,  target:12 },
    { officer:'R. João',      cluster:'Tete Border Zone', done:9,  target:9  },
    { officer:'C. Phiri',     cluster:'Lilongwe Central', done:5,  target:10 },
    { officer:'A. Machava',   cluster:'Nampula Zone',     done:8,  target:8  }
  ]
};
