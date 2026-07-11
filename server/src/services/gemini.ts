import dotenv from 'dotenv';

dotenv.config();

const GROQ_API_KEY = process.env.GROQ_API_KEY || '';

if (!GROQ_API_KEY) {
  console.warn("WARNING: GROQ_API_KEY is not defined in environment variables. AI features will fallback to template responses.");
}

// Helper to check if AI is available
const isAIAvailable = () => {
  return typeof GROQ_API_KEY === 'string' && GROQ_API_KEY.length > 0;
};

// Generic Groq Chat Completion caller using native fetch
async function callGroq(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  if (!isAIAvailable()) {
    throw new Error("Groq API key not configured");
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const errorDetails = await response.text();
    throw new Error(`Groq API returned status ${response.status}: ${errorDetails}`);
  }

  const result = (await response.json()) as any;
  return result.choices?.[0]?.message?.content || '';
}

export async function generateItinerary(
  destination: string,
  days: number,
  groupType: string,
  theme: string
): Promise<string> {
  if (!isAIAvailable()) {
    return generateMockItinerary(destination, days, groupType, theme);
  }

  try {
    const system = "You are a world-class AI Travel Planner named 'Let's Travel World AI'. Make all plans robust, beautiful, and in markdown format.";
    const prompt = `Generate a highly detailed, professional, day-by-day travel itinerary for:
Destination: ${destination}
Duration: ${days} Days
Travel Style/Theme: ${theme}
Group Type: ${groupType}

Please output the itinerary in clear, beautiful Markdown. Include:
1. An overview summary of the trip.
2. For each day, provide a theme/focus and 3-4 specific activities (morning, afternoon, evening) with estimated times and locations.
3. Recommendations for local food to try.
4. Essential travel tips (packing, safety, cultural etiquette, transit).
Make it feel like a premium experience.`;

    return await callGroq(system, prompt);
  } catch (error: any) {
    console.error("Error in Groq generateItinerary:", error);
    return `### AI Itinerary Generator (Offline Fallback)\n\nWe encountered an error contacting the AI service: ${error.message}. Here is a fallback plan for **${destination}** (${days} Days - ${theme} for ${groupType}):\n\n` + generateMockItinerary(destination, days, groupType, theme);
  }
}

export async function generateBudgetPlan(
  destination: string,
  days: number,
  people: number,
  budgetLevel: string
): Promise<string> {
  if (!isAIAvailable()) {
    return generateMockBudget(destination, days, people, budgetLevel);
  }

  try {
    const system = "You are an expert AI Travel Budget Planner for 'Let's Travel World'. Make all budget breakdowns detailed and output in markdown.";
    const prompt = `Create a detailed budget breakdown for:
Destination: ${destination}
Duration: ${days} Days
Travelers: ${people} Person(s)
Budget Tier: ${budgetLevel} (e.g. Budget, Moderate, Luxury, Backpacking)

Format your response in beautiful Markdown, including:
1. Overall Estimated Budget in USD ($) and local currency.
2. Category Breakdowns (with estimated numbers and percentages):
   - Hotels & Accommodations
   - Transport (flights/local transit)
   - Food & Dining
   - Activities & Entry Fees
   - Emergency buffer & Shopping
3. Daily Spending Budget recommendation.
4. Smart cost-saving tips specifically tailored for ${destination}.
Include a markdown table showing the summary.`;

    return await callGroq(system, prompt);
  } catch (error: any) {
    console.error("Error in Groq generateBudgetPlan:", error);
    return `### AI Budget Planner (Offline Fallback)\n\nAn error occurred: ${error.message}.\n\n` + generateMockBudget(destination, days, people, budgetLevel);
  }
}

