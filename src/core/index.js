/**
 * Application shell and foundation.
 * Common layout, theme, navigation framework, and permission-aware UI base.
 * Must NOT contain business-specific screens or components.
 */

export { AppLayout, WorkspaceShell } from './layout';
export { ThemeProvider, useTheme } from './theme';
export { NavigationShell } from './navigation';
