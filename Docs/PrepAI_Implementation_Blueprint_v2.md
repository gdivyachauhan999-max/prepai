# PrepAI — Implementation Blueprint (Days 3–10) — REVISED

**Revision note (Day 3):** The original Day 1 blueprint allocated Day 2 to "Setup" — but Day 2 was actually used for System Design (architecture, schema, API, wireframes), which was valuable and is now the technical backing for everything below. To keep the project on a 10-day finish line, the remaining days are **compressed** starting today. **No v1.0 feature or scope from the PRD has changed** — only which calendar day each task happens on. This document supersedes the Day 1 blueprint's Day 2–10 sections.

**Project:** PrepAI — AI-Powered Mock Interview Platform
**Stack:** React (Vite) · Java + Spring Boot · PostgreSQL · Google Gemini API (free tier) · JWT auth · Git/GitHub · Render + Netlify/Vercel (free-tier hosting)
**Daily budget:** 3–4 hours
**Source of truth for technical detail:** `docs/ARCHITECTURE.md`, `docs/SCHEMA.md`, `docs/API.md`, `docs/UI-WIREFRAMES.md`, `docs/PROJECT-STRUCTURE.md` (all finalized Day 2, unchanged)

---

## Schedule Change Summary

| Day | Focus | Was Originally (Day 1 Blueprint) |
|---|---|---|
| Day 3 | Setup & Foundation (scaffolding only, no full features) | Day 2 |
| Day 4 | Full Authentication — backend + frontend together | Days 3 + 4 |
| Day 5 | AI Integration + Interview backend endpoints together | Days 5 + 6 |
| Day 6 | Interview frontend — interview flow, dashboard, history | Day 7 |
| Day 7 | Deployment | Day 8 |
| Day 8 | Testing & polish | Day 9 |
| Day 9 | Final verification, documentation, demo prep | Day 10 |
| Day 10 | **New: Buffer day** — catch-up, extra polish, rehearsal | *(did not exist before)* |

---

## Day 3 — Project Setup & Foundation

### 🎯 Objective
Get all tools installed, both backend and frontend projects created and running locally, database connected, repo fully synced with GitHub, and basic scaffolding (routing, layout, empty auth structure) in place — no full features yet.

### 📖 What I'll Learn
- How a Spring Boot project is structured and run.
- How a React (Vite) project is structured and run.
- How to connect Spring Boot to PostgreSQL.
- The basics of React Router for page scaffolding.

### 🛠 Features to Build
- Running Spring Boot backend with a health check endpoint.
- Running React frontend with routing scaffolded (empty pages, no logic yet).
- PostgreSQL database created and connected.
- Empty security/config scaffolding matching `docs/ARCHITECTURE.md`.

### 📝 Step-by-Step Implementation Plan
See full guided walkthrough in today's chat session — covers JDK, Maven wrapper, Node.js, PostgreSQL, Spring Initializr project creation, Vite React project creation, `.gitignore`, health check endpoint, empty page/route scaffolding, and initial commit.

### 📂 Files/Folders Created
Per `docs/PROJECT-STRUCTURE.md`: `backend/` (Spring Boot skeleton + `HealthController`), `frontend/` (Vite React skeleton + empty page components + `App.jsx` routing), `docs/` (Day 2 + Day 3 docs).

### 🔗 Tools/Services
Spring Initializr, PostgreSQL (local), Vite, Git + GitHub.

### 🧪 Testing Tasks
- `/api/health` returns success.
- Frontend loads and empty routes navigate correctly.
- DB connection confirmed with no errors.

### ✅ End-of-Day Checklist
- [ ] Backend and frontend both run locally without errors.
- [ ] PostgreSQL connected.
- [ ] Routing scaffold in place (empty pages navigable).
- [ ] Repo synced to GitHub.

### ➡️ Handoff Notes for Day 4
Foundation is running end-to-end but empty. Day 4 builds real authentication — entity, endpoints, and UI — using `docs/SCHEMA.md` (users table) and `docs/API.md` (Section 1: `/api/auth/register`, `/api/auth/login`).

---

