<div align="center">

# 🎙️ Memory Keeper AI

### Transform Voice Memories into AI-Enhanced Stories with Illustrations

*Preserving family histories through the power of artificial intelligence*

[![Live Demo](https://img.shields.io/badge/demo-live-success?style=for-the-badge)](YOUR_DEMO_LINK)
[![API Docs](https://img.shields.io/badge/API-Swagger-85EA2D?style=for-the-badge&logo=swagger)](YOUR_SWAGGER_LINK)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=for-the-badge&logo=linkedin)](YOUR_LINKEDIN)

[Features](#-features) • [Demo](#-demo) • [Tech Stack](#-tech-stack) • [Architecture](#-architecture) • [Quick Start](#-quick-start) • [API](#-api-documentation)

</div>

---

## 📖 The Problem

Every year, **millions of family memories are lost forever** when elderly loved ones pass away. Traditional memory preservation methods are:

- ⏰ **Time-consuming** - Hours of interviews and manual transcription
- 💰 **Expensive** - Professional services cost $2,000-$5,000
- 📉 **Inaccessible** - Most families never document their history
- 😔 **Lost opportunity** - 65% of Americans regret not recording more stories

## 💡 The Solution

**Memory Keeper AI** makes memory preservation **instant, affordable, and beautiful**.

Simply **record a voice memory** → AI transforms it into a **beautifully written story** → Generates **contextual illustrations** → Creates a **shareable digital keepsake**.

**From voice to visual story in under 2 minutes.**

---

## ✨ Features

### 🎤 **Voice-First Recording**
- Browser-based audio recording (no app required)
- Audio file upload support (MP3, WAV, M4A)
- 50MB file size limit for extended recordings

### 🤖 **Multi-AI Enhancement Pipeline**
- **Speech-to-Text** - Accurate transcription with speaker diarization
- **Story Enhancement** - Transform raw speech into narrative prose
- **AI Illustration** - Generate contextual images matching story themes
- **Emotion Detection** - Automatically tag emotional tone

### 📊 **Analytics Dashboard**
- User engagement metrics (views, reactions, shares)
- Story performance visualization with Chart.js
- Emotion distribution tracking
- Category breakdown analysis

### 🌐 **Social & Sharing**
- **Reactions** - Like, love, inspire (6 emotion types)
- **Comments** - Family discussions on memories
- **Search** - Full-text search across all stories
- **Categories** - Organize by life events (childhood, career, family, travel)

### 🔒 **Security & Privacy**
- JWT-based authentication with role-based access control
- Secure password hashing (BCrypt)
- Private/public story visibility settings
- CORS protection with whitelisted origins

### 🏗️ **Production-Ready Infrastructure**
- RESTful API with 20+ documented endpoints
- Swagger/OpenAPI interactive documentation
- PostgreSQL database with Flyway version control
- Cloudinary CDN for optimized media delivery
- Async processing for resource-intensive AI tasks

---

## 🎥 Demo

<div align="center">

### 📹 Video Walkthrough
[![Memory Keeper Demo](https://img.youtube.com/vi/YOUR_VIDEO_ID/maxresdefault.jpg)](YOUR_YOUTUBE_LINK)

### 📸 Screenshots

<table>
  <tr>
    <td><img src="screenshots/landing.png" alt="Landing Page" width="400"/><br/><b>Landing Page</b></td>
    <td><img src="screenshots/record.png" alt="Recording Interface" width="400"/><br/><b>Voice Recording</b></td>
  </tr>
  <tr>
    <td><img src="screenshots/story.png" alt="Story View" width="400"/><br/><b>Enhanced Story + AI Image</b></td>
    <td><img src="screenshots/analytics.png" alt="Analytics" width="400"/><br/><b>Analytics Dashboard</b></td>
  </tr>
</table>

</div>

---

## 🛠️ Tech Stack

### Backend (Spring Boot Monorepo)

```yaml
Framework:        Spring Boot 3.x (Java 17+)
Database:         PostgreSQL 15
Migration:        Flyway
Authentication:   JWT (JSON Web Tokens)
API Docs:         Swagger/OpenAPI (springdoc-openapi)
File Storage:     Cloudinary
Build Tool:       Maven
AI Services Integration (6 Providers)
Service	Purpose	Why Chosen
AssemblyAI	Speech-to-text transcription	95%+ accuracy, speaker diarization
Groq	Fast LLM inference	10x faster than GPT-4 for story enhancement
HuggingFace	Emotion classification	Open-source models, cost-effective
Replicate	Alternative AI models	Fallback/experimentation
Stability AI	Image generation	High-quality, contextual illustrations
ElevenLabs	Text-to-speech (future)	Natural voice synthesis
Frontend (React SPA)
YAML

Framework:           React 18 + Vite
State Management:    Redux Toolkit
Routing:             React Router v6
UI Components:       Custom + Tailwind CSS (if used)
Charts:              Chart.js + react-chartjs-2
Animations:          Framer Motion
HTTP Client:         Axios
Notifications:       React Toastify
Custom Hooks:        useAudioRecorder, useSpeechRecognition
DevOps & Infrastructure
YAML

Hosting:          Vercel (Frontend), Railway/Render (Backend)
Database:         Neon/Supabase PostgreSQL
CDN:              Cloudinary
Monitoring:       (Add if you have - Sentry, etc.)
CI/CD:            GitHub Actions (if applicable)
🏗️ Architecture
System Design
text

┌─────────────────┐
│   React App     │
│   (Port 5173)   │
└────────┬────────┘
         │ HTTPS/REST
         ▼
┌─────────────────────────────────────────┐
│     Spring Boot API (Port 8080)         │
│  ┌─────────────────────────────────┐   │
│  │  Controllers (REST Endpoints)   │   │
│  └──────────────┬──────────────────┘   │
│  ┌──────────────▼──────────────────┐   │
│  │   Services (Business Logic)     │   │
│  │  - StoryService                 │   │
│  │  - AIService (Orchestration)    │   │
│  │  - UploadService                │   │
│  │  - AnalyticsService             │   │
│  └──────────────┬──────────────────┘   │
│  ┌──────────────▼──────────────────┐   │
│  │  External AI APIs (6 services)  │   │
│  │  ┌────────┐ ┌────────┐ ┌──────┐│   │
│  │  │Assembly│ │  Groq  │ │Stabil││   │
│  │  │   AI   │ │   AI   │ │ ity  ││   │
│  │  └────────┘ └────────┘ └──────┘│   │
│  └─────────────────────────────────┘   │
│  ┌──────────────┬──────────────────┐   │
│  │   PostgreSQL Database           │   │
│  │  + Flyway Migrations            │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
         │
         ▼
┌─────────────────┐
│   Cloudinary    │
│  (Media CDN)    │
└─────────────────┘
AI Processing Pipeline
text

User Records Audio
      │
      ▼
Upload to Cloudinary ──────────────────┐
      │                                │
      ▼                                │
AssemblyAI Transcription               │
      │                                │
      ▼                                │
Groq Story Enhancement                 │
      │                                │
      ▼                                │
HuggingFace Emotion Detection          │
      │                                │
      ▼                                │
Stability AI Image Generation (Async)  │
      │                                │
      ▼                                │
Save to PostgreSQL ◄───────────────────┘
      │
      ▼
Return Enhanced Story to User
Database Schema (Key Entities)
SQL

Users
├── id (UUID)
├── email (unique)
├── password_hash
├── full_name
├── avatar_url
└── created_at

Stories
├── id (UUID)
├── user_id (FK)
├── title
├── original_transcript (raw speech-to-text)
├── enhanced_content (AI-enhanced narrative)
├── audio_url (Cloudinary)
├── image_url (AI-generated)
├── emotion (enum)
├── category (enum)
├── is_public (boolean)
└── created_at

Reactions
├── id (UUID)
├── story_id (FK)
├── user_id (FK)
├── reaction_type (enum: LIKE, LOVE, INSPIRE, etc.)
└── created_at

Comments
├── id (UUID)
├── story_id (FK)
├── user_id (FK)
├── content (text)
└── created_at
📂 Project Structure
text

memory-keeper-ai/
│
├── backend/                          # Spring Boot API
│   ├── src/main/java/com/example/memory_keeper/
│   │   ├── config/                   # Security, CORS, OpenAPI config
│   │   │   ├── SecurityConfig.java
│   │   │   └── OpenAPIConfig.java
│   │   ├── controller/               # REST Controllers
│   │   │   ├── AuthController.java
│   │   │   ├── StoryController.java
│   │   │   ├── AIController.java
│   │   │   ├── UploadController.java
│   │   │   └── AnalyticsController.java
│   │   ├── dto/                      # Request/Response DTOs
│   │   ├── model/                    # JPA Entities
│   │   │   ├── User.java
│   │   │   ├── Story.java
│   │   │   ├── Reaction.java
│   │   │   └── Comment.java
│   │   ├── repository/               # Spring Data JPA
│   │   ├── service/                  # Business Logic
│   │   │   ├── StoryService.java
│   │   │   ├── AIService.java
│   │   │   ├── CloudinaryService.java
│   │   │   └── AnalyticsService.java
│   │   └── security/                 # JWT Filter, UserDetails
│   ├── src/main/resources/
│   │   ├── application.yml           # Central config
│   │   └── db/migration/             # Flyway SQL scripts
│   └── pom.xml
│
└── frontend/                         # React SPA
    ├── src/
    │   ├── api/                      # Axios API modules
    │   │   ├── auth.api.js
    │   │   ├── story.api.js
    │   │   ├── ai.api.js
    │   │   └── upload.api.js
    │   ├── components/               # Reusable UI components
    │   │   ├── layout/
    │   │   ├── common/
    │   │   └── story/
    │   ├── pages/                    # Route pages
    │   │   ├── Landing.jsx
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Record.jsx            # Voice recording + AI enhancement
    │   │   ├── StoryView.jsx
    │   │   ├── Analytics.jsx
    │   │   └── Profile.jsx
    │   ├── redux/                    # Redux Toolkit
    │   │   ├── store.js
    │   │   ├── authSlice.js
    │   │   └── storySlice.js
    │   ├── hooks/                    # Custom React hooks
    │   │   ├── useAudioRecorder.js
    │   │   └── useSpeechRecognition.js
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    └── vite.config.js
🚀 Quick Start
Prerequisites
Bash

- Java 17+
- Node.js 18+
- PostgreSQL 15+
- Maven 3.8+
1️⃣ Clone Repository
Bash

git clone https://github.com/YOUR_USERNAME/memory-keeper-ai.git
cd memory-keeper-ai
2️⃣ Backend Setup
Bash

cd backend

# Create .env file (or set environment variables)
cat > .env << EOF
# Database
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/memory_keeper
SPRING_DATASOURCE_USERNAME=your_db_user
SPRING_DATASOURCE_PASSWORD=your_db_password

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-256-bits
JWT_EXPIRATION=86400000

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# AI Services
ASSEMBLYAI_API_KEY=your_assemblyai_key
GROQ_API_KEY=your_groq_key
HUGGINGFACE_API_KEY=your_hf_key
REPLICATE_API_KEY=your_replicate_key
STABILITY_API_KEY=your_stability_key
ELEVENLABS_API_KEY=your_elevenlabs_key
EOF

# Run database migrations (Flyway auto-runs on startup)
mvn clean install

# Start backend server
mvn spring-boot:run
Backend runs at http://localhost:8080
Swagger UI at http://localhost:8080/swagger-ui.html

3️⃣ Frontend Setup
Bash

cd ../frontend

# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:8080/api" > .env

# Start development server
npm run dev
Frontend runs at http://localhost:5173

4️⃣ Test the Flow
Open http://localhost:5173
Sign up for an account
Navigate to /record
Record a voice memory or upload audio
Click "Enhance with AI"
Save story and view on Dashboard
Check Analytics page for metrics
📡 API Documentation
Interactive Swagger Docs
Once backend is running: http://localhost:8080/swagger-ui.html

Key Endpoints Overview
Authentication
http

POST   /api/auth/signup          # Register new user
POST   /api/auth/login           # Login (returns JWT)
Stories
http

POST   /api/stories              # Create new story
GET    /api/stories/user/{id}    # List user's stories (paginated)
GET    /api/stories/{id}          # Get story by ID
PATCH  /api/stories/{id}/react   # Add reaction
POST   /api/stories/{id}/comment # Add comment
GET    /api/stories/search       # Full-text search
DELETE /api/stories/{id}          # Delete story
AI Processing
http

POST   /api/ai/enhance           # Enhance transcript into story
POST   /api/ai/image             # Generate AI image (async, returns 202)
POST   /api/ai/chat              # Chat with AI about your stories
GET    /api/ai/prompt            # Get daily memory prompt
Uploads
http

POST   /api/upload/audio         # Upload audio file (multipart)
POST   /api/upload/image         # Upload image file (multipart)
Analytics
http

GET    /api/analytics/user/{id}  # User analytics summary
Metadata (Enums)
http

GET    /api/enums/emotions       # List emotion types
GET    /api/enums/reactions      # List reaction types
GET    /api/enums/categories     # List story categories
Example Request/Response
Create Enhanced Story:

Bash

curl -X POST http://localhost:8080/api/ai/enhance \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "transcript": "I remember when I was seven years old, we moved to the farm...",
    "emotion": "NOSTALGIC",
    "category": "CHILDHOOD"
  }'
Response:

JSON

{
  "enhancedContent": "The Memory of the Farm\n\nI was only seven years old when our family embarked on a new chapter of our lives, leaving behind the familiar streets of the city for the wide-open spaces of a countryside farm. The journey felt like an adventure...",
  "suggestedTitle": "Moving to the Farm",
  "detectedEmotion": "NOSTALGIC",
  "keywords": ["childhood", "farm", "family", "adventure"]
}
🧪 Testing (If Implemented)
Bash

# Backend tests
cd backend
mvn test

# Frontend tests
cd frontend
npm run test
🌍 Deployment
Frontend (Vercel)
Bash

cd frontend
npm run build

# Deploy to Vercel
vercel --prod

# Set environment variable in Vercel dashboard:
# VITE_API_URL=https://your-backend-url.com/api
Backend (Railway/Render)
Option A: Railway

Connect GitHub repository
Select backend folder as root
Add environment variables in Railway dashboard
Deploy automatically on push
Option B: Render

Create new Web Service
Connect GitHub repo
Build command: cd backend && mvn clean install
Start command: java -jar target/memory-keeper-0.0.1-SNAPSHOT.jar
Add environment variables
Database (Neon/Supabase)
Create PostgreSQL database
Copy connection string
Update SPRING_DATASOURCE_URL in environment variables
Flyway migrations run automatically on startup
Environment Variables Checklist
Backend:

✅ Database credentials (URL, username, password)
✅ JWT_SECRET (min 256 bits)
✅ All 6 AI API keys
✅ Cloudinary credentials
✅ CORS allowed origins (add production frontend URL)
Frontend:

✅ VITE_API_URL (production backend URL)
📈 Roadmap
Phase 1: Core Features ✅ (Completed)
 Voice recording and upload
 AI transcription
 Story enhancement with AI
 AI image generation
 User authentication
 Analytics dashboard
 Social features (reactions, comments)
Phase 2: Enhancements 🚧 (In Progress)
 Mobile apps (iOS/Android with React Native)
 Multi-language support (transcription + enhancement)
 Voice synthesis (AI reads stories aloud)
 Family tree integration
 PDF export of stories
 Email sharing
Phase 3: Business Features 🔮 (Planned)
 B2B dashboard for senior living facilities
 Subscription plans (Stripe integration)
 Collaborative family albums
 Professional genealogist marketplace
 Video memory support
 Automatic backup to Google Drive/Dropbox
💼 Business Opportunity
Market Size
$50B+ eldercare technology market (2024)
10,000+ senior living facilities in the US alone
73 million Baby Boomers aging into senior demographic
$2-5K average cost of professional biography services
Monetization Strategies
B2C SaaS - $9.99/month for unlimited stories
B2B Licensing - $499/month per senior living facility
Professional Services - Premium editing/curation tier
White-label - License platform to genealogy companies
Competitive Advantages
✅ AI-first approach vs manual transcription competitors
✅ Instant results vs weeks-long professional services
✅ Affordable ($10/mo vs $2,000+ traditional)
✅ Scalable - Fully automated pipeline
✅ Modern UX - Designed for mobile-first generation
🤝 Contributing
This is currently a portfolio/personal project, but contributions are welcome!

How to Contribute
Fork the repository
Create feature branch (git checkout -b feature/AmazingFeature)
Commit changes (git commit -m 'Add AmazingFeature')
Push to branch (git push origin feature/AmazingFeature)
Open Pull Request
Development Guidelines
Follow existing code structure
Write descriptive commit messages
Add comments for complex logic
Update documentation for new features
🐛 Known Issues / Limitations
Image generation can take 30-60 seconds (async processing implemented)
AssemblyAI has 5-hour max audio length
Cloudinary free tier limits file storage (upgrade for production)
No real-time collaborative editing yet
Mobile responsiveness could be improved (in progress)
🙏 Acknowledgments
AI Services:

AssemblyAI - Speech-to-text transcription
Groq - Ultra-fast LLM inference
Stability AI - Image generation
HuggingFace - NLP models
Open Source:

Spring Boot community
React ecosystem
Chart.js for beautiful charts
Framer Motion for animations
📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

👨‍💻 Author
Muhammed Siyad P
Self-Taught Full-Stack Developer | Kerala, India

📧 Email: siyadsidu760@gmail.com
💼 LinkedIn:https://www.linkedin.com/in/muhammed-siyad-p/
🐦 GitHub: @Siyad007
📱 Phone: +91 9048571147
<div align="center">
⭐ If you find this project interesting, please consider starring the repository!
Built with ❤️ to preserve precious family memories

</div> ```
