# Aikee AI — Full System Architecture

**Technology Stack**: React 18 + Vite (Frontend) | Node.js HTTP Server (Backend) | Supabase (Auth & Database) | Gemini/Groq/Stability APIs

---

## 1. Application Route Map

```
/                        ← Landing Page (public)
/login                   ← Sign In / Login (public)
/register                ← Sign Up (public)
/dashboard               ← User Dashboard (protected)
/dashboard/cv/:id        ← View / Edit a saved CV (protected)
/builder                 ← CV Builder Wizard (protected)
/builder/:id             ← Edit existing CV (protected)
/preview/:id             ← CV Preview & Download (protected)
```

---

## 2. Full User Journey (Updated)

```
┌──────────────────────────────────────────────────────────────────┐
│                        LANDING PAGE  /                           │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Hero Section — "Build your CV in 5 minutes"            │    │
│  │  Features Section — AI Skills, Experience Enhancement   │    │
│  │  Template Gallery — Preview of all CV templates         │    │
│  │  How It Works — 3-step explainer                        │    │
│  │  Testimonials / Social proof                            │    │
│  │  CTA — "Get Started Free" → /register                   │    │
│  └─────────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              ↓                               ↓
┌─────────────────────────┐   ┌──────────────────────────────────┐
│   REGISTER  /register   │   │       LOGIN  /login              │
│                         │   │                                  │
│  Name                   │   │  Email + Password                │
│  Email                  │   │  OR Google OAuth                 │
│  Password               │   │  OR LinkedIn OAuth               │
│  Confirm Password       │   │                                  │
│  Google OAuth           │   │  ─── Forgot Password link ───   │
│  LinkedIn OAuth         │   │                                  │
└──────────┬──────────────┘   └──────────────┬───────────────────┘
           │                                  │
           └──────────────┬───────────────────┘
                          ↓
              ┌────────────────────────┐
              │  Supabase Auth Layer   │
              │                        │
              │  ├─ Create/verify user │
              │  ├─ Issue JWT token    │
              │  └─ Set session cookie │
              └────────────┬───────────┘
                          ↓
┌──────────────────────────────────────────────────────────────────┐
│                   DASHBOARD  /dashboard                          │
│                                                                  │
│  ┌──────────┬─────────────────────────────────────────────┐     │
│  │ Sidebar  │  Main Content Area                          │     │
│  │          │                                             │     │
│  │ My CVs   │  ┌──────────────────────────────────────┐  │     │
│  │ New CV   │  │  SAVED CVs GRID                       │  │     │
│  │ Settings │  │                                        │  │     │
│  │ Logout   │  │  ┌────────┐ ┌────────┐ ┌──────────┐  │  │     │
│  │          │  │  │  CV 1  │ │  CV 2  │ │ + New CV │  │  │     │
│  │          │  │  │ Preview│ │ Preview│ │          │  │  │     │
│  │          │  │  │[Edit]  │ │[Edit]  │ │          │  │  │     │
│  │          │  │  │[Delete]│ │[Delete]│ │          │  │  │     │
│  │          │  │  └────────┘ └────────┘ └──────────┘  │  │     │
│  │          │  └──────────────────────────────────────┘  │     │
│  └──────────┴─────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────────────────┘
                          │
            ┌─────────────┴──────────────┐
            ↓                            ↓
  ┌───────────────────┐        ┌──────────────────────┐
  │  BUILDER /builder │        │ EDIT /builder/:id    │
  │  (new CV)         │        │ (existing CV)         │
  └────────┬──────────┘        └──────────┬────────────┘
           └──────────────┬───────────────┘
                          ↓
          ┌───────────────────────────────┐
          │     CV BUILDER WIZARD         │
          │  Step 0: Job Target           │
          │  Step 1: Personal Info        │
          │  Step 2: Skills Discovery     │
          │  Step 3: Experience           │
          │  Step 4: Education            │
          │  Step 5: Template Picker      │
          │  Step 6: Preview & Save       │
          └───────────────┬───────────────┘
                          ↓
          ┌───────────────────────────────┐
          │   SAVE TO SUPABASE            │
          │   ─ cvs table                 │
          │   ─ linked to user_id         │
          │   ─ returns to dashboard      │
          └───────────────────────────────┘
```

