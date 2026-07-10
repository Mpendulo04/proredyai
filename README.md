# ProRedy AI

A modern, responsive AI workplace productivity assistant built as a SaaS-style web application. ProRedy AI helps professionals draft emails, plan tasks, and summarize research using AI — all in a clean, session-only interface with no authentication or data persistence.

## Project Overview

ProRedy AI provides AI-powered workplace tools in one modern dashboard. The application features a responsive desktop and mobile interface, a device preview toggle, sidebar navigation, editable AI outputs, and secure AI processing. No user registration, login, or personal data storage is required, making the application simple, private, and easy to use.

## Features Implemented

- **Dashboard** (`/`) — Welcome overview with feature cards for each tool and quick navigation.
- Device Preview Toggle — Switch instantly between Desktop View and Mobile View to preview the application's responsive design.
- **Smart Email Generator** (`/email`) — Generate professional emails by selecting the recipient, tone, and topic. Output includes subject, greeting, body, and closing, with copy and regenerate options.
- **AI Task Planner** (`/planner`) — Add tasks with deadlines and priorities, then generate a prioritized task list, suggested daily schedule, and productivity tip. Output is editable and copyable.
- **AI Research Assistant** (`/research`) — Paste text or upload documents (PDF, DOCX, TXT, MD) to receive a short summary, key insights, key topics, and practical recommendation. Output is editable and copyable.
- Research Assistant Word Counter — Displays the number of words in the uploaded or pasted content as well as the generated AI summary.
- Enhanced Document Analysis — Supports analysis of uploaded PDF, DOCX, TXT and Markdown files, including clearer extraction of text, tables and document figures where possible
- Improved Mobile Experience — Optimized layout for phones, tablets and desktops.
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
