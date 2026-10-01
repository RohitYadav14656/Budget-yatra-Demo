const Groq = require('groq-sdk');

const extractJson = (raw) => {
  if (!raw || typeof raw !== 'string') return '';

  let text = raw.trim();
  text = text.replace(/^\uFEFF/, '');

  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenceMatch) {
    text = fenceMatch[1].trim();
  }

  const braceStart = text.indexOf('{');
  if (braceStart === -1) return '';

  let depth = 0;
  let braceEnd = -1;
  let inString = false;
  let escapeNext = false;

  for (let i = braceStart; i < text.length; i++) {
    const ch = text[i];

    if (escapeNext) { escapeNext = false; continue; }
    if (ch === '\\' && inString) { escapeNext = true; continue; }
    if (ch === '"') { inString = !inString; continue; }
    if (inString) continue;

    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) {
        braceEnd = i;
        break;
      }
    }
  }

  if (braceEnd === -1) {
    return text.substring(braceStart);
  }

  return text.substring(braceStart, braceEnd + 1);
};

const buildPrompt = (input) => {
  return `You are a travel planning assistant. Your ONLY job is to output a single valid JSON object.

Trip details:
- Destination: ${input.destination}
- Days: ${input.days}
- Travellers: ${input.travellers}
- Total Budget: INR ${input.totalBudget}
- Accommodation: ${input.accommodation}
- Interests: ${input.interests.join(', ')}

Output EXACTLY this JSON structure with real values. Numbers must be plain integers:
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
- If "${input.destination}" is not a real place, return ONLY: {"isInvalidDestination": true}
- The itinerary array MUST have exactly ${input.days} objects (one per day).
- All cost values are plain integers in INR.
- Output ONLY the JSON object. No other text.`;
};

const callGroq = async (groq, model, prompt, useJsonMode) => {
  const options = {
    messages: [
      {
        role: 'system',
        content: 'You are a JSON-only travel planner. Output ONLY a raw JSON object. No markdown, no code fences, no explanations. Your entire response must be valid JSON parseable by JSON.parse().'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    model: model,
    temperature: 0.2,
    max_tokens: 6000
  };

  if (useJsonMode) {
    options.response_format = { type: 'json_object' };
  }

  const completion = await groq.chat.completions.create(options);
  return completion.choices[0]?.message?.content || '';
};

const generateItineraryWithGroq = async (input) => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not configured in server environment variables.');
  }

  const groq = new Groq({ apiKey });
  const primaryModel = 'qwen/qwen3.8-27b';
  const fallbackModel = 'openai/gpt-oss-120b';
  const prompt = buildPrompt(input);

  const attempt = async (model, label, useJsonMode) => {
    console.log(`[AI ATTEMPT] ${label} | model: ${model} | jsonMode: ${useJsonMode}`);
    let responseText = '';

    try {
      responseText = await callGroq(groq, model, prompt, useJsonMode);
    } catch (apiErr) {
      const errMsg = String(apiErr?.message || '');
      const isJsonModeError = apiErr?.status === 400 || errMsg.includes('response_format') || errMsg.includes('json_object');

      if (useJsonMode && isJsonModeError) {
        console.warn(`[AI] JSON mode not supported by ${model}, retrying without it...`);
        try {
          responseText = await callGroq(groq, model, prompt, false);
        } catch (retryErr) {
          console.error(`[AI] API error on ${label} retry:`, retryErr.message);
          return null;
        }
      } else {
        console.error(`[AI] API error on ${label}:`, apiErr.message);
        return null;
      }
    }

    if (!responseText) {
      console.error(`[AI] Empty response from ${model}`);
      return null;
    }

    console.log(`[AI RAW ${label}]:`, responseText.substring(0, 400));

    const cleanJson = extractJson(responseText);
    console.log(`[AI CLEAN ${label}]:`, cleanJson.substring(0, 400));

    if (!cleanJson) {
      console.error(`[AI] No JSON object found in response from ${model}`);
      return null;
    }

    try {
      const parsed = JSON.parse(cleanJson);
      console.log(`[AI PARSED KEYS]:`, Object.keys(parsed));
      return parsed;
    } catch (parseErr) {
      console.error(`[AI PARSE FAILED ${label}]:`, parseErr.message);
      console.error(`[AI BAD JSON SNIPPET]:`, cleanJson.substring(0, 600));
      return null;
    }
  };

  let result = await attempt(primaryModel, 'try-1-primary', true);
  if (result) return result;

  console.warn('[AI] Try 1 failed. Retrying primary model...');
  result = await attempt(primaryModel, 'try-2-primary-retry', true);
  if (result) return result;

  console.warn('[AI] Try 2 failed. Switching to fallback model...');
  result = await attempt(fallbackModel, 'try-3-fallback', true);
  if (result) return result;

  throw new Error(
    'Unable to generate a valid itinerary at this time. Please try again in a moment.'
  );
};

module.exports = { generateItineraryWithGroq };
