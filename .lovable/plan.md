# AI Workplace Productivity Assistant — Redesign Plan

Transform the current single-page tabbed app into a modern SaaS-style dashboard with sidebar navigation, a light blue theme, and new pages. No auth, no storage — everything stays in-session.

## 1. Theme & Design System

Update `src/styles.css`:
- Switch primary palette to **light blue** (sky/azure family) using OKLCH tokens
- Soft neutral background (near-white with a faint blue tint)
- Card surfaces with subtle shadows and rounded corners
- Smooth transitions on interactive elements
- Keep semantic tokens (`--primary`, `--background`, `--card`, `--muted`, `--accent`) — no hardcoded colors in components

## 2. Layout — Sidebar Shell

Replace the current header layout with a shadcn `Sidebar` shell in `src/routes/__root.tsx`:
- `SidebarProvider` wraps the app
- Left sidebar with menu items:
  - 🏠 Dashboard → `/`
  - 📧 Smart Email Generator → `/email`
  - 📅 AI Task Planner → `/planner`
  - 🔍 AI Research Assistant → `/research`
  - ℹ️ About → `/about`
  - ⚠️ Responsible AI → `/responsible-ai`
- Sidebar footer: "AI Workplace Productivity Assistant — Version 1.0"
- Collapsible with `SidebarTrigger` in a top bar (mobile-friendly)
- Active route highlighted via `useRouterState`

## 3. Routes (file-based)

Create separate route files, each with its own `head()` metadata:

```
src/routes/
  __root.tsx           (sidebar shell + Outlet)
  index.tsx            (Dashboard)
  email.tsx            (Smart Email Generator)
  planner.tsx          (AI Task Planner)
  research.tsx         (AI Research Assistant)
  about.tsx            (About)
  responsible-ai.tsx   (Responsible AI)
```

### Dashboard (`/`)
- Welcome heading + intro paragraph
- Three feature cards (Email, Planner, Research) with icon, short description, "Open Tool" button linking to each route

### Smart Email Generator (`/email`)
Same as current Email tab, plus:
- **Regenerate** button (re-runs with same inputs)
- Output rendered as an **editable Textarea** (not read-only `<pre>`)
- **Copy** button

### AI Task Planner (`/planner`) — expanded
Replace the flat "one task per line" textarea with a dynamic task list:
- Row per task: **name**, **deadline** (date input), **priority** (High/Medium/Low select)
- Add / remove task rows
- On generate, backend receives structured tasks + produces: Prioritised list, Suggested daily schedule, Productivity tip
- Editable output + Copy + Regenerate

### AI Research Assistant (`/research`)
Keep existing paste + document upload (PDF/DOCX/TXT/MD via `pdfjs-dist` and `mammoth`).
- Update system prompt to output 4 sections: **Short Summary**, **Key Insights**, **Key Topics**, **Practical Recommendation**
- Editable output + Copy + Regenerate

### About (`/about`)
Static content page with the description text specified in the request.

### Responsible AI (`/responsible-ai`)
Static content page with the Responsible AI guidance + Privacy Notice text.

## 4. Backend — `src/lib/assistant.functions.ts`

- Extend the `Input` schema: for `plan`, accept a structured task array (`{name, deadline, priority}[]`) in addition to timeframe
- Update `plan` system prompt to output: `## Prioritised Tasks`, `## Suggested Daily Schedule`, `## Productivity Tip`
- Update `research` system prompt to output: `## Short Summary`, `## Key Insights`, `## Key Topics`, `## Practical Recommendation`
- Update `email` prompt to explicitly produce Subject line, Greeting, Body, Closing
- Keep single `runAssistant` server function; no persistence

## 5. Shared UI Components

- `OutputBlock` → replace read-only pre with editable `Textarea` (auto-sized) + Copy + Regenerate buttons; accepts an `onRegenerate` callback
- `Disclaimer` unchanged: "AI-generated content — please review before use."
- Feature card component for Dashboard

## 6. Explicitly NOT included

- No login, register, accounts, profiles, passwords, history, notifications, database
- No storage of prompts, outputs, or user data — everything is session-only React state

## Technical Notes

- All AI calls stay server-side through the existing Lovable AI Gateway helper (`google/gemini-3-flash-preview`)
- Client-side PDF/DOCX parsing stays in the research route
- Sidebar uses shadcn `Sidebar` primitives already available under `@/components/ui/sidebar`
- Every route file sets its own head metadata (title + description + og tags)
- Light blue theme applied via `src/styles.css` tokens only — no hardcoded utility colors in components