---

## 3. System Architecture Overview (Full Stack)

```
┌──────────────────────────────────────────────────────────────────┐
│                    FRONTEND LAYER (React + Vite)                 │
│                                                                  │
│  Landing Page   Auth Pages   Dashboard   CV Builder   Preview    │
│     /             /login     /dashboard   /builder    /preview   │
│                  /register                                       │
│                                                                  │
│  Vite Dev Server:3000                                            │
│  └─ Proxies /api → http://localhost:8787                        │
└──────────────────────────────┬───────────────────────────────────┘
                               │  HTTP / API calls (proxied)
                               ↓
┌──────────────────────────────────────────────────────────────────┐
│              BACKEND SERVER LAYER (Node.js HTTP)                 │
│                     Port 8787 (server/index.js)                  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  /api/gemini/generate-content       POST                 │   │
│  │  /api/gemini/status                 GET                  │   │
│  │  /api/groq/generate-content         POST                 │   │
│  │  /api/groq/status                   GET                  │   │
│  │  /api/stability/headshot            POST                 │   │
│  │  /api/stability/status              GET                  │   │
│  └──────────────────────────────────────────────────────────┘   │
└───────────┬──────────────────┬──────────────────────┬────────────┘
            │                  │                      │
            ↓                  ↓                      ↓
┌─────────────────────┐ ┌───────────────────┐ ┌────────────────────┐
│  SUPABASE LAYER     │ │  GEMINI API       │ │  OTHER AI SERVICES │
│                     │ │  (External)       │ │                    │
│  ├─ Auth (JWT)      │ │                   │ │  ├─ Groq LLM       │
│  ├─ PostgreSQL DB   │ │  Models:          │ │  │  (Questions)    │
│  │   ├─ users       │ │  - Primary:       │ │  │                 │
│  │   ├─ profiles    │ │    gemini-2.5-... │ │  ├─ Stability AI   │
│  │   ├─ cvs         │ │  - Fallback:      │ │  │  (Headshots)    │
│  │   └─ cv_data     │ │    gem-2.5-flash  │ │  │                 │
│  └─ Storage         │ │                   │ │  └─ html2pdf.js    │
│      └─ headshots/  │ │  Uses:            │ │    (Client-side)   │
│                     │ │  - Skills gen.    │ │                    │
│                     │ │  - Experience     │ │                    │
│                     │ │  - Summaries      │ │                    │
└─────────────────────┘ └───────────────────┘ └────────────────────┘
```

---

## 4. Landing Page Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                       LANDING PAGE  /                            │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  NAVBAR                                                  │   │
│  │  Logo | Features | Templates | Pricing | Login | Sign Up │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  HERO SECTION                                            │   │
│  │  Headline: "Build a job-winning CV in 5 minutes"         │   │
│  │  Subheadline: AI-powered, professional templates         │   │
│  │  CTA buttons: [Get Started Free]  [See Templates]        │   │
│  │  Hero visual: animated CV builder preview                │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  HOW IT WORKS  (3 steps)                                 │   │
│  │  1. Answer a few questions                               │   │
│  │  2. AI generates your skills & experience bullets        │   │
│  │  3. Download your professional CV                        │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  AI FEATURES SHOWCASE                                    │   │
│  │  ├─ AI Skill Discovery                                   │   │
│  │  ├─ Experience Enhancer                                  │   │
│  │  ├─ AI Headshot Generator                                │   │
│  │  └─ ATS Optimizer                                        │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  TEMPLATE GALLERY                                        │   │
│  │  Scrollable preview of all 19+ CV templates             │   │
│  │  Each card: thumbnail + template name + "Use this"       │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  FINAL CTA SECTION                                       │   │
│  │  "Start building your CV today — it's free"              │   │
│  │  [Create My CV Now]                                      │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  FOOTER                                                  │   │
│  │  Links | Privacy Policy | Terms | Contact                │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 5. Authentication Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                    AUTH FLOW (Supabase)                          │
└──────────────────────────────────────────────────────────────────┘

