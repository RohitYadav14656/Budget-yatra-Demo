const Groq = require('groq-sdk');

const generateItineraryWithGroq = async (input) => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not configured in server environment variables.');
  }

  const groq = new Groq({ apiKey });
  const model = process.env.GROQ_MODEL || 'openai/gpt-oss-20b';

  const prompt = `Generate a JSON travel itinerary for the following trip. Respond ONLY with the JSON object, no other text.

Trip details:
- Destination: ${input.destination}
- Days: ${input.days}
- Travellers: ${input.travellers}
- Total Budget: INR ${input.totalBudget}
- Accommodation: ${input.accommodation}
- Interests: ${input.interests.join(', ')}

Required JSON structure (fill in real values, do not include comments):
{
  "tripTitle": "string",
  "summary": "string",
  "itinerary": [
    {
      "day": 1,
      "title": "string",
      "morning": "string",
      "afternoon": "string",
      "evening": "string",
      "foodSuggestion": "string",
      "estimatedCost": 1000
    }
  ],
  "expenseBreakdown": {
    "stay": 5000,
    "food": 3000,
    "transport": 2000,
    "activities": 1500,
    "miscellaneous": 1000
  },
  "travelTips": ["string", "string", "string"]
}

Rules:
- If "${input.destination}" is not a real place, return: {"isInvalidDestination": true}
- The itinerary array must have exactly ${input.days} objects.
- All cost values are plain numbers in INR.
- Return only the JSON object, nothing else.`;

  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: 'You output only raw JSON objects with no markdown, no code fences, no explanation.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    model: model,
    temperature: 0.3,
    max_tokens: 4096
  });

  const responseText = completion.choices[0]?.message?.content;
  if (!responseText) {
    throw new Error('Received empty response from AI service.');
  }

  console.log('[AI RAW RESPONSE]:', responseText.substring(0, 300));

  let cleanJsonString = responseText.trim();
  cleanJsonString = cleanJsonString.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

  const jsonMatch = cleanJsonString.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    cleanJsonString = jsonMatch[0];
  }

  try {
    const parsedData = JSON.parse(cleanJsonString);
    console.log('[AI PARSED KEYS]:', Object.keys(parsedData));
    return parsedData;
  } catch (err) {
    console.error('[AI JSON PARSE ERROR] Raw:', responseText.substring(0, 500));
    throw new Error('Unable to parse generated itinerary structure. Please try generating again.');
  }
};

module.exports = { generateItineraryWithGroq };
