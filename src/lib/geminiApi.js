import { GoogleGenAI } from "@google/genai";

const geminiapi = new GoogleGenAI({
  apiKey: process.env.GEMINI_APIKEY,
});

export default async function parseWorkoutplan(planText) {
  if (!process.env.GEMINI_APIKEY) {
    throw new Error("GEMINI_APIKEY environment variable is not set in .env.local");
  }

  const prompt1 = `
You are a fitness data parser. Convert the following workout plan into clean JSON.

Rules:
- Output ONLY valid JSON, no explanation, no markdown code fences.
- Structure must be an array of day objects, like this:

[
  {
    "day": "Monday",
    "category": "Chest/Triceps",
    "exercises": [
      { "name": "Bench Press", "sets": 4, "reps": 8, "weight": 80, "unit": "kg" }
    ]
  }
]

- "day" must be a real weekday name (Monday, Tuesday, etc.)
- "sets" and "reps" must be numbers, not strings.
- "weight" must be a number (no "kg" inside the value itself).
- If a rep range is given (e.g. "8-10"), use the lower number.
- If no weight is specified, set "weight" to null.

Workout plan to parse:
"""
${planText}
"""
`;
  let lastError;

  for (const model of ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"]) {
    try {
      const res = await geminiapi.models.generateContent({
        model,
        contents: prompt1,
        config: { temperature: 0.2 },
      });

      const rawText = res.text;
      if (!rawText) {
        lastError = new Error(`Gemini ${model} returned empty response`);
        continue;
      }

      const cleanres = rawText.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleanres);
      return parsed;
    } catch (error) {
      lastError = error;
    }
  }

  throw new Error(
    `Failed to parse plan with Gemini: ${lastError?.message || "unknown error"}`
  );
}
