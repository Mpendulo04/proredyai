# ProRedy AI

A modern, responsive AI workplace productivity assistant built as a SaaS-style web application. ProRedy AI helps professionals draft emails, plan tasks, and summarize research using AI — all in a clean, session-only interface with no authentication or data persistence.

## Project Overview

ProRedy AI provides a curated set of AI-powered workplace tools in a single dashboard. The app uses a light-blue themed design, sidebar navigation, and dedicated pages for each tool. Every AI call runs server-side through a secure gateway, while inputs and outputs remain strictly in-session React state — no user accounts, databases, or stored history.

## Features Implemented

- **Dashboard** (`/`) — Welcome overview with feature cards for each tool and quick navigation.
- **Smart Email Generator** (`/email`) — Generate professional emails by selecting the recipient, tone, and topic. Output includes subject, greeting, body, and closing, with copy and regenerate options.
- **AI Task Planner** (`/planner`) — Add tasks with deadlines and priorities, then generate a prioritized task list, suggested daily schedule, and productivity tip. Output is editable and copyable.
- **AI Research Assistant** (`/research`) — Paste text or upload documents (PDF, DOCX, TXT, MD) to receive a short summary, key insights, key topics, and practical recommendation. Output is editable and copyable.
- **About** (`/about`) — Static page describing the application.
- **Responsible AI** (`/responsible-ai`) — Static page with responsible AI guidance and privacy notice.
- **Shared Output Block** — Editable text area with copy-to-clipboard and regenerate actions, plus an AI-generated content disclaimer.
- **Responsive Sidebar Navigation** — Collapsible sidebar with active-route highlighting, works on mobile and desktop.
- **No Auth / No Storage** — Everything is session-only; no login, profiles, or persistence.

## Technologies and Tools Used

- **Framework:** [TanStack Start](https://tanstack.com/start) with React 19 and file-based routing
- **Build Tool:** Vite 8
- **Styling:** Tailwind CSS 4 with OKLCH-based semantic tokens and light-blue theme
- **UI Components:** shadcn/ui primitives (cards, buttons, inputs, selects, sidebar, textarea)
- **State Management:** React state (session-only)
- **Data Fetching:** TanStack Query
- **AI Integration:** Lovable AI Gateway using `google/gemini-3-flash-preview`
- **Server Functions:** `createServerFn` from `@tanstack/react-start`
- **Document Parsing:** `pdfjs-dist` (PDF), `mammoth` (DOCX), plus native text file reading
- **Validation:** Zod
- **Icons:** Lucide React
- **Language:** TypeScript 5
- **Linting & Formatting:** ESLint + Prettier

## Setup Instructions

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js with a package manager of your choice

### Install Dependencies

```bash
bun install
```

### Run the Development Server

```bash
bun run dev
```

The app will be available at the local Vite dev server URL (typically `http://localhost:8080`).

### Build for Production

```bash
bun run build
```

### Lint and Format

```bash
bun run lint
bun run format
```

---

> **Disclaimer:** AI-generated content — please review before use.
