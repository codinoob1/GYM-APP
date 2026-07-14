import parseWorkoutplan from "@/lib/geminiApi";

export async function POST(req) {
  try {
    const { planText, planFile, prompt } = await req.json();

    let text = planText;

    if (planFile) {
      const { PDFParse } = await import("pdf-parse");
      const pdfBuffer = Buffer.from(planFile, "base64");
      const pdfData = await PDFParse(pdfBuffer);
      text = pdfData.text;
    }

    if (!text || text.trim().length === 0) {
      return Response.json(
        { error: "Plan text is required" },
        { status: 400 },
      );
    }

    const parsed = await parseWorkoutplan(text);
    let coachNotes = [];
    if (prompt) {
      const { GoogleGenAI } = await import('@google/genai');
      const gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_APIKEY });
      let response = null;

      try {
        response = await gemini.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: { temperature: 0.3 },
        });
      } catch (e) {
        console.error("gemini-error", e);
      }

      const raw = response?.text || '[]';
      const cleaned = raw.replace(/```json|```/g, '').trim();
      try {
        coachNotes = JSON.parse(cleaned);
      } catch (e) {
        console.error('coach-notes-parse-error', e);
      }
    }
    return Response.json({ plan: parsed, coachNotes });
  } catch (e) {
    console.error("parse-plan-error", e);
    return Response.json(
      { error: "Failed to create a workout plan" },
      { status: 500 },
    );
  }
}
