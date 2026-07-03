import React from 'react';
import { CriticalAlert } from '../types';
import { AlertIcon, XMarkIcon, InformationCircleIcon } from './Icons';

interface CriticalAlertBannerProps {
  alert: CriticalAlert;
  onDismiss: (id: string) => void;
}

const severityStyles = {
  danger: {
    container: 'bg-red-800/80 border-red-600',
    icon: 'text-red-200',
    button: 'bg-red-600 hover:bg-red-500',
    dismiss: 'text-red-200 hover:text-white',
  },
  warning: {
    container: 'bg-yellow-800/80 border-yellow-600',
    icon: 'text-yellow-200',
    button: 'bg-yellow-600 hover:bg-yellow-500',
    dismiss: 'text-yellow-200 hover:text-white',
  },
  info: {
    container: 'bg-blue-800/80 border-blue-600',
    icon: 'text-blue-200',
    button: 'bg-blue-600 hover:bg-blue-500',
    dismiss: 'text-blue-200 hover:text-white',
  },
};

const CriticalAlertBanner: React.FC<CriticalAlertBannerProps> = ({ alert, onDismiss }) => {
  const styles = severityStyles[alert.severity] || severityStyles.danger; // Default to danger
  
  const IconComponent = alert.severity === 'info' ? InformationCircleIcon : AlertIcon;

  return (
    <div className={`${styles.container} backdrop-blur-sm border-b-2 text-white p-4 flex items-center justify-between space-x-4`}>
      <div className="flex items-center space-x-3">
        <IconComponent className={`w-6 h-6 ${styles.icon} flex-shrink-0`} />
        <p className="text-sm font-medium">{alert.message}</p>
      </div>
      <div className="flex items-center space-x-4">
        {alert.link && (
          <a
            href={alert.link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-sm font-bold ${styles.button} px-3 py-1 rounded-md transition-colors whitespace-nowrap`}
          >
            {alert.link.text}
          </a>
        )}
        <button
          onClick={() => onDismiss(alert.id)}
          aria-label="Dismiss alert"
          className={`${styles.dismiss} transition-colors`}
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default CriticalAlertBanner;