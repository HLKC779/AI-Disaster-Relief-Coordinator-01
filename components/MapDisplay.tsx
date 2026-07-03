
import React, { useEffect, useRef, useState } from 'react';
import { Geolocation, HotspotLocation, DisasterType, CustomGeofence, UserReport, HistoricalDataPoint, Language } from '../types';
import {
  getFloodIconSvg, getHurricaneIconSvg, getBlizzardIconSvg, getMudslideIconSvg,
  getWildfireIconSvg, getEarthquakeIconSvg, getTornadoIconSvg, getUserIconSvg, CrosshairsIcon,
  AlertIcon, PencilIcon, getPlusIconSvg, CameraIcon, getUserReportIconSvg, HistoricalDataIcon,
} from './Icons';
import { LoadingSpinner } from './LoadingSpinner';
import { translations } from '../utils/translations';

declare global {
  namespace google {
    namespace maps {
      type MapTypeStyle = any;
      type Map = any;
      type Marker = any;
      type Size = any;
      type Point = any;
      type Circle = any;
      type Polygon = any;
      type MapMouseEvent = any;
      // Fix: Add MapsEventListener to the global declaration
      type MapsEventListener = any;
      enum Animation {
        BOUNCE = 1
      }
    }
  }
  interface Window {
    google: any;
    gm_authFailure?: () => void;
  }
}

function isHotspot(feature: HotspotLocation | UserReport): feature is HotspotLocation {
  return (feature as HotspotLocation).priority !== undefined;
}

const getFeatureKey = (feature: HotspotLocation | UserReport): string => {
    if (isHotspot(feature)) {
        return `hotspot-${feature.latitude}-${feature.longitude}`;
    } else {
        return `report-${feature.location.latitude}-${feature.location.longitude}`;
    }
};

interface MapDisplayProps {
  location: Geolocation;
  hotspots: HotspotLocation[];
  userReports: UserReport[];
  selectedDisaster: DisasterType;
  customGeofence: CustomGeofence | null;
  onGeofenceSet: (geofence: CustomGeofence) => void;
  isDrawingGeofence: boolean;
  onToggleDrawing: (isDrawing: boolean) => void;
  isReportingMode: boolean;
  onToggleReporting: (isReporting: boolean) => void;
  onMapClickForReport: (coords: Geolocation) => void;
  onFeatureSelect: (feature: HotspotLocation | UserReport | null) => void;
  selectedFeature: HotspotLocation | UserReport | null;
  historicalData: HistoricalDataPoint[];
  showHistoricalData: boolean;
  onToggleHistoricalData: () => void;
  language: Language;
}

const disasterIconMap: Record<DisasterType, (color: string) => string> = {
  [DisasterType.FLOOD]: getFloodIconSvg,
  [DisasterType.HURRICANE]: getHurricaneIconSvg,
  [DisasterType.BLIZZARD]: getBlizzardIconSvg,
  [DisasterType.MUDSLIDE]: getMudslideIconSvg,
  [DisasterType.WILDFIRE]: getWildfireIconSvg,
  [DisasterType.EARTHQUAKE]: getEarthquakeIconSvg,
  [DisasterType.TORNADO]: getTornadoIconSvg,
};

const priorityColorMap = {
  High: '#f87171', // red-400
  Medium: '#fbbf24', // amber-400
  Low: '#4ade80', // green-400
};

