import { CriticalAlert, Geolocation } from '../types';

/**
 * Mocks fetching real-time alerts. In a real app, this might call a public government API.
 * For simplicity and to avoid the complexity of handling a public, unauthenticated API,
 * we will simulate the service. It returns an empty array to indicate no active alerts.
 * @param location The user's current geographical coordinates.
 * @returns A promise that resolves to an empty array of critical alerts.
 */
export const fetchExternalAlerts = async (location: Geolocation): Promise<CriticalAlert[]> => {
  console.log(`Mocking external alert fetch for: ${location.latitude}, ${location.longitude}`);
  // Simulate a network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return []; // Return an empty array as if there are no alerts
};