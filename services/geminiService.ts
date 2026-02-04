import { UserInput, CalculatedMetrics } from "../types";

const API_KEY = "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";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "google/gemini-2.0-flash-lite-preview-02-05:free"; // High speed, free tier model

export const getAIAnalysis = async (
  input: UserInput,
  metrics: CalculatedMetrics
): Promise<string> => {
  try {
    const prompt = `
      Act as an expert JEE Main Counselor.
      
      Student Profile:
      - Total Marks: ${input.totalMarks}/300
      - Breakdown: Physics: ${input.marks.physics}, Chemistry: ${input.marks.chemistry}, Maths: ${input.marks.maths}
      - Category: ${input.category}
      - Home State: ${input.state}
      - Estimated Percentile: ${metrics.percentile.toFixed(2)}
      - Estimated All India Rank (AIR): ${metrics.rank}
      - Estimated Category Rank: ${metrics.categoryRank}

      Task:
      Provide a concise, encouraging, and realistic analysis (max 200 words).
      1. Briefly comment on the difficulty of getting top tier NITs/IIITs with this rank for their category.
      2. Analyze their subject performance (e.g., if Maths is low, suggest improvement there for Advanced).
      3. Suggest 2-3 specific strategic options.
      4. Do NOT output JSON. Output simple Markdown text.
    `;

    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": window.location.origin,
        "X-Title": "nogoofup Rank Predictor",
      },
      body: JSON.stringify({
        "model": MODEL,
        "messages": [
          {"role": "user", "content": prompt}
        ]
      })
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "Analysis currently unavailable.";

  } catch (error) {
    console.error("OpenRouter API Error:", error);
    return "AI analysis could not be generated at this time. Please rely on the mathematical rank prediction below.";
  }
};

export const getCollegeList = async (
  input: UserInput,
  metrics: CalculatedMetrics
): Promise<any[]> => {
    try {
        const prompt = `
          Based on JEE Main Rank ${metrics.rank} (AIR) and Category Rank ${metrics.categoryRank} (${input.category}), generate a JSON list of 5 likely college options.
          Consider Home State Quota for ${input.state}.
          Format: Array of objects with keys: "name", "branch", "probability" (High/Medium/Low).
          Return ONLY valid JSON. Do not use markdown code blocks. Just the raw JSON array.
        `;

        const response = await fetch(OPENROUTER_URL, {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${API_KEY}`,
              "Content-Type": "application/json",
              "HTTP-Referer": window.location.origin,
              "X-Title": "nogoofup Rank Predictor",
            },
            body: JSON.stringify({
              "model": MODEL,
              "messages": [
                {"role": "user", "content": prompt}
              ]
            })
        });
        
        const data = await response.json();
        const text = data.choices?.[0]?.message?.content;
        
        if (!text) return [];

        // Simple cleanup if the model adds markdown
        const cleanText = text.replace(/```json\n?|```/g, '').trim();
        
        try {
            const parsed = JSON.parse(cleanText);
            // Handle if it returns { "colleges": [...] }
            if (!Array.isArray(parsed) && parsed.colleges && Array.isArray(parsed.colleges)) {
                return parsed.colleges;
            }
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            console.error("JSON Parsing failed", e);
            return [];
        }
    } catch (e) {
        console.error("College fetch error", e);
        return [];
    }
}