const mapStyles: google.maps.MapTypeStyle[] = [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
    { featureType: "poi", stylers: [{ visibility: "off" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
    { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
    { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] },
    { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#746855" }] },
    { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#1f2835" }] },
    { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#f3d19c" }] },
    { featureType: "transit", stylers: [{ visibility: "off" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
    { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
    { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#17263c" }] },
];


let scriptPromise: Promise<void> | null = null;
const loadGoogleMapsScript = (apiKey: string): Promise<void> => {
  if (scriptPromise) {
    return scriptPromise;
  }
  scriptPromise = new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Google Maps script failed to load.'));
    document.head.appendChild(script);
  });
  return scriptPromise;
};


const MapDisplay: React.FC<MapDisplayProps> = ({ 
    location, hotspots, userReports, selectedDisaster, customGeofence, 
    onGeofenceSet, isDrawingGeofence, onToggleDrawing,
    isReportingMode, onToggleReporting, onMapClickForReport, onFeatureSelect,
    selectedFeature, historicalData, showHistoricalData, onToggleHistoricalData, language
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const featureMarkersRef = useRef<Map<string, google.maps.Marker>>(new Map());
  const userMarkerRef = useRef<google.maps.Marker | null>(null);
  const customMarkerRef = useRef<google.maps.Marker | null>(null);
  const customCircleRef = useRef<google.maps.Circle | null>(null);
  const historicalOverlaysRef = useRef<(google.maps.Polygon | google.maps.Circle)[]>([]);
  const [isMapReady, setIsMapReady] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapsApiKey] = useState<string | null>(process.env.API_KEY || null);
  const t = translations[language];

  useEffect(() => {
    if (!mapsApiKey) {
      setMapError("Google Maps API key is missing. Please ensure the API_KEY environment variable is set.");
    }
  }, [mapsApiKey]);

  useEffect(() => {
    const handleAuthFailure = () => {
      setMapError(
        "Google Maps authentication failed. This can be caused by an invalid API key, missing billing information on your Google account, or incorrect domain restrictions. Please check your Google Cloud Console for details."
      );
    };
    window.gm_authFailure = handleAuthFailure;

    return () => {
      delete window.gm_authFailure;
    };
  }, []);

  useEffect(() => {
    if (!mapsApiKey) return;

    loadGoogleMapsScript(mapsApiKey)
      .then(() => {
        if (!mapRef.current) return;
        
        if (!window.google || !window.google.maps) {
          setMapError("The Google Maps library did not load correctly. This might be a temporary network issue or a problem with the script itself.");
          return;
        }

        setMapError(null);
        
        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat: location.latitude, lng: location.longitude },
          zoom: 11,
          styles: mapStyles,
          disableDefaultUI: true,
          zoomControl: true,
        });

        mapInstanceRef.current = map;
        setIsMapReady(true);
      })
      .catch(error => {
          console.error(error);
          setMapError("Failed to load the Google Maps script. Please check your internet connection and ensure ad blockers are not interfering.");
      });
  }, [mapsApiKey, location]);

  useEffect(() => {
    if (!isMapReady || !mapInstanceRef.current) return;
    const map = mapInstanceRef.current;
    
    // Clear previous listener if any
    let clickListener: google.maps.MapsEventListener | null = null;

    if (isDrawingGeofence || isReportingMode) {
        // Temporarily disable map interactions when in drawing/reporting mode
        map.setOptions({ draggable: false, zoomControl: false, scrollwheel: false, disableDoubleClickZoom: true });
        clickListener = map.addListener('click', (e: google.maps.MapMouseEvent) => {
            if (isDrawingGeofence) {
                onGeofenceSet({
                    center: { latitude: e.latLng.lat(), longitude: e.latLng.lng() },
                    radius_km: 1.0, // Default radius, can be adjusted later
                });
                onToggleDrawing(false); // Exit drawing mode after setting center
            } else if (isReportingMode) {
                onMapClickForReport({ latitude: e.latLng.lat(), longitude: e.latLng.lng() });
            }
            // Re-enable map interactions after a click in drawing/reporting mode
            map.setOptions({ draggable: true, zoomControl: true, scrollwheel: true, disableDoubleClickZoom: false });
        });
    } else {
        // Restore normal map interactions and add a listener for feature deselection
        map.setOptions({ draggable: true, zoomControl: true, scrollwheel: true, disableDoubleClickZoom: false });
        clickListener = map.addListener('click', () => {
            onFeatureSelect(null); // Deselect feature if clicking on the map background
        });
    }
    
    return () => { 
        if (clickListener) {
            window.google.maps.event.removeListener(clickListener);
        }
    };
  }, [isMapReady, isDrawingGeofence, isReportingMode, onGeofenceSet, onToggleDrawing, onMapClickForReport, onFeatureSelect]);

  useEffect(() => {
    if (!isMapReady || !mapInstanceRef.current) return;
    let cursor = 'grab';
    if (isDrawingGeofence || isReportingMode) cursor = 'crosshair';
    mapInstanceRef.current.setOptions({ draggableCursor: cursor });
  }, [isMapReady, isDrawingGeofence, isReportingMode]);

  useEffect(() => {
    if (!isMapReady || !mapInstanceRef.current) return;
    if (!customGeofence) {
        customMarkerRef.current?.setMap(null);
        customCircleRef.current?.setMap(null);
        customMarkerRef.current = null;
        customCircleRef.current = null;
        return;
    }
    const position = { lat: customGeofence.center.latitude, lng: customGeofence.center.longitude };
    const customIconSvg = getPlusIconSvg('#81e6d9');
    
    // Check for Size and Point constructors before use
    const hasGoogleMapsIconConstructors = window.google.maps.Size && window.google.maps.Point;
    const iconConfig = hasGoogleMapsIconConstructors
        ? { url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(customIconSvg)}`, scaledSize: new window.google.maps.Size(32, 32), anchor: new window.google.maps.Point(16, 16) }
        : { url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(customIconSvg)}` };

    if (customMarkerRef.current) {
        customMarkerRef.current.setPosition(position);
    } else {
        customMarkerRef.current = new window.google.maps.Marker({ position, map: mapInstanceRef.current, title: 'Custom Geofence Center', icon: iconConfig, zIndex: 20 });
    }
    const circleOptions = { strokeColor: '#81e6d9', strokeOpacity: 0.8, strokeWeight: 2, fillColor: '#81e6d9', fillOpacity: 0.2, map: mapInstanceRef.current, center: position, radius: customGeofence.radius_km * 1000 };
    if (customCircleRef.current) {
        customCircleRef.current.setOptions(circleOptions);
    } else {
        customCircleRef.current = new window.google.maps.Circle(circleOptions);
    }
  }, [isMapReady, customGeofence]);

  useEffect(() => {
      if (!isMapReady || !mapInstanceRef.current) return;
      const map = mapInstanceRef.current;
      historicalOverlaysRef.current.forEach(overlay => overlay.setMap(null));
      historicalOverlaysRef.current = [];
      if (showHistoricalData && historicalData.length > 0) {
          const newOverlays: (google.maps.Polygon | google.maps.Circle)[] = [];
          historicalData.forEach(dataPoint => {
              const commonOptions = { strokeOpacity: 0.6, strokeWeight: 1.5, fillOpacity: 0.2, clickable: false, map };
              if (dataPoint.geometry.type === 'polygon') {
                  const polygon = new window.google.maps.Polygon({ ...commonOptions, paths: dataPoint.geometry.coordinates.map(c => ({ lat: c.latitude, lng: c.longitude })), strokeColor: '#FBBF24', fillColor: '#FBBF24' });
                  newOverlays.push(polygon);
              } else if (dataPoint.geometry.type === 'circle') {
                  const circle = new window.google.maps.Circle({ ...commonOptions, center: { lat: dataPoint.geometry.center.latitude, lng: dataPoint.geometry.center.longitude }, radius: dataPoint.geometry.radius_km * 1000, strokeColor: '#A78BFA', fillColor: '#A78BFA' });
                  newOverlays.push(circle);
              }
          });
          historicalOverlaysRef.current = newOverlays;
      }
  }, [isMapReady, showHistoricalData, historicalData]);

  useEffect(() => {
    if (!isMapReady || !mapInstanceRef.current) return;
    featureMarkersRef.current.forEach((marker) => { marker.setAnimation(null); marker.setOpacity(1.0); marker.setZIndex(undefined); });
    if (selectedFeature) {
        const key = getFeatureKey(selectedFeature);
        const selectedMarker = featureMarkersRef.current.get(key);
        if (selectedMarker) {
            mapInstanceRef.current.panTo(selectedMarker.getPosition()!);
            if (mapInstanceRef.current.getZoom() < 14) mapInstanceRef.current.setZoom(14);
            featureMarkersRef.current.forEach((marker, markerKey) => { if (markerKey !== key) marker.setOpacity(0.5); });
            selectedMarker.setAnimation(window.google.maps.Animation.BOUNCE);
            selectedMarker.setZIndex(99);
        }
    }
  }, [isMapReady, selectedFeature]);

  useEffect(() => {
    if (!isMapReady || !mapInstanceRef.current || mapError) return;
    featureMarkersRef.current.forEach(marker => marker.setMap(null));
    featureMarkersRef.current.clear();
    const map = mapInstanceRef.current;
    
    // Check for Size and Point constructors before use
    const hasGoogleMapsIconConstructors = window.google.maps.Size && window.google.maps.Point;

    const userIconSvg = getUserIconSvg('#60a5fa');
    const userPosition = { lat: location.latitude, lng: location.longitude };
    const userIconConfig = hasGoogleMapsIconConstructors
        ? { url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(userIconSvg)}`, scaledSize: new window.google.maps.Size(40, 40), anchor: new window.google.maps.Point(20, 20) }
        : { url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(userIconSvg)}` };

    if (userMarkerRef.current) {
      userMarkerRef.current.setPosition(userPosition);
    } else {
      userMarkerRef.current = new window.google.maps.Marker({ position: userPosition, map, title: 'Your Location', icon: userIconConfig, zIndex: 10 });
    }
    const allFeatures: (HotspotLocation | UserReport)[] = [...hotspots, ...userReports];
    const hotspotIconGenerator = disasterIconMap[selectedDisaster] || disasterIconMap[DisasterType.FLOOD];
    allFeatures.forEach(feature => {
        const key = getFeatureKey(feature);
        let markerOptions: any;
        if (isHotspot(feature)) {
            const color = priorityColorMap[feature.priority];
            const iconSvg = hotspotIconGenerator(color);
            const iconConfig = hasGoogleMapsIconConstructors
                ? { url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(iconSvg)}`, scaledSize: new window.google.maps.Size(36, 36), anchor: new window.google.maps.Point(18, 18) }
                : { url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(iconSvg)}` };
            markerOptions = { position: { lat: feature.latitude, lng: feature.longitude }, map, title: feature.description, icon: iconConfig };
        } else {
            const reportIconSvg = getUserReportIconSvg('#f6ad55', !!feature.photoBase64);
            const iconConfig = hasGoogleMapsIconConstructors
                ? { url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(reportIconSvg)}`, scaledSize: new window.google.maps.Size(32, 32), anchor: new window.google.maps.Point(16, 16) }
                : { url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(reportIconSvg)}` };
            markerOptions = { position: { lat: feature.location.latitude, lng: feature.location.longitude }, map, title: `User Report: ${feature.description}`, icon: iconConfig, zIndex: 15 };
        }
        const marker = new window.google.maps.Marker(markerOptions);
        marker.addListener('click', () => onFeatureSelect(feature));
        featureMarkersRef.current.set(key, marker);
    });
    if (selectedFeature) {
        const key = getFeatureKey(selectedFeature);
        const selectedMarker = featureMarkersRef.current.get(key);
        featureMarkersRef.current.forEach((marker, markerKey) => { if (markerKey !== key) marker.setOpacity(0.5); });
        if (selectedMarker) { selectedMarker.setAnimation(window.google.maps.Animation.BOUNCE); selectedMarker.setZIndex(99); }
    }
  }, [isMapReady, location, hotspots, userReports, selectedDisaster, mapError, onFeatureSelect, selectedFeature]);
  
  const handleCenterMap = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.panTo({ lat: location.latitude, lng: location.longitude });
      mapInstanceRef.current.setZoom(12);
    }
  };
  
  // Handlers for toggling modes, ensuring only one is active at a time
  const handleToggleReportingMode = () => {
    if (!isReportingMode) { // If activating reporting mode
      onToggleDrawing(false); // Deactivate drawing mode
    }
    onToggleReporting(!isReportingMode);
  }

  const handleToggleDrawingMode = () => {
    if (!isDrawingGeofence) { // If activating drawing mode
      onToggleReporting(false); // Deactivate reporting mode
    }
    onToggleDrawing(!isDrawingGeofence);
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-2xl shadow-2xl border border-gray-700">
      <h2 className="text-2xl font-bold mb-4 text-gray-300">{t.headers.situationalMap}</h2>
      {mapError ? (
        <div className="h-[400px] flex flex-col items-center justify-center bg-gray-900 rounded-lg p-4 text-center border border-red-700">
          <AlertIcon className="w-12 h-12 text-red-500 mb-4" />
          <p className="font-semibold text-red-300">Map Unavailable</p>
          <p className="text-sm text-red-400 mt-2 max-w-md">{mapError}</p>
        </div>
      ) : !isMapReady ? (
        <div className="h-[400px] flex flex-col items-center justify-center bg-gray-900 rounded-lg">
          <LoadingSpinner />
          <p className="mt-4 text-gray-400">Loading Map...</p>
        </div>
      ) : (
        <div className="relative">
          <div ref={mapRef} style={{ width: '100%', height: '400px' }} className="rounded-lg bg-gray-900" />
          {(isDrawingGeofence || isReportingMode) && (<div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xl font-bold pointer-events-none rounded-lg">{isDrawingGeofence ? t.map.clickGeofence : t.map.clickReport}</div>)}
          <div className="absolute top-3 right-3 flex flex-col space-y-2">
            <button onClick={handleCenterMap} className="bg-gray-800/80 hover:bg-gray-700 text-white p-2 rounded-full shadow-lg transition-colors duration-200" aria-label="Center map on your location" title="Center map on your location"><CrosshairsIcon /></button>
            <button onClick={handleToggleDrawingMode} className={`flex items-center space-x-2 text-white p-2 rounded-full shadow-lg transition-colors duration-200 ${isDrawingGeofence ? 'bg-blue-600/80 hover:bg-blue-500' : 'bg-gray-800/80 hover:bg-gray-700'}`} aria-label={isDrawingGeofence ? t.buttons.cancelDraw : t.buttons.drawGeofence} title={isDrawingGeofence ? t.buttons.cancelDraw : t.buttons.drawGeofence}><PencilIcon /></button>
            <button onClick={handleToggleReportingMode} className={`flex items-center space-x-2 text-white p-2 rounded-full shadow-lg transition-colors duration-200 ${isReportingMode ? 'bg-blue-600/80 hover:bg-blue-500' : 'bg-gray-800/80 hover:bg-gray-700'}`} aria-label={isReportingMode ? t.buttons.cancelReport : t.buttons.activateReport} title={isReportingMode ? t.buttons.cancelReport : t.buttons.activateReport}><CameraIcon /></button>
            <button onClick={onToggleHistoricalData} className={`flex items-center space-x-2 text-white p-2 rounded-full shadow-lg transition-colors duration-200 ${showHistoricalData ? 'bg-blue-600/80 hover:bg-blue-500' : 'bg-gray-800/80 hover:bg-gray-700'}`} aria-label={showHistoricalData ? t.buttons.hideHistorical : t.buttons.showHistorical} title={showHistoricalData ? t.buttons.hideHistorical : t.buttons.showHistorical}><HistoricalDataIcon /></button>
          </div>
        </div>
      )}
      <div className="flex flex-col items-center space-y-2 mt-4 text-sm text-gray-400">
        <div className="flex justify-center items-center flex-wrap gap-x-4 gap-y-2">
           {!mapError && (hotspots.length > 0 || userReports.length > 0) && <span>{t.map.clickToView}</span>}
        </div>
        {showHistoricalData && !mapError && (
            <div className="flex items-center space-x-4 pt-2">
                <span className="font-semibold">{t.map.legend}:</span>
                <div className="flex items-center space-x-1"><div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgba(251, 191, 36, 0.3)', border: '1px solid #FBBF24' }}></div><span>{t.map.pastPerimeters}</span></div>
                <div className="flex items-center space-x-1"><div className="w-4 h-4 rounded-full" style={{ backgroundColor: 'rgba(167, 139, 250, 0.3)', border: '1px solid #A78BFA' }}></div><span>{t.map.pastEpicenters}</span></div>
            </div>
        )}
      </div>
    </div>
  );
};

export default MapDisplay;
