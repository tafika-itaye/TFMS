# 🌿 TFMS — TechNexus Farmer Management System

**Live Demo Prototype · HTML5 Stack**
Built by [TechNexus](mailto:technexus_mw@proton.me) · Blantyre, Malawi

---

## Overview

TFMS is a modular agronomy and factory management system for tobacco and pan-African cash crop operations across Malawi and Mozambique. This repository contains a fully working HTML5 front-end prototype with real application logic, localStorage persistence, and a Windows-influenced UI styled for agro-processing operations.

---

## Demo Credentials

| Username | Password  | Role                  |
|----------|-----------|-----------------------|
| admin    | tfms2026  | System Administrator  |
| officer  | field123  | Field Officer         |
| factory  | clerk123  | Factory Clerk         |
| finance  | fin2026   | Finance Officer       |

Click any credential row on the login page to auto-fill.

---

## Features

### Modules
| Module | Description |
|--------|-------------|
| **Farmer Registry** | 30 seed farmers · search, filter, paginate, register, edit, suspend/reinstate, detail view |
| **Field Visits** | GAP compliance scoring · officer tracking · filter by cluster/status/date · log new visits |
| **Inputs & Credit** | Fertiliser + seed + pesticide dispatch · auto MK calculation · credit ledger · export |
| **Factory & Weighbridge** | Delivery register · net weight calc · grade distribution · weight ticket creation |
| **Analytics** | Production by district · monthly intake chart · GAP distribution · crop breakdown |

### UI
- Windows application chrome: title bar, menu bar, toolbar, status bar
- Sidebar navigation with live badges
- 10+ interactive modal forms with validation
- Toast notifications (ok / warn / error)
- Paginated tables with live search and filter
- CSV export for farmers, visits, inputs
- Live clock in status bar
- Keyboard shortcut: `Escape` to close modals

### Data
- All records persist in `localStorage` between sessions
- Seed data auto-loads on first run (30 farmers, 14 visits, 15 inputs, 10 factory tickets)
- New records created via forms appear immediately in tables

---

## File Structure

```
tfms/
├── index.html          Login page
├── app.html            Main application
├── css/
│   └── tfms.css        Full stylesheet (agro dark theme)
├── js/
│   ├── data.js         Seed data + constants
│   └── app.js          Application logic
└── README.md
```

---

## Running Locally

No build step required. Open `index.html` in any modern browser.

```bash
# Simple HTTP server (optional, for file:// restrictions)
python3 -m http.server 8080
# Then open http://localhost:8080
```

Or deploy directly to GitHub Pages:
```
Settings → Pages → Deploy from branch → main → / (root)
```

---

## Production Stack (Full Build)

| Layer | Technology |
|-------|------------|
| Backend | ASP.NET Core 8 · Blazor Server |
| Database | PostgreSQL 16 |
| Real-time | SignalR |
| Reports | RDLC |
| Hosting | Windows Server 2022 |
| Auth | ASP.NET Core Identity |

---

## Crop Coverage

Primary cash crops tracked: **Tobacco · Maize · Cotton · Soya · Tea · Coffee · Sugar Cane**

Geographic coverage: **Kasungu · Mchinji · Dowa · Lilongwe (Malawi) · Nampula · Tete (Mozambique)**

---

## Contact

**TechNexus**  
technexus_mw@proton.me  
+265 995 753 326  
Blantyre, Malawi

*Empowering Progress. Elevating Business. Securing the Future.*
