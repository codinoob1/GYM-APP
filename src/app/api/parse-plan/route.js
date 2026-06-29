import parseWorkoutplan from "@/lib/geminiApi";

export async function POST(req) {
  try {
    const { planText, planFile } = await req.json();

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
    return Response.json({ plan: parsed });
  } catch (e) {
    console.error("parse-plan-error", e);
    return Response.json(
      { error: "Failed to create a workout plan" },
      { status: 500 },
    );
  }
}