REGISTER FLOW
─────────────────────────────────────────────────────
  User fills /register form
        │
        ↓
  Client calls supabase.auth.signUp({ email, password })
        │
        ├─ Success ──→ Supabase sends verification email
        │               User redirected to /dashboard
        │               Session cookie set automatically
        │
        └─ Error ────→ Show inline error message
                        (email exists, weak password, etc.)


LOGIN FLOW
─────────────────────────────────────────────────────
  User fills /login form
        │
        ↓
  Client calls supabase.auth.signInWithPassword({ email, password })
        │
        ├─ Success ──→ JWT token stored in Supabase session
        │               Redirect to /dashboard
        │
        └─ Error ────→ "Invalid email or password" message


GOOGLE OAUTH FLOW
─────────────────────────────────────────────────────
  User clicks "Continue with Google"
        │
        ↓
  supabase.auth.signInWithOAuth({ provider: 'google' })
        │
        ↓
  Google OAuth consent screen
        │
        ↓
  Callback → Supabase verifies token
        │
        ↓
  Redirect to /dashboard


PROTECTED ROUTE GUARD
─────────────────────────────────────────────────────
  User navigates to /dashboard or /builder
        │
        ↓
  Middleware checks: supabase.auth.getSession()
        │
        ├─ Session exists ──→ Allow access
        │
        └─ No session ──────→ Redirect to /login
                               with returnTo param
                               e.g. /login?returnTo=/builder


LOGOUT FLOW
─────────────────────────────────────────────────────
  User clicks Logout
        │
        ↓
  supabase.auth.signOut()
        │
        ↓
  Clear session → Redirect to /
```

---

## 6. Dashboard Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                     DASHBOARD  /dashboard                        │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────┐  ┌────────────────────────────────────────┐    │
│  │  SIDEBAR    │  │  MAIN CONTENT                          │    │
│  │             │  │                                        │    │
│  │  👤 Profile  │  │  Welcome back, {firstName} 👋          │    │
│  │  📄 My CVs   │  │                                        │    │
│  │  ➕ New CV   │  │  ┌──────────────────────────────────┐  │    │
│  │  ⚙ Settings  │  │  │  STATS BAR                        │  │    │
│  │  🚪 Logout   │  │  │  CVs Created: 3 | Downloads: 12   │  │    │
│  │             │  │  └──────────────────────────────────┘  │    │
│  └─────────────┘  │                                        │    │
│                   │  ┌──────────────────────────────────┐  │    │
│                   │  │  MY CVs GRID                      │  │    │
│                   │  │                                    │  │    │
│                   │  │  ┌──────────┐  ┌──────────┐       │  │    │
│                   │  │  │ CV Card  │  │ CV Card  │       │  │    │
│                   │  │  │          │  │          │       │  │    │
│                   │  │  │ Thumbnail│  │ Thumbnail│       │  │    │
│                   │  │  │          │  │          │       │  │    │
│                   │  │  │ Title    │  │ Title    │       │  │    │
│                   │  │  │ Template │  │ Template │       │  │    │
│                   │  │  │ Updated  │  │ Updated  │       │  │    │
│                   │  │  │          │  │          │       │  │    │
│                   │  │  │ [Edit]   │  │ [Edit]   │       │  │    │
│                   │  │  │ [Preview]│  │ [Preview]│       │  │    │
│                   │  │  │ [Delete] │  │ [Delete] │       │  │    │
│                   │  │  └──────────┘  └──────────┘       │  │    │
│                   │  │                                    │  │    │
│                   │  │  ┌──────────┐                      │  │    │
│                   │  │  │ + New CV │                      │  │    │
│                   │  │  └──────────┘                      │  │    │
│                   │  └──────────────────────────────────┘  │    │
│                   └────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────┘


CV CARD ACTIONS
─────────────────────────────────────────────────────
  [Edit]    → /builder/:cv_id  (loads saved data into wizard)
  [Preview] → /preview/:cv_id  (read-only preview + download)
  [Delete]  → Confirmation modal → DELETE /api/cv/delete


DASHBOARD DATA FLOW
─────────────────────────────────────────────────────
  Page loads
        │
        ↓
  getServerSideProps / useEffect:
  GET /api/cv/list  (with auth token)
        │
        ↓
  Supabase query:
  SELECT * FROM cvs
  WHERE user_id = auth.uid()
  ORDER BY updated_at DESC
        │
        ↓
  Render CV cards from results
```

