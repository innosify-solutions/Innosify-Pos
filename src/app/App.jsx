import { Providers } from './providers.jsx';
import { AppRouter } from './router.jsx';

export function App() {
  return (
    <Providers>
      <AppRouter />
    </Providers>
  );
}
