import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Model configuration
const MODEL_NAME = "gemini-2.5-flash";

export const tailorResume = async (baseResume: string, jobDescription: string): Promise<string> => {
  try {
    const prompt = `
      תפקידך הוא להיות יועץ קריירה מומחה.
      אנא שכתב את קורות החיים הבאים כדי שיתאימו בצורה מושלמת לתיאור המשרה המצורף.
      
      הנחיות:
      1. הדגש מיומנויות שמופיעות בתיאור המשרה.
      2. השתמש במילות מפתח מתוך תיאור המשרה.
      3. שמור על טון מקצועי ואותנטי.
      4. אל תמציא עובדות, אלא נסח מחדש את הניסיון הקיים.
      5. הפלט צריך להיות בפורמט Markdown נקי ומוכן להעתקה.

      קורות החיים המקוריים:
      ${baseResume}

      תיאור המשרה:
      ${jobDescription}
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: { parts: [{ text: prompt }] },
      config: {
        temperature: 0.7,
      }
    });

    return response.text || "לא הצלחתי לייצר קורות חיים, אנא נסה שוב.";
  } catch (error) {
    console.error("Error tailoring resume:", error);
    throw new Error("שגיאה ביצירת קורות חיים מותאמים.");
  }
};

export const analyzeJobMatch = async (resume: string, jobDescription: string): Promise<{ score: number, reasoning: string }> => {
  try {
    // We use responseMimeType: "application/json" without responseSchema to avoid potential proxy issues with strict schema validation
    const prompt = `
      Analyze the match between the resume and the job description.
      Return a VALID JSON object with the following structure:
      {
        "score": number, // A match score between 0 and 100
        "reasoning": string // Short explanation in Hebrew why it fits or misses
      }
      
      Resume:
      ${resume.substring(0, 4000)}

      Job Description:
      ${jobDescription.substring(0, 4000)}
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: { parts: [{ text: prompt }] },
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text;
    if (!text) return { score: 0, reasoning: "Error analyzing: No response text" };
    
    try {
      return JSON.parse(text);
    } catch (e) {
      console.error("Failed to parse JSON", text);
      return { score: 0, reasoning: "Error analyzing: Invalid JSON response" };
    }
  } catch (error) {
    console.error("Error analyzing match:", error);
    return { score: 0, reasoning: "שגיאה בניתוח ההתאמה" };
  }
};
