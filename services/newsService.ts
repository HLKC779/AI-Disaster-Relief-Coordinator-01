import { DisasterType, NewsArticle } from '../types';

const NEWS_API_BASE_URL = 'https://newsapi.org/v2/everything';
const NEWS_API_KEY = process.env.NEWS_API_KEY;

/**
 * Fetches real-time disaster-related news from NewsAPI.org.
 * @param disasterType The type of disaster to filter news by.
 * @param region A string representing the region to filter news by (case-insensitive).
 * @returns A promise that resolves to an array of relevant NewsArticle objects.
 */
export const fetchNews = async (disasterType: DisasterType, region: string): Promise<NewsArticle[]> => {
  if (!NEWS_API_KEY) {
    throw new Error('NewsAPI_KEY is not defined. Please set the NEWS_API_KEY environment variable.');
  }

  console.log(`Fetching news for disaster: "${disasterType}" in region: "${region}" from NewsAPI.org`);

  const query = region.trim() ? `${disasterType} ${region}` : disasterType;

  const params = new URLSearchParams({
    q: query,
    language: 'en',
    sortBy: 'publishedAt',
    apiKey: NEWS_API_KEY,
    pageSize: '10', // Limit to 10 articles for brevity
  });

  const url = `${NEWS_API_BASE_URL}?${params.toString()}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`NewsAPI Error: ${errorData.message || response.statusText}`);
    }

    const data = await response.json();
    
    const newsArticles: NewsArticle[] = data.articles
      .filter((article: any) => article.title && article.url && article.source?.name && article.publishedAt && article.description)
      .map((article: any) => ({
        id: article.url, // Use URL as a unique ID
        title: article.title,
        source: article.source.name,
        url: article.url,
        publishedAt: article.publishedAt,
        summary: article.description,
      }));

    console.log(`Found ${newsArticles.length} news articles.`);
    return newsArticles;

  } catch (error) {
    console.error("Failed to fetch news:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to fetch news: ${error.message}`);
    }
    throw new Error('An unknown error occurred while fetching news.');
  }
};