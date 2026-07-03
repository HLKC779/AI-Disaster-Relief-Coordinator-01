import { Geolocation, DisasterType, HistoricalDataPoint, HistoricalDataType, PolygonGeometry, CircleGeometry } from '../types';
import { calculateDistance } from '../utils/geolocation';

// Data is hardcoded. A real app would fetch this from a GIS database or API.
const MOCKED_HISTORICAL_DATA: HistoricalDataPoint[] = [
  // California Wildfires
  {
    id: 'hist-wf-ca-2020',
    disasterType: DisasterType.WILDFIRE,
    dataType: HistoricalDataType.WILDFIRE_PERIMETER,
    date: '2020-08-18',
    description: 'August Complex Fire perimeter, Northern California.',
    geometry: {
      type: 'polygon',
      coordinates: [
        { latitude: 39.8, longitude: -122.8 },
        { latitude: 40.2, longitude: -122.7 },
        { latitude: 40.1, longitude: -122.3 },
        { latitude: 39.7, longitude: -122.4 },
      ]
    } as PolygonGeometry,
  },
  // Hurricane Katrina Flood Zone (simplified)
  {
    id: 'hist-fl-la-2005',
    disasterType: DisasterType.FLOOD,
    dataType: HistoricalDataType.FLOOD_ZONE,
    date: '2005-08-29',
    description: 'Approximate major flood zone from Hurricane Katrina, New Orleans.',
    geometry: {
      type: 'polygon',
      coordinates: [
        { latitude: 29.95, longitude: -90.07 },
        { latitude: 30.05, longitude: -90.07 },
        { latitude: 30.05, longitude: -89.97 },
        { latitude: 29.95, longitude: -89.97 },
      ]
    } as PolygonGeometry,
  },
  // Loma Prieta Earthquake
  {
    id: 'hist-eq-ca-1989',
    disasterType: DisasterType.EARTHQUAKE,
    dataType: HistoricalDataType.EARTHQUAKE_EPICENTER,
    date: '1989-10-17',
    description: 'Loma Prieta earthquake epicenter, magnitude 6.9.',
    geometry: {
      type: 'circle',
      center: { latitude: 37.04, longitude: -121.88 },
      radius_km: 25,
      magnitude: 6.9,
    } as CircleGeometry,
  },
   // Mississippi River Flood 2011
  {
    id: 'hist-fl-ms-2011',
    disasterType: DisasterType.FLOOD,
    dataType: HistoricalDataType.FLOOD_ZONE,
    date: '2011-05-10',
    description: 'Major flooding area of the Mississippi River near Vicksburg.',
    geometry: {
      type: 'polygon',
      coordinates: [
        { latitude: 32.35, longitude: -90.88 },
        { latitude: 32.55, longitude: -90.90 },
        { latitude: 32.53, longitude: -90.80 },
        { latitude: 32.33, longitude: -90.78 },
      ]
    } as PolygonGeometry,
  },
];

const DATA_RADIUS_KM = 300; // Fetch historical data within this radius of user

/**
 * Simulates fetching historical disaster data.
 * @param location The user's current geographical coordinates.
 * @param disasterType The type of disaster to fetch data for.
 * @returns A promise that resolves to an array of relevant historical data points.
 */
export const fetchHistoricalData = async (
  location: Geolocation,
  disasterType: DisasterType
): Promise<HistoricalDataPoint[]> => {
  console.log(`Simulating historical data fetch for ${disasterType} near Lat: ${location.latitude}, Lon: ${location.longitude}`);
  
  const relevantData = MOCKED_HISTORICAL_DATA.filter(data => {
    if (data.disasterType !== disasterType) {
      return false;
    }
    // Check distance from user to the center of the historical event
    let eventCenter: Geolocation;
    if (data.geometry.type === 'polygon') {
      // Approximate center of polygon
      const avgLat = data.geometry.coordinates.reduce((sum, p) => sum + p.latitude, 0) / data.geometry.coordinates.length;
      const avgLon = data.geometry.coordinates.reduce((sum, p) => sum + p.longitude, 0) / data.geometry.coordinates.length;
      eventCenter = { latitude: avgLat, longitude: avgLon };
    } else { // circle
      eventCenter = data.geometry.center;
    }
    const distance = calculateDistance(location, eventCenter);
    return distance <= DATA_RADIUS_KM;
  });

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 600));

  console.log(`Found ${relevantData.length} relevant historical data points.`);
  
  return relevantData;
};