export async function chatTravelAssistant(
  history: { role: 'user' | 'model'; parts: string }[],
  message: string
): Promise<string> {
  if (!isAIAvailable()) {
    return `Hello! 👋 I am Let's Travel World AI, currently running in simulation mode (Groq API key not connected). Ask me about global travel, and I'll do my best to help. Currently simulating answers for: "${message}".`;
  }

  try {
    const messages = history.map(h => ({
      role: h.role === 'user' ? 'user' : 'assistant',
      content: h.parts
    }));

    // Add current user query
    messages.push({ role: 'user', content: message });

    const systemPrompt = "You are 'Let's Travel World AI' — the most advanced global travel assistant. Your tone is elegant, helpful, enthusiastic, and sophisticated (like a combination of Apple Geniuses and professional global explorers). Give direct, structured, beautifully formatted markdown answers including bullet points, emojis, and styling where applicable. Suggest hidden gems, local foods, emergency numbers, or currency info whenever relevant.";

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Groq status ${response.status}: ${errText}`);
    }

    const result = (await response.json()) as any;
    return result.choices?.[0]?.message?.content || '';
  } catch (error: any) {
    console.error("Error in Groq chatTravelAssistant:", error);
    return `I apologize. I hit a small snag processing that request. (${error.message}). Ask me something else, or try again in a few moments!`;
  }
}

// Fallbacks
function generateMockItinerary(destination: string, days: number, group: string, theme: string): string {
  let itinerary = `## Custom Itinerary: ${destination} (${days} Days - ${theme})\n`;
  itinerary += `**Style:** ${theme} | **Group:** ${group}\n\n`;
  itinerary += `### Trip Overview\nEnjoy an incredible experience in **${destination}** tailored to your preferred style: *${theme}*. This day-by-day plan covers must-see highlights and local food spots.\n\n`;
  
  for (let i = 1; i <= Math.min(days, 5); i++) {
    itinerary += `### Day ${i}: Exploring ${destination} Highlights\n`;
    itinerary += `- **09:00 AM** — Start your day with local breakfast at a recommended neighborhood café.\n`;
    itinerary += `- **10:30 AM** — Visit the primary historical landmarks and monuments in the area.\n`;
    itinerary += `- **01:30 PM** — Lunch featuring traditional local cuisine.\n`;
    itinerary += `- **03:00 PM** — Guided walking tour or museum exploration.\n`;
    itinerary += `- **07:30 PM** — Sunset viewing, dinner at a rooftop garden or seaside tavern.\n\n`;
  }
  if (days > 5) {
    itinerary += `*Note: Days 6 to ${days} follow custom regional excursions, relaxation, and shopping paths.*`;
  }
  return itinerary;
}

function generateMockBudget(destination: string, days: number, people: number, level: string): string {
  const multipliers: Record<string, number> = { budget: 50, moderate: 120, luxury: 350, backpacking: 30 };
  const dailyRate = multipliers[level.toLowerCase()] || 100;
  const total = dailyRate * days * people;
  
  return `## Travel Budget Plan: ${destination} (${level})\n` +
         `**Duration:** ${days} Days | **Travelers:** ${people}\n\n` +
         `### Budget Summary Table\n` +
         `| Category | Percentage | Estimated Cost | Details |\n` +
         `| :--- | :---: | :---: | :--- |\n` +
         `| **Accommodation** | 40% | $${(total * 0.4).toFixed(0)} | Hotels, resorts, or cozy cabins |\n` +
         `| **Food & Drinks** | 25% | $${(total * 0.25).toFixed(0)} | Local markets, street food & bistros |\n` +
         `| **Transportation** | 20% | $${(total * 0.20).toFixed(0)} | Taxis, trains, or metro passes |\n` +
         `| **Activities & Sightseeing** | 10% | $${(total * 0.1).toFixed(0)} | Museum passes, entry tickets |\n` +
         `| **Emergency / Shopping** | 5% | $${(total * 0.05).toFixed(0)} | Souvenirs & backup funds |\n` +
         `| **TOTAL** | **100%** | **$${total.toFixed(0)}** | **Total estimated trip cost** |\n\n` +
         `### Daily Budget recommendation\n` +
         `* **Estimated Daily Expense:** $${(total / days).toFixed(0)} / day (for ${people} people)\n\n` +
         `### Savings Tips in ${destination}\n` +
         `1. Purchase a city transport pass for unlimited rides on the metro/buses.\n` +
         `2. Dine at local street markets for authentic flavors at a fraction of restaurant costs.\n` +
         `3. Book attraction tickets online in advance to secure discounts and avoid queuing.`;
}

export async function generateHotelDetails(hotelName: string): Promise<string> {
  if (!isAIAvailable()) {
    return `### Stays Intelligence Fallback // ${hotelName}\n\nRunning in local simulation mode. This is a fallback dossier for **${hotelName}**.\n\n* **Location**: Global Gateway\n* **Estimated Price**: $250 / night\n* **Amenities**: Highspeed Wifi, Room service, Gym, Indoor Pool.\n* **Overview**: A beautiful resort property offering comfortable stays with modern aesthetics, ideal for business and leisure travelers alike.`;
  }

  try {
    const system = "You are an expert Stays Analyst for 'Let's Travel World'. Make all hotel dossiers elegant, detailed, and formatted in markdown.";
    const prompt = `Create a comprehensive, luxury lodging dossier for the hotel: "${hotelName}".

Format your response in beautiful Markdown, including:
1. **Dossier Overview**: 2-3 sentences describing the hotel's style, location, and history.
2. **Key Telemetry Details**:
   - Location & Address
   - Estimated Price Index ($ USD / night)
   - Category (e.g., Luxury, Boutique, Hostels, Resort, Heritage, Eco-lodge)
   - Star Rating (e.g. 4.8 / 5.0)
3. **Primary Amenities & Facilities** (bullet list with brief details: Pool, Gym, Dining, etc.)
4. **Room Options & Scenic Views**
5. **Pros & Cons** (at least 3 pros and 2 cons)
6. **Sightseeing Highlights Nearby**
Make it read like a premium dossier from Apple/Vision Pro and Airbnb guidebooks.`;

    return await callGroq(system, prompt);
  } catch (error: any) {
    console.error("Error in Groq generateHotelDetails:", error);
    return `### AI Stays Intelligence Error\n\nFailed to compile lodging dossier: ${error.message}.\n\n` +
           `Fallback for **${hotelName}**: estimated price $180/night, 4.5 Stars. WiFi & Pool included.`;
  }
}

export async function generateRouteDetails(origin: string, destination: string, mode: string): Promise<string> {
  if (!isAIAvailable()) {
    return `### Route Intel Fallback // ${origin} ➔ ${destination}\n\nRunning in local simulation mode. Fallback route dossier:\n\n* **Estimated Distance**: 268 km\n* **Est. Travel Time**: 4.5 Hours\n* **Highlights**: Beautiful highway views, local villages along the way.\n* **Sightseeing Stops**: Recommended rest stops and local food stalls every 80 km.`;
  }

  try {
    const system = "You are a Route Intelligence Analyst for 'Let's Travel World'. Make all route dossiers highly detailed, structured, and formatted in markdown.";
    const prompt = `Analyze the travel route from: "${origin}" to "${destination}" using transport mode: "${mode}".

Format your response in beautiful Markdown, including:
1. **Route Overview**: High-level description of the transit path.
2. **Estimated Parameters**: Distance in km, Travel Time, and estimated Fuel/Transit Cost.
3. **Recommended Scenic Pitstops**: 3-4 notable sightseeing points, natural parks, or local historical villages along the route.
4. **Local Street Foods & Diners**: Food stops to try during rest intervals.
5. **Transit Safety Advice**: Road/traffic quality, weather tips, and travel suggestions.
Make it look like a highly detailed navigation dossier.`;

    return await callGroq(system, prompt);
  } catch (error: any) {
    console.error("Error in Groq generateRouteDetails:", error);
    return `### AI Route Intel Error\n\nFailed to compile route telemetry: ${error.message}.`;
  }
}
