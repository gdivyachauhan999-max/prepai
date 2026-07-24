# PrepAI — API Design

**Base path:** `/api`
**Status:** Finalized Day 2 — design only, no implementation until Day 3 (auth) and Day 6 (interview flow).
**Auth header (protected endpoints):** `Authorization: Bearer <JWT>`

---

## 1. Auth Endpoints

### `POST /api/auth/register`
- **Purpose:** Create a new user account.
- **Auth:** None (public).
- **Request body:**
  ```json
  { "name": "Divya Chauhan", "email": "divya@example.com", "password": "SecurePass123" }
  ```
- **Response 201:**
  ```json
  { "message": "Registered successfully" }
  ```
- **Validation:** `name` not blank; `email` valid format; `password` minimum 8 characters.
- **Error cases:**
  - `400 Bad Request` — validation failure (missing/invalid fields)
  - `409 Conflict` — email already registered

### `POST /api/auth/login`
- **Purpose:** Authenticate a user and issue a JWT.
- **Auth:** None (public).
- **Request body:**
  ```json
  { "email": "divya@example.com", "password": "SecurePass123" }
  ```
- **Response 200:**
  ```json
  { "token": "eyJhbGciOi...", "name": "Divya Chauhan", "email": "divya@example.com" }
  ```
- **Validation:** both fields required.
- **Error cases:**
  - `400 Bad Request` — missing fields
  - `401 Unauthorized` — invalid email or password

---

## 2. Interview Endpoints

### `POST /api/interviews/start`
- **Purpose:** Begin a new mock interview session.
- **Auth:** Required.
- **Request body:**
  ```json
  { "domain": "JAVA" }
  ```
  Allowed values: `JAVA`, `DSA`, `WEB_DEVELOPMENT`
- **Response 201:**
  ```json
  {
    "interviewId": 12,
    "question": { "id": 101, "text": "Explain the difference between == and .equals() in Java.", "orderIndex": 1 }
  }
  ```
- **Validation:** `domain` must be one of the three allowed values.
- **Error cases:**
  - `400 Bad Request` — invalid/missing domain
  - `401 Unauthorized` — missing/invalid token
  - `502 Bad Gateway` — AI service failed to generate a question

### `GET /api/interviews/{id}/current-question`
- **Purpose:** Fetch the current unanswered question (e.g., after a page refresh mid-session).
- **Auth:** Required; caller must own the interview.
- **Response 200:**
  ```json
  { "id": 103, "text": "What is a HashMap collision and how is it resolved?", "orderIndex": 3 }
  ```
- **Error cases:**
  - `401 Unauthorized`
  - `403 Forbidden` — interview belongs to a different user
  - `404 Not Found` — interview does not exist
  - `409 Conflict` — interview already completed (no current question)

### `POST /api/interviews/{id}/answer`
- **Purpose:** Submit an answer, receive AI feedback, and get the next question (or session completion).
- **Auth:** Required; caller must own the interview.
- **Request body:**
  ```json
  { "questionId": 103, "answerText": "A HashMap collision occurs when..." }
  ```
- **Response 200 — session still in progress:**
  ```json
  {
    "feedback": {
      "score": 7,
      "strengths": "Correctly identified chaining as a resolution method.",
      "weaknesses": "Did not mention load factor or resizing.",
      "improvementTip": "Mention how load factor triggers HashMap resizing."
    },
    "nextQuestion": { "id": 104, "text": "...", "orderIndex": 4 }
  }
  ```
- **Response 200 — session complete (5th answer):**
  ```json
  {
    "feedback": { "score": 8, "strengths": "...", "weaknesses": "...", "improvementTip": "..." },
    "completed": true,
    "overallScore": 7.4
  }
  ```
- **Validation:** `answerText` not blank; `questionId` must belong to this interview and currently be unanswered.
- **Error cases:**
  - `400 Bad Request` — blank answer, or question already answered
  - `401 Unauthorized`
  - `403 Forbidden` — not the interview owner
  - `404 Not Found` — interview or question not found
  - `502 Bad Gateway` — AI feedback generation failed

### `GET /api/interviews/{id}/summary`
- **Purpose:** Full detail of one interview session (used by the History Detail screen).
- **Auth:** Required; caller must own the interview.
- **Response 200:**
  ```json
  {
    "interviewId": 12,
    "domain": "JAVA",
    "overallScore": 7.4,
    "questions": [
      { "text": "...", "answer": "...", "feedback": { "score": 7, "strengths": "...", "weaknesses": "...", "improvementTip": "..." } }
    ]
  }
  ```
- **Error cases:** `401`, `403`, `404`.

### `GET /api/interviews`
- **Purpose:** List the logged-in user's past interviews (History list + Dashboard source data).
- **Auth:** Required.
- **Query params (optional):** `?domain=JAVA` — filter by domain.
- **Response 200:**
  ```json
  [
    { "interviewId": 12, "domain": "JAVA", "overallScore": 7.4, "completedAt": "2026-07-20T10:15:00Z" },
    { "interviewId": 11, "domain": "DSA", "overallScore": 6.0, "completedAt": "2026-07-19T09:40:00Z" }
  ]
  ```
- **Error cases:** `401 Unauthorized`.

### `GET /api/dashboard/summary`
- **Purpose:** Aggregate stats for the Dashboard screen.
- **Auth:** Required.
- **Response 200:**
  ```json
  {
    "totalInterviews": 6,
    "averageScore": 7.1,
    "byDomain": { "JAVA": 7.5, "DSA": 6.2, "WEB_DEVELOPMENT": 7.8 }
  }
  ```
- **Error cases:** `401 Unauthorized`.

---

## 3. Standard Error Response Shape

All error responses follow the same JSON shape for consistent frontend handling:

```json
{
  "status": 400,
  "error": "Bad Request",
  "message": "Password must be at least 8 characters",
  "timestamp": "2026-07-22T10:00:00Z"
}
```

---

## 4. Endpoint Summary Table

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | /api/auth/register | No | Create account |
| POST | /api/auth/login | No | Log in, get JWT |
| POST | /api/interviews/start | Yes | Start a new interview |
| GET | /api/interviews/{id}/current-question | Yes | Get current question |
| POST | /api/interviews/{id}/answer | Yes | Submit answer, get feedback + next question |
| GET | /api/interviews/{id}/summary | Yes | Full session detail |
| GET | /api/interviews | Yes | List past interviews |
| GET | /api/dashboard/summary | Yes | Aggregate dashboard stats |

No endpoints exist beyond what v1.0 features (PRD Section 6) require.
