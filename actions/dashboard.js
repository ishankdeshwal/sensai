"use server";

import { auth } from "@clerk/nextjs/server";
import db from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generateAIInsights = async (industry) => {
  const prompt = `
    Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
    {
      "salaryRanges": [
        { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
      ],
      "growthRate": number,
      "demandLevel": "HIGH" | "MEDIUM" | "LOW",
      "topSkills": ["skill1", "skill2", ...],
      "marketOutlook": "POSITIVE" | "NEUTRAL" | "NEGATIVE",
      "keyTrends": ["trend1", "trend2", ...],
      "recommendedSkills": ["skill1", "skill2", ...]
    }

    IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
    Include at least 5 common roles for salary ranges.
    Growth rate should be a percentage.
    Include at least 5 skills and trends.
  `;

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const res = await model.generateContent(prompt);
      const response = res.response;
      const text = response.text();
      const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
      return JSON.parse(cleanedText);
    } catch (err) {
      console.error(`Gemini API attempt ${attempt} failed:`, err);
      if (attempt === 2) {
        return {
          salaryRanges: [
            {
              role: "Software Engineer",
              min: 70000,
              max: 150000,
              median: 110000,
              location: "USA",
            },
            {
              role: "Frontend Developer",
              min: 60000,
              max: 120000,
              median: 90000,
              location: "USA",
            },
            {
              role: "Backend Developer",
              min: 75000,
              max: 140000,
              median: 105000,
              location: "USA",
            },
            {
              role: "Data Scientist",
              min: 90000,
              max: 180000,
              median: 135000,
              location: "USA",
            },
            {
              role: "DevOps Engineer",
              min: 80000,
              max: 160000,
              median: 120000,
              location: "USA",
            },
          ],
          growthRate: 12,
          demandLevel: "HIGH",
          topSkills: ["Python", "JavaScript", "Cloud Computing", "Agile", "SQL"],
          marketOutlook: "POSITIVE",
          keyTrends: [
            "AI/ML",
            "Cloud Computing",
            "DevOps",
            "Remote Work",
            "Cybersecurity",
          ],
          recommendedSkills: [
            "Docker",
            "AWS",
            "Kubernetes",
            "Soft Skills",
            "Agile",
          ],
        };
      }
    }
  }
};

export async function getIndustryInsights() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: { industryInsights: true },
  });

  if (!user) throw new Error("User not found");

  if (!user.industryInsights) {
    const industry = user.industry || "Software Engineering";
    const insights = await generateAIInsights(industry);

    const industryInsights = await db.industryInsights.upsert({
      where: { industry },
      update: {}, // optional: add logic to update old data if needed
      create: {
        industry,
        salaryRanges: insights.salaryRanges,
        growthRate: insights.growthRate,
        demandLevel: insights.demandLevel,
        topSkills: insights.topSkills,
        marketOutlook: insights.marketOutlook,
        keyTrends: insights.keyTrends,
        recommendedSkills: insights.recommendedSkills,
        nextUpdated: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    // Connect the user to the industryInsight record
    await db.user.update({
      where: { clerkUserId: userId },
      data: {
        industryInsights: {
          connect: { industry },
        },
      },
    });

    return industryInsights;
  }

  return user.industryInsights;
}
