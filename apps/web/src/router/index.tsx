import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { HomePage } from '@/pages/Home';
import { LoginPage } from '@/pages/Login';
import { RegisterPage } from '@/pages/Register';
import { EventsPage, EventDetailPage } from '@/pages/Events';
import { CategoriesPage, CategoryDetailPage } from '@/pages/Categories';
import { FavoritesPage } from '@/pages/Favorites';
import { ForbiddenPage } from '@/pages/Forbidden';
import { AuthGuard, GuestGuard, RoleGuard } from './guards';
import { NotFoundTemplate } from '@/components/templates';

const router = createBrowserRouter([
  // Rutas públicas: únicas accesibles sin sesión y fuera del shell.
  {
    path: '/login',
    element: (
      <GuestGuard>
        <LoginPage />
      </GuestGuard>
    ),
  },
  {
    path: '/register',
    element: (
      <GuestGuard>
        <RegisterPage />
      </GuestGuard>
    ),
  },
  {
    path: '/forbidden',
    element: (
      <AuthGuard>
        <ForbiddenPage />
      </AuthGuard>
    ),
  },
  // El catálogo es público; el shell adapta su navegación según la sesión.
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },

      { path: 'events', element: <EventsPage /> },
      { path: 'events/:id', element: <EventDetailPage /> },
      {
        path: 'events/new',
        element: (
          <RoleGuard roles={['admin']}>
            <EventsPage />
          </RoleGuard>
        ),
      },
      {
        path: 'events/:id/edit',
        element: (
          <RoleGuard roles={['admin']}>
            <EventDetailPage />
          </RoleGuard>
        ),
      },

      { path: 'categories', element: <CategoriesPage /> },
      { path: 'categories/:id', element: <CategoryDetailPage /> },
      {
        path: 'categories/new',
        element: (
          <RoleGuard roles={['admin']}>
            <CategoriesPage />
          </RoleGuard>
        ),
      },
      {
        path: 'categories/:id/edit',
        element: (
          <RoleGuard roles={['admin']}>
            <CategoryDetailPage />
          </RoleGuard>
        ),
      },

      {
        path: 'favorites',
        element: (
          <AuthGuard>
            <FavoritesPage />
          </AuthGuard>
        ),
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundTemplate />,
  },
]);

export function AppRoutes() {
  return <RouterProvider router={router} />;
}