---

## 7. Database Schema (Supabase / PostgreSQL)

```
┌──────────────────────────────────────────────────────────────────┐
│                      DATABASE TABLES                             │
└──────────────────────────────────────────────────────────────────┘

TABLE: users  (managed by Supabase Auth)
─────────────────────────────────────────────────
  id            uuid PRIMARY KEY
  email         text UNIQUE NOT NULL
  created_at    timestamptz DEFAULT now()


TABLE: profiles  (extended user info)
─────────────────────────────────────────────────
  id            uuid PRIMARY KEY REFERENCES auth.users
  full_name     text
  avatar_url    text
  updated_at    timestamptz


TABLE: cvs  (saved CV documents)
─────────────────────────────────────────────────
  id            uuid PRIMARY KEY DEFAULT uuid_generate_v4()
  user_id       uuid REFERENCES auth.users NOT NULL
  title         text  (e.g. "My Marketing CV")
  template_id   text  (e.g. "minimalist1", "memphis")
  cv_data       jsonb (entire form data object)
  thumbnail_url text  (screenshot of CV for dashboard card)
  created_at    timestamptz DEFAULT now()
  updated_at    timestamptz DEFAULT now()

  INDEX: cvs_user_id_idx ON cvs(user_id)


ROW LEVEL SECURITY (RLS) on cvs table
─────────────────────────────────────────────────
  POLICY: "Users can only access their own CVs"
  USING: (auth.uid() = user_id)

  ├─ SELECT: auth.uid() = user_id
  ├─ INSERT: auth.uid() = user_id
  ├─ UPDATE: auth.uid() = user_id
  └─ DELETE: auth.uid() = user_id
```

---

## 8. CV Save & Load Flow (Supabase Direct)

```
SAVE NEW CV
─────────────────────────────────────────────────────────────────
  User completes builder wizard Step 6 (Preview)
        │
        ↓
  User clicks "Save to Dashboard"
        │
        ↓
  Frontend calls: cvOperations.saveCV({
    cvId: null,
    title: "Software Engineer CV",
    targetRole: "Senior Engineer",
    data: { name, email, skills, experience, ... }
  })
        │
        ↓
  Client-side Supabase RPC call:
  supabase.rpc('upsert_cv', {
    cv_id: null,
    cv_title: "...",
    cv_target_role: "...",
    cv_data: {...}
  })
        │
        ├─ RLS: auth.uid() = user_id (automatic)
        └─ Return: new CV ID
        │
        ↓
  Dashboard refetches CVs → shows new card


LOAD CV FOR EDITING
─────────────────────────────────────────────────────────────────
  User clicks [Edit] on dashboard card
        │
        ↓
  Navigate to /builder/:cv_id
        │
        ↓
  Frontend calls: cvOperations.getCVById(cvId)
        │
        ↓
  Client-side Supabase RPC call:
  supabase.rpc('get_cv_by_id', { cv_id: cvId })
        │
        ├─ RLS enforced automatically
        └─ Return full CV data
        │
        ↓
  Builder wizard pre-fills all form fields
        │
        ↓
  User edits and saves → calls saveCV() with cvId


UPDATE EXISTING CV
─────────────────────────────────────────────────────────────────
  cvOperations.saveCV({
    cvId: "existing-id",
    title: "...",
    targetRole: "...",
    data: { ...updated data... }
  })
        │
        ↓
  supabase.rpc('upsert_cv', {...})
  → Updates existing CV row with new data


DELETE CV
─────────────────────────────────────────────────────────────────
  User clicks [Delete] button
        │
        ↓
  cvOperations.deleteCV(cvId)
        │
        ↓
  supabase.rpc('delete_cv', { cv_id: cvId })
        │
        └─ RLS prevents deletion of other users' CVs
```

