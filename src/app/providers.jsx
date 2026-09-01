import { ThemeProvider } from '@core/theme';

/**
 * Global application providers.
 * Add cross-cutting providers here (e.g. state, i18n) as they are needed.
 */
export function Providers({ children }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
