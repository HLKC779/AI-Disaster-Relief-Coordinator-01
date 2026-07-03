import React, { useState, useEffect, useRef } from 'react';
import { DisasterType, Geolocation, ReliefData, CriticalAlert, ModelConfig, AlertThresholds, AgentType, UserReport, SocialMediaAnalysisData, Language } from './types';
import { fetchReliefData, fetchSocialMediaAnalysis } from './services/geminiService';
import { fetchWeatherData } from './services/weatherService';
import { fetchExternalAlerts } from './services/alertService';
import { fetchReports } from './services/reportService';
import { calculateDistance } from './utils/geolocation';
import { translations } from './utils/translations';

import DisasterSelector from './components/DisasterSelector';
import AgentSelector from './components/AgentSelector';
import ResultsDisplay from './components/ResultsDisplay';
import SocialMediaAnalysisResults from './components/SocialMediaAnalysisResults';
import Notification from './components/Notification';
import CriticalAlertBanner from './components/CriticalAlertBanner';
import { LoadingSpinner } from './components/LoadingSpinner';
import { LocationIcon, SearchIcon, AlertIcon, RefreshIcon, NewspaperIcon } from './components/Icons';
import ErrorBoundary from './components/ErrorBoundary';

const App: React.FC = () => {
  // App State
  const [location, setLocation] = useState<Geolocation | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [selectedDisaster, setSelectedDisaster] = useState<DisasterType>(DisasterType.FLOOD);
  const [selectedAgent, setSelectedAgent] = useState<AgentType>(AgentType.GENERAL_ANALYSIS);
  const [customQuery, setCustomQuery] = useState<string>('');
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isRefreshingLocation, setIsRefreshingLocation] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [reliefData, setReliefData] = useState<ReliefData | null>(null);
  const [geofenceAlert, setGeofenceAlert] = useState<string | null>(null);
  
  const [criticalAlerts, setCriticalAlerts] = useState<CriticalAlert[]>(() => {
    try {
        const item = localStorage.getItem('criticalAlerts');
        return item ? JSON.parse(item) : [];
    } catch (error) {
        console.error('Failed to parse criticalAlerts from localStorage', error);
        return [];
    }
  });
  const [dismissedAlertIds, setDismissedAlertIds] = useState<string[]>(() => {
    try {
        const item = localStorage.getItem('dismissedAlerts');
        return item ? JSON.parse(item) : [];
    } catch (error) {
        console.error('Failed to parse dismissedAlerts from localStorage', error);
        return [];
    }
  });

  const [userReports, setUserReports] = useState<UserReport[]>([]);

  const [modelConfig, setModelConfig] = useState<ModelConfig>({
    temperature: 0.2,
    topP: 0.95,
    topK: 40,
  });
  const [alertThresholds, setAlertThresholds] = useState<AlertThresholds>({
    geofenceRadiusMultiplier: 1.0,
    highTempWarning: 35,
    lowTempWarning: -5,
  });
  
  const [language, setLanguage] = useState<Language>('en');

  // State for Social Media Analyst
  const [socialMediaInput, setSocialMediaInput] = useState<string>('');
  const [locationInput, setLocationInput] = useState<string>('');
  const [socialMediaAnalysisResult, setSocialMediaAnalysisResult] = useState<SocialMediaAnalysisData | null>(null);

  const wasInsideGeofence = useRef<boolean>(false);
  const alertsFetchedRef = useRef<boolean>(false);
  
  const t = translations[language];

  useEffect(() => {
    fetchReports()
      .then(setUserReports)
      .catch(error => {
        console.error("Failed to fetch user reports:", error);
      });
  }, []);

  useEffect(() => {
    setLocationError(null);
    let isMounted = true;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        if (isMounted) {
          const newLocation = { latitude: position.coords.latitude, longitude: position.coords.longitude };
          setLocation(newLocation);
          setIsInitializing(false);
          setLocationError(null);

          if (!alertsFetchedRef.current) {
            alertsFetchedRef.current = true;
            fetchExternalAlerts(newLocation).then(externalAlerts => {
              if (isMounted) {
                setCriticalAlerts(currentAlerts => {
                  const currentIds = new Set(currentAlerts.map(a => a.id));
                  const newUniqueAlerts = externalAlerts.filter(a => !currentIds.has(a.id));
                  return [...currentAlerts, ...newUniqueAlerts];
                });
              }
            });
          }
        }
      },
      (error) => {
        if (isMounted) {
          setLocationError(`Error getting location: ${error.message}. Please enable location services.`);
          setIsInitializing(false);
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );

    return () => { isMounted = false; navigator.geolocation.clearWatch(watchId); };
  }, []);

  // Simplified Geofence Logic
  useEffect(() => {
    if (!location) return;
    let isCurrentlyInside = false;
    let insideZoneDescription = '';
    
    if (reliefData?.prioritized_locations?.length > 0) {
      for (const hotspot of reliefData.prioritized_locations) {
        const effectiveRadius = hotspot.radius_km * alertThresholds.geofenceRadiusMultiplier;
        const distance = calculateDistance(location, hotspot);
        if (distance <= effectiveRadius) {
          isCurrentlyInside = true;
          insideZoneDescription = `${language === 'vi' ? 'khu vực rủi ro cao' : 'high-risk zone'}: ${hotspot.description}`;
          break;
        }
      }
    } else { return; }
    
    const alertEnter = language === 'vi' ? 'CẢNH BÁO: Bạn đang tiến vào ' : 'ALERT: You are entering ';
    const alertExit = language === 'vi' ? 'Bạn đã rời khỏi khu vực được giám sát.' : 'You have now exited the monitored zone.';
    
    if (isCurrentlyInside && !wasInsideGeofence.current) setGeofenceAlert(`${alertEnter}${insideZoneDescription}.`);
    else if (!isCurrentlyInside && wasInsideGeofence.current) setGeofenceAlert(alertExit);
    wasInsideGeofence.current = isCurrentlyInside;
  }, [location, reliefData, alertThresholds.geofenceRadiusMultiplier, language]);

  useEffect(() => {
    if (!reliefData?.weather_info) return;
    const temp = reliefData.weather_info.temperature_celsius;
    const newWeatherAlerts: CriticalAlert[] = [];
    if (temp >= alertThresholds.highTempWarning) newWeatherAlerts.push({ id: 'weather-alert-high-temp', message: `High Temperature Warning: Current temperature is ${temp.toFixed(1)}°C, exceeding the ${alertThresholds.highTempWarning}°C threshold.`, severity: 'warning', link: { url: '#', text: 'Heat Safety Tips' } });
    if (temp <= alertThresholds.lowTempWarning) newWeatherAlerts.push({ id: 'weather-alert-low-temp', message: `Low Temperature Warning: Current temperature is ${temp.toFixed(1)}°C, below the ${alertThresholds.lowTempWarning}°C threshold.`, severity: 'warning', link: { url: '#', text: 'Cold Safety Tips' } });
    setCriticalAlerts(currentAlerts => [...currentAlerts.filter(a => !a.id.startsWith('weather-alert-')), ...newWeatherAlerts]);
  }, [reliefData, alertThresholds]);

  const activeAlerts = React.useMemo(() => {
    return criticalAlerts.filter(alert => !dismissedAlertIds.includes(alert.id));
  }, [criticalAlerts, dismissedAlertIds]);

  const handleSearch = async () => {
    setIsSearching(true);
    setApiError(null);
    setReliefData(null);
    setSocialMediaAnalysisResult(null);

    if (selectedAgent === AgentType.SOCIAL_MEDIA_ANALYSIS) {
        if (!socialMediaInput.trim() || !locationInput.trim()) {
            setApiError(language === 'vi' ? 'Dữ liệu mạng xã hội và vị trí không được để trống.' : 'Social media data and location data cannot be empty for this agent.');
            setIsSearching(false);
            return;
        }
        try {
            const data = await fetchSocialMediaAnalysis(socialMediaInput, locationInput, selectedDisaster, modelConfig, language);
            setSocialMediaAnalysisResult(data);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
            setApiError(`Failed to fetch social media analysis. ${errorMessage} Please try again later.`);
        } finally {
            setIsSearching(false);
        }
    } else {
        if (!location) {
          setApiError(language === 'vi' ? 'Không có thông tin vị trí. Vui lòng cấp quyền truy cập vị trí.' : 'Current location is not available. Please allow location access and try again.');
          setIsSearching(false);
          return;
        }
        try {
          const weatherData = await fetchWeatherData(location);
          const data = await fetchReliefData(location, selectedDisaster, selectedAgent, customQuery, weatherData, modelConfig, activeAlerts, alertThresholds, userReports, language);
          setReliefData(data);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
          setApiError(`Failed to fetch disaster relief data. ${errorMessage} Please try again later.`);
        } finally {
          setIsSearching(false);
        }
    }
  };

  const handleRefreshLocation = () => {
    setIsRefreshingLocation(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude });
        setIsRefreshingLocation(false);
        alertsFetchedRef.current = false;
      },
      (error) => {
        setLocationError(`Error getting location: ${error.message}.`);
        setIsRefreshingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };
  
  const handleDismissAlert = (id: string) => {
    const newDismissed = [...dismissedAlertIds, id];
    setDismissedAlertIds(newDismissed);
    localStorage.setItem('dismissedAlerts', JSON.stringify(newDismissed));
  };
  
  const handleSelectAgent = (agent: AgentType) => {
    if (agent !== selectedAgent) {
      setApiError(null);
      setReliefData(null);
      setSocialMediaAnalysisResult(null);
    }
    setSelectedAgent(agent);
  };

  const handleModelConfigChange = (param: keyof ModelConfig, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) setModelConfig(prev => ({ ...prev, [param]: numValue }));
  };
  
  const handleThresholdChange = (param: keyof AlertThresholds, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) setAlertThresholds(prev => ({ ...prev, [param]: numValue }));
  };

  const toggleLanguage = () => {
      setLanguage(prev => prev === 'en' ? 'vi' : 'en');
  };

  const AppContent = () => {
    const isSocialAnalyst = selectedAgent === AgentType.SOCIAL_MEDIA_ANALYSIS;

    return (
      <>
        <div className="sticky top-0 z-40">
          {activeAlerts.map(alert => <CriticalAlertBanner key={alert.id} alert={alert} onDismiss={handleDismissAlert} />)}
        </div>
        
        {geofenceAlert && <Notification message={geofenceAlert} onClose={() => setGeofenceAlert(null)} />}
        
        <div className="container mx-auto p-4 md:p-8">
          <header className="text-center mb-8 relative">
              <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
                  {t.appTitle}
              </h1>
              <p className="mt-2 text-lg text-gray-400">
                  {t.appSubtitle}
              </p>
              
              <div className="absolute top-0 right-0 flex space-x-2">
                 <button 
                    onClick={toggleLanguage}
                    className="bg-gray-800 hover:bg-gray-700 text-gray-200 px-3 py-1 rounded border border-gray-600 transition-colors font-semibold text-sm"
                 >
                     {language === 'en' ? 'Tiếng Việt' : 'English'}
                 </button>
              </div>
          </header>

          <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Panel: Controls */}
            <div className="space-y-6">
                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-gray-700">
                  <h2 className="text-2xl font-bold mb-4 text-teal-300 border-b-2 border-teal-500/30 pb-2">{t.headers.coordinationHub}</h2>
                  <div className="space-y-6">
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">{t.steps.agent}</label>
                      <AgentSelector selected={selectedAgent} onSelect={handleSelectAgent} language={language} />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">{t.steps.disaster}</label>
                      <DisasterSelector selected={selectedDisaster} onSelect={setSelectedDisaster} language={language} />
                    </div>
                    
                    {isSocialAnalyst ? (
                         <>
                          <div>
                            <label htmlFor="socialMediaInput" className="block text-sm font-medium text-gray-400 mb-2">{t.steps.socialMedia}</label>
                            <textarea id="socialMediaInput" rows={6} value={socialMediaInput} onChange={(e) => setSocialMediaInput(e.target.value)} placeholder={t.placeholders.socialMedia} className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition font-mono text-sm" />
                          </div>
                          <div>
                            <label htmlFor="locationInput" className="block text-sm font-medium text-gray-400 mb-2">{t.steps.locationInput}</label>
                            <textarea id="locationInput" rows={4} value={locationInput} onChange={(e) => setLocationInput(e.target.value)} placeholder={t.placeholders.locationInput} className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition font-mono text-sm" />
                          </div>
                        </>
                    ) : (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">{t.steps.location}</label>
                            <div className="flex items-center space-x-2">
                              <div className="flex-grow flex items-center space-x-2 bg-gray-700/50 p-3 rounded-lg">
                                  <LocationIcon />
                                  {location ? (<span>{t.labels.lat}: {location.latitude.toFixed(4)}, {t.labels.lon}: {location.longitude.toFixed(4)}</span>) : (<span>{isInitializing ? t.labels.acquiring : t.labels.unavailable}</span>)}
                              </div>
                              <button onClick={handleRefreshLocation} disabled={isRefreshingLocation} className="p-3 bg-gray-700/50 hover:bg-gray-600/70 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed" aria-label={t.buttons.refresh}>
                                <RefreshIcon className={`w-5 h-5 ${isRefreshingLocation ? 'animate-spin' : ''}`} />
                              </button>
                            </div>
                            {locationError && <p className="text-red-400 text-sm mt-2">{locationError}</p>}
                          </div>
                          <div>
                            <label htmlFor="customQuery" className="block text-sm font-medium text-gray-400 mb-2">{t.steps.query}</label>
                            <input id="customQuery" type="text" value={customQuery} onChange={(e) => setCustomQuery(e.target.value)} placeholder={t.placeholders.query} className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition" />
                          </div>
                          <div>
                             <label className="block text-sm font-medium text-gray-400 mb-2">{t.steps.alerts}</label>
                             <div className="space-y-3 bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                                     <div className="grid grid-cols-3 items-center gap-2"><label htmlFor="geofenceRadius" className="text-sm col-span-1 text-gray-300">{t.labels.geofenceRadius}</label><input id="geofenceRadius" type="range" min="0.5" max="2" step="0.1" value={alertThresholds.geofenceRadiusMultiplier} onChange={(e) => handleThresholdChange('geofenceRadiusMultiplier', e.target.value)} className="col-span-1 w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer range-thumb-teal"/><span className="text-sm text-center font-mono bg-gray-900/50 rounded px-2 py-1">{(alertThresholds.geofenceRadiusMultiplier * 100).toFixed(0)}%</span></div>
                                     <div className="grid grid-cols-3 items-center gap-2"><label htmlFor="highTemp" className="text-sm col-span-1 text-gray-300">{t.labels.highTemp} (°C)</label><input id="highTemp" type="range" min="20" max="50" step="1" value={alertThresholds.highTempWarning} onChange={(e) => handleThresholdChange('highTempWarning', e.target.value)} className="col-span-1 w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer range-thumb-teal"/><span className="text-sm text-center font-mono bg-gray-900/50 rounded px-2 py-1">{alertThresholds.highTempWarning}°C</span></div>
                                     <div className="grid grid-cols-3 items-center gap-2"><label htmlFor="lowTemp" className="text-sm col-span-1 text-gray-300">{t.labels.lowTemp} (°C)</label><input id="lowTemp" type="range" min="-20" max="10" step="1" value={alertThresholds.lowTempWarning} onChange={(e) => handleThresholdChange('lowTempWarning', e.target.value)} className="col-span-1 w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer range-thumb-teal"/><span className="text-sm text-center font-mono bg-gray-900/50 rounded px-2 py-1">{alertThresholds.lowTempWarning}°C</span></div>
                             </div>
                           </div>
                        </>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">{isSocialAnalyst ? '5.' : '6.'} {t.steps.model}</label>
                      <div className="space-y-3 bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                            <div className="grid grid-cols-3 items-center gap-2"><label htmlFor="temperature" className="text-sm col-span-1 text-gray-300">{t.labels.temperature}</label><input id="temperature" type="range" min="0" max="1" step="0.1" value={modelConfig.temperature} onChange={(e) => handleModelConfigChange('temperature', e.target.value)} className="col-span-1 w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer range-thumb-teal" /><span className="text-sm text-center font-mono bg-gray-900/50 rounded px-2 py-1">{modelConfig.temperature.toFixed(1)}</span></div>
                            <div className="grid grid-cols-3 items-center gap-2"><label htmlFor="topP" className="text-sm col-span-1 text-gray-300">{t.labels.topP}</label><input id="topP" type="range" min="0" max="1" step="0.05" value={modelConfig.topP} onChange={(e) => handleModelConfigChange('topP', e.target.value)} className="col-span-1 w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer range-thumb-teal" /><span className="text-sm text-center font-mono bg-gray-900/50 rounded px-2 py-1">{modelConfig.topP.toFixed(2)}</span></div>
                            <div className="grid grid-cols-3 items-center gap-2"><label htmlFor="topK" className="text-sm col-span-1 text-gray-300">{t.labels.topK}</label><input id="topK" type="range" min="1" max="100" step="1" value={modelConfig.topK} onChange={(e) => handleModelConfigChange('topK', e.target.value)} className="col-span-1 w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer range-thumb-teal" /><span className="text-sm text-center font-mono bg-gray-900/50 rounded px-2 py-1">{modelConfig.topK}</span></div>
                      </div>
                    </div>
                    
                    <button 
                        onClick={handleSearch} 
                        disabled={isSearching || (isSocialAnalyst ? (!socialMediaInput.trim() || !locationInput.trim()) : !location)} 
                        className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                    >
                      <SearchIcon />
                      <span>{isSearching ? t.buttons.analyzing : (isSocialAnalyst ? t.buttons.analyzeSocial : t.buttons.findHotspots)}</span>
                    </button>
                  </div>
                </div>

                {!isSocialAnalyst && (
                    <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-indigo-700/50">
                        <h3 className="text-xl font-bold mb-3 text-purple-300 border-b border-purple-500/30 pb-2 flex items-center gap-2">
                             {t.labels.advancedTools}
                        </h3>
                        <button 
                            onClick={() => handleSelectAgent(AgentType.SOCIAL_MEDIA_ANALYSIS)}
                            className="w-full flex items-center justify-between p-4 bg-gray-800/60 hover:bg-gray-700/80 rounded-xl border border-gray-600 hover:border-purple-400 transition-all duration-300 group text-left"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-500/20 rounded-lg text-purple-300 group-hover:text-purple-200">
                                    <NewspaperIcon />
                                </div>
                                <div>
                                    <div className="font-semibold text-purple-200 group-hover:text-white transition">{t.labels.socialToolLink}</div>
                                    <div className="text-xs text-gray-400 group-hover:text-gray-300 mt-1">{t.labels.socialToolDesc}</div>
                                </div>
                            </div>
                            <div className="text-purple-400 group-hover:translate-x-1 transition-transform transform">
                                <span className="text-lg font-bold">→</span>
                            </div>
                        </button>
                    </div>
                )}
            </div>

            {/* Right Panel: Results - spans 2 columns */}
            <div className="lg:col-span-2 bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-gray-700 min-h-[400px] flex flex-col">
              <h2 className="text-2xl font-bold mb-4 text-blue-300 border-b-2 border-blue-500/30 pb-2">{t.headers.intelligenceReport}</h2>
              {isSearching && <LoadingSpinner />}
              {apiError && (<div className="text-center my-auto p-4 bg-red-900/50 border border-red-700 rounded-lg"><AlertIcon /><p className="text-red-300 mt-2">{apiError}</p></div>)}
              {!isSearching && !apiError && !reliefData && !socialMediaAnalysisResult && (<div className="text-center my-auto text-gray-500"><p>Analysis results will appear here.</p><p>Provide your location and select a disaster type to begin.</p></div>)}
              {reliefData && <ResultsDisplay data={reliefData} alertThresholds={alertThresholds} customGeofence={null} selectedAgent={selectedAgent} userReportsCount={userReports.length} language={language} />}
              {socialMediaAnalysisResult && <SocialMediaAnalysisResults data={socialMediaAnalysisResult} language={language} />}
            </div>

          </main>
        </div>
      </>
    );
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
        <AppContent />
        <style>{`.range-thumb-teal::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 16px; height: 16px; background: #2dd4bf; cursor: pointer; border-radius: 50%; margin-top: -6px; } .range-thumb-teal::-moz-range-thumb { width: 16px; height: 16px; background: #2dd4bf; cursor: pointer; border-radius: 50%; }`}</style>
      </div>
    </ErrorBoundary>
  );
};

export default App;