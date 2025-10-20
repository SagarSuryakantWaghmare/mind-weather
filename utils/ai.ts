import { GoogleGenerativeAI } from "@google/generative-ai";
import { summarizationMiddleware } from "langchain";
import z from "zod";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

const parser = z.object({
  mood: z.string().describe("The mood of the journal entry, e.g., happy, sad, angry, etc."),
  summary: z.string().describe("A brief summary of the journal entry."),
  subject: z.string().describe("The subject of the journal entry, e.g., work, personal, etc."),
  color: z.string().describe("A hexadecimal color code representing the mood, e.g., #FF5733 for happy."),
  negative: z.boolean().describe("Whether any negative aspects are mentioned in the entry."),
});

const getPrompt = (content: string) => {
  return `
You are a journal entry analyzer. Please analyze the following entry and extract the relevant information as a valid JSON object matching this schema:
${JSON.stringify(parser.shape, null, 2)}
Journal Entry: ${content}
Return ONLY the JSON object.
`;
};

export const analyze = async (content: string) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const prompt = getPrompt(content);
  const result = await model.generateContent(prompt);
  let text = result.response.text();
  text = text.replace(/```json|```/g, "").trim();

  let parsed;
  try {
    parsed = JSON.parse(text);
    parsed = parser.parse(parsed);
  } catch (err) {
    console.error("Failed to parse Gemini response as JSON:", text);
    throw err;
  }
  return parsed;
};

