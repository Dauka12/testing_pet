// Re-export the main routes component
export { default as OlympiadRoutes } from './OlympiadRoutes';

// Re-export page components
export { default as OlympiadDashboard } from './pages/Dashboard';
export { default as OlympiadLandingPage } from './pages/LandingPage';
export { default as OlympiadLogin } from './pages/Login';
export { default as OlympiadManager } from './pages/OlympiadManager';
export { default as OlympiadRegistration } from './pages/Registration';
export { default as TestResults } from './pages/TestResults';
export { default as TestSession } from './pages/TestSession';
export { default as TestsList } from './pages/TestsList';

// Re-export context providers and hooks
export { OlympiadAuthProvider, useAuth } from './context/OlympiadAuthContext';

// Re-export hooks
export { default as useExamManager } from './hooks/useExamManager';
export { default as useTestSessionManager } from './hooks/useTestSessionManager';

// Re-export types
export type { AuthUser } from './types/auth';
export type { Student } from './types/student';
export type { StudentExamSessionRequest, StudentExamSessionResponse } from './types/testSession';

// Export constants
export const OLYMPIAD_ROUTES = {
  ROOT: '/olympiad',
  LOGIN: '/olympiad/login',
  REGISTRATION: '/olympiad/registration',
  DASHBOARD: '/olympiad/dashboard',
  MANAGER: '/olympiad/manager',
  TESTS: '/olympiad/tests',
  TEST: '/olympiad/test',
  TEST_RESULTS: '/olympiad/test-results',
};