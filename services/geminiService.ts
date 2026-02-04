import { UserInput, CalculatedMetrics } from "../types";

// OpenRouter Configuration
const API_KEY = "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";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
// Using a reliable model via OpenRouter (Gemini 2.0 Pro Experimental Free)
const MODEL = "google/gemini-2.0-pro-exp-02-05:free"; 

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
        "HTTP-Referer": typeof window !== 'undefined' ? window.location.origin : "https://nogoofup-rank-predictor.com",
        "X-Title": "nogoofup Rank Predictor",
      },
      body: JSON.stringify({
        "model": MODEL,
        "messages": [
          {"role": "user", "content": prompt}
        ]
      })
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error(`OpenRouter API Error: ${response.status} ${response.statusText}`, errorText);
        return "AI analysis is currently experiencing high traffic. Please refer to the rank and college predictions below.";
    }

    const data = await response.json();
    
    if (data.error) {
        console.error("OpenRouter API Error Response:", data.error);
        return "AI analysis unavailable due to service limits.";
    }

    return data.choices?.[0]?.message?.content || "Analysis currently unavailable.";

  } catch (error) {
    console.error("AI Service Error:", error);
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
          
          Strictly output valid JSON only. No markdown formatting. No code blocks.
          
          Format: Array of objects with keys: "name", "branch", "probability" (High/Medium/Low).
          Example: [{"name": "NIT Trichy", "branch": "Civil", "probability": "Low"}]
        `;

        const response = await fetch(OPENROUTER_URL, {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${API_KEY}`,
              "Content-Type": "application/json",
              "HTTP-Referer": typeof window !== 'undefined' ? window.location.origin : "https://nogoofup-rank-predictor.com",
              "X-Title": "nogoofup Rank Predictor",
            },
            body: JSON.stringify({
              "model": MODEL,
              "messages": [
                {"role": "user", "content": prompt}
              ]
            })
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`College List API Error: ${response.status}`, errorText);
            return [];
        }

        const data = await response.json();
        
        if (data.error) {
             console.error("OpenRouter API Error (Colleges):", data.error);
             return [];
        }

        const text = data.choices?.[0]?.message?.content;
        
        if (!text) return [];

        // Aggressive cleanup to ensure JSON parsing works
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        
        try {
            const parsed = JSON.parse(cleanText);
            // Handle wrapper object if present
            if (!Array.isArray(parsed) && parsed.colleges && Array.isArray(parsed.colleges)) {
                return parsed.colleges;
            }
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            console.error("JSON Parsing failed for colleges", e);
            return [];
        }
    } catch (e) {
        console.error("College fetch error", e);
        return [];
    }
}