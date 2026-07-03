
import React, { useState, useRef } from 'react';
import { Geolocation, UserReport, Language } from '../types';
import { XMarkIcon, LocationIcon, CameraIcon } from './Icons';
import { LoadingSpinner } from './LoadingSpinner';
import { translations } from '../utils/translations';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (report: Omit<UserReport, 'location'>) => void;
  location: Geolocation;
  language: Language;
}

const MAX_DESC_LENGTH = 500;

const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, onSubmit, location, language }) => {
  const [description, setDescription] = useState('');
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [photoMimeType, setPhotoMimeType] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = translations[language];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsProcessing(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        // Strip the "data:image/jpeg;base64," part
        const base64String = result.split(',')[1];
        setPhotoBase64(base64String);
        setPhotoMimeType(file.type);
        setIsProcessing(false);
      };
      reader.onerror = () => {
        console.error("Error reading file");
        setIsProcessing(false);
      }
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoBase64(null);
    setPhotoMimeType(null);
    if (fileInputRef.current) {
        // Reset the file input so the user can select the same file again
        fileInputRef.current.value = "";
    }
  };

  const handleShowConfirmation = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim()) {
      setShowConfirmation(true);
    }
  };

  const handleConfirmSubmit = () => {
    if (description.trim()) {
      onSubmit({ description, photoBase64, photoMimeType });
    }
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-white transition">
          <XMarkIcon className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold mb-4 text-teal-300">{t.headers.fieldReport}</h2>
        
        <div className="flex items-center space-x-2 bg-gray-700/50 p-3 rounded-lg mb-4 text-sm">
          <LocationIcon />
          <span>{t.labels.reportLocation}: {t.labels.lat}: {location.latitude.toFixed(4)}, {t.labels.lon}: {location.longitude.toFixed(4)}</span>
        </div>

        <form onSubmit={handleShowConfirmation} className="space-y-4">
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-400 mb-2">{t.labels.description}</label>
            <textarea
              id="description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t.placeholders.reportDesc}
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition"
              required
              maxLength={MAX_DESC_LENGTH}
            />
            <div className={`text-right text-xs mt-1 ${description.length >= MAX_DESC_LENGTH ? 'text-red-400 font-semibold' : 'text-gray-500'}`}>
                {description.length} / {MAX_DESC_LENGTH}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">{t.labels.attachPhoto}</label>
            {isProcessing ? (
                <div className="w-full h-48 flex items-center justify-center bg-gray-900/50 rounded-lg">
                    <LoadingSpinner />
                </div>
            ) : photoBase64 ? (
                <div className="relative group">
                    <img 
                        src={`data:${photoMimeType};base64,${photoBase64}`} 
                        alt="Preview" 
                        className="w-full h-auto max-h-64 object-contain rounded-lg bg-gray-900/50"
                    />
                    <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1.5 hover:bg-red-600/80 transition-all opacity-50 group-hover:opacity-100"
                        aria-label="Remove photo"
                    >
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>
            ) : (
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-600 px-6 py-10">
                  <div className="text-center">
                    <CameraIcon />
                    <div className="mt-4 flex text-sm leading-6 text-gray-400">
                      <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-semibold text-teal-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-teal-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-800 hover:text-teal-300">
                        <span>{t.labels.uploadFile}</span>
                        <input ref={fileInputRef} id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/png, image/jpeg" onChange={handleFileChange} />
                      </label>
                      <p className="pl-1">{t.labels.dragDrop}</p>
                    </div>
                    <p className="text-xs leading-5 text-gray-500">PNG, JPG up to 10MB</p>
                  </div>
                </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold rounded-lg bg-gray-600 hover:bg-gray-500 text-gray-200 transition">
              {t.buttons.cancel}
            </button>
            <button type="submit" disabled={!description.trim() || isProcessing} className="px-4 py-2 text-sm font-semibold rounded-lg bg-teal-500 hover:bg-teal-600 text-white transition disabled:opacity-50 disabled:cursor-not-allowed">
              {t.buttons.submitReport}
            </button>
          </div>
        </form>
        
        {showConfirmation && (
            <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center p-4 rounded-2xl">
                <div className="bg-gray-800 p-6 rounded-lg shadow-xl text-center border border-gray-700">
                    <h3 className="text-lg font-bold text-white mb-2">{t.labels.confirmSubmission}</h3>
                    <p className="text-gray-400 mb-6">{t.labels.areYouSureReport}</p>
                    <div className="flex justify-center space-x-4">
                        <button
                            type="button"
                            onClick={() => setShowConfirmation(false)}
                            className="px-6 py-2 text-sm font-semibold rounded-lg bg-gray-600 hover:bg-gray-500 text-gray-200 transition"
                        >
                            {t.buttons.cancel}
                        </button>
                        <button
                            type="button"
                            onClick={handleConfirmSubmit}
                            className="px-6 py-2 text-sm font-semibold rounded-lg bg-teal-500 hover:bg-teal-600 text-white transition"
                        >
                            {t.buttons.confirm}
                        </button>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default ReportModal;
