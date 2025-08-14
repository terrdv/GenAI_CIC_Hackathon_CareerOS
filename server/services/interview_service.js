import { generateQuestionsWithAI } from "../lib/interviewAI.js";

export async function llmGenerateQuestions({ types, company, role, level, questionCount }) {

  const aiResponseText = await generateQuestionsWithAI({types, company, role, level, questionCount});

  return aiResponseText;
}