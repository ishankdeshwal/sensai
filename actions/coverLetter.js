"use server";

import  db  from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function generateCoverLetter(data) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  // Validate that user has required profile information
  if (!user.industry) {
    throw new Error("Please complete your profile with industry information first. Go to your profile settings to add your industry.");
  }

  if (!user.experience && user.experience !== 0) {
    throw new Error("Please complete your profile with experience information first. Go to your profile settings to add your experience.");
  }

  // Validate input data
  if (!data.jobTitle || !data.companyName || !data.jobDescription) {
    throw new Error("Please provide all required information: job title, company name, and job description");
  }

  const prompt = `
    Write a professional cover letter for a ${data.jobTitle} position at ${
    data.companyName
  }.
    
    About the candidate:
    - Industry: ${user.industry || "Not specified"}
    - Years of Experience: ${user.experience || 0}
    - Skills: ${user.skills?.join(", ") || "Not specified"}
    - Professional Background: ${user.bio || "Not specified"}
    
    Job Description:
    ${data.jobDescription}
    
    Requirements:
    1. Use a professional, enthusiastic tone
    2. Highlight relevant skills and experience
    3. Show understanding of the company's needs
    4. Keep it concise (max 400 words)
    5. Use proper business letter formatting in markdown
    6. Include specific examples of achievements
    7. Relate candidate's background to job requirements
    
    Format the letter in markdown.
  `;

  try {
    const response = await model.generateContent(prompt);
    const content = response.response.text();

    if (!content) {
      throw new Error("AI failed to generate content");
    }

    const coverLetter = await db.coverLetter.create({
      data: {
        content,
        jobDescription: data.jobDescription,
        companyName: data.companyName,
        jobTitle: data.jobTitle,
        userId: user.id,
      },
    });

    return coverLetter;
  } catch (error) {
    console.error("Error generating cover letter:", error);
    
    // Provide more specific error messages
    if (error.message.includes("API key")) {
      throw new Error("AI service configuration error. Please contact support.");
    } else if (error.message.includes("quota") || error.message.includes("rate limit")) {
      throw new Error("AI service is temporarily unavailable. Please try again later.");
    } else if (error.message.includes("network") || error.message.includes("fetch")) {
      throw new Error("Network error. Please check your connection and try again.");
    } else if (error.message.includes("database") || error.message.includes("prisma")) {
      throw new Error("Database error. Please try again.");
    } else {
      throw new Error("Failed to generate cover letter. Please try again.");
    }
  }
}

export async function getCoverLetters() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return await db.coverLetter.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getCoverLetter(id) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return await db.coverLetter.findUnique({
    where: {
      id,
      userId: user.id,
    },
  });
}

export async function deleteCoverLetter(id) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return await db.coverLetter.delete({
    where: {
      id,
      userId: user.id,
    },
  });
}