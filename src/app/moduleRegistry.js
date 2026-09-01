import { getActiveBusinessType } from './config/app.config.js';
import { retailModule } from '@modules/retail';

/**
 * Registry of business modules.
 * Only active modules contribute routes and navigation.
 */
const moduleRegistry = {
  retail: retailModule,
  // restaurant: restaurantModule,
  // pharmacy: pharmacyModule,
  // services: servicesModule,
  // wholesale: wholesaleModule,
};

export function getRegisteredModules() {
  return moduleRegistry;
}

export function getActiveModule() {
  const businessType = getActiveBusinessType();
  return moduleRegistry[businessType] ?? null;
}

export function getActiveModuleRoutes() {
  const activeModule = getActiveModule();
  return activeModule?.routes ?? [];
}

export function getActiveModuleNavigation() {
  const activeModule = getActiveModule();
  return activeModule?.navigation ?? [];
}
