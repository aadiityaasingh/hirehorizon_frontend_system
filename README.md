# 💼 HireHorizon — Job Portal Frontend

A modern, responsive job portal frontend built with **React 19**, **Redux Toolkit**, **Tailwind CSS v4**, and **shadcn/ui**. Students can browse and apply for jobs while recruiters can manage companies, post jobs, and handle applicants — all in a clean, animated UI.

> 🚀 **Live App:** [hirehorizonfrontendsystem.vercel.app](https://hirehorizonfrontendsystem.vercel.app)  
> 🔗 **Backend Repo:** [hirehorizon-backend](https://github.com/aadiityaasingh/hirehorizon-backend)

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite 6 |
| Routing | React Router DOM v7 |
| State Management | Redux Toolkit + Redux Persist |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui (Radix UI primitives) |
| Animations | Framer Motion |
| Carousel | Embla Carousel |
| HTTP Client | Axios |
| Notifications | Sonner |
| Icons | Lucide React |
| Theming | next-themes |
| Linting | ESLint v9 |

---

## ✨ Features

### 👨‍🎓 Student
- 🏠 **Home** — Hero section, category carousel, and latest job listings
- 🔍 **Browse & Filter** — Browse all jobs with filter cards by category/location
- 💼 **Job Details** — Full job description with one-click apply
- 📄 **Profile** — View and update profile with resume upload
- 📋 **Applied Jobs** — Track all job applications and their statuses

### 🏢 Recruiter (Admin)
- 🏢 **Companies** — View, create, and set up company profiles
- 💼 **Job Management** — Post new jobs and manage existing listings
- 👥 **Applicants** — View all applicants per job and update their status
- 🔒 **Protected Routes** — All admin pages are guarded via `ProtectedRoute`

### ⚙️ General
- 🔐 **Auth** — Login and Signup with role selection (`student` / `recruiter`)
- 💾 **Persisted State** — Redux state persisted across sessions via `redux-persist`
- 🔔 **Toast Notifications** — Real-time feedback via Sonner
- 📱 **Responsive Design** — Mobile-friendly layout throughout

---

## 📁 Project Structure

```
hirehorizon-frontend/
├── public/
├── src/
│   ├── assets/
│   │   └── HireHoriZonlogo.png
│   ├── components/
│   │   ├── admin/
│   │   │   ├── AdminJobs.jsx           # Recruiter job listings
│   │   │   ├── AdminJobsTable.jsx      # Jobs data table
│   │   │   ├── Applicants.jsx          # Applicants per job
│   │   │   ├── ApplicantsTable.jsx     # Applicants data table
│   │   │   ├── Companies.jsx           # Company listings
│   │   │   ├── CompaniesTable.jsx      # Companies data table
│   │   │   ├── CompanyCreate.jsx       # Create new company
│   │   │   ├── CompanySetup.jsx        # Update company profile
│   │   │   ├── PostJob.jsx             # Post a new job
│   │   │   └── ProtectedRoute.jsx      # Recruiter route guard
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   └── Signup.jsx
│   │   ├── ui/                         # shadcn/ui components
│   │   │   ├── avatar.jsx
│   │   │   ├── badge.jsx
│   │   │   ├── button.jsx
│   │   │   ├── carousel.jsx
│   │   │   ├── dialog.jsx
│   │   │   ├── input.jsx
│   │   │   ├── label.jsx
│   │   │   ├── popover.jsx
│   │   │   ├── radio-group.jsx
│   │   │   ├── select.jsx
│   │   │   ├── sonner.jsx
│   │   │   └── table.jsx
│   │   ├── AppliedJobTable.jsx         # Student applied jobs table
│   │   ├── Browse.jsx                  # Browse all jobs
│   │   ├── CategoryCarousel.jsx        # Job category carousel
│   │   ├── FilterCard.jsx              # Job filter sidebar
│   │   ├── Footer.jsx
│   │   ├── HeroSection.jsx             # Landing page hero
│   │   ├── Home.jsx                    # Home page
│   │   ├── Job.jsx                     # Single job card
│   │   ├── JobDescription.jsx          # Full job detail + apply
│   │   ├── Jobs.jsx                    # Job listings page
│   │   ├── LatestJobCards.jsx          # Individual latest job card
│   │   ├── LatestJobs.jsx              # Latest jobs section
│   │   ├── Navbar.jsx
│   │   ├── Profile.jsx                 # Student profile page
│   │   └── UpdateProfileDialog.jsx     # Profile update modal
│   ├── hooks/
│   │   ├── useGetAllAdminJobs.jsx      # Fetch recruiter jobs
│   │   ├── useGetAllCompanies.jsx      # Fetch all companies
│   │   ├── useGetAllJobs.jsx           # Fetch all jobs
│   │   ├── useGetAppliedJobs.jsx       # Fetch applied jobs
│   │   └── useGetCompanyById.jsx       # Fetch single company
│   ├── lib/
│   │   └── utils.js                    # Tailwind class utility (cn)
│   ├── redux/
│   │   ├── applicationSlice.js
│   │   ├── authSlice.js
│   │   ├── companySlice.js
│   │   ├── jobSlice.js
│   │   └── store.js                    # Redux store + persist config
│   ├── utils/
│   │   └── constant.js                 # API endpoint constants
│   ├── App.css
│   ├── App.jsx                         # Router setup
│   ├── index.css
│   └── main.jsx                        # React root + Redux Provider
├── index.html
├── vite.config.js
├── eslint.config.js
├── components.json                     # shadcn/ui config
└── package.json
```

---

## 🗺 Routes

| Path | Component | Access | Description |
|---|---|---|---|
| `/` | `Home` | Public | Landing page with hero and latest jobs |
| `/login` | `Login` | Public | User login |
| `/signup` | `Signup` | Public | User registration |
| `/jobs` | `Jobs` | Public | Browse all job listings |
| `/description/:id` | `JobDescription` | Public | Full job detail and apply button |
| `/browse` | `Browse` | Public | Browse jobs with filters |
| `/profile` | `Profile` | Public | Student profile and applied jobs |
| `/admin/companies` | `Companies` | 🔒 Recruiter | View all companies |
| `/admin/companies/create` | `CompanyCreate` | 🔒 Recruiter | Create a new company |
| `/admin/companies/:id` | `CompanySetup` | 🔒 Recruiter | Update company profile |
| `/admin/jobs` | `AdminJobs` | 🔒 Recruiter | View posted jobs |
| `/admin/jobs/create` | `PostJob` | 🔒 Recruiter | Post a new job |
| `/admin/jobs/:id/applicants` | `Applicants` | 🔒 Recruiter | View and manage applicants |

---

## 🔗 API Endpoints Used

All requests go to the live backend at `https://hirehorizon-backend-system.onrender.com`:

| Constant | Base URL |
|---|---|
| `USER_API_END_POINT` | `/api/user` |
| `JOB_API_END_POINT` | `/api/job` |
| `APPLICATION_API_END_POINT` | `/api/application` |
| `COMPANY_API_END_POINT` | `/api/company` |

---

## 🗃 Redux Store

| Slice | State Managed |
|---|---|
| `authSlice` | Logged-in user, authentication status |
| `jobSlice` | All jobs, filtered jobs, single job |
| `companySlice` | All companies, single company |
| `applicationSlice` | Applied jobs, applicants |

> State is persisted across browser sessions using `redux-persist`.

---

## ⚙️ Getting Started

### Prerequisites

- Node.js v18+
- npm

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/aadiityaasingh/hirehorizon-frontend.git
cd hirehorizon-frontend

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

### Available Scripts

```bash
npm run dev       # Start development server (Vite)
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---


> Built with 💙 as part of the HireHorizon MERN Job Portal