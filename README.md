# Redan Overlay Development Guide

Welcome to the **Redan Overlay Development Guide** — a collection of structured, step-by-step instructions and examples for creating in-game overlays for **Redan** and other supported platforms.

👉 **Redan on Steam:**
[https://store.steampowered.com/app/3825980/Redan](https://store.steampowered.com/app/3825980/Redan)

This repository is intended to be the canonical source of guides, starter templates, and best practices for building overlays used alongside Redan and future supported frameworks.

---

## 📘 Getting Started

To start building overlays with **Vite + React + TypeScript**, follow the detailed instructions in the VITE guide:

👉 **VITE.md** (Setup Guide for Vite + React + TS)
[https://github.com/Alexander-2049/redan/blob/main/VITE.md](https://github.com/Alexander-2049/redan/blob/main/VITE.md)

This file walks you through the exact command sequence and selections needed to scaffold a Vite-based project.

---

## 📂 Repository Structure

To keep the overlay guides organized and scalable as we add support for more frameworks (e.g., Create React App, Next.js), the following top-level folder structure is recommended:

```
/
├── docs/
│   ├── VITE.md          # Vite + React + TS setup guide
│   ├── CRA.md           # (planned) Create React App setup guide
│   ├── NEXT.md          # (planned) Next.js setup guide
│   └── other-guides/
│       └── ...          # Additional framework or tooling guides
├── examples/
│   ├── vite/
│   │   └── collision-warning/   # Showcase overlay example
│   ├── cra/
│   │   └── ...                  # CRA example overlays
│   └── next/
│       └── ...                  # Next.js example overlays
├── assets/               # Images, icons, UX templates
├── LICENSE
├── README.md             # This file
└── CONTRIBUTING.md       # Contributor guidelines
```

### 📌 What Goes Where

* **docs/** – Framework-specific guides and setup instructions
* **examples/** – Fully working overlay example projects for each supported setup
* **assets/** – Shared images, diagrams, and branding resources

---

## 📞 Feedback & Contributions

Contributions are welcome! If you have questions, suggestions, or want to add a new guide or example, please open a Pull Request or issue.

