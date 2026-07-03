
import { GoogleGenAI, Type } from '@google/genai';
import { Geolocation, DisasterType, ReliefData, ModelConfig, AgentType, CriticalAlert, AlertThresholds, WeatherData, UserReport, SocialMediaAnalysisData, RecommendationItem, SentimentAnalysis, KeyQuote, Language } from '../types';
import { logError } from './loggingService';
import { SOCIAL_MEDIA_ANALYSIS_PROMPT } from './prompts';

// Moved: const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// The responseSchema is no longer directly used in the API call for googleMaps grounding,
// but it's kept here as a reference for expected JSON structure.
const reliefDataSchema = {
    type: Type.OBJECT,
    properties: {
        summary: { type: Type.STRING, description: "A brief overview of the situation based on the assigned AI agent role." },
        prioritized_locations: {
            type: Type.ARRAY,
            description: "A list of specific locations relevant to the task.",
            items: {
                type: Type.OBJECT,
                properties: {
                    latitude: { type: Type.NUMBER, description: "The latitude of the location." },
                    longitude: { type: Type.NUMBER, description: "The longitude of the location." },
                    description: { type: Type.STRING, description: "A detailed description of the location from the perspective of the AI agent's role." },
                    priority: { type: Type.STRING, enum: ['High', 'Medium', 'Low'], description: "Priority level: 'High', 'Medium', or 'Low'." },
                    radius_km: { type: Type.NUMBER, description: "An estimated operational radius in kilometers." },
                },
                required: ["latitude", "longitude", "description", "priority", "radius_km"],
            },
        },
        recommended_actions: {
            type: Type.ARRAY,
            description: "A list of immediate, practical actions relevant to the AI agent's role.",
            items: {
                type: Type.OBJECT,
                properties: {
                    action: { type: Type.STRING, description: "The recommended action." },
                    rationale: { type: Type.STRING, description: "A one-sentence rationale for the action." },
                },
                required: ["action", "rationale"],
            },
        },
        cost_responsive_aid: {
            type: Type.ARRAY,
            description: "A list of cost-effective aid strategies relevant to the AI agent's role.",
            items: {
                type: Type.OBJECT,
                properties: {
                    suggestion: { type: Type.STRING, description: "The aid suggestion." },
                    rationale: { type: Type.STRING, description: "A one-sentence rationale for the suggestion." },
                },
                required: ["suggestion", "rationale"],
            },
        },
        historical_context: {
            type: Type.STRING,
            description: "A brief summary of past events that influence the current recommendations."
        },
    },
    required: ["summary", "prioritized_locations", "recommended_actions", "cost_responsive_aid", "historical_context"],
};

