
export type Language = 'en' | 'vi';

export enum DisasterType {
  FLOOD = 'Flood',
  HURRICANE = 'Hurricane',
  BLIZZARD = 'Blizzard',
  MUDSLIDE = 'Mudslide',
  WILDFIRE = 'Wildfire',
  EARTHQUAKE = 'Earthquake',
  TORNADO = 'Tornado',
}

export enum AgentType {
  GENERAL_ANALYSIS = 'General Analysis',
  LOGISTICS_PLANNING = 'Logistics Planning',
  DAMAGE_ASSESSMENT = 'Damage Assessment',
  PUBLIC_COMMUNICATIONS = 'Public Communications',
  SOCIAL_MEDIA_ANALYSIS = 'Social Media Analyst',
}

export enum HistoricalDataType {
  FLOOD_ZONE = 'Flood Zone',
  WILDFIRE_PERIMETER = 'Wildfire Perimeter',
  EARTHQUAKE_EPICENTER = 'Earthquake Epicenter',
}

export type PolygonGeometry = {
  type: 'polygon';
  coordinates: Geolocation[];
};

export type CircleGeometry = {
  type: 'circle';
  center: Geolocation;
  radius_km: number;
  magnitude?: number; // Optional, for earthquakes
};

export interface HistoricalDataPoint {
  id: string;
  disasterType: DisasterType;
  dataType: HistoricalDataType;
  geometry: PolygonGeometry | CircleGeometry;
  description: string;
  date: string; // e.g., "YYYY-MM-DD"
}

export interface Geolocation {
  latitude: number;
  longitude: number;
}

export interface WeatherData {
  temperature_celsius: number;
  wind_speed_kph: number;
  precipitation_mm_per_hr: number;
  description: string;
}

export interface HotspotLocation {
  latitude: number;
  longitude: number;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  radius_km: number;
}

export interface UserReport {
  location: Geolocation;
  description: string;
  photoBase64: string | null;
  photoMimeType: string | null;
}

export interface ActionItem {
  action: string;
  rationale: string;
}

export interface AidSuggestion {
  suggestion: string;
  rationale: string;
}

export interface CustomGeofence {
  center: Geolocation;
  radius_km: number;
}

export interface CriticalAlert {
  id: string;
  message: string;
  severity: 'info' | 'warning' | 'danger';
  link?: {
    url: string;
    text: string;
  };
}

export interface ModelConfig {
  temperature: number;
  topK: number;
  topP: number;
}

export interface AlertThresholds {
  geofenceRadiusMultiplier: number;
  highTempWarning: number;
  lowTempWarning: number;
}

export interface ReliefData {
  summary: string;
  prioritized_locations: HotspotLocation[];
  recommended_actions: ActionItem[];
  cost_responsive_aid: AidSuggestion[];
  historical_context: string;
  grounding_chunks: GroundingChunk[];
  weather_info?: WeatherData;
}

export interface GroundingChunk {
  maps?: {
    uri?: string;
    title?: string;
    placeAnswerSources?: {
      reviewSnippets?: {
        uri?: string;
        title?: string;
      }[];
    };
  };
  web?: {
    uri?: string;
    title?: string;
  };
}

// New interfaces for sentiment analysis
export interface KeyQuote {
  quote: string;
  sentiment: 'Positive' | 'Negative' | 'Neutral';
}

export interface SentimentAnalysis {
  overall_sentiment: 'Positive' | 'Negative' | 'Neutral' | 'Mixed';
  sentiment_score: number;
  summary: string;
  positive_themes: string[];
  negative_themes: string[];
  key_quotes: KeyQuote[];
}


// For Social Media Analyst Agent
export interface RecommendationItem {
  title: string;
  location: string;
  emergency: string;
  estimated_affected: string;
  accessibility: string;
  recommended_actions: string[];
}

export interface SocialMediaAnalysisData {
  analysis: string;
  priority_recommendations: RecommendationItem[];
  resource_allocation: string;
  sentiment_analysis: SentimentAnalysis;
}

export interface NewsArticle {
  id: string;
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  summary: string;
}
