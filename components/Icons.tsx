import React from 'react';

export const LocationIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
  </svg>
);

export const SearchIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
);

export const AlertIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8 mx-auto text-red-400" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
    </svg>
);

export const MapPinIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
    </svg>
);

export const BulletListIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12M8.25 17.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
    </svg>
);

export const SourceIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
    </svg>
);

export const MoneyIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414-.336.75-.75.75h-.75m0-1.5h.375c.621 0 1.125.504 1.125 1.125v.375m-18 0h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v.75m18 0v-3.75a.375.375 0 0 0-.375-.375H3.75a.375.375 0 0 0-.375.375v3.75m18 0v9.34c0 .529-.43.959-.959.959l-15.19 0c-.529 0-.96-.43-.96-.96V6" />
    </svg>
);

export const HistoryIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);

export const RefreshIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 11.664 0l3.18-3.185m-3.18-3.182-3.182 3.183a8.25 8.25 0 0 1-11.664 0l-3.18-3.185m3.18 3.186L2.985 19.644" />
    </svg>
);

export const InformationCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
    </svg>
);

export const XMarkIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
);

export const TemperatureIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-400">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5a3 3 0 0 0-3 3v6.375m-3.375 0V7.5a3 3 0 0 1 3-3h.001M9 12h.008v.008H9V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm4.125 4.5h.008v.008h-.008V16.5Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19.5v-2.625a3.375 3.375 0 0 1 .53-2.002l1.141-2.282c.264-.528.802-1.35 1.402-1.77a4.5 4.5 0 0 1 5.922-.04l.142.142a4.5 4.5 0 0 1 .04 5.922 4.478 4.478 0 0 1-1.77 1.402l-2.282 1.141A3.375 3.375 0 0 1 9 19.5Z" />
    </svg>
);

export const WindIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-400">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5c-3.483 0-6.326 2.843-6.326 6.326S8.517 17.152 12 17.152c3.483 0 6.326-2.843 6.326-6.326S15.483 4.5 12 4.5Zm0 0V.848m0 3.652a2.674 2.674 0 1 0 0 5.348 2.674 2.674 0 0 0 0-5.348Zm0 9.07a8.947 8.947 0 0 1-6.326-2.623m6.326 2.623a8.947 8.947 0 0 0 6.326-2.623m-6.326 2.623V23.152" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.826 10.826H.848m12.326 0h-3.978m7.956 0h3.978" />
    </svg>
);

export const PrecipitationIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-400">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m8.485-15.515.707-.707m-15.96 15.96.707-.707m14.546 0-.707-.707m-15.96-15.96-.707.707M12 7a5 5 0 0 0-5 5c0 3.463 2.5 5.5 5 5s5-2.037 5-5a5 5 0 0 0-5-5Z" />
    </svg>
);

export const CrosshairsIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM12 21v-2.25M4.5 12H2.25m19.5 0h-2.25M12 3V.75M19.5 4.5l-1.75 1.75M4.5 19.5l1.75-1.75M19.5 19.5l-1.75-1.75M4.5 4.5l1.75 1.75" />
    </svg>
);

export const PencilIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
    </svg>
);

export const TrashIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.067-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
);

export const CameraIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.776 48.776 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
    </svg>
);

export const EyeIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
);

export const HistoricalDataIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6A1.125 1.125 0 0 1 2.25 10.875v-3.75Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-8.25Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-2.25Z" />
    </svg>
);

export const UserIcon: React.FC<{className?: string}> = ({className = "w-6 h-6"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
);

export const LogoutIcon: React.FC<{className?: string}> = ({className = "w-5 h-5"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
    </svg>
);

export const FlagIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5" />
    </svg>
);

export const BellSlashIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.143 17.082a9.043 9.043 0 0 1-1.282-5.02 9.043 9.043 0 0 1 1.282-5.02m1.996 10.04a9.025 9.025 0 0 0 4.288 0M12 4.5a9.025 9.025 0 0 0-4.288 0M12 4.5v.01m0 16.49v.01m0-16.51a8.957 8.957 0 0 1 4.907 1.378M4.288 16.5a8.957 8.957 0 0 1-1.378-4.907M15.857 5.857a8.957 8.957 0 0 1 4.907 1.378M5.667 4.487a8.957 8.957 0 0 1 1.378 4.907m12.426 0a8.957 8.957 0 0 1-1.378 4.907M12 21a8.957 8.957 0 0 1-4.907-1.378M18.333 19.513a8.957 8.957 0 0 1-1.378-4.907M3 3l18 18" />
    </svg>
);

export const ChevronUpIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
    </svg>
);

export const ChevronDownIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
);

// --- AI Agent Icons ---
export const BrainIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
    </svg>
);
export const TruckIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
        <path d="M7.5 18.75C7.5 17.231 6.269 16 4.75 16S2 17.231 2 18.75 3.231 21.5 4.75 21.5 7.5 20.269 7.5 18.75Z" />
        <path d="M19.5 18.75c0-1.519-1.231-2.75-2.75-2.75s-2.75 1.231-2.75 2.75 1.231 2.75 2.75 2.75S19.5 20.269 19.5 18.75Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2 12V6.75A2.25 2.25 0 0 1 4.25 4.5h11.5A2.25 2.25 0 0 1 18 6.75V16.5M18 16.5H8.25M13.5 16.5H18m0-4.5h2.25A2.25 2.25 0 0 1 22.5 14.25v2.25" />
    </svg>
);
export const BuildingDamageIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205 3 1m-3-1-3-1.091m0 0-3 1.091m0 0 3 1.091m0 0-3-1.091m-9 3.792 3-1.091m0 0 3 1.091m-3-1.091-3-1.091" />
    </svg>
);
export const MegaphoneIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802" />
    </svg>
);
export const NewspaperIcon: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
    </svg>
);