function buildPrompt(location: Geolocation, disaster: DisasterType, agent: AgentType, query: string, weatherData: WeatherData, userReports: UserReport[], activeAlerts: CriticalAlert[], alertThresholds: AlertThresholds, language: Language) {
    const targetLanguage = language === 'vi' ? 'Vietnamese' : 'English';
    
    const commonHeader = `
    **URGENT DISASTER ANALYSIS REQUEST**
    **Output Language:** ${targetLanguage}
    **Disaster Type:** ${disaster}
    **Location Context:** Near latitude ${location.latitude}, longitude ${location.longitude}.
    **User's Specific Query:** ${query || 'General assessment.'}
    **Current Weather Conditions:**
    - Description: ${weatherData.description}
    - Temperature: ${weatherData.temperature_celsius.toFixed(1)}°C
    - Wind Speed: ${weatherData.wind_speed_kph.toFixed(1)} kph
    - Precipitation: ${weatherData.precipitation_mm_per_hr.toFixed(1)} mm/hr

    **USER-DEFINED ALERT THRESHOLDS:**
    - High Temperature Warning above: ${alertThresholds.highTempWarning}°C
    - Low Temperature Warning below: ${alertThresholds.lowTempWarning}°C
    - AI Geofence Radius Multiplier: ${(alertThresholds.geofenceRadiusMultiplier * 100).toFixed(0)}% of suggested radius.
    Your analysis must consider these user-defined thresholds. For example, prioritize areas exceeding temperature warnings and adjust the scale of your recommendations based on the geofence multiplier.
  `;

    let externalAlertsSection = '';
    if (activeAlerts && activeAlerts.length > 0) {
        externalAlertsSection += `
    **OFFICIAL REAL-TIME ALERTS FOR THE AREA:**
    The following official alerts are active. This information is high-priority and must be integrated into your analysis and recommended actions.
    `;
        activeAlerts.forEach(alert => {
            externalAlertsSection += `- **[${alert.severity.toUpperCase()}]** ${alert.message}\n`;
        });
    }

    let fieldReportsSection = '';
    if (userReports && userReports.length > 0) {
        fieldReportsSection += `
    **CRITICAL REAL-TIME FIELD REPORTS FROM GROUND AGENTS:**
    You have received the following anonymous reports from agents on the ground. Use this new ground-truth information to verify, update, and prioritize your analysis. This is the most current data available.
    `;
        userReports.forEach((report, index) => {
            fieldReportsSection += `
    - **Field Report #${index + 1} at (lat: ${report.location.latitude.toFixed(4)}, lon: ${report.location.longitude.toFixed(4)}):**
      - **Description:** "${report.description}"
      ${report.photoBase64 ? `- **IMAGE ATTACHED:** You MUST analyze the following user-submitted photo. This is your highest-priority data source for this report. Your assessment of this location should be primarily based on what you see in the image.` : ''}
    `;
        });
    }

    const commonFooter = `
    Your analysis must be swift, accurate, and structured exactly as requested to ensure automated parsing.
    You must use the provided "Current Weather Conditions" to inform your analysis. High winds could spread wildfires, heavy rain can worsen floods, and low temperatures increase risks in blizzards. Your recommendations must reflect these environmental factors.
    Use Google Maps grounding to identify and provide links to relevant locations.
    
    Provide your response as a valid JSON object encapsulated within a markdown code block (e.g., \`\`\`json{...}\`\`\`). Do not include any other markdown formatting or introductory text outside of this JSON structure. The content of the JSON must be in ${targetLanguage}.
  `;

    let agentInstructions = '';
    switch (agent) {
        case AgentType.LOGISTICS_PLANNING:
            agentInstructions = `
        **Agent Role:** Logistics Planning Expert
        **Mission:** Your mission is to establish and optimize supply chains and resource allocation. Identify the most efficient routes for aid delivery, pinpoint potential locations for distribution hubs and temporary shelters, and locate the nearest critical facilities (hospitals, airports). "Prioritized Locations" should be potential hubs or critical infrastructure. "Recommended Actions" should be specific logistical directives.
      `;
            break;
        case AgentType.DAMAGE_ASSESSMENT:
            agentInstructions = `
        **Agent Role:** Damage Assessment Specialist
        **Mission:** Your mission is to analyze all available data to quantify the extent of structural and infrastructural damage. If user-provided photos are available, they are your primary source of ground truth; you **must** perform a detailed visual analysis of each image to identify specific damage to buildings, roads, bridges, and utilities. Identify critical infrastructure that is compromised (bridges, power stations, hospitals). "Prioritized Locations" should be the most heavily damaged areas identified from your visual and data analysis. "Recommended Actions" should focus on inspection, repair, and safety cordons based on the observed damage.
      `;
            break;
        case AgentType.PUBLIC_COMMUNICATIONS:
            agentInstructions = `
        **Agent Role:** Crisis Communications Manager
        **Mission:** Your mission is to draft clear, concise, and actionable public announcements. This includes evacuation notices, safety warnings, and updates on relief efforts. "Prioritized Locations" should be the communities or demographics these communications should target. "Recommended Actions" should be the drafted messages (e.g., social media posts, radio scripts). The rationale should explain the messaging strategy.
      `;
            break;
        case AgentType.GENERAL_ANALYSIS:
        default:
            agentInstructions = `
        **Agent Role:** General Disaster Relief Coordinator
        **Mission:** Your mission is to save lives by performing a broad analysis of the situation. Identify where people are in immediate danger and what their most urgent needs are. This is a general-purpose assessment to guide initial response efforts.
      `;
    }

    return `${commonHeader}\n${externalAlertsSection}\n${fieldReportsSection}\n${agentInstructions}\n${commonFooter}`;
}

