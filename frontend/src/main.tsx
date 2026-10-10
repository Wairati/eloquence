import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AppShell } from './app/AppShell'
import { NAV_ITEMS } from './app/navigation'
import { DashboardPage } from './features/dashboard/DashboardPage'
import { MorePage } from './features/more/MorePage'
import { PlannedPage, type PlannedNavItem } from './features/planned/PlannedPage'
import { NotFoundPage } from './features/planned/NotFoundPage'
import './index.css'

const plannedRoutes = NAV_ITEMS.filter((item): item is PlannedNavItem => item.planned !== undefined).map((item) => ({
  path: item.to,
  element: <PlannedPage item={item} />,
}))

const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { path: '/', element: <DashboardPage /> },
      { path: '/more', element: <MorePage /> },
      ...plannedRoutes,
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
