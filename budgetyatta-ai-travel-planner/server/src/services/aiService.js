const Groq = require('groq-sdk');

const generateItineraryWithGroq = async (input) => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not configured in server environment variables.');
  }

  const groq = new Groq({ apiKey });
  const model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

  const prompt = `You are a practical, budget-savvy Indian travel expert helper.
Generate a realistic travel itinerary and expense breakdown for:
- Destination: ${input.destination}
- Number of Days: ${input.days}
- Travellers: ${input.travellers}
- Total Budget: ₹${input.totalBudget} INR
- Accommodation Preference: ${input.accommodation}
- Interests: ${input.interests.join(', ')}

IMPORTANT RULES:
1. Return strictly a JSON object. Do not include markdown codeblocks (\`\`\`json ... \`\`\`), backticks, or any preamble/commentary text.
2. All numeric values must be plain numbers in INR without commas or currency symbols.
3. Keep daily plans practical, realistic for India, and non-overcrowded.
4. Calculate expense breakdown realistically considering accommodation preference (${input.accommodation}) for ${input.days} days and ${input.travellers} travellers.

JSON format expected:
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

Ensure the "itinerary" array has exactly ${input.days} items (Day 1 to Day ${input.days}).`;

  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: 'You are an API that outputs strictly valid raw JSON without markdown formatting or code blocks.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    model: model,
    temperature: 0.6,
    response_format: { type: 'json_object' }
  });

  const responseText = completion.choices[0]?.message?.content;
  if (!responseText) {
    throw new Error('Received empty response from Groq AI service.');
  }

  let cleanJsonString = responseText.trim();
  if (cleanJsonString.startsWith('```')) {
    cleanJsonString = cleanJsonString.replace(/^```(json)?\n?/, '').replace(/\n?```$/, '').trim();
  }

  try {
    const parsedData = JSON.parse(cleanJsonString);
    return parsedData;
  } catch (err) {
    console.error('Groq Output JSON Parse Error:', cleanJsonString);
    throw new Error('AI generated invalid JSON structure. Please try again.');
  }
};

module.exports = { generateItineraryWithGroq };
