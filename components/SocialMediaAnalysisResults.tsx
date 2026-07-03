
import React from 'react';
import { SocialMediaAnalysisData, SentimentAnalysis, KeyQuote, Language } from '../types';
import { BrainIcon, MapPinIcon, TruckIcon, ThumbUpIcon, ThumbDownIcon, ChatBubbleLeftRightIcon } from './Icons';
import { translations } from '../utils/translations';

interface SocialMediaAnalysisResultsProps {
  data: SocialMediaAnalysisData;
  language: Language;
}

const getSentimentColor = (sentiment: 'Positive' | 'Negative' | 'Neutral' | 'Mixed') => {
  switch (sentiment) {
    case 'Positive': return 'text-green-400';
    case 'Negative': return 'text-red-400';
    case 'Mixed': return 'text-yellow-400';
    default: return 'text-gray-400';
  }
};

const getSentimentScoreColor = (score: number) => {
    if (score > 0.3) return 'bg-green-500/30 text-green-300';
    if (score < -0.3) return 'bg-red-500/30 text-red-300';
    return 'bg-gray-500/30 text-gray-300';
};

const SentimentDisplay: React.FC<{ sentimentData: SentimentAnalysis; language: Language }> = ({ sentimentData, language }) => {
    const t = translations[language];
    return (
        <div>
            <h3 className="text-lg font-semibold text-gray-300 mb-2 flex items-center">
                <ChatBubbleLeftRightIcon />
                {t.labels.sentimentAnalysis}
            </h3>
            <div className="bg-gray-900/50 p-4 rounded-lg space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-3 bg-gray-800/50 rounded-lg">
                    <div>
                        <p className="text-sm text-gray-400">{t.labels.overallSentiment}</p>
                        <p className={`text-2xl font-bold ${getSentimentColor(sentimentData.overall_sentiment)}`}>
                            {sentimentData.overall_sentiment}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-400">{t.labels.sentimentScore}</p>
                        <span className={`text-2xl font-bold px-3 py-1 rounded-full ${getSentimentScoreColor(sentimentData.sentiment_score)}`}>
                            {sentimentData.sentiment_score.toFixed(2)}
                        </span>
                    </div>
                </div>
                <div>
                    <p className="text-sm font-semibold text-gray-400 mb-1">{t.labels.summary}</p>
                    <p className="text-gray-300 text-sm">{sentimentData.summary}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h4 className="font-semibold text-green-400 mb-2 flex items-center">
                            <div className="w-5 h-5 mr-2"><ThumbUpIcon /></div>
                            {t.labels.positiveThemes}
                        </h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
                            {sentimentData.positive_themes.map((theme, i) => <li key={i}>{theme}</li>)}
                            {sentimentData.positive_themes.length === 0 && <li className="text-gray-500 italic">No significant positive themes identified.</li>}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-red-400 mb-2 flex items-center">
                            <div className="w-5 h-5 mr-2"><ThumbDownIcon /></div>
                            {t.labels.negativeThemes}
                        </h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
                            {sentimentData.negative_themes.map((theme, i) => <li key={i}>{theme}</li>)}
                             {sentimentData.negative_themes.length === 0 && <li className="text-gray-500 italic">No significant negative themes identified.</li>}
                        </ul>
                    </div>
                </div>
                <div>
                    <h4 className="font-semibold text-gray-400 mb-2">{t.labels.keyQuotes}</h4>
                    <div className="space-y-3">
                        {sentimentData.key_quotes.map((quote, i) => (
                            <blockquote key={i} className={`border-l-4 p-2 text-sm italic rounded-r-lg ${
                                quote.sentiment === 'Positive' ? 'border-green-500 bg-green-900/20' :
                                quote.sentiment === 'Negative' ? 'border-red-500 bg-red-900/20' :
                                'border-gray-500 bg-gray-700/20'
                            }`}>
                                "{quote.quote}"
                                <cite className={`block text-right not-italic text-xs font-semibold mt-1 ${getSentimentColor(quote.sentiment)}`}>- {quote.sentiment}</cite>
                            </blockquote>
                        ))}
                         {sentimentData.key_quotes.length === 0 && <p className="text-gray-500 italic text-sm">No representative quotes found.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

const SocialMediaAnalysisResults: React.FC<SocialMediaAnalysisResultsProps> = ({ data, language }) => {
  const t = translations[language];
  return (
    <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar">
      <div>
        <h3 className="text-lg font-semibold text-gray-300 mb-2 flex items-center">
            <BrainIcon />
            <span className="ml-2">{t.labels.socialAnalysis}</span>
        </h3>
        <p className="text-gray-400 bg-gray-900/50 p-4 rounded-lg whitespace-pre-wrap">{data.analysis}</p>
      </div>
      
      {data.sentiment_analysis && <SentimentDisplay sentimentData={data.sentiment_analysis} language={language} />}

      <div>
        <h3 className="text-lg font-semibold text-gray-300 mb-2 flex items-center">
            <MapPinIcon />
            {t.labels.priorityRecommendations}
        </h3>
        <ul className="space-y-4">
          {data.priority_recommendations.map((item, index) => (
            <li key={index} className="bg-gray-900/50 p-4 rounded-lg border-l-4 border-red-500">
              <h4 className="font-bold text-red-300">{item.title}</h4>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <p><strong className="text-gray-400">{t.labels.location}:</strong> {item.location}</p>
                  <p><strong className="text-gray-400">{t.labels.emergency}:</strong> {item.emergency}</p>
                  <p><strong className="text-gray-400">{t.labels.estimatedAffected}:</strong> {item.estimated_affected}</p>
                  <p><strong className="text-gray-400">{t.labels.accessibility}:</strong> {item.accessibility}</p>
              </div>
              <div className="mt-3">
                <strong className="text-gray-400 text-sm">{t.labels.recommendedActions}:</strong>
                <ul className="list-disc list-inside space-y-1 mt-1 text-gray-300">
                    {item.recommended_actions.map((action, actionIndex) => (
                        <li key={actionIndex}>{action}</li>
                    ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-300 mb-2 flex items-center">
            <TruckIcon />
            <span className="ml-2">{t.labels.resourceAllocation}</span>
        </h3>
        <pre className="text-gray-300 bg-gray-900/50 p-4 rounded-lg whitespace-pre-wrap font-sans text-sm">{data.resource_allocation}</pre>
      </div>
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
  );
};

export default SocialMediaAnalysisResults;
