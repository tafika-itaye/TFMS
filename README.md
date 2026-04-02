# TFMS — TechNexus Farmer Management System

**Version 1.0.0** · Executive Prototype  
**Built by** TechNexus MW — Software Division  
**Stack** React 18 + Recharts (CDN) · Static HTML/CSS/JS  
**Target** ASP.NET Core 8 + Blazor Server + PostgreSQL 16

---

## Overview

TFMS is a centralised platform for managing smallholder farmer operations across Malawi and the wider SADC region. The system covers farmer registration, field visit scheduling and GPS tracking, crop monitoring, delivery and grading management, and reporting.

This repository contains the **working executive prototype** — a fully interactive demo with simulated data, designed for stakeholder presentations. No build step is required. The application runs entirely in the browser via GitHub Pages.

## Features

| Module              | Description                                                                 |
|---------------------|-----------------------------------------------------------------------------|
| **Dashboard**       | KPIs, yield charts, crop distribution, weather, alerts, activity feed       |
| **Farmer Registry** | 1,288 farmers, search/filter, slide-out profile with yield history          |
| **Field Visits**    | Visit countdown timer, auto-GPS detection, start/pause/stop, visit details  |
| **Crop Monitoring** | Growth stage tracking by region, pest & disease report with severity levels  |
| **Deliveries**      | Delivery log, auction floor data, grading, revenue tracking                 |
| **Reports**         | Season performance vs target, exportable report templates                   |
| **Settings**        | Organisation config, users & access, system info                            |

## Deployment (GitHub Pages)

1. Push this folder to a GitHub repository
2. Go to **Settings → Pages**
3. Set source to **Deploy from a branch** → `main` → `/ (root)`
4. The site will be live at `https://<username>.github.io/TFMS/`

No build step. No Node.js. No npm. Just static files served by GitHub Pages.

## Project Structure

```
TFMS/
├── index.html              ← Entry point (loads CDN dependencies)
├── assets/
│   ├── css/
│   │   └── tfms.css        ← All styles (Microsoft Fluent inspired)
│   ├── js/
│   │   └── app.jsx         ← React application (compiled by Babel in-browser)
│   └── images/             ← Place sourced images here
└── README.md
```

## Image Placeholders

The prototype uses avatar initials and icon-based visuals. For the full production experience, source royalty-free images using these search terms and place them in `assets/images/`:

| Filename suggestion                  | Search term                                            |
|--------------------------------------|--------------------------------------------------------|
| `hero-tobacco-field.jpg`             | Malawi tobacco farmer field inspection                 |
| `farmer-woman-harvest.jpg`           | African woman farmer harvesting crops                  |
| `curing-barn.jpg`                    | Tobacco leaf curing barn Africa                        |
| `landscape-agriculture.jpg`          | Malawi rural agriculture landscape                     |
| `extension-officer.jpg`              | African agricultural extension officer field visit      |
| `drying-shed.jpg`                    | Burley tobacco drying shed Malawi                      |
| `weighing-harvest.jpg`               | Smallholder farmer weighing crop harvest Africa         |
| `maize-field.jpg`                    | Maize field southeastern Africa                        |
| `cooperative-meeting.jpg`            | African farmer cooperative meeting                     |
| `village-agriculture.jpg`            | Rural Malawi village agriculture                       |
| `groundnut-harvest.jpg`              | Groundnut harvest Africa hands                         |
| `cotton-field.jpg`                   | Cotton picking field Africa workers                    |
| `auction-floor.jpg`                  | Agricultural auction floor tobacco Africa              |
| `farmer-mobile.jpg`                  | African farmer mobile phone technology                 |
| `irrigation.jpg`                     | Irrigation canal rural Africa farmland                 |

**Sources:** Unsplash, Pexels, Pixabay (royalty-free)

## Technology Notes

**This prototype simulates:**
- User authentication (ASP.NET Core Identity)
- Database queries (PostgreSQL / Entity Framework)
- GPS field tracking (Geolocation API — real when available, simulated fallback)
- Visit timer with elapsed time counter (real)
- Report generation endpoints

**Production stack:**
- ASP.NET Core 8 + Blazor Server
- PostgreSQL 16
- Entity Framework Core
- SignalR (real-time updates)
- Azure Maps / Leaflet.js (field mapping)

## Team

| Name                | Role                          |
|---------------------|-------------------------------|
| Tafika Itaye        | Managing Director / Lead Dev  |
| Tiago Dresch        | Senior Developer              |
| Stephen Sembereka   | Business & Systems Analyst    |
| Netty Mkwamba       | Business Manager              |

## Contact

**TechNexus MW**  
Plot 484 Naperi Avenue, Blantyre, Malawi  
+265 889 941 700 · technexus_mw@proton.me

---

© 2026 TechNexus MW. All rights reserved.
