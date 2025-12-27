# Project Setup Guide (Vite + React + TypeScript)

This guide describes **the exact sequence of commands** and **choices** required to create a new React project using **Vite**, **TypeScript**, and **React Compiler**.

Follow the steps carefully and select the specified options when prompted.

> ⚠️ This README focuses only on project creation and initial setup. Further steps will be added later.

---

## Prerequisites

Make sure you have the following installed:

* **Node.js** (LTS recommended)
* **npm** (comes with Node.js)

You can verify installation by running:

```bash
node -v
npm -v
```

---

## Step 1 — Create a Vite Project

Run the following command in your terminal:

```bash
npm create vite@latest
```

---

## Step 2 — Enter Project Name

When prompted:

```
Project name:
```

Enter your desired project name.

### Example

```
collision-warning
```

---

## Step 3 — Select Framework

You will see the following prompt:

```
Select a framework:
  Vanilla
  Vue
> React
  Preact
  Lit
  Svelte
  Solid
  Qwik
  Angular
  Marko
  Others
```

➡️ **Select:** `React`

---

## Step 4 — Select Variant

After choosing React, select the following option:

```
Select a variant:
  TypeScript
> TypeScript + React Compiler
  TypeScript + SWC
  JavaScript
  JavaScript + React Compiler
  JavaScript + SWC
  React Router v7
  TanStack Router
  RedwoodSDK
  RSC
  Vike
```

➡️ **Select:** `TypeScript + React Compiler`

---

## Step 5 — Experimental Rolldown Option

Next prompt:

```
Use rolldown-vite (Experimental)?:
  Yes
> No
```

➡️ **Select:** `No`

---

## Step 6 — Install Dependencies and Start

You will be asked:

```
Install with npm and start now?
> Yes / No
```

➡️ **Select:** `Yes`

---

## Step 7 — Project Scaffolding

Vite will now:

* Create the project directory
* Install npm dependencies
* Start the development server

Example output:

```
Scaffolding project in C:\...\collision-warning
Installing dependencies with npm...
```

---

## Step 8 — Stop Development Server

Once the server starts, stop it by pressing:

```
CTRL + C
```

---

## Step 9 — Open Project in Code Editor

Open the created project folder (`collision-warning`) in your preferred code editor.

Examples:

* **VS Code**
* **WebStorm**
* **Cursor**

---

## Current Status

✅ Project created
✅ Dependencies installed
✅ Ready for further configuration

---

> 📌 This is the **base instruction style**. The same structure and tone will be used for a **Create React App** setup guide later.

Further steps will be added in the next iteration.