---

## 9. Updated State Management (with Auth)

```
┌──────────────────────────────────────────────────────────────┐
│                  App State Tree (Updated)                    │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ├─ AUTH STATE ──────────────────────────────────────────┐  │
│  │  ├─ user (Supabase user object or null)               │  │
│  │  ├─ session (JWT session or null)                     │  │
│  │  └─ authLoading (boolean)                             │  │
│  └─────────────────────────────────────────────────────────  │
│                                                              │
│  ├─ DASHBOARD STATE ─────────────────────────────────────┐  │
│  │  ├─ savedCVs (array of CV records from DB)            │  │
│  │  ├─ loadingCVs (boolean)                              │  │
│  │  └─ deleteConfirmId (cv id being confirmed or null)   │  │
│  └─────────────────────────────────────────────────────────  │
│                                                              │
│  ├─ BUILDER STATE ───────────────────────────────────────┐  │
│  │  ├─ step (0-6)                                        │  │
│  │  ├─ activeCvId (uuid if editing, null if new)         │  │
│  │  │                                                    │  │
│  │  ├─ FORM DATA ─────────────────────────────────────┐  │  │
│  │  │  ├─ jobTitle, company                            │  │  │
│  │  │  ├─ name, email, phone, address, photo           │  │  │
│  │  │  ├─ skillAnswers, selectedSkills                  │  │  │
│  │  │  ├─ experiences[ ]                               │  │  │
│  │  │  └─ educations[ ]                                │  │  │
│  │  └─────────────────────────────────────────────────  │  │
│  │                                                      │  │
│  │  ├─ GEMINI STATES ─────────────────────────────────┐  │  │
│  │  │  ├─ loadingSkills, loadingExperience            │  │  │
│  │  │  ├─ geminiSkills[ ]                             │  │  │
│  │  │  ├─ experienceBullets{ }                        │  │  │
│  │  │  └─ generatedSummary                            │  │  │
│  │  └─────────────────────────────────────────────────  │  │
│  │                                                      │  │
│  │  └─ UI STATES ─────────────────────────────────────┐  │  │
│  │     ├─ selectedTemplate                            │  │  │
│  │     └─ generating (boolean)                        │  │  │
│  │     └──────────────────────────────────────────────  │  │
│  └─────────────────────────────────────────────────────────  │
└──────────────────────────────────────────────────────────────┘
```

---

## 10. Backend Service Layer (Node.js Server)

