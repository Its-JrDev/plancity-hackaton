import {
  AppProvider,
  AuthProvider,
  ErrorBoundary,
  FavoritesProvider,
} from '@/providers';
import { Toaster } from '@/components/molecules';
import { FormModalHost } from '@/components/organisms';
import { AppRoutes } from '@/router';

export default function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <FavoritesProvider>
          <ErrorBoundary>
            <FormModalHost>
              <AppRoutes />
              <Toaster position="top-right" richColors />
            </FormModalHost>
          </ErrorBoundary>
        </FavoritesProvider>
      </AuthProvider>
    </AppProvider>
  );
}
