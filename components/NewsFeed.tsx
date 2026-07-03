
import React, { useState, useEffect } from 'react';
import { NewsArticle, DisasterType, Language } from '../types';
import { LoadingSpinner } from './LoadingSpinner';
import { NewspaperIcon, SearchIcon, AlertIcon } from './Icons';
import { translations } from '../utils/translations';

interface NewsFeedProps {
  selectedDisaster: DisasterType;
  newsFeedData: NewsArticle[];
  newsRegionFilter: string;
  onRegionFilterChange: (region: string) => void;
  isFetchingNews: boolean;
  newsError: string | null;
  onFetchNews: () => void;
  language: Language;
}

const NewsFeed: React.FC<NewsFeedProps> = ({
  selectedDisaster,
  newsFeedData,
  newsRegionFilter,
  onRegionFilterChange,
  isFetchingNews,
  newsError,
  onFetchNews,
  language
}) => {
  const [localRegionInput, setLocalRegionInput] = useState(newsRegionFilter);
  const t = translations[language];

  useEffect(() => {
    setLocalRegionInput(newsRegionFilter);
  }, [newsRegionFilter]);

  const handleFetchClick = () => {
    onRegionFilterChange(localRegionInput); // Update parent state with the current input
    onFetchNews();
  };

  const formatPublishedDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return isoString; // Fallback to original string if parsing fails
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-gray-700 flex flex-col">
      <h2 className="text-2xl font-bold mb-4 text-purple-300 border-b-2 border-purple-500/30 pb-2 flex items-center">
        <NewspaperIcon className="w-6 h-6 mr-2" />
        {t.headers.newsFeed}
      </h2>

      <div className="mb-4 space-y-3">
        <div>
          <label htmlFor="newsRegion" className="block text-sm font-medium text-gray-400 mb-2">{t.labels.filterRegion}</label>
          <input
            id="newsRegion"
            type="text"
            value={localRegionInput}
            onChange={(e) => setLocalRegionInput(e.target.value)}
            placeholder={t.placeholders.newsRegion}
            className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition"
          />
        </div>
        <div className="flex items-center space-x-2">
            <div className="flex-grow flex items-center space-x-2 bg-gray-700/50 p-3 rounded-lg text-sm text-gray-300">
                <span>{t.labels.disasterFilter}: <span className="font-semibold text-white">{t.disasters[selectedDisaster]}</span></span>
            </div>
            <button
                onClick={handleFetchClick}
                disabled={isFetchingNews}
                className="p-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                aria-label={t.buttons.fetchNews}
            >
                <SearchIcon className="w-5 h-5" />
            </button>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
        {isFetchingNews && <LoadingSpinner />}
        {newsError && (
          <div className="text-center my-auto p-4 bg-red-900/50 border border-red-700 rounded-lg">
            <AlertIcon />
            <p className="text-red-300 mt-2">{newsError}</p>
          </div>
        )}
        {!isFetchingNews && !newsError && newsFeedData.length === 0 && (
          <div className="text-center my-auto text-gray-500">
            <p>{t.labels.noNews} "{t.disasters[selectedDisaster]}" {language === 'vi' ? 'trong' : 'in'} "{newsRegionFilter || (language === 'vi' ? 'tất cả khu vực' : 'all regions')}"</p>
            <p>{t.labels.tryDifferent}</p>
          </div>
        )}
        {!isFetchingNews && !newsError && newsFeedData.length > 0 && (
          <ul className="space-y-4">
            {newsFeedData.map((article) => (
              <li key={article.id} className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                <a href={article.url} target="_blank" rel="noopener noreferrer" className="block text-lg font-bold text-blue-400 hover:text-blue-300 transition-colors">
                  {article.title}
                </a>
                <p className="text-sm text-gray-500 mt-1">
                  {article.source} - {formatPublishedDate(article.publishedAt)}
                </p>
                <p className="text-gray-400 text-sm mt-2">{article.summary}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NewsFeed;
