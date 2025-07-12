"use server"
import { auth } from "@clerk/nextjs/server";
import db from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});
export async function saveResume(content){
    const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });
  if (!user) throw new Error("user not Found");
  try {
    const resume=await db.resume.upsert({
        where:{
            userId:user.id,
        },
        update:{
            content,
        },
        create:{
            userId:user.id,
            content
        }
    })
    revalidatePath("/resume")
    return resume
  } catch (error) {
    console.error("Error saving resume:",error)
    throw new Error("Failed to save resume")
  }
}

export async function getResume(){
    const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });
  if (!user) throw new Error("user not Found");
  return await db.resume.findUnique({
    where:{
        userId:user.id,
    }
  })
}

export async function improveWithAI({current,type,title,organization}){
     const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });
  if (!user) throw new Error("user not Found");
  const prompt = `
    As an expert resume writer, improve the following ${type} description for a ${user.industry} professional.
    Make it more impactful, quantifiable, and aligned with industry standards according to the ${title} and ${organization} in which the employee works.
    Current content: "${current}"

    Requirements:
    1. Use action verbs
    2. Include metrics and results where possible
    3. Highlight relevant technical skills
    4. Keep it concise but detailed
    5. Focus on achievements over responsibilities
    6. Use industry-specific keywords
    
    Format the response as a single paragraph without any additional text or explanations.
  `;
  try {
    const result=await model.generateContent(prompt);
    const res=result.response
    const improvedContent=res.text().trim()
    return improvedContent
  } catch (error) {
    console.error("Error improving content",error)
    // Instead of throwing an error, return the original content
    // This allows the user to continue using the app even when AI is unavailable
    console.log("AI service unavailable, returning original content")
    return current
  }
}