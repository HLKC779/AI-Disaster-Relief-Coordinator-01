import React from 'react';
import { ReliefData, AlertThresholds, CustomGeofence, AgentType, Language } from '../types';
import { BulletListIcon, MapPinIcon, SourceIcon, MoneyIcon, AlertIcon, HistoryIcon, TemperatureIcon, WindIcon, PrecipitationIcon } from './Icons';
import { translations } from '../utils/translations';

interface ResultsDisplayProps {
  data: ReliefData;
  alertThresholds: AlertThresholds;
  customGeofence: CustomGeofence | null;
  selectedAgent: AgentType;
  userReportsCount: number;
  language: Language;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ data, alertThresholds, customGeofence, selectedAgent, userReportsCount, language }) => {
  const t = translations[language];
  
  if (!data) return null;

  // Ensure arrays exist to prevent crashes if API returns incomplete data
  // Using Array.isArray check for extra safety against malformed JSON responses
  const prioritizedLocations = Array.isArray(data.prioritized_locations) ? data.prioritized_locations : [];
  const recommendedActions = Array.isArray(data.recommended_actions) ? data.recommended_actions : [];
  const costResponsiveAid = Array.isArray(data.cost_responsive_aid) ? data.cost_responsive_aid : [];
  const groundingChunks = Array.isArray(data.grounding_chunks) ? data.grounding_chunks : [];

  const isGeofenceActive = customGeofence || prioritizedLocations.length > 0;

  return (
    <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar">
      {userReportsCount > 0 && (
         <div className="p-3 bg-indigo-900/50 border border-indigo-700 rounded-lg text-center">
            <p className="text-sm text-indigo-300">
                {language === 'vi' 
                    ? `Phân tích kết hợp ${userReportsCount} báo cáo hiện trường thực tế.` 
                    : `Analysis incorporates ${userReportsCount} real-time field report(s).`}
            </p>
         </div>
      )}

      {isGeofenceActive && (
        <div className="p-3 bg-blue-900/50 border border-blue-700 rounded-lg text-center flex items-center justify-center space-x-2">
            <AlertIcon className="w-6 h-6 text-blue-300" />
            <div>
              <h4 className="font-bold text-blue-300">
                {customGeofence 
                    ? (language === 'vi' ? 'Hàng Rào Địa Lý Tùy Chỉnh Đang Bật' : 'Custom Geo-Fence Active') 
                    : (language === 'vi' ? 'Hàng Rào Địa Lý AI Đang Bật' : 'AI Geo-Fencing Active')}
              </h4>
              <p className="text-sm text-blue-400">
                {language === 'vi' ? 'Bạn sẽ được cảnh báo nếu ra/vào khu vực giám sát.' : 'You will be alerted if you enter or exit the monitored zones.'}
              </p>
            </div>
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold text-gray-300 mb-2">{t.labels.summary}</h3>
        <p className="text-gray-400 bg-gray-900/50 p-3 rounded-lg">{data.summary}</p>
      </div>

      {data.weather_info && (
        <div>
          <h3 className="text-lg font-semibold text-gray-300 mb-2">{t.labels.weather}</h3>
          <div className="bg-gray-900/50 p-3 rounded-lg flex justify-around items-center text-center">
            <div className="flex flex-col items-center" title="Temperature">
              <TemperatureIcon />
              <span className="mt-1 font-bold">{data.weather_info.temperature_celsius.toFixed(1)}°C</span>
            </div>
            <div className="flex flex-col items-center" title="Wind Speed">
              <WindIcon />
              <span className="mt-1 font-bold">{data.weather_info.wind_speed_kph.toFixed(1)} kph</span>
            </div>
            <div className="flex flex-col items-center" title="Precipitation">
              <PrecipitationIcon />
              <span className="mt-1 font-bold">{data.weather_info.precipitation_mm_per_hr.toFixed(1)} mm/hr</span>
            </div>
            <div className="flex flex-col items-center">
                <span className="text-gray-400 text-sm">{t.labels.condition}</span>
                <span className="font-bold">{data.weather_info.description}</span>
            </div>
          </div>
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold text-gray-300 mb-2 flex items-center"><MapPinIcon />{t.results.locations}</h3>
        {prioritizedLocations.length > 0 ? (
            <ul className="space-y-3">
            {prioritizedLocations.map((loc, index) => (
                <li key={index} className="bg-gray-900/50 p-3 rounded-lg border-l-4"
                style={{ borderColor: loc.priority === 'High' ? '#f87171' : loc.priority === 'Medium' ? '#fbbf24' : '#4ade80' }}>
                <div className="flex justify-between items-start mb-1">
                    <p className="text-gray-200 pr-2">{loc.description}</p>
                    <span className={`flex-shrink-0 text-xs font-bold px-2 py-1 rounded-full ${
                        loc.priority === 'High' ? 'bg-red-500/30 text-red-300' :
                        loc.priority === 'Medium' ? 'bg-yellow-500/30 text-yellow-300' :
                        'bg-green-500/30 text-green-300'
                    }`}>{loc.priority}</span>
                </div>
                <p className="text-sm text-gray-500">
                    {t.labels.lat}: {loc.latitude.toFixed(4)}, {t.labels.lon}: {loc.longitude.toFixed(4)} | 
                    {t.labels.radius}: {(loc.radius_km * alertThresholds.geofenceRadiusMultiplier).toFixed(1)} km 
                    <span className="text-gray-600"> (AI: {loc.radius_km} km)</span>
                </p>
                </li>
            ))}
            </ul>
        ) : (
            <p className="text-gray-500 text-sm italic">No prioritized locations identified.</p>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-300 mb-2 flex items-center"><BulletListIcon />{t.results.actions}</h3>
        <ul className="space-y-2">
          {recommendedActions.map((item, index) => (
            <li key={index} className="text-gray-400">
              <span>{item.action}</span>
              <p className="text-sm text-gray-500 pl-4 italic border-l-2 border-gray-700 ml-1 mt-1">
                {item.rationale}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-300 mb-2 flex items-center"><MoneyIcon />{t.results.aid}</h3>
        <ul className="space-y-2">
          {costResponsiveAid.map((item, index) => (
            <li key={index} className="text-gray-400">
              <span>{item.suggestion}</span>
              <p className="text-sm text-gray-500 pl-4 italic border-l-2 border-gray-700 ml-1 mt-1">
                {item.rationale}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {data.historical_context && (
        <div>
          <h3 className="text-lg font-semibold text-gray-300 mb-2 flex items-center"><HistoryIcon />{t.labels.historicalContext}</h3>
          <p className="text-gray-400 bg-gray-900/50 p-3 rounded-lg">{data.historical_context}</p>
        </div>
      )}

      {groundingChunks && groundingChunks.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-300 mb-2 flex items-center"><SourceIcon />{t.labels.dataSources}</h3>
          <ul className="space-y-1 text-sm list-disc list-inside">
            {groundingChunks.flatMap((chunk, index) => {
              const links = [];
              if (chunk.web?.uri) {
                links.push(
                  <li key={`web-${index}`}>
                    <a href={chunk.web.uri} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline break-all">
                      {chunk.web.title || chunk.web.uri} (Web)
                    </a>
                  </li>
                );
              }
              if (chunk.maps) {
                if (chunk.maps.uri) {
                  links.push(
                    <li key={`maps-main-${index}`}>
                      <a href={chunk.maps.uri} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline break-all">
                        {chunk.maps.title || chunk.maps.uri} (Map)
                      </a>
                    </li>
                  );
                }
                // Fix: Correctly access reviewSnippets from the placeAnswerSources object
                chunk.maps.placeAnswerSources?.reviewSnippets?.forEach((snippet, sIndex) => {
                  if (snippet.uri) {
                    links.push(
                      <li key={`maps-snippet-${index}-${sIndex}`} className="ml-4">
                        <a href={snippet.uri} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline break-all">
                          {snippet.title || snippet.uri} (Review Snippet)
                        </a>
                      </li>
                    );
                  }
                });
              }
              return links;
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ResultsDisplay;