export const fetchReliefData = async (
  location: Geolocation,
  disaster: DisasterType,
  agent: AgentType,
  query: string,
  weatherData: WeatherData,
  modelConfig: ModelConfig,
  activeAlerts: CriticalAlert[],
  alertThresholds: AlertThresholds,
  userReports: UserReport[],
  language: Language
): Promise<ReliefData> => {
  try {
    // CRITICAL FIX: Instantiate GoogleGenAI right before the API call.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    // Per user request, exclusively use gemini-2.5-flash with Google Maps grounding.
    const modelName = 'gemini-2.5-flash';
    
    const prompt = buildPrompt(location, disaster, agent, query, weatherData, userReports, activeAlerts, alertThresholds, language);
    const textPart = { text: prompt };
    const imageParts = userReports
      .filter(r => r.photoBase64 && r.photoMimeType)
      .map(r => ({ inlineData: { data: r.photoBase64!, mimeType: r.photoMimeType! } }));
    
    const response = await ai.models.generateContent({
      model: modelName,
      contents: { parts: [textPart, ...imageParts] },
      config: {
        // CRITICAL FIX: responseMimeType and responseSchema are incompatible with the googleMaps tool.
        // The prompt still requests a JSON output, which we will parse manually.
        tools: [{ googleMaps: {} }],
        toolConfig: { retrievalConfig: { latLng: { latitude: location.latitude, longitude: location.longitude } } },
        ...modelConfig,
      },
    });

    let jsonString = response.text.trim();
    // Clean up potential markdown code fences from the response.
    if (jsonString.startsWith("```json")) {
      jsonString = jsonString.slice(7, -3).trim();
    } else if (jsonString.startsWith("```")) {
      jsonString = jsonString.slice(3, -3).trim();
    }
    
    try {
        const parsedData = JSON.parse(jsonString);
        const grounding_chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        const finalResponse = { ...parsedData, grounding_chunks, weather_info: weatherData };
        return finalResponse;
    } catch (parseError) {
        logError(parseError as Error, {
            source: 'geminiService.jsonParse',
            rawResponse: response.text,
        });
        throw new Error(`Failed to parse JSON from API. Raw text: "${response.text}"`);
    }

  } catch (error) {
    logError(error as Error, { source: 'geminiService.fetchReliefData' });
    if (error instanceof Error) {
        throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error('An unknown error occurred while contacting the Gemini API.');
  }
};

const parseSocialMediaResponse = (responseText: string): SocialMediaAnalysisData => {
    const analysis = responseText.match(/<analysis>([\s\S]*?)<\/analysis>/)?.[1].trim() ?? '';
    const recommendationsText = responseText.match(/<priority_recommendations>([\s\S]*?)<\/priority_recommendations>/)?.[1].trim() ?? '';
    const resource_allocation = responseText.match(/<resource_allocation>([\s\S]*?)<\/resource_allocation>/)?.[1].trim() ?? '';
    const sentimentText = responseText.match(/<sentiment_analysis>([\s\S]*?)<\/sentiment_analysis>/)?.[1].trim() ?? '';

    // Parse Priority Recommendations
    const recommendationItems: RecommendationItem[] = [];
    if (recommendationsText) {
        const recommendationBlocks = recommendationsText.split(/\n\s*(?=PRIORITY \d+:)/).filter(block => block.trim() !== '');

        recommendationBlocks.forEach(block => {
            const lines = block.trim().split('\n');
            const titleLine = lines.shift() || 'Untitled Priority';
            const title = titleLine.replace(/PRIORITY \d+:/, '').trim();
            
            const item: RecommendationItem = {
                title,
                location: '',
                emergency: '',
                estimated_affected: '',
                accessibility: '',
                recommended_actions: [],
            };

            let isParsingActions = false;
            const actions: string[] = [];

            lines.forEach(line => {
                const trimmedLine = line.trim();
                if (isParsingActions) {
                    if (trimmedLine) actions.push(trimmedLine.replace(/^- /, ''));
                    return;
                }
                if (trimmedLine.startsWith('Location:')) {
                    item.location = trimmedLine.substring('Location:'.length).trim();
                } else if (trimmedLine.startsWith('Emergency:')) {
                    item.emergency = trimmedLine.substring('Emergency:'.length).trim();
                } else if (trimmedLine.startsWith('Estimated Affected:')) {
                    item.estimated_affected = trimmedLine.substring('Estimated Affected:'.length).trim();
                } else if (trimmedLine.startsWith('Accessibility:')) {
                    item.accessibility = trimmedLine.substring('Accessibility:'.length).trim();
                } else if (trimmedLine.startsWith('Recommended Actions:')) {
                    isParsingActions = true;
                    const actionOnSameLine = trimmedLine.substring('Recommended Actions:'.length).trim();
                    if (actionOnSameLine) actions.push(actionOnSameLine.replace(/^- /, ''));
                }
            });
            item.recommended_actions = actions;
            recommendationItems.push(item);
        });
    }

    // Parse Sentiment Analysis
    const sentiment_analysis: SentimentAnalysis = {
        overall_sentiment: 'Neutral',
        sentiment_score: 0,
        summary: '',
        positive_themes: [],
        negative_themes: [],
        key_quotes: [],
    };

    if (sentimentText) {
        sentiment_analysis.overall_sentiment = sentimentText.match(/Overall Sentiment: (.*?)\n/)?.[1].trim() as SentimentAnalysis['overall_sentiment'] ?? 'Neutral';
        sentiment_analysis.sentiment_score = parseFloat(sentimentText.match(/Sentiment Score: (.*?)\n/)?.[1].trim() ?? '0');
        sentiment_analysis.summary = sentimentText.match(/Summary: ([\s\S]*?)(?=Positive Themes:|$)/)?.[1].trim() ?? '';
        
        const positiveThemesMatch = sentimentText.match(/Positive Themes:([\s\S]*?)(?=Negative Themes:|$)/);
        if (positiveThemesMatch) {
            sentiment_analysis.positive_themes = positiveThemesMatch[1].trim().split('\n').map(theme => theme.replace(/^- /, '').trim()).filter(Boolean);
        }

        const negativeThemesMatch = sentimentText.match(/Negative Themes:([\s\S]*?)(?=Key Quotes:|$)/);
        if (negativeThemesMatch) {
            sentiment_analysis.negative_themes = negativeThemesMatch[1].trim().split('\n').map(theme => theme.replace(/^- /, '').trim()).filter(Boolean);
        }

        const keyQuotesMatch = sentimentText.match(/Key Quotes:([\s\S]*)/);
        if (keyQuotesMatch) {
            const quoteLines = keyQuotesMatch[1].trim().split('\n').filter(Boolean);
            quoteLines.forEach(line => {
                const match = line.match(/- "([^"]+)" \(Sentiment: (Positive|Negative|Neutral)\)/);
                if (match) {
                    sentiment_analysis.key_quotes.push({
                        quote: match[1],
                        sentiment: match[2] as KeyQuote['sentiment'],
                    });
                }
            });
        }
    }

    return { analysis, priority_recommendations: recommendationItems, resource_allocation, sentiment_analysis };
};

