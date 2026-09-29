const Groq = require('groq-sdk');

const generateItineraryWithGroq = async (input) => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not configured in server environment variables.');
  }

  const groq = new Groq({ apiKey });
  const model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

  const prompt = `Generate a realistic travel itinerary and expense breakdown in JSON format for:
- Destination: ${input.destination}
- Number of Days: ${input.days}
- Travellers: ${input.travellers}
- Total Budget: ₹${input.totalBudget} INR
- Accommodation Preference: ${input.accommodation}
- Interests: ${input.interests.join(', ')}

Strict JSON object schema to output:
{
  "tripTitle": "String",
  "summary": "String",
  "itinerary": [
    {
      "day": 1,
      "title": "String",
      "morning": "String",
      "afternoon": "String",
      "evening": "String",
      "foodSuggestion": "String",
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
  "travelTips": ["Tip 1", "Tip 2"]
}

Ensure numeric values are plain numbers in INR. Return exactly ${input.days} day items in the itinerary array.`;

  let responseText = '';

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an API assistant that MUST respond only with a valid JSON object matching the requested schema.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      model: model,
      temperature: 0.5,
      response_format: { type: 'json_object' }
    });

    responseText = completion.choices[0]?.message?.content || '';
  } catch (error) {
    // If strict json_object response format fails on Groq, retry without response_format flag
    console.warn('Groq json_object mode notice, retrying without strict flag:', error.message);
    const fallbackCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an API assistant that MUST respond only with a raw JSON object without markdown code fences.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      model: model,
      temperature: 0.5
    });

    responseText = fallbackCompletion.choices[0]?.message?.content || '';
  }

  if (!responseText) {
    throw new Error('Received empty response from Groq AI service.');
  }

  // Clean potential markdown backticks or extra text
  let cleanJsonString = responseText.trim();
  const jsonMatch = cleanJsonString.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    cleanJsonString = jsonMatch[0];
  }

  try {
    const parsedData = JSON.parse(cleanJsonString);
    return parsedData;
  } catch (err) {
    console.error('Groq Output JSON Parse Error:', cleanJsonString);
    throw new Error('AI generated invalid JSON format. Please click Generate again.');
  }
};

module.exports = { generateItineraryWithGroq };