```
┌──────────────────────────────────────────────────────────────────┐
│         Backend API Services (server/index.js)                   │
│                                                                  │
│  GEMINI SERVICE                                                  │
│  ├─ POST /api/gemini/generate-content                           │
│  │   ├─ Primary model: gemini-2.5-flash-lite (configurable)     │
│  │   ├─ Fallback model: gemini-2.5-flash                        │
│  │   ├─ Rate limit handling with dual keys                      │
│  │   └─ Returns: Generated content or fallback response         │
│  │                                                              │
│  ├─ GET /api/gemini/status                                      │
│  │   └─ Validates API key and returns status                   │
│  │                                                              │
│  GROQ SERVICE (For Question Generation)                         │
│  ├─ POST /api/groq/generate-content                             │
│  │   ├─ Model: llama-3.1-8b-instant                            │
│  │   └─ Used for generating job-specific questions             │
│  │                                                              │
│  ├─ GET /api/groq/status                                        │
│  │   └─ Validates API key and returns status                   │
│  │                                                              │
│  STABILITY SERVICE (For Headshot Generation)                    │
│  ├─ POST /api/stability/headshot                                │
│  │   ├─ Input: base64 image + prompt + mimeType                │
│  │   ├─ Uses Stability API for image enhancement               │
│  │   └─ Output: JPEG image data                                │
│  │                                                              │
│  ├─ GET /api/stability/status                                   │
│  │   └─ Validates API key and returns status                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 11. File & Folder Structure (React + Vite)

```
cv-builder-ai/
│
├── index.html                   ← Single Page App entry point
├── vite.config.js              ← Vite config (proxies /api to port 8787)
├── package.json                ← Dependencies & scripts
│
├── server/                      ← Node.js Backend Server (Port 8787)
│   └── index.js                ← HTTP server with API routes:
│                                  • /api/gemini/generate-content (POST)
│                                  • /api/gemini/status (GET)
│                                  • /api/groq/generate-content (POST)
│                                  • /api/groq/status (GET)
│                                  • /api/stability/headshot (POST)
│                                  • /api/stability/status (GET)
│
├── src/
│   ├── main.jsx                ← React app entry point
│   ├── App.jsx                 ← Root component (routing)
│   │
│   ├── components/
│   │   ├── pages/             ← Full page components
│   │   │   ├── SignIn.jsx
│   │   │   ├── HeadshotGenerator.jsx
│   │   │   └── ...
│   │   │
│   │   ├── steps/             ← CV Builder wizard steps
│   │   │   ├── JobTargetStep.jsx
│   │   │   ├── PersonalInfoStep.jsx
│   │   │   ├── SkillsStep.jsx
│   │   │   ├── ExperienceStep.jsx
│   │   │   ├── EducationStep.jsx
│   │   │   ├── SummaryStep.jsx
│   │   │   ├── ExtrasStep.jsx
│   │   │   ├── AwardsStep.jsx
│   │   │   ├── CertificationsStep.jsx
│   │   │   ├── ProjectsStep.jsx
│   │   │   ├── ActivitiesStep.jsx
│   │   │   ├── InterestsStep.jsx
│   │   │   └── ...
│   │   │
│   │   ├── pdftemplates/      ← All 19+ CV templates
│   │   │   ├── CurriculumVitae.jsx
│   │   │   ├── ClassicTemplates/
│   │   │   │   ├── BlackBlueModernCV.jsx
│   │   │   │   ├── ClassicCV1.jsx
│   │   │   │   └── ...
│   │   │   ├── ModernTemplates/
│   │   │   │   ├── ModernCV1.jsx
│   │   │   │   └── ...
│   │   │   ├── MinimalTemplates/
│   │   │   ├── CreativeTemplates/
│   │   │   ├── StudentTemplates/
│   │   │   └── BlueGrayTemplates/
│   │   │
│   │   ├── preview/           ← Preview & template selector
│   │   │   ├── CVPreview.jsx
│   │   │   └── TemplateSelector.jsx
│   │   │
│   │   ├── modals/            ← Modal components
│   │   │   ├── SaveCVModal.jsx
│   │   │   └── LoadCVModal.jsx
│   │   │
│   │   ├── common/            ← Reusable components
│   │   │   └── Section.jsx
│   │   │
│   │   ├── shared/
│   │   │   └── QuestionBlock.jsx
│   │   │
│   │   ├── Header.jsx
│   │   └── DebugAuthStatus.jsx
│   │
│   ├── services/
│   │   ├── geminiService.js    ← Gemini API service
│   │   ├── groqService.js      ← Groq API service
│   │   └── stabilityService.js ← Stability AI service
│   │
│   ├── utils/
│   │   ├── databaseHelpers.js  ← Supabase CV queries
│   │   ├── geminiDebug.js
│   │   ├── helpers.js
│   │   └── sectioning.js       ← Dynamic CV sections
│   │
│   ├── constants/
│   │   ├── questions.js
│   │   ├── steps.js
│   │   └── theme.js
│   │
│   └── assets/
│       └── pdf-templates/
│
├── lib/
│   └── supabaseClient.js        ← Supabase client initialization
│
├── database/
│   ├── schema.sql              ← Supabase table schemas
│   └── queries.sql             ← Useful SQL queries
│
└── .env.local (sensitive)
    ├── GEMINI_API_KEY / GEMINI_API_KEY_FALLBACK
    ├── GROQ_QUESTIONS_API_KEY
    ├── STABILITY_API_KEY
    ├── NEXT_PUBLIC_SUPABASE_URL
    └── NEXT_PUBLIC_SUPABASE_ANON_KEY
