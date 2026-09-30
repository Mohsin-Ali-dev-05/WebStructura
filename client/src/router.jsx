import { createBrowserRouter, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import MainLayout from './layouts/MainLayout.jsx';
import AboutPage from './pages/AboutPage.jsx';
import BuilderPage from './pages/BuilderPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import PreviewPage from './pages/PreviewPage.jsx';
import PrivacyPage from './pages/PrivacyPage.jsx';
import ProjectFormPage from './pages/ProjectFormPage.jsx';
import PublicView from './pages/PublicView.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import SettingsLayout from './layouts/SettingsLayout.jsx';
import AccountSettingsPage from './pages/settings/AccountSettingsPage.jsx';
import AppearanceSettingsPage from './pages/settings/AppearanceSettingsPage.jsx';
import BillingSettingsPage from './pages/settings/BillingSettingsPage.jsx';
import NotificationsSettingsPage from './pages/settings/NotificationsSettingsPage.jsx';
import ProfileSettingsPage from './pages/settings/ProfileSettingsPage.jsx';
import SecuritySettingsPage from './pages/settings/SecuritySettingsPage.jsx';
import TemplateGallery from './pages/TemplateGallery.jsx';
import TermsPage from './pages/TermsPage.jsx';

function Protected({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

/**
 * Data router enables useBlocker for the unsaved-changes guard.
 * /view/:id is outside MainLayout so public shares have no app chrome.
 */
export const router = createBrowserRouter([
  {
    path: '/view/:id',
    element: <PublicView />,
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'privacy', element: <PrivacyPage /> },
      { path: 'terms', element: <TermsPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
      { path: 'reset-password/:token', element: <ResetPassword /> },
      {
        path: 'dashboard',
        element: (
          <Protected>
            <DashboardPage />
          </Protected>
        ),
      },
      {
        path: 'settings',
        element: (
          <Protected>
            <SettingsLayout />
          </Protected>
        ),
        children: [
          { index: true, element: <Navigate to="profile" replace /> },
          { path: 'profile', element: <ProfileSettingsPage /> },
          { path: 'account', element: <AccountSettingsPage /> },
          { path: 'security', element: <SecuritySettingsPage /> },
          { path: 'appearance', element: <AppearanceSettingsPage /> },
          { path: 'notifications', element: <NotificationsSettingsPage /> },
          { path: 'billing', element: <BillingSettingsPage /> },
        ],
      },
      {
        path: 'templates',
        element: (
          <Protected>
            <TemplateGallery />
          </Protected>
        ),
      },
      {
        path: 'projects/new',
        element: (
          <Protected>
            <ProjectFormPage />
          </Protected>
        ),
      },
      {
        path: 'projects/:id/edit',
        element: (
          <Protected>
            <ProjectFormPage />
          </Protected>
        ),
      },
      {
        path: 'projects/:id/builder',
        element: (
          <Protected>
            <BuilderPage />
          </Protected>
        ),
      },
      {
        path: 'projects/:id/preview',
        element: (
          <Protected>
            <PreviewPage />
          </Protected>
        ),
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
