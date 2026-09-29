import { AppShell } from '@/components/templates';
import { Outlet, useLocation } from 'react-router-dom';

export function MainLayout() {
  const { pathname } = useLocation();

  return (
    <AppShell>
      <div
        key={pathname}
        className="animate-in fade-in slide-in-from-bottom-2 duration-200 ease-out motion-reduce:animate-none"
      >
        <Outlet />
      </div>
    </AppShell>
  );
}