export const fetchSocialMediaAnalysis = async (
    socialMediaData: string,
    locationData: string,
    disaster: DisasterType,
    modelConfig: ModelConfig,
    language: Language,
): Promise<SocialMediaAnalysisData> => {
    try {
        // CRITICAL FIX: Instantiate GoogleGenAI right before the API call.
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const modelName = 'gemini-2.5-pro'; // Using a more powerful model for this complex task.
        const targetLanguage = language === 'vi' ? 'Vietnamese' : 'English';
        
        let prompt = SOCIAL_MEDIA_ANALYSIS_PROMPT;
        prompt = prompt.replace('{{SOCIAL_MEDIA_DATA}}', socialMediaData);
        prompt = prompt.replace('{{LOCATION_DATA}}', locationData);
        prompt = prompt.replace('{{DISASTER_TYPE}}', disaster);
        prompt = prompt.replace(/{{LANGUAGE}}/g, targetLanguage);

        const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: {
                ...modelConfig,
            },
        });
        
        const parsedData = parseSocialMediaResponse(response.text);
        if (!parsedData.analysis && !parsedData.priority_recommendations.length && !parsedData.resource_allocation) {
            // Check if sentiment analysis is also empty
            if (!parsedData.sentiment_analysis.summary) {
                throw new Error("Failed to parse the response from the API. The format might be incorrect.");
            }
        }
        return parsedData;

    } catch (error) {
        logError(error as Error, { source: 'geminiService.fetchSocialMediaAnalysis' });
        if (error instanceof Error) {
            throw new Error(`Gemini API Error: ${error.message}`);
        }
        throw new Error('An unknown error occurred while contacting the Gemini API.');
    }
};
