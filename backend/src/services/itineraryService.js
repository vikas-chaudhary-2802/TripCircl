'use strict';

const { getStyleInstructions, buildSystemPrompt, buildUserPrompt } = require('../utils/itineraryPrompts');
const env = require('../config/env');

/**
 * Streams an AI-generated itinerary from OpenAI.
 * Returns the raw Response (with readable body stream) for the controller to pipe.
 */
async function generateItinerary(params) {
  const {
    destination, country, startDate, endDate,
    travelStyle, budget, travelers, interests,
    prompt, tripPace, placeType,
  } = params;

  const NVIDIA_API_KEY = env.NVIDIA_API_KEY;
  if (!NVIDIA_API_KEY) {
    throw Object.assign(new Error('NVIDIA_API_KEY not configured.'), { statusCode: 500 });
  }

  const days = startDate && endDate
    ? Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1
    : 7;

  const numTravelers = parseInt(travelers) || 2;

  const isIndia = /india/i.test(country || '') ||
    /goa|jaipur|kerala|varanasi|manali|rishikesh|udaipur|ladakh|mumbai|delhi|bangalore|hyderabad|chennai|kolkata|agra|shimla|darjeeling|hampi|meghalaya|andaman|rajasthan|kashmir|ooty|coorg|mysore|pondicherry|amritsar|jodhpur|pushkar|alleppey|munnar|leh|nainital|mussoorie|gangtok|shillong|kodaikanal/i.test(destination || '');
  const currencySymbol = isIndia ? '₹' : '$';

  const totalBudget = budget ? parseInt(String(budget).replace(/[^0-9]/g, '')) : 0;
  const perPersonBudget = totalBudget > 0 ? Math.floor(totalBudget / numTravelers) : 0;
  const dailyBudgetPerPerson = perPersonBudget > 0 ? Math.floor(perPersonBudget / days) : 0;

  const styleInstructions = getStyleInstructions(travelStyle, totalBudget, numTravelers, currencySymbol, days);

  const systemPrompt = buildSystemPrompt({
    destination, isIndia, days, numTravelers, totalBudget, perPersonBudget,
    dailyBudgetPerPerson, currencySymbol, styleInstructions, tripPace, placeType,
  });

  const userPrompt = buildUserPrompt({
    days, destination, country, numTravelers, travelStyle, totalBudget,
    perPersonBudget, dailyBudgetPerPerson, currencySymbol,
    interests: interests || '', prompt: prompt || '',
    startDate: startDate || '', endDate: endDate || '', tripPace, placeType,
  });

  const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${NVIDIA_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'meta/llama-3.1-70b-instruct',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      stream: true,
      temperature: 0.65,
      max_tokens: 4096,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('AI gateway error:', response.status, errorText);
    if (response.status === 429) {
      throw Object.assign(new Error('Rate limited. Please try again shortly.'), { statusCode: 429 });
    }
    if (response.status === 402) {
      throw Object.assign(new Error('AI credits exhausted.'), { statusCode: 402 });
    }
    throw Object.assign(new Error('AI gateway error'), { statusCode: 502 });
  }

  return response;
}

module.exports = { generateItinerary };
