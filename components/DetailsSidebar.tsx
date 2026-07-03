
import React, { useState } from 'react';
import { HotspotLocation, UserReport, Language } from '../types';
import { XMarkIcon, AlertIcon, CameraIcon, EyeIcon } from './Icons';
import ImageModal from './ImageModal';
import { translations } from '../utils/translations';

// Type guard to check if the feature is a HotspotLocation
function isHotspot(feature: HotspotLocation | UserReport): feature is HotspotLocation {
  return (feature as HotspotLocation).priority !== undefined;
}

interface DetailsSidebarProps {
  feature: HotspotLocation | UserReport | null;
  onClose: () => void;
  language: Language;
}

const DetailsSidebar: React.FC<DetailsSidebarProps> = ({ feature, onClose, language }) => {
  const isVisible = !!feature;
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const t = translations[language];

  // Close image modal when sidebar is closed
  const handleCloseSidebar = () => {
    setIsImageModalOpen(false);
    onClose();
  };

  return (
    <>
      {/* Overlay: Dims and blurs the background. Closes sidebar on click. */}
      <div
        onClick={handleCloseSidebar}
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        aria-hidden="true"
      />
      
      {/* Sidebar Panel */}
      <div 
          className={`fixed top-0 right-0 h-full w-full md:w-1/3 lg:w-1/4 bg-gray-800 border-l border-gray-700 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isVisible ? 'translate-x-0' : 'translate-x-full'}`}
          aria-labelledby="details-sidebar-title"
          role="dialog"
          aria-modal="true"
          aria-hidden={!isVisible}
      >
        {feature && (
          <div className="p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 id="details-sidebar-title" className="text-2xl font-bold text-teal-300">
                {isHotspot(feature) ? t.labels.hotspotDetails : t.labels.fieldReportDetails}
              </h2>
              <button onClick={handleCloseSidebar} className="text-gray-400 hover:text-white transition-colors" aria-label="Close details panel">
                <XMarkIcon className="w-8 h-8" />
              </button>
            </div>

            <div className="overflow-y-auto pr-2 custom-scrollbar flex-grow">
              {isHotspot(feature) ? (
                // Render Hotspot Details
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase">{t.labels.priority}</h3>
                    <p className={`text-lg font-bold flex items-center ${
                      feature.priority === 'High' ? 'text-red-400' : 
                      feature.priority === 'Medium' ? 'text-yellow-400' : 'text-green-400'
                    }`}>
                        <AlertIcon className="w-5 h-5 mr-2" />
                        {feature.priority}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase">{t.labels.description}</h3>
                    <p className="text-gray-300">{feature.description}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase">{t.labels.location}</h3>
                    <p className="text-gray-300 font-mono text-sm">{t.labels.lat}: {feature.latitude.toFixed(5)}, {t.labels.lon}: {feature.longitude.toFixed(5)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase">{t.labels.operationalRadius}</h3>
                    <p className="text-gray-300">{feature.radius_km} km</p>
                  </div>
                </div>
              ) : (
                // Render User Report Details
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase">{t.labels.description}</h3>
                    <p className="text-gray-300">{feature.description}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase">{t.labels.location}</h3>
                    <p className="text-gray-300 font-mono text-sm">{t.labels.lat}: {feature.location.latitude.toFixed(5)}, {t.labels.lon}: {feature.location.longitude.toFixed(5)}</p>
                  </div>
                  {feature.photoBase64 && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold text-gray-500 uppercase flex items-center">
                        <CameraIcon />
                        <span className="ml-2">{t.labels.attachedPhoto}</span>
                      </h3>
                      <img 
                        src={`data:${feature.photoMimeType};base64,${feature.photoBase64}`} 
                        alt="User submitted report" 
                        className="w-full rounded-lg shadow-lg"
                      />
                      <button 
                        onClick={() => setIsImageModalOpen(true)}
                        className="w-full flex items-center justify-center space-x-2 text-sm bg-blue-800/50 hover:bg-blue-700/70 text-blue-300 font-semibold py-2 px-3 rounded-lg transition-colors"
                      >
                          <EyeIcon />
                          <span>{t.buttons.viewFullSize}</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
       <style>{`
        .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(0,0,0,0.2);
            border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #4a5568;
            border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #718096;
        }
      `}</style>
      </div>
      
      {/* Modal is rendered outside the sidebar div but within the component */}
      {isVisible && feature && !isHotspot(feature) && feature.photoBase64 && isImageModalOpen && (
        <ImageModal
          src={`data:${feature.photoMimeType};base64,${feature.photoBase64}`}
          alt="Full size view of user report"
          onClose={() => setIsImageModalOpen(false)}
        />
      )}
    </>
  );
};

export default DetailsSidebar;
