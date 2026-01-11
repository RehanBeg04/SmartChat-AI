import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv"


dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const  getAnswerfromAI=async(prompt)=>{
 try{
 const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash",
 systemInstruction:`You are an AI assistant inside a real-time chat application.
Follow these rules strictly:
- Give short and clear answers (2–5 lines max).
- Use simple language, no complex explanations unless asked.
- Be polite, friendly, and professional.
- Do NOT repeat the user’s question.
- Avoid emojis unless the user uses them first.
- If the question is unclear, ask one short clarification.
- If the answer is unknown, say “I’m not sure” instead of guessing.
- Format responses for chat (short paragraphs or bullet points).
- Focus on practical and actionable information.

Your goal is to help users quickly without wasting time.`
 });
 const result = await model.generateContent(prompt);
  return result.response.text();

}catch(error){
    if (error.status === 429) {
      throw new Error("Please Wait Sometimes too Many Attempt");
    }
    throw error;
}
}
