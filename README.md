# 💼 HireHorizon — Job Portal Frontend

A modern, high-performance, and responsive job portal frontend built with **React 19**, **Vite 6**, **Redux Toolkit**, **Tailwind CSS v4**, and **shadcn/ui**. Features real-time duplex messaging powered by **Socket.io**, AI resume-to-job match analysis, AI-tailored cover letter generation, a 5-stage recruiter ATS Kanban pipeline with CSV export, multi-platform job aggregation tags, and bookmarking.

> 🚀 **Live App:** [hirehorizonfrontendsystem.vercel.app](https://hirehorizonfrontendsystem.vercel.app)  
> 🔗 **Backend Repo:** [hirehorizon_backend_system](https://github.com/aadiityaasingh/hirehorizon_backend_system)

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite 6 |
| Routing | React Router DOM v7 |
| State Management | Redux Toolkit + Redux Persist |
| Real-Time Communication | Socket.io Client (`socket.io-client`) |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui (Radix UI Primitives) |
| Animations | Framer Motion |
| Carousel | Embla Carousel |
| HTTP Client | Axios |
| Notifications | Sonner |
| Icons | Lucide React |
| Theming | next-themes |
| Linting | ESLint v9 |

---

## ✨ Features

### 👨‍🎓 Candidate / Student Experience
- 🏠 **Landing Page** — Hero search trigger, job category carousel, and latest jobs showcase.
- 🔍 **Jobs Directory & Filtering** — Filter by location, tech stack, and salary range with real-time updates.
- 🤖 **AI Fit Percentage Badges** — Dynamic purple gradient badges (`✨ X% Fit`) appearing on job cards matching the candidate's profile skills.
- 🌐 **Multi-Platform Source Tags** — Clear identification badges for jobs sourced from **Greenhouse**, **Lever**, **RemoteOK**, **We Work Remotely**, **Remotive**, **Arbeitnow**, **Jobicy**, and native **HireHoriZon** direct employers.
- 📊 **AI Resume Match & Fit Assessment** — In-depth breakdown on job details:
  - Circular match percentage score (e.g. *100% Outstanding Match*, *Good Match*).
  - Matched skills badges (`✓ React`, `✓ Node.js`, `✓ TypeScript`, etc.).
  - Recommended skills to highlight in interviews (`+ Docker`, `+ Microservices`, etc.).
  - Actionable career advice explaining candidate alignment with the job.
- ✍️ **AI Cover Letter Generator Modal**:
  - 4 customizable tones: *Professional & Impactful*, *Technical & Detailed*, *Startup & Fast-Paced*, or *Concise*.
  - Optional custom project highlight input.
  - Generates tailored letters with one-click **Copy to Clipboard** and **Download .txt**.
- 💬 **Direct "Chat with Recruiter" Action** — Initiate real-time chat with the hiring team directly from any direct job listing.
- 📄 **Profile & Resume Management** — Manage bio, phone number, skill tags with badges, and PDF resume upload/viewing.
- 📋 **Applications & Saved Jobs** — Track submitted applications across all 5 recruitment stages and review bookmarked jobs.

---

### 🏢 Recruiter & ATS Experience
- 📊 **5-Stage Kanban Recruitment Board** — Interactive pipeline board organizing applicants across:
  1. 📥 **Applied** (Pending)
  2. 🔍 **Screening**
  3. 📅 **Interview**
  4. 🏆 **Offer / Accepted**
  5. ❌ **Rejected**
- 🗂 **Candidate Cards** — Display candidate avatar, email, phone, skill tags, resume link, and stage advancement buttons (`→ Screening`, `→ Interview`, `Accept`, `Reject`).
- 🔄 **View Switcher** — Smoothly toggle between **Kanban Board** and **Table View** without losing state.
- 🔍 **Live Candidate Search** — Instant client-side filtering of applicants by candidate name, email, or skill.
- 📥 **One-Click CSV Export** — Export all applicant records into a structured spreadsheet containing:
  `Candidate Name, Email, Phone, Current Pipeline Stage, Skills, Applied Date, Resume Link`.
- 🏢 **Company Setup** — Register and edit company profiles, description, website, and logo uploads.
- 💼 **Job Postings** — Post new positions with LPA compensation, experience levels, and skill tags.

---

### 💬 Real-Time Messaging (Socket.io)
- 🔔 **Navbar Notification Badge** — Real-time unread message counter directly in the top header.
- 💬 **Live Messaging Drawer** — Floating, collapsible chat window with minimize and maximize controls.
- 🟢 **Online Status Indicators** — Green presence dots showing active users in real time.
- 👥 **Conversation Threads** — Sidebar displaying recent conversations, last message previews, and unread badges.
- ⚡ **Instant Delivery** — Two-way instant messaging between Candidates and Recruiters with auto-scroll and optimistic UI updates.

---

## 📁 Project Structure

```
hirehorizon-frontend/
├── public/
├── src/
│   ├── assets/
│   │   └── HireHoriZonlogo.png         # Brand logo
│   ├── components/
│   │   ├── admin/
│   │   │   ├── AdminJobs.jsx           # Recruiter job listings view
│   │   │   ├── AdminJobsTable.jsx      # Jobs data table with action menu
│   │   │   ├── Applicants.jsx          # ATS applicant pool with view switcher & CSV export
│   │   │   ├── ApplicantsKanban.jsx    # 5-stage interactive Kanban pipeline board
│   │   │   ├── ApplicantsTable.jsx     # Tabular applicants view with status controls
│   │   │   ├── Companies.jsx           # Registered companies list
│   │   │   ├── CompaniesTable.jsx      # Companies data table
│   │   │   ├── CompanyCreate.jsx       # Form to register a new company
│   │   │   ├── CompanySetup.jsx        # Form to update company details and logo
│   │   │   ├── JobSetup.jsx            # Form to edit and update job openings
│   │   │   ├── PostJob.jsx             # Form to post a new job opening
│   │   │   └── ProtectedRoute.jsx      # Guard restricting routes to authenticated recruiters
│   │   ├── ai/
│   │   │   ├── AiJobMatch.jsx          # AI fit score, skill chips & recommendations card
│   │   │   └── CoverLetterModal.jsx    # Tailored cover letter generator dialog
│   │   ├── auth/
│   │   │   ├── Login.jsx               # Login form with role selector
│   │   │   └── Signup.jsx              # Registration form with role selector & avatar upload
│   │   ├── chat/
│   │   │   └── ChatDialog.jsx          # Live messaging drawer with socket room integration
│   │   ├── ui/                         # shadcn/ui components (Radix primitives)
│   │   │   ├── avatar.jsx
│   │   │   ├── badge.jsx
│   │   │   ├── button.jsx
│   │   │   ├── carousel.jsx
│   │   │   ├── dialog.jsx              # Solid white opaque dialog container
│   │   │   ├── input.jsx
│   │   │   ├── label.jsx
│   │   │   ├── popover.jsx             # Solid white opaque popover container
│   │   │   ├── radio-group.jsx
│   │   │   ├── select.jsx
│   │   │   ├── sonner.jsx
│   │   │   └── table.jsx
│   │   ├── AppliedJobTable.jsx         # Candidate applied jobs table
│   │   ├── Browse.jsx                  # Browse jobs view with search
│   │   ├── CategoryCarousel.jsx        # Landing page category carousel
│   │   ├── FilterCard.jsx              # Multi-criteria job filter sidebar
│   │   ├── Footer.jsx                  # Application footer
│   │   ├── HeroSection.jsx             # Landing page hero with search input
│   │   ├── Home.jsx                    # Home landing page
│   │   ├── Job.jsx                     # Job card with % fit badge & source tag
│   │   ├── JobDescription.jsx          # Job details, AI match, cover letter & recruiter chat
│   │   ├── Jobs.jsx                    # Jobs directory page
│   │   ├── LatestJobCards.jsx          # Latest job opening card
│   │   ├── LatestJobs.jsx              # Latest jobs section
│   │   ├── Navbar.jsx                  # Navigation bar with real-time chat trigger
│   │   ├── NotFound.jsx                # 404 error page
│   │   ├── Profile.jsx                 # Candidate profile with skills, resume & saved tabs
│   │   ├── SavedJobTable.jsx           # Bookmarked jobs table
│   │   └── UpdateProfileDialog.jsx     # Profile edit modal with resume upload
│   ├── context/
│   │   └── SocketContext.jsx           # Global Socket.io provider with online & unread state
│   ├── hooks/
│   │   ├── useGetAllAdminJobs.jsx      # Hook to fetch recruiter jobs
│   │   ├── useGetAllCompanies.jsx      # Hook to fetch recruiter companies
│   │   ├── useGetAllJobs.jsx           # Hook to fetch all jobs (limit 200)
│   │   ├── useGetAppliedJobs.jsx       # Hook to fetch candidate application history
│   │   └── useGetCompanyById.jsx       # Hook to fetch single company
│   ├── lib/
│   │   └── utils.js                    # Tailwind class merger utility (cn)
│   ├── redux/
│   │   ├── applicationSlice.js         # Redux slice for applicants and 5-stage status updates
│   │   ├── authSlice.js                # Redux slice for user session
│   │   ├── companySlice.js             # Redux slice for company records
│   │   ├── jobSlice.js                 # Redux slice for job catalog & active filters
│   │   └── store.js                    # Redux store with redux-persist integration
│   ├── utils/
│   │   └── constant.js                 # Centralized API endpoints & base URL
│   ├── App.css
│   ├── App.jsx                         # App routes, SocketProvider & ChatDialog wrapper
│   ├── index.css                       # Tailwind CSS directives and theme variables
│   └── main.jsx                        # React root entry point
├── .env.example
├── .gitignore
├── components.json                     # shadcn/ui configuration
├── eslint.config.js                    # ESLint rules
├── package.json
└── vite.config.js                      # Vite config with '@' alias
```

---

## 🗺 Application Routes

| Path | Component | Access | Description |
|---|---|---|---|
| `/` | `Home` | Public | Landing page with hero search and latest jobs |
| `/login` | `Login` | Public | User authentication with role switch (`student` / `recruiter`) |
| `/signup` | `Signup` | Public | Account registration with profile picture upload |
| `/jobs` | `Jobs` | Public | Job listings with filter sidebar and `% Fit` badges |
| `/description/:id` | `JobDescription` | Public | Job details, AI Match analysis, AI Cover Letter, and Recruiter Chat |
| `/browse` | `Browse` | Public | Global keyword and title job search |
| `/profile` | `Profile` | 🔒 Student | Candidate profile, skill badges, resume link, applied and saved jobs |
| `/admin/companies` | `Companies` | 🔒 Recruiter | View registered company entities |
| `/admin/companies/create` | `CompanyCreate` | 🔒 Recruiter | Register a new company |
| `/admin/companies/:id` | `CompanySetup` | 🔒 Recruiter | Update company profile, description, website, and logo |
| `/admin/jobs` | `AdminJobs` | 🔒 Recruiter | Manage posted jobs with search and action menu |
| `/admin/jobs/create` | `PostJob` | 🔒 Recruiter | Create and publish a new job opening |
| `/admin/jobs/:id/edit` | `JobSetup` | 🔒 Recruiter | Edit an existing job opening |
| `/admin/jobs/:id/applicants` | `Applicants` | 🔒 Recruiter | **ATS Pipeline**: 5-stage Kanban board, candidate search, and CSV export |
| `*` | `NotFound` | Public | 404 page with return-home navigation |

---

## 🔗 API Endpoints Used

All API calls connect to the backend (configured via `VITE_BACKEND_URL` in `.env`):

| Endpoint Constant | Route | Description |
|---|---|---|
| `USER_API_END_POINT` | `/api/user` | Auth, profile updates, and job bookmarking |
| `JOB_API_END_POINT` | `/api/job` | Job catalog, AI match score, and cover letter generator |
| `APPLICATION_API_END_POINT` | `/api/application` | Applications, applicant lists, and 5-stage status updater |
| `COMPANY_API_END_POINT` | `/api/company` | Company registration and updates |
| `MESSAGE_API_END_POINT` | `/api/message` | Real-time messages, conversation threads, and unread count |

---

## ⚙️ Getting Started

### Prerequisites

- Node.js v18+
- npm

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/aadiityaasingh/hirehorizon_frontend_system.git
cd hirehorizon_frontend_system

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Set VITE_BACKEND_URL=http://localhost:8080 (or your deployed backend URL)

# 4. Start the development server
npm run dev
```

### Available Scripts

```bash
npm run dev       # Start Vite development server
npm run build     # Compile and bundle for production
npm run preview   # Preview the production build locally
npm run lint      # Run ESLint to verify code quality
```

---

## 🔑 Demo Credentials

| Role | Email | Password |
|---|---|---|
| **Candidate / Student** | `student@hirehorizon.com` | `password123` |
| **Recruiter / Admin** | `recruiter@hirehorizon.com` | `password123` |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

> Built with 💙 as part of the HireHorizon Full-Stack Recruitment Ecosystem