## Day 4 — Full Authentication (Backend + Frontend)

### 🎯 Objective
Build complete, working authentication end-to-end: Spring Boot backend (entity, JWT, endpoints) **and** the React UI that uses it (register/login pages, auth context, protected routes) — all in one day, tested together.

### 📖 What I'll Learn
- JPA entities and repositories; BCrypt password hashing.
- How Spring Security filters requests; how JWTs are issued and validated.
- React Router for multi-page navigation; Context API for global auth state; calling APIs from React with axios.

### 🛠 Features to Build
**Backend:**
- `User` entity + repository (per `docs/SCHEMA.md`).
- `POST /api/auth/register`, `POST /api/auth/login` (per `docs/API.md` Section 1).
- `JwtUtil`, `JwtAuthFilter`, `SecurityConfig` (per `docs/ARCHITECTURE.md` Section 7 — security notes).

**Frontend:**
- `services/api.js` (axios instance + JWT interceptor).
- `context/AuthContext.jsx` (holds user/token, persists to localStorage).
- `pages/Register.jsx`, `pages/Login.jsx`.
- `components/ProtectedRoute.jsx`.
- `pages/Dashboard.jsx` as a placeholder ("Welcome, {name}").

### 📝 Step-by-Step Implementation Plan
1. Create `User` entity exactly matching `docs/SCHEMA.md`'s `users` table.
2. Create `UserRepository` with `findByEmail`.
3. Create DTOs matching `docs/API.md` request/response shapes exactly: `RegisterRequest`, `LoginRequest`, `AuthResponse`.
4. Add `BCryptPasswordEncoder` bean.
5. Build `AuthService`: `register()` (hash + save, reject duplicate emails per API spec's 409 error), `login()` (verify + issue JWT).
6. Build `JwtUtil` (generate/validate/extract), `JwtAuthFilter` (reads `Authorization: Bearer`), `SecurityConfig` (permit `/api/auth/**` and `/api/health`; require auth elsewhere; CORS scoped to `localhost:5173`).
7. Build `AuthController` wiring the two endpoints, matching exact request/response JSON from `docs/API.md`.
8. Add `GlobalExceptionHandler` using the standard error shape from `docs/API.md` Section 3.
9. Test all of the above in Postman before touching the frontend.
10. Build frontend: axios instance with interceptor, AuthContext, Register/Login pages calling the real backend, ProtectedRoute, placeholder Dashboard, routes wired in `App.jsx`.
11. Test end-to-end: register → login → land on Dashboard → refresh stays logged in → logout works → visiting `/dashboard` while logged out redirects to `/login`.

### 📂 Files/Folders Created or Modified
Backend: `model/User.java`, `repository/UserRepository.java`, `dto/RegisterRequest.java`, `dto/LoginRequest.java`, `dto/AuthResponse.java`, `security/JwtUtil.java`, `security/JwtAuthFilter.java`, `security/SecurityConfig.java`, `service/AuthService.java`, `controller/AuthController.java`, `exception/GlobalExceptionHandler.java`.
Frontend: `services/api.js`, `context/AuthContext.jsx`, `pages/Register.jsx`, `pages/Login.jsx`, `pages/Dashboard.jsx`, `components/ProtectedRoute.jsx`, `components/NavBar.jsx`, `App.jsx`.

### 🧪 Testing Tasks
Postman: register, duplicate email rejection, login success/failure, protected endpoint blocked without token. Browser: full register→login→dashboard→refresh→logout flow.

### 🐞 Common Issues & Debugging Tips
- CORS errors: confirm `SecurityConfig` allows `http://localhost:5173` exactly.
- JWT signature mismatch: signing key must be fixed in `application.properties`, not regenerated at restart.
- Token not persisting: confirm AuthContext reads from `localStorage` on init.

### ✅ End-of-Day Checklist
- [ ] Full auth flow works via Postman (backend) and browser (frontend) together.
- [ ] JWT persists across refresh; logout clears it.
- [ ] Protected routes correctly gate access.
- [ ] Code committed and pushed.

### ➡️ Handoff Notes for Day 5
Auth is fully working end-to-end (React ↔ Spring Boot ↔ PostgreSQL). Day 5 builds the Gemini AI integration and the full interview backend flow, using `docs/SCHEMA.md` (Interview/Question/Answer/Feedback tables) and `docs/API.md` (Section 2: all interview endpoints).

---

## Day 5 — AI Integration + Interview Backend

### 🎯 Objective
Build the Gemini AI service and the complete interview flow backend (start, answer, summary, history, dashboard stats) in one connected day, fully tested via Postman.

### 📖 What I'll Learn
- Calling an external REST API from Spring Boot with `WebClient`.
- Prompt design for structured, parseable AI output.
- Designing related JPA entities (one-to-many) and orchestrating them in a service layer.
- Calculating aggregate values (overall score, dashboard stats) from related records.

### 🛠 Features to Build
- `Interview`, `Question`, `Answer`, `Feedback` entities + repositories (per `docs/SCHEMA.md`).
- `GeminiService`: `generateQuestion()`, `generateFeedback()` — strict JSON prompts per `docs/ARCHITECTURE.md` Section 5.
- All interview endpoints from `docs/API.md` Section 2: `start`, `current-question`, `answer`, `summary`, list, and `dashboard/summary`.

### 📝 Step-by-Step Implementation Plan
1. Get Gemini API key (Google AI Studio) — guided step by step; store as environment variable, never committed.
2. Create the four entities and repositories exactly matching `docs/SCHEMA.md` (relationships, constraints, CHECK values).
3. Build `GeminiService` with the two methods described in `docs/ARCHITECTURE.md` Section 5 — strict JSON output requirement, fallback fence-stripping, `AiServiceException` on failure.
4. Build `InterviewService`: `start()`, `submitAnswer()` (save answer → get feedback → save → generate next question or complete session → calculate `overallScore`), `getSummary()`, `getHistoryList()`, `getDashboardSummary()`.
5. Build DTOs and `InterviewController` matching `docs/API.md` Section 2 exactly (request/response shapes, status codes, error cases).
6. Enforce ownership checks on every endpoint (per `docs/ARCHITECTURE.md` Section 4 — request lifecycle).
7. Test the entire flow via Postman: start → answer x5 → completion with overall score → summary → history list → dashboard summary. Test cross-user access is blocked (403/404).

### 📂 Files/Folders Created or Modified
`model/Interview.java`, `Question.java`, `Answer.java`, `Feedback.java`; `repository/` for each; `service/GeminiService.java`, `InterviewService.java`; `dto/` for all interview request/response shapes; `controller/InterviewController.java`; `exception/AiServiceException.java`; `config/WebClientConfig.java`.

### 🧪 Testing Tasks
Full 5-question flow per domain via Postman; malformed/short answers still return gracefully; cross-user access blocked; dashboard stats match manually-verified numbers.

### 🐞 Common Issues & Debugging Tips
- Malformed AI JSON: strengthen prompt instructions, strip code fences before parsing.
- 429 rate limits: add small delay between manual test calls.
- Lazy-loading exceptions: map entities to DTOs inside the service layer, never return raw entities.

### ✅ End-of-Day Checklist
- [ ] All entities match `docs/SCHEMA.md` exactly.
- [ ] Full interview flow works start-to-finish via Postman for all 3 domains.
- [ ] Dashboard and history endpoints return correct aggregate data.
- [ ] Code committed and pushed.

### ➡️ Handoff Notes for Day 6
Entire backend is feature-complete and tested via Postman. Day 6 builds all remaining React screens (Domain Select, Interview, Completion, Dashboard, History) against `docs/UI-WIREFRAMES.md` and `docs/API.md`.

---

## Day 6 — Interview Frontend (Flow, Dashboard, History)

### 🎯 Objective
Build every remaining React screen so a user can complete a full mock interview and view their dashboard/history — completing the entire user-facing product.

### 🛠 Features to Build
Domain Select, Interview screen (question + inline feedback states), Completion screen, real Dashboard, History list, History detail — per `docs/UI-WIREFRAMES.md` sections 3.4–3.9.

### 📝 Step-by-Step Implementation Plan
1. `services/interviewApi.js` wrapping all `/interviews/*` and `/dashboard/*` calls.
2. `pages/DomainSelect.jsx` — three domain options per wireframe 3.4.
3. `pages/Interview.jsx` — question state and feedback state per wireframes 3.5–3.6, with loading indicator during AI calls.
4. `pages/InterviewComplete.jsx` per wireframe 3.7.
5. Rebuild `pages/Dashboard.jsx` (real data) per wireframe 3.3.
6. `pages/History.jsx` and `pages/HistoryDetail.jsx` per wireframes 3.8–3.9.
7. Wire all routes; add NavBar links (Dashboard | History | Logout) per navigation rules in `docs/UI-WIREFRAMES.md` Section 4.
8. Full manual walkthrough + responsive check (desktop and mobile width).

### 📂 Files/Folders Created or Modified
`frontend/src/services/interviewApi.js`; `pages/DomainSelect.jsx`, `Interview.jsx`, `InterviewComplete.jsx`, `History.jsx`, `HistoryDetail.jsx`, `Dashboard.jsx` (rebuilt); `components/QuestionCard.jsx`, `FeedbackCard.jsx`, `ScoreBadge.jsx`.

### ✅ End-of-Day Checklist
- [ ] Full interview completable start-to-finish through the UI.
- [ ] Dashboard and History show accurate real data.
- [ ] Responsive at mobile width.
- [ ] Code committed and pushed.

### ➡️ Handoff Notes for Day 7
**Product is functionally complete end-to-end, locally.** Day 7 is entirely about deployment — no new features.

---

## Day 7 — Deployment

*(Content unchanged from original Day 8 plan — see prior blueprint detail: prepare backend for production, provision cloud PostgreSQL, deploy backend to Render, update frontend API URL, deploy frontend to Netlify/Vercel, update CORS for production domain, full smoke test on live URL.)*

### ➡️ Handoff Notes for Day 8
Product is live. Day 8 is testing, bug fixing, and polish — no new features.

---

## Day 8 — Testing, Bug Fixing & Polish

*(Content unchanged from original Day 9 plan — manual test checklist execution, validation hardening, empty states, loading/error states, visual consistency pass, graceful AI failure handling, re-test on live site.)*

### ➡️ Handoff Notes for Day 9
Product is tested, polished, and stable on the live URL. Day 9 is final verification and documentation.

---

## Day 9 — Final Verification, Documentation & Demo Readiness

*(Content unchanged from original Day 10 plan — final smoke test, README, repo cleanup, secret hygiene check, demo script + dry run, `v1.0` GitHub release tag.)*

### ➡️ Handoff Notes for Day 10
Project is objectively complete. Day 10 is a buffer — use it well.

---

## Day 10 — Buffer Day (New)

### 🎯 Objective
Absorb any overflow from earlier days, add final polish, and rehearse the demo one more time — a safety margin, not a required workload.

### 🛠 What This Day Is For
- If every prior day finished on schedule: use this day to rehearse the demo 2–3 times, refine the pitch deck talking points, and consider one small visual polish pass (e.g., color/spacing consistency).
- If any prior day ran over: this is where that spillover work happens, with zero schedule pressure.
- Optional stretch (only if everything else is solid and time remains): a small UX nicety such as a subtle loading animation — never a new PRD feature.

### ✅ End-of-Day Checklist
- [ ] Live product re-verified one final time.
- [ ] Demo rehearsed at least twice, timed.
- [ ] Pitch deck and README reviewed together for a consistent story.
- [ ] Capstone considered submission-ready.

---

## Quick Reference: Definition of Done (unchanged from PRD Section 9)

- [ ] User can create an account and log in.
- [ ] User can select a domain and start a mock interview.
- [ ] User can answer AI-generated questions in a session.
- [ ] User receives AI feedback (score, strengths, weaknesses, improvement tip) per answer.
- [ ] User can view a performance dashboard.
- [ ] User can view full interview history.
- [ ] Application is deployed and publicly accessible.
- [ ] Application works end-to-end without critical bugs during a full demo walkthrough.
