
# 🎬 Casting Dashboard Demo — Developer Implementation Plan (Updated)

This document outlines the step-by-step tasks for building a **frontend-only demo** of a casting dashboard tool for **Casting Directors**. It uses **React + TypeScript + Tailwind + Zustand + shadcn/ui**, and stores data in `localStorage`.

---

## 🧱 Tech Stack & Architecture

- **Frontend Only** — No backend, simulate all data interactions
- **Framework:** React + TypeScript + Vite
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Routing:** React Router v6+
- **State:** Zustand with `localStorage` persistence

---

## 🛠️ PHASE 1: Project Setup

### 1. Initialize Project
- [ ] Vite + React + TypeScript scaffold
- [ ] Install:
  - `tailwindcss`, `postcss`, `autoprefixer`
  - `react-router-dom`, `clsx`
  - `zustand`, `zustand/middleware`
  - `shadcn/ui`
- [ ] Set up Tailwind + shadcn
- [ ] Scaffold structure:
  ```
  src/
    ├── components/
    ├── pages/
    ├── store/
    ├── types/
    ├── utils/
    └── mockData/
  ```

---

## 🧱 PHASE 2: Global Layout

### 2. App Shell
- Navbar:
  - Left: App name/logo
  - Right: Profile icon (Settings / Sign Out dropdown)
- Sidebar nav:
  ```
  Dashboard
  Projects
  Actor Database
  Settings (optional)
  ```
- Main content rendered via `<Outlet />`
+----------------------------------------------------------+
|  App Name                              [Profile Icon ⬇]  |
|----------------------------------------------------------|
| Dashboard     |                                          |
| Projects      |                                          |
| Actor Database|              Main Content Area           |
| Settings (opt)|         (Rendered via <Outlet />)        |
|               |                                          |
+---------------+------------------------------------------+


---

## 📊 PHASE 3: Dashboard Page

### 3. Dashboard Widgets (These can be purely placeholders to start)
Route: `/`
- Actor count
- Roles open
- Project count
- Recently added actors

---

## 🎬 PHASE 4: Projects Page

### 4. Arbitrary Folder Hierarchy (Google Drive style)
Route: `/projects`

Users can create folders inside folders as deeply as they want. Roles live inside any folder.

Examples:
```
Equalizer
└── Season 2
    └── Episode 5
        └── Roles...

Hamilton
    ├── NY Version
    │   └── Roles...
    └── London Version
        └── Roles...

A Quiet Place
    └── Roles...
```

### 5. Add Folder / Add Role
- Create folder at any level
- Attach roles to any folder (leaf nodes)
- Store hierarchy with `parentId` system
- Zustand + localStorage persisted

---

## 👤 PHASE 5: Actor Database

### 6. Actor Grid/List View
Route: `/actors`
- Grid or table view toggle
- Filter sidebar:
  - Gender, age range, height, race, tags
- Snapshot modal on actor click

### 7. Add New Actor
- Modal or page form
- Fields:
  - Name, age, gender, race, height
  - Representation, tags, notes
  - Headshot (mock), Resume URL
- Save to Zustand/localStorage

---

## 📄 PHASE 6: Role Details + Actor Assignment

### 8. Role Detail Page
Route: `/projects/:projectId/roles/:roleId`

- Show role + folder metadata
- Grid or table view of assigned actors

### 9. Customizable Actor Buckets
Casting directors can define their own status buckets (therefore these should be customizable):
- Booked
- Callback
- Seen
- “Need to ask team about”
- “Callback 2”
- etc. 

Users can:
- Create new buckets (custom names)
- Persist per-role list config in Zustand/localStorage

### 10. Snapshot Modal
- Shows headshot, tags, notes
- Inline tag/note editing
- Move actor between buckets
- Link to actor profile

---

## 🧑‍🎤 PHASE 7: Actor Profile Page

Route: `/actors/:actorId`

- Actor details (resume, tags, notes)
- Known credits (static mock)
- Role history (linked roles, status)

---

## 🧠 PHASE 8: Zustand Store & Persistence

### 11. Store Schema Overview

```ts
folders[]        // nested folder/project structure
roles[]          // associated with folders
actors[]         // master actor list
customLists[]    // per-role actor bucket config
tags[]
notes[]
```

- Zustand with `persist` middlewareh
- Hydration from and sync to localStorage

---

## 🧪 PHASE 9: QA & POLISH

### 12. UI Polishing
- Responsive styling
- Toasts on add/edit
- Modal accessibility
- Smooth interactions via shadcn

---

## ✅ FINAL DEMO CHECKLIST

- [ ] Sidebar navigation functional
- [ ] Arbitrary folder hierarchy supported
- [ ] Can add folders and roles
- [ ] Can add/view/filter actors
- [ ] Can assign actors to roles
- [ ] Customizable actor buckets
- [ ] Full actor profile w/ role history
- [ ] State is persisted via localStorage
