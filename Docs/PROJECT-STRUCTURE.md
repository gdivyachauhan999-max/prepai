# PrepAI — Project Structure

**Status:** Finalized Day 2. This is the folder skeleton implementation will fill in starting Day 3.

```
prepai/
├── backend/
│   ├── src/main/java/com/prepai/
│   │   ├── controller/         # REST endpoints only — no business logic here
│   │   ├── service/            # Business logic: AuthService, InterviewService, GeminiService
│   │   ├── repository/         # Spring Data JPA interfaces, one per entity
│   │   ├── model/               # JPA entities: User, Interview, Question, Answer, Feedback
│   │   ├── dto/                  # Request/response objects — keeps entities out of API responses
│   │   ├── security/             # JwtUtil, JwtAuthFilter, SecurityConfig
│   │   ├── exception/            # Custom exceptions + GlobalExceptionHandler
│   │   └── config/                # CORS config, WebClient config for Gemini calls
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
│
├── frontend/
│   └── src/
│       ├── pages/                # One file per screen: Login, Register, Dashboard,
│       │                         # DomainSelect, Interview, History, HistoryDetail
│       ├── components/            # Reusable pieces: NavBar, QuestionCard, FeedbackCard,
│       │                         # ScoreBadge, ProtectedRoute
│       ├── context/                # AuthContext — stores JWT + user info
│       ├── services/                # api.js (shared axios instance), interviewApi.js
│       ├── App.jsx
│       └── main.jsx
│
├── docs/
│   ├── ARCHITECTURE.md
│   ├── SCHEMA.md
│   ├── API.md
│   ├── UI-WIREFRAMES.md
│   ├── PROJECT-STRUCTURE.md      # this file
│   └── PROJECT-LOG.md            # daily progress log, updated each day
│
├── .gitignore
└── README.md
```

## Why This Structure

- **Mirrors Spring Boot convention** (controller → service → repository → model), so any Spring developer — or an AI assistant starting a fresh session on any future day — immediately knows where new code belongs without re-explaining the architecture.
- **DTOs are separate from entities** so the API never accidentally leaks database-internal fields (like password hashes) or breaks on lazy-loading serialization issues.
- **`docs/` centralizes every planning artifact** in the repo itself, so the project's design decisions travel with the code rather than living only in chat history.
- **Frontend groups by role** (`pages` vs `components` vs `services` vs `context`) rather than by feature, which is the simplest mental model for a first React project.

## Where Future Code Lives (Quick Reference)

| Day | What Gets Added | Where |
|---|---|---|
| Day 3 | User entity, register/login logic, JWT | `backend/.../model`, `service`, `security`, `controller` |
| Day 4 | Auth UI, routing, auth context | `frontend/src/pages`, `context`, `components` |
| Day 5 | Interview/Question/Answer/Feedback entities, Gemini integration | `backend/.../model`, `service/GeminiService.java` |
| Day 6 | Interview flow endpoints | `backend/.../controller/InterviewController.java`, `service/InterviewService.java` |
| Day 7 | Interview/Dashboard/History UI | `frontend/src/pages`, `components` |
| Day 8 | Deployment configs | `backend/src/main/resources/application-prod.properties`, `frontend/.env` |
| Day 9 | Validation, polish, testing checklist | Various — see `TESTING_CHECKLIST.md` (created Day 9) |
| Day 10 | README, release tag | `README.md` (root) |