export const ThumbUpIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V3a.75.75 0 0 1 .75-.75A2.25 2.25 0 0 1 16.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904M6.375 18H5.904a2.25 2.25 0 0 1-2.25-2.25v-4.5A2.25 2.25 0 0 1 5.904 9H6.375" />
    </svg>
);

export const ThumbDownIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.367 10.5c.806 0 1.533.446 2.031 1.08a9.041 9.041 0 0 0 2.861 2.4c.723.384 1.35.956 1.653 1.715a4.498 4.498 0 0 1 .322 1.672V21a.75.75 0 0 0 .75.75A2.25 2.25 0 0 0 16.5 19.5c0-1.152.26-2.243.723-3.218.266-.558-.107-1.282-.725-1.282h-3.126c-1.026 0-1.945-.694-2.054-1.715A12.134 12.134 0 0 1 10.5 9.25a11.95 11.95 0 0 0-2.649-7.521c-.388-.482-.987-.729-1.605-.729H4.522c-.483 0-.964.078-1.423.23l-3.114 1.04a4.5 4.5 0 0 0-1.423.23H.894M7.125 6H.894a2.25 2.25 0 0 0-2.25 2.25v4.5A2.25 2.25 0 0 0 .894 15H1.37" />
    </svg>
);

export const ChatBubbleLeftRightIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.72.372a3.523 3.523 0 0 1-1.04-.22l-1.03-1.03a.75.75 0 0 0-1.06 0l-1.03 1.03a3.523 3.523 0 0 1-1.04.22l-3.72-.372C3.847 17.1 3 16.136 3 15v-4.286c0-.97.616-1.813 1.5-2.097m14.25 0a2.498 2.498 0 0 0-2.25-.968l-3.72.372c-.534.053-1.022.226-1.453.498l-1.03 1.03a.75.75 0 0 1-1.06 0l-1.03-1.03A2.498 2.498 0 0 0 8.25 7.5l-3.72-.372a2.498 2.498 0 0 0-2.25.968" />
    </svg>
);

// --- SVG string functions for map markers ---
const svgWrapper = (path: string, color: string) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36" fill="rgba(17, 24, 39, 0.8)" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;

export const getFloodIconSvg = (color: string) => svgWrapper('<path d="M12 4L4 8l8 4 8-4-8-4z"/><path d="M4 12l8 4 8-4"/><path d="M4 17l8 4 8-4"/><path d="M2 15s1.5-2 4-2 4 2 4 2-1.5 2-4 2-4-2-4-2z"/><path d="M14 15s1.5-2 4-2 4 2 4 2-1.5 2-4 2-4-2-4-2z"/>', color);
export const getHurricaneIconSvg = (color: string) => svgWrapper('<path d="M21 4H3m6 8c0 4.418-3.582 8-8 8m20-8c0 4.418-3.582 8-8 8m-4-8c0-4.418 3.582-8 8-8m-4 8c0-4.418 3.582-8 8-8"/>', color);
export const getBlizzardIconSvg = (color: string) => svgWrapper('<path d="M12 2v20M12 12l-8-8M12 12l8 8M12 12l8-8M12 12l-8 8M20 12H4"/>', color);
export const getMudslideIconSvg = (color: string) => svgWrapper('<path d="M12 2L2 22h20L12 2z"/><path d="m12 10 3 3-3 3-3-3 3-3z"/><path d="m5 16 3 3-3 3-3-3 3-3z"/><path d="m16 16 3 3-3 3-3-3 3-3z"/>', color);
export const getWildfireIconSvg = (color: string) => svgWrapper('<path d="M12 2c-4 4-2 8-2 8s4-4 2-8zm0 0c4 4 2 8 2 8s-4-4-2-8z"/><path d="M10 12c-4 4-2 8-2 8s4-4 2-8zm4 0c4 4 2 8 2 8s-4-4-2-8z"/><path d="M12 22a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>', color);
export const getEarthquakeIconSvg = (color: string) => svgWrapper('<path d="M2 8l4 4-4 4 4 4h16l-4-4 4-4-4-4H2z"/>', color);
export const getTornadoIconSvg = (color:string) => svgWrapper('<path d="M2 6h20"/><path d="M4 12h16"/><path d="M6 18h12"/><path d="m8 6 3 12"/><path d="m16 6-3 12"/>', color);
export const getUserIconSvg = (color: string) => svgWrapper('<circle cx="12" cy="12" r="10" stroke-width="2.5"/><circle cx="12" cy="10" r="3"/><path d="M12 13v8m-4-4h8"/>', color);
export const getPlusIconSvg = (color: string) => svgWrapper('<path d="M12 5v14m-7-7h14"/>', color);
export const getUserReportIconSvg = (color: string, hasPhoto: boolean) => {
    // A small camera lens icon will be added if a photo exists
    const photoIndicator = hasPhoto
        ? '<circle cx="12" cy="17" r="2.5" fill="white" stroke="black" stroke-width="0.5" /><circle cx="12" cy="17" r="1" fill="black" />'
        : '';
    return svgWrapper(
        '<path d="M12 2L2 22h20L12 2z" stroke-width="2.5"/>' + photoIndicator,
        color
    );
};