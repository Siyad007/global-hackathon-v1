# Memory Keeper AI

A full-stack AI-powered storytelling product with a Spring Boot backend and a React (Vite) frontend. It helps users record memories (voice/text), enhance them with AI, and preserve/share them with analytics.

---

## Monorepo layout

```
memory-keeper-ai/
  backend/         # Spring Boot (Java) API server
  frontend/        # React + Vite app
```

---

## Backend (Spring Boot)

- **Framework**: Spring Boot
- **Key modules**: Security (JWT), JPA, Flyway, OpenAPI (springdoc), Cloudinary upload, custom AI integrations
- **Swagger**: `http://localhost:8080/swagger-ui.html` (docs at `/api-docs`)
- **Base API URL**: `http://localhost:8080/api`

### Setup

1. Create a `.env` or environment variables for required secrets (examples):
   - `JWT_SECRET` (if applicable in your security config)
   - Cloudinary credentials (used by `CloudinaryService`)
   - External AI provider API keys (Groq, HuggingFace, Replicate, Stability AI, ElevenLabs, AssemblyAI)
2. Ensure PostgreSQL and Flyway migration connectivity if used (see `application.yml`).
3. Run the app:
   - With Maven: `cd backend && mvn spring-boot:run`
   - Or your IDE’s Spring Boot run configuration
4. Visit Swagger UI: `http://localhost:8080/swagger-ui.html`

### Configuration

- `backend/src/main/resources/application.yml`
  - Server: port 8080
  - CORS: `cors.allowed-origins` set to `http://localhost:5173, https://memory-keeper-ai.vercel.app`
  - OpenAPI: `/api-docs`, `/swagger-ui.html`
  - File uploads: multipart max 50MB
  - AI service base URLs and models
  - JWT expiration config

### Security

- `SecurityConfig` enables stateless JWT auth and permits:
  - `/api/auth/**` (public)
  - `/api-docs/**`, `/swagger-ui/**`, `/swagger-ui.html` (public)
  - All other endpoints require authentication

### Project structure (selected)

```
backend/src/main/java/com/example/memory_keeper/
  config/            # OpenAPI, Security
  controller/        # REST controllers (public API)
  dto/               # request/response payloads
  model/             # entities and enums
  repository/        # JPA repositories
  security/          # JWT filter + user details
  service/           # business services (AI, Story, Cloudinary, etc.)
resources/
  application.yml    # central config
```

### API inventory

Base path: `/api`

- `AuthController` (`/auth`)
  - POST `/signup` – register user
  - POST `/login` – login and receive JWT

- `UserController` (`/users`) [auth required]
  - GET `/{id}` – get user by ID
  - GET `/email/{email}` – get user by email
  - PUT `/{id}` – update user
  - DELETE `/{id}` – delete user

- `StoryController` (`/stories`) [auth required]
  - POST `` – create story
  - GET `/user/{userId}` – list stories by user (pagination)
  - GET `/{id}` – get story by ID
  - PATCH `/{id}/react` – add reaction (query: `userId`, `reactionType`)
  - POST `/{id}/comment` – add comment (query: `userId`, `content`)
  - GET `/search` – search (query: `query`, pagination)
  - GET `/category/{category}` – list by category (pagination)
  - DELETE `/{id}` – delete story

- `UploadController` (`/upload`) [auth required]
  - POST `/audio` (multipart) – upload audio
  - POST `/image` (multipart) – upload image

- `AIController` (`/ai`) [auth required]
  - POST `/enhance` – enhance transcript into enriched story
  - POST `/chat` – chatbot using user’s stories and persona
  - GET `/prompt` – daily prompt (query: `category`)
  - POST `/image` – async generate image for story (202 Accepted)

- `AnalyticsController` (`/analytics`) [auth required]
  - GET `/user/{userId}` – user analytics snapshot

- `EnumController` (`/enums`) [auth required]
  - GET `/emotions` – list emotion types (metadata)
  - GET `/reactions` – list reaction types (metadata)
  - GET `/reactions/primary` – primary reactions
  - GET `/categories` – story categories
  - GET `/roles` – user roles

Notes:
- Controllers are annotated with `@Tag` and `@Operation`, so everything is visible in Swagger.
- CORS is open to configured origins; preflight permitted in security config.

---

## Frontend (React + Vite)

- **Framework**: React 18, Vite
- **State**: Redux Toolkit
- **Routing**: React Router v6
- **Charts**: chart.js + react-chartjs-2
- **Animations**: framer-motion
- **Toasts**: react-toastify
- **Base API URL**: `VITE_API_URL` env (defaults to `http://localhost:8080/api`)

### Setup

1. `cd frontend && npm install`
2. Create `.env` and set:
   - `VITE_API_URL=http://localhost:8080/api`
3. `npm run dev` → app runs at `http://localhost:5173`

### Project structure (selected)

```
frontend/src/
  api/                 # axios instance + api modules (auth, story, ai, upload)
  components/          # UI components (layout, common, story)
  pages/               # route pages (Landing, Login, Signup, Dashboard, Record, StoryView, Analytics, Profile)
  redux/               # store + slices (auth, story)
  hooks/               # custom hooks (audio, speech)
  App.jsx              # routes
  main.jsx             # entry
```

### Routes

- Public: `/`, `/login`, `/signup`
- Private (wrapped in `PrivateRoute`): `/dashboard`, `/record`, `/story/:id`, `/analytics`, `/profile`

### API integrations used in the UI

- `auth.api` → `/auth/login`, `/auth/signup`
- `story.api`
  - `POST /stories` – used when saving from `Record` page
  - `GET /stories/user/{userId}` – used in `Dashboard`
  - `GET /stories/{id}` – used in `StoryView`
  - `PATCH /stories/{id}/react`, `POST /stories/{id}/comment` – available; integrate in `StoryView` if needed
  - `GET /stories/search` – available; create a search UI if needed
  - `DELETE /stories/{id}` – available; add UI action if needed
- `ai.api`
  - `POST /ai/enhance` – used in `Record` page to enhance transcript
  - `GET /ai/prompt` – available; `Record` uses local prompts currently
  - `POST /ai/chat` – available; no current UI binding
- `upload.api`
  - `POST /upload/audio` – used in `Record` when audio is recorded
  - `POST /upload/image` – available; not wired in current UI flow

### What’s integrated vs pending

- Integrated now
  - Auth: signup/login flow
  - Recording/Typing a story, AI enhancement, and save (`Record.jsx` + `ai.api` + `storySlice`)
  - Dashboard listing user stories (`fetchUserStories`)
  - Story details page (`StoryView`) – reads a story by ID
  - Analytics page rendering local analytics from loaded stories
  - Audio upload to backend when present

- Pending/available but not yet wired or only partially used
  - AI daily prompt endpoint (`GET /ai/prompt`) – UI uses a local prompt list
  - AI chat (`POST /ai/chat`) – no current chat UI
  - Image generation (`POST /ai/image`) – backend returns 202; UI shows `imageUrl` if present, but generation trigger/regeneration flow is TODO
  - Story reactions/comments – endpoints exist; add UI actions on `StoryView`
  - Story search and category filters – endpoints exist; add search/filter UI
  - Enums endpoints – can power dropdowns for categories/emotions/reactions
  - User CRUD endpoints beyond self-profile update – UI minimal

### Frontend implementation status (detailed)

- Pages and current wiring
  - `Landing` (public): informational landing; no API calls
  - `Login`/`Signup` (public): uses `POST /api/auth/login`, `POST /api/auth/signup`
  - `Dashboard` (private): uses `GET /api/stories/user/{userId}` to list stories
  - `Record` (private):
    - Voice flow: uploads audio via `POST /api/upload/audio`
    - Enhancement: `POST /api/ai/enhance`
    - Persist: `POST /api/stories`
    - Image generation: `POST /api/ai/image` available (not wired yet)
  - `StoryView` (private): reads story via `GET /api/stories/{id}`
    - Pending: reactions (`PATCH /api/stories/{id}/react`) and comments (`POST /api/stories/{id}/comment`), delete (`DELETE /api/stories/{id}`)
  - `Analytics` (private): charts derived from client-side story data
    - Pending: backend analytics `GET /api/analytics/user/{userId}` integration
  - `Profile` (private): basic shell
    - Pending: integrate `GET/PUT /api/users/{id}` and avatar upload via `POST /api/upload/image`

- Feature coverage vs backend APIs
  - Auth: 2/2 used (signup, login)
  - Stories: 3/7 used (create, list by user, get by id); pending react, comment, search, delete, by-category
  - Upload: 1/2 used (audio); pending image
  - AI: 1/4 used (enhance); pending chat, prompt, image trigger
  - Analytics: 0/1 used; pending
  - Enums: 0/5 used; pending (can power UI dropdowns)
  - Families: 0/3 used; no UI yet

- Immediate UI TODOs to reach parity
  - Wire reactions/comments on `StoryView` using `story.api`
  - Add search and category filters using `story.api.searchStories` and `GET /api/stories/category/{category}`
  - Replace local prompt list with `GET /api/ai/prompt`
  - Add AI chat page/component for `POST /api/ai/chat`
  - Add image generation trigger/regenerate using `POST /api/ai/image` and display progress/result
  - Use `enums` endpoints to populate categories/emotions/reactions in UI
  - Integrate user profile read/update and optional avatar upload

---

## Run the full stack locally

- Backend: `cd backend && mvn spring-boot:run` → `http://localhost:8080`
- Frontend: `cd frontend && npm run dev` → `http://localhost:5173`
- Ensure `VITE_API_URL` matches backend base URL (`http://localhost:8080/api`)
- Swagger: `http://localhost:8080/swagger-ui.html`

---

## Environments and CORS

- CORS allowed origins are configured in backend `application.yml`. Adjust `cors.allowed-origins` for your deploy origins.
- In frontend, set `VITE_API_URL` for each environment.

---

## Notes for contributors

- Keep controller `@Operation` summaries accurate; they feed Swagger.
- When adding new endpoints, update frontend `api/*.api.js` modules.
- Prefer typed DTOs in backend request/response for stability.
- Respect JWT auth: secure endpoints and handle token on frontend axios instance (attach JWT via interceptor if implemented).