```

---

## 12. Environment Variables

```
# Backend APIs
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_API_KEY_FALLBACK=optional_fallback_gemini_key
GEMINI_MODEL_PRIMARY=gemini-2.5-flash-lite          # Primary LLM model
GEMINI_MODEL_FALLBACK=gemini-2.5-flash              # Fallback model

GROQ_QUESTIONS_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.1-8b-instant

STABILITY_API_KEY=your_stability_api_key_here

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Server Configuration
PORT=8787                                           # Backend server port

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000           # Frontend URL
```

---

## 13. Build & Run Instructions

```
DEVELOPMENT
─────────────────────────────────────────────────
1. Install dependencies:
   npm install

2. Create .env.local with required API keys (see section 12)

3. Start backend server (Terminal 1):
   npm run server
   → Runs on http://localhost:8787

4. Start frontend dev server (Terminal 2):
   npm run dev
   → Runs on http://localhost:5173 (Vite default)
   → Proxies /api calls to localhost:8787

5. Open browser and navigate to:
   http://localhost:5173


PRODUCTION BUILD
─────────────────────────────────────────────────
1. Build React app:
   npm run build
   → Creates dist/ folder with optimized bundle

2. Serve backend + frontend:
   npm run server         (Terminal 1)
   vite preview          (Terminal 2)
```

---

## 14. Key Architecture Principles

- ✅ **Separated Frontend & Backend** — React + Vite frontend independent from Node.js backend
- ✅ **All sensitive API calls proxied** — Gemini, Groq, Stability API keys only on server; never exposed to browser
- ✅ **Direct Supabase client** — Frontend directly calls Supabase via RLS-protected RPCs for CV CRUD
- ✅ **Row Level Security (RLS)** — All DB tables have automatic RLS policies; users can only access their own CVs
- ✅ **Dual Gemini models** — Primary + fallback models with automatic failover on rate limits/quota errors
- ✅ **Multi-provider AI services** — Gemini for content generation, Groq for questions, Stability for image enhancement
- ✅ **Supabase RPC functions** — Complex DB operations (upsert_cv, get_user_cvs) handled server-side in Supabase
- ✅ **Dynamic section rendering** — Empty CV sections automatically skipped in template rendering
- ✅ **CV data as JSONB** — Flexible document storage in Supabase; no schema migration needed for form changes
- ✅ **AI result caching** — Supabase cache table deduplicates redundant Gemini/Groq calls by input hash
- ✅ **Client-side PDF export** — html2pdf.js generates PDFs in browser without server processing
- ✅ **Template registry pattern** — New CV templates added by importing single JSX file
- ✅ **Graceful degradation** — App works with static fallbacks if any AI API becomes unavailable