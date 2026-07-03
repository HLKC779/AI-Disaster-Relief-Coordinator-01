
import { Geolocation } from '../types';

/**
 * Calculates the distance between two geographical points using the Haversine formula.
 * @param point1 - The first location with latitude and longitude.
 * @param point2 - The second location with latitude and longitude.
 * @returns The distance between the two points in kilometers.
 */
export function calculateDistance(point1: Geolocation, point2: Geolocation): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = (point2.latitude - point1.latitude) * (Math.PI / 180);
  const dLon = (point2.longitude - point1.longitude) * (Math.PI / 180);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(point1.latitude * (Math.PI / 180)) *
      Math.cos(point2.latitude * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
      
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
}
