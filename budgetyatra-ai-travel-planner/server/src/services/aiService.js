const Groq = require('groq-sdk');

const generateItineraryWithGroq = async (input) => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not configured in server environment variables.');
  }

  const groq = new Groq({ apiKey });
  const model = process.env.GROQ_MODEL || 'openai/gpt-oss-20b';

  const prompt = `You are a practical, budget-savvy Indian travel expert helper.
Generate a realistic travel itinerary and expense breakdown in JSON format for:
- Destination: ${input.destination}
- Number of Days: ${input.days}
- Travellers: ${input.travellers}
- Total Budget: ₹${input.totalBudget} INR
- Accommodation Preference: ${input.accommodation}
- Interests: ${input.interests.join(', ')}

Strict JSON object schema required:
{
  "tripTitle": "Catchy short trip title",
  "summary": "2-3 sentence overview of this trip tailored to budget and interests",
  "itinerary": [
    {
      "day": 1,
      "title": "Day title",
      "morning": "Morning activity description",
      "afternoon": "Afternoon activity description",
      "evening": "Evening activity description",
      "foodSuggestion": "Local budget dish or food spot recommendation",
      "estimatedCost": 1200
    }
  ],
  "expenseBreakdown": {
    "stay": 5000,
    "food": 3000,
    "transport": 2000,
    "activities": 1500,
    "miscellaneous": 1000
  },
  "travelTips": [
    "Practical money-saving tip 1",
    "Practical local travel tip 2",
    "Safety or transport tip 3"
  ]
}

IMPORTANT RULES:
1. Output ONLY a raw, valid JSON object. Do not add intro/outro text, comments, or markdown code blocks.
2. If the destination "${input.destination}" is NOT a real geographical place, city, region, or tourist destination (e.g. fake/gibberish place name), return strictly: {"isInvalidDestination": true, "message": "Invalid travel destination."}
3. All numeric values must be plain numbers in INR.
4. Ensure the "itinerary" array has exactly ${input.days} items (Day 1 to Day ${input.days}).`;

  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: 'You are an API assistant that outputs strictly valid JSON objects. Never output markdown formatting or extra text.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    model: model,
    temperature: 0.3,
    response_format: { type: 'json_object' }
  });

  const responseText = completion.choices[0]?.message?.content;
  if (!responseText) {
    throw new Error('Received empty response from AI service.');
  }

  let cleanJsonString = responseText.trim();
  cleanJsonString = cleanJsonString.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
  cleanJsonString = cleanJsonString.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');

  const jsonMatch = cleanJsonString.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    cleanJsonString = jsonMatch[0];
  }

  try {
    const parsedData = JSON.parse(cleanJsonString);
    return parsedData;
  } catch (err) {
    console.error('Output JSON Parse Error Raw Content:', responseText);
    throw new Error('Unable to parse generated itinerary structure. Please try generating again.');
  }
};

module.exports = { generateItineraryWithGroq };
