import ScrollToTop from './components/layout/ScrollToTop';
import ErrorBoundary from './components/layout/ErrorBoundary';
import AppRoutes from './router';

export default function App() {
  return (
    <ErrorBoundary>
      <ScrollToTop />
      <AppRoutes />
    </ErrorBoundary>
  );
}
