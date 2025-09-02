import { GoogleGenAI, Type } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function translateText(text: string): Promise<string> {
  try {
    const prompt = `Translate the following English text to Spanish. Provide only the translation, without any additional explanations, context, or quotation marks.\n\nEnglish: "${text}"\n\nSpanish:`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.2,
        thinkingConfig: { thinkingBudget: 0 } 
      }
    });
    return response.text.trim();
  } catch (error) {
    console.error('Error in translateText:', error);
    return `[Translation Error]`;
  }
}

export async function detectQuestion(text: string): Promise<boolean> {
  try {
    const prompt = `Analyze the following English text and determine if it is a question. Respond in JSON format.\n\nText: "${text}"`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            is_question: {
              type: Type.BOOLEAN,
              description: "True if the text is a question, false otherwise."
            }
          },
          propertyOrdering: ["is_question"],
        }
      }
    });
    const result = JSON.parse(response.text);
    return result.is_question || false;
  } catch (error) {
    console.error('Error in detectQuestion:', error);
    // Default to false on error to avoid unnecessary answer generation
    return false;
  }
}

export async function generateAnswer(question: string, context?: string): Promise<string> {
  try {
    let prompt = `You are a Marco Segura a person who is applying for a job. Provide a short, concise, and clear answer to the question.
IMPORTANT: The answer MUST BE in English, even if the context or question is in another language. If the answer is found in the context in another language, translate it to English.
Do not start with phrases like "The answer is" or "Here is the answer".`;

    if (context && context.trim() !== '') {
      prompt += `\n\nUse the following context to answer the question. If the answer is not available in the context, use your general knowledge to answer. Do not state that the information wasn't in the provided context.\n---CONTEXT---\n${context.trim()}\n---END CONTEXT---`;
    }

    prompt += `\n\nQuestion: "${question}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.7,
        maxOutputTokens: 150,
        thinkingConfig: { thinkingBudget: 100 }
      }
    });
    return response.text.trim();
  } catch (error) {
    console.error('Error in generateAnswer:', error);
    return `[Could not generate an answer]`;
  }
}