# PrepAI

PrepAI is an AI-powered mock interview platform that helps users prepare for technical interviews through realistic interview simulations and AI-generated feedback.

## Features

- User Registration & Login (JWT Authentication)
- Secure Password Encryption (BCrypt)
- AI-powered Interview Evaluation (Google Gemini)
- Multiple Interview Domains
- Interview History
- Dashboard Analytics
- Responsive UI
- Production Deployment

## Tech Stack

### Frontend
- React
- React Router
- Axios
- Vite

### Backend
- Spring Boot
- Spring Security
- Spring Data JPA
- JWT Authentication

### Database
- PostgreSQL

### AI
- Google Gemini API

## Live Demo

Frontend:
https://prepraai.netlify.app

Backend:
https://prepai-backend-cas5.onrender.com

## Installation

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
mvn spring-boot:run
```

## Environment Variables

Backend requires:

```
SPRING_DATASOURCE_URL
SPRING_DATASOURCE_USERNAME
SPRING_DATASOURCE_PASSWORD
JWT_SECRET
GEMINI_API_KEY
```

## Screenshots

(Add screenshots after Day 10.)

## License

MIT License
