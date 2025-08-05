"use server";

import { auth } from "@clerk/nextjs/server";
import db from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

export async function generateQuiz() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  
  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });
  if (!user) throw new Error("user not Found");
  
  try {
    const prompt = `
    Generate 10 technical interview questions for a ${
      user.industry
    } professional${
      user.skills?.length ? ` with expertise in ${user.skills.join(", ")}` : ""
    }.
    
    Each question should be multiple choice with 4 options.
    
    Return the response in this JSON format only, no additional text:
    {
      "questions": [
        {
          "question": "string",
          "options": ["string", "string", "string", "string"],
          "correctAnswer": "string",
          "explanation": "string"
        }
      ]
    }
  `;

    const res = await model.generateContent(prompt);
    const response = res.response;
    const text = response.text();

    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
    const quiz = JSON.parse(cleanedText);

    return quiz.questions;
  } catch (error) {
    console.error("Error generating quiz:", error);
    if (error.message.includes("API_KEY")) {
      throw new Error("Invalid or missing Gemini API key. Please check your environment variables.");
    }
    throw new Error("Failed to generate quiz questions. Please try again.");
  }
}

export async function saveQuizResult(questions, answer, score) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  
  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });
  if (!user) throw new Error("user not Found");
  
  const quesRes = questions.map((q, index) => ({
    questions: q.question,
    answer: q.correctAnswer,
    userAnswer: answer[index],
    isCorrect: q.correctAnswer === answer[index],
    explanation: q.explanation,
  }));
  
  const wrongAns = quesRes.filter((q) => !q.isCorrect);
  let improvementTip = null;
  
  if (wrongAns.length > 0) {
    const wrongQuesText = wrongAns
      .map(
        (q) =>
          `Question: "${q.question}"\nCorrect Answer:"${q.answer}"\nUser Answer:"${q.userAnswer}"`
      )
      .join("\n\n");
      
    const improvementPrompt = `
      The user got the following ${user.industry} technical interview questions wrong:

      ${wrongQuesText}

      Based on these mistakes, provide a concise, specific improvement tip.
      Focus on the knowledge gaps revealed by these wrong answers.
      Keep the response under 2 sentences and make it encouraging.
      Don't explicitly mention the mistakes, instead focus on what to learn/practice.
    `;
    
    try {
      const res = await model.generateContent(improvementPrompt);
      const response = res.response;
      improvementTip = response.text().trim();
    } catch (error) {
      console.log("Error generating improvement Tip:", error);
      improvementTip = "Focus on practicing more questions in this area to improve your skills.";
    }
  }

  try {
    const assessment = await db.assessment.create({
      data: {
        userId: user.id,
        quizScore: score,
        questions: quesRes,
        category: "Technical",
        improvementTip,
      },
    });
    return assessment;
  } catch (error) {
    console.error("Error saving quiz result:", error);
    throw new Error("Failed to save quiz result");
  }
}

export async function getAssessments(){
   const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });
  if (!user) throw new Error("user not Found");
  try {
    const assessment=await db.assessment.findMany({
      where:{
        userId:user.id,
      },orderBy:{
        createdAt:"asc"
      }

    })
    return assessment
  } catch (error) {
       console.error("Error Fetching assessments:", error);
    throw new Error("Failed to Fetch Assessments");
  }
}