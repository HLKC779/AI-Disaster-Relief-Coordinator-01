
import React from 'react';
import { AgentType, Language } from '../types';
import { BrainIcon, TruckIcon, BuildingDamageIcon, MegaphoneIcon, NewspaperIcon } from './Icons';
import { translations } from '../utils/translations';

interface AgentSelectorProps {
  selected: AgentType;
  onSelect: (agent: AgentType) => void;
  language: Language;
}

const agentIcons: Record<AgentType, React.ReactElement> = {
  [AgentType.GENERAL_ANALYSIS]: <BrainIcon />,
  [AgentType.LOGISTICS_PLANNING]: <TruckIcon />,
  [AgentType.DAMAGE_ASSESSMENT]: <BuildingDamageIcon />,
  [AgentType.PUBLIC_COMMUNICATIONS]: <MegaphoneIcon />,
  [AgentType.SOCIAL_MEDIA_ANALYSIS]: <NewspaperIcon />,
};

const AgentSelector: React.FC<AgentSelectorProps> = ({ selected, onSelect, language }) => {
  const agents = Object.values(AgentType);
  const t = translations[language];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
      {agents.map((agent) => (
        <button
          key={agent}
          onClick={() => onSelect(agent)}
          className={`p-3 text-left rounded-lg transition-all duration-200 ease-in-out border-2 flex items-center space-x-2
            ${selected === agent
              ? 'bg-teal-500/20 border-teal-400 shadow-lg text-white'
              : 'bg-gray-700/50 border-gray-600 hover:bg-gray-600/50 hover:border-gray-500 text-gray-300'
            }`}
        >
          <div className="flex-shrink-0 w-5 h-5">{agentIcons[agent]}</div>
          <span className="text-sm font-semibold">{t.agents[agent]}</span>
        </button>
      ))}
    </div>
  );
};

export default AgentSelector;
