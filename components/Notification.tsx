
import React from 'react';
import { AlertIcon } from './Icons';

interface NotificationProps {
  message: string;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, onClose }) => {
  return (
    <div className="fixed top-5 right-5 z-50 max-w-sm bg-yellow-500/90 backdrop-blur-sm text-white p-4 rounded-lg shadow-2xl flex items-start space-x-3">
      <div className="flex-shrink-0">
        <AlertIcon className="w-6 h-6 text-white" />
      </div>
      <p className="flex-grow text-sm font-semibold">{message}</p>
      <button onClick={onClose} className="flex-shrink-0 text-2xl font-bold leading-none hover:text-gray-200">&times;</button>
    </div>
  );
};

export default Notification;
