
import React from 'react';
import { DisasterType, Language } from '../types';
import { translations } from '../utils/translations';

interface DisasterSelectorProps {
  selected: DisasterType;
  onSelect: (disaster: DisasterType) => void;
  language: Language;
}

const DisasterSelector: React.FC<DisasterSelectorProps> = ({ selected, onSelect, language }) => {
  const disasters = Object.values(DisasterType);
  const t = translations[language];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {disasters.map((disaster) => (
        <button
          key={disaster}
          onClick={() => onSelect(disaster)}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ease-in-out
            ${selected === disaster
              ? 'bg-teal-500 text-white shadow-lg transform scale-105'
              : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
            }`}
        >
          {t.disasters[disaster]}
        </button>
      ))}
    </div>
  );
};

export default DisasterSelector;
