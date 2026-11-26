import React, { lazy, Suspense } from 'react'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import ProtectedRoute from './components/admin/ProtectedRoute'
import { SocketProvider } from './context/SocketContext'
import ChatDialog from './components/chat/ChatDialog'

// Eagerly import Home for instant zero-delay first paint
import Home from './components/Home'

// Lazily load other routes to keep initial bundle ultra-compact
const Login = lazy(() => import('./components/auth/Login'))
const Signup = lazy(() => import('./components/auth/Signup'))
const Jobs = lazy(() => import('./components/Jobs'))
const JobDescription = lazy(() => import('./components/JobDescription'))
const Browse = lazy(() => import('./components/Browse'))
const Profile = lazy(() => import('./components/Profile'))

// Admin routes (lazily loaded on demand)
const Companies = lazy(() => import('./components/admin/Companies'))
const CompanyCreate = lazy(() => import('./components/admin/CompanyCreate'))
const CompanySetup = lazy(() => import('./components/admin/CompanySetup'))
const AdminJobs = lazy(() => import('./components/admin/AdminJobs'))
const PostJob = lazy(() => import('./components/admin/PostJob'))
const JobSetup = lazy(() => import('./components/admin/JobSetup'))
const Applicants = lazy(() => import('./components/admin/Applicants'))
const NotFound = lazy(() => import('./components/NotFound'))

const PageLoader = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-gray-50/50">
    <div className="w-8 h-8 border-3 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-3"></div>
    <span className="text-xs text-gray-400 font-medium">Loading HireHoriZon...</span>
  </div>
);

const withSuspense = (Component) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

const appRouter = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/login', element: withSuspense(Login) },
  { path: '/signup', element: withSuspense(Signup) },
  { path: '/jobs', element: withSuspense(Jobs) },
  { path: '/description/:id', element: withSuspense(JobDescription) },
  { path: '/browse', element: withSuspense(Browse) },
  { path: '/profile', element: withSuspense(Profile) },

  // admin routes
  { path: '/admin/companies', element: <ProtectedRoute>{withSuspense(Companies)}</ProtectedRoute> },
  { path: '/admin/companies/create', element: <ProtectedRoute>{withSuspense(CompanyCreate)}</ProtectedRoute> },
  { path: '/admin/companies/:id', element: <ProtectedRoute>{withSuspense(CompanySetup)}</ProtectedRoute> },
  { path: '/admin/jobs', element: <ProtectedRoute>{withSuspense(AdminJobs)}</ProtectedRoute> },
  { path: '/admin/jobs/create', element: <ProtectedRoute>{withSuspense(PostJob)}</ProtectedRoute> },
  { path: '/admin/jobs/:id/edit', element: <ProtectedRoute>{withSuspense(JobSetup)}</ProtectedRoute> },
  { path: '/admin/jobs/:id/applicants', element: <ProtectedRoute>{withSuspense(Applicants)}</ProtectedRoute> },
  { path: '*', element: withSuspense(NotFound) }
])

function App() {
  return (
    <SocketProvider>
      <RouterProvider router={appRouter} />
      <ChatDialog />
    </SocketProvider>
  )
}

export default App
