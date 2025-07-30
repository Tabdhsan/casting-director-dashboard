import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppLayout } from '@/components/layout';
import { Dashboard, Projects, ActorDatabase, Settings, RoleDetail, ActorProfile, NotFound } from '@/pages';
import { ROUTES } from '@/types/constants';
import { ErrorBoundary } from '@/components/ui/error-boundary';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path={ROUTES.PROJECTS} element={<Projects />} />
            <Route path={ROUTES.ACTORS} element={<ActorDatabase />} />
            <Route path={ROUTES.ACTOR_PROFILE} element={<ActorProfile />} />
            <Route path={ROUTES.ROLE_DETAIL} element={<RoleDetail />} />
            <Route path={ROUTES.SETTINGS} element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
