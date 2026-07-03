import React from 'react';
import { XMarkIcon } from './Icons';

interface ImageModalProps {
  src: string;
  alt: string;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ src, alt, onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[60] p-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="relative max-w-4xl max-h-[90vh] bg-gray-900 p-2 rounded-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking on the image/container
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-auto max-h-[calc(90vh-1rem)] object-contain rounded"
        />
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 bg-gray-700 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors"
          aria-label="Close image view"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default ImageModal